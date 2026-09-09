import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import { StockService, StockLogType } from "@/features/inventory/services/StockService";
import { FinanceService, AccountType } from "@/features/billing/services/FinanceService";
import { AllocationService } from "@/features/billing/services/AllocationService";
import { calculateBillingTotals, roundTo2 } from "@/utils/financials";

export class OcrMigrationService {
  /**
   * Helper to strip OCR labels and colons/spaces from extracted string fields.
   */
  private static cleanText(val: string, blacklist: string[] = []): string {
    if (!val) return "";
    let clean = val.trim();
    
    // Remove blacklisted prefix labels (case-insensitive)
    for (const label of blacklist) {
      const regex = new RegExp(`^\\s*${label}\\s*[:.\\-\\/]?\\s*`, "i");
      clean = clean.replace(regex, "");
    }
    
    // Also remove general leading/trailing garbage characters
    clean = clean.replace(/^[:.\\-\\/\\s,]+/, "").trim();
    
    return clean;
  }

  /**
   * Scans the 'old data invoices' directory for legacy PDFs.
   */
  static async scanFolder() {
    const dirPath = path.resolve(process.cwd(), "old data invoices");
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith(".pdf"));

    const result = [];
    for (const file of pdfFiles) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      const buffer = fs.readFileSync(filePath);
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");

      const existingInvoice = await db.invoice.findFirst({
        where: {
          OR: [
            { notes: { contains: `[PDF_HASH: ${hash}]` } },
            { invoiceNo: file.replace(".pdf", "").split("_")[1]?.replace(/\//g, "-") || "MOCK_INV_NO" }
          ],
          deletedAt: null
        }
      });

      result.push({
        filename: file,
        sizeBytes: stats.size,
        status: existingInvoice ? "IMPORTED" : "PENDING"
      });
    }

    return result;
  }

  /**
   * Helper to write structured migration audit trace logs.
   */
  private static async writeMigrationLog(
    tx: Prisma.TransactionClient,
    batchId: string | undefined,
    destinationId: string | null,
    destinationModel: string | null,
    status: "SUCCESS" | "ERROR",
    message: string
  ) {
    if (!batchId) return;
    await tx.migrationLog.create({
      data: {
        batchId,
        sourceRow: 1,
        destinationId,
        destinationModel,
        status,
        message
      }
    });
  }

  /**
   * Performs text extraction and structured parsing.
   * Uses high-precision local template matching as primary, with Gemini AI as fallback.
   */
  static async extractInvoiceData(filename: string) {
    const dirPath = path.resolve(process.cwd(), "old data invoices");
    const filePath = path.join(dirPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filename} not found.`);
    }

    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check duplicate signature
    const duplicate = await db.invoice.findFirst({
      where: { notes: { contains: `[PDF_HASH: ${hash}]` }, deletedAt: null }
    });

    const cachePath = path.join(dirPath, "extracted_cache.json");
    let cache: Record<string, any> = {};
    if (fs.existsSync(cachePath)) {
      try {
        cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      } catch (err) {
        console.error("[CACHE_LOAD_ERROR] Failed parsing cache, rewriting...", err);
      }
    }

    if (cache[hash]) {
      console.log(`[OCR_MIGRATION_CACHE_HIT] Bypassing extraction for ${filename}`);
      return {
        text: cache[hash].text,
        structured: {
          ...cache[hash].structured,
          pdfHash: hash,
          isDuplicate: !!duplicate
        }
      };
    }

    let extractedText = "";

    // 1. Direct text PDF parse
    if (filename.toLowerCase().endsWith(".pdf")) {
      try {
        const { PDFParse } = await import("pdf-parse");
        const pathModule = await import("path");
        const urlModule = await import("url");
        
        const workerAbsPath = pathModule.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
        const workerUrl = urlModule.pathToFileURL(workerAbsPath).href;
        PDFParse.setWorker(workerUrl);

        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        extractedText = result.text || "";
      } catch (err) {
        console.error("[PDF_PARSE_ERROR] Falling back...", err);
      }
    }

    // 2. Scanned OCR fallback (tesseract.js)
    if (extractedText.trim().length < 50 && !filename.toLowerCase().endsWith(".pdf")) {
      try {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng");
        const { data: { text } } = await worker.recognize(buffer);
        extractedText = text;
        await worker.terminate();
      } catch (ocrErr) {
        console.error("[OCR_FALLBACK_ERROR]", ocrErr);
      }
    }

    if (extractedText.trim().length < 10) {
      throw new Error("No readable text could be extracted from PDF.");
    }

    // 3. Extract via high-precision local regex parser
    let extractedJson = this.parseTextLocally(extractedText);

    // If local parser fails to find items, try Gemini AI fallback
    if (!extractedJson || extractedJson.items.length === 0) {
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = `
            Extract invoice details from the text below. Respond ONLY with a valid JSON object matching this schema:
            {
              "clientName": "string (name of customer/bill-to client)",
              "clientGst": "string (15 character Indian GSTIN format)",
              "clientAddress": "string (billing address line 1)",
              "clientState": "string (State, e.g. Kerala)",
              "clientPinCode": "string (6-digit PIN)",
              "invoiceNo": "string (preserve exact format, e.g. JE-B2B-01-26-27 or JE/B2B/01/26-27)",
              "date": "string (YYYY-MM-DD)",
              "ewayBill": "string (12 digit code if present, or null)",
              "vehicleNo": "string (vehicle registration number if present, or null)",
              "confidence": number (integer between 0 and 100 indicating overall AI confidence),
              "items": [
                {
                  "sku": "string (item code / SKU if present, or generate simple description-based SKU)",
                  "description": "string (product name/description)",
                  "qty": number,
                  "rate": number,
                  "taxPercent": number,
                  "hsn": "string (HSN code)"
                }
              ]
            }

            Extracted Text:
            """
            ${extractedText}
            """
          `;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });

          const resText = response.text || "{}";
          const parsed = JSON.parse(resText);
          if (parsed && parsed.invoiceNo) {
            parsed.invoiceNo = parsed.invoiceNo.replace(/\//g, "-");
          }
          extractedJson = parsed;
        } catch (aiErr) {
          console.error("[GEMINI_AI_EXTRACTION_ERROR] Falling back to regex...", aiErr);
        }
      }
    }

    // Fallback static regex extraction if both failed
    if (!extractedJson) {
      extractedJson = this.regexParseFallback(extractedText);
    }

    // Write to cache
    try {
      cache[hash] = {
        text: extractedText,
        structured: extractedJson
      };
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
    } catch (cacheErr) {
      console.error("[CACHE_SAVE_ERROR] Failed writing JSON cache file.", cacheErr);
    }

    return { 
      text: extractedText, 
      structured: { 
        ...extractedJson, 
        pdfHash: hash, 
        isDuplicate: !!duplicate 
      } 
    };
  }

  /**
   * Seeding transaction executing client creation, stock change, and ledger double-entry bookkeeping.
   */
  static async seedInvoice(tx: Prisma.TransactionClient, data: any, batchId?: string) {
    // Strict Document Validation: Prevent importing non-invoices / placeholders
    if (!data.invoiceNo || data.invoiceNo.startsWith("JE-OCR-") || !data.items || data.items.length === 0) {
      throw new Error("Validation Failed: PDF document does not contain valid structured invoice details (missing invoiceNo or items).");
    }

    // Check duplicate invoice number (idempotency)
    const dup = await tx.invoice.findFirst({
      where: { invoiceNo: data.invoiceNo, deletedAt: null }
    });
    if (dup) {
      console.log(`[SEED_INVOICE] Invoice '${data.invoiceNo}' already exists in database. Skipping.`);
      return dup;
    }

    // 1. Resolve Client (GST or fuzzy matching)
    let client = null;
    let clientMatched = false;
    if (data.clientGst) {
      client = await tx.client.findFirst({
        where: { gst: data.clientGst, deletedAt: null }
      });
    }

    if (!client) {
      client = await tx.client.findFirst({
        where: { name: { contains: data.clientName }, deletedAt: null }
      });
    }

    if (client) {
      clientMatched = true;
    } else {
      client = await tx.client.create({
        data: {
          name: data.clientName,
          gst: data.clientGst || null,
          address1: data.clientAddress || "Legacy Address Line 1",
          state: data.clientState || "Kerala",
          pinCode: data.clientPinCode || "676317",
        }
      });
      // Initialize ledger account
      await FinanceService.getPartyAccount(client.id, "CLIENT", tx);
    }

    // Write Client Audit Trail Log
    await this.writeMigrationLog(
      tx,
      batchId,
      client.id,
      "Client",
      "SUCCESS",
      clientMatched ? `Matched existing client: ${client.name}` : `Created new client: ${client.name}`
    );

    // Resolve products & items to insert
    let nextSequence;
    const match = data.invoiceNo ? data.invoiceNo.match(/(?:JE[-/]B2B[-/]|JE[-/])(\d+)/i) : null;
    if (match) {
      nextSequence = parseInt(match[1], 10);
    } else {
      nextSequence = (await tx.invoice.count()) + 1;
    }
    const itemsToCreate = [];
    const billingItems = [];

    for (const item of data.items) {
      // Resolve Product
      let product = await tx.product.findFirst({
        where: {
          OR: [
            { sku: item.sku },
            { description: item.description },
            { description: { contains: item.description } }
          ],
          deletedAt: null
        }
      });

      let productMatched = true;
      if (!product) {
        productMatched = false;
        const sku = item.sku || `PROD-${item.hsn || Date.now()}-${Math.floor(Math.random() * 1000)}`;
        product = await tx.product.create({
          data: {
            sku,
            description: item.description,
            hsn: item.hsn || null,
            sellingRate: item.rate,
            gstRate: item.taxPercent || 18,
          }
        });
        // Auto-initialize stock level
        await tx.stock.create({
          data: {
            productId: product.id,
            quantity: 0
          }
        });
      }

      // Write Product Audit Trail Log
      await this.writeMigrationLog(
        tx,
        batchId,
        product.id,
        "Product",
        "SUCCESS",
        productMatched ? `Matched existing product: ${product.description}` : `Created new product: ${product.description}`
      );

      const taxableAmount = roundTo2(item.qty * item.rate);
      const taxAmount = roundTo2((taxableAmount * (item.taxPercent || 18)) / 100);
      const totalAmount = roundTo2(taxableAmount + taxAmount);

      itemsToCreate.push({
        productId: product.id,
        description: product.description,
        hsn: product.hsn,
        qty: item.qty,
        rate: item.rate,
        taxPercent: item.taxPercent || 18,
        taxAmount,
        totalAmount,
        unit: product.unit || "NOS",
        qtyPerBox: Number(product.qtyPerBox || 0),
      });

      billingItems.push({
        qty: item.qty,
        rate: item.rate,
        taxPercent: item.taxPercent || 18
      });
    }

    const billingTotals = calculateBillingTotals(billingItems);

    // Determine Draft State: if overall confidence is below 95, import as DRAFT
    const isDraft = data.isDraft === true || (data.confidence !== undefined && data.confidence < 95);

    const notesWithHash = `${data.notes || ""}\n[PDF_HASH: ${data.pdfHash || ""}]`.trim();

    // Create Invoice
    const invoice = await tx.invoice.create({
      data: {
        clientId: client.id,
        sequenceNumber: nextSequence,
        invoiceNo: data.invoiceNo,
        date: new Date(data.date || new Date()),
        gstType: "CGST_SGST",
        subTotal: billingTotals.subTotal,
        taxTotal: billingTotals.taxTotal,
        grandTotal: billingTotals.grandTotal,
        ewayBill: data.ewayBill || null,
        vehicleNo: data.vehicleNo || null,
        isFinalized: !isDraft,
        status: isDraft ? "DRAFT" : "PAID",
        billingName: client.name,
        billingAddress1: client.address1,
        billingAddress2: client.address2 || "",
        billingState: client.state,
        billingPinCode: client.pinCode,
        billingGst: client.gst,
        notes: notesWithHash,
        lineItems: {
          create: itemsToCreate
        }
      } as any
    });

    // Write Invoice Audit Trail Log
    await this.writeMigrationLog(
      tx,
      batchId,
      invoice.id,
      "Invoice",
      "SUCCESS",
      `Created invoice: ${invoice.invoiceNo} (Status: ${invoice.status}, isFinalized: ${invoice.isFinalized})`
    );

    if (isDraft) {
      // In Draft mode, skip stock logs and financial double-entry bookkeeping
      return invoice;
    }

    // Ledger posting
    const clientAccount = await FinanceService.getPartyAccount(client.id, 'CLIENT', tx);
    const salesAccount = await FinanceService.getSystemAccount(AccountType.REVENUE, tx);
    if (!clientAccount || !salesAccount) throw new Error("Chart of Accounts accounts not initialized.");

    const entry = await FinanceService.recordTransaction(tx, {
      debitAccountId: clientAccount.id,
      creditAccountId: salesAccount.id,
      amount: invoice.grandTotal,
      referenceType: 'INVOICE',
      referenceId: invoice.id,
      description: `Sales Invoice ${invoice.invoiceNo} (OCR Seeding)`,
      date: invoice.date,
    });

    // Write Ledger Entry Audit Trail Log
    await this.writeMigrationLog(
      tx,
      batchId,
      entry.id,
      "LedgerEntry",
      "SUCCESS",
      `Generated receivables/revenue double-entry ledger postings for invoice ${invoice.invoiceNo}`
    );

    // Advance consumptions & status syncing
    await AllocationService.consumeClientAdvance(tx, client.id, invoice.id);
    await AllocationService.syncDocumentStatus(tx, invoice.id, 'INVOICE');

    // Stock adjustments
    for (const item of itemsToCreate) {
      await StockService.recordChange({
        productId: item.productId,
        type: StockLogType.REMOVE,
        quantityChange: -Number(item.qty),
        referenceId: invoice.id,
        notes: `Invoice ${invoice.invoiceNo} OCR Seeding`,
        tx
      });
    }

    // Write Stock Audit Trail Log
    await this.writeMigrationLog(
      tx,
      batchId,
      invoice.id,
      "StockLog",
      "SUCCESS",
      `Adjusted stock levels and recorded movements for invoice ${invoice.invoiceNo}`
    );

    return invoice;
  }

  /**
   * High-precision local regex-based state-machine template parser.
   * Strips OCR labels dynamically.
   */
  private static parseTextLocally(text: string) {
    const invoiceNoMatch = text.match(/(?:Invoice No|Inv No|Bill No|Voucher No)\s*[:.]?\s*([A-Za-z0-9\/-]+)/i);
    if (!invoiceNoMatch) return null;
    const invoiceNo = invoiceNoMatch[1].trim().replace(/\//g, "-");

    const dateMatch = text.match(/(?:Dated|Date|Date of Issue|Invoice Date)\s*[:.]?\s*(\d{1,2}[-/.\s](?:[A-Za-z]{3}|[0-9]{2,4})[-/.\s]\d{2,4})/i);
    let date = new Date().toISOString().split("T")[0];
    if (dateMatch) {
      const parsedDate = new Date(dateMatch[1].trim());
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split("T")[0];
      }
    }

    // Reconstruct customer details and addresses cleanly up to the GSTIN marker line
    const billToMatch = text.match(/BILL TO\s+SHIP TO\s*\r?\n([^\r\n]+)\r?\n([\s\S]+?)\r?\nGSTIN:\s*([A-Z0-9]+)/i);
    let clientName = "Legacy OCR Customer";
    let clientAddress = "Legacy Address Line 1";
    let clientGst = "";
    let clientState = "Kerala";
    let clientPinCode = "676317";

    if (billToMatch) {
      clientName = this.cleanText(billToMatch[1].trim(), ["BILL TO", "SHIP TO", "BUYER", "CONSIGNEE", "CUSTOMER", "PARTY", "M/S"]);
      
      const addressLines = billToMatch[2].split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const rawAddr = addressLines.join(", ");
      clientAddress = this.cleanText(rawAddr, ["BILLING ADDRESS", "SHIPPING ADDRESS", "ADDRESS", "BILL TO", "SHIP TO"]);
      
      clientGst = this.cleanText(billToMatch[3].trim(), ["GSTIN", "GST", "UIN", "NO", "NUMBER"]);

      const pinMatch = clientAddress.match(/\b(\d{6})\b/);
      if (pinMatch) clientPinCode = pinMatch[1];

      if (clientAddress.toLowerCase().includes("kerala")) clientState = "Kerala";
      else if (clientAddress.toLowerCase().includes("tamil nadu")) clientState = "Tamil Nadu";
      else if (clientAddress.toLowerCase().includes("karnataka")) clientState = "Karnataka";
    }

    // Regex fixes for Transport details to stop at line endings and avoid merging block headers
    const ewayMatch = text.match(/E-Way Bill:\s*([^\r\n]+)/i);
    const ewayBill = ewayMatch ? ewayMatch[1].replace(/\s/g, "") : null;

    const vehicleMatch = text.match(/Vehicle No:\s*([^\r\n]+)/i);
    let vehicleNo = vehicleMatch ? vehicleMatch[1].trim() : null;
    if (vehicleNo) {
      // Direct sanitization to ensure no header strings leak in
      vehicleNo = this.cleanText(vehicleNo, ["BILL TO", "SHIP TO", "BUYER", "CONSIGNEE", "GSTIN"]);
    }

    const roundMatch = text.match(/Rounding Off:\s*([+-]?[0-9.]+)/i);
    const roundOff = roundMatch ? parseFloat(roundMatch[1]) : 0;

    // Extract table items
    let tableText = "";
    const headerIndex = text.indexOf("Description of Goods HSN/SAC Quantity Rate per Amount");
    if (headerIndex !== -1) {
      const totalIndex = text.indexOf("Total", headerIndex);
      if (totalIndex !== -1) {
        tableText = text.substring(headerIndex + "Description of Goods HSN/SAC Quantity Rate per Amount".length, totalIndex).trim();
      }
    }

    const items = [];
    if (tableText) {
      const lines = tableText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      let currentItem: any = null;

      for (const line of lines) {
        const nextExpectedSl = currentItem ? currentItem.sl + 1 : 1;
        const slMatch = line.match(/^(\d{1,2})\s+(.*)/);
        
        if (slMatch && parseInt(slMatch[1]) === nextExpectedSl) {
          if (currentItem) items.push(currentItem);
          currentItem = {
            sl: parseInt(slMatch[1]),
            descParts: [],
            hsn: "",
            qty: 0,
            unit: "",
            rate: 0,
            amount: 0
          };
          
          const valuesOnSameLine = slMatch[2].match(/(?:(.*?)\s+)?(\d{6,8})\s+([0-9,.]+)\s+([A-Za-z]+)\s+([0-9,.]+)\s+([A-Za-z]+)\s+([0-9,.]+)/);
          if (valuesOnSameLine) {
            if (valuesOnSameLine[1]) currentItem.descParts.push(valuesOnSameLine[1]);
            currentItem.hsn = valuesOnSameLine[2];
            currentItem.qty = parseFloat(valuesOnSameLine[3].replace(/,/g, ""));
            currentItem.unit = valuesOnSameLine[4];
            currentItem.rate = parseFloat(valuesOnSameLine[5].replace(/,/g, ""));
            currentItem.amount = parseFloat(valuesOnSameLine[7].replace(/,/g, ""));
          } else {
            currentItem.descParts.push(slMatch[2]);
          }
          continue;
        }

        if (currentItem) {
          const valuesMatch = line.match(/(?:(.*?)\s+)?(\d{6,8})\s+([0-9,.]+)\s+([A-Za-z]+)\s+([0-9,.]+)\s+([A-Za-z]+)\s+([0-9,.]+)/);
          if (valuesMatch) {
            if (valuesMatch[1] && valuesMatch[1].trim()) {
              currentItem.descParts.push(valuesMatch[1]);
            }
            currentItem.hsn = valuesMatch[2];
            currentItem.qty = parseFloat(valuesMatch[3].replace(/,/g, ""));
            currentItem.unit = valuesMatch[4];
            currentItem.rate = parseFloat(valuesMatch[5].replace(/,/g, ""));
            currentItem.amount = parseFloat(valuesMatch[7].replace(/,/g, ""));
          } else {
            if (!line.toLowerCase().startsWith("total") && !line.toLowerCase().startsWith("hsn/sac")) {
              currentItem.descParts.push(line);
            }
          }
        }
      }
      if (currentItem) items.push(currentItem);
    }

    const parsedItems = items.map(it => {
      const desc = it.descParts.join(" ").replace(/\s+/g, " ").trim();
      const cleanDesc = this.cleanText(desc, ["DESCRIPTION OF GOODS", "DESCRIPTION", "HSN/SAC", "HSN"]);
      return {
        sku: it.hsn ? `PROD-${it.hsn}` : `PROD-GEN-${Date.now()}`,
        description: cleanDesc,
        qty: it.qty,
        rate: it.rate,
        taxPercent: 18,
        hsn: it.hsn
      };
    });

    return {
      clientName,
      clientGst,
      clientAddress,
      clientState,
      clientPinCode,
      invoiceNo,
      date,
      ewayBill,
      vehicleNo,
      roundOff,
      confidence: 98,
      items: parsedItems
    };
  }

  /**
   * Helper fallback regex extraction method when both local and AI parsers fail.
   */
  private static regexParseFallback(text: string) {
    const invoiceNoMatch = text.match(/(?:Invoice No|Inv No|Bill No|Voucher No)\s*[:.]?\s*([A-Za-z0-9\/-]+)/i);
    const invoiceNo = invoiceNoMatch ? invoiceNoMatch[1].replace(/\//g, "-") : `JE-OCR-${Date.now()}`;

    const dateMatch = text.match(/(?:Dated|Date|Date of Issue|Invoice Date)\s*[:.]?\s*(\d{1,2}[-/.\s](?:[A-Za-z]{3}|[0-9]{2,4})[-/.\s]\d{2,4})/i);
    let date = new Date().toISOString().split("T")[0];
    if (dateMatch) {
      const parsedDate = new Date(dateMatch[1].trim());
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split("T")[0];
      }
    }

    const gstMatch = text.match(/(?:GSTIN\/UIN|GSTIN|GST)\s*[:.]?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})/i);
    const clientGst = gstMatch ? gstMatch[1] : "";

    const customerMatch = text.match(/(?:M\/s|Customer Name|Client Name|Sold To|Bill To)\s*[:.]?\s*([A-Za-z0-9\s.]+)/i);
    const clientName = customerMatch ? customerMatch[1].trim() : "Legacy OCR Customer";

    const roundMatch = text.match(/Rounding Off:\s*([+-]?[0-9.]+)/i);
    const roundOff = roundMatch ? parseFloat(roundMatch[1]) : 0;

    return {
      clientName: this.cleanText(clientName, ["BILL TO", "SHIP TO", "BUYER", "CONSIGNEE", "CUSTOMER", "PARTY", "M/S"]),
      clientGst: this.cleanText(clientGst, ["GSTIN", "GST", "UIN", "NO", "NUMBER"]),
      clientAddress: "Legacy Address Line 1",
      clientState: "Kerala",
      clientPinCode: "676317",
      invoiceNo,
      date,
      ewayBill: null,
      vehicleNo: null,
      roundOff,
      confidence: 85,
      items: [
        {
          sku: "GENERIC-OCR-ITEM",
          description: "Generic Mapped OCR Item",
          qty: 1,
          rate: 1000,
          taxPercent: 18,
          hsn: "3923"
        }
      ]
    };
  }
}

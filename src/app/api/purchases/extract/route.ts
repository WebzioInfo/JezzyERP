import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { createWorker } from "tesseract.js";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        let text = "";

        if (file.type === "application/pdf") {
            // Digital PDF Extraction (Faster and more accurate for ERP bills)
            const { PDFParse } = await import('pdf-parse');
            const path = await import('path');
            const url = await import('url');
            
            // Explicitly set worker path as a file URL for Node.js/Windows compatibility
            const workerAbsPath = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
            const workerUrl = url.pathToFileURL(workerAbsPath).href;
            PDFParse.setWorker(workerUrl);


            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            text = result.text;
            console.log("[PDF_EXTRACTED_TEXT]", text.substring(0, 500));
        } else {



            // OCR Processing for Images (Explicit path resolution for Turbopack/Windows)
            const path = await import('path');
            const workerPath = path.resolve(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js');
            
            const worker = await createWorker('eng', 1, {
                workerPath: workerPath,
            });
            const { data: { text: ocrText } } = await worker.recognize(buffer);
            text = ocrText;
            await worker.terminate();
        }



        const parsedData = parseBillText(text);

        return NextResponse.json({ 
            success: true, 
            data: parsedData
        });

    } catch (error: any) {
        console.error("[EXTRACT_API_ERROR]", error);
        return NextResponse.json({ error: error.message || "Failed to process bill" }, { status: 500 });
    }
}

function parseBillText(text: string) {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    // 1. Extract GSTIN
    const gstMatch = text.match(/(?:GSTIN\/UIN|GSTIN|GST)\s*[:.]?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})/i);
    const vendorGst = gstMatch ? gstMatch[1] : (text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/)?.[0] || "");

    // 2. Extract Vendor Name & Address
    const genericHeaders = ["TAX INVOICE", "INVOICE", "CASH MEMO", "BILL", "ORIGINAL", "DUPLICATE", "ACK NO", "ACK DATE", "IRN", "ACK", "E-WAY", "E-INVOICE"];
    let vendorName = "";
    let vendorAddress = "";
    const businessSuffixes = ["PVT", "LTD", "LIMITED", "INDUSTRIES", "ENTERPRISES", "CORP", "INC", "CO", "SONS", "ASSOCIATES"];
    
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
        const line = lines[i].trim();
        const upperLine = line.toUpperCase();
        
        if (genericHeaders.some(h => upperLine.includes(h)) || 
            line.length < 3 ||
            line.includes("Page") ||
            line.match(/^[0-9\s\-]+$/) ||
            line.match(/GSTIN/i) ||
            line.match(/^[a-f0-9]{10,}$/i) ||
            line.match(/^[A-Z0-9]{10,}$/)
        ) {
            continue;
        }

        if (businessSuffixes.some(s => upperLine.includes(s)) || (!vendorName && line.length > 5)) {
            vendorName = line;
            // The next 2-3 lines are usually the address
            vendorAddress = lines.slice(i + 1, i + 4).join(", ");
            break;
        }
    }

    // 3. Extract Meta Details (Email, Phone, State, PIN)
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const vendorEmail = emailMatch ? emailMatch[0] : "";

    const phoneMatch = text.match(/(?:Contact|Phone|Mobile|Tel|Ph)\s*[:.]?\s*([0-9]{10,12})/i);
    const vendorPhone = phoneMatch ? phoneMatch[1] : (text.match(/\b\d{10}\b/)?.[0] || "");

    const pinMatch = text.match(/\b\d{6}\b/);
    const vendorPin = pinMatch ? pinMatch[0] : "";

    const stateMatch = text.match(/(?:State Name|State)\s*[:.]?\s*([A-Za-z\s]+)(?:,|$)/i);
    const vendorState = stateMatch ? stateMatch[1].trim() : "";

    // 4. Extract Invoice No (Robust heuristics for ERP/Tally layouts)
    let invoiceNo = "";
    const invKeywords = ["Invoice No", "Inv No", "Bill No", "Invoice #", "Inv #", "Inv.", "Voucher No"];
    
    // Strategy A: Direct Regex
    const directInvMatch = text.match(/(?:Invoice No|Inv No|Bill No|Voucher No)\s*[:.]?\s*([A-Za-z0-9\/-]+)/i);
    if (directInvMatch && directInvMatch[1].length > 2) {
        invoiceNo = directInvMatch[1];
    }

    // Strategy B: Proximity Search
    if (!invoiceNo) {
        for (let i = 0; i < lines.length; i++) {
            if (invKeywords.some(k => lines[i].toLowerCase().includes(k.toLowerCase()))) {
                const sameLineMatch = lines[i].match(/(?:No|#)[:.]?\s*([A-Za-z0-9\/-]+)/i);
                if (sameLineMatch && sameLineMatch[1].length > 2) {
                    invoiceNo = sameLineMatch[1];
                } else if (i + 1 < lines.length) {
                    const nextLine = lines[i+1].trim();
                    if (nextLine.match(/^[A-Za-z0-9\/-]+$/) && nextLine.length > 3) {
                        invoiceNo = nextLine;
                    }
                }
                if (invoiceNo) break;
            }
        }
    }

    // 5. Extract Date
    let date = new Date().toISOString().split('T')[0];
    const dateMatch = text.match(/(?:Dated|Date|Date of Issue|Invoice Date)\s*[:.]?\s*(\d{1,2}[-/.\s](?:[A-Za-z0-9]{2,3}|[0-9]{2,4})[-/.\s]\d{2,4})/i);
    if (dateMatch) {
        // Clean up the date string for standard ISO parsing if possible, or leave as is for UI to handle
        date = dateMatch[1].trim().replace(/\s/g, '-');
    }

    // 6. Extract E-Way Bill (12 Digit Pattern)
    const ewayMatch = text.match(/(?:E-Way Bill No|E-Way Bill|Eway No|Eway|E-Way)\s*[:.]?\s*(\d{12})/i);
    const ewayBill = ewayMatch ? ewayMatch[1] : "";

    // 6. Extract Line Items (Tally/Standard ERP Layout)
    const items: any[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const tallyPattern = /^(\d+)\s+(.+?)\s+([\d,.]+)\s+(\w+)\s+([\d,.]+)\s+([\d,.]+)\s+(\w+)\s+(\d{4,8})$/;
        const match = line.match(tallyPattern);
        
        if (match) {
            const [_, sl, desc, amount, per, rate, qty, unit, hsn] = match;
            items.push({
                description: desc.trim(),
                hsn: hsn,
                qty: parseFloat(qty.replace(/,/g, '')),
                rate: parseFloat(rate.replace(/,/g, '')),
                amount: parseFloat(amount.replace(/,/g, ''))
            });
        } else {
            const simpleMatch = line.match(/^(.*?)\s+(\d+)\s+([\d,.]+)\s+([\d,.]+)$/);
            if (simpleMatch && !line.includes("Total") && !line.includes("Amount")) {
                const [_, desc, qty, rate, total] = simpleMatch;
                items.push({
                    description: desc.trim(),
                    hsn: "",
                    qty: parseFloat(qty),
                    rate: parseFloat(rate.replace(/,/g, '')),
                    amount: parseFloat(total.replace(/,/g, ''))
                });
            }
        }
    }

    return {
        vendorName,
        vendorGst,
        vendorAddress,
        vendorEmail,
        vendorPhone,
        vendorPin,
        vendorState,
        invoiceNo,
        date,
        ewayBill,
        items: items.length > 0 ? items : []
    };
}

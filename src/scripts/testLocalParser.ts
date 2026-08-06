import fs from "fs";
import path from "path";

async function testParser() {
  console.log("================ TESTING LOCAL INVOICE PARSER ================");
  const dirPath = path.resolve(process.cwd(), "old data invoices");
  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith(".pdf"));

  const { PDFParse } = await import("pdf-parse");
  const pathModule = await import("path");
  const urlModule = await import("url");
  
  const workerAbsPath = pathModule.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  const workerUrl = urlModule.pathToFileURL(workerAbsPath).href;
  PDFParse.setWorker(workerUrl);

  let successCount = 0;

  for (const filename of files) {
    const buffer = fs.readFileSync(path.join(dirPath, filename));
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text || "";

    // 1. Invoice details
    const invoiceNoMatch = text.match(/(?:Invoice No|Inv No|Bill No|Voucher No)\s*[:.]?\s*([A-Za-z0-9\/-]+)/i);
    const invoiceNo = invoiceNoMatch ? invoiceNoMatch[1].trim() : "";

    const dateMatch = text.match(/(?:Dated|Date|Date of Issue|Invoice Date)\s*[:.]?\s*(\d{1,2}[-/.\s](?:[A-Za-z]{3}|[0-9]{2,4})[-/.\s]\d{2,4})/i);
    let date = "";
    if (dateMatch) {
      const parsedDate = new Date(dateMatch[1].trim());
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split("T")[0];
      }
    }

    const billToMatch = text.match(/BILL TO\s+SHIP TO\s*\r?\n([^\r\n]+)\r?\n([^\r\n]+)\r?\n([^\r\n]+)\r?\nGSTIN:\s*([A-Z0-9]+)/i);
    let clientName = "";
    let clientGst = "";
    if (billToMatch) {
      clientName = billToMatch[1].trim();
      clientGst = billToMatch[4].trim();
    }

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

    // Post-process descriptions
    const parsedItems = items.map(it => ({
      description: it.descParts.join(" ").replace(/\s+/g, " ").trim(),
      hsn: it.hsn,
      qty: it.qty,
      unit: it.unit,
      rate: it.rate,
      amount: it.amount
    }));

    const totalCalculated = parsedItems.reduce((sum, it) => sum + (it.qty * it.rate), 0);

    console.log(`File: ${filename}`);
    console.log(`  InvNo: ${invoiceNo}, Date: ${date}`);
    console.log(`  Client: ${clientName} (GST: ${clientGst})`);
    console.log(`  Items parsed: ${parsedItems.length}, Total value calculated: Rs. ${totalCalculated}`);
    parsedItems.forEach(it => {
      console.log(`    * ${it.description} | Qty: ${it.qty} ${it.unit} | Rate: ${it.rate} | HSN: ${it.hsn}`);
    });

    if (invoiceNo && date && clientName && parsedItems.length > 0 && parsedItems.every(it => it.qty > 0 && it.rate > 0 && it.hsn)) {
      successCount++;
    } else {
      console.warn("  ⚠️ Warning: Failed to parse one or more critical fields!");
    }
  }

  console.log(`\nLocal Parser Test Results: ${successCount} / ${files.length} parsed successfully.`);
}

testParser().catch(console.error);

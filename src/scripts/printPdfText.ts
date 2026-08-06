import fs from "fs";
import path from "path";

async function printText() {
  const dirPath = path.resolve(process.cwd(), "old data invoices");
  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.log("No PDFs found.");
    return;
  }

  const { PDFParse } = await import("pdf-parse");
  const pathModule = await import("path");
  const urlModule = await import("url");
  
  const workerAbsPath = pathModule.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  const workerUrl = urlModule.pathToFileURL(workerAbsPath).href;
  PDFParse.setWorker(workerUrl);

  for (const filename of files.slice(0, 3)) {
    console.log(`\n================ TEXT OF ${filename} ================`);
    const buffer = fs.readFileSync(path.join(dirPath, filename));
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    console.log(result.text);
  }
}

printText().catch(console.error);

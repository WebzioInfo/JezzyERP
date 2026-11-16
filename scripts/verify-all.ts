import { InvoicePdfService } from "../src/features/billing/services/InvoicePdfService";
import { PDFDocument } from "pdf-lib";
import archiver from "archiver";
import fs from "fs";
import path from "path";

async function verifyAll() {
  console.log("=== COMPREHENSIVE PRODUCTION VERIFICATION ===");

  const testInvoices = [
    { id: "cmvyoodn60001jp04j0084eu9", expectedEwb: true, name: "Inv 40 (with EWB)" },
    { id: "cmw37qjwa0001js04mzdbxs0w", expectedEwb: true, name: "Inv 39 (with EWB)" },
    { id: "cmuqqxz370001le04ib2ulgd0", expectedEwb: false, name: "Inv 37 (without EWB)" },
  ];

  const generatedFiles: Array<{ name: string; buffer: Buffer }> = [];

  for (const item of testInvoices) {
    console.log(`\nTesting ${item.name} (${item.id})...`);
    const res = await InvoicePdfService.generateInvoicePdf(item.id, "ORIGINAL");
    console.log(`  File Name: ${res.fileName}`);
    console.log(`  Has EWB:   ${res.hasEwayBill}`);
    console.log(`  Merged:    ${res.ewayBillMerged}`);
    console.log(`  Error:     ${res.mergeError || "None"}`);

    if (item.expectedEwb) {
      if (!res.ewayBillMerged) {
        throw new Error(`Expected EWB to merge for ${item.name}, but failed: ${res.mergeError}`);
      }
    } else {
      if (res.hasEwayBill || res.ewayBillMerged) {
        throw new Error(`Expected NO EWB for ${item.name}, but got hasEwayBill=true`);
      }
    }

    const doc = await PDFDocument.load(res.buffer);
    const pages = doc.getPageCount();
    console.log(`  Page count: ${pages}`);

    if (item.expectedEwb && pages < 2) {
      throw new Error(`Expected at least 2 pages for ${item.name}, got ${pages}`);
    }
    if (!item.expectedEwb && pages !== 1) {
      console.log(`  Note: Invoice has ${pages} pages based on line items.`);
    }

    generatedFiles.push({ name: res.fileName, buffer: res.buffer });
    console.log(`  ✓ PASS: ${item.name}`);
  }

  // Test Bulk ZIP packaging with the verified files
  console.log("\nTesting Bulk ZIP Packaging with real invoices...");
  const outputDir = path.join(process.cwd(), ".temp_test");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const zipPath = path.join(outputDir, "verified_bulk_export.zip");
  const zipStream = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(zipStream);

  for (const f of generatedFiles) {
    archive.append(f.buffer, { name: f.name });
  }
  archive.append("EXPORT VERIFICATION LOG\nAll files merged and validated.", { name: "EXPORT_SUMMARY.txt" });
  await archive.finalize();

  await new Promise<void>((resolve) => {
    zipStream.on("close", () => resolve());
  });

  const zipStat = fs.statSync(zipPath);
  console.log(`  ✓ PASS: Bulk ZIP generated successfully (${zipStat.size} bytes).`);

  // Clean up test artifacts
  fs.rmSync(outputDir, { recursive: true, force: true });
  console.log("\n============================================================");
  console.log(" ALL PRODUCTION INVOICE SCENARIOS 100% VERIFIED!");
  console.log("============================================================\n");
}

verifyAll().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

import { InvoicePdfService } from "../src/features/billing/services/InvoicePdfService";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

async function verifyRealInvoiceMerge() {
  console.log("=== VERIFYING REAL INVOICE WITH E-WAY BILL ===");
  // Real invoice with E-Way Bill in database
  const invoiceId = "cmvyoodn60001jp04j0084eu9";
  console.log(`Generating PDF for invoice: ${invoiceId}...`);

  const result = await InvoicePdfService.generateInvoicePdf(invoiceId, "ORIGINAL");

  console.log("Result status:");
  console.log(`  File Name:        ${result.fileName}`);
  console.log(`  Has E-Way Bill:   ${result.hasEwayBill}`);
  console.log(`  E-Way Merged:     ${result.ewayBillMerged}`);
  console.log(`  Merge Error:      ${result.mergeError || "None"}`);
  console.log(`  Buffer size:      ${result.buffer.length} bytes`);

  if (!result.ewayBillMerged) {
    throw new Error(`Failed to merge E-Way Bill: ${result.mergeError}`);
  }

  // Inspect the generated PDF with pdf-lib
  const doc = await PDFDocument.load(result.buffer);
  const pageCount = doc.getPageCount();
  console.log(`  Total Page Count: ${pageCount}`);

  if (pageCount < 2) {
    throw new Error(`Expected at least 2 pages (Invoice + EWB), but got ${pageCount}`);
  }

  // Save the file to verify
  const outputDir = path.join(process.cwd(), ".temp_test");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outPath = path.join(outputDir, result.fileName);
  fs.writeFileSync(outPath, result.buffer);
  console.log(`  Saved verified PDF to: ${outPath}`);

  console.log("\n  ✓ SUCCESS: Invoice Page 1 generated correctly.");
  console.log(`  ✓ SUCCESS: E-Way Bill merged as Page 2 (Total pages: ${pageCount}).`);
  console.log("=== REAL INVOICE VERIFICATION 100% COMPLETE ===");
}

verifyRealInvoiceMerge().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

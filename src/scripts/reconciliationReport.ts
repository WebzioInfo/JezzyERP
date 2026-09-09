import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "../db/prisma/client";

async function runReconciliation() {
  console.log("================ MIGRATION RECONCILIATION REPORT ================\n");

  const dirPath = path.resolve(process.cwd(), "old data invoices");
  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith(".pdf"));

  // Retrieve all active database invoices
  const dbInvoices = await db.invoice.findMany({
    where: { deletedAt: null },
    include: { lineItems: true }
  });

  const dbInvoiceMap = new Map(dbInvoices.map(inv => [inv.invoiceNo, inv]));

  console.log(`Total PDF Files in Folder: ${files.length}`);
  console.log(`Total Invoices in Database: ${dbInvoices.length}\n`);

  const report = [];
  let missingCount = 0;
  let duplicateCount = 0;
  let nonInvoiceCount = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Skip brochure
    if (file === "Biofix_BQMS.pdf") {
      nonInvoiceCount++;
      report.push({
        filename: file,
        invoiceNo: "N/A (Brochure)",
        status: "SKIPPED",
        reason: "Validation Error: Marketing brochure, not a valid invoice."
      });
      continue;
    }

    // Determine expected invoiceNo from filename if possible, or parse from text
    // E.g. ERANAD_JE-B2B-01-26-27.pdf -> JE-B2B-01-26-27
    let expectedNo = "";
    if (file.includes("JE-B2B")) {
      const match = file.match(/JE-B2B-\d+-\d+-\d+/);
      if (match) expectedNo = match[0];
    } else if (file.startsWith("JEZZY_")) {
      const match = file.match(/JEZZY_(\d+)/);
      if (match) expectedNo = `JE-B2B-${match[1].padStart(2, "0")}-26-27`;
    }

    const matchedDb = dbInvoiceMap.get(expectedNo);

    if (matchedDb) {
      // Check if another PDF already mapped to this invoiceNo
      const isDuplicateSource = report.some(r => r.invoiceNo === expectedNo && r.status === "IMPORTED");
      if (isDuplicateSource) {
        duplicateCount++;
        report.push({
          filename: file,
          invoiceNo: expectedNo,
          status: "SKIPPED",
          reason: `Duplicate source file for invoice ${expectedNo}`
        });
      } else {
        report.push({
          filename: file,
          invoiceNo: expectedNo,
          status: "IMPORTED",
          reason: "Successfully reconciled with database record"
        });
      }
    } else {
      missingCount++;
      report.push({
        filename: file,
        invoiceNo: expectedNo,
        status: "MISSING",
        reason: "No matching invoiceNo found in database"
      });
    }
  }

  console.log("--------------------------------------------------");
  console.log("PDF File Reconciliation Checklist:");
  for (const item of report) {
    console.log(`- File: ${item.filename} | InvNo: ${item.invoiceNo} | Status: ${item.status} | Reason: ${item.reason}`);
  }
  console.log("--------------------------------------------------");
  console.log(`Reconciliation Summary:`);
  console.log(`  * Missing Invoices: ${missingCount}`);
  console.log(`  * Duplicate Files: ${duplicateCount}`);
  console.log(`  * Non-Invoice Files: ${nonInvoiceCount}`);
  console.log(`  * Total Invoices Matched: ${dbInvoices.length}`);
}

runReconciliation().catch(console.error);

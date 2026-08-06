import fs from "fs";
import path from "path";
import { db } from "../db/prisma/client";
import { OcrMigrationService } from "../features/settings/services/OcrMigrationService";
import { MigrationService } from "../features/settings/services/MigrationService";
import { Prisma } from "@prisma/client";

async function runDatabaseSeed() {
  console.log("================ STARTING LEGACY DATABASE SEEDING ================\n");

  // Clean cache file to force fresh extraction using our high-precision template parser
  const cachePath = path.resolve(process.cwd(), "old data invoices", "extracted_cache.json");
  if (fs.existsSync(cachePath)) {
    console.log("Removing outdated extraction cache file...");
    fs.unlinkSync(cachePath);
  }

  // Pre-seed Cleanup: delete all previous OCR seeded records to avoid partial draft duplicates
  console.log("Cleaning up previous OCR seeded records from database...");
  const ocrInvoices = await db.invoice.findMany({
    where: { notes: { contains: "[PDF_HASH:" } }
  });
  
  console.log(`Found ${ocrInvoices.length} previously seeded invoices. Deleting...`);
  for (const inv of ocrInvoices) {
    await db.paymentAllocation.deleteMany({ where: { invoiceId: inv.id } });
    await db.ledgerEntry.deleteMany({ where: { referenceId: inv.id } });
    await db.invoiceLineItem.deleteMany({ where: { invoiceId: inv.id } });
    await db.invoice.deleteMany({ where: { id: inv.id } });
  }
  console.log("Cleanup complete. Starting import...\n");

  const files = await OcrMigrationService.scanFolder();
  const pendingFiles = files.filter(f => f.status === "PENDING");
  
  console.log(`Found ${files.length} legacy invoices total.`);
  console.log(`${pendingFiles.length} invoices are PENDING import.\n`);

  if (pendingFiles.length === 0) {
    console.log("No pending invoices to seed. Database is already up to date!");
    process.exit(0);
  }

  // Create a MigrationBatch for tracing logs
  const batch = await db.migrationBatch.create({
    data: {
      module: "OCR_LEGACY_IMPORT",
      status: "PENDING",
      totalRecords: pendingFiles.length,
      successCount: 0,
      errorCount: 0
    }
  });

  console.log(`Initialized database MigrationBatch: ${batch.id}\n`);

  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;

  for (let i = 0; i < pendingFiles.length; i++) {
    const file = pendingFiles[i];
    console.log(`[${i + 1}/${pendingFiles.length}] Ingesting ${file.filename}...`);

    try {
      // 1. Extract
      const data = await OcrMigrationService.extractInvoiceData(file.filename);
      
      if (data.structured.isDuplicate) {
        console.log(`  - [SKIP] Duplicate PDF hash detected for ${file.filename}.`);
        duplicateCount++;
        continue;
      }

      // 2. Commit transaction
      const invoice = await db.$transaction(async (tx) => {
        return await OcrMigrationService.seedInvoice(tx, data.structured, batch.id);
      }, { timeout: 45000, isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      console.log(`  - [SUCCESS] Seeded Invoice ${invoice.invoiceNo} (Grand Total: Rs. ${Number(invoice.grandTotal)}, Status: ${invoice.status})`);
      successCount++;

    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.error(`  - [FAILED] Ingestion failed for ${file.filename}:`, errMsg);
      errorCount++;

      // Log failure in MigrationLog for Manual Review UI
      await db.migrationLog.create({
        data: {
          batchId: batch.id,
          sourceRow: i + 1,
          status: "ERROR",
          message: `Ingestion failed for ${file.filename}: ${errMsg}`,
          destinationModel: "Invoice"
        }
      });
    }
  }

  // 3. Update Batch Status
  await db.migrationBatch.update({
    where: { id: batch.id },
    data: {
      successCount,
      errorCount,
      status: errorCount === 0 ? "COMPLETED" : "PARTIAL"
    }
  });

  console.log("\n================ SEEDING COMPLETE ================");
  console.log(`Total Processed: ${pendingFiles.length}`);
  console.log(`Successfully Committed: ${successCount}`);
  console.log(`Duplicates Skipped: ${duplicateCount}`);
  console.log(`Failed Imports: ${errorCount}`);

  // 4. Run post-import reconciliation auditor
  console.log("\nRunning Trial Balance and Stock Reconciliation audit...");
  try {
    const recon = await MigrationService.reconcileBalances();
    console.log("-------------------------------------------------");
    console.log(`Debit Balance: Rs. ${recon.ledgerAudit.totalDebits.toLocaleString("en-IN")}`);
    console.log(`Credit Balance: Rs. ${recon.ledgerAudit.totalCredits.toLocaleString("en-IN")}`);
    console.log(`Balanced Status: ${recon.ledgerAudit.balanced ? "BALANCED (Debit == Credit) ✅" : "UNBALANCED ❌"}`);
    console.log(`Stock items scanned: ${recon.stockAudit.scanned} products`);
    console.log("-------------------------------------------------");
  } catch (reconErr) {
    console.error("Reconciliation audit encountered an error:", reconErr);
  }
}

runDatabaseSeed().catch(err => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});

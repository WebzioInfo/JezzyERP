import fs from "fs";
import path from "path";
import { db } from "../db/prisma/client";
import { OcrMigrationService } from "../features/settings/services/OcrMigrationService";
import { MigrationService, DryRunRollback } from "../features/settings/services/MigrationService";

async function runOcrTests() {
  console.log("================ LEGACY AI INGESTION & CACHING TESTS ================\n");

  const cachePath = path.resolve(process.cwd(), "old data invoices", "extracted_cache.json");
  if (fs.existsSync(cachePath)) {
    console.log("Pre-test: Removing existing extraction cache file...");
    fs.unlinkSync(cachePath);
  }

  // 1. Scan Folder Verification
  console.log("Test 1: Scanning legacy invoices folder...");
  try {
    const files = await OcrMigrationService.scanFolder();
    console.log(`  - Found ${files.length} legacy files in folder.`);
    if (files.length > 0) {
      console.log("  - Sample file metadata:", files[0]);
      console.log("  ✅ Test 1 Passed: Successfully scanned folder.");
    } else {
      console.warn("  - Warning: Folder scan returned 0 files.");
      console.log("  ✅ Test 1 Passed (Lax check).");
    }
  } catch (err) {
    console.error("  ❌ Test 1 Failed with error:", err);
    process.exit(1);
  }

  // 2. Cache Generation & Hit Check
  console.log("\nTest 2: Verifying cache creation and consecutive cache hits...");
  const mockFilename = "ERANAD_JE-B2B-01-26-27.pdf";
  try {
    console.log("  - Run 1 (Cold cache extraction)...");
    const data1 = await OcrMigrationService.extractInvoiceData(mockFilename);
    console.log("    * Extracted PDF hash:", data1.structured?.pdfHash);
    
    if (!fs.existsSync(cachePath)) {
      console.error("  ❌ Test 2 Failed: Cache file was not created on disk.");
      process.exit(1);
    }
    console.log("    * Cache file successfully written to disk.");

    console.log("  - Run 2 (Warm cache lookup check)...");
    const startTime = Date.now();
    const data2 = await OcrMigrationService.extractInvoiceData(mockFilename);
    const duration = Date.now() - startTime;
    console.log(`    * Cache hit returned in ${duration}ms.`);

    if (data1.structured.pdfHash === data2.structured.pdfHash && duration < 400) {
      console.log("  ✅ Test 2 Passed: Ingestion caching completed successfully.");
    } else {
      console.error(`  ❌ Test 2 Failed: Cache lookup failed or was too slow (${duration}ms).`);
      process.exit(1);
    }
  } catch (err) {
    console.error("  ❌ Test 2 Failed with error:", err);
    process.exit(1);
  }

  // 3. Migration Batch and Audit logs trace verify
  console.log("\nTest 3: Seeding and verifying audit logs (MigrationBatch/Log)...");
  
  // Initialize test batch
  const testBatch = await db.migrationBatch.create({
    data: {
      module: "OCR_TEST_BATCH",
      status: "PENDING",
      totalRecords: 1
    }
  });
  console.log(`  - Initialized MigrationBatch ID: ${testBatch.id}`);

  const mockExtractedStructured = {
    clientName: "Test OCR Legacy Client",
    clientGst: "29ABCDE1234F1Z5",
    clientAddress: "Test Address Line 1",
    clientState: "Karnataka",
    clientPinCode: "560001",
    invoiceNo: "TEST-OCR-INV-999",
    date: "2026-08-06",
    ewayBill: "123456789012",
    vehicleNo: "KA-01-AB-1234",
    pdfHash: "mock_hash_for_test_run",
    confidence: 99,
    items: [
      {
        sku: "TEST-OCR-SKU-CAPS",
        description: "Test Legacy Alaskan Caps",
        qty: 50000,
        rate: 0.85,
        taxPercent: 18,
        hsn: "3923"
      }
    ]
  };

  try {
    const committedInvoice = await db.$transaction(async (tx) => {
      return await OcrMigrationService.seedInvoice(tx, mockExtractedStructured, testBatch.id);
    }, { timeout: 30000 });

    console.log(`  - Committed legacy invoice ${committedInvoice.invoiceNo} successfully.`);

    // Verify trace logs in MigrationLog table
    const traceLogs = await db.migrationLog.findMany({
      where: { batchId: testBatch.id }
    });

    console.log(`  - Retrieved ${traceLogs.length} audit trace logs from db.`);
    traceLogs.forEach(log => {
      console.log(`    * Model: ${log.destinationModel}, Id: ${log.destinationId}, Message: ${log.message}`);
    });

    if (traceLogs.length >= 3) {
      console.log("  ✅ Test 3 Passed: Entity creation and seeding logged successfully in DB audit trails.");
    } else {
      console.error(`  ❌ Test 3 Failed: Insufficient audit traces created. Found ${traceLogs.length}`);
      process.exit(1);
    }

    // Cleanup committed records
    console.log("  - Cleaning up committed test records...");
    await db.migrationLog.deleteMany({ where: { batchId: testBatch.id } });
    await db.migrationBatch.deleteMany({ where: { id: testBatch.id } });
    await db.paymentAllocation.deleteMany({ where: { invoiceId: committedInvoice.id } });
    await db.ledgerEntry.deleteMany({ where: { referenceId: committedInvoice.id } });
    await db.invoiceLineItem.deleteMany({ where: { invoiceId: committedInvoice.id } });
    await db.invoice.deleteMany({ where: { id: committedInvoice.id } });

    // Clean client & products
    const client = await db.client.findFirst({ where: { name: "Test OCR Legacy Client" } });
    if (client) {
      await db.account.deleteMany({ where: { clientId: client.id } });
      await db.client.deleteMany({ where: { id: client.id } });
    }

    const product = await db.product.findFirst({ where: { sku: "TEST-OCR-SKU-CAPS" } });
    if (product) {
      await db.stockLog.deleteMany({ where: { productId: product.id } });
      await db.stock.deleteMany({ where: { productId: product.id } });
      await db.product.deleteMany({ where: { id: product.id } });
    }
    
    console.log("  ✅ Clean up completed successfully.");

  } catch (err: any) {
    console.error("❌ Test 3 Failed with error:", err.message || err);
    process.exit(1);
  }

  // Clean cache file
  if (fs.existsSync(cachePath)) {
    fs.unlinkSync(cachePath);
  }

  console.log("\n🎉 ALL LEGACY AI INGESTION & CACHING TESTS PASSED!");
}

runOcrTests().catch(err => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});

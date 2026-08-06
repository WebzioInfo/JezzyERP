import { db } from "../db/prisma/client";
import { MigrationService, DryRunRollback } from "../features/settings/services/MigrationService";

async function runTests() {
  console.log("================ MIGRATION ENGINE TESTS ================\n");

  // 1. Dry Run Verification (Rollback check)
  console.log("Test 1: Dry-Run Account Import Validation & Rollback...");
  const initialAccountsCount = await db.account.count();
  
  const testAccountsData = [
    { name: "Test Migration Cash Account", type: "CASH", openingBalance: 1000 },
    { name: "Test Migration Equity Account", type: "EQUITY", openingBalance: 5000 },
  ];

  try {
    await db.$transaction(async (tx) => {
      await MigrationService.runImport(tx, "ACCOUNTS", testAccountsData, true);
    });
    console.error("❌ Test 1 Failed: Transaction did not roll back during dry run.");
    process.exit(1);
  } catch (err: any) {
    if (err instanceof DryRunRollback) {
      console.log("  - Successfully caught DryRunRollback exception.");
      console.log(`  - Reported Successes: ${err.result.successCount}, Failures: ${err.result.errorCount}`);
      
      // Verify database remains clean
      const postAccountsCount = await db.account.count();
      if (postAccountsCount === initialAccountsCount) {
        console.log("  ✅ Test 1 Passed: Database transaction successfully rolled back.");
      } else {
        console.error(`  ❌ Test 1 Failed: Accounts count modified. Initial: ${initialAccountsCount}, Post: ${postAccountsCount}`);
        process.exit(1);
      }
    } else {
      console.error("  ❌ Test 1 Failed with unexpected error:", err);
      process.exit(1);
    }
  }

  // 2. Real Import Verification (Clients, Products, Invoices, and Payments)
  console.log("\nTest 2: Sequential Actual Migration & Derived Balances...");
  
  try {
    const batchResult = await db.$transaction(async (tx) => {
      // Import Client
      const clientData = [{
        name: "Acme Corporation Test",
        email: "acme@test.com",
        address1: "123 Industrial Rd",
        state: "Karnataka",
        pinCode: "560001"
      }];
      console.log("  - Importing Client...");
      const clientImport = await MigrationService.runImport(tx, "CLIENTS", clientData, false);
      if (clientImport.errorCount > 0) throw new Error("Client import failed");

      // Import Product
      const productData = [{
        sku: "TEST-SKU-MIGRATE",
        description: "Test Migration Product",
        sellingRate: 150,
        gstRate: 18,
        qtyPerBox: 10,
        unit: "NOS"
      }];
      console.log("  - Importing Product...");
      const productImport = await MigrationService.runImport(tx, "PRODUCTS", productData, false);
      if (productImport.errorCount > 0) throw new Error("Product import failed");

      // Import Flat Invoices (Multi-item Invoice Grouping test)
      // We import two line items under the same invoice number 'MIG-INV-001'
      const invoiceData = [
        {
          invoiceNo: "MIG-INV-001",
          date: "2026-08-06",
          clientName: "Acme Corporation Test",
          sku: "TEST-SKU-MIGRATE",
          qty: 5,
          rate: 150,
          taxPercent: 18
        },
        {
          invoiceNo: "MIG-INV-001",
          date: "2026-08-06",
          clientName: "Acme Corporation Test",
          sku: "TEST-SKU-MIGRATE",
          qty: 3,
          rate: 150,
          taxPercent: 18
        }
      ];
      console.log("  - Importing Grouped Invoices (Flat rows grouping)...");
      const invoiceImport = await MigrationService.runImport(tx, "INVOICES", invoiceData, false);
      if (invoiceImport.errorCount > 0) {
        console.error("  - Invoices import logs:", invoiceImport.logs);
        throw new Error("Invoice import failed");
      }

      // Import Payments
      const paymentData = [{
        partyName: "Acme Corporation Test",
        partyType: "CLIENT",
        amount: 500,
        paidAt: "2026-08-06",
        method: "UPI",
        reference: "UTR-MIGRATE-99"
      }];
      console.log("  - Importing Payment Collections...");
      const paymentImport = await MigrationService.runImport(tx, "PAYMENTS", paymentData, false);
      if (paymentImport.errorCount > 0) throw new Error("Payment import failed");

      return { clientImport, productImport, invoiceImport, paymentImport };
    }, { timeout: 30000 });

    console.log("  ✅ Test 2 Passed: Batch imports executed successfully.");
    
    // Verify invoice items grouping count
    const invoice = await db.invoice.findFirst({
      where: { invoiceNo: "MIG-INV-001" },
      include: { lineItems: true }
    });
    if (invoice && invoice.lineItems.length === 2) {
      console.log("  ✅ Verification: Flat rows correctly grouped under a single invoice header.");
      const totalQty = invoice.lineItems.reduce((sum, item) => sum + Number(item.qty), 0);
      if (totalQty === 8) {
        console.log("  ✅ Verification: Total quantities mapped accurately.");
      } else {
        console.error(`  ❌ Verification Failed: Qty mismatch. Expected: 8, Got: ${totalQty}`);
        process.exit(1);
      }
    } else {
      console.error(`  ❌ Verification Failed: Line items count mismatch. Expected: 2, Got: ${invoice?.lineItems.length || 0}`);
      process.exit(1);
    }

  } catch (err: any) {
    console.error("❌ Test 2 Failed with error:", err.message || err);
    process.exit(1);
  }

  // 3. Post-Import Reconciliation
  console.log("\nTest 3: Post-Import Reconciliation Audit...");
  try {
    const recon = await MigrationService.reconcileBalances();
    console.log("  - Reconciliation output:", JSON.stringify(recon, null, 2));
    if (recon.ledgerAudit.balanced) {
      console.log("  ✅ Test 3 Passed: Ledger trial balance is fully reconciled.");
    } else {
      console.error("  ❌ Test 3 Failed: Ledger is out of balance!");
      process.exit(1);
    }
  } catch (err: any) {
    console.error("❌ Test 3 Failed with error:", err);
    process.exit(1);
  }

  // Cleanup Test Records
  console.log("\nTest Cleanup: Purging migration records...");
  const clientObj = await db.client.findFirst({ where: { name: "Acme Corporation Test" } });
  if (clientObj) {
    await db.paymentAllocation.deleteMany({ where: { invoice: { clientId: clientObj.id } } });
    await db.payment.deleteMany({ where: { clientId: clientObj.id } });
    await db.ledgerEntry.deleteMany({
      where: {
        OR: [
          { debitAccount: { clientId: clientObj.id } },
          { creditAccount: { clientId: clientObj.id } }
        ]
      }
    });
    await db.invoiceLineItem.deleteMany({ where: { invoice: { clientId: clientObj.id } } });
    await db.invoice.deleteMany({ where: { clientId: clientObj.id } });
    
    // Resolve product stock logs & stocks
    const productObj = await db.product.findFirst({ where: { sku: "TEST-SKU-MIGRATE" } });
    if (productObj) {
      await db.stockLog.deleteMany({ where: { productId: productObj.id } });
      await db.stock.deleteMany({ where: { productId: productObj.id } });
      await db.product.deleteMany({ where: { id: productObj.id } });
    }
    
    await db.account.deleteMany({ where: { clientId: clientObj.id } });
    await db.client.deleteMany({ where: { id: clientObj.id } });
  }

  console.log("\n🎉 ALL MIGRATION ENGINE TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("Fatal test suite runner error:", err);
  process.exit(1);
});

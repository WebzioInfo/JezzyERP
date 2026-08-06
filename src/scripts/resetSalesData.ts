import { db } from "../db/prisma/client";

async function resetSalesData() {
  console.log("================ RESETTING LEGACY SALES DATA ================\n");

  try {
    // 1. Delete Payment Allocations
    const deletedAllocations = await db.paymentAllocation.deleteMany({});
    console.log(`- Deleted ${deletedAllocations.count} payment allocations.`);

    // 2. Delete Payments
    const deletedPayments = await db.payment.deleteMany({});
    console.log(`- Deleted ${deletedPayments.count} payments.`);

    // 3. Delete Ledger Entries created from invoices
    const deletedLedger = await db.ledgerEntry.deleteMany({
      where: { referenceType: "INVOICE" }
    });
    console.log(`- Deleted ${deletedLedger.count} ledger entries.`);

    // 4. Delete Stock Logs created from invoices
    const deletedStockLogs = await db.stockLog.deleteMany({
      where: {
        OR: [
          { notes: { contains: "Invoice" } },
          { type: "REMOVE" }
        ]
      }
    });
    console.log(`- Deleted ${deletedStockLogs.count} stock logs.`);

    // Reset stock levels to 0
    const resetStocks = await db.stock.updateMany({
      data: { quantity: 0 }
    });
    console.log(`- Reset ${resetStocks.count} product stock records back to 0.`);

    // 5. Delete Invoice Line Items
    const deletedLineItems = await db.invoiceLineItem.deleteMany({});
    console.log(`- Deleted ${deletedLineItems.count} invoice line items.`);

    // 6. Delete Invoices
    const deletedInvoices = await db.invoice.deleteMany({});
    console.log(`- Deleted ${deletedInvoices.count} invoices.`);

    // 7. Delete Invoice-related Audit Logs
    const deletedAudits = await db.auditLog.deleteMany({
      where: {
        OR: [
          { entityType: "Invoice" },
          { entityType: "InvoiceLineItem" },
          { action: { contains: "Invoice" } }
        ]
      }
    });
    console.log(`- Deleted ${deletedAudits.count} invoice-related audit logs.`);

    // 8. Delete Migration logs and batches
    await db.migrationLog.deleteMany({});
    await db.migrationBatch.deleteMany({});
    console.log("- Deleted legacy migration logs and batches.");

    console.log("\n================ CLEANUP COMPLETE ================");
  } catch (err) {
    console.error("Error resetting database:", err);
    process.exit(1);
  }
}

resetSalesData().then(() => process.exit(0));

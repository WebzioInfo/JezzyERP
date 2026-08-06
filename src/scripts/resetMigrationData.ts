import { db } from "../db/prisma/client";

async function reset() {
  console.log("================ STARTING TOTAL DATABASE CLEANUP ================\n");

  try {
    // 1. Delete Payment Allocations
    const allocations = await db.paymentAllocation.deleteMany({});
    console.log(`- Deleted ${allocations.count} payment allocations.`);

    // 2. Delete Payments
    const payments = await db.payment.deleteMany({});
    console.log(`- Deleted ${payments.count} payments.`);

    // 3. Delete Ledger Entries created from invoices
    const ledger = await db.ledgerEntry.deleteMany({
      where: { referenceType: "INVOICE" }
    });
    console.log(`- Deleted ${ledger.count} ledger entries.`);

    // 4. Delete Stock Logs created from invoices
    const stockLogs = await db.stockLog.deleteMany({
      where: {
        OR: [
          { notes: { contains: "Invoice" } },
          { type: "REMOVE" }
        ]
      }
    });
    console.log(`- Deleted ${stockLogs.count} stock logs.`);

    // Reset all product stock records to 0
    const resetStock = await db.stock.updateMany({
      data: { quantity: 0 }
    });
    console.log(`- Reset ${resetStock.count} stock records back to 0.`);

    // 5. Delete Invoice Line Items
    const lineItems = await db.invoiceLineItem.deleteMany({});
    console.log(`- Deleted ${lineItems.count} invoice line items.`);

    // 6. Delete Invoices
    const invoices = await db.invoice.deleteMany({});
    console.log(`- Deleted ${invoices.count} invoices.`);

    // 7. Delete Audit Logs
    const audits = await db.auditLog.deleteMany({
      where: {
        OR: [
          { entityType: "Invoice" },
          { entityType: "InvoiceLineItem" },
          { action: { contains: "Invoice" } }
        ]
      }
    });
    console.log(`- Deleted ${audits.count} invoice-related audit logs.`);

    // 8. Delete Migration Logs & Batches
    await db.migrationLog.deleteMany({});
    await db.migrationBatch.deleteMany({});
    console.log("- Deleted legacy migration logs and batches.");

    // 9. Delete Products created by OCR (SKU starts with PROD- or GENERIC-OCR-ITEM)
    const productsToDelete = await db.product.findMany({
      where: {
        OR: [
          { sku: { startsWith: "PROD-" } },
          { sku: "GENERIC-OCR-ITEM" }
        ]
      }
    });

    console.log(`Found ${productsToDelete.length} OCR created products. Deleting...`);
    for (const prod of productsToDelete) {
      await db.stock.deleteMany({ where: { productId: prod.id } });
      await db.product.delete({ where: { id: prod.id } });
    }

    // 10. Delete Clients created by OCR
    const legacyNames = [
      "ERANAD BEVERAGES PVT LTD",
      "Gangothri Aqua Proccessing Unit",
      "SPELL BOUND EQUALITY PDW",
      "DIAMOND PET PRODUCTS",
      "KAMBAR BUSINESS VENTURE PVT LTD",
      "HYBOTIC PACKAGING Solns. LLP",
      "VARUNA AQUA PRODUCTS",
      "Biofix Technology LLP",
      "Legacy OCR Customer"
    ];

    const clientsToDelete = await db.client.findMany({
      where: { name: { in: legacyNames } }
    });

    console.log(`Found ${clientsToDelete.length} legacy/OCR clients. Deleting...`);
    for (const client of clientsToDelete) {
      await db.account.deleteMany({ where: { clientId: client.id } });
      await db.client.delete({ where: { id: client.id } });
    }

    console.log("\n================ CLEANUP COMPLETE ================");
  } catch (err) {
    console.error("Error executing cleanup:", err);
    process.exit(1);
  }
}

reset().then(() => process.exit(0));

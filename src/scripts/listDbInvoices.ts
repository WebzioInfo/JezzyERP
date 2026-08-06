import { db } from "../db/prisma/client";

async function listInvoices() {
  const invoices = await db.invoice.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      invoiceNo: true,
      billingName: true,
      grandTotal: true
    }
  });

  console.log(`Currently there are ${invoices.length} active invoices in the database:`);
  invoices.forEach(inv => {
    console.log(`  * ${inv.invoiceNo} | Client: ${inv.billingName} | Total: Rs. ${Number(inv.grandTotal)}`);
  });
}

listInvoices().catch(console.error);

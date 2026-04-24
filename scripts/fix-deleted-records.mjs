import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deletedInvoices = await prisma.invoice.findMany({
    where: {
      deletedAt: { not: null },
      NOT: {
        invoiceNo: { contains: '-DEL-' }
      }
    }
  });

  console.log(`Found ${deletedInvoices.length} soft-deleted invoices to fix.`);

  for (const inv of deletedInvoices) {
    const newNo = `${inv.invoiceNo}-DEL-${inv.deletedAt.getTime()}`;
    const newSeq = -1 * Math.abs(inv.sequenceNumber);
    
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { 
        invoiceNo: newNo,
        sequenceNumber: newSeq
      }
    });
    console.log(`Updated invoice ${inv.id}: ${inv.invoiceNo} -> ${newNo}`);
  }

  // Also check Purchases
  const deletedPurchases = await prisma.purchase.findMany({
    where: {
      deletedAt: { not: null },
      NOT: {
        purchaseNo: { contains: '-DEL-' }
      }
    }
  });

  console.log(`Found ${deletedPurchases.length} soft-deleted purchases to fix.`);
  for (const pur of deletedPurchases) {
    const newNo = `${pur.purchaseNo}-DEL-${pur.deletedAt.getTime()}`;
    const newSeq = -1 * Math.abs(pur.sequenceNumber);
    await prisma.purchase.update({
      where: { id: pur.id },
      data: { 
        purchaseNo: newNo,
        sequenceNumber: newSeq
      }
    });
    console.log(`Updated purchase ${pur.id}: ${pur.purchaseNo} -> ${newNo}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

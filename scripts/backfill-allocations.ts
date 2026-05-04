import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Payment Allocation Backfill...");

    // Find all invoices that have some paid amount but no allocations yet
    const invoices = await (prisma.invoice as any).findMany({
        where: {
            paidAmount: { gt: 0 }
        },
        include: {
            allocations: true,
            payments: true
        }
    });

    console.log(`Found ${invoices.length} invoices needing allocation backfill.`);

    for (const invoice of invoices) {
        if (invoice.allocations.length > 0) {
            console.log(`Invoice ${invoice.invoiceNo} already has allocations. Skipping.`);
            continue;
        }

        // We need to create a dummy payment and allocate it to this invoice
        // to mathematically explain the 'paidAmount'.
        
        let targetAmount = Number(invoice.paidAmount);
        
        // Check if there are explicit payments linked to this invoice (legacy way)
        for (const payment of invoice.payments) {
            if (targetAmount <= 0) break;
            
            const allocateAmt = Math.min(Number(payment.amount), targetAmount);
            
            await (prisma.paymentAllocation as any).create({
                data: {
                    paymentId: payment.id,
                    invoiceId: invoice.id,
                    amount: allocateAmt
                }
            });
            
            targetAmount -= allocateAmt;
            console.log(`Allocated ${allocateAmt} from legacy Payment ${payment.id} to Invoice ${invoice.invoiceNo}`);
        }

        // If there is still paidAmount left to explain, we must generate a dummy payment
        if (targetAmount > 0) {
            console.log(`Generating system backfill payment for Invoice ${invoice.invoiceNo} to cover missing ${targetAmount}`);
            
            const dummyPayment = await (prisma.payment as any).create({
                data: {
                    clientId: invoice.clientId,
                    amount: targetAmount,
                    paidAt: invoice.createdAt,
                    method: 'OTHER',
                    notes: 'SYSTEM GENERATED BACKFILL FOR LEGACY PAID_AMOUNT',
                }
            });

            await (prisma.paymentAllocation as any).create({
                data: {
                    paymentId: dummyPayment.id,
                    invoiceId: invoice.id,
                    amount: targetAmount
                }
            });

            // Make sure the Ledger reflects this dummy payment, otherwise the Ledger and Allocation engine mismatch.
            // Actually, if the old system didn't put it in the ledger, we should backfill the ledger too.
            const clientAccount = await (prisma.account as any).findUnique({ where: { clientId: invoice.clientId } });
            const cashAccount = await (prisma.account as any).findFirst({ where: { type: 'CASH' } });
            
            if (clientAccount && cashAccount) {
                await (prisma.ledgerEntry as any).create({
                    data: {
                        debitAccountId: cashAccount.id,
                        creditAccountId: clientAccount.id,
                        amount: targetAmount,
                        referenceType: 'PAYMENT',
                        referenceId: dummyPayment.id,
                        description: `Legacy Backfill Payment for Invoice ${invoice.invoiceNo}`,
                        date: invoice.createdAt
                    }
                });
            }
        }
    }

    console.log("Backfill complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

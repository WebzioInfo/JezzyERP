import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("Starting Ledger Backfill...");

  // 1. Clear existing ledger entries
  const deleted = await (db.ledgerEntry as any).deleteMany({});
  console.log(`Cleared ${deleted.count} existing ledger entries.`);

  // 2. Backfill Invoices (DEBITS)
  const invoices = await (db.invoice as any).findMany({
    where: { deletedAt: null },
  });

  console.log(`Processing ${invoices.length} invoices...`);
  for (const invoice of invoices) {
    try {
        // Find Client Account
        let clientAccount = await (db.account as any).findUnique({ where: { clientId: invoice.clientId } });
        if (!clientAccount) {
            const client = await (db.client as any).findUnique({ where: { id: invoice.clientId } });
            if (client) {
                clientAccount = await (db.account as any).create({
                    data: {
                        name: `${client.name} (Receivable)`,
                        type: 'RECEIVABLE',
                        clientId: client.id
                    }
                });
            }
        }

        // Find Sales Account
        let salesAccount = await (db.account as any).findFirst({ where: { type: 'SALES' } });
        if (!salesAccount) {
            salesAccount = await (db.account as any).create({
                data: { name: 'Sales Revenue', type: 'SALES' }
            });
        }

        if (clientAccount && salesAccount) {
            await (db.ledgerEntry as any).create({
                data: {
                  debitAccountId: clientAccount.id,
                  creditAccountId: salesAccount.id,
                  amount: invoice.grandTotal,
                  referenceType: 'INVOICE',
                  invoiceId: invoice.id,
                  description: `Backfilled: Invoice ${invoice.invoiceNo}`,
                  date: invoice.date,
                },
            });
        }

        // Reset invoice financial fields
        await (db.invoice as any).update({
            where: { id: invoice.id },
            data: {
              paidAmount: 0,
              dueAmount: invoice.grandTotal,
              status: 'SENT'
            }
        });
    } catch (err: any) {
        console.error(`Failed to process invoice ${invoice.id}: ${err.message}`);
    }
  }

  // 3. Backfill Payments (CREDITS)
  const payments = await (db.payment as any).findMany({
    where: { deletedAt: null },
    include: { invoice: true }
  });

  console.log(`Processing ${payments.length} payments...`);
  for (const payment of payments) {
    try {
        const clientId = payment.clientId || payment.invoice?.clientId;
        if (!clientId) {
          console.warn(`Payment ${payment.id} has no client associated. Skipping.`);
          continue;
        }

        // Update payment with clientId if missing
        if (!payment.clientId) {
            await (db.payment as any).update({
                where: { id: payment.id },
                data: { clientId }
            });
        }

        // Find Client Account
        let clientAccount = await (db.account as any).findUnique({ where: { clientId } });
        
        // Find Cash Account
        let cashAccount = await (db.account as any).findFirst({ where: { type: 'CASH' } });
        if (!cashAccount) {
            cashAccount = await (db.account as any).create({
                data: { name: 'Cash', type: 'CASH' }
            });
        }

        if (clientAccount && cashAccount) {
            await (db.ledgerEntry as any).create({
                data: {
                  debitAccountId: cashAccount.id,
                  creditAccountId: clientAccount.id,
                  amount: payment.amount,
                  referenceType: 'PAYMENT',
                  paymentId: payment.id,
                  description: `Backfilled: Payment via ${payment.method}`,
                  date: payment.paidAt,
                },
            });
        }
    } catch (err: any) {
        console.error(`Failed to process payment ${payment.id}: ${err.message}`);
    }
  }

  // 4. Auto-Adjust all clients
  const clients = await (db.client as any).findMany({ where: { deletedAt: null } });
  console.log(`Recalculating balances for ${clients.length} clients...`);
  for (const client of clients) {
    try {
        const clientAccount = await (db.account as any).findUnique({ where: { clientId: client.id } });
        if (!clientAccount) continue;

        const debitEntries = await (db.ledgerEntry as any).findMany({
            where: { debitAccountId: clientAccount.id },
            select: { amount: true },
        });
        const creditEntries = await (db.ledgerEntry as any).findMany({
            where: { creditAccountId: clientAccount.id },
            select: { amount: true },
        });
        
        const totalDebits = debitEntries.reduce((acc: number, entry: any) => acc + Number(entry.amount), 0);
        const totalCredits = creditEntries.reduce((acc: number, entry: any) => acc + Number(entry.amount), 0);

        let availableCredit = totalCredits - totalDebits;

        if (availableCredit > 0) {
            const outstanding = await (db.invoice as any).findMany({
                where: { clientId: client.id, dueAmount: { gt: 0 }, deletedAt: null },
                orderBy: { date: 'asc' }
            });

            for (const invoice of outstanding) {
                if (availableCredit <= 0) break;
                const due = Number(invoice.dueAmount);
                const allocation = Math.min(availableCredit, due);
                
                const newPaid = Number(invoice.paidAmount) + allocation;
                const newDue = Number(invoice.grandTotal) - newPaid;
                
                await (db.invoice as any).update({
                    where: { id: invoice.id },
                    data: {
                        paidAmount: newPaid,
                        dueAmount: newDue,
                        status: newDue <= 0 ? 'PAID' : 'PARTIAL'
                    }
                });
                availableCredit -= allocation;
            }
        }
    } catch (err: any) {
        console.error(`Failed to adjust client ${client.id}: ${err.message}`);
    }
  }

  console.log("Backfill completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

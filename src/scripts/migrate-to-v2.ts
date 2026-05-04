import { db } from "../db/prisma/client";
import { AccountType } from "@prisma/client";

async function migrate() {
    console.log("🚀 Starting Financial Migration to V2...");

    // 1. Create Default System Accounts
    const systemAccounts = [
        { name: "Cash Account", type: AccountType.CASH },
        { name: "Bank Account", type: AccountType.BANK },
        { name: "Sales Revenue", type: AccountType.REVENUE },
        { name: "Purchase Account", type: AccountType.PURCHASE },
        { name: "General Expenses", type: AccountType.EXPENSE },
        { name: "Opening Balance Equity", type: AccountType.EQUITY },
    ];

    for (const acc of systemAccounts) {
        await (db as any).account.upsert({
            where: { name: acc.name },
            update: {},
            create: acc
        });
        console.log(`✅ Account Created: ${acc.name}`);
    }

    const cashAccount = await (db as any).account.findFirst({ where: { type: AccountType.CASH } });
    const bankAccount = await (db as any).account.findFirst({ where: { type: AccountType.BANK } });
    const revenueAccount = await (db as any).account.findFirst({ where: { type: AccountType.REVENUE } });
    const purchaseAccount = await (db as any).account.findFirst({ where: { type: AccountType.PURCHASE } });

    // 2. Create Accounts for all Clients
    const clients = await db.client.findMany({ where: { deletedAt: null } });
    for (const client of clients) {
        await (db as any).account.upsert({
            where: { clientId: client.id },
            update: { name: client.name },
            create: {
                name: client.name,
                type: AccountType.CLIENT,
                clientId: client.id
            }
        });
        console.log(`👤 Client Account Created: ${client.name}`);
    }

    // 3. Create Accounts for all Vendors
    const vendors = await db.vendor.findMany({ where: { deletedAt: null } });
    for (const vendor of vendors) {
        await (db as any).account.upsert({
            where: { vendorId: vendor.id },
            update: { name: vendor.name },
            create: {
                name: vendor.name,
                type: AccountType.SUPPLIER,
                vendorId: vendor.id
            }
        });
        console.log(`🏢 Vendor Account Created: ${vendor.name}`);
    }

    // 4. Back-fill Invoices -> Ledger (Debit: Client, Credit: Revenue)
    const invoices = await db.invoice.findMany({ where: { deletedAt: null } });
    for (const inv of invoices) {
        const clientAcc = await (db as any).account.findFirst({ where: { clientId: inv.clientId } });
        if (clientAcc && revenueAccount) {
            await (db as any).ledgerEntry.create({
                data: {
                    debitAccountId: clientAcc.id,
                    creditAccountId: revenueAccount.id,
                    amount: inv.grandTotal,
                    date: inv.date,
                    referenceType: 'INVOICE',
                    referenceId: inv.id,
                    description: `Sales Invoice ${inv.invoiceNo}`
                }
            });
        }
    }
    console.log(`📝 Back-filled ${invoices.length} Invoices to Ledger.`);

    // 5. Back-fill Payments -> Ledger (Debit: Bank/Cash, Credit: Client)
    const payments = await db.payment.findMany({ where: { deletedAt: null } });
    for (const p of payments) {
        const clientAcc = await (db as any).account.findFirst({ where: { clientId: p.clientId } });
        const targetAcc = p.method === 'CASH' ? cashAccount : bankAccount;
        if (clientAcc && targetAcc) {
            await (db as any).ledgerEntry.create({
                data: {
                    debitAccountId: targetAcc.id,
                    creditAccountId: clientAcc.id,
                    amount: p.amount,
                    date: p.paidAt,
                    referenceType: 'PAYMENT',
                    referenceId: p.id,
                    description: `Client Payment - ${p.method}`
                }
            });
        }
    }
    console.log(`💰 Back-filled ${payments.length} Payments to Ledger.`);

    console.log("🏁 Migration Complete!");
}

migrate()
    .catch(e => console.error("❌ Migration Failed:", e))
    .finally(() => process.exit());

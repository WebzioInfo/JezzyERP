import { db } from "@/db/prisma/client";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { NextRequest, NextResponse } from "next/server";


export type AccountType = 'CASH' | 'BANK' | 'CLIENT' | 'SUPPLIER' | 'EXPENSE' | 'PURCHASE' | 'REVENUE' | 'LOAN' | 'ADVANCE' | 'EQUITY';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const accountId = searchParams.get("accountId");

        if (accountId) {
            // Get single account with balance and history
            const account = await (db as any).account.findUnique({
                where: { id: accountId }
            });
            const balance = await FinanceService.getAccountBalance(accountId);
            const history = await (db as any).ledgerEntry.findMany({
                where: {
                    OR: [
                        { debitAccountId: accountId },
                        { creditAccountId: accountId }
                    ]
                },
                orderBy: { date: 'desc' },
                take: 50
            });

            return NextResponse.json({ account, balance, history });
        }

        // Get all accounts
        const accounts = await (db as any).account.findMany({
            orderBy: { name: 'asc' }
        });

        // Calculate balances for each
        const accountsWithBalance = await Promise.all(accounts.map(async (acc: any) => ({
            ...acc,
            balance: await FinanceService.getAccountBalance(acc.id)
        })));

        return NextResponse.json({ accounts: accountsWithBalance });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

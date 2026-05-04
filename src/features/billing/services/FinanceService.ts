import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";
export type LedgerTransactionType = 'PAYMENT_RECEIVED' | 'PAYMENT_MADE' | 'EXPENSE' | 'INVOICE' | 'PURCHASE' | 'FOUNDER_CONTRIBUTION' | 'FOUNDER_WITHDRAWAL' | 'TRANSFER';
export type AccountType = 'CASH' | 'BANK' | 'CLIENT' | 'SUPPLIER' | 'EXPENSE' | 'PURCHASE' | 'REVENUE' | 'LOAN' | 'ADVANCE' | 'EQUITY';
export const AccountType = {
  CASH: 'CASH' as AccountType,
  BANK: 'BANK' as AccountType,
  CLIENT: 'CLIENT' as AccountType,
  SUPPLIER: 'SUPPLIER' as AccountType,
  EXPENSE: 'EXPENSE' as AccountType,
  PURCHASE: 'PURCHASE' as AccountType,
  REVENUE: 'REVENUE' as AccountType,
  LOAN: 'LOAN' as AccountType,
  ADVANCE: 'ADVANCE' as AccountType,
  EQUITY: 'EQUITY' as AccountType,
};

export class FinanceService {
    /**
     * Records a double-entry transaction in the ledger.
     * Ensure this is called within a transaction (tx).
     */
    static async recordTransaction(tx: any, params: {
        debitAccountId: string;
        creditAccountId: string;
        amount: number | Prisma.Decimal;
        transactionType?: string;
        referenceType?: string;
        referenceId?: string;
        description?: string;
        date?: Date;
    }) {
        // 1. Enforce Global Rounding (2 decimal places)
        const amount = Number(parseFloat(params.amount.toString()).toFixed(2));

        if (amount <= 0) return null;

        // 2. Create the Ledger Entry - EXPLICITLY omitting transactionType for DB compatibility
        const { transactionType, ...rest } = params;
        
        return await tx.ledgerEntry.create({
            data: {
                debitAccountId: rest.debitAccountId,
                creditAccountId: rest.creditAccountId,
                amount,
                date: rest.date || new Date(),
                referenceType: rest.referenceType,
                referenceId: rest.referenceId,
                description: rest.description
            },
            select: {
                id: true,
                debitAccountId: true,
                creditAccountId: true,
                amount: true,
                date: true,
                referenceType: true,
                referenceId: true,
                description: true,
                createdAt: true,
                // transactionType: false // Explicitly omitted to avoid P2022 on post-insert SELECT
            }
        });
    }

    /**
     * Reverses a previously recorded transaction by creating an exact opposite entry.
     * This is the strict accounting way to "delete" or "edit" a ledger entry.
     */
    static async reverseTransaction(tx: any, originalEntryId: string, reason: string) {
        const original = await tx.ledgerEntry.findUnique({ where: { id: originalEntryId } });
        if (!original) throw new Error("Original transaction not found for reversal");

        // Create the reversing entry: Debit becomes Credit, Credit becomes Debit
        // Explicitly omit transactionType
        const { transactionType, ...data } = original;

        const reversal = await tx.ledgerEntry.create({
            data: {
                debitAccountId: data.creditAccountId, // Flipped
                creditAccountId: data.debitAccountId, // Flipped
                amount: data.amount,
                referenceType: data.referenceType,
                referenceId: data.referenceId,
                description: `REVERSAL: ${data.description} (${reason})`,
                date: new Date(),
            },
            select: {
                id: true,
                debitAccountId: true,
                creditAccountId: true,
                amount: true,
                date: true,
                referenceType: true,
                referenceId: true,
                description: true,
                createdAt: true
            }
        });

        return reversal;
    }

    /**
     * Calculates the current balance of an account.
     * Formula: SUM(Debits) - SUM(Credits)
     */
    static async getAccountBalance(accountId: string, tx?: any, startDate?: Date, endDate?: Date): Promise<number> {
        const client = tx || db;
        const dateFilter: any = {};
        if (startDate) dateFilter.gte = startDate;
        if (endDate) dateFilter.lte = endDate;

        const dateQuery = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

        const [debits, credits] = await Promise.all([
            (client as any).ledgerEntry.aggregate({
                where: { debitAccountId: accountId, ...dateQuery },
                _sum: { amount: true }
            }),
            (client as any).ledgerEntry.aggregate({
                where: { creditAccountId: accountId, ...dateQuery },
                _sum: { amount: true }
            })
        ]);

        const debitTotal = debits._sum.amount?.toNumber() || 0;
        const creditTotal = credits._sum.amount?.toNumber() || 0;

        return Number((debitTotal - creditTotal).toFixed(2));
    }

    /**
     * Helper to find or create a system account (Cash, Bank, Revenue etc)
     */
    static async getSystemAccount(type: AccountType, tx?: any) {
        const client = tx || db;
        let account = await (client as any).account.findFirst({
            where: { type }
        });

        if (!account) {
            account = await (client as any).account.create({
                data: {
                    name: `System ${type} Account`,
                    type,
                    active: true
                }
            });
        }
        return account;
    }

    /**
     * Records a business expense.
     * Debit: Expense Account
     * Credit: Source Account (Cash/Bank/Founder)
     */
    static async recordExpense(tx: any, params: {
        amount: number;
        category: string;
        sourceAccountId: string;
        description?: string;
        date?: Date;
    }) {
        const expenseAccount = await this.getSystemAccount(AccountType.EXPENSE, tx);
        if (!expenseAccount) throw new Error("Expense account not found in chart of accounts.");

        // 1. Record the Ledger Entry
        await this.recordTransaction(tx, {
            debitAccountId: expenseAccount.id,
            creditAccountId: params.sourceAccountId,
            amount: params.amount,
            referenceType: 'EXPENSE',
            description: `Expense: ${params.category} - ${params.description || ''}`,
            date: params.date || new Date(),
        });

        // 2. Create the Expense Record for detailed tracking
        return await (tx as any).expense.create({
            data: {
                amount: params.amount,
                category: params.category,
                description: params.description,
                date: params.date || new Date(),
            }
        });
    }

    /**
     * Records a Founder Contribution (Equity Infusion).
     * Debit: Cash/Bank
     * Credit: Founder Account
     */
    static async recordFounderContribution(tx: any, params: {
        amount: number;
        targetAccountId: string; // Bank or Cash
        founderAccountId: string;
        description?: string;
    }) {
        return await this.recordTransaction(tx, {
            debitAccountId: params.targetAccountId,
            creditAccountId: params.founderAccountId,
            amount: params.amount,
            referenceType: 'ADJUSTMENT',
            description: params.description || 'Founder Capital Infusion',
            date: new Date(),
        });
    }

    /**
     * Records a Founder Drawal (Personal withdrawal).
     * Debit: Founder Account
     * Credit: Cash/Bank
     */
    static async recordFounderDrawal(tx: any, params: {
        amount: number;
        sourceAccountId: string; // Bank or Cash
        founderAccountId: string;
        description?: string;
    }) {
        return await this.recordTransaction(tx, {
            debitAccountId: params.founderAccountId,
            creditAccountId: params.sourceAccountId,
            amount: params.amount,
            referenceType: 'ADJUSTMENT',
            description: params.description || 'Founder Personal Drawal',
            date: new Date(),
        });
    }

    /**
     * Helper to get a Client or Vendor account
     */
    static async getPartyAccount(partyId: string, partyType: 'CLIENT' | 'SUPPLIER' | 'EQUITY', tx?: any) {
        const client = tx || db;
        
        if (partyType === 'CLIENT') {
            let account = await (client as any).account.findUnique({ where: { clientId: partyId } });
            if (!account) {
                const clientData = await (client as any).client.findUnique({ where: { id: partyId } });
                if (!clientData) return null;
                account = await (client as any).account.create({
                    data: {
                        name: `Receivable: ${clientData.name}`,
                        type: 'CLIENT',
                        clientId: partyId,
                        active: true
                    }
                });
            }
            return account;
        } else if (partyType === 'SUPPLIER') {
            let account = await (client as any).account.findUnique({ where: { vendorId: partyId } });
            if (!account) {
                const vendorData = await (client as any).vendor.findUnique({ where: { id: partyId } });
                if (!vendorData) return null;
                account = await (client as any).account.create({
                    data: {
                        name: `Payable: ${vendorData.name}`,
                        type: 'SUPPLIER',
                        vendorId: partyId,
                        active: true
                    }
                });
            }
            return account;
        } else {
            return await (client as any).account.findFirst({ where: { type: 'EQUITY' } });
        }
    }

    /**
     * Records an internal money transfer between two system accounts.
     * Debit: Target Account (Receiver)
     * Credit: Source Account (Sender)
     */
    static async recordTransfer(tx: any, params: {
        sourceAccountId: string;
        targetAccountId: string;
        amount: number;
        description?: string;
        date?: Date;
    }) {
        return await this.recordTransaction(tx, {
            debitAccountId: params.targetAccountId,
            creditAccountId: params.sourceAccountId,
            amount: params.amount,
            referenceType: 'ADJUSTMENT',
            description: params.description || 'Internal Money Transfer',
            date: params.date || new Date(),
        });
    }

    /**
     * Checks if an account has sufficient funds for a debit operation.
     * Only applies to CASH/BANK/FOUNDER accounts where negative balance is unsafe.
     */
    static async validateAccountBalance(accountId: string, amount: number): Promise<{ safe: boolean; level: 'SAFE' | 'WARNING' | 'BLOCK'; message?: string }> {
        const account = await (db as any).account.findUnique({ where: { id: accountId } });
        if (!account) throw new Error("Account not found");

        // We only enforce strict safety on liquidity accounts
        if (!['CASH', 'BANK', 'EQUITY'].includes(account.type)) return { safe: true, level: 'SAFE' };

        const balance = await this.getAccountBalance(accountId);
        
        if (balance < amount) {
            return { 
                safe: false, 
                level: 'BLOCK', 
                message: `Insufficient funds. Current balance: ${balance}, Requested: ${amount}` 
            };
        }

        if (balance - amount < 5000) { // Warning threshold at 5000
            return { 
                safe: true, 
                level: 'WARNING', 
                message: "Low balance warning: Account will have less than ₹5,000 after this." 
            };
        }

        return { safe: true, level: 'SAFE' };
    }

    /**
     * Calculates Profit/Loss summary.
     * Profit = Total Revenue - Total Expenses
     */
    static async getProfitSummary(startDate?: Date, endDate?: Date) {
        const revenueAccount = await this.getSystemAccount(AccountType.REVENUE);
        const expenseAccount = await this.getSystemAccount(AccountType.EXPENSE);
        const purchaseAccount = await this.getSystemAccount(AccountType.PURCHASE);

        const [revenue, expenses, purchases] = await Promise.all([
            revenueAccount ? this.getAccountBalance(revenueAccount.id, undefined, startDate, endDate) : 0,
            expenseAccount ? this.getAccountBalance(expenseAccount.id, undefined, startDate, endDate) : 0,
            purchaseAccount ? this.getAccountBalance(purchaseAccount.id, undefined, startDate, endDate) : 0
        ]);

        // Revenue account normally has a negative balance in SUM(Debit - Credit) logic
        // because it's mostly credited. So we flip it.
        const totalRevenue = Math.abs(revenue);
        const totalExpenses = Math.abs(expenses);
        const totalPurchases = Math.abs(purchases);

        return {
            revenue: totalRevenue,
            expenses: totalExpenses,
            purchases: totalPurchases,
            netProfit: totalRevenue - (totalExpenses + totalPurchases)
        };
    }

    /**
     * Context-aware transaction labels for UI.
     * Uses account types to differentiate between Credit/Cash flows.
     */
    static getBusinessLabel(type: LedgerTransactionType, debitAccountType?: string, creditAccountType?: string): string {
        switch (type) {
            case 'INVOICE':
                return debitAccountType === 'CLIENT' ? 'Credit Sale' : 'Cash Sale';
            case 'PURCHASE':
                return creditAccountType === 'SUPPLIER' ? 'Credit Purchase' : 'Cash Purchase';
            case 'PAYMENT_RECEIVED':
                return 'Payment Received';
            case 'PAYMENT_MADE':
                return 'Payment Made';
            case 'EXPENSE':
                return 'Business Expense';
            case 'TRANSFER':
                return 'Internal Transfer';
            case 'FOUNDER_CONTRIBUTION':
                return 'Capital Infusion';
            case 'FOUNDER_WITHDRAWAL':
                return 'Owner Drawal';
            default:
                return type ? (type as any).replace('_', ' ') : 'Transaction';
        }
    }

    /**
     * Standardized fetch for recent ledger entries.
     * Eliminates technical debt from (db as any) calls.
     */
    static async getRecentTransactions(limit: number = 10) {
        return await (db as any).ledgerEntry.findMany({
            take: limit,
            orderBy: { date: 'desc' },
            select: {
                id: true,
                amount: true,
                date: true,
                description: true,
                referenceType: true,
                referenceId: true,
                debitAccountId: true,
                creditAccountId: true,
                createdAt: true,
                // transactionType is in schema.prisma but NOT yet in the DB — omit until migrated
                debitAccount: { select: { id: true, name: true, type: true } },
                creditAccount: { select: { id: true, name: true, type: true } },
            }
        });
    }

}



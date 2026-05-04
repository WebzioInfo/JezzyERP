import { db } from "@/db/prisma/client";
import { FinanceService } from "./FinanceService";

export class LedgerService {
  /**
   * Computes the current balance for a client.
   * Uses the Client's financial account.
   */
  static async getClientBalance(clientId: string): Promise<number> {
    const account = await FinanceService.getPartyAccount(clientId, 'CLIENT');
    if (!account) return 0;
    
    // For a Client (Asset/Receivable account): Debit increases, Credit decreases.
    // So balance = SUM(Debits) - SUM(Credits)
    return await FinanceService.getAccountBalance(account.id);
  }

  /**
   * Computes the current balance for a supplier.
   */
  static async getSupplierBalance(vendorId: string): Promise<number> {
    const account = await FinanceService.getPartyAccount(vendorId, 'SUPPLIER');
    if (!account) return 0;
    
    // For a Supplier (Liability account): Credit increases, Debit decreases.
    // FinanceService.getAccountBalance returns SUM(Debits) - SUM(Credits).
    // So for Supplier, we flip it to get SUM(Credits) - SUM(Debits).
    const rawBalance = await FinanceService.getAccountBalance(account.id);
    return -rawBalance;
  }

  /**
   * Computes standardized balance breakdown for a party (Client or Supplier).
   * Outstanding = Amount they owe (for Client) or We owe (for Supplier)
   * Advance = Prepaid amount / Unallocated credit
   * Net Balance = Outstanding - Advance
   */
  static async getBalanceBreakdown(partyId: string, partyType: 'CLIENT' | 'SUPPLIER') {
    const account = await FinanceService.getPartyAccount(partyId, partyType);
    if (!account) return { outstanding: 0, advance: 0, netBalance: 0 };

    const rawBalance = await FinanceService.getAccountBalance(account.id);
    
    // Normalize so positive means "Debt/Payable" and negative means "Advance/Credit"
    const netBalance = partyType === 'CLIENT' ? rawBalance : -rawBalance;

    return {
        outstanding: Math.max(0, netBalance),
        advance: Math.max(0, -netBalance),
        netBalance: netBalance
    };
  }

  /**
   * Fetches the ledger history for a client.
   */
  static async getLedgerHistory(partyId: string, partyType: 'CLIENT' | 'SUPPLIER' = 'CLIENT') {
    const account = await FinanceService.getPartyAccount(partyId, partyType);
    if (!account) return [];

    return await (db as any).ledgerEntry.findMany({
      where: {
        OR: [
          { debitAccountId: account.id },
          { creditAccountId: account.id }
        ]
      },
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
        // transactionType omitted — column not yet migrated to DB
        debitAccount: { select: { id: true, name: true, type: true } },
        creditAccount: { select: { id: true, name: true, type: true } },
      }
    });

  }

  /**
   * Performs a global integrity check.
   */
  static async validateLedgerIntegrity(): Promise<{ 
    isValid: boolean; 
    difference: number; 
    debitTotal: number; 
    creditTotal: number 
  }> {
    const orphans = await (db as any).ledgerEntry.count({
        where: {
            OR: [
                { debitAccountId: null },
                { creditAccountId: null }
            ]
        }
    });

    const [debitSum, creditSum] = await Promise.all([
        (db as any).ledgerEntry.aggregate({ _sum: { amount: true }, where: { NOT: { debitAccountId: null } } }),
        (db as any).ledgerEntry.aggregate({ _sum: { amount: true }, where: { NOT: { creditAccountId: null } } })
    ]);

    const debitTotal = Number(debitSum._sum.amount || 0);
    const creditTotal = Number(creditSum._sum.amount || 0);
    const totalNet = debitTotal - creditTotal;

    return {
        isValid: orphans === 0 && Math.abs(totalNet) < 0.01,
        difference: totalNet,
        debitTotal,
        creditTotal
    };
  }
}

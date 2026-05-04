import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";
import { recordAuditLog } from "@/lib/audit";
import { FinanceService } from "./FinanceService";
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
import { Prisma } from "@prisma/client";
import { roundTo2 } from "@/utils/financial";

export class ExpenseService {
  /**
   * Creates a new expense and records a DEBIT in the ledger.
   */
  static async createExpense(data: {
    amount: number;
    category: string;
    description?: string | null;
    date?: Date;
    recordedBy?: string | null;
    paymentMethod?: 'CASH' | 'BANK';
  }) {
    return await db.$transaction(async (tx: any) => {
      // 1. Create Expense
      const expense = await tx.expense.create({
        data: {
          amount: roundTo2(data.amount),
          category: data.category,
          description: data.description,
          date: data.date || new Date(),
        },
      });

      // 2. Record Double-Entry in Ledger
      const expenseAccount = await FinanceService.getSystemAccount(AccountType.EXPENSE, tx);
      const sourceAccount = data.paymentMethod === 'BANK'
          ? await FinanceService.getSystemAccount(AccountType.BANK, tx)
          : await FinanceService.getSystemAccount(AccountType.CASH, tx);


      if (expenseAccount && sourceAccount) {
          // Balance Guard (Level 2 Safety)
          const guard = await FinanceService.validateAccountBalance(sourceAccount.id, data.amount);
          if (guard.level === 'BLOCK') throw new Error(guard.message);

          await FinanceService.recordTransaction(tx, {
              debitAccountId: expenseAccount.id,
              creditAccountId: sourceAccount.id,
              amount: data.amount,
              referenceType: 'EXPENSE',
              referenceId: expense.id,
              description: `Expense: ${data.category}${data.description ? ' - ' + data.description : ''}`,
              date: data.date || new Date(),
          });
      }

      // 3. Audit Log
      await recordAuditLog(tx, {
        userId: data.recordedBy ?? null,
        action: "EXPENSE_CREATED",
        entityType: "Expense",
        entityId: expense.id,
        details: {
          amount: data.amount,
          category: data.category,
        },
      });

      return serializePrisma(expense);
    });
  }

  /**
   * Fetches all expenses.
   */
  static async getExpenses() {
    const expenses = await (db as any).expense.findMany({
      orderBy: { date: 'desc' },
    });
    return serializePrisma(expenses);
  }

  /**
   * Deletes an expense and its ledger entry.
   */
  static async deleteExpense(expenseId: string, userId: string) {
    return await db.$transaction(async (tx: any) => {
      // 1. Delete Ledger Entry
      await tx.ledgerEntry.deleteMany({
        where: { referenceId: expenseId, referenceType: 'EXPENSE' }
      });

      // 2. Delete Expense
      const expense = await tx.expense.delete({
        where: { id: expenseId }
      });

      // 3. Audit
      await recordAuditLog(tx, {
        userId,
        action: "EXPENSE_DELETED",
        entityType: "Expense",
        entityId: expenseId,
        details: { category: expense.category, amount: expense.amount }
      });

      return serializePrisma(expense);
    });
  }
}

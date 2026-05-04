import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";
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

export class LoanService {
    static async recordLoan(data: {
        type: 'TAKEN' | 'GIVEN';
        partyName: string;
        amount: number;
        paymentMethod: 'CASH' | 'BANK';
        notes?: string;
    }) {
        return await db.$transaction(async (tx: any) => {
            // 1. Create/Find Loan Account for this specific loan
            const loanAccountName = `Loan: ${data.partyName} (${data.type})`;
            const loanAccount = await tx.account.upsert({
                where: { name: loanAccountName },
                update: {},
                create: {
                    name: loanAccountName,
                    type: AccountType.LOAN,
                }
            });

            // 2. Create Loan Record
            const loan = await tx.loan.create({
                data: {
                    type: data.type,
                    partyName: data.partyName,
                    amount: data.amount,
                    notes: data.notes,
                    accountId: loanAccount.id
                }
            });

            // 3. Record Ledger Transaction
            const financialAccount = data.paymentMethod === 'BANK'
                ? await FinanceService.getSystemAccount(AccountType.BANK)
                : await FinanceService.getSystemAccount(AccountType.CASH);

            if (data.type === 'TAKEN') {
                // Loan Taken: Cash increases (Debit), Loan Liability increases (Credit)
                await FinanceService.recordTransaction(tx, {
                    debitAccountId: financialAccount!.id,
                    creditAccountId: loanAccount.id,
                    amount: data.amount,
                    referenceType: 'LOAN_TAKEN',
                    referenceId: loan.id,
                    description: `Loan of ${data.amount} taken from ${data.partyName}`
                });
            } else {
                // Loan Given: Loan Asset increases (Debit), Cash decreases (Credit)
                await FinanceService.recordTransaction(tx, {
                    debitAccountId: loanAccount.id,
                    creditAccountId: financialAccount!.id,
                    amount: data.amount,
                    referenceType: 'LOAN_GIVEN',
                    referenceId: loan.id,
                    description: `Loan of ${data.amount} given to ${data.partyName}`
                });
            }

            return serializePrisma(loan);
        });
    }

    static async getLoans() {
        const loans = await (db as any).loan.findMany({
            orderBy: { date: 'desc' }
        });
        return serializePrisma(loans);
    }
}

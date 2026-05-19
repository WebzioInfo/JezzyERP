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

    static async repayLoan(loanId: string, paymentMethod: 'CASH' | 'BANK') {
        return await db.$transaction(async (tx: any) => {
            const loan = await tx.loan.findUnique({ where: { id: loanId } });
            if (!loan || loan.status !== 'ACTIVE') throw new Error("Invalid loan");

            await tx.loan.update({
                where: { id: loanId },
                data: { status: 'CLOSED' }
            });

            const financialAccount = paymentMethod === 'BANK'
                ? await FinanceService.getSystemAccount(AccountType.BANK)
                : await FinanceService.getSystemAccount(AccountType.CASH);

            if (loan.type === 'TAKEN') {
                await FinanceService.recordTransaction(tx, {
                    debitAccountId: loan.accountId,
                    creditAccountId: financialAccount!.id,
                    amount: loan.amount,
                    referenceType: 'LOAN_REPAYMENT',
                    referenceId: loan.id,
                    description: `Repayment of Loan taken from ${loan.partyName}`
                });
            } else {
                await FinanceService.recordTransaction(tx, {
                    debitAccountId: financialAccount!.id,
                    creditAccountId: loan.accountId,
                    amount: loan.amount,
                    referenceType: 'LOAN_RECOVERY',
                    referenceId: loan.id,
                    description: `Recovery of Loan given to ${loan.partyName}`
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

    static async updateLoan(loanId: string, data: {
        partyName: string;
        amount: number;
        paymentMethod: 'CASH' | 'BANK';
        notes?: string;
    }) {
        return await db.$transaction(async (tx: any) => {
            const loan = await tx.loan.findUnique({ where: { id: loanId } });
            if (!loan) throw new Error("Loan not found");

            const oldAccountId = loan.accountId;
            const newAccountName = `Loan: ${data.partyName} (${loan.type})`;

            let targetAccountId = oldAccountId;
            const existingAcc = await tx.account.findFirst({ where: { name: newAccountName } });
            if (existingAcc) {
                targetAccountId = existingAcc.id;
            } else {
                const updatedAcc = await tx.account.update({
                    where: { id: oldAccountId },
                    data: { name: newAccountName }
                });
                targetAccountId = updatedAcc.id;
            }

            const updatedLoan = await tx.loan.update({
                where: { id: loanId },
                data: {
                    partyName: data.partyName,
                    amount: data.amount,
                    notes: data.notes,
                    accountId: targetAccountId
                }
            });

            const financialAccount = data.paymentMethod === 'BANK'
                ? await FinanceService.getSystemAccount(AccountType.BANK)
                : await FinanceService.getSystemAccount(AccountType.CASH);

            const originalRefType = loan.type === 'TAKEN' ? 'LOAN_TAKEN' : 'LOAN_GIVEN';
            const ledgerEntry = await tx.ledgerEntry.findFirst({
                where: {
                    referenceId: loanId,
                    referenceType: originalRefType
                }
            });

            if (ledgerEntry) {
                if (loan.type === 'TAKEN') {
                    await tx.ledgerEntry.update({
                        where: { id: ledgerEntry.id },
                        data: {
                            debitAccountId: financialAccount!.id,
                            creditAccountId: targetAccountId,
                            amount: data.amount,
                            description: `Loan of ${data.amount} taken from ${data.partyName}`
                        }
                    });
                } else {
                    await tx.ledgerEntry.update({
                        where: { id: ledgerEntry.id },
                        data: {
                            debitAccountId: targetAccountId,
                            creditAccountId: financialAccount!.id,
                            amount: data.amount,
                            description: `Loan of ${data.amount} given to ${data.partyName}`
                        }
                    });
                }
            }

            if (loan.status === 'CLOSED') {
                const repaymentRefType = loan.type === 'TAKEN' ? 'LOAN_REPAYMENT' : 'LOAN_RECOVERY';
                const repayEntry = await tx.ledgerEntry.findFirst({
                    where: {
                        referenceId: loanId,
                        referenceType: repaymentRefType
                    }
                });

                if (repayEntry) {
                    if (loan.type === 'TAKEN') {
                        await tx.ledgerEntry.update({
                            where: { id: repayEntry.id },
                            data: {
                                debitAccountId: targetAccountId,
                                creditAccountId: financialAccount!.id,
                                amount: data.amount,
                                description: `Repayment of Loan taken from ${data.partyName}`
                            }
                        });
                    } else {
                        await tx.ledgerEntry.update({
                            where: { id: repayEntry.id },
                            data: {
                                debitAccountId: financialAccount!.id,
                                creditAccountId: targetAccountId,
                                amount: data.amount,
                                description: `Recovery of Loan given to ${data.partyName}`
                            }
                        });
                    }
                }
            }

            return serializePrisma(updatedLoan);
        });
    }

    static async deleteLoan(loanId: string) {
        return await db.$transaction(async (tx: any) => {
            const loan = await tx.loan.findUnique({ where: { id: loanId } });
            if (!loan) throw new Error("Loan not found");

            await tx.ledgerEntry.deleteMany({
                where: {
                    referenceId: loanId,
                    referenceType: {
                        in: ['LOAN_TAKEN', 'LOAN_GIVEN', 'LOAN_REPAYMENT', 'LOAN_RECOVERY']
                    }
                }
            });

            await tx.loan.delete({
                where: { id: loanId }
            });

            const count = await tx.loan.count({ where: { accountId: loan.accountId } });
            const ledgerCount = await tx.ledgerEntry.count({
                where: {
                    OR: [
                        { debitAccountId: loan.accountId },
                        { creditAccountId: loan.accountId }
                    ]
                }
            });
            if (count === 0 && ledgerCount === 0) {
                await tx.account.delete({ where: { id: loan.accountId } }).catch(() => {});
            }

            return { success: true };
        });
    }
}

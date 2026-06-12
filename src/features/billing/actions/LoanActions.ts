'use server';

import { LoanService } from "@/features/billing/services/LoanService";
import { verifySessionCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordLoanAction(data: {
    type: 'TAKEN' | 'GIVEN';
    partyName: string;
    amount: number;
    paymentMethod: 'CASH' | 'BANK';
    notes?: string;
    date?: string;
    interestRate?: number;
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const payload = {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
        };
        const loan = await LoanService.recordLoan(payload);
        
        revalidatePath('/loans');
        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/accounts');

        return { success: true, data: loan };
    } catch (error: any) {
        console.error("[LOAN_ACTION_ERROR]", error);
        return { success: false, error: error.message };
    }
}

export async function repayLoanAction(loanId: string, paymentMethod: 'CASH' | 'BANK', dateStr?: string) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const date = dateStr ? new Date(dateStr) : undefined;
        const loan = await LoanService.repayLoan(loanId, paymentMethod, date);
        
        revalidatePath('/loans');
        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/accounts');

        return { success: true, data: loan };
    } catch (error: any) {
        console.error("[LOAN_REPAY_ERROR]", error);
        return { success: false, error: error.message };
    }
}

export async function updateLoanAction(loanId: string, data: {
    partyName: string;
    amount: number;
    paymentMethod: 'CASH' | 'BANK';
    notes?: string;
    date?: string;
    interestRate?: number;
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const payload = {
            ...data,
            date: data.date ? new Date(data.date) : undefined
        };
        const loan = await LoanService.updateLoan(loanId, payload);
        
        revalidatePath('/loans');
        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/accounts');

        return { success: true, data: loan };
    } catch (error: any) {
        console.error("[LOAN_UPDATE_ERROR]", error);
        return { success: false, error: error.message };
    }
}

export async function deleteLoanAction(loanId: string) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const result = await LoanService.deleteLoan(loanId);
        
        revalidatePath('/loans');
        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/accounts');

        return result;
    } catch (error: any) {
        console.error("[LOAN_DELETE_ERROR]", error);
        return { success: false, error: error.message };
    }
}

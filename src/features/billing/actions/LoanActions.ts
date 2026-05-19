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
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const loan = await LoanService.recordLoan(data);
        
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

export async function repayLoanAction(loanId: string, paymentMethod: 'CASH' | 'BANK') {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const loan = await LoanService.repayLoan(loanId, paymentMethod);
        
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
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        const loan = await LoanService.updateLoan(loanId, data);
        
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

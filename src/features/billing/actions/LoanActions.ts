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

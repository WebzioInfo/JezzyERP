'use server';

import { db } from "@/db/prisma/client";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { verifySessionCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordInternalTransfer(params: {
    sourceAccountId: string;
    targetAccountId: string;
    amount: number;
    description?: string;
    date?: Date;
    confirmed?: boolean; // Add confirmed flag for warning bypass
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        // 1. Safety Check
        const safety = await FinanceService.validateAccountBalance(params.sourceAccountId, params.amount);
        
        if (safety.level === 'BLOCK') {
            return { success: false, error: safety.message, code: 'INSUFFICIENT_FUNDS' };
        }

        if (safety.level === 'WARNING' && !params.confirmed) {
            return { success: false, warning: safety.message, code: 'LOW_BALANCE_WARNING' };
        }

        const result = await db.$transaction(async (tx) => {
            return await FinanceService.recordTransfer(tx, {
                ...params,
                amount: Number(params.amount)
            });
        });

        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/accounts');
        
        return { success: true, data: result };
    } catch (error: any) {
        console.error("[TRANSFER_ACTION_ERROR]", error);
        return { success: false, error: error.message };
    }
}
export async function recordExpenseAction(params: {
    amount: number;
    category: string;
    sourceAccountId: string;
    description?: string;
    date?: Date;
    confirmed?: boolean;
}) {
    const session = await verifySessionCookie();
    if (!session) throw new Error("Unauthorized");

    try {
        // 1. Safety Check
        const safety = await FinanceService.validateAccountBalance(params.sourceAccountId, params.amount);
        
        if (safety.level === 'BLOCK') {
            return { success: false, error: safety.message, code: 'INSUFFICIENT_FUNDS' };
        }

        if (safety.level === 'WARNING' && !params.confirmed) {
            return { success: false, warning: safety.message, code: 'LOW_BALANCE_WARNING' };
        }

        const result = await db.$transaction(async (tx) => {
            return await FinanceService.recordExpense(tx, {
                ...params,
                date: params.date || new Date()
            });
        });

        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/expenses');
        
        return { success: true, data: result };
    } catch (error: any) {
        console.error("[EXPENSE_ACTION_ERROR]", error);
        return { success: false, error: error.message };
    }
}

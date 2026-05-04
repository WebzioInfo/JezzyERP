import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { verifySessionVerified } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        
        const result = await db.$transaction(async (tx) => {
            return await FinanceService.recordExpense(tx, {
                amount: body.amount,
                category: body.category,
                sourceAccountId: body.sourceAccountId,
                description: body.description,
                date: body.date ? new Date(body.date) : new Date(),
            });
        }, { timeout: 30000 });

        return NextResponse.json({ success: true, expense: result });
    } catch (err: any) {
        console.error("Expense API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

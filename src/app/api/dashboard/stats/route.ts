import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { verifySessionVerified } from "@/lib/auth-server";
import { FinanceService } from "@/features/billing/services/FinanceService";

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [totalInvoices, totalClients, totalProducts, outstandingInvoices, recentTransactions] = await Promise.all([
            db.invoice.count(),
            db.client.count(),
            db.product.count(),
            (db.invoice as any).findMany({
                where: { status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] }, deletedAt: null },
                select: {
                    grandTotal: true,
                    allocations: { select: { amount: true } }
                }
            }),
            FinanceService.getRecentTransactions(5)
        ]);

        const totalReceivable = outstandingInvoices.reduce((sum: number, inv: any) => {
            const allocated = (inv.allocations as any[]).reduce((a: number, alloc: any) => a + Number(alloc.amount), 0);
            return sum + (Number(inv.grandTotal) - allocated);
        }, 0);

        return NextResponse.json({
            totalInvoices,
            totalClients,
            totalProducts,
            totalReceivable,
            recentTransactions
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

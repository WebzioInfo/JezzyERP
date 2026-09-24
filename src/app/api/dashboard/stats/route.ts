import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { verifySessionVerified } from "@/lib/auth-server";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { serializePrisma } from "@/utils/serialization";

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const [
            totalInvoices,
            totalPurchases,
            totalClients,
            totalVendors,
            totalProducts,
            todaySalesInvoices,
            todayPayments,
            outstandingInvoices,
            outstandingPurchases,
            stockResult,
            recentTransactions
        ] = await Promise.all([
            db.invoice.count({ where: { deletedAt: null } }),
            db.purchase.count({ where: { deletedAt: null } }),
            db.client.count({ where: { deletedAt: null, active: true } }),
            db.vendor.count({ where: { deletedAt: null, active: true } }),
            db.product.count({ where: { deletedAt: null, active: true } }),
            
            // Today's Sales
            db.invoice.findMany({
                where: {
                    deletedAt: null,
                    date: { gte: startOfToday, lte: endOfToday }
                },
                select: { grandTotal: true }
            }),

            // Today's Collections
            db.payment.findMany({
                where: {
                    deletedAt: null,
                    paidAt: { gte: startOfToday, lte: endOfToday }
                },
                select: { amount: true }
            }),

            // Outstanding Receivables
            db.invoice.findMany({
                where: { deletedAt: null },
                select: {
                    grandTotal: true,
                    allocations: { select: { amount: true } }
                }
            }),

            // Outstanding Payables
            db.purchase.findMany({
                where: { deletedAt: null },
                select: {
                    grandTotal: true,
                    allocations: { select: { amount: true } }
                }
            }),

            db.stock.aggregate({ _sum: { quantity: true } }),
            FinanceService.getRecentTransactions(8)
        ]);

        const todaySales = todaySalesInvoices.reduce((sum, inv) => sum + inv.grandTotal.toNumber(), 0);
        const todayCollections = todayPayments.reduce((sum, pay) => sum + pay.amount.toNumber(), 0);

        const totalReceivable = outstandingInvoices.reduce((sum, inv) => {
            const grand = inv.grandTotal.toNumber();
            const allocated = (inv.allocations || []).reduce((a, alloc) => a + alloc.amount.toNumber(), 0);
            return sum + Math.max(0, grand - allocated);
        }, 0);

        const totalPayable = outstandingPurchases.reduce((sum, pur) => {
            const grand = pur.grandTotal.toNumber();
            const allocated = (pur.allocations || []).reduce((a, alloc) => a + alloc.amount.toNumber(), 0);
            return sum + Math.max(0, grand - allocated);
        }, 0);

        const totalStock = Number(stockResult._sum.quantity || 0);

        return NextResponse.json(serializePrisma({
            totalInvoices,
            totalPurchases,
            totalClients,
            totalVendors,
            totalProducts,
            totalStock,
            todaySales,
            todayCollections,
            totalReceivable,
            totalPayable,
            recentTransactions
        }));

    } catch (error: any) {
        console.error("[DASHBOARD_STATS_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

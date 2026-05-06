import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { db } from "@/db/prisma/client";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const range = searchParams.get("range") || "all";
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const clientId = searchParams.get("clientId");
        const status = searchParams.get("status");
        const gstType = searchParams.get("gstType");

        let where: any = { deletedAt: null };

        // Date Filters
        const now = new Date();
        if (range === "today") {
            where.date = { gte: startOfDay(now), lte: endOfDay(now) };
        } else if (range === "yesterday") {
            const yesterday = subDays(now, 1);
            where.date = { gte: startOfDay(yesterday), lte: endOfDay(yesterday) };
        } else if (range === "last7") {
            where.date = { gte: subDays(now, 7) };
        } else if (range === "last30") {
            where.date = { gte: subDays(now, 30) };
        } else if (range === "thisMonth") {
            where.date = { gte: startOfMonth(now), lte: endOfMonth(now) };
        } else if (range === "lastMonth") {
            const lastMonth = subMonths(now, 1);
            where.date = { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) };
        } else if (range === "custom" && startDate && endDate) {
            where.date = { gte: new Date(startDate), lte: new Date(endDate) };
        }

        // Other Filters
        if (clientId) where.clientId = clientId;
        if (status) where.status = status;
        if (gstType) where.gstType = gstType;

        const count = await db.invoice.count({ where });
        
        // Estimation: Roughly 150KB per PDF (based on current implementation)
        const estimatedSizeMB = (count * 0.15).toFixed(2);

        return NextResponse.json({ 
            count, 
            estimatedSize: `${estimatedSizeMB} MB`,
            filtersApplied: where
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

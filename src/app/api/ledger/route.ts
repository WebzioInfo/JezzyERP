import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { db } from "@/db/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");

        if (!clientId) {
            return NextResponse.json({ error: "clientId is required" }, { status: 400 });
        }

        const account = await db.account.findUnique({
            where: { clientId }
        });

        if (!account) {
            return NextResponse.json({ entries: [] });
        }

        const rawEntries = await (db.ledgerEntry as any).findMany({
            where: {
                OR: [
                    { debitAccountId: account.id },
                    { creditAccountId: account.id }
                ]
            },
            orderBy: { date: 'desc' },
            select: {
                id: true,
                amount: true,
                date: true,
                description: true,
                referenceType: true,
                referenceId: true,
                debitAccountId: true,
                creditAccountId: true,
                createdAt: true,
                // transactionType omitted — column not yet migrated to DB
                debitAccount: { select: { id: true, name: true, type: true } },
                creditAccount: { select: { id: true, name: true, type: true } },
            }
        });


        // Transform for UI: Virtual 'type' based on which side the client is on
        const entries = rawEntries.map((entry: any) => ({
            ...entry,
            type: entry.debitAccountId === account.id ? 'DEBIT' : 'CREDIT'
        }));

        return NextResponse.json({ entries });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

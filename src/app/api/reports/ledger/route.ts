import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { db } from "@/db/prisma/client";
import { PdfReportService } from "@/features/billing/services/PdfReportService";

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");

        if (!clientId) {
            return NextResponse.json({ error: "clientId is required" }, { status: 400 });
        }

        // 1. Fetch Client
        const client = await db.client.findUnique({
            where: { id: clientId }
        });
        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        // 2. Fetch Ledger Entries
        const entries = await (db as any).ledgerEntry.findMany({
            where: { clientId },
            orderBy: { date: 'asc' }
        });

        // 3. Fetch Settings
        const settings = await db.companySetting.findFirst() || {
            companyName: "JEZZY ENTERPRISES",
            gstin: "32BMAPJ5504M1Z9",
            address1: "MP 4/3 IIA, MOONIYUR",
            address2: "VELIMUKKU PO, MALAPPURAM DIST",
            city: "Malappuram",
            pincode: "676317",
            phone: "+91 85531 85300",
            email: "jezzyenterprises@gmail.com",
        };

        // 4. Generate PDF
        const buffer = await PdfReportService.generateLedgerStatement(client, entries, settings);

        const safeFileName = `Statement_${client.name.split(' ')[0]}_${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${safeFileName}"`,
                "Content-Length": String(buffer.length),
            },
        });
    } catch (err: any) {
        console.error("[LEDGER_REPORT]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

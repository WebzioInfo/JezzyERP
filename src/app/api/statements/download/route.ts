import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { StatementPdfService } from "@/features/billing/services/StatementPdfService";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { partyId, partyType, startDate, endDate } = body;

        if (!partyId || !partyType) {
            return NextResponse.json({ error: "partyId and partyType ('CLIENT' or 'SUPPLIER') are required" }, { status: 400 });
        }

        const { buffer, fileName } = await StatementPdfService.generateStatementPdf(
            partyId,
            partyType as 'CLIENT' | 'SUPPLIER',
            { startDate, endDate }
        );

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Length": String(buffer.length)
            }
        });
    } catch (err: any) {
        console.error("[STATEMENT_DOWNLOAD_ERROR]", err);
        return NextResponse.json({ error: err.message || "Failed to generate statement PDF" }, { status: 500 });
    }
}

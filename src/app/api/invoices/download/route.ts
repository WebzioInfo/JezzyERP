import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { InvoicePdfService, ExportFormat } from "@/features/billing/services/InvoicePdfService";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json().catch(() => ({}));
        const invoiceId = body.invoiceId || body.id;
        const format: ExportFormat = body.format || "ORIGINAL";

        if (!invoiceId) {
            return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
        }

        const result = await InvoicePdfService.generateInvoicePdf(invoiceId, format);

        const headers: Record<string, string> = {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${result.fileName}"`,
            "Content-Length": String(result.buffer.length),
        };

        if (result.hasEwayBill) {
            headers["X-EwayBill-Merged"] = String(result.ewayBillMerged);
            if (result.mergeError) {
                headers["X-EwayBill-Error"] = encodeURIComponent(result.mergeError);
            }
        }

        return new NextResponse(new Uint8Array(result.buffer), {
            status: 200,
            headers,
        });
    } catch (err: unknown) {
        console.error("[INVOICE_DOWNLOAD]", err);
        const message = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const invoiceId = searchParams.get("invoiceId") || searchParams.get("id");
        const format = (searchParams.get("format") as ExportFormat) || "ORIGINAL";

        if (!invoiceId) {
            return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
        }

        const result = await InvoicePdfService.generateInvoicePdf(invoiceId, format);

        const headers: Record<string, string> = {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${result.fileName}"`,
            "Content-Length": String(result.buffer.length),
        };

        if (result.hasEwayBill) {
            headers["X-EwayBill-Merged"] = String(result.ewayBillMerged);
            if (result.mergeError) {
                headers["X-EwayBill-Error"] = encodeURIComponent(result.mergeError);
            }
        }

        return new NextResponse(new Uint8Array(result.buffer), {
            status: 200,
            headers,
        });
    } catch (err: unknown) {
        console.error("[INVOICE_DOWNLOAD_GET]", err);
        const message = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

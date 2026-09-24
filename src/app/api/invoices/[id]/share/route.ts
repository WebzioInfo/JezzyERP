import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { InvoiceShareService } from "@/features/billing/services/InvoiceShareService";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const params = await props.params;
        const invoiceId = params.id;
        const data = await InvoiceShareService.getShareData(invoiceId);

        const waMessage = InvoiceShareService.buildWhatsAppShareMessage(data);
        const emailContent = InvoiceShareService.buildEmailShareContent(data);

        return NextResponse.json({
            data,
            whatsapp: {
                message: waMessage,
                cleanPhone: data.cleanPhone,
                url: data.cleanPhone ? `https://wa.me/${data.cleanPhone}?text=${encodeURIComponent(waMessage)}` : null
            },
            email: emailContent
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch share details" }, { status: 400 });
    }
}

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const params = await props.params;
        const invoiceId = params.id;
        const body = await req.json();
        const { channel, overrideRecipient } = body;

        if (channel === "whatsapp") {
            const result = await InvoiceShareService.prepareWhatsAppShare(
                session.userId,
                invoiceId,
                "SHARE",
                overrideRecipient
            );
            return NextResponse.json(result);
        } else if (channel === "email") {
            const result = await InvoiceShareService.sendEmail(
                session.userId,
                invoiceId,
                "SHARE",
                overrideRecipient
            );
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: "Invalid channel specified. Use 'whatsapp' or 'email'." }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Share failed" }, { status: 400 });
    }
}

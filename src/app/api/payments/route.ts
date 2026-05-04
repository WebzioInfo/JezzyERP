import { NextRequest, NextResponse } from 'next/server';
import { verifySessionVerified } from '@/lib/auth-server';
import { PaymentService } from '@/features/billing/services/PaymentService';
import { handleActionError } from '@/lib/validation';

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        
        if (!body.clientId) {
            return NextResponse.json({ error: "clientId is required" }, { status: 400 });
        }

        const payment = await PaymentService.recordPayment({
            ...body,
            partyId: body.partyId || body.clientId,
            partyType: body.partyType || 'CLIENT',
            recordedBy: session.userId,
            paidAt: body.paidAt ? new Date(body.paidAt) : new Date()
        });

        return NextResponse.json(payment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(handleActionError(error), { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payments = await PaymentService.getAllPayments();
        return NextResponse.json(payments, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

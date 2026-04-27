"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvoiceService } from "../services/InvoiceService";
import { PaymentService } from "../services/PaymentService";
import { handleActionError } from "@/lib/validation";
import { db } from "@/db/prisma/client";
// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export const InvoiceStatus = {
  DRAFT: 'DRAFT' as const,
  SENT: 'SENT' as const,
  PARTIAL: 'PARTIAL' as const,
  PAID: 'PAID' as const,
  OVERDUE: 'OVERDUE' as const,
  CANCELLED: 'CANCELLED' as const,
};

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'OTHER';
export const PaymentMethod = {
  CASH: 'CASH' as const,
  BANK_TRANSFER: 'BANK_TRANSFER' as const,
  UPI: 'UPI' as const,
  CHEQUE: 'CHEQUE' as const,
  OTHER: 'OTHER' as const,
};

const invoiceService = new InvoiceService();

export async function createInvoiceAction(data: any) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const invoice = await invoiceService.createInvoice(session.userId, data);
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        return { success: true, invoiceId: invoice.id };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function markInvoiceSentAction(invoiceId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    if (!invoiceId) return { error: "Invoice ID is required" };

    try {
        await db.invoice.update({
            where: { id: invoiceId },
            data: { status: InvoiceStatus.SENT },
        });
        revalidatePath(`/invoices/${invoiceId}`);
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function markInvoicePaidAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const invoiceId = formData.get("invoiceId") as string;
    if (!invoiceId) return { error: "Invoice ID is required" };

    try {
        const invoice = await db.invoice.findUnique({
            where: { id: invoiceId },
            select: { grandTotal: true },
        });
        if (!invoice) return { error: "Invoice not found" };

        await db.invoice.update({
            where: { id: invoiceId },
            data: { 
                status: InvoiceStatus.PAID, 
                amountPaid: invoice.grandTotal 
            },
        });
        revalidatePath(`/invoices/${invoiceId}`);
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function recordPaymentAction(data: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
    paidAt: string;
}) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const payment = await PaymentService.recordPayment({
            ...data,
            paidAt: new Date(data.paidAt),
            recordedBy: session.userId,
        });

        revalidatePath(`/invoices/${data.invoiceId}`);
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
        revalidatePath("/payments");

        return { success: true, paymentId: payment.id };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function updateInvoiceAction(invoiceId: string, data: any) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const invoice = await invoiceService.updateInvoice(invoiceId, session.userId, data);
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        revalidatePath(`/invoices/${invoiceId}`);
        return { success: true, invoiceId: invoice.id };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function deleteInvoiceAction(invoiceId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await invoiceService.softDeleteInvoice(invoiceId, session.userId);
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function restoreInvoiceAction(invoiceId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await invoiceService.restoreInvoice(invoiceId, session.userId);
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function permanentlyDeleteInvoiceAction(invoiceId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await invoiceService.permanentlyDeleteInvoice(invoiceId, session.userId);
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvoiceService } from "../services/InvoiceService";
import { PaymentService } from "../services/PaymentService";
import { AllocationService } from "../services/AllocationService";
import { handleActionError } from "@/lib/validation";
import { db } from "@/db/prisma/client";

// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'OTHER';

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
            data: { status: 'SENT' },
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
            select: {
                id: true,
                grandTotal: true,
                clientId: true,
                allocations: {
                    select: { amount: true }
                }
            }
        } as any);

        if (!invoice) return { error: "Invoice not found" };

        const totalAllocated = (invoice as any).allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
        const due = Number((invoice as any).grandTotal) - totalAllocated;

        if (due > 0) {
            // Record a full payment to mark it as paid
            await PaymentService.recordPayment({
                partyId: invoice.clientId,
                partyType: 'CLIENT',
                invoiceId: invoiceId,
                amount: due,
                paidAt: new Date(),
                method: 'CASH', // Default for "Mark as Paid" button
                notes: "Marked as paid from invoice actions",
                recordedBy: session.userId,
            });
        }

        revalidatePath(`/invoices/${invoiceId}`);
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}


export async function recordPaymentAction(data: {
    clientId?: string;
    invoiceId?: string | null;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
    paidAt: string;
}) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        let finalClientId = data.clientId;

        if (data.invoiceId) {
            const invoice = await db.invoice.findUnique({
                where: { id: data.invoiceId },
                select: { clientId: true }
            });
            if (!invoice) return { error: "Invoice not found" };
            finalClientId = invoice.clientId;
        }

        if (!finalClientId) {
            return { error: "Client selection is required for direct advances." };
        }

        const payment = await PaymentService.recordPayment({
            ...data,
            partyId: finalClientId,
            partyType: 'CLIENT',
            paidAt: new Date(data.paidAt),
            recordedBy: session.userId,
        });

        if (data.invoiceId) revalidatePath(`/invoices/${data.invoiceId}`);
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
export async function getClientUnallocatedBalanceAction(clientId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const balance = await AllocationService.getUnallocatedBalance(db, clientId, 'CLIENT');
        return { success: true, balance };
    } catch (error: any) {
        return handleActionError(error);
    }
}

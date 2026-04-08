"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { InvoiceService } from "../services/InvoiceService";
import { handleActionError } from "@/lib/validation";
import { db } from "@/db/prisma/client";
import { redirect } from "next/navigation";

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
            data: { status: "SENT" },
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
            data: { status: "PAID", amountPaid: invoice.grandTotal },
        });
        revalidatePath(`/invoices/${invoiceId}`);
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function recordPaymentAction(data: {
    invoiceId: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
    paidAt: string;
}) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const payment = await db.payment.create({
            data: {
                invoiceId: data.invoiceId,
                amount: data.amount,
                method: data.method,
                reference: data.reference || null,
                notes: data.notes || null,
                paidAt: new Date(data.paidAt),
                recordedBy: session.userId,
            },
        });

        // Re-calculate amountPaid and update invoice status
        const allPayments = await db.payment.aggregate({
            where: { invoiceId: data.invoiceId },
            _sum: { amount: true },
        });

        const invoice = await db.invoice.findUnique({
            where: { id: data.invoiceId },
            select: { grandTotal: true },
        });

        if (invoice) {
            const totalPaid = allPayments._sum.amount?.toNumber() || 0;
            const grandTotal = invoice.grandTotal.toNumber();
            const newStatus = totalPaid >= grandTotal ? "PAID" : "PARTIAL";

            await db.invoice.update({
                where: { id: data.invoiceId },
                data: { amountPaid: totalPaid, status: newStatus },
            });
        }

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

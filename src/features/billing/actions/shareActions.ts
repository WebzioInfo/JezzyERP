"use server";

import { verifySessionVerified } from "@/lib/auth-server";
import { InvoiceShareService } from "../services/InvoiceShareService";
import { handleActionError } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function getInvoiceShareDataAction(invoiceId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const data = await InvoiceShareService.getShareData(invoiceId);
        return { success: true, data };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function prepareWhatsAppShareAction(
    invoiceId: string,
    actionType: 'SHARE' | 'FOLLOWUP',
    overridePhone?: string,
    customMessage?: string
) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const result = await InvoiceShareService.prepareWhatsAppShare(
            session.userId,
            invoiceId,
            actionType,
            overridePhone,
            customMessage
        );
        revalidatePath(`/invoices/${invoiceId}`);
        return result;
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function sendInvoiceEmailAction(
    invoiceId: string,
    actionType: 'SHARE' | 'FOLLOWUP',
    overrideEmail?: string,
    customBody?: string,
    customSubject?: string
) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const result = await InvoiceShareService.sendEmail(
            session.userId,
            invoiceId,
            actionType,
            overrideEmail,
            customBody,
            customSubject
        );
        revalidatePath(`/invoices/${invoiceId}`);
        return result;
    } catch (error: any) {
        return handleActionError(error);
    }
}

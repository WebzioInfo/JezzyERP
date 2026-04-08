"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { QuotationService } from "../services/QuotationService";
import { handleActionError } from "@/lib/validation";
import { db } from "@/db/prisma/client";

export async function createQuotationAction(data: any) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        const quotation = await QuotationService.createQuotation(session.userId, data);
        revalidatePath("/quotations");
        revalidatePath("/dashboard");
        return { success: true, quotationId: quotation.id };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function convertQuotationToInvoiceAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const quotationId = formData.get("quotationId") as string;
    if (!quotationId) return { error: "Quotation ID is required" };

    try {
        const invoice = await QuotationService.convertToInvoice(session.userId, quotationId);
        revalidatePath(`/quotations/${quotationId}`);
        revalidatePath("/quotations");
        revalidatePath("/invoices");
        revalidatePath("/dashboard");
        return { success: true, invoiceId: invoice.id };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function updateQuotationStatusAction(quotationId: string, status: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await db.quotation.update({
            where: { id: quotationId },
            data: { status },
        });
        revalidatePath(`/quotations/${quotationId}`);
        revalidatePath("/quotations");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

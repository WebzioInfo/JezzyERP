"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { ClientService } from "../services/ClientService";
import { handleActionError } from "@/lib/validation";

export async function createClientAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const data = {
        name: formData.get("name") as string,
        gst: (formData.get("gst") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        address1: formData.get("address1") as string,
        address2: (formData.get("address2") as string) || undefined,
        pinCode: (formData.get("pinCode") as string) || undefined,
        state: formData.get("state") as string,
    };

    try {
        await ClientService.createClient(session.userId, data);
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function updateClientAction(clientId: string, formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const data = {
        name: formData.get("name") as string,
        gst: (formData.get("gst") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        address1: formData.get("address1") as string,
        address2: (formData.get("address2") as string) || undefined,
        pinCode: (formData.get("pinCode") as string) || undefined,
        state: formData.get("state") as string,
    };

    try {
        await ClientService.updateClient(session.userId, clientId, data);
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function deleteClientAction(clientId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await ClientService.deleteClient(session.userId, clientId);
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

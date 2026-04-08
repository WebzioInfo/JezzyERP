"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { CompanyService } from "../services/CompanyService";
import { handleActionError } from "@/lib/validation";

export async function updateCompanySettingsAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    if (!id) return { error: "ID is required" };

    const data = {
        companyName: formData.get("companyName") as string,
        gstin: formData.get("gstin") as string,
        pan: formData.get("pan") as string,
        address1: formData.get("address1") as string,
        address2: formData.get("address2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        bankName: formData.get("bankName") as string,
        bankBranch: formData.get("bankBranch") as string,
        bankAccountNo: formData.get("bankAccountNo") as string,
        bankIfsc: formData.get("bankIfsc") as string,
        bankAccountName: formData.get("bankAccountName") as string,
        showPkgDetails: formData.get("showPkgDetails") === "true",
    };

    try {
        await CompanyService.updateSettings(id, data);
        revalidatePath("/settings");
        revalidatePath("/dashboard");
        revalidatePath("/invoices");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

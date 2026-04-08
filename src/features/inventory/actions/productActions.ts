"use server"

import { verifySessionVerified } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { ProductService } from "../services/ProductService";
import { handleActionError } from "@/lib/validation";

export async function createProductAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const data = {
        description: formData.get("description") as string,
        sku: (formData.get("sku") as string) || undefined,
        hsn: (formData.get("hsn") as string) || undefined,
        purchaseRate: formData.get("purchaseRate") as string,
        sellingRate: formData.get("sellingRate") as string,
        gstRate: formData.get("gstRate") as string,
        unit: (formData.get("unit") as string) || "NOS",
        notes: (formData.get("notes") as string) || undefined,
        pkgType: (formData.get("pkgType") as string) || "BOX",
    };

    try {
        await ProductService.createProduct(session.userId, data);
        revalidatePath("/products");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function updateProductAction(productId: string, formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    const data = {
        description: formData.get("description") as string,
        sku: (formData.get("sku") as string) || undefined,
        hsn: (formData.get("hsn") as string) || undefined,
        purchaseRate: formData.get("purchaseRate") as string,
        sellingRate: formData.get("sellingRate") as string,
        gstRate: formData.get("gstRate") as string,
        unit: (formData.get("unit") as string) || "NOS",
        notes: (formData.get("notes") as string) || undefined,
        pkgType: (formData.get("pkgType") as string) || "BOX",
    };

    try {
        await ProductService.updateProduct(session.userId, productId, data);
        revalidatePath("/products");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

export async function deleteProductAction(productId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    try {
        await ProductService.deleteProduct(session.userId, productId);
        revalidatePath("/products");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return handleActionError(error);
    }
}

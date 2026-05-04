"use server";

import { VendorService } from "./services/VendorService";
import { PurchaseService } from "./services/PurchaseService";
import { revalidatePath } from "next/cache";
import { verifySessionVerified } from "@/lib/auth-server";

const vendorService = new VendorService();
const purchaseService = new PurchaseService();

export async function createVendorAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");
    const data = {
        name: formData.get("name") as string,
        gst: formData.get("gst") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address1: formData.get("address1") as string,
        address2: formData.get("address2") as string,
        state: formData.get("state") as string,
        pinCode: formData.get("pinCode") as string,
    };

    const result = await vendorService.createVendor(data);
    revalidatePath("/vendors");
    return result;
}

export async function updateVendorAction(id: string, formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");
    const data = {
        name: formData.get("name") as string,
        gst: formData.get("gst") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address1: formData.get("address1") as string,
        address2: formData.get("address2") as string,
        state: formData.get("state") as string,
        pinCode: formData.get("pinCode") as string,
    };

    await vendorService.updateVendor(id, data);
    revalidatePath("/vendors");
}

export async function deleteVendorAction(id: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    await vendorService.deleteVendor(id);
    revalidatePath("/vendors");
}

export async function createPurchaseAction(formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");
    
    const rawItems = formData.get("items") as string;
    const items = JSON.parse(rawItems);

    const data = {
        vendorId: formData.get("vendorId") as string,
        date: new Date(formData.get("date") as string),
        gstType: formData.get("gstType") as string,
        ewayBill: formData.get("ewayBill") as string,
        ewayBillUrl: formData.get("ewayBillUrl") as string,
        vehicleNo: formData.get("vehicleNo") as string,
        notes: formData.get("notes") as string,
        items: items,
        subTotal: Number(formData.get("subTotal")),
        taxTotal: Number(formData.get("taxTotal")),
        grandTotal: Number(formData.get("grandTotal")),
        isFreightCollect: formData.get("isFreightCollect") === "true",
        freightAmount: Number(formData.get("freightAmount") || 0),
        freightTaxPercent: Number(formData.get("freightTaxPercent") || 0),
    };

    await purchaseService.createPurchase(session.userId, data);
    revalidatePath("/purchases");
    revalidatePath("/reports");
}

export async function updatePurchaseAction(id: string, formData: FormData) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");
    
    const rawItems = formData.get("items") as string;
    const items = JSON.parse(rawItems);

    const data = {
        vendorId: formData.get("vendorId") as string,
        date: new Date(formData.get("date") as string),
        gstType: formData.get("gstType") as string,
        ewayBill: formData.get("ewayBill") as string,
        ewayBillUrl: formData.get("ewayBillUrl") as string,
        vehicleNo: formData.get("vehicleNo") as string,
        notes: formData.get("notes") as string,
        items: items,
        subTotal: Number(formData.get("subTotal")),
        taxTotal: Number(formData.get("taxTotal")),
        grandTotal: Number(formData.get("grandTotal")),
        isFreightCollect: formData.get("isFreightCollect") === "true",
        freightAmount: Number(formData.get("freightAmount") || 0),
        freightTaxPercent: Number(formData.get("freightTaxPercent") || 0),
    };

    await purchaseService.updatePurchase(id, session.userId, data);
    revalidatePath("/purchases");
    revalidatePath(`/purchases/${id}`);
    revalidatePath("/reports");
}


export async function deletePurchaseAction(purchaseId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    await purchaseService.deletePurchase(purchaseId);
    revalidatePath("/purchases");
    revalidatePath("/dashboard");
}

export async function restorePurchaseAction(purchaseId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    await purchaseService.restorePurchase(purchaseId, session.userId);
    revalidatePath("/purchases");
    revalidatePath("/dashboard");
}

export async function permanentlyDeletePurchaseAction(purchaseId: string) {
    const session = await verifySessionVerified();
    if (!session) throw new Error("Unauthorized");

    await purchaseService.permanentlyDeletePurchase(purchaseId, session.userId);
    revalidatePath("/purchases");
    revalidatePath("/dashboard");
}

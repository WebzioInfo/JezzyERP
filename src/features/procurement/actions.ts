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

    await vendorService.createVendor(data);
    revalidatePath("/vendors");
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
    };

    await purchaseService.createPurchase(session.userId, data);
    revalidatePath("/purchases");
    revalidatePath("/reports");
}

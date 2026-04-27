"use server";

import { StockService } from "../services/StockService";
import { revalidatePath } from "next/cache";

export async function manualStockAdjustmentAction(formData: FormData) {
    const productId = formData.get("productId") as string;
    const quantityChange = parseFloat(formData.get("quantityChange") as string);
    const notes = formData.get("notes") as string;
    const type = quantityChange >= 0 ? 'ADD' : 'REMOVE';

    if (!productId || isNaN(quantityChange)) {
        return { error: "Invalid product or quantity." };
    }

    try {
        await StockService.recordChange({
            productId,
            type: 'MANUAL',
            quantityChange,
            notes: notes || "Manual Adjustment"
        });
        
        revalidatePath("/inventory");
        revalidatePath("/products");
        
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to adjust stock." };
    }
}

export async function deleteStockLogAction(logId: string) {
    try {
        await StockService.deleteStockLog(logId);
        revalidatePath("/inventory");
        revalidatePath("/products");
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to delete log entry." };
    }
}

export async function updateStockLogAction(logId: string, quantityChange: number, notes?: string) {
    try {
        await StockService.updateStockLog(logId, quantityChange, notes);
        revalidatePath("/inventory");
        revalidatePath("/products");
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to update log entry." };
    }
}

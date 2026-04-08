"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseAction } from "../actions";

export function usePurchaseEngine(products: any[], initialData?: any) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [state, setState] = useState({
        vendorId: initialData?.vendorId || "",
        invoiceNo: initialData?.invoiceNo || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        gstType: initialData?.gstType || "CGST_SGST",
        ewayBill: initialData?.ewayBill || "",
        ewayBillUrl: initialData?.ewayBillUrl || "",
        vehicleNo: initialData?.vehicleNo || "",
        notes: initialData?.notes || "",
        items: initialData?.lineItems || []
    });

    const setVendorId = (vendorId: string) => setState(s => ({ ...s, vendorId }));
    const setInvoiceNo = (invoiceNo: string) => setState(s => ({ ...s, invoiceNo }));
    const setDate = (date: string) => setState(s => ({ ...s, date }));
    const setGstType = (gstType: string) => setState(s => ({ ...s, gstType }));
    const setEwayBill = (ewayBill: string) => setState(s => ({ ...s, ewayBill }));
    const setEwayBillUrl = (ewayBillUrl: string) => setState(s => ({ ...s, ewayBillUrl }));
    const setVehicleNo = (vehicleNo: string) => setState(s => ({ ...s, vehicleNo }));
    const setNotes = (notes: string) => setState(s => ({ ...s, notes }));

    const handleAddItem = () => {
        setState(s => ({
            ...s,
            items: [...s.items, { description: "", qty: 1, rate: 0, taxPercent: 18, hsn: "" }]
        }));
    };

    const updateItem = (index: number, updates: any) => {
        setState(s => {
            const newItems = [...s.items];
            newItems[index] = { ...newItems[index], ...updates };
            return { ...s, items: newItems };
        });
    };

    const removeItem = (index: number) => {
        setState(s => ({
            ...s,
            items: s.items.filter((_, i: number) => i !== index)
        }));
    };

    const handleProductSelect = (index: number, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            updateItem(index, {
                productId: product.id,
                description: product.description,
                rate: Number(product.purchaseRate),
                taxPercent: Number(product.gstRate),
                hsn: product.hsn || ""
            });
        }
    };

    const calculateTotals = () => {
        let subTotal = 0;
        let taxTotal = 0;

        const items = state.items.map((item: any) => {
            const amount = item.qty * item.rate;
            const tax = (amount * item.taxPercent) / 100;
            subTotal += amount;
            taxTotal += tax;
            return { ...item, taxAmount: tax, totalAmount: amount + tax };
        });

        return {
            items,
            subTotal,
            taxTotal,
            grandTotal: subTotal + taxTotal
        };
    };

    const handleSubmit = async () => {
        if (!state.vendorId || state.items.length === 0) {
            setError("Please select a vendor and add at least one item.");
            return;
        }

        const totals = calculateTotals();
        const payload = {
            ...state,
            ...totals
        };

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (key === 'items') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as string);
            }
        });

        startTransition(async () => {
            try {
                await createPurchaseAction(formData);
                router.push("/purchases");
            } catch (err: any) {
                setError(err.message || "Failed to create purchase");
            }
        });
    };

    return {
        state,
        isPending,
        error,
        calculations: calculateTotals(),
        setVendorId, setInvoiceNo, setDate, setGstType, setEwayBill, setEwayBillUrl, setVehicleNo, setNotes,
        handleAddItem, updateItem, removeItem, handleProductSelect, handleSubmit
    };
}

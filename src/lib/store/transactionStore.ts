import { create } from 'zustand';
import { calculateBillingTotals, calculateItemTotals } from '@/utils/financials';
import { Address } from '@/types/invoice';
import { nanoid } from 'nanoid';

export type TransactionItem = {
    id: string; // Stable ID
    productId?: string;
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    unit: string;
    pkgCount?: number;
    pkgType?: string;
    taxPercent: number;
    taxAmount?: number;
    totalAmount?: number;
};

interface TransactionState {
    mode: "INVOICE" | "QUOTATION" | "PURCHASE";
    entityId: string; // clientId or vendorId
    date: string;
    validUntil: string;
    gstType: "CGST_SGST" | "IGST" | "NO_GST";
    items: TransactionItem[];
    invoiceNo: string;
    ewayBill: string;
    ewayBillUrl: string;
    vehicleNo: string;
    notes: string;
    billingAddress: Address;
    shippingAddress: Address;
    shippingSameAsBilling: boolean;

    // Actions
    setMode: (mode: "INVOICE" | "QUOTATION" | "PURCHASE") => void;
    setEntityId: (id: string) => void;
    setField: <K extends keyof TransactionState>(field: K, value: TransactionState[K]) => void;
    addItem: () => void;
    addItems: (items: any[]) => void;
    updateItem: (id: string, updates: Partial<TransactionItem>) => void;
    removeItem: (id: string) => void;
    reset: () => void;
    initialize: (data: any) => void;
}

const emptyAddress: Address = {
    name: "",
    address1: "",
    address2: "",
    state: "",
    pinCode: "",
    phone: "",
    gst: ""
};

const initialState = {
    mode: "INVOICE" as const,
    entityId: "",
    date: new Date().toISOString().split('T')[0],
    validUntil: "",
    gstType: "CGST_SGST" as const,
    items: [],
    invoiceNo: "",
    ewayBill: "",
    ewayBillUrl: "",
    vehicleNo: "",
    notes: "",
    billingAddress: { ...emptyAddress },
    shippingAddress: { ...emptyAddress },
    shippingSameAsBilling: true,
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
    ...initialState,

    setMode: (mode) => set({ mode }),
    setEntityId: (entityId) => set({ entityId }),
    setField: (field, value) => set({ [field]: value } as any),

    addItem: () => {
        const newItem: TransactionItem = {
            id: nanoid(),
            description: "",
            hsn: "",
            qty: 1,
            rate: 0,
            unit: "NOS",
            pkgCount: 1,
            pkgType: "BOX",
            taxPercent: 18,
            taxAmount: 0,
            totalAmount: 0
        };
        set((state) => ({ items: [...state.items, newItem] }));
    },

    addItems: (newItems) => {
        const itemsWithIds = newItems.map(item => ({
            ...item,
            id: item.id || nanoid(),
            qty: Number(item.qty || 0),
            rate: Number(item.rate || 0),
            taxPercent: Number(item.taxPercent || 0)
        }));
        set((state) => ({ items: [...state.items, ...itemsWithIds] }));
    },

    updateItem: (id, updates) => {
        set((state) => {
            const items = state.items.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, ...updates };
                    // Recalculate item totals if qty, rate, or tax changes
                    if ('qty' in updates || 'rate' in updates || 'taxPercent' in updates) {
                        const calculated = calculateItemTotals(updated.qty, updated.rate, updated.taxPercent);
                        return { ...updated, ...calculated };
                    }
                    return updated;
                }
                return item;
            });
            return { items };
        });
    },

    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== id)
        }));
    },

    reset: () => set(initialState),

    initialize: (data) => {
        if (!data) return;
        
        const items = (data.lineItems || data.items || []).map((item: any) => {
            const { qty: _q, rate: _r, taxPercent: _t, id: _i, ...rest } = item;
            const qty = Number(item.qty || 0);
            const rate = Number(item.rate || 0);
            const taxPercent = Number(item.taxPercent || 0);
            const totals = calculateItemTotals(qty, rate, taxPercent);
            return {
                ...rest,
                id: nanoid(),
                ...totals
            };
        });

        set({
            mode: data.mode || "INVOICE",
            entityId: data.clientId || data.vendorId || "",
            date: data.date ? (typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().split('T')[0]) : initialState.date,
            validUntil: data.validUntil || "",
            gstType: data.gstType || "CGST_SGST",
            invoiceNo: data.invoiceNo || "",
            ewayBill: data.ewayBill || "",
            ewayBillUrl: data.ewayBillUrl || "",
            vehicleNo: data.vehicleNo || "",
            notes: data.notes || "",
            items,
            billingAddress: {
                name: data.billingName || data.billingAddress?.name || "",
                address1: data.billingAddress1 || data.billingAddress?.address1 || "",
                address2: data.billingAddress2 || data.billingAddress?.address2 || "",
                state: data.billingState || data.billingAddress?.state || "",
                pinCode: data.billingPinCode || data.billingAddress?.pinCode || "",
                phone: data.billingPhone || data.billingAddress?.phone || "",
                gst: data.billingGst || data.billingAddress?.gst || ""
            },
            shippingAddress: {
                name: data.shippingName || data.shippingAddress?.name || "",
                address1: data.shippingAddress1 || data.shippingAddress?.address1 || "",
                address2: data.shippingAddress2 || data.shippingAddress?.address2 || "",
                state: data.shippingState || data.shippingAddress?.state || "",
                pinCode: data.shippingPinCode || data.shippingAddress?.pinCode || "",
                phone: data.shippingPhone || data.shippingAddress?.phone || ""
            },
            shippingSameAsBilling: data.shippingSameAsBilling !== undefined ? data.shippingSameAsBilling : true,
        });
    }
}));

// Selectors for performance
export const useTransactionItems = () => useTransactionStore((state) => state.items);
export const useTransactionTotals = () => useTransactionStore((state) => {
    const totals = calculateBillingTotals(state.items);
    return totals;
});

import { useTransition, useMemo, useReducer, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createInvoiceAction, updateInvoiceAction } from "@/features/billing/actions/billing";
import { createQuotationAction } from "@/features/billing/actions/quotations";
import { Product } from "@/features/inventory/types";
import { calculateBillingTotals, calculateItemTotals } from "@/utils/financials";
import { Address } from "@/types/invoice";

export type InvoiceItem = {
    productId?: string;
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    unit: string;
    pkgCount?: number;
    pkgType?: string;
    taxPercent: number;
};

interface BillingState {
    clientId: string;
    date: string;
    validUntil: string;
    gstType: "CGST_SGST" | "IGST" | "NO_GST";
    items: InvoiceItem[];
    invoiceNo: string;
    ewayBill: string;
    vehicleNo: string;
    notes: string;

    // Address Snapshots
    billingAddress: Address;
    shippingAddress: Address;
    shippingSameAsBilling: boolean;
}

type BillingAction =
    | { type: "SET_FIELD"; field: keyof BillingState; value: any }
    | { type: "SET_BILLING"; address: Address }
    | { type: "SET_SHIPPING"; address: Address }
    | { type: "ADD_ITEM" }
    | { type: "REMOVE_ITEM"; index: number }
    | { type: "UPDATE_ITEM"; index: number; field: keyof InvoiceItem; value: any }
    | { type: "SELECT_PRODUCT"; index: number; product: Product }
    | { type: "SET_ITEMS"; items: InvoiceItem[] };

const emptyAddress: Address = {
    name: "",
    address1: "",
    address2: "",
    state: "",
    pinCode: "",
    phone: "",
    gst: ""
};

const initialState: BillingState = {
    clientId: "",
    date: new Date().toISOString().split('T')[0],
    validUntil: "",
    gstType: "CGST_SGST",
    items: [],
    invoiceNo: "",
    ewayBill: "",
    vehicleNo: "",
    notes: "",
    billingAddress: { ...emptyAddress },
    shippingAddress: { ...emptyAddress },
    shippingSameAsBilling: true,
};

function billingReducer(state: BillingState, action: BillingAction): BillingState {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "SET_BILLING":
            return { ...state, billingAddress: action.address };
        case "SET_SHIPPING":
            return { ...state, shippingAddress: action.address };
        case "ADD_ITEM":
            return {
                ...state,
                items: [...state.items, { description: "", hsn: "", qty: 1, rate: 0, unit: "NOS", pkgCount: 1, pkgType: "BOX", taxPercent: 18 }]
            };
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((_, i) => i !== action.index)
            };
        case "UPDATE_ITEM":
            const updatedItems = [...state.items];
            updatedItems[action.index] = { ...updatedItems[action.index], [action.field]: action.value };
            return { ...state, items: updatedItems };
        case "SELECT_PRODUCT":
            const itemsWithProduct = [...state.items];
            itemsWithProduct[action.index] = {
                ...itemsWithProduct[action.index],
                productId: action.product.id,
                description: action.product.description, // Fix: Ensure description is populated
                hsn: action.product.hsn || "",
                rate: Number(action.product.sellingRate),
                unit: (action.product as any).unit || "NOS",
                pkgCount: (action.product as any).pkgCount || 1, // Fix: Using pkgCount from product instead of qty
                pkgType: (action.product as any).pkgType || "BOX",
                taxPercent: Number(action.product.gstRate)
            };
            return { ...state, items: itemsWithProduct };
        case "SET_ITEMS":
            return { ...state, items: action.items };
        default:
            return state;
    }
}

export function useBillingEngine(products: Product[], mode: "INVOICE" | "QUOTATION" = "INVOICE", initialData?: any) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [state, dispatch] = useReducer(billingReducer, initialState);

    // Initial population for Edit Mode
    useMemo(() => {
        if (initialData) {
            if (initialData.clientId) dispatch({ type: "SET_FIELD", field: "clientId", value: initialData.clientId });
            if (initialData.date) {
                const dateVal = typeof initialData.date === 'string' ? initialData.date : new Date(initialData.date).toISOString().split('T')[0];
                dispatch({ type: "SET_FIELD", field: "date", value: dateVal });
            }
            if (initialData.validUntil) {
                const dateVal = typeof initialData.validUntil === 'string' ? initialData.validUntil : new Date(initialData.validUntil).toISOString().split('T')[0];
                dispatch({ type: "SET_FIELD", field: "validUntil", value: dateVal });
            }
            if (initialData.gstType) dispatch({ type: "SET_FIELD", field: "gstType", value: initialData.gstType });
            if (initialData.ewayBill) dispatch({ type: "SET_FIELD", field: "ewayBill", value: initialData.ewayBill });
            if (initialData.vehicleNo) dispatch({ type: "SET_FIELD", field: "vehicleNo", value: initialData.vehicleNo });
            if (initialData.notes) dispatch({ type: "SET_FIELD", field: "notes", value: initialData.notes });
            if (initialData.invoiceNo) dispatch({ type: "SET_FIELD", field: "invoiceNo", value: initialData.invoiceNo });
            
            // Address Sync
            dispatch({ type: "SET_BILLING", address: {
                name: initialData.billingName || "",
                address1: initialData.billingAddress1 || "",
                address2: initialData.billingAddress2 || "",
                state: initialData.billingState || "",
                pinCode: initialData.billingPinCode || "",
                phone: initialData.billingPhone || "",
                gst: initialData.billingGst || ""
            }});
            
            dispatch({ type: "SET_SHIPPING", address: {
                name: initialData.shippingName || "",
                address1: initialData.shippingAddress1 || "",
                address2: initialData.shippingAddress2 || "",
                state: initialData.shippingState || "",
                pinCode: initialData.shippingPinCode || "",
                phone: initialData.shippingPhone || ""
            }});
            
            dispatch({ type: "SET_FIELD", field: "shippingSameAsBilling", value: initialData.shippingSameAsBilling });

            // Line Items
            if (initialData.lineItems && initialData.lineItems.length > 0) {
                initialData.lineItems.forEach((item: any, index: number) => {
                    if (index === 0) {
                        // Replace the first empty item if it exists
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "description", value: item.description });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "hsn", value: item.hsn });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "qty", value: item.qty });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "rate", value: item.rate });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "unit", value: item.unit || "NOS" });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "taxPercent", value: item.taxPercent });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "pkgCount", value: item.pkgCount || 1 });
                        dispatch({ type: "UPDATE_ITEM", index: 0, field: "pkgType", value: item.pkgType || "BOX" });
                        if (item.productId) dispatch({ type: "UPDATE_ITEM", index: 0, field: "productId", value: item.productId });
                    } else {
                        dispatch({ type: "ADD_ITEM" });
                        dispatch({ type: "UPDATE_ITEM", index, field: "description", value: item.description });
                        dispatch({ type: "UPDATE_ITEM", index, field: "hsn", value: item.hsn });
                        dispatch({ type: "UPDATE_ITEM", index, field: "qty", value: item.qty });
                        dispatch({ type: "UPDATE_ITEM", index, field: "rate", value: item.rate });
                        dispatch({ type: "UPDATE_ITEM", index, field: "unit", value: item.unit || "NOS" });
                        dispatch({ type: "UPDATE_ITEM", index, field: "taxPercent", value: item.taxPercent });
                        dispatch({ type: "UPDATE_ITEM", index, field: "pkgCount", value: item.pkgCount || 1 });
                        dispatch({ type: "UPDATE_ITEM", index, field: "pkgType", value: item.pkgType || "BOX" });
                        if (item.productId) dispatch({ type: "UPDATE_ITEM", index, field: "productId", value: item.productId });
                    }
                });
            }
        }
    }, [initialData]);

    // Derived Calculations
    const calculations = useMemo(() => {
        const itemCalculations = state.items.map(item => 
            calculateItemTotals(item.qty, item.rate, item.taxPercent)
        );

        const totals = calculateBillingTotals(state.items);

        return {
            items: state.items.map((item, i) => ({ ...item, ...itemCalculations[i] })),
            ...totals
        };
    }, [state.items]);

    const handleAddItem = useCallback(() => dispatch({ type: "ADD_ITEM" }), []);
    const removeItem = useCallback((index: number) => dispatch({ type: "REMOVE_ITEM", index }), []);
    
    const updateItem = useCallback((index: number, field: keyof InvoiceItem, value: any) => 
        dispatch({ type: "UPDATE_ITEM", index, field, value }), []);

    const handleProductSelect = useCallback((index: number, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) dispatch({ type: "SELECT_PRODUCT", index, product });
    }, [products]);

    const setField = useCallback((field: keyof BillingState, value: any) => 
        dispatch({ type: "SET_FIELD", field, value }), []);

    const handleSubmit = async () => {
        setError(null);
        if (!state.clientId) {
            setError("Please select a client.");
            return;
        }
        if (state.items.length === 0) {
            setError(`Add at least one item to the ${mode.toLowerCase()}.`);
            return;
        }

        startTransition(async () => {
            const payload = {
                clientId: state.clientId,
                date: state.date,
                gstType: state.gstType,
                subTotal: calculations.subTotal,
                taxTotal: calculations.taxTotal,
                grandTotal: calculations.grandTotal,
                invoiceNo: state.invoiceNo || undefined,
                notes: state.notes || undefined,
                items: calculations.items,

                // Address Snapshots
                billingAddress: state.billingAddress,
                shippingAddress: state.shippingSameAsBilling ? state.billingAddress : state.shippingAddress,
                shippingSameAsBilling: state.shippingSameAsBilling,

                // Invoice only
                ...(mode === "INVOICE" && {
                    ewayBill: state.ewayBill || undefined,
                    vehicleNo: state.vehicleNo || undefined,
                }),
                // Quotation only
                ...(mode === "QUOTATION" && {
                    validUntil: state.validUntil || undefined,
                }),
            };

            const res = initialData?.id 
                ? await updateInvoiceAction(initialData.id, payload)
                : (mode === "INVOICE" ? await createInvoiceAction(payload) : await createQuotationAction(payload));

            if ("error" in res) {
                setError(res.error as string);
            } else if (res.success) {
                const id = mode === "INVOICE" ? (res as any).invoiceId : (res as any).quotationId;
                const path = mode === "INVOICE" ? "/invoices" : "/quotations";
                router.push(`${path}/${id}`);
                router.refresh();
            }
        });
    };

    const setClientId = useCallback((id: string) => setField("clientId", id), [setField]);
    const setBillingAddress = useCallback((address: Address) => dispatch({ type: "SET_BILLING", address }), []);
    const setShippingAddress = useCallback((address: Address) => dispatch({ type: "SET_SHIPPING", address }), []);
    const setShippingSameAsBilling = useCallback((val: boolean) => setField("shippingSameAsBilling", val), [setField]);
    const setDate = useCallback((d: string) => setField("date", d), [setField]);
    const setValidUntil = useCallback((d: string) => setField("validUntil", d), [setField]);
    const setGstType = useCallback((t: any) => setField("gstType", t), [setField]);
    const setInvoiceNo = useCallback((v: string) => setField("invoiceNo", v), [setField]);
    const setEwayBill = useCallback((v: string) => setField("ewayBill", v), [setField]);
    const setVehicleNo = useCallback((v: string) => setField("vehicleNo", v), [setField]);
    const setNotes = useCallback((v: string) => setField("notes", v), [setField]);
    const setItems = useCallback((items: InvoiceItem[]) => dispatch({ type: "SET_ITEMS", items }), []);

    return {
        state,
        dispatch,
        isPending,
        error,
        calculations,
        mode,

        setClientId,
        setBillingAddress,
        setShippingAddress,
        setShippingSameAsBilling,
        setDate,
        setValidUntil,
        setGstType,
        setInvoiceNo,
        setEwayBill,
        setVehicleNo,
        setNotes,
        setItems,

        handleAddItem,
        updateItem,
        removeItem,
        handleProductSelect,
        handleSubmit
    };
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/features/clients/types";
import { Product } from "@/features/inventory/types";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/financials";
import { CheckCircle2, AlertCircle, ArrowLeft, Truck, FileText } from "lucide-react";
import { useTransactionStore, useTransactionTotals } from "@/lib/store/transactionStore";
import { InvoiceDetailsCard } from "./InvoiceDetailsCard";
import { TransactionTable } from "@/ui/core/TransactionTable";
import { Card, CardContent } from "@/ui/core/Card";
import { createInvoiceAction, updateInvoiceAction } from "@/features/billing/actions/billing";
import { createQuotationAction } from "@/features/billing/actions/quotations";

interface BillingEngineProps {
    clients: Client[];
    products: Product[];
    mode?: "INVOICE" | "QUOTATION";
    initialData?: any;
}

export function BillingEngine({ clients, products, mode = "INVOICE", initialData }: BillingEngineProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const store = useTransactionStore();
    const totals = useTransactionTotals();

    // Memoize the freight total calculation
    const freightTotal = useMemo(() => {
        if (!store.isFreightCollect) return 0;
        return (store.freightAmount || 0) * (1 + (store.freightTaxPercent || 0) / 100);
    }, [store.isFreightCollect, store.freightAmount, store.freightTaxPercent]);

    // Initialize store
    useEffect(() => {
        store.reset();
        store.setMode(mode);
        if (initialData) {
            store.initialize(initialData);
        }

        // Resell Workflow: Handle data from Procurement Page
        if (typeof window !== "undefined") {
            const resellData = sessionStorage.getItem("jezzy_resell_pack");
            if (resellData) {
                try {
                    const data = JSON.parse(resellData);
                    store.initialize({ ...data, mode: "INVOICE" });
                    sessionStorage.removeItem("jezzy_resell_pack");
                } catch (e) {
                    console.error("Failed to parse jezzy_resell_pack", e);
                }
            }
        }
    }, [mode, initialData]);

    // Auto-populate addresses when client changes
    useEffect(() => {
        if (store.entityId) {
            const client = clients.find(c => c.id === store.entityId);
            if (client) {
                const address = {
                    name: client.name,
                    address1: client.address1,
                    address2: client.address2 || "",
                    state: client.state,
                    pinCode: client.pinCode || "",
                    phone: client.phone || "",
                    gst: client.gst || ""
                };
                store.setField("billingAddress", address);
                if (store.shippingSameAsBilling) {
                    store.setField("shippingAddress", address);
                }

                // Kerala = CGST_SGST, Others = IGST
                const stateStr = client.state?.trim().toLowerCase() || "";
                const isKerala = stateStr === "kerala" || stateStr.includes("kerala") || stateStr === "kl";
                if (isKerala) {
                    store.setField("gstType", "CGST_SGST");
                } else {
                    store.setField("gstType", "IGST");
                }
            }
        }
    }, [store.entityId, clients, store.shippingSameAsBilling]);

    // Manual billing address state changes
    useEffect(() => {
        const stateStr = store.billingAddress?.state?.trim().toLowerCase() || "";
        if (!stateStr) return;
        const isKerala = stateStr === "kerala" || stateStr.includes("kerala") || stateStr === "kl";
        if (isKerala) {
            if (store.gstType !== "CGST_SGST") store.setField("gstType", "CGST_SGST");
        } else {
            if (store.gstType !== "IGST") store.setField("gstType", "IGST");
        }
    }, [store.billingAddress?.state]);

    const handleSubmit = async () => {
        setError(null);
        if (!store.entityId) {
            setError("Please select a client to proceed.");
            return;
        }
        if (store.items.length === 0) {
            setError("Add at least one item to the document.");
            return;
        }

        setIsPending(true);
        try {
            const payload = {
                clientId: store.entityId,
                date: store.date,
                gstType: store.gstType,
                subTotal: totals.subTotal,
                taxTotal: totals.taxTotal,
                grandTotal: totals.grandTotal,
                invoiceNo: store.invoiceNo || undefined,
                notes: store.notes || undefined,
                items: store.items,
                billingAddress: store.billingAddress,
                shippingAddress: store.shippingSameAsBilling ? store.billingAddress : store.shippingAddress,
                shippingSameAsBilling: store.shippingSameAsBilling,
                ...(mode === "INVOICE" && {
                    ewayBill: store.ewayBill || undefined,
                    ewayBillUrl: store.ewayBillUrl || undefined,
                    vehicleNo: store.vehicleNo || undefined,
                }),
                ...(mode === "QUOTATION" && {
                    validUntil: store.validUntil || undefined,
                }),
                isFreightCollect: store.isFreightCollect,
                freightAmount: store.freightAmount || 0,
                freightTaxPercent: store.freightTaxPercent || 0,
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
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Error Notification */}
            {error && (
                <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-200" role="alert">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Validation Notice</p>
                        <p className="mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Step 1: Core Details */}
            <InvoiceDetailsCard clients={clients} />

            {/* Step 2: Line Items */}
            <TransactionTable products={products} />

            {/* Step 3: Financial Summary & Actions */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <h4 className="text-sm font-semibold text-slate-900">Financial Summary</h4>
                        </div>
                    </div>

                    <div className="space-y-3 max-w-md ml-auto">
                        <div className="flex justify-between items-center text-xs text-slate-600">
                            <span>Taxable Value (Subtotal)</span>
                            <span className="tabular-nums font-medium text-slate-900">{formatCurrency(totals.subTotal)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-slate-600">
                            <span>Tax Contribution (GST)</span>
                            <span className="tabular-nums font-medium text-slate-900">{formatCurrency(totals.taxTotal)}</span>
                        </div>

                        {totals.roundOff !== 0 && (
                            <div className="flex justify-between items-center text-xs text-slate-600">
                                <span>Round Off</span>
                                <span className="tabular-nums font-medium text-slate-900">{totals.roundOff > 0 ? '+' : ''}{totals.roundOff.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Freight Section */}
                        {store.isFreightCollect && (
                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                    <Truck className="w-4 h-4 text-slate-500" />
                                    <span>Freight Collect</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">Amount (excl. GST) ₹</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-right text-xs text-slate-900 tabular-nums focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                            value={store.freightAmount || ""}
                                            onChange={e => store.setField("freightAmount", parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] text-slate-500">GST %</label>
                                        <select
                                            className="w-full h-9 rounded-lg border border-slate-300 px-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                            value={store.freightTaxPercent || 0}
                                            onChange={e => store.setField("freightTaxPercent", parseFloat(e.target.value) || 0)}
                                        >
                                            {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}%</option>)}
                                        </select>
                                    </div>
                                </div>
                                {(store.freightAmount || 0) > 0 && (
                                    <div className="flex justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-md">
                                        <span>Freight Total (incl. GST)</span>
                                        <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(freightTotal)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Grand Total */}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                            <span className="text-sm font-semibold text-slate-900">Total Payable</span>
                            <span className="text-2xl font-bold text-slate-900 tabular-nums">
                                {formatCurrency(totals.grandTotal)}
                            </span>
                        </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={handleSubmit}
                            loading={isPending}
                            disabled={isPending || store.items.length === 0 || !store.entityId}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            {initialData?.id ? "Update Document" : mode === "QUOTATION" ? "Save Quotation" : "Create Invoice"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

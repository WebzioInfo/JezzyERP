"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/features/clients/types";
import { Product } from "@/features/inventory/types";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/financials";
import { CheckCircle2, AlertCircle, ClipboardList, ArrowRight, Zap, Truck } from "lucide-react";
import { useTransactionStore, useTransactionTotals } from "@/lib/store/transactionStore";
import { InvoiceDetailsCard } from "./InvoiceDetailsCard";
import { TransactionTable } from "@/ui/core/TransactionTable";
import { Card } from "@/ui/core/Card";
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

    // Memoize the freight total calculation for UI smoothness
    const freightTotal = React.useMemo(() => {
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

        // AI Resell Workflow: Handle data from Procurement Page
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

                // Automated GST Selection:
                // Per request: Kerala = CGST_SGST, Others = IGST
                if (client.state?.toLowerCase() === "kerala") {
                    store.setField("gstType", "CGST_SGST");
                } else {
                    store.setField("gstType", "IGST");
                }
            }
        }
    }, [store.entityId, clients, store.shippingSameAsBilling]);

    // Also watch for manual billing address state changes
    useEffect(() => {
        const currentState = store.billingAddress?.state?.toLowerCase();
        if (currentState === "kerala") {
            if (store.gstType !== "CGST_SGST") store.setField("gstType", "CGST_SGST");
        } else if (currentState) {
            if (store.gstType !== "IGST") store.setField("gstType", "IGST");
        }
    }, [store.billingAddress?.state, store.gstType]);

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
        <div className="space-y-12 max-w-7xl mx-auto pb-32">
            {/* Error Notifications */}
            {error && (
                <div className="flex items-start gap-3 rounded-4xl bg-red-50 p-6 text-sm text-red-700 border border-red-100 shadow-xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="space-y-1">
                        <p className="font-black uppercase tracking-[0.2em] text-[10px] text-red-400">System Validation Error</p>
                        <p className="font-bold opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {/* Step 1: Core Details */}
            <InvoiceDetailsCard clients={clients} />

            {/* Step 2: Line Items */}
            <TransactionTable products={products} />

            {/* Summaries & Global Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-10 border-t border-slate-100">

                {/* Totals & Submit */}
                <div className="lg:col-span-12  w-full">
                    <Card className="border-0 shadow-3xl ring-1 ring-slate-900/5 bg-white p-10 overflow-hidden rounded-[3rem]">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Financial Summary</h4>
                            <div className="flex h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm font-black text-slate-400">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Net Taxable Value</span>
                                <span className="tabular-nums text-slate-900 italic transform transition-all group-hover:scale-110">{formatCurrency(totals.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-black text-slate-400">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Tax Contribution (GST)</span>
                                <span className="tabular-nums text-primary-600 italic">{formatCurrency(totals.taxTotal)}</span>
                            </div>

                            {/* Freight Row — only shown when Freight Collect is active */}
                            {store.isFreightCollect && (
                                <div className="pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Truck className="w-4 h-4 text-slate-600" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Freight Amount</span>
                                        <span className="ml-auto text-[9px] font-black text-primary-500 uppercase tracking-widest">Freight Collect Active</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Amount (excl. GST) ₹</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full h-11 rounded-2xl border-0 bg-slate-50 px-4 text-right text-sm font-black text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none transition-all tabular-nums"
                                                value={store.freightAmount || ""}
                                                onChange={e => store.setField("freightAmount", parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">GST %</label>
                                            <select
                                                className="w-full h-11 rounded-2xl border-0 bg-slate-50 px-4 text-sm font-black text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none transition-all appearance-none"
                                                value={store.freightTaxPercent || 0}
                                                onChange={e => store.setField("freightTaxPercent", parseFloat(e.target.value) || 0)}
                                            >
                                                {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}%</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    {(store.freightAmount || 0) > 0 && (
                                        <div className="mt-3 flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 rounded-xl px-4 py-2">
                                            <span>Freight incl. GST</span>
                                            <span className="text-slate-900 tabular-nums">
                                                {formatCurrency((store.freightAmount || 0) * (1 + (store.freightTaxPercent || 0) / 100))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-10 border-t border-slate-50 mt-6 relative">
                                <div className="flex justify-between items-end mb-12">
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Total Payable</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter  opacity-60 italic">INR (₹) Final Value</p>
                                    </div>
                                    <p className="text-6xl font-black tracking-tighter text-slate-900 italic animate-reveal">
                                        {formatCurrency(totals.grandTotal)}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-20 w-20 flex-none rounded-3xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
                                        onClick={() => router.back()}
                                        disabled={isPending}
                                    >
                                        <Zap className="w-6 h-6 rotate-180 group-hover:scale-125 transition-transform" />
                                    </Button>
                                    <Button
                                        className="flex-1 h-20 w-full text-2xl font-black gap-4 rounded-4xl shadow-3xl transition-all uppercase italic tracking-widest bg-primary-600 text-white hover:bg-primary-700 active:scale-95 group/submit overflow-hidden"
                                        onClick={handleSubmit}
                                        loading={isPending}
                                        variant="primary"
                                        disabled={isPending || store.items.length === 0 || !store.entityId}
                                    >
                                        <div className="group/submit absolute w-full inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000" />
                                        {initialData?.id ? (
                                            <><CheckCircle2 className="w-8 h-8" /> Update</>
                                        ) : mode === "QUOTATION" ? (
                                            <><ClipboardList className="w-8 h-8" /> Commit</>
                                        ) : (
                                            <><CheckCircle2 className="w-8 h-8" /> Deploy</>
                                        )}
                                        <ArrowRight size={24} className="ml-2 group-hover/submit:translate-x-2 transition-transform" />
                                    </Button>
                                </div>

                                <p className="text-center text-[9px] text-slate-300 mt-8 leading-relaxed font-black uppercase tracking-[0.5em] italic">
                                    Transaction Engine Secure Node v5
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/features/clients/types";
import { Product } from "@/features/inventory/types";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/index";
import { CheckCircle2, AlertCircle, ClipboardList, Info, ArrowRight, Zap, GraduationCap } from "lucide-react";
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
            }
        }
    }, [store.entityId, clients]);

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
                    vehicleNo: store.vehicleNo || undefined,
                }),
                ...(mode === "QUOTATION" && {
                    validUntil: store.validUntil || undefined,
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
                <div className="flex items-start gap-3 rounded-[2rem] bg-red-50 p-6 text-sm text-red-700 border border-red-100 shadow-xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4">
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
                {/* Guidance & Meta */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <Card className="bg-slate-900 border-0 p-10 shadow-2xl relative overflow-hidden group rounded-[3rem]">
                        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                            <Zap size={320} className="text-white" />
                        </div>
                        <div className="relative z-10 flex gap-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-accent-500 flex items-center justify-center shadow-2xl shadow-accent-500/40 shrink-0">
                                <Info className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-white text-2xl italic uppercase tracking-tight font-display">Compliance Guidance</h4>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    {mode === 'INVOICE'
                                        ? "This electronic document follows GST Law Rule 46. Ensure 'Intra-state' is selected if the customer shares your state code. In inter-state transactions, IGST is applied automatically. All decimals are rounded to the nearest integer for accounting precision."
                                        : "Pro-forma quotations do not carry financial liability until converted into an invoice. Use the 'Draft' state for internal reviews. Quotations auto-expire after the validity period to protect against price fluctuations."
                                    }
                                </p>
                                <div className="flex gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <GraduationCap size={12} />
                                        Audit Ready
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        Certified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Totals & Submit */}
                <div className="lg:col-span-12 xl:col-span-5 w-full">
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

                            <div className="pt-10 border-t border-slate-50 mt-6 relative">
                                <div className="flex justify-between items-end mb-12">
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Total Payable</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter italic opacity-60 italic">INR (₹) Final Value</p>
                                    </div>
                                    <p className="text-6xl font-black tracking-tighter text-slate-900 italic animate-reveal">
                                        {formatCurrency(totals.grandTotal)}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-20 w-20 flex-none rounded-[1.5rem] bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
                                        onClick={() => router.back()}
                                        disabled={isPending}
                                    >
                                        <Zap className="w-6 h-6 rotate-180 group-hover:scale-125 transition-transform" />
                                    </Button>
                                    <Button
                                        className="flex-1 h-20 text-2xl font-black gap-4 rounded-[2rem] shadow-3xl transition-all uppercase italic tracking-widest bg-primary-600 text-white hover:bg-primary-700 active:scale-95 group/submit overflow-hidden"
                                        onClick={handleSubmit}
                                        loading={isPending}
                                        variant="primary"
                                        disabled={isPending || store.items.length === 0 || !store.entityId}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000" />
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
            </div>
        </div>
    );
}

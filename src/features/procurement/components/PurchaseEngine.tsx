"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/index";
import { CheckCircle2, AlertCircle, ShoppingCart, Info, ArrowRight, Zap, Target } from "lucide-react";
import { useTransactionStore, useTransactionTotals } from "@/lib/store/transactionStore";
import { PurchaseDetailsCard } from "./PurchaseDetailsCard";
import { TransactionTable } from "@/ui/core/TransactionTable";
import { Card } from "@/ui/core/Card";
import { createPurchaseAction } from "../actions";

interface PurchaseEngineProps {
    vendors: any[];
    products: any[];
    initialData?: any;
}

export function PurchaseEngine({ vendors, products, initialData }: PurchaseEngineProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const store = useTransactionStore();
    const totals = useTransactionTotals();

    // Initialize store
    useEffect(() => {
        store.reset();
        store.setMode("PURCHASE");
        if (initialData) {
            store.initialize(initialData);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        setError(null);
        if (!store.entityId) {
            setError("Please select a vendor representing the supply source.");
            return;
        }
        if (store.items.length === 0) {
            setError("Procurement ledger cannot be empty. Add line items.");
            return;
        }

        setIsPending(true);
        try {
            const payload = {
                vendorId: store.entityId,
                invoiceNo: store.invoiceNo,
                date: store.date,
                gstType: store.gstType,
                ewayBill: store.ewayBill || undefined,
                ewayBillUrl: store.ewayBillUrl || undefined,
                vehicleNo: store.vehicleNo || undefined,
                notes: store.notes || undefined,
                items: store.items,
                subTotal: totals.subTotal,
                taxTotal: totals.taxTotal,
                grandTotal: totals.grandTotal,
            };

            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (key === 'items') {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined) {
                    formData.append(key, value as string);
                }
            });

            await createPurchaseAction(formData);
            router.push("/purchases");
        } catch (err: any) {
            setError(err.message || "Failed to finalize procurement record.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-32">
            {/* Error Notifications */}
            {error && (
                <div className="flex items-start gap-4 rounded-[2rem] bg-red-50 p-6 text-sm text-red-700 border border-red-100 shadow-xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="space-y-1">
                        <p className="font-black uppercase tracking-[0.2em] text-[10px] text-red-400">Ledger Error</p>
                        <p className="font-bold opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {/* Step 1: Core Details */}
            <PurchaseDetailsCard vendors={vendors} />

            {/* Step 2: Line Items */}
            <TransactionTable products={products} />

            {/* Summaries & Global Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-10 border-t border-slate-100">
                {/* Guidance & Meta */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <Card className="bg-slate-900 border-0 p-10 shadow-2xl relative overflow-hidden group rounded-[3rem]">
                        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                            <Target size={320} className="text-white" />
                        </div>
                        <div className="relative z-10 flex gap-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/40 shrink-0">
                                <Info className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-black text-white text-2xl italic uppercase tracking-tight font-display text-primary-500">Inward Supply Logic</h4>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    Accurate procurement records are the foundation of your Input Tax Credit (ITC). 
                                    Ensure the Supplier GSTIN and Taxable Value match the physical invoice perfectly. 
                                    Staging the digital E-Way Bill here links logistics to accounting permanently for audit readiness.
                                </p>
                                <div className="flex gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        ITC Optimized
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <CheckCircle2 size={12} className="text-primary-500" />
                                        Verified Source
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
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Financial Summary (Inward)</h4>
                            <div className="flex h-3 w-3 rounded-full bg-primary-500 shadow-lg shadow-primary-500/20" />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm font-black text-slate-400">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Purchase Base Value</span>
                                <span className="tabular-nums text-slate-900 italic">{formatCurrency(totals.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-black text-slate-400">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Input GST Claim</span>
                                <span className="tabular-nums text-emerald-600 italic">+{formatCurrency(totals.taxTotal)}</span>
                            </div>

                            <div className="pt-10 border-t border-slate-50 mt-6 relative">
                                <div className="flex justify-between items-end mb-12">
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Gross Cost</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter italic opacity-60">INR (₹) Final Value</p>
                                    </div>
                                    <p className="text-6xl font-black tracking-tighter text-slate-900 italic animate-reveal">
                                        {formatCurrency(totals.grandTotal)}
                                    </p>
                                </div>

                                <Button
                                    className="w-full h-20 text-2xl font-black gap-4 rounded-[2rem] shadow-3xl transition-all uppercase italic tracking-widest bg-slate-900 text-white hover:bg-slate-800 active:scale-95 group/submit overflow-hidden"
                                    onClick={handleSubmit}
                                    loading={isPending}
                                    disabled={isPending || store.items.length === 0 || !store.entityId}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000" />
                                    <CheckCircle2 className="w-8 h-8 text-primary-500" /> 
                                    <span>{initialData?.id ? 'Update Record' : 'Commit Supply'}</span>
                                    <ArrowRight size={24} className="ml-2 group-hover/submit:translate-x-2 transition-transform" />
                                </Button>

                                <p className="text-center text-[9px] text-slate-300 mt-8 leading-relaxed font-black uppercase tracking-[0.5em] italic">
                                    Procurement Control Node v5
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

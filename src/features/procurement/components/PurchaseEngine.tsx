"use client";

import React from "react";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/financials";
import { CheckCircle2, AlertCircle, ShoppingCart, Info, ArrowRight, Zap } from "lucide-react";
import { usePurchaseEngine } from "../hooks/usePurchaseEngine";
import { PurchaseDetailsCard } from "./PurchaseDetailsCard";
import { LineItemsTable } from "@/features/billing/components/LineItemsTable";
import { Card } from "@/ui/core/Card";

interface PurchaseEngineProps {
    vendors: any[];
    products: any[];
    initialData?: any;
}

export function PurchaseEngine({ vendors, products, initialData }: PurchaseEngineProps) {
    const {
        state,
        isPending,
        error,
        calculations,
        handleAddItem,
        updateItem,
        removeItem,
        handleProductSelect,
        handleSubmit,
        setVendorId, setInvoiceNo, setDate, setGstType, setEwayBill, setEwayBillUrl, setVehicleNo, setNotes
    } = usePurchaseEngine(products, initialData);

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-24 animate-fade-up">
            {/* Error Notifications */}
            {error && (
                <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                        <p className="font-bold uppercase tracking-tight text-[10px]">Processing Error</p>
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Step 1: Core Details */}
            <PurchaseDetailsCard
                vendors={vendors}
                state={state}
                setVendorId={setVendorId}
                setInvoiceNo={setInvoiceNo}
                setDate={setDate}
                setGstType={setGstType}
                setEwayBill={setEwayBill}
                setEwayBillUrl={setEwayBillUrl}
                setVehicleNo={setVehicleNo}
                setNotes={setNotes}
            />

            {/* Step 2: Line Items */}
            <LineItemsTable
                items={calculations.items as any}
                products={products}
                handleAddItem={handleAddItem}
                updateItem={updateItem as any}
                removeItem={removeItem}
                handleProductSelect={handleProductSelect}
            />

            {/* Summaries & Global Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200">
                {/* Guidance & Meta */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <Card className="bg-slate-900 border-0 p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                            <Zap size={240} className="text-white" />
                        </div>
                        <div className="relative z-10 flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-black text-white text-xl italic uppercase tracking-tight">Inward Compliance</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Recording outward supplies accurately is critical for **Input Tax Credit (ITC)** reconciliation. 
                                    Ensure the Supplier GSTIN and Inward Tax Amount matches the physical invoice received. 
                                    Staging the E-Way bill document here ensures 100% audit readiness.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Totals & Submit */}
                <div className="lg:col-span-12 xl:col-span-5 w-full">
                    <Card className="border-0 shadow-2xl ring-1 ring-slate-900/5 bg-white p-8 overflow-hidden rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Summary (Inward)</h4>
                            <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span className="uppercase tracking-widest text-[10px]">Purchase Value (Taxable)</span>
                                <span className="tabular-nums text-slate-900">{formatCurrency(calculations.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span className="uppercase tracking-widest text-[10px]">Input GST Claim</span>
                                <span className="tabular-nums text-emerald-600">{formatCurrency(calculations.taxTotal)}</span>
                            </div>

                            <div className="pt-8 border-t border-slate-100 mt-4">
                                <div className="flex justify-between items-end mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Total Inward Value</p>
                                        <p className="text-xs text-slate-400 italic font-semibold">INR (₹) Gross cost</p>
                                    </div>
                                    <p className="text-5xl font-black tracking-tight text-slate-900 italic">
                                        {formatCurrency(calculations.grandTotal)}
                                    </p>
                                </div>

                                <Button
                                    className="w-full h-16 text-xl font-black gap-3 rounded-2xl shadow-2xl transition-all uppercase italic tracking-widest bg-slate-900 text-white hover:bg-slate-800"
                                    onClick={handleSubmit}
                                    loading={isPending}
                                    disabled={isPending || state.items.length === 0 || !state.vendorId}
                                >
                                    <CheckCircle2 className="w-6 h-6" /> 
                                    <span>{initialData?.id ? 'Update Record' : 'Commit Purchase'}</span>
                                    <ArrowRight size={20} className="ml-1 opacity-50" />
                                </Button>

                                <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed font-bold uppercase tracking-widest italic">
                                    Procurement Inventory Submission Engine v4
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

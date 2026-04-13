"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/features/clients/types";
import { Product } from "@/features/inventory/types";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/financials";
import { CheckCircle2, AlertCircle, ClipboardList, Info, ArrowRight, Zap } from "lucide-react";
import { useBillingEngine } from "@/hooks/useBillingEngine";
import { InvoiceDetailsCard } from "./InvoiceDetailsCard";
import { LineItemsTable } from "./LineItemsTable";
import { Card } from "@/ui/core/Card";

interface BillingEngineProps {
    clients: Client[];
    products: Product[];
    mode?: "INVOICE" | "QUOTATION";
    initialData?: any;
}

export function BillingEngine({ clients, products, mode = "INVOICE", initialData }: BillingEngineProps) {
    const router = useRouter();
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
        setClientId, setDate, setValidUntil, setGstType, setInvoiceNo, setEwayBill, setVehicleNo, setNotes,
        setBillingAddress, setShippingAddress, setShippingSameAsBilling, setItems
    } = useBillingEngine(products, mode, initialData);

    // Auto-populate addresses when client changes
    const [prevClientId, setPrevClientId] = React.useState("");
    
    // AI Resell Workflow: Handle data from Procurement Page
    useEffect(() => {
        if (typeof window !== "undefined") {
            const resellData = sessionStorage.getItem("jezzy_resell_pack");
            if (resellData) {
                try {
                    const data = JSON.parse(resellData);
                    const items = data.lineItems;
                    if (items && items.length > 0) {
                        setItems(items.map((it: any) => ({
                            productId: it.productId,
                            description: it.description,
                            hsn: it.hsn || "",
                            qty: Number(it.qty || 1),
                            rate: Number(it.sellingRate || it.rate || 0), // Use suggested selling rate
                            unit: it.unit || "NOS",
                            taxPercent: Number(it.taxPercent || 18),
                            pkgCount: it.pkgCount || 1,
                            pkgType: it.pkgType || "BOX"
                        })));
                    }
                    sessionStorage.removeItem("jezzy_resell_pack");
                } catch (e) {
                    console.error("Failed to parse jezzy_resell_pack", e);
                }
            }
        }
    }, [setItems]);
    

    useEffect(() => {
        if (state.clientId && state.clientId !== prevClientId) {
            const client = clients.find(c => c.id === state.clientId);
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
                setBillingAddress(address);
                if (state.shippingSameAsBilling) {
                    setShippingAddress(address);
                }
                setPrevClientId(state.clientId);
            }
        }
    }, [state.clientId, clients, setBillingAddress, setShippingAddress, state.shippingSameAsBilling, prevClientId]);

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
            <InvoiceDetailsCard
                clients={clients}
                state={state}
                mode={mode}
                setClientId={setClientId}
                setDate={setDate}
                setValidUntil={setValidUntil}
                setGstType={setGstType}
                setInvoiceNo={setInvoiceNo}
                setEwayBill={setEwayBill}
                setVehicleNo={setVehicleNo}
                setNotes={setNotes}
                setBillingAddress={setBillingAddress}
                setShippingAddress={setShippingAddress}
                setShippingSameAsBilling={setShippingSameAsBilling}
            />


            {/* Step 2: Line Items */}
            <LineItemsTable
                items={calculations.items}
                products={products}
                handleAddItem={handleAddItem}
                updateItem={updateItem}
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
                            <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20 shrink-0">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-black text-white text-xl italic uppercase tracking-tight">Compliance & Accuracy</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    {mode === 'INVOICE'
                                        ? "GST will be calculated precisely based on your selection. Intra-state (CGST/SGST) applies to customers within the same state. Inter-state (IGST) applies across state borders. Ensure the Vehicle Number matches the E-Way bill if applicable."
                                        : "Quotations are price estimates valid only for the duration specified. You can easily convert an approved quotation into a Tax Invoice later with a single click."
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Totals & Submit */}
                <div className="lg:col-span-12 xl:col-span-5 w-full">
                    <Card className="border-0 shadow-2xl ring-1 ring-slate-900/5 bg-white p-8 overflow-hidden rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Summary</h4>
                            <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span className="uppercase tracking-widest text-[10px]">Taxable Amount</span>
                                <span className="tabular-nums text-slate-900">{formatCurrency(calculations.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                <span className="uppercase tracking-widest text-[10px]">Tax Estimate (GST)</span>
                                <span className="tabular-nums text-slate-900">{formatCurrency(calculations.taxTotal)}</span>
                            </div>

                            <div className="pt-8 border-t border-slate-100 mt-4">
                                <div className="flex justify-between items-end mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Total Payable</p>
                                        <p className="text-xs text-slate-400 italic font-semibold">INR (₹) Net Amount</p>
                                    </div>
                                    <p className="text-5xl font-black tracking-tight text-slate-900 italic">
                                        {formatCurrency(calculations.grandTotal)}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-16 flex-1 text-slate-500 font-bold rounded-2xl border-slate-200"
                                        onClick={() => router.back()}
                                        disabled={isPending}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        className="flex-[2] h-16 text-xl font-black gap-3 rounded-2xl shadow-2xl transition-all uppercase italic tracking-widest"
                                        onClick={handleSubmit}
                                        loading={isPending}
                                        variant="primary"
                                        disabled={isPending || state.items.length === 0 || !state.clientId}
                                    >
                                        {initialData?.id ? (
                                            <><CheckCircle2 className="w-6 h-6" /> Update {mode === "QUOTATION" ? "Quotation" : "Invoice"}</>
                                        ) : mode === "QUOTATION" ? (
                                            <><ClipboardList className="w-6 h-6" /> Save Quotation</>
                                        ) : (
                                            <><CheckCircle2 className="w-6 h-6" /> Deploy Invoice</>
                                        )}
                                        <ArrowRight size={20} className="ml-1 opacity-50" />
                                    </Button>
                                </div>

                                <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed font-bold uppercase tracking-widest italic">
                                    Authoritative Document Submission Engine v4
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

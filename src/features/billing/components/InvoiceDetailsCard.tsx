"use client";

import React, { useState } from "react";
import { Input } from "@/ui/core/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { Client } from "@/features/clients/types";
import { 
    Building2, Calendar, FileText, Truck, 
    ShieldCheck, Info, MapPin, 
    ChevronDown, ChevronUp, CheckSquare, Square, CloudUpload, Loader2
} from "lucide-react";
import { cn } from "@/utils";
import BillingForm from "./BillingForm";
import ShippingForm from "./ShippingForm";

import { useTransactionStore } from "@/lib/store/transactionStore";

interface InvoiceDetailsCardProps {
    clients: Client[];
}

export function InvoiceDetailsCard({
    clients
}: InvoiceDetailsCardProps) {
    const mode = useTransactionStore(s => s.mode);
    const clientId = useTransactionStore(s => s.entityId);
    const date = useTransactionStore(s => s.date);
    const validUntil = useTransactionStore(s => s.validUntil);
    const gstType = useTransactionStore(s => s.gstType);
    const invoiceNo = useTransactionStore(s => s.invoiceNo);
    const ewayBill = useTransactionStore(s => s.ewayBill);
    const vehicleNo = useTransactionStore(s => s.vehicleNo);
    const notes = useTransactionStore(s => s.notes);
    const billingAddress = useTransactionStore(s => s.billingAddress);
    const shippingAddress = useTransactionStore(s => s.shippingAddress);
    const shippingSameAsBilling = useTransactionStore(s => s.shippingSameAsBilling);
    const ewayBillUrl = useTransactionStore(s => s.ewayBillUrl);
    const isFreightCollect = useTransactionStore(s => s.isFreightCollect);

    const setField = useTransactionStore(s => s.setField);
    const setEntityId = useTransactionStore(s => s.setEntityId);

    const [showAddresses, setShowAddresses] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    return (
        <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            {mode === "QUOTATION" ? "Quotation Details" : "Invoice Details"}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            {mode === "QUOTATION" ? "Drafting formal customer estimate" : "B2B tax invoice and customer metadata"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Client Selection */}
                    <div className="md:col-span-12 lg:col-span-4 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block">
                            Client / Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-xs transition-colors focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 h-10"
                            value={clientId}
                            onChange={e => setEntityId(e.target.value)}
                        >
                            <option value="">Select a client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Info size={12} className="text-slate-400" />
                            Auto-configures tax state and addresses
                        </p>
                    </div>

                    {/* Dates & Invoice Number */}
                    <div className="md:col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Input
                                label="Document Date"
                                type="date"
                                value={date}
                                onChange={e => setField("date", e.target.value)}
                                icon={<Calendar size={15} />}
                                required
                            />
                            {mode === "QUOTATION" && (
                                <Input
                                    label="Valid Until"
                                    type="date"
                                    value={validUntil}
                                    onChange={e => setField("validUntil", e.target.value)}
                                    icon={<Calendar size={15} />}
                                />
                            )}
                            <div className="space-y-1">
                                <Input
                                    label="Invoice Number"
                                    value={invoiceNo}
                                    onChange={e => setField("invoiceNo", e.target.value)}
                                    placeholder="Leave blank for auto-number"
                                />
                                <p className="text-[11px] text-slate-400">Leave blank for sequential</p>
                            </div>
                        </div>
                    </div>

                    {/* Tax Type */}
                    <div className="md:col-span-6 lg:col-span-4 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block">
                            GST Protocol
                        </label>
                        <select
                            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-xs focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 h-10"
                            value={gstType}
                            onChange={e => setField("gstType", e.target.value as any)}
                        >
                            <option value="CGST_SGST">Intra-State (CGST + SGST)</option>
                            <option value="IGST">Inter-State (IGST)</option>
                            <option value="NONE">Exempt / Zero Rated (0%)</option>
                        </select>
                    </div>

                    {/* Address Overrides Header */}
                    <div className="md:col-span-12 space-y-4 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddresses(!showAddresses)}
                                className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 text-xs font-medium cursor-pointer"
                            >
                                <MapPin size={14} className="text-slate-500" />
                                <span>{showAddresses ? "Hide Address Details" : "Review Billing & Shipping Addresses"}</span>
                                {showAddresses ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                            </button>

                            {!showAddresses && (
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span>Billed To: <strong className="text-slate-700 font-medium">{billingAddress.name || 'Auto-filled on client select'}</strong></span>
                                </div>
                            )}
                        </div>

                        {showAddresses && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 animate-reveal">
                                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                                        <Building2 size={14} className="text-slate-600" /> Billing Address
                                    </h4>
                                    <BillingForm 
                                        billing={billingAddress} 
                                        setBilling={(addr) => setField("billingAddress", addr)} 
                                    />
                                </div>

                                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                                            <Truck size={14} className="text-slate-600" /> Shipping Destination
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => setField("shippingSameAsBilling", !shippingSameAsBilling)}
                                            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                                        >
                                            {shippingSameAsBilling ? <CheckSquare size={14} className="text-slate-900" /> : <Square size={14} className="text-slate-400" />}
                                            <span>Same as billing</span>
                                        </button>
                                    </div>
                                    
                                    {!shippingSameAsBilling ? (
                                        <ShippingForm 
                                            shipping={shippingAddress} 
                                            setShipping={(addr) => setField("shippingAddress", addr)} 
                                        />
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-500">
                                            Shipping address mirrors the billing record above.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logistics & Notes */}
                    <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 items-end">
                        {mode === "INVOICE" && (
                            <>
                                <Input
                                    label="E-Way Bill Number"
                                    value={ewayBill}
                                    onChange={e => setField("ewayBill", e.target.value)}
                                    placeholder="Optional e-way bill number"
                                    icon={<Truck size={15} />}
                                />
                                <Input
                                    label="Vehicle Registration"
                                    value={vehicleNo}
                                    onChange={e => setField("vehicleNo", e.target.value)}
                                    placeholder="e.g. KL-10-XX-1234"
                                    icon={<Truck size={15} />}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700 block">E-Way Bill Document</label>
                                    <label className={cn(
                                        "flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-dashed transition-colors cursor-pointer px-3",
                                        ewayBillUrl ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'
                                    )}>
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                                        ) : (
                                            <CloudUpload className="w-4 h-4 text-slate-500" />
                                        )}
                                        <span className="text-xs font-medium truncate">
                                            {isUploading ? 'Uploading...' : (ewayBillUrl ? 'File Attached' : 'Attach File (PDF/Image)')}
                                        </span>
                                        <input type="file" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('file', file);
                                            setIsUploading(true);

                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData
                                                });

                                                if (!res.ok) {
                                                    const errorData = await res.json();
                                                    throw new Error(errorData.error || 'Upload failed');
                                                }
                                                const data = await res.json();
                                                setField('ewayBillUrl', data.url);
                                            } catch (err: any) {
                                                console.error('Upload Error:', err);
                                                alert(`Upload Failed: ${err.message}`);
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </>
                        )}
                        <div className={cn("space-y-1.5", mode === "INVOICE" ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-2")}>
                            <Input
                                label="Internal Notes & Remarks"
                                value={notes}
                                onChange={e => setField("notes", e.target.value)}
                                placeholder="PO reference, transport notes, delivery instructions..."
                            />
                        </div>
                        <div className="col-span-1 flex items-end">
                            <button
                                type="button"
                                onClick={() => setField("isFreightCollect", !isFreightCollect)}
                                className={cn(
                                    "flex items-center justify-between gap-3 px-3.5 w-full h-10 rounded-lg border transition-colors cursor-pointer text-xs font-medium",
                                    isFreightCollect 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Truck size={15} />
                                    <span>Freight Collect</span>
                                </div>
                                {isFreightCollect ? <CheckSquare size={15} className="text-white" /> : <Square size={15} className="text-slate-400" />}
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

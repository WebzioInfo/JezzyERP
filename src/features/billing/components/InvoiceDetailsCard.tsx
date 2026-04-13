"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/ui/core/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { Client } from "@/features/clients/types";
import { 
    Building2, Calendar, FileText, Truck, 
    ShieldCheck, HelpCircle, Info, MapPin, 
    ChevronDown, ChevronUp, CheckSquare, Square
} from "lucide-react";
import { cn } from "@/utils";
import { Address } from "@/types/invoice";
import BillingForm from "./BillingForm";
import ShippingForm from "./ShippingForm";

interface InvoiceDetailsCardProps {
    clients: Client[];
    state: {
        clientId: string;
        date: string;
        validUntil: string;
        gstType: string;
        ewayBill: string;
        vehicleNo: string;
        notes: string;
        billingAddress: Address;
        shippingAddress: Address;
        shippingSameAsBilling: boolean;
        invoiceNo: string;
    };
    mode?: "INVOICE" | "QUOTATION";
    setClientId: (val: string) => void;
    setDate: (val: string) => void;
    setValidUntil: (val: string) => void;
    setGstType: (val: any) => void;
    setInvoiceNo: (val: string) => void;
    setEwayBill: (val: string) => void;
    setVehicleNo: (val: string) => void;
    setNotes: (val: string) => void;
    setBillingAddress: (val: Address) => void;
    setShippingAddress: (val: Address) => void;
    setShippingSameAsBilling: (val: boolean) => void;
}

export function InvoiceDetailsCard({
    clients, state, mode = "INVOICE",
    setClientId, setDate, setValidUntil,
    setGstType, setInvoiceNo, setEwayBill, setVehicleNo, setNotes,
    setBillingAddress, setShippingAddress, setShippingSameAsBilling
}: InvoiceDetailsCardProps) {
    const { 
        clientId, date, validUntil, gstType, 
        invoiceNo, ewayBill, vehicleNo, notes,
        billingAddress, shippingAddress, shippingSameAsBilling
    } = state;

    const [showAddresses, setShowAddresses] = useState(false);


    return (
        <Card className="border-0 shadow-lg ring-1 ring-slate-200 overflow-hidden rounded-3xl">
            <CardHeader className={cn(
                "px-6 py-6 border-b",
                mode === 'QUOTATION' ? 'bg-amber-500' : 'bg-slate-900'
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                            {mode === 'QUOTATION' ? <HelpCircle className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                            <CardTitle className="text-white text-xl italic tracking-tight">{mode === "QUOTATION" ? "Quotation" : "Invoice"} Core Details</CardTitle>
                            <CardDescription className={mode === 'QUOTATION' ? 'text-amber-100' : 'text-slate-400'}>
                                {mode === "QUOTATION" ? "Drafting business estimate" : "Generating tax-compliant invoice"}
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Client Selection */}
                    <div className="md:col-span-12 lg:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                            <Building2 size={12} className="text-primary-500" /> Billed To <span className="text-danger-500">*</span>
                        </label>
                        <select
                            className="flex w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none h-[46px]"
                            value={clientId}
                            onChange={e => setClientId(e.target.value)}
                        >
                            <option value="">Select a Client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="flex items-center gap-1.5 mt-2 ml-1">
                            <Info size={10} className="text-slate-400" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Auto-loads GST preferences</p>
                        </div>
                    </div>

                    {/* Dates & Invoice Number */}
                    <div className="md:col-span-12 lg:col-span-8 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Input
                                label="Document Date"
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                icon={<Calendar size={16} />}
                                required
                            />
                            {mode === "INVOICE" ? null : (
                                <Input
                                    label="Valid Until"
                                    type="date"
                                    value={validUntil}
                                    onChange={e => setValidUntil(e.target.value)}
                                    className="border-amber-100"
                                    icon={<Calendar size={16} className="text-amber-500" />}
                                />
                            )}
                            <div className="space-y-1">
                                <Input
                                    label="Invoice Number"
                                    value={invoiceNo}
                                    onChange={e => setInvoiceNo(e.target.value)}
                                    placeholder="Leave blank for auto-gen"
                                    icon={<Info size={14} className="text-primary-400" />}
                                />
                                <div className="flex items-center gap-1.5 ml-1">
                                    <Info size={10} className="text-slate-400 shrink-0" />
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Format: JE/B2B/XX/FY</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Type */}
                    <div className="md:col-span-6 lg:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-primary-500" /> GST Configuration
                        </label>
                        <select
                            className="flex w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none h-[46px] font-bold"
                            value={gstType}
                            onChange={e => setGstType(e.target.value)}
                        >
                            <option value="CGST_SGST">Intra-state (9+9)</option>
                            <option value="IGST">Inter-state (18%)</option>
                            <option value="NO_GST">Exempted (0%)</option>
                        </select>
                    </div>

                    {/* Address Overrides */}
                    <div className="md:col-span-12 space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
                            <button
                                type="button"
                                onClick={() => setShowAddresses(!showAddresses)}
                                className="flex items-center gap-2 group"
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    showAddresses ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                )}>
                                    <MapPin size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Address Overrides</p>
                                    <p className="text-sm font-bold text-slate-700 leading-none">
                                        {showAddresses ? "Hide Management" : "Review Billing & Shipping"}
                                    </p>
                                </div>
                                {showAddresses ? <ChevronUp size={14} className="ml-2 text-slate-400" /> : <ChevronDown size={14} className="ml-2 text-slate-400 group-hover:translate-y-0.5 transition-transform" />}
                            </button>

                            {!showAddresses && (
                                <div className="flex items-center gap-6 ml-auto pr-2">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Billed To</span>
                                        <span className="text-[11px] font-bold text-slate-500 max-w-[150px] truncate italic">{billingAddress.name || 'No Name'}</span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-100 hidden sm:block"></div>
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Shipping To</span>
                                        <span className="text-[11px] font-bold text-slate-500 max-w-[150px] truncate italic">
                                            {shippingSameAsBilling ? "Same as Billing" : (shippingAddress.name || 'No Name')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showAddresses && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-950 flex items-center gap-2 italic">
                                            <Building2 size={12} className="text-primary-500" /> Billing Address Snapshot
                                        </h4>
                                    </div>
                                    <BillingForm 
                                        billing={billingAddress} 
                                        setBilling={setBillingAddress} 
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-950 flex items-center gap-2 italic">
                                            <Truck size={12} className="text-green-500" /> Shipping Destination
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => setShippingSameAsBilling(!shippingSameAsBilling)}
                                            className="flex items-center gap-1.5 transition-all"
                                        >
                                            {shippingSameAsBilling ? <CheckSquare size={14} className="text-primary-600" /> : <Square size={14} className="text-slate-300" />}
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", shippingSameAsBilling ? "text-primary-600" : "text-slate-400")}>Same as billing</span>
                                        </button>
                                    </div>
                                    
                                    {!shippingSameAsBilling && (
                                        <div className="animate-in zoom-in-95 duration-300">
                                            <ShippingForm 
                                                shipping={shippingAddress} 
                                                setShipping={setShippingAddress} 
                                            />
                                        </div>
                                    )}
                                    {shippingSameAsBilling && (
                                        <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <Truck size={18} className="text-slate-300" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Shipping mirrors billing record</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logistics & Notes */}
                    <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                        {mode === "INVOICE" && (
                            <>
                                <Input
                                    label="E-Way Bill Number"
                                    value={ewayBill}
                                    onChange={e => setEwayBill(e.target.value)}
                                    placeholder="Optional"
                                    icon={<Truck size={16} />}
                                />
                                <Input
                                    label="Vehicle Registration"
                                    value={vehicleNo}
                                    onChange={e => setVehicleNo(e.target.value)}
                                    placeholder="e.g. AS-01-XX-1234"
                                    icon={<Truck size={16} />}
                                />
                            </>
                        )}
                        <div className={cn("space-y-2", mode === "QUOTATION" ? "lg:col-span-3" : "lg:col-span-1")}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Internal Notes</label>
                            <textarea
                                className="flex w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 resize-none h-[46px]"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Ref tags, PO number, etc."
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

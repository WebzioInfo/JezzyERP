"use client";

import { Card, CardContent } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { 
    Building2, 
    Calendar, 
    ShieldCheck, 
    Truck, 
    Hash, 
    FileText,
    CloudUpload
} from "lucide-react";
import { useState } from "react";
import { StateSelect } from "@/components/forms/StateSelect";

interface PurchaseDetailsCardProps {
    vendors: any[];
    state: any;
    setVendorId: (id: string) => void;
    setInvoiceNo: (no: string) => void;
    setDate: (date: string) => void;
    setGstType: (type: string) => void;
    setEwayBill: (no: string) => void;
    setEwayBillUrl: (url: string) => void;
    setVehicleNo: (no: string) => void;
    setNotes: (notes: string) => void;
}

export function PurchaseDetailsCard({
    vendors,
    state,
    setVendorId,
    setInvoiceNo,
    setDate,
    setGstType,
    setEwayBill,
    setEwayBillUrl,
    setVehicleNo,
    setNotes
}: PurchaseDetailsCardProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Primary Details */}
            <Card className="xl:col-span-2 overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white italic tracking-tight uppercase font-display">Inward Supply Protocol</h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Procurement v4.0</div>
                </div>

                <CardContent className="p-10 space-y-10">
                    {/* Vendor Selection */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Supplier Identification</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                                <Building2 size={20} />
                            </div>
                            <select
                                className="w-full bg-slate-50/50 h-16 pl-14 pr-10 rounded-2xl border-none clay-inner focus:ring-4 focus:ring-primary-500/10 focus:bg-white text-base font-semibold text-slate-900 transition-all appearance-none cursor-pointer"
                                value={state.vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                            >
                                <option value="" disabled>Select Vendor Hub...</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.gst || 'No GST'})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Input
                                label="Invoice Number"
                                placeholder="INV/2024/001"
                                value={state.invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                                icon={<FileText size={20} />}
                                required
                            />
                            <Input
                                label="Invoice Date"
                                type="date"
                                value={state.date}
                                onChange={(e) => setDate(e.target.value)}
                                icon={<Calendar size={20} />}
                            />
                            <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Taxation Architecture</label>
                            <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl clay-inner">
                                <button
                                    onClick={() => setGstType("CGST_SGST")}
                                    className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.gstType === "CGST_SGST" ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Intra-State
                                </button>
                                <button
                                    onClick={() => setGstType("IGST")}
                                    className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.gstType === "IGST" ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Inter-State
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logistics & EWAYbill */}
            <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center gap-4">
                    <Truck className="w-5 h-5 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest italic">Logistics & Compliance</h3>
                </div>

                <CardContent className="p-8 space-y-8">
                    <Input
                        label="Vehicle Registration #"
                        placeholder="KL 10 AA 0000"
                        value={state.vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        icon={<Hash size={18} />}
                        className="uppercase"
                    />
                    
                    <div className="space-y-4">
                        <Input
                            label="E-Way Bill Number"
                            placeholder="12-digit number"
                            value={state.ewayBill}
                            onChange={(e) => setEwayBill(e.target.value)}
                            icon={<FileText size={18} />}
                        />
                        
                        <div className="pt-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-3 italic">Digital Instrument Upload</p>
                            <label className={`flex flex-col items-center justify-center w-full h-32 rounded-4xl border-2 border-dashed transition-all cursor-pointer group ${state.ewayBillUrl ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200'}`}>
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <CloudUpload className={`w-8 h-8 mb-2 transition-colors ${state.ewayBillUrl ? 'text-emerald-500' : 'text-slate-300 group-hover:text-primary-500'}`} />
                                    <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${state.ewayBillUrl ? 'text-emerald-600' : 'text-slate-400 group-hover:text-primary-600'}`}>
                                        {state.ewayBillUrl ? 'Document Staged' : 'Select EWAYbill'}
                                    </p>
                                </div>
                                <input type="file" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append('file', file);

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData
                                        });

                                        if (!res.ok) throw new Error('Upload failed');
                                        const data = await res.json();
                                        setEwayBillUrl(data.url);
                                    } catch (err) {
                                        console.error('Upload Error:', err);
                                        alert('Failed to upload EWAYbill to Cloudinary. Please check configuration.');
                                    }
                                }} />
                            </label>
                            {state.ewayBillUrl && (
                                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-3 text-center animate-in fade-in duration-500">
                                    ✓ Document Securely Encrypted
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic mb-2 block">Notes / Annotations</label>
                        <textarea
                            className="w-full bg-slate-50/50 rounded-2xl p-4 text-[13px] font-semibold text-slate-900 clay-inner min-h-[100px] focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all border-none resize-none"
                            placeholder="Internal procurement notes..."
                            value={state.notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

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

import { useTransactionStore } from "@/lib/store/transactionStore";

interface PurchaseDetailsCardProps {
    vendors?: any[];
    purchase?: any;
}

export function PurchaseDetailsCard({
    vendors,
    purchase
}: PurchaseDetailsCardProps) {
    const isViewOnly = !!purchase;
    const store = useTransactionStore();
    const setField = store.setField;
    const setEntityId = store.setEntityId;

    // View data mapping
    const vendorName = purchase?.vendor?.name || "N/A";
    const gstTypeLabel = purchase?.gstType === "CGST_SGST" ? "Intra-State (CGST/SGST)" : "Inter-State (IGST)";

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Primary Details */}
            <Card className="xl:col-span-2 overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white italic tracking-tight uppercase font-display">
                            {isViewOnly ? "Supply Instrument" : "Inward Supply Protocol"}
                        </h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {isViewOnly ? `ID: ${purchase.id.slice(-8)}` : "Procurement v4.0"}
                    </div>
                </div>

                <CardContent className="p-10 space-y-10">
                    {/* Vendor Selection / Display */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Supplier Identification</label>
                        {isViewOnly ? (
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-600 border border-slate-100">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{vendorName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        GSTIN: <span className="text-slate-600">{purchase.vendor?.gst || 'UNREGISTERED'}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                                    <Building2 size={20} />
                                </div>
                                <select
                                    className="w-full bg-slate-50/50 h-16 pl-14 pr-10 rounded-2xl border-none clay-inner focus:ring-4 focus:ring-primary-500/10 focus:bg-white text-base font-semibold text-slate-900 transition-all appearance-none cursor-pointer"
                                    value={store.entityId}
                                    onChange={(e) => setEntityId(e.target.value)}
                                >
                                    <option value="" disabled>Select Vendor Hub...</option>
                                    {vendors?.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.gst || 'No GST'})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isViewOnly ? (
                            <>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Invoice Reference</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-900 uppercase tracking-tight italic">
                                        {purchase.invoiceNo}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Supply Date</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-900 italic">
                                        {new Date(purchase.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">GST Protocol</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-900 text-[10px] uppercase tracking-widest">
                                        {gstTypeLabel}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Input
                                    label="Invoice Number"
                                    placeholder="INV/2024/001"
                                    value={store.invoiceNo}
                                    onChange={(e) => setField("invoiceNo", e.target.value)}
                                    icon={<FileText size={20} />}
                                    required
                                />
                                <Input
                                    label="Invoice Date"
                                    type="date"
                                    value={store.date}
                                    onChange={(e) => setField("date", e.target.value)}
                                    icon={<Calendar size={20} />}
                                />
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Taxation Architecture</label>
                                    <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl clay-inner">
                                        <button
                                            onClick={() => setField("gstType", "CGST_SGST")}
                                            className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${store.gstType === "CGST_SGST" ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Intra-State
                                        </button>
                                        <button
                                            onClick={() => setField("gstType", "IGST")}
                                            className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${store.gstType === "IGST" ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Inter-State
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Logistics & Compliance */}
            <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center gap-4">
                    <Truck className="w-5 h-5 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest italic">Logistics & Compliance</h3>
                </div>

                <CardContent className="p-8 space-y-8">
                    {isViewOnly ? (
                        <>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Vehicle Identity</p>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-900 uppercase tracking-widest">
                                    {purchase.vehicleNo || "NOT RECORDED"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">E-Way Bill</p>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-900 uppercase tracking-widest">
                                    {purchase.ewayBill || "NOT RECORDED"}
                                </div>
                            </div>
                            {purchase.ewayBillUrl && (
                                <a href={purchase.ewayBillUrl} target="_blank" rel="noreferrer" className="block p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center group hover:bg-emerald-100 transition-all">
                                    <CloudUpload className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">View Digital Instrument</span>
                                </a>
                            )}
                        </>
                    ) : (
                        <>
                            <Input
                                label="Vehicle Registration #"
                                placeholder="KL 10 AA 0000"
                                value={store.vehicleNo}
                                onChange={(e) => setField("vehicleNo", e.target.value)}
                                icon={<Hash size={18} />}
                                className="uppercase"
                            />

                            <div className="space-y-4">
                                <Input
                                    label="E-Way Bill Number"
                                    placeholder="12-digit number"
                                    value={store.ewayBill}
                                    onChange={(e) => setField("ewayBill", e.target.value)}
                                    icon={<FileText size={18} />}
                                />

                                <div className="pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-3 italic">Digital Instrument Upload</p>
                                    <label className={`flex flex-col items-center justify-center w-full h-32 rounded-4xl border-2 border-dashed transition-all cursor-pointer group ${store.ewayBillUrl ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200'}`}>
                                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                            <CloudUpload className={`w-8 h-8 mb-2 transition-colors ${store.ewayBillUrl ? 'text-emerald-500' : 'text-slate-300 group-hover:text-primary-500'}`} />
                                            <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${store.ewayBillUrl ? 'text-emerald-600' : 'text-slate-400 group-hover:text-primary-600'}`}>
                                                {store.ewayBillUrl ? 'Document Staged' : 'Select EWAYbill'}
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
                                                setField("ewayBillUrl", data.url);
                                            } catch (err) {
                                                console.error('Upload Error:', err);
                                                alert('Failed to upload EWAYbill to Cloudinary. Please check configuration.');
                                            }
                                        }} />
                                    </label>
                                    {store.ewayBillUrl && (
                                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-3 text-center animate-in fade-in duration-500">
                                            ✓ Document Securely Encrypted
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="pt-4 space-y-6">
                        {isViewOnly ? (
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 italic">Record Annotations</p>
                                    <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                                        {purchase.notes || "NO INTERNAL NOTES RECORDED FOR THIS PROCUREMENT NODE."}
                                    </p>
                                </div>
                                {purchase.isFreightCollect && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 text-white shadow-xl">
                                        <ShieldCheck className="w-6 h-6 text-primary-400" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Procurement Term</p>
                                            <p className="text-xs font-black uppercase italic tracking-tighter leading-none text-primary-500">Freight Collect</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic mb-1 block">Notes / Annotations</label>
                                    <textarea
                                        className="w-full bg-slate-50/50 rounded-2xl p-4 text-[13px] font-semibold text-slate-900 clay-inner min-h-[80px] focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all border-none resize-none"
                                        placeholder="Internal procurement notes..."
                                        value={store.notes}
                                        onChange={(e) => setField("notes", e.target.value)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setField("isFreightCollect", !store.isFreightCollect)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${store.isFreightCollect ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    {store.isFreightCollect ? <ShieldCheck className="w-6 h-6 text-primary-400" /> : <div className="w-6 h-6 border-2 border-slate-200 rounded-lg opacity-20" />}
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Procurement Term</p>
                                        <p className="text-xs font-black uppercase italic tracking-tighter leading-none">Freight Collect</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

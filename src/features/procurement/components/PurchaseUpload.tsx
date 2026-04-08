"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText, Loader2, Sparkles, CheckCircle2, ChevronRight, AlertCircle, ShoppingCart, Repeat } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/financials";

interface ExtractedItem {
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    amount: number;
    productId?: string; // Mapped product ID
}

interface PurchaseUploadProps {
    products: any[];
    onExtract: (data: any) => void;
}

export function PurchaseUpload({ products, onExtract }: PurchaseUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const { success, error, info } = useToast();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            info("AI is analyzing your bill. Please wait...");
            const res = await fetch("/api/purchases/extract", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (result.success) {
                setExtractedData(result.data);
                success("Bill extracted successfully! Please review the details.");
            } else {
                error(result.error || "Failed to extract bill data.");
            }
        } catch (err) {
            error("A network error occurred during extraction.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirm = () => {
        if (onExtract) onExtract(extractedData);
    };

    if (extractedData) {
        return (
            <Card className="p-10 border-0 shadow-2xl bg-white animate-in zoom-in-95 duration-500 overflow-hidden">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">Review Bill Data</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Extracted via AI Intelligence</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <Input 
                            label="Invoice No" 
                            value={extractedData.invoiceNo} 
                            onChange={(e) => setExtractedData({...extractedData, invoiceNo: e.target.value})}
                        />
                        <Input 
                            label="Bill Date" 
                            type="date"
                            value={extractedData.date} 
                            onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                        />
                    </div>
                    <div className="space-y-4">
                        <Input 
                            label="Vendor GST (Read-only)" 
                            value={extractedData.vendorGst} 
                            disabled
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-4 h-4 text-primary-600" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Bill Items</h4>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Description</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Qty</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Rate</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Mapping</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {extractedData.items.map((item: ExtractedItem, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input 
                                                className="w-full bg-transparent border-0 font-bold text-sm text-slate-800 focus:outline-none"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItems = [...extractedData.items];
                                                    newItems[idx].description = e.target.value;
                                                    setExtractedData({...extractedData, items: newItems});
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input 
                                                className="w-20 bg-transparent border-0 font-bold text-sm text-slate-800 focus:outline-none"
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const newItems = [...extractedData.items];
                                                    newItems[idx].qty = parseFloat(e.target.value);
                                                    setExtractedData({...extractedData, items: newItems});
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input 
                                                className="w-24 bg-transparent border-0 font-bold text-sm text-slate-800 focus:outline-none"
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => {
                                                    const newItems = [...extractedData.items];
                                                    newItems[idx].rate = parseFloat(e.target.value);
                                                    setExtractedData({...extractedData, items: newItems});
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold italic"
                                                value={item.productId || ""}
                                                onChange={(e) => {
                                                    const newItems = [...extractedData.items];
                                                    newItems[idx].productId = e.target.value;
                                                    setExtractedData({...extractedData, items: newItems});
                                                }}
                                            >
                                                <option value="">Select Catalog Item...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.description}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-slate-100">
                    <Button 
                        onClick={handleConfirm}
                        className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                        Save as Purchase
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button 
                        onClick={() => {
                            if (onExtract) onExtract({...extractedData, mode: 'resell'});
                        }}
                        className="flex-1 h-14 rounded-2xl bg-primary-600 text-white font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary-500/20"
                    >
                        Create Sales Invoice (RESELL)
                        <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={() => setExtractedData(null)}
                        className="h-14 px-8 rounded-2xl font-black uppercase italic tracking-widest text-slate-400"
                    >
                        Discard
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden group shadow-2xl border-0 bg-white">
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-transparent pointer-events-none" />
            
            <div className="p-16 text-center space-y-10">
                <div className="mx-auto w-24 h-24 bg-primary-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-primary-200 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    {isUploading ? (
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    ) : (
                        <Upload className="w-10 h-10 text-primary-600" />
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 font-display uppercase">
                        AI Purchase <span className="text-primary-600">Sync</span>
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto italic">
                        Upload invoice images or PDFs to automate line-item extraction and inventory reconciliation.
                    </p>
                </div>

                <div className="relative group/input max-w-md mx-auto">
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl group-hover/input:bg-primary-600 group-hover/input:scale-105 transition-all">
                        {isUploading ? "Intelligence in Motion..." : "Process Invoice"}
                        <Sparkles className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-10 pt-8 opacity-40">
                    <div className="flex flex-col items-center">
                        <FileText className="w-5 h-5 text-slate-400 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Multi-Vendor Support</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Repeat className="w-5 h-5 text-slate-400 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Resell Mapping</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

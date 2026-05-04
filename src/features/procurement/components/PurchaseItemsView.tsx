"use client";

import React from "react";
import { Package, Tag, Landmark, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/utils/financials";

interface PurchaseItemsViewProps {
    items: any[];
}

export function PurchaseItemsView({ items }: PurchaseItemsViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Supply <span className="text-primary-600">Audit</span></h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Validated procurement line items</p>
                </div>
                <div className="px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black text-white uppercase tracking-widest italic shadow-xl">
                    {items.length} POSITIONS
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={item.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500">
                        <div className="flex flex-col lg:flex-row">
                            {/* Primary Details */}
                            <div className="flex-1 p-8 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Package size={28} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Position {index + 1}</span>
                                        <div className="h-px flex-1 bg-slate-50" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight truncate group-hover:text-primary-600 transition-colors">
                                        {item.description}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        {item.hsn && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                                                <Landmark size={12} /> HSN: {item.hsn}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-lg text-[10px] font-black text-primary-600 uppercase tracking-widest border border-primary-100 italic">
                                            {item.unit || "NOS"}
                                        </div>
                                        {item.pkgCount > 0 && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg text-[10px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">
                                                {item.pkgCount} {item.pkgType || "PKGS"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="lg:w-80 bg-slate-50/50 border-l border-slate-100 p-8 flex flex-col justify-center space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate & Volume</span>
                                    <span className="text-sm font-black text-slate-900 italic tracking-tight">
                                        {formatCurrency(Number(item.rate))} × {item.qty}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Provision</span>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                        {item.taxPercent}% GST ({formatCurrency(Number(item.taxAmount))})
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Gross Total</span>
                                    <span className="text-xl font-black text-slate-900 italic tracking-tighter">
                                        {formatCurrency(Number(item.totalAmount))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

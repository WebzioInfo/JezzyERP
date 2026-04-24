"use client";

import { useState } from "react";
import { 
    Search, 
    Filter, 
    Plus, 
    ShoppingCart, 
    ShieldCheck, 
    CloudDownload, 
    MoreVertical, 
    ArrowRight 
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/ui/core/Card";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { PurchaseListActions } from "./PurchaseListActions";

interface PurchaseTableProps {
    purchases: any[];
    isTrashed?: boolean;
}

export function PurchaseTable({ purchases, isTrashed = false }: PurchaseTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = purchases.filter(p =>
        p.purchaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header + Search */}
            <Card className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-100 bg-white">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search procurement registry..."
                            className="w-full h-14 pl-12 pr-6 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="h-14 w-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-primary-600 transition-all">
                            <Filter size={20} />
                        </button>
                        <Link
                            href="/purchases/new"
                            className="h-14 px-8 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-black/10"
                        >
                            <Plus size={18} />
                            <span>Log Purchase</span>
                        </Link>
                    </div>
                </div>
            </Card>

            {/* Table Listing */}
            <Card className="border-0 shadow-2xl shadow-primary-900/5 overflow-hidden">
                <CardHeader className="bg-slate-900 rounded-t-4xl px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                            <ShoppingCart className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white font-display uppercase italic tracking-tight">Acquisition Registry</h3>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest italic">Live inward ledger & tax claim monitoring</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Inventory Node</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Supplier Authority</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400 text-center">Protocol Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400 text-right">Input GST Claim</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400 text-right">Net Value</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((purchase) => (
                                    <tr key={purchase.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all font-mono font-black text-[10px] text-slate-400 group-hover:text-primary-600">
                                                    {purchase.purchaseNo.split('-').pop()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight group-hover:text-primary-600 transition-colors">{purchase.purchaseNo}</p>
                                                        {purchase.isFreightCollect && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 text-[8px] font-black text-white uppercase italic tracking-tighter">
                                                                <ShieldCheck className="w-2.5 h-2.5 text-primary-400" />
                                                                FC
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{purchase.status}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{purchase.vendor?.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">ID: {purchase.vendor?.gst || 'UNREGISTERED'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{new Date(purchase.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-sm font-black text-emerald-600 tabular-nums italic">+{formatCurrency(purchase.taxTotal)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-lg font-black text-slate-900 tabular-nums italic tracking-tighter">{formatCurrency(purchase.grandTotal)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                                                {!isTrashed && purchase.ewayBillUrl && (
                                                    <button className="p-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100 transition-all shadow-sm shadow-primary-500/10" title="Download EWAYbill">
                                                        <CloudDownload size={16} />
                                                    </button>
                                                )}
                                                <PurchaseListActions 
                                                  purchaseId={purchase.id} 
                                                  isTrashed={isTrashed} 
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-32 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 shadow-inner mb-6">
                                <ShoppingCart className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-black text-2xl font-display uppercase italic tracking-tighter">Registry is Empty</h3>
                            <p className="text-sm font-bold text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">No inward purchases recorded in the current protocol window.</p>
                            <Link href="/purchases/new" className="mt-8 h-10 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg shadow-black/10">Log Initial Node <ArrowRight className="w-3.5 h-3.5" /></Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

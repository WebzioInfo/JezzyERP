"use client";

import { useState } from "react";
import { 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit2, 
    ShoppingCart, 
    Plus,
    Filter,
    ShieldCheck,
    Calendar,
    ArrowRight,
    TrendingUp,
    FileText,
    CloudDownload
} from "lucide-react";
import { formatCurrency } from "@/utils/financials";
import Link from "next/link";
import { cn } from "@/utils";

interface PurchaseTableProps {
    purchases: any[];
}

export function PurchaseTable({ purchases }: PurchaseTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = purchases.filter(p => 
        p.purchaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in custom-scrollbar">
            {/* Header + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/40 p-8 rounded-[2.5rem] border border-white/50 backdrop-blur-xl">
                <div className="flex-1 max-w-md relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search inward registry / vendor supply..."
                        className="w-full bg-white/80 h-16 pl-14 pr-6 rounded-2xl border-none clay-inner focus:ring-4 focus:ring-primary-500/10 focus:bg-white text-base font-semibold text-slate-900 transition-all placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="h-16 w-16 flex items-center justify-center clay-btn bg-white rounded-2xl text-slate-400 hover:text-primary-600 transition-all">
                        <Filter size={20} />
                    </button>
                    <Link 
                        href="/purchases/new"
                        className="h-16 px-8 flex items-center gap-4 clay-btn bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
                    >
                        <Plus size={20} />
                        <span>Log Purchase</span>
                    </Link>
                </div>
            </div>

            {/* Table Listing */}
            <div className="bg-white/40 rounded-[2.5rem] border border-white/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/5">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Node</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Supplier Authority</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Protocol Date</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Input GST Claim</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Net Value</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {filtered.map((purchase) => (
                            <tr key={purchase.id} className="group hover:bg-white transition-all duration-300">
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all font-mono font-black text-[10px] text-slate-400 group-hover:text-primary-600">
                                            {purchase.purchaseNo.split('-').pop()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{purchase.purchaseNo}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">{purchase.status}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-7">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 italic tracking-tight">{purchase.vendor?.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">ID: {purchase.vendor?.gst || 'UNREGISTERED'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-7 text-center">
                                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{new Date(purchase.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <span className="text-sm font-black text-emerald-600 tabular-nums italic">+{formatCurrency(purchase.taxTotal)}</span>
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <span className="text-base font-black text-slate-900 tabular-nums italic">{formatCurrency(purchase.grandTotal)}</span>
                                </td>
                                <td className="px-8 py-7 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                        {purchase.ewayBillUrl && (
                                            <button className="p-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100 transition-all shadow-sm shadow-primary-500/10" title="Download EWAYbill">
                                                <CloudDownload size={16} />
                                            </button>
                                        )}
                                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100 transition-all shadow-sm">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="py-32 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 mb-8 border-dashed group">
                             <ShoppingCart className="w-10 h-10 text-slate-200 group-hover:animate-bounce" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Inventory Ledger Empty</h4>
                        <p className="text-slate-400 mt-2 font-medium max-w-xs leading-relaxed italic uppercase text-[10px] tracking-[0.2em]">No inward purchases recorded in the current protocol window.</p>
                        <Link href="/purchases/new" className="mt-8 text-primary-600 font-extrabold text-xs uppercase tracking-widest border-b-2 border-primary-200 hover:border-primary-600 transition-colors pb-1 italic">Log Initial Procurement Node</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

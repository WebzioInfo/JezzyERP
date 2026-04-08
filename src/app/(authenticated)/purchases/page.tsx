import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PurchaseTable } from "@/features/procurement/components/PurchaseTable";
import { PurchaseService } from "@/features/procurement/services/PurchaseService";
import { ShoppingCart, TrendingUp, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/financials";

export default async function PurchasesPage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const purchaseService = new PurchaseService();
    const purchases = await purchaseService.getAllPurchases();

    const totalInputGst = purchases.reduce((sum, p) => sum + Number(p.taxTotal), 0);
    const totalPurchaseValue = purchases.reduce((sum, p) => sum + Number(p.grandTotal), 0);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Page Header (Informational) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase">
                        Registry <span className="text-primary-600">Leads</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic uppercase tracking-tighter">
                        Comprehensive inward ledger for tracking acquisitions, input tax claims, and supplier settlements.
                    </p>
                    
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a 
                          href="/purchases/import" 
                          className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-black text-white px-8 py-4 rounded-2xl font-black italic tracking-widest uppercase shadow-2xl shadow-indigo-500/30 transition-all group scale-105"
                        >
                            <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                            AI Resell: Import Bill
                            <ArrowRight size={20} className="opacity-50" />
                        </a>
                    </div>
                </div>

                <div className="hidden lg:grid grid-cols-2 gap-4">
                    <div className="bg-white px-8 py-6 rounded-[2.5rem] border border-slate-200/40 shadow-2xl flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-inner">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Input GST Claim</div>
                            <div className="text-2xl font-black text-slate-900 tabular-nums italic">+{formatCurrency(totalInputGst)}</div>
                        </div>
                    </div>
                    <div className="bg-slate-900 px-8 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shadow-inner">
                            <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Procurement</div>
                            <div className="text-2xl font-black text-white tabular-nums italic">{formatCurrency(totalPurchaseValue)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Listing Area */}
            <div className="w-full">
                <PurchaseTable purchases={purchases} />
            </div>
        </div>
    );
}

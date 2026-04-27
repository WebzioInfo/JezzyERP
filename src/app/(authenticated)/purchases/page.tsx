import { Card, CardContent } from "@/ui/core/Card";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PurchaseTable } from "@/features/procurement/components/PurchaseTable";
import { PurchaseService } from "@/features/procurement/services/PurchaseService";
import { Zap, ArrowRight, ShieldCheck, TrendingUp, Building2, Search } from "lucide-react";
import { formatCurrency } from "@/utils/financials";
import { db } from "@/db/prisma/client";
import { LiveSearch } from "@/components/common/LiveSearch";
import { serializePrisma } from "@/utils/serialization";

export default async function PurchasesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { q: searchQuery = "" } = await searchParams;

    const purchases = await db.purchase.findMany({
        where: {
            deletedAt: null,
            ...(searchQuery && {
                OR: [
                    { purchaseNo: { contains: searchQuery } },
                    { vendor: { name: { contains: searchQuery } } },
                ]
            })
        },
        include: { vendor: true },
        orderBy: { date: "desc" }
    });

    const totalInputGst = purchases.reduce((sum, p) => sum + p.taxTotal.toNumber(), 0);
    const totalPurchaseValue = purchases.reduce((sum, p) => sum + p.grandTotal.toNumber(), 0);

    // Vendor Analysis
    const vendorTotals: Record<string, { name: string, total: number }> = {};
    purchases.forEach(p => {
        if (!vendorTotals[p.vendorId]) {
            vendorTotals[p.vendorId] = { name: p.vendor.name, total: 0 };
        }
        vendorTotals[p.vendorId].total += p.grandTotal.toNumber();
    });
    const topVendors = Object.values(vendorTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Page Header (Informational) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase">
                        Procurement <span className="text-primary-600">Ledger</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
                        Comprehensive inward ledger for tracking acquisitions, input tax claims, and supplier settlements.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href="/purchases/import"
                            className="h-16 px-10 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <Zap className="w-5 h-5" />
                            <span>AI Import Bill</span>
                            <ArrowRight className="w-5 h-5 opacity-50" />
                        </a>
                    </div>
                </div>
                <div className="hidden lg:grid grid-cols-1 gap-4">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 flex items-center gap-6 px-8 py-6">
                        <div className="w-16 h-12 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-inner">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Input GST Claim</div>
                            <div className="text-2xl font-black text-slate-900 tabular-nums italic">+{formatCurrency(totalInputGst)}</div>
                        </div>
                    </Card>
                    <Card className="border-0 bg-slate-900 shadow-2xl flex items-center gap-6 px-8 py-6">
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shadow-inner">
                            <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                        <div className="w-full">
                            <div className="text-[10px] w-full font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Total Procurement</div>
                            <div className="text-2xl font-black text-white tabular-nums italic">{formatCurrency(totalPurchaseValue)}</div>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <LiveSearch 
                    placeholder="Search Procurement Registry..." 
                    className="flex-1 w-full"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="w-full">
                        <PurchaseTable purchases={serializePrisma(purchases)} />
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 bg-white shadow-2xl overflow-hidden rounded-[2.5rem]">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 italic">Top Suppliers</h3>
                            </div>

                            <div className="space-y-6">
                                {topVendors.length === 0 ? (
                                    <p className="text-xs font-bold text-slate-400 italic">No supplier data available.</p>
                                ) : (
                                    topVendors.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase truncate max-w-[150px]">{v.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Primary Vendor</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-slate-900 italic">{formatCurrency(v.total)}</div>
                                                <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">Acquisition Vol</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Suppliers</span>
                                    <span className="text-sm font-black text-slate-900">{Object.keys(vendorTotals).length} Entities</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ledger Policy</h4>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic uppercase tracking-wider">
                            All inward bills are subject to internal audit before input tax credits are recognized in the final tax claim cycle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { PurchaseService } from "@/features/procurement/services/PurchaseService";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { PurchaseDetailsCard } from "@/features/procurement/components/PurchaseDetailsCard";
import { PurchaseItemsView } from "@/features/procurement/components/PurchaseItemsView";
import { ArrowLeft, Edit3, Printer, Share2, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/core/Button";
import { Card } from "@/ui/core/Card";
import { formatCurrency } from "@/utils/financials";

export default async function PurchaseViewPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { id } = await params;
    const purchaseService = new PurchaseService();
    const purchase = await purchaseService.getPurchaseById(id);

    if (!purchase) notFound();

    const subTotal = Number(purchase.subTotal || 0);
    const taxTotal = Number(purchase.taxTotal || 0);
    const grandTotal = Number(purchase.grandTotal || 0);
    const roundOff = grandTotal - (subTotal + taxTotal);

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/purchases">
                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-2xl bg-white shadow-xl hover:bg-slate-50">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] italic">Procurement Node</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                            {purchase.purchaseNo}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/purchases/${id}/edit`}>
                        <Button variant="ghost" className="bg-white shadow-xl hover:bg-slate-50 gap-2 h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 border border-slate-100">
                            <Edit3 size={16} className="text-primary-500" />
                            Modify Record
                        </Button>
                    </Link>
                    <Button variant="ghost" className="bg-slate-900 shadow-xl hover:bg-black gap-3 h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white">
                        <Printer size={18} className="text-primary-400" />
                        Print Protocol
                    </Button>
                </div>
            </div>

            {/* Step 1: Core Details */}
            <PurchaseDetailsCard purchase={purchase} />

            {/* Step 2: Line Items */}
            <PurchaseItemsView items={purchase.lineItems} />

            {/* Step 3: Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="bg-slate-900 border-0 p-10 shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
                    <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none group-hover:scale-110 transition-all duration-1000">
                        <Info size={240} className="text-white" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/40">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-black text-2xl italic uppercase tracking-tight font-display text-primary-500">Validation Status</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            This procurement record has been committed to the master ledger and synchronized with inventory reserves. 
                            The associated Input Tax Credit (ITC) of {formatCurrency(taxTotal)} is now eligible for reconciliation.
                        </p>
                        <div className="flex gap-4">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                Audit Ready
                            </div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                Ledger Synced
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-0 shadow-3xl ring-1 ring-slate-900/5 bg-white p-10 overflow-hidden rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Financial Summary</h4>
                        <div className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">Final Value</div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm font-black text-slate-400">
                            <span className="uppercase tracking-[0.2em] text-[10px]">Supply Base Value</span>
                            <span className="tabular-nums text-slate-900 italic">{formatCurrency(subTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-black text-slate-400">
                            <span className="uppercase tracking-[0.2em] text-[10px]">Tax Provision</span>
                            <span className="tabular-nums text-emerald-600 italic">+{formatCurrency(taxTotal)}</span>
                        </div>

                        {Math.abs(roundOff) > 0.01 && (
                            <div className="flex justify-between items-center text-sm font-black text-slate-400">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Round Off</span>
                                <span className="tabular-nums text-slate-500 italic">{roundOff > 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="pt-10 border-t border-slate-50 mt-6">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Gross Cost</p>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Aggregate INR Value</p>
                                </div>
                                <p className="text-5xl font-black tracking-tighter text-slate-900 italic">
                                    {formatCurrency(grandTotal)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

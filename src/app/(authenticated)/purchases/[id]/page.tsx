import { PurchaseService } from "@/features/procurement/services/PurchaseService";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { PurchaseDetailsCard } from "@/features/procurement/components/PurchaseDetailsCard";
import { PurchaseItemsView } from "@/features/procurement/components/PurchaseItemsView";
import { ArrowLeft, Edit3, Printer, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/core/Button";
import { Card, CardContent } from "@/ui/core/Card";
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
        <div className="max-w-5xl mx-auto space-y-6 pb-16">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/purchases">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg border border-slate-200">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Purchase Bill</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {purchase.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                            {purchase.purchaseNo}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/purchases/${id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Edit3 size={14} className="mr-1.5" />
                            <span>Edit Purchase</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Step 1: Core Details */}
            <PurchaseDetailsCard purchase={purchase} />

            {/* Step 2: Line Items */}
            <PurchaseItemsView items={purchase.lineItems} />

            {/* Step 3: Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 text-white border-0 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base text-white">Ledger & Inventory Status</h2>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                This procurement entry is recorded in the general ledger and added to inventory balances. 
                                Eligible Input Tax Credit (ITC) of {formatCurrency(taxTotal)} has been booked to the GST input account.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2 text-xs">
                            <span className="px-2.5 py-1 rounded bg-white/10 text-slate-300 font-medium">Audit Verified</span>
                            <span className="px-2.5 py-1 rounded bg-white/10 text-slate-300 font-medium">Inventory Synced</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                            Purchase Cost Summary
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="text-xs">Subtotal (Taxable Value)</span>
                                <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="text-xs">Total Tax (GST Input)</span>
                                <span className="font-medium text-emerald-600 tabular-nums">+{formatCurrency(taxTotal)}</span>
                            </div>

                            {Math.abs(roundOff) > 0.01 && (
                                <div className="flex justify-between items-center text-slate-600">
                                    <span className="text-xs">Round Off</span>
                                    <span className="font-medium text-slate-500 tabular-nums">{roundOff > 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-slate-200 mt-2 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Purchase Amount</p>
                                    <p className="text-[11px] text-slate-400">Net payable to supplier</p>
                                </div>
                                <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                                    {formatCurrency(grandTotal)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

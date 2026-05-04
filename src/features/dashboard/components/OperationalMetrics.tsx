import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/ui/core/Card";
import { CheckCircle2, Clock } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";

export async function OperationalMetrics() {
    const [invoiceCount, pendingInvoices, statusCounts, ledgerAgg, expenseAgg] = await Promise.all([
        db.invoice.count({ where: { deletedAt: null } }),
        db.invoice.findMany({
            where: { deletedAt: null, status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIAL] } },
            orderBy: { grandTotal: "desc" },
            take: 5,
            select: {
                id: true,
                invoiceNo: true,
                grandTotal: true,
                status: true,
                client: { select: { name: true } }
            },
        }),
        db.invoice.groupBy({
            by: ["status"],
            where: { deletedAt: null },
            _count: { status: true },
        }),
        // 4. Ledger Net Balance (Credit - Debit to Client Accounts)
        (async () => {
            const [credits, debits] = await Promise.all([
                (db as any).ledgerEntry.aggregate({
                    where: { creditAccount: { type: 'CLIENT' } },
                    _sum: { amount: true }
                }),
                (db as any).ledgerEntry.aggregate({
                    where: { debitAccount: { type: 'CLIENT' } },
                    _sum: { amount: true }
                })
            ]);
            return { credits: Number(credits._sum.amount || 0), debits: Number(debits._sum.amount || 0) };
        })(),

        // 5. Monthly Expenses (Safe Check for stale Prisma Client)
        (db as any).expense ? (db as any).expense.aggregate({
            where: {
                date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                }
            },
            _sum: { amount: true },
        }) : Promise.resolve({ _sum: { amount: 0 } }),
    ]);


    const statusMap: Record<string, number> = {};
    statusCounts.forEach((s) => { statusMap[s.status] = s._count.status; });

    const netBalance = ledgerAgg.credits - ledgerAgg.debits;


    const totalExpenses = expenseAgg._sum.amount?.toNumber() || 0;

    return (
        <div className="space-y-8">
            {/* Status Architecture */}
            <Card className="border-0 shadow-2xl shadow-primary-900/5 overflow-hidden">
                <CardHeader className="bg-slate-900 rounded-t-4xl px-8 py-5">
                    <h3 className="text-lg font-black text-white font-display uppercase italic tracking-tight">Status Metrics</h3>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-5">
                        <StatusRow label="DRAFT" count={statusMap["DRAFT"] || 0} color="#94A3B8" total={invoiceCount} />
                        <StatusRow label="SENT" count={statusMap["SENT"] || 0} color="#6366F1" total={invoiceCount} />
                        <StatusRow label="PAID" count={statusMap["PAID"] || 0} color="#10B981" total={invoiceCount} />
                        <StatusRow label="OVERDUE" count={statusMap["OVERDUE"] || 0} color="#EF4444" total={invoiceCount} />
                        <StatusRow label="PARTIAL" count={statusMap["PARTIAL"] || 0} color="#F59E0B" total={invoiceCount} />
                    </div>
                </CardContent>
            </Card>

            {/* Financial Snapshot */}
            <Card className="border-0 shadow-2xl shadow-primary-900/5 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tight">Ledger Insights</h3>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        {/* Net Account Balance */}
                        <div className="p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Client Ledger</p>
                            <h4 className="text-xl font-black font-display tracking-tight">
                                {formatCurrency(Math.abs(netBalance))}
                            </h4>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {netBalance >= 0 ? 'Net Advance Pool' : 'Net Outstanding Debt'}
                            </p>
                        </div>

                        {/* Monthly Expenses */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Expenses</p>
                                <h4 className="text-lg font-black text-slate-800">
                                    {formatCurrency(totalExpenses)}
                                </h4>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black border border-red-100">
                                OUTFLOW
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Priority */}
            <Card className="border-0 shadow-2xl shadow-primary-900/5 overflow-hidden">
                <CardHeader className="bg-primary-600 rounded-t-4xl px-8 py-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white font-display uppercase italic tracking-tight">Priority Debt</h3>
                        <Clock className="w-5 h-5 text-white/50 animate-pulse" />
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-4">
                        {pendingInvoices.length === 0 ? (
                            <div className="text-center py-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">All Cleared</p>
                            </div>
                        ) : (
                            pendingInvoices.map((inv: any) => (
                                <Link key={inv.id} href={`/invoices/${inv.id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-black text-slate-700 truncate uppercase tracking-tight">{inv.client.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{inv.invoiceNo}</p>
                                        </div>
                                        <p className="text-xs font-black text-red-600 ml-4 shrink-0">{formatCurrency(inv.grandTotal.toNumber())}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusRow({ label, count, color, total }: { label: string; count: number; color: string; total: number; }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{count} <span className="text-slate-300 font-bold ml-1 text-[10px]">({Math.round(pct)}%)</span></span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-px">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
                />
            </div>
        </div>
    );
}

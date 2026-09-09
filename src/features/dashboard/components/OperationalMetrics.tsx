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
        // Ledger Net Balance
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

        // Monthly Expenses
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
        <div className="space-y-6">
            {/* Status Breakdown */}
            <Card>
                <CardHeader className="border-b border-slate-100 py-4 px-6">
                    <h3 className="text-sm font-semibold text-slate-900">Invoice Status Breakdown</h3>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <StatusRow label="Draft" count={statusMap["DRAFT"] || 0} total={invoiceCount} />
                        <StatusRow label="Sent" count={statusMap["SENT"] || 0} total={invoiceCount} />
                        <StatusRow label="Paid" count={statusMap["PAID"] || 0} total={invoiceCount} />
                        <StatusRow label="Overdue" count={statusMap["OVERDUE"] || 0} total={invoiceCount} />
                        <StatusRow label="Partial" count={statusMap["PARTIAL"] || 0} total={invoiceCount} />
                    </div>
                </CardContent>
            </Card>

            {/* Financial Snapshot */}
            <Card>
                <CardHeader className="border-b border-slate-100 py-4 px-6">
                    <h3 className="text-sm font-semibold text-slate-900">Ledger Summary</h3>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                            <p className="text-xs font-medium text-slate-500 mb-1">Net Client Ledger</p>
                            <h4 className="text-xl font-bold text-slate-900">
                                {formatCurrency(Math.abs(netBalance))}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                                {netBalance >= 0 ? 'Net Advance Pool' : 'Net Outstanding Balance'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-xs text-slate-500">Monthly Expenses</p>
                                <h4 className="text-base font-semibold text-slate-900">
                                    {formatCurrency(totalExpenses)}
                                </h4>
                            </div>
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                Current Month
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Invoices */}
            <Card>
                <CardHeader className="border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Pending Invoices</h3>
                    <Clock className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-2">
                        {pendingInvoices.length === 0 ? (
                            <div className="text-center py-6">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-xs font-medium text-slate-600">All Cleared</p>
                            </div>
                        ) : (
                            pendingInvoices.map((inv: any) => (
                                <Link key={inv.id} href={`/invoices/${inv.id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-900 truncate">{inv.client.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{inv.invoiceNo}</p>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-900 ml-4 shrink-0">{formatCurrency(inv.grandTotal.toNumber())}</p>
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

function StatusRow({ label, count, total }: { label: string; count: number; total: number; }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-slate-900 font-semibold">{count} <span className="text-slate-400 font-normal">({Math.round(pct)}%)</span></span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

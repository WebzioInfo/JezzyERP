import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import Link from "next/link";
import { FileText, ArrowRight, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { Card, CardHeader, CardContent } from "@/ui/core/Card";
import { calculateInvoiceStatus } from "@/utils/financial-status";

export async function RecentInvoices() {
    const rawInvoices = await (db.invoice as any).findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
            client: { select: { name: true } },
            allocations: { select: { amount: true } }
        },
    });

    const recentInvoices = rawInvoices.map((inv: any) => ({
        ...inv,
        status: calculateInvoiceStatus({
            grandTotal: inv.grandTotal,
            isFinalized: inv.isFinalized,
            allocations: inv.allocations
        })
    }));

    return (
        <Card>
            <CardHeader className="border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">Recent Invoices</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Last 8 generated invoices</p>
                </div>
                <Link href="/invoices" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-1">
                    {recentInvoices.length === 0 ? (
                        <EmptyState
                            icon={<FileText className="w-8 h-8 text-slate-300" />}
                            title="No activity detected"
                            description="Start by creating an invoice to populate your list."
                            action={{ label: "Create Invoice", href: "/invoices/new" }}
                        />
                    ) : (
                        recentInvoices.map((inv: any) => (
                            <Link key={inv.id} href={`/invoices/${inv.id}`}>
                                <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-slate-900 truncate">{inv.invoiceNo}</p>
                                            <p className="text-xs text-slate-500 truncate">{inv.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="hidden sm:block">
                                            <StatusBadge status={inv.status} />
                                        </div>
                                        <p className="font-semibold text-sm text-slate-900">{formatCurrency(inv.grandTotal.toNumber())}</p>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ icon, title, description, action }: {
    icon: React.ReactNode; title: string; description: string; action?: { label: string; href: string };
}) {
    return (
        <div className="text-center py-8">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="font-medium text-slate-700 text-sm">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">{description}</p>
            {action && (
                <Link href={action.href}>
                    <button className="h-8 px-3 rounded-md bg-slate-900 text-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-slate-800 transition-colors">
                        {action.label} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Link>
            )}
        </div>
    );
}

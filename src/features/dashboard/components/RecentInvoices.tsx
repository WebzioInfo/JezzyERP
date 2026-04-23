import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import Link from "next/link";
import { FileText, ArrowRight, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";

export async function RecentInvoices() {
    const recentInvoices = await db.invoice.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
            id: true,
            invoiceNo: true,
            date: true,
            grandTotal: true,
            status: true,
            client: { select: { name: true } }
        },
    });

    return (
        <div className="glass clay-card p-8 border-0 shadow-2xl shadow-primary-900/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 font-display uppercase italic tracking-tight">Recent Archives</h3>
                    <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Last 8 synchronization events</p>
                </div>
                <Link href="/invoices" className="p-3 rounded-xl bg-slate-50 text-primary-600 hover:bg-primary-50 transition-all border border-slate-100">
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            
            <div className="space-y-3">
                {recentInvoices.length === 0 ? (
                    <EmptyState
                        icon={<FileText className="w-10 h-10 text-slate-200" />}
                        title="No activity detected"
                        description="Start by creating an invoice to populate your archives."
                        action={{ label: "Create Invoice", href: "/invoices/new" }}
                    />
                ) : (
                    recentInvoices.map((inv: any) => (
                        <Link key={inv.id} href={`/invoices/${inv.id}`}>
                            <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-primary-900/5 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-sm text-slate-900 uppercase tracking-tight truncate">{inv.invoiceNo}</p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">{inv.client.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 shrink-0">
                                    <div className="hidden sm:block">
                                        <StatusBadge status={inv.status} />
                                    </div>
                                    <p className="font-black text-sm text-slate-900">{formatCurrency(inv.grandTotal.toNumber())}</p>
                                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

function EmptyState({ icon, title, description, action }: {
    icon: React.ReactNode; title: string; description: string; action?: { label: string; href: string };
}) {
    return (
        <div className="text-center py-10">
            <div className="flex justify-center mb-3">{icon}</div>
            <p className="font-semibold text-slate-600 text-sm">{title}</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">{description}</p>
            {action && (
                <Link href={action.href}>
                    <button className="h-10 px-6 rounded-xl bg-primary-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:bg-primary-700 transition-colors">
                        {action.label} <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            )}
        </div>
    );
}

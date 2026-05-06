import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/index";
import { formatCurrency } from "@/utils/financials";
import {
  FileText, Plus, Search, Filter,
  ChevronRight, Calendar, ArrowUpRight,
} from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { InvoiceListActions } from "@/features/billing/components/InvoiceListActions";
import { InvoicesHeaderActions } from "@/features/billing/components/InvoicesHeaderActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LiveSearch } from "@/components/common/LiveSearch";

interface PageProps {

  searchParams: Promise<{ status?: string; q?: string }>;
}

const STATUS_TABS = [
  { label: "All Records", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Trash", value: "TRASH" },
];

export default async function InvoicesPage({ searchParams }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status || "";
  const searchQuery = params.q || "";

  const [invoices, counts, trashCount] = await Promise.all([
    db.invoice.findMany({
      where: {
        ...(statusFilter === "TRASH" ? { deletedAt: { not: null } } : { deletedAt: null }),
        ...(statusFilter && statusFilter !== "TRASH" && { status: statusFilter as any }),
        ...(searchQuery && {
          OR: [
            { invoiceNo: { contains: searchQuery } },
            { client: { name: { contains: searchQuery } } },
          ],
        }),
      },
      orderBy: { invoiceNo: "desc" },
      select: {
        id: true,
        invoiceNo: true,
        date: true,
        grandTotal: true,
        status: true,
        client: { select: { id: true, name: true } }
      },
      take: 100,
    }),
    db.invoice.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true },
    }),
    db.invoice.count({
      where: { deletedAt: { not: null } }
    })
  ]);
  
  const countMap: Record<string, number> = {};
  counts.forEach((c) => { countMap[c.status] = c._count.status; });
  const total = counts.reduce((a, c) => a + c._count.status, 0);
  countMap[""] = total;
  countMap["TRASH"] = trashCount;



  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in stagger-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Invoices</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Manage and track your primary revenue stream</p>
        </div>
        <InvoicesHeaderActions />
      </div>
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/60 overflow-hidden rounded-[2.5rem] animate-in stagger-2">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
             <LiveSearch 
               placeholder="Search by Invoice # or Client Name..." 
               className="flex-1 w-full"
             />

             <div className="flex flex-wrap items-center gap-2">
                {STATUS_TABS.map((tab) => {
                  const isActive = statusFilter === tab.value;
                  const count = countMap[tab.value] || 0;
                  return (
                    <Link
                      key={tab.value}
                      href={`/invoices?${tab.value ? `status=${tab.value}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2",
                        isActive 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                          : "text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                      )}
                    >
                      {tab.label}
                      <span className={cn(
                        "min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[9px] font-bold",
                        isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        {count}
                      </span>
                    </Link>
                  );
                })}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* ── List Content ── */}
      <ErrorBoundary name="Invoice Table">
        <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem] animate-in stagger-3">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-slate-50/30">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6">
               <FileText className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-black text-slate-900 text-xl italic uppercase tracking-tight">Zero Records Found</p>
            <p className="text-xs text-slate-500 mt-2 mb-10 font-bold uppercase tracking-widest italic opacity-60">
              {searchQuery || statusFilter ? "Adjustment of search filters required" : "Begin by generating your first document"}
            </p>
            <Link href="/invoices/new">
               <Button variant="primary" size="lg" className="italic px-8">
                  <Plus className="w-5 h-5 mr-1" />
                  Initiate First Invoice
               </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900">
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity Details</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:table-cell">Timeline</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valuation</th>
                  <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Policy</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <FileText size={18} className="text-slate-400 group-hover:text-primary-600" />
                         </div>
                         <p className="font-extrabold text-slate-900 text-base tracking-tight">{inv.invoiceNo}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Link 
                        href={`/clients/${inv.client.id}`}
                        className="group/client inline-flex flex-col hover:text-primary-600 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-slate-800 tracking-tight group-hover/client:text-primary-600 transition-colors">{inv.client.name}</p>
                          <ArrowUpRight size={12} className="opacity-0 group-hover/client:opacity-100 transition-all text-primary-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Corporate Client</p>
                      </Link>
                    </td>
                    <td className="px-8 py-6 hidden sm:table-cell">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                           <Calendar className="w-3.5 h-3.5 text-primary-500" />
                           {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(inv.date))}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Registration Date</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-lg font-black text-slate-900 italic tracking-tighter">{formatCurrency(inv.grandTotal.toNumber())}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inclusive of GST</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center scale-110">
                        <StatusBadge status={inv.status} />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <InvoiceListActions 
                        invoiceId={inv.id} 
                        isTrashed={statusFilter === "TRASH"} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </Card>
      </ErrorBoundary>
    </div>
  );
}

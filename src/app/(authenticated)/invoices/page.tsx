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
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LiveSearch } from "@/components/common/LiveSearch";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

const STATUS_TABS = [
  { label: "All", value: "" },
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
        sequenceNumber: true,
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
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your invoices</p>
        </div>
        <InvoicesHeaderActions />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
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
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-all inline-flex items-center gap-2 border",
                        isActive 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {tab.label}
                      <span className={cn(
                        "min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center text-xs",
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
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
        <Card className="overflow-hidden">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
               <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="font-medium text-slate-900 text-base">No invoices found</p>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              {searchQuery || statusFilter ? "Adjust your search filters to find what you're looking for." : "Create your first invoice to get started."}
            </p>
            <Link href="/invoices/new">
               <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
               </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Invoice #</th>
                  <th className="text-left px-4 py-3 font-medium">Client</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {String(inv.sequenceNumber || 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/clients/${inv.client.id}`}
                        className="font-medium text-slate-900 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                      >
                        {inv.client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                       <span className="text-slate-500">
                         {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(inv.date))}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {formatCurrency(inv.grandTotal.toNumber())}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
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

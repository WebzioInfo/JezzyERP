import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/index";
import { formatCurrency } from "@/utils/financials";
import { FileText, Plus } from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { InvoiceListActions } from "@/features/billing/components/InvoiceListActions";
import { InvoicesHeaderActions } from "@/features/billing/components/InvoicesHeaderActions";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";
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
    <div className="space-y-5 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage tax invoices, delivery statuses, and collections</p>
        </div>
        <InvoicesHeaderActions />
      </div>

      <Card>
        <CardContent className="p-3.5">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
             <LiveSearch 
               placeholder="Search by invoice number or client name..." 
               className="flex-1 w-full"
             />

             <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
                {STATUS_TABS.map((tab) => {
                  const isActive = statusFilter === tab.value;
                  const count = countMap[tab.value] || 0;
                  return (
                    <Link
                      key={tab.value}
                      href={`/invoices?${tab.value ? `status=${tab.value}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 border",
                        isActive 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span className={cn(
                        "min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-semibold",
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
          <div className="flex flex-col items-center justify-center py-16 text-center p-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
               <FileText className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-900 text-sm">No invoices found</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm">
              {searchQuery || statusFilter ? "Adjust your search filters or status tab to find matching records." : "Create your first invoice to start billing."}
            </p>
            <Link href="/invoices/new">
               <Button variant="primary" size="md">
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Invoice
               </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Seq #</TableHead>
                <TableHead className="w-36">Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv.id} className="group">
                  <TableCell className="font-mono text-slate-500 text-xs">
                    {String(inv.sequenceNumber || 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    <Link 
                      href={`/invoices/${inv.id}`}
                      className="hover:underline hover:text-slate-700"
                    >
                      {inv.invoiceNo}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/clients/${inv.client.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {inv.client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-slate-500 text-xs">
                    {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(inv.date))}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(inv.grandTotal.toNumber())}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceListActions 
                      invoiceId={inv.id} 
                      isTrashed={statusFilter === "TRASH"} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        </Card>
      </ErrorBoundary>
    </div>
  );
}

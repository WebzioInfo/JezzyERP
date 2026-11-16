import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/index";
import { InvoicesHeaderActions } from "@/features/billing/components/InvoicesHeaderActions";
import { InvoiceTable } from "@/features/billing/components/InvoiceTable";
import { Card, CardContent } from "@/ui/core/Card";
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
        ewayBill: true,
        ewayBillUrl: true,
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

  // Serialize Prisma Decimal and Date objects for React Client Component boundary
  const serializedInvoices = invoices.map((inv) => ({
    id: inv.id,
    sequenceNumber: inv.sequenceNumber,
    invoiceNo: inv.invoiceNo,
    date: inv.date.toISOString(),
    grandTotal: inv.grandTotal.toNumber(),
    status: inv.status,
    ewayBill: inv.ewayBill,
    ewayBillUrl: inv.ewayBillUrl,
    client: {
      id: inv.client.id,
      name: inv.client.name,
    },
  }));

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

      {/* ── Invoices List / Table with Bulk Actions ── */}
      <ErrorBoundary name="Invoice Table">
        <Card className="overflow-hidden">
          <InvoiceTable
            invoices={serializedInvoices}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          />
        </Card>
      </ErrorBoundary>
    </div>
  );
}

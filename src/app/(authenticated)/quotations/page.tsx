import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ClipboardList } from "lucide-react";
import { verifySessionCookie } from "@/lib/auth";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";
import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { QuotationListActions } from "@/features/billing/components/QuotationListActions";
import { LiveSearch } from "@/components/common/LiveSearch";
import { cn } from "@/utils";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

const QUO_STATUS_TABS = [
  { label: "All Proposals", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Invoiced", value: "CONVERTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Trash", value: "TRASH" },
];

export default async function QuotationsPage({ searchParams }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status || "";
  const searchQuery = params.q || "";

  const [quotations, counts, trashCount] = await Promise.all([
    db.quotation.findMany({
      where: {
        ...(statusFilter === "TRASH" ? { deletedAt: { not: null } } : { deletedAt: null }),
        ...(statusFilter && statusFilter !== "TRASH" && { status: statusFilter as any }),
        ...(searchQuery && {
          OR: [
            { quotationNo: { contains: searchQuery } },
            { client: { name: { contains: searchQuery } } },
          ],
        }),
      },
      orderBy: { quotationNo: "desc" },
      include: { client: { select: { id: true, name: true } } },
    }),
    db.quotation.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true },
    }),
    db.quotation.count({
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
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Quotations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Commercial estimates, proposals, and customer approvals</p>
        </div>

        <Link href="/quotations/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            New Quotation
          </Button>
        </Link>
      </div>

      {/* ── Filters & Search ── */}
      <Card>
        <CardContent className="p-3.5">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            <LiveSearch
              placeholder="Search by quotation number or client..."
              className="flex-1 w-full"
            />

            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
              {QUO_STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.value;
                const count = countMap[tab.value] || 0;
                return (
                  <Link
                    key={tab.value}
                    href={`/quotations?${tab.value ? `status=${tab.value}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
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

      {/* ── Quotations Table ── */}
      <ErrorBoundary name="Quotations Table">
        <Card className="overflow-hidden">
          {quotations.length === 0 ? (
            <div className="text-center py-16 p-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-slate-900 font-semibold text-sm">No quotations found</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm mx-auto">
                {searchQuery || statusFilter ? "Adjust your search filters or status selection." : "Create your first commercial quotation to send to a client."}
              </p>
              <Link href="/quotations/new">
                <Button variant="primary" size="md">
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Quotation
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Estimate Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quo: any) => (
                  <TableRow key={quo.id} className="group">
                    <TableCell className="font-medium text-slate-900">
                      <Link 
                        href={`/quotations/${quo.id}`}
                        className="hover:underline hover:text-slate-700"
                      >
                        {quo.quotationNo}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/clients/${quo.client.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {quo.client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-500 text-xs">
                      {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(quo.date))}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(quo.grandTotal.toNumber())}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={quo.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <QuotationListActions
                        quotationId={quo.id}
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

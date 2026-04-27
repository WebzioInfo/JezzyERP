import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ClipboardList, Search, Filter, ChevronRight, ArrowUpRight } from "lucide-react";
import { verifySessionCookie } from "@/lib/auth";
import { Card, CardHeader, CardContent } from "@/ui/core/Card";
import { db } from "@/db/prisma/client";
import { formatCurrency } from "@/utils/financials";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { QuotationListActions } from "@/features/billing/components/QuotationListActions";
import { LiveSearch } from "@/components/common/LiveSearch";

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
        ...(statusFilter && statusFilter !== "TRASH" && { status: statusFilter }),
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
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase">
            Proposal <span className="text-primary-600">Pipeline</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
            Manage your project estimates, client proposals, and commercial contracts.
          </p>
        </div>

        <Link href="/quotations/new">
          <button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            <span>New Proposal</span>
          </button>
        </Link>
      </div>

      {/* ── Filters & Search ── */}
      <Card className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-100 bg-white">
          <LiveSearch 
            placeholder="Search proposal directory..." 
            className="flex-1"
          />
          <div className="flex items-center gap-2 px-6 bg-slate-50 rounded-xl border border-slate-100 h-14 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Filter className="w-4 h-4" />
            <span>{quotations.length} RECORDS</span>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 md:ms-4 p-2 bg-slate-50/30">
          {QUO_STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            const count = countMap[tab.value] || 0;
            return (
              <Link
                key={tab.value}
                href={`/quotations?${tab.value ? `status=${tab.value}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive
                  ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                  : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md"
                  }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* ── Quotations Table ── */}
      <Card className="border-0 shadow-2xl shadow-primary-900/5 overflow-hidden">
        <CardHeader className="bg-slate-900 rounded-t-4xl px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <ClipboardList className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-display uppercase italic tracking-tight">Project Registry</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest italic">Live proposal status & commercial tracking</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {quotations.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200 shadow-inner">
                <ClipboardList className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-800 font-black text-2xl font-display uppercase italic tracking-tighter">Registry is Empty</h3>
              <p className="text-sm font-bold text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">
                Start by creating a professional proposal for your project.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Proposal Identity</th>
                    <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Recipient Node</th>
                    <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400 hidden sm:table-cell">Emission Date</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Proposal Value</th>
                    <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">State</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-400">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotations.map((quo: any) => (
                    <tr key={quo.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight uppercase">{quo.quotationNo}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Link 
                          href={`/clients/${quo.client.id}`}
                          className="group/client inline-flex flex-col hover:text-primary-600 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-700 uppercase tracking-tight text-sm group-hover/client:text-primary-600 transition-colors">{quo.client.name}</p>
                            <ArrowUpRight size={12} className="opacity-0 group-hover/client:opacity-100 transition-all text-primary-500" />
                          </div>
                        </Link>
                      </td>
                      <td className="px-8 py-6 hidden sm:table-cell">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(quo.date))}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="font-black text-slate-900 text-lg tracking-tighter italic">{formatCurrency(quo.grandTotal.toNumber())}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <StatusBadge status={quo.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <QuotationListActions
                          quotationId={quo.id}
                          isTrashed={statusFilter === "TRASH"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

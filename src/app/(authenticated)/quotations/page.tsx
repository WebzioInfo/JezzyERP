import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import {
  ClipboardList, Plus, Search, Filter,
  ChevronRight, Calendar, ArrowUpRight,
  Clock, CheckCircle2, XCircle, FilePlus,
} from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

const QUO_STATUS_TABS = [
  { label: "All Proposals", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Invoiced", value: "CONVERTED" },
  { label: "Rejected", value: "REJECTED" },
];


export default async function QuotationsPage({ searchParams }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status || "";
  const searchQuery = params.q || "";

  const quotations = await db.quotation.findMany({
    where: {
      deletedAt: null,
      ...(statusFilter && { status: statusFilter }),
      ...(searchQuery && {
        OR: [
          { quotationNo: { contains: searchQuery } },
          { client: { name: { contains: searchQuery } } },
        ],
      }),
    },
    orderBy: { date: "desc" },
    include: { client: { select: { name: true } } },
  });

  // Count by status for tabs
  const counts = await db.quotation.groupBy({
    by: ["status"],
    where: { deletedAt: null },
    _count: { status: true },
  });
  
  const countMap: Record<string, number> = { "": quotations.length };
  counts.forEach((c) => { countMap[c.status] = c._count.status; });
  countMap[""] = counts.reduce((a, c) => a + c._count.status, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ── */}
      <div className="page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Quotations & Proposals</h1>
          <p className="page-subtitle">Track your estimates and project proposals</p>
        </div>
        <Link href="/quotations/new">
          <button className="btn-accent h-11 px-6 gap-2 text-sm shadow-xl shadow-amber-500/10 active:scale-95 transition-transform group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            New Proposal
          </button>
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className="card p-0 overflow-hidden shadow-lg border-slate-100 ring-4 ring-slate-500/5">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-100 bg-white">
          <form className="flex-1 relative" method="GET" action="/quotations">
             {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input
                name="q"
                type="text"
                placeholder="Search by proposal number or client..."
                defaultValue={searchQuery}
                className="input-field pl-9 h-11 bg-slate-50/50"
             />
          </form>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 rounded-xl border border-slate-200 h-11 uppercase tracking-widest leading-none">
            <Filter className="w-3.5 h-3.5" />
            <span>{quotations.length} items</span>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 p-2 bg-slate-50/50">
          {QUO_STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            const count = countMap[tab.value] || 0;
            return (
              <Link
                key={tab.value}
                href={`/quotations?${tab.value ? `status=${tab.value}` : ""}${searchQuery ? `&q=${searchQuery}` : ""}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                }`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Quotations Table ── */}
      <div className="card p-0 overflow-hidden shadow-2xl border-slate-100">
        {quotations.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/30">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner rotate-3">
              <ClipboardList className="w-8 h-8 text-amber-500" />
            </div>
            <p className="font-bold text-slate-700 text-xl font-display">No proposals match your criteria</p>
            <p className="text-sm text-slate-400 mt-2 mb-8 max-w-xs mx-auto">
              Create a professional proposal for your clients and convert them to invoices with one click.
            </p>
            <Link href="/quotations/new">
              <button className="btn-accent h-10 px-6 font-bold gap-2">
                <FilePlus className="w-4 h-4" /> Start First Proposal
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proposal #</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recipient</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:table-cell">Date</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">Validity</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proposal Total</th>
                  <th className="text-center px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {quotations.map((quo: any) => (
                  <tr key={quo.id} className="hover:bg-amber-50/40 transition-colors group cursor-pointer relative">
                    <td className="px-6 py-5">
                      <p className="font-black text-slate-900 group-hover:text-amber-700 transition-colors tracking-tight uppercase">{quo.quotationNo}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-700">{quo.client.name}</p>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(quo.date))}
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell text-slate-500 font-medium">
                      {quo.validUntil
                        ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(quo.validUntil))
                        : <span className="text-slate-300 italic">Open-ended</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="font-black text-slate-900 text-base">{formatCurrency(quo.grandTotal.toNumber())}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge status={quo.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/quotations/${quo.id}`}>
                        <button className="btn-ghost h-9 px-4 text-xs font-bold gap-2 text-primary-600 hover:text-primary-800 hover:bg-white shadow-sm ring-1 ring-slate-200">
                          View Proposal <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

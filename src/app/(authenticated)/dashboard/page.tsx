import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils";
import Link from "next/link";
import {
  FileText,
  Users,
  Package,
  IndianRupee,
  FilePlus,
  ClipboardList,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default async function DashboardPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  // ── Parallel data fetching ──
  const [
    invoiceCount,
    clientCount,
    productCount,
    revenueAgg,
    overdueAgg,
    pendingInvoices,
    recentInvoices,
    monthlyRevenue,
    statusCounts,
  ] = await Promise.all([
    db.invoice.count({ where: { deletedAt: null } }),
    db.client.count({ where: { deletedAt: null } }),
    db.product.count({ where: { deletedAt: null } }),
    // Total revenue from paid invoices
    db.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["PAID", "PARTIAL"] } },
      _sum: { grandTotal: true },
    }),
    // Total outstanding (unpaid)
    db.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["SENT", "OVERDUE", "DRAFT"] } },
      _sum: { grandTotal: true },
    }),
    // Top 5 unpaid invoices for receivables panel
    db.invoice.findMany({
      where: { deletedAt: null, status: { in: ["SENT", "OVERDUE", "PARTIAL"] } },
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
    // Recent 8 invoices
    db.invoice.findMany({
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
    }),
    // This month's revenue
    db.invoice.aggregate({
      where: {
        deletedAt: null,
        status: { in: ["PAID", "PARTIAL"] },
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { grandTotal: true },
    }),
    // Status distribution
    db.invoice.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { status: true },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.grandTotal?.toNumber() || 0;
  const totalOutstanding = overdueAgg._sum.grandTotal?.toNumber() || 0;
  const thisMonthRevenue = monthlyRevenue._sum.grandTotal?.toNumber() || 0;

  const statusMap: Record<string, number> = {};
  statusCounts.forEach((s) => { statusMap[s.status] = s._count.status; });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* ── Welcome Banner ── */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden animate-in stagger-1"
        style={{ background: "linear-gradient(135deg, #0F2240 0%, #1B3A6B 60%, #C8991A 200%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #C8991A 0%, transparent 60%)" }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Good Morning, JEZZY Team</h2>
            <p className="text-slate-300 text-sm mt-1">
              Here's what's happening with your business today — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href="/invoices/new">
            <button className="btn-accent h-10 px-5 whitespace-nowrap gap-2 text-sm">
              <FilePlus className="w-4 h-4" />
              New Invoice
            </button>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <ErrorBoundary name="KPI Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in stagger-2">
          <KpiCard
            label="Total Revenue Collected"
            value={formatCurrency(totalRevenue)}
            icon={<IndianRupee className="w-5 h-5" />}
            color="navy"
            sub="From all paid invoices"
          />
          <KpiCard
            label="This Month"
            value={formatCurrency(thisMonthRevenue)}
            icon={<TrendingUp className="w-5 h-5" />}
            color="gold"
            sub="Revenue in current month"
          />
          <KpiCard
            label="Outstanding Amount"
            value={formatCurrency(totalOutstanding)}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="warning"
            sub="Unpaid & overdue invoices"
          />
          <KpiCard
            label="Active Clients"
            value={clientCount.toString()}
            icon={<Users className="w-5 h-5" />}
            color="success"
            sub={`${productCount} products in catalog`}
          />
        </div>
      </ErrorBoundary>

      {/* ── Quick Actions ── */}
      <div className="animate-in stagger-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction href="/invoices/new" icon={<FilePlus className="w-5 h-5" />} label="New Invoice" color="#1B3A6B" />
          <QuickAction href="/quotations/new" icon={<ClipboardList className="w-5 h-5" />} label="New Quotation" color="#C8991A" />
          <QuickAction href="/clients" icon={<Users className="w-5 h-5" />} label="Add Client" color="#16A34A" />
          <QuickAction href="/payments" icon={<CreditCard className="w-5 h-5" />} label="Record Payment" color="#2563EB" />
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in stagger-4">

        {/* ─ Recent Invoices (2/3 width) ─ */}
        <div className="lg:col-span-2">
          <ErrorBoundary name="Recent Invoices">
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900">Recent Invoices</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Latest billing activity</p>
                </div>
                <Link href="/invoices" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {recentInvoices.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="w-10 h-10 text-slate-200" />}
                    title="No invoices yet"
                    description="Create your first invoice to get started"
                    action={{ label: "Create Invoice", href: "/invoices/new" }}
                  />
                ) : (
                  recentInvoices.map((inv: any) => (
                    <Link key={inv.id} href={`/invoices/${inv.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 truncate">{inv.invoiceNo}</p>
                            <p className="text-xs text-slate-400 truncate">{inv.client.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <StatusBadge status={inv.status} />
                          <p className="font-bold text-sm text-slate-900">{formatCurrency(inv.grandTotal.toNumber())}</p>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </ErrorBoundary>
        </div>

        {/* ─ Receivables & Status (1/3 width) ─ */}
        <div className="space-y-4">
          {/* Invoice Status Summary */}
          <div className="card">
            <h3 className="font-bold text-slate-900 mb-4">Invoice Status</h3>
            <div className="space-y-3">
              <StatusRow label="Draft" count={statusMap["DRAFT"] || 0} color="bg-slate-400" total={invoiceCount} />
              <StatusRow label="Sent" count={statusMap["SENT"] || 0} color="bg-info-500" total={invoiceCount} />
              <StatusRow label="Paid" count={statusMap["PAID"] || 0} color="bg-success-500" total={invoiceCount} />
              <StatusRow label="Overdue" count={statusMap["OVERDUE"] || 0} color="bg-danger-500" total={invoiceCount} />
              <StatusRow label="Partial" count={statusMap["PARTIAL"] || 0} color="bg-warning-500" total={invoiceCount} />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Total Invoices</span>
              <span className="font-bold text-slate-900">{invoiceCount}</span>
            </div>
          </div>

          {/* Top Receivables */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Pending Payments</h3>
              <Clock className="w-4 h-4 text-warning-500" />
            </div>
            {pendingInvoices.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-success-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-success-700">All paid up!</p>
                <p className="text-xs text-slate-400">No outstanding invoices</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingInvoices.map((inv: any) => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`}>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{inv.client.name}</p>
                        <p className="text-xs text-slate-400">{inv.invoiceNo}</p>
                      </div>
                      <p className="text-xs font-bold text-danger-600 ml-2 shrink-0">{formatCurrency(inv.grandTotal.toNumber())}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper Components ──

function KpiCard({ label, value, icon, color, sub }: {
  label: string; value: string; icon: React.ReactNode; color: "navy" | "gold" | "warning" | "success"; sub: string;
}) {
  const colorMap = {
    navy: { bg: "#1B3A6B", light: "bg-blue-50", text: "text-blue-700" },
    gold: { bg: "#C8991A", light: "bg-amber-50", text: "text-amber-700" },
    warning: { bg: "#D97706", light: "bg-orange-50", text: "text-orange-700" },
    success: { bg: "#16A34A", light: "bg-green-50", text: "text-green-700" },
  };
  const c = colorMap[color];
  return (
    <div className={`clay-card p-6 border-0 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 leading-tight whitespace-nowrap">{label}</p>
        <div
          className="w-10 h-10 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg shadow-black/10 transition-transform group-hover:scale-110"
          style={{ backgroundColor: c.bg }}
        >
          <span className="text-white">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900 leading-none mb-2 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
    </div>
  );
}

function QuickAction({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string; }) {
  return (
    <Link href={href}>
      <div className="clay-card p-5 group text-center hover:scale-[1.05] active:scale-[0.95] border-0">
        <div
          className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4 text-white shadow-lg transition-transform group-hover:scale-110"
          style={{ backgroundColor: color, boxShadow: `0 8px 16px -4px ${color}40` }}
        >
          {icon}
        </div>
        <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</p>
      </div>
    </Link>
  );
}

function StatusRow({ label, count, color, total }: { label: string; count: number; color: string; total: number; }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-slate-600">{label}</span>
          <span className="font-bold text-slate-900">{count}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
        </div>
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
          <button className="btn-primary h-8 px-4 text-xs gap-1.5">
            {action.label} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}
    </div>
  );
}

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
    db.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["PAID", "PARTIAL"] } },
      _sum: { grandTotal: true },
    }),
    db.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["SENT", "OVERDUE", "DRAFT"] } },
      _sum: { grandTotal: true },
    }),
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
    <div className="space-y-10 pb-10">
      {/* ── Mission Control Header ── */}
      <div className="relative overflow-hidden glass clay-card p-8 sm:p-10 border-0 shadow-2xl shadow-primary-900/5 animate-in">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-accent-400 to-primary-800 opacity-60" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-accent-500/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Status: Optimal</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jezzy-Core v4.2 Pro</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 font-display tracking-tighter uppercase italic">
              Command <span className="text-primary-600">Center</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">
              Welcome back to your operational overview. System intelligence identifies <span className="text-primary-600 font-bold">{pendingInvoices.length} critical receivables</span> requiring attention today.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/invoices/new" className="group/btn">
              <button className="h-14 px-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-950 text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-600/30">
                <FilePlus className="w-5 h-5" />
                <span>Initialize Billing</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── High-Impact KPIs ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in stagger-1">
        <KpiCard
          label="Cumulative Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="primary"
          subtitle="All-time verified payments"
        />
        <KpiCard
          label="MOM Performance"
          value={formatCurrency(thisMonthRevenue)}
          icon={<IndianRupee className="w-6 h-6" />}
          color="accent"
          subtitle="Current month trajectory"
        />
        <KpiCard
          label="Total Receivables"
          value={formatCurrency(totalOutstanding)}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="danger"
          subtitle="Action required on debt"
        />
        <KpiCard
          label="Active Partners"
          value={clientCount.toString()}
          icon={<Users className="w-6 h-6" />}
          color="emerald"
          subtitle={`${productCount} items in inventory`}
        />
      </div>

      {/* ── Operational Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in stagger-2">
        
        {/* Recent Activity (2/3) */}
        <div className="lg:col-span-2 space-y-6">
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
        </div>

        {/* Side Panel (1/3) */}
        <div className="space-y-8">
          {/* Status Architecture */}
          <div className="glass clay-card p-8 border-0 shadow-2xl shadow-primary-900/5">
            <h3 className="text-lg font-black text-slate-900 font-display uppercase italic mb-8 tracking-tight">Status Metrics</h3>
            <div className="space-y-5">
              <StatusRow label="DRAFT" count={statusMap["DRAFT"] || 0} color="#94A3B8" total={invoiceCount} />
              <StatusRow label="SENT" count={statusMap["SENT"] || 0} color="#6366F1" total={invoiceCount} />
              <StatusRow label="PAID" count={statusMap["PAID"] || 0} color="#10B981" total={invoiceCount} />
              <StatusRow label="OVERDUE" count={statusMap["OVERDUE"] || 0} color="#EF4444" total={invoiceCount} />
              <StatusRow label="PARTIAL" count={statusMap["PARTIAL"] || 0} color="#F59E0B" total={invoiceCount} />
            </div>
          </div>

          {/* Pending Priority */}
          <div className="glass clay-card p-8 border-0 shadow-2xl shadow-primary-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 blur-[40px] rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 font-display uppercase italic tracking-tight">Priority Debt</h3>
              <Clock className="w-5 h-5 text-accent-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              {pendingInvoices.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">All Cleared</p>
                </div>
              ) : (
                pendingInvoices.map((inv: any) => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-700 truncate uppercase tracking-tight">{inv.client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{inv.invoiceNo}</p>
                      </div>
                      <p className="text-xs font-black text-red-600 ml-4 shrink-0">{formatCurrency(inv.grandTotal.toNumber())}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Redesigned Helper Components ──

function KpiCard({ label, value, icon, color, subtitle }: {
  label: string; value: string; icon: React.ReactNode; color: "primary" | "accent" | "danger" | "emerald"; subtitle: string;
}) {
  const themes = {
    primary: { glow: "shadow-primary-600/20", iconBg: "bg-primary-600", accent: "primary-500" },
    accent: { glow: "shadow-accent-500/20", iconBg: "bg-accent-500", accent: "accent-500" },
    danger: { glow: "shadow-red-600/20", iconBg: "bg-red-600", accent: "red-500" },
    emerald: { glow: "shadow-emerald-600/20", iconBg: "bg-emerald-600", accent: "emerald-500" },
  };
  const theme = themes[color];

  return (
    <div className="glass clay-card p-8 border-0 group hover:scale-[1.03] active:scale-95 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] opacity-10 bg-${theme.accent}`} />
      
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center text-white shadow-xl ${theme.glow} group-hover:rotate-12 transition-all duration-500 border border-white/20`}>
          {icon}
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        </div>
      </div>
      
      <div className="space-y-2 pb-2">
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none font-display">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 bg-${theme.accent} absolute bottom-0 left-0`} />
    </div>
  );
}

function StatusRow({ label, count, color, total }: { label: string; count: number; color: string; total: number; }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xs font-black text-slate-900">{count} <span className="text-slate-300 font-bold ml-1 text-[10px]">({Math.round(pct)}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-[1px]">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} 
        />
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

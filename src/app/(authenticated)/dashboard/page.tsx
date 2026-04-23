import { Suspense } from "react";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FilePlus,
  ChevronRight,
} from "lucide-react";
import { KpiGroup } from "@/features/dashboard/components/KpiGroup";
import { RecentInvoices } from "@/features/dashboard/components/RecentInvoices";
import { OperationalMetrics } from "@/features/dashboard/components/OperationalMetrics";
import { Skeleton, KpiSkeleton } from "@/ui/core/Skeleton";

export default async function DashboardPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  return (
    <div className="space-y-10 pb-10">
      {/* ── Mission Control Header ── */}
      <div className="relative overflow-hidden glass clay-card p-8 sm:p-10 border-0 shadow-2xl shadow-primary-900/5 animate-in">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-primary-500 via-accent-400 to-primary-800 opacity-60" />
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
              Welcome back to your operational overview. System intelligence is analyzing your receivables and archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/invoices/new" className="group/btn">
              <button className="h-14 px-8 rounded-2xl bg-linear-to-br from-primary-600 to-primary-950 text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-600/30">
                <FilePlus className="w-5 h-5" />
                <span>Initialize Billing</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── High-Impact KPIs ── */}
      <Suspense fallback={<KpiSkeleton />}>
        <KpiGroup />
      </Suspense>

      {/* ── Operational Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity (2/3) */}
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[600px] rounded-[2.5rem] bg-slate-100" />}>
            <RecentInvoices />
          </Suspense>
        </div>

        {/* Side Panel (1/3) */}
        <div className="space-y-8">
          <Suspense fallback={<div className="space-y-8"><Skeleton className="h-[350px] rounded-[2.5rem] bg-slate-100" /><Skeleton className="h-[450px] rounded-[2.5rem] bg-slate-100" /></div>}>
            <OperationalMetrics />
          </Suspense>
        </div>

      </div>
    </div>
  );
}

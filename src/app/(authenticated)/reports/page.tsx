import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportService } from "@/features/reports/services/ReportService";
import { formatCurrency } from "@/utils/financials";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/ui/core/Skeleton";

import { ReportsChartsWrapper } from "@/components/reports/ReportsChartsWrapper";
import {
   BarChart3, PieChart, Landmark, ShieldCheck,
   Download, Calendar, TrendingUp, Users,
   ArrowUpRight, Info, Building2
} from "lucide-react";
import Link from "next/link";

export default async function ReportsPage() {
   const session = await verifySessionCookie();
   if (!session) redirect("/login");

   const currentYear = new Date().getFullYear();

   // ── Parallel Data Aggregation ──
   const [
      monthlyRevenue,
      clientRevenue,
      quarterlySummary,
      lastMonthSummary,
      reconciliation
   ] = await Promise.all([
      ReportService.getMonthlyRevenue(currentYear),
      ReportService.getClientRevenue(5),
      // Current Quarter (Roughly Q1 for 2026-03)
      ReportService.getRevenueSummary(new Date(currentYear, 0, 1), new Date(currentYear, 2, 31)),
      // Last Month (February)
      ReportService.getRevenueSummary(new Date(currentYear, 1, 1), new Date(currentYear, 1, 28)),
      ReportService.getGstReconciliation(new Date(currentYear, 0, 1), new Date(currentYear, 2, 31))
   ]);

   return (
      <div className="space-y-8 animate-fade-up pb-20">
         {/* ── Header ── */}
         <div className="page-header flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
               <h1 className="page-title italic">Strategic Analytics & GST Reporting</h1>
               <p className="page-subtitle italic">Comprehensive financial performance for JEZZY Enterprises</p>
            </div>
            <div className="flex items-center gap-2">
               <button className="btn-secondary h-10 px-4 text-xs font-bold gap-2 uppercase tracking-widest border border-slate-200">
                  <Download className="w-4 h-4" /> Export All Data
               </button>
            </div>
         </div>

         {/* ── KPI Grid ── */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportKpi
               label="Quarterly Revenue (Q1)"
               value={formatCurrency(quarterlySummary.totalRevenue)}
               sub={`Billed from ${quarterlySummary.count} documents`}
               icon={<TrendingUp className="w-5 h-5" />}
               trend="+12.5%"
               color="navy"
            />
            <ReportKpi
               label="Tax Collected (GST)"
               value={formatCurrency(quarterlySummary.totalTax)}
               sub="Total tax liability (all types)"
               icon={<ShieldCheck className="w-5 h-5" />}
               color="gold"
            />
            <ReportKpi
               label="CGST / SGST Share"
               value={formatCurrency(quarterlySummary.cgst)}
               sub="Intra-state tax (split 50/50)"
               icon={<Landmark className="w-5 h-5" />}
               color="success"
            />
            <ReportKpi
               label="IGST Share"
               value={formatCurrency(quarterlySummary.igst)}
               sub="Inter-state tax total"
               icon={<ArrowUpRight className="w-5 h-5" />}
               color="primary"
            />
         </div>

         {/* ── Charts Row ── */}
         <ReportsChartsWrapper monthlyRevenue={monthlyRevenue} clientRevenue={clientRevenue} />

         {/* ── GST Filing Summary (The "Killer" Feature) ── */}
         <div className="card border-0 shadow-2xl ring-1 ring-slate-200 p-0 overflow-hidden">
            <div className="px-8 py-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 ring-4 ring-white/5">
                     <Landmark className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white font-display">GST Filing Summary</h3>
                     <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Crucial data for your CA/Accountant</p>
                  </div>
               </div>
               <button className="btn-accent h-11 px-6 gap-2 text-sm shadow-xl shadow-amber-500/10 active:scale-95 transition-transform group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5" />
                  Export GSTR-1 Data
               </button>
            </div>

            <div className="p-8 space-y-8">
               {/* Quick Context Tip */}
               <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100 border-l-4 border-l-amber-500 flex gap-4">
                  <Info className="w-6 h-6 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-medium italic">
                     This summary is automatically calculated from all finalized invoices for the current quarter. **CGST & SGST** apply to Intra-state supplies (Keralam to Keralam), while **IGST** applies to Inter-state transactions.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-4">
                  <div>
                     <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Total CGST</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(quarterlySummary.cgst)}</p>
                     <div className="w-12 h-1 bg-primary-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Total SGST</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(quarterlySummary.sgst)}</p>
                     <div className="w-12 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Total IGST</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(quarterlySummary.igst)}</p>
                     <div className="w-12 h-1 bg-indigo-500 mx-auto mt-3 rounded-full" />
                  </div>
               </div>

               <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" /> Quarterly Aggregates
                     </h4>
                     <span className="text-[10px] font-bold text-slate-500">JANUARY 2026 — MARCH 2026</span>
                  </div>
                  <div className="space-y-4">
                     <SummaryRow label="Total Valueable Supply (Before Tax)" value={formatCurrency(quarterlySummary.totalRevenue - quarterlySummary.totalTax)} />
                     <SummaryRow label="Total GST Liability" value={formatCurrency(quarterlySummary.totalTax)} bold italic />
                     <SummaryRow label="Grand Total (Inclusive of Taxes)" value={formatCurrency(quarterlySummary.totalRevenue)} highlight />
                  </div>
               </div>
            </div>
         </div>

         {/* ── GST Reconciliation (ITC Reconciliation) ── */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="card shadow-2xl border-0 ring-1 ring-slate-100 p-0 overflow-hidden bg-white rounded-[2.5rem]">
               <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-primary-600" />
                     <h3 className="font-black text-slate-900 uppercase tracking-tighter italic text-lg">Tax <span className="text-primary-600">Reconciliation</span></h3>
                  </div>
                  <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                     ITC Optimized
                  </div>
               </div>
               <div className="p-8 space-y-8">
                   <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Output GST (Sales)</p>
                           <p className="text-2xl font-black text-slate-900 italic">{formatCurrency(reconciliation.outputTax)}</p>
                       </div>
                       <div className="p-6 bg-emerald-50 rounded-4xl border border-emerald-100">
                           <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Input GST (Purchase)</p>
                           <p className="text-2xl font-black text-emerald-900 italic">{formatCurrency(reconciliation.inputTax)}</p>
                       </div>
                   </div>

                   <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                           <ShieldCheck className="w-24 h-24 text-white" />
                       </div>
                       <div className="relative z-10">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Net Tax Payable / (Credit)</p>
                           <p className={`text-4xl font-black italic tracking-tighter ${reconciliation.netTaxPayable >= 0 ? 'text-white' : 'text-emerald-400'}`}>
                               {formatCurrency(Math.abs(reconciliation.netTaxPayable))}
                               {reconciliation.netTaxPayable < 0 && <span className="text-sm not-italic ml-2 opacity-60">(Excess Credit)</span>}
                           </p>
                           <p className="text-[10px] font-bold text-slate-500 mt-4 leading-relaxed uppercase tracking-widest">
                               Total GST liability after adjusting Input Tax Credit (ITC) from inward procurement records.
                           </p>
                       </div>
                   </div>
               </div>
            </div>

            <div className="card shadow-2xl border-0 ring-1 ring-slate-100 p-8 bg-white flex flex-col justify-center gap-6 rounded-[2.5rem]">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                        <Info className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Strategic <span className="text-primary-600">Tax Edge</span></h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Your enterprise is currently leveraging its supply chain to offset tax liabilities. By recording every inward procurement node, you ensure maximum ITC utilization and cash flow optimization.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Link href="/purchases/new" className="h-14 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 transition-all">
                        Log Supply Node <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link href="/vendors" className="h-14 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 transition-all">
                        Manage Suppliers <Users className="w-4 h-4" />
                    </Link>
                </div>
            </div>
         </div>
      </div>
   );
}

// ── Components ──

function ReportKpi({ label, value, sub, icon, trend, color }: any) {
   const colors: any = {
      navy: "bg-primary-600 text-white shadow-primary-500/10",
      gold: "bg-amber-500 text-white shadow-amber-500/10",
      success: "bg-emerald-600 text-white shadow-emerald-500/10",
      primary: "bg-indigo-600 text-white shadow-indigo-500/10"
   };
   return (
      <div className="card shadow-lg border-0 ring-1 ring-slate-100 p-6 flex flex-col justify-between group hover:ring-slate-300 transition-all">
         <div className="flex items-start justify-between">
            <div className={`p-3 rounded-2xl ${colors[color]} ring-4 ring-white/50 shadow-lg group-hover:scale-110 transition-transform`}>
               {icon}
            </div>
            {trend && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">↑ {trend}</span>}
         </div>
         <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className="text-[10px] text-slate-400 mt-1 italic font-medium">{sub}</p>
         </div>
      </div>
   );
}

function SummaryRow({ label, value, bold, italic, highlight }: any) {
   return (
      <div className={`flex items-center justify-between p-3 rounded-xl transition-colors ${highlight ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-white/50'}`}>
         <span className={`text-xs text-slate-600 ${italic ? 'italic font-medium' : 'font-bold'}`}>{label}</span>
         <span className={`text-sm ${bold ? 'font-black text-slate-900' : 'font-bold text-slate-800'} ${highlight ? 'text-primary-600' : ''}`}>{value}</span>
      </div>
   );
}

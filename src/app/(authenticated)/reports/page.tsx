import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, getBusinessLabel } from "@/utils/financials";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { cn } from "@/utils/index";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from "@/ui/core/Card";
import {
   BarChart3,
   TrendingUp,
   TrendingDown,
   PieChart,
   ArrowRight,
   FileText,
   Calendar,
   ArrowDownLeft,
   ArrowUpRight,
   Zap,
   Activity,
   ShieldCheck,
   Timer
} from "lucide-react";
import Link from "next/link";
import { ReportFilters } from "./ReportFilters";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
   const session = await verifySessionCookie();
   if (!session) redirect("/login");

   const { range = "30d" } = await searchParams;

   // 1. Calculate Date Range
   let startDate: Date | undefined;
   let endDate: Date = endOfDay(new Date());

   switch (range) {
      case "today":
         startDate = startOfDay(new Date());
         break;
      case "7d":
         startDate = startOfDay(subDays(new Date(), 7));
         break;
      case "30d":
         startDate = startOfDay(subDays(new Date(), 30));
         break;
      case "this-month":
         startDate = startOfMonth(new Date());
         break;
      case "last-month":
         startDate = startOfMonth(subMonths(new Date(), 1));
         endDate = endOfMonth(subMonths(new Date(), 1));
         break;
      case "this-quarter":
         startDate = startOfMonth(subMonths(new Date(), 3));
         break;
      case "all":
         startDate = undefined;
         break;
   }

   // 2. Fetch Data
   const summary = await FinanceService.getProfitSummary(startDate, endDate);

   const revenue = summary.revenue;
   const expenses = summary.expenses;
   const purchases = summary.purchases;
   const netProfit = summary.netProfit;
   const netCashFlow = revenue - (expenses + purchases);

   // 3. System Stats (Global)
   const totalClients = await db.client.count({ where: { deletedAt: null } });
   const totalInvoices = await db.invoice.count({ where: { deletedAt: null } });

   const reportCards = [
      { title: "Account Statement", desc: "Detailed ledger per account", icon: FileText, href: "/accounts", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Expense Analysis", desc: "Categorized spend report", icon: PieChart, href: "/expenses", color: "text-rose-600", bg: "bg-rose-50" },
      { title: "Tax Summary", desc: "GST Inward vs Outward", icon: Calendar, href: "/reports/tax", color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "Audit Trail", desc: "System activity logs", icon: BarChart3, href: "/transactions", color: "text-slate-600", bg: "bg-slate-50" },
   ];

   return (
      <div className="space-y-12 animate-fade-up max-w-7xl mx-auto pb-24">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] italic">Intelligence Hub</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/20" />
               </div>
               <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">
                  Financial <span className="text-primary-600">Intel</span>
               </h1>
            </div>

            <ReportFilters />
         </div>

         {/* ── Primary Visualizer ── */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <Card className="lg:col-span-8 border-0 bg-slate-900 text-white shadow-3xl overflow-hidden rounded-[3rem] relative min-h-[400px]">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Activity className="w-80 h-80 rotate-12" />
               </div>

               <CardContent className="p-16 relative z-10 h-full flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                           <TrendingUp className="text-emerald-400 w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Gross Revenue</p>
                           <h3 className="text-4xl font-black italic tracking-tighter tabular-nums text-emerald-400">{formatCurrency(revenue)}</h3>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                           <TrendingDown className="text-rose-400 w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Direct Procurement</p>
                           <h3 className="text-4xl font-black italic tracking-tighter tabular-nums text-rose-400">{formatCurrency(purchases)}</h3>
                        </div>
                     </div>
                  </div>

                  <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-10">
                     <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-2">Net Period Profit</p>
                        <h3 className={cn(
                           "text-6xl font-black italic tracking-tighter tabular-nums",
                           netProfit >= 0 ? "text-primary-500" : "text-rose-500"
                        )}>
                           {formatCurrency(netProfit)}
                        </h3>
                     </div>

                     <div className="w-full md:w-64 space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-500">Efficiency</span>
                           <span className="text-emerald-400">
                              {revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0}% Margin
                           </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ width: `${Math.max(0, Math.min(100, (netProfit / (revenue || 1)) * 100))}%` }} />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-8">
               <Card className="border-0 bg-primary-600 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-1000">
                     <Zap size={180} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 italic">Liquidity Profile</p>
                  <h4 className="text-4xl font-black italic tracking-tighter mb-4">{formatCurrency(netCashFlow)}</h4>
                  <p className="text-xs font-medium text-white/80 leading-relaxed max-w-[200px]">
                     Current free cash flow available for operational reinvestment after direct costs.
                  </p>
               </Card>

               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] ring-1 ring-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <ShieldCheck size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Clients</p>
                        <p className="text-2xl font-black text-slate-900">{totalClients}</p>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] ring-1 ring-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Timer size={20} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Invoices</p>
                        <p className="text-2xl font-black text-slate-900">{totalInvoices}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* ── Secondary Reports Grid ── */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 px-4">
               <ShieldCheck className="w-5 h-5 text-slate-400" />
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Compliance & Audit Streams</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {reportCards.map((card) => (
                  <Link href={card.href} key={card.title} className="group">
                     <Card className="border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-600/10 transition-all ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardContent className="p-10">
                           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-lg", card.bg, card.color)}>
                              {typeof card.icon === 'string' ? <FileText className="w-7 h-7" /> : <card.icon className="w-7 h-7" />}
                           </div>
                           <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{card.title}</h4>
                           <p className="text-xs text-slate-400 font-bold italic leading-relaxed">{card.desc}</p>
                           <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                              Access Matrix <ArrowRight className="w-4 h-4" />
                           </div>
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}
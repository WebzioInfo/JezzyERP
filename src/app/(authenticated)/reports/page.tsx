import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils/financials";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { cn } from "@/utils/index";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription
} from "@/ui/core/Card";
import {
   BarChart3,
   TrendingUp,
   TrendingDown,
   PieChart,
   ArrowRight,
   FileText,
   Calendar,
   Users,
   Receipt,
   Wallet,
   Activity
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
      { title: "Account Statement", desc: "Detailed general ledger and balances per account", icon: FileText, href: "/accounts", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Expense Analysis", desc: "Categorized operating expenditure and breakdown", icon: PieChart, href: "/expenses", color: "text-rose-600", bg: "bg-rose-50" },
      { title: "Transaction History", desc: "Complete audit log of all financial movements", icon: BarChart3, href: "/transactions", color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "Invoices & Receivables", desc: "Status tracking of receivables and payments", icon: Receipt, href: "/invoices", color: "text-indigo-600", bg: "bg-indigo-50" },
   ];

   return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
               <p className="text-sm text-slate-500 mt-0.5">Overview of revenue, expenses, net profits, and statements</p>
            </div>
            <ReportFilters />
         </div>

         {/* Primary Summary Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 bg-slate-900 text-white border-0 shadow-md">
               <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                           <TrendingUp className="text-emerald-400 w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                           <h3 className="text-3xl font-bold tracking-tight tabular-nums text-emerald-400 mt-1">{formatCurrency(revenue)}</h3>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                           <TrendingDown className="text-rose-400 w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct Procurement</p>
                           <h3 className="text-3xl font-bold tracking-tight tabular-nums text-rose-400 mt-1">{formatCurrency(purchases)}</h3>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                     <div>
                        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Net Period Profit</p>
                        <h3 className={cn(
                           "text-4xl font-bold tracking-tight tabular-nums mt-1",
                           netProfit >= 0 ? "text-blue-400" : "text-rose-400"
                        )}>
                           {formatCurrency(netProfit)}
                        </h3>
                     </div>

                     <div className="w-full sm:w-64 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                           <span className="text-slate-400">Profit Margin</span>
                           <span className="text-emerald-400 font-semibold">
                              {revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0}%
                           </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, (netProfit / (revenue || 1)) * 100))}%` }} />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="lg:col-span-4 flex flex-col gap-4">
               <Card className="bg-primary-600 text-white border-0 shadow-sm">
                  <CardContent className="p-6">
                     <div className="flex items-center gap-2 mb-2 text-primary-200">
                        <Wallet className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Net Cash Flow</span>
                     </div>
                     <h4 className="text-2xl font-bold tabular-nums">{formatCurrency(netCashFlow)}</h4>
                     <p className="text-xs text-primary-100 mt-2 leading-relaxed">
                        Free cash flow after deducting operating expenses and purchases.
                     </p>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-2 gap-4 flex-1">
                  <Card>
                     <CardContent className="p-5 flex flex-col justify-between h-full">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                           <Users size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-medium text-slate-500">Active Clients</p>
                           <p className="text-xl font-bold text-slate-900 mt-0.5">{totalClients}</p>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-5 flex flex-col justify-between h-full">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                           <Receipt size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-medium text-slate-500">Total Invoices</p>
                           <p className="text-xl font-bold text-slate-900 mt-0.5">{totalInvoices}</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>

         {/* Secondary Reports Grid */}
         <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Detailed Statements & Registers</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {reportCards.map((card) => (
                  <Link href={card.href} key={card.title} className="group">
                     <Card className="h-full hover:border-primary-300 hover:shadow-md transition-all">
                        <CardContent className="p-5 flex flex-col justify-between h-full">
                           <div>
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105", card.bg, card.color)}>
                                 <card.icon className="w-5 h-5" />
                              </div>
                              <h3 className="text-sm font-semibold text-slate-900 mb-1">{card.title}</h3>
                              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                           </div>
                           <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary-600">
                              <span>Open Statement</span>
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
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
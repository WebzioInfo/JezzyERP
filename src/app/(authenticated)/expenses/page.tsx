import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { 
  Plus, 
  Trash2, 
  Receipt,
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default async function ExpensesPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const expenses = await (db.expense as any).findMany({
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">Expense Hub</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Operational Outflow Tracking</p>
        </div>

        <div className="flex items-center gap-3">
           <Link href="/expenses/new">
              <button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <Plus className="w-5 h-5" />
                <span>Record Expense</span>
              </button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Summary Cards */}
         <Card className="border-0 bg-rose-50 ring-1 ring-rose-500/10 rounded-[2.5rem]">
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600/70 mb-2">Monthly Burn</p>
               <h2 className="text-4xl font-black italic text-rose-900 tabular-nums">
                 {formatCurrency(expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0))}
               </h2>
               <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest mt-2">Total from recent entries</p>
            </CardContent>
         </Card>
      </div>

      <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem] bg-white/50 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900">
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                       No expense records found.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense: any) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{fmtDate(expense.date)}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{expense.category}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{expense.description || "Uncategorized Expense"}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <span className="text-lg font-black text-rose-600 italic tracking-tighter tabular-nums">
                           {formatCurrency(Number(expense.amount))}
                         </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

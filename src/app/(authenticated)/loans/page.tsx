import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import {
  Plus,
  History,
  LifeBuoy,
  ArrowRightLeft,
  Calendar,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default async function LoansPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const [loans, advances] = await Promise.all([
    (db as any).loan.findMany({ orderBy: { date: "desc" } }),
    (db as any).advance.findMany({ orderBy: { date: "desc" } })
  ]);

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] italic">Capital Node</span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/20" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">
            Loans <span className="text-primary-600">&</span> Advances
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/loans/new" className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>New Capital Entry</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Liabilities</p>
            <h3 className="text-3xl font-black tabular-nums tracking-tighter italic">
              {formatCurrency(loans.filter((l: any) => l.type === 'TAKEN').reduce((sum: number, l: any) => sum + Number(l.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-0 bg-primary-600 text-white rounded-[2.5rem] shadow-2xl">
          <CardContent className="p-8">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Receivables</p>
            <h3 className="text-3xl font-black tabular-nums tracking-tighter italic">
              {formatCurrency(loans.filter((l: any) => l.type === 'GIVEN').reduce((sum: number, l: any) => sum + Number(l.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-0 bg-emerald-50 ring-1 ring-emerald-100 rounded-[2.5rem]">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Advances Received</p>
            <h3 className="text-3xl font-black text-emerald-900 tabular-nums tracking-tighter italic">
              {formatCurrency(advances.filter((a: any) => a.type === 'RECEIVED').reduce((sum: number, a: any) => sum + Number(a.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-0 bg-amber-50 ring-1 ring-amber-100 rounded-[2.5rem]">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Advances Given</p>
            <h3 className="text-3xl font-black text-amber-900 tabular-nums tracking-tighter italic">
              {formatCurrency(advances.filter((a: any) => a.type === 'GIVEN').reduce((sum: number, a: any) => sum + Number(a.amount), 0))}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Loans Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 px-4">
            <LifeBuoy className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Loan Portfolio</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active loans found.</p>
              </div>
            ) : (
              loans.map((loan: any) => (
                <Card key={loan.id} className="border-0 shadow-xl ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all">
                  <div className={cn(
                    "p-6 text-white transition-colors duration-500",
                    loan.type === 'TAKEN' ? "bg-slate-900 group-hover:bg-slate-800" : "bg-primary-600 group-hover:bg-primary-700"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                        {loan.type === 'TAKEN' ? 'Liability' : 'Asset'}
                      </span>
                      <ArrowRightLeft className="w-4 h-4 opacity-40" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight truncate italic">{loan.partyName}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Principal</p>
                      <h4 className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{formatCurrency(Number(loan.amount))}</h4>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" /> {fmtDate(loan.date)}
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                        loan.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      )}>{loan.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Advances Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 px-4">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Advance Stream</h3>
          </div>
          <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Party</th>
                      <th className="text-center px-4 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
                      <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {advances.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No advances recorded.</td>
                      </tr>
                    ) : (
                      advances.map((advance: any) => (
                        <tr key={advance.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4">
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{advance.partyName}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{fmtDate(advance.date)}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                              advance.type === 'RECEIVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              {advance.type.slice(0, 3)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-slate-900 italic tracking-tighter tabular-nums">
                              {formatCurrency(Number(advance.amount))}
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
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

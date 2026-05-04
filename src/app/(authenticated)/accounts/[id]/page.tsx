import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { cn } from "@/utils";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  const account = await (db.account as any).findUnique({
    where: { id },
    include: {
      client: true,
      vendor: true,
    }
  });

  if (!account) notFound();

  const balance = await FinanceService.getAccountBalance(id);

  const entries = await (db.ledgerEntry as any).findMany({
    where: {
      OR: [
        { debitAccountId: id },
        { creditAccountId: id }
      ]
    },
    orderBy: { date: "desc" },
    select: {
      id: true,
      amount: true,
      date: true,
      description: true,
      referenceType: true,
      referenceId: true,
      debitAccountId: true,
      creditAccountId: true,
      createdAt: true,
      // transactionType omitted — column not yet migrated to DB
      debitAccount: { select: { id: true, name: true, type: true } },
      creditAccount: { select: { id: true, name: true, type: true } },
    },
    take: 100
  });


  // Calculate Credit/Debit Summary
  const debitSum = entries
    .filter((e: any) => e.debitAccountId === id)
    .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    
  const creditSum = entries
    .filter((e: any) => e.creditAccountId === id)
    .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <Link href="/accounts" className="h-12 w-12 glass flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-slate-200 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
           </Link>
           <div>
              <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">{account.name}</h1>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{account.type} Account Statement</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           {/* Actions could go here */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <Card className="col-span-1 lg:col-span-1 border-0 bg-slate-900 text-white shadow-2xl overflow-hidden relative rounded-[2.5rem]">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ArrowRightLeft className="w-32 h-32" />
           </div>
           <CardContent className="p-10 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Current Balance</p>
              <h2 className="text-5xl font-black italic tracking-tighter tabular-nums mb-4">
                {formatCurrency(Math.abs(balance))}
                <span className="text-lg ml-2 opacity-50">{balance >= 0 ? 'DR' : 'CR'}</span>
              </h2>
              <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                 {balance >= 0 ? 'Debit Balance (Asset/Receivable)' : 'Credit Balance (Liability/Payable)'}
              </p>
           </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card className="border-0 bg-emerald-50 shadow-xl ring-1 ring-emerald-500/10 rounded-[2.5rem]">
              <CardContent className="p-8">
                 <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Total Debits (+)</span>
                 </div>
                 <h3 className="text-3xl font-black text-emerald-900 tabular-nums">{formatCurrency(debitSum)}</h3>
                 <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mt-2">Funds Inward / Increases</p>
              </CardContent>
           </Card>

           <Card className="border-0 bg-rose-50 shadow-xl ring-1 ring-rose-500/10 rounded-[2.5rem]">
              <CardContent className="p-8">
                 <div className="flex items-center gap-3 mb-4 text-rose-600">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Total Credits (-)</span>
                 </div>
                 <h3 className="text-3xl font-black text-rose-900 tabular-nums">{formatCurrency(creditSum)}</h3>
                 <p className="text-[10px] font-bold text-rose-600/60 uppercase tracking-widest mt-2">Funds Outward / Decreases</p>
              </CardContent>
           </Card>
        </div>
      </div>

      <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
           </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/5">
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                  <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Counter Account</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry: any) => {
                  const isDebit = entry.debitAccountId === id;
                  const counterAccount = isDebit ? entry.creditAccount : entry.debitAccount;
                  
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{fmtDate(entry.date)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{entry.description || "General Entry"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {entry.referenceType} | #{entry.id.slice(-6)}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            {counterAccount?.name || "System"}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className={cn(
                           "text-lg font-black italic tracking-tighter tabular-nums flex items-center justify-end gap-2",
                           isDebit ? "text-emerald-600" : "text-rose-600"
                         )}>
                           {isDebit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                           {formatCurrency(Number(entry.amount))}
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate, getBusinessLabel } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Search,
  Filter,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  UserPlus,
  UserMinus,
  LucideIcon
} from "lucide-react";
import { cn } from "@/utils";

const getTransactionBadge = (type: string): { label: string, color: string, icon: LucideIcon } => {
  switch (type) {
    case 'PAYMENT_RECEIVED': return { label: 'Payment In', color: 'bg-emerald-500', icon: TrendingUp };
    case 'PAYMENT_MADE': return { label: 'Payment Out', color: 'bg-rose-500', icon: TrendingDown };
    case 'EXPENSE': return { label: 'Expense', color: 'bg-amber-500', icon: CircleDollarSign };
    case 'INVOICE': return { label: 'Invoice', color: 'bg-primary-600', icon: ArrowUpRight };
    case 'PURCHASE': return { label: 'Purchase', color: 'bg-indigo-600', icon: ArrowDownLeft };
    case 'FOUNDER_CONTRIBUTION': return { label: 'Equity In', color: 'bg-blue-600', icon: UserPlus };
    case 'FOUNDER_WITHDRAWAL': return { label: 'Equity Out', color: 'bg-slate-800', icon: UserMinus };
    case 'TRANSFER': return { label: 'Transfer', color: 'bg-indigo-600', icon: ArrowRightLeft };
    default: return { label: 'Entry', color: 'bg-slate-400', icon: History };
  }
}

export default async function MasterLedgerPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const entries = await (db.ledgerEntry as any).findMany({
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
    take: 100,
  });

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">Master Ledger</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Historical Transaction Stream</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass px-5 py-3 rounded-2xl w-64 border border-slate-200 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Search ledger..." className="bg-transparent border-none text-xs font-bold outline-hidden" />
           </div>
           <button className="h-12 w-12 glass flex items-center justify-center rounded-2xl text-slate-500 border border-slate-200">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem] bg-white/50 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900">
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Date</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
                  <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Debit (From)</th>
                  <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Credit (To)</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry: any) => {
                  const badge = getTransactionBadge(entry.transactionType ?? entry.referenceType);
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{fmtDate(entry.date)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest",
                          badge.color
                        )}>
                          <badge.icon className="w-3 h-3" />
                          {badge.label}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{entry.description || "General Transfer"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {getBusinessLabel(entry.referenceType)} | #{entry.referenceId?.slice(-6)}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="text-[10px] font-black uppercase tracking-tight">{entry.debitAccount?.name || "Internal Ledger"}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                             <span className="text-[10px] font-black uppercase tracking-tight">{entry.creditAccount?.name || "Internal Ledger"}</span>
                          </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <span className="text-lg font-black text-slate-900 italic tracking-tighter tabular-nums">
                           {formatCurrency(Number(entry.amount))}
                         </span>
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

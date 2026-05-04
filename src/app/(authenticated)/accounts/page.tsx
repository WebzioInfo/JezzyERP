import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { 
  Building2, 
  Wallet, 
  Users, 
  Briefcase,
  ChevronRight,
  TrendingUp,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Landmark,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { FinanceService } from "@/features/billing/services/FinanceService";

export default async function AccountsPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const accounts = await (db as any).account.findMany({
    orderBy: { type: "asc" }
  });

  // Group accounts by type for the UI
  const accountsWithBalances = await Promise.all(accounts.map(async (acc: any) => ({
    ...acc,
    balance: await FinanceService.getAccountBalance(acc.id)
  })));

  const categories = [
    { type: 'BANK', label: 'Bank Accounts', icon: Building2, color: 'text-primary-600', bg: 'bg-primary-50' },
    { type: 'CASH', label: 'Cash in Hand', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { type: 'CLIENT', label: 'Client Receivables', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'SUPPLIER', label: 'Vendor Payables', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
    { type: 'EQUITY', label: 'Owner Account', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12 animate-fade-up max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">Financial Accounts</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Chart of Accounts & Current Liquidity</p>
        </div>
      </div>

      {/* ── Quick Guided Actions ── */}
      <div className="flex flex-wrap gap-4">
          <Link href="/payments/new" className="h-12 px-6 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              <ArrowDownCircle className="w-4 h-4" />
              <span>Receive Payment</span>
          </Link>
          <Link href="/expenses/new" className="h-12 px-6 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
              <ArrowUpCircle className="w-4 h-4" />
              <span>Record Expense</span>
          </Link>
          <Link href="/invoices/new" className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
          </Link>
          <Link href="/accounts/equity" className="h-12 px-6 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
              <Landmark className="w-4 h-4" />
              <span>Owner Account</span>
          </Link>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat) => {
          const catAccounts = accountsWithBalances.filter(a => a.type === cat.type);
          if (catAccounts.length === 0 && cat.type !== 'EQUITY') return null;

          return (
            <div key={cat.type} className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className={cat.color}>
                    <cat.icon className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{cat.label}</h2>
                 <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catAccounts.map((acc) => {
                  const isAdvance = (acc.type === 'CLIENT' && acc.balance < 0) || 
                                   (acc.type === 'SUPPLIER' && acc.balance > 0);
                  
                  return (
                    <Link href={`/accounts/${acc.id}`} key={acc.id} className="group">
                      <Card className="border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary-600/10 transition-all ring-1 ring-slate-100 rounded-[2rem] overflow-hidden relative">
                        {isAdvance && (
                          <div className="absolute top-4 right-20 z-10">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-md animate-pulse">
                              <Sparkles className="w-2.5 h-2.5" />
                              Advance
                            </div>
                          </div>
                        )}
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className={acc.balance >= 0 ? "text-emerald-600" : "text-rose-600"}>
                               <ArrowRightLeft className="w-5 h-5 opacity-40" />
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                               <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                          <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1 truncate">{acc.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A/C: {acc.id.slice(-8)}</p>
                          
                          <div className="mt-6 pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current Balance</p>
                            <h3 className={acc.balance >= 0 ? "text-2xl font-black text-emerald-600 tabular-nums" : "text-2xl font-black text-rose-600 tabular-nums"}>
                              {formatCurrency(Math.abs(acc.balance))}
                              <span className="text-[10px] ml-2 opacity-50">{acc.balance >= 0 ? 'DR' : 'CR'}</span>
                            </h3>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

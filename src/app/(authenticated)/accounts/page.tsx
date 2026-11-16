import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { 
  Building2, 
  Wallet, 
  Users, 
  Briefcase,
  ChevronRight,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Landmark,
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
    { type: 'BANK', label: 'Bank Accounts', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'CASH', label: 'Cash in Hand', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { type: 'CLIENT', label: 'Client Receivables', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { type: 'SUPPLIER', label: 'Vendor Payables', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
    { type: 'EQUITY', label: 'Owner Equity', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Financial Accounts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Chart of accounts, liquid balances, receivables, and payables</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/payments/new">
            <Button variant="secondary" size="md">
              <ArrowDownCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
              Receive Payment
            </Button>
          </Link>
          <Link href="/expenses/new">
            <Button variant="secondary" size="md">
              <ArrowUpCircle className="w-4 h-4 mr-1.5 text-rose-600" />
              Record Expense
            </Button>
          </Link>
          <Link href="/accounts/equity">
            <Button variant="primary" size="md">
              <Landmark className="w-4 h-4 mr-1.5" />
              Owner Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const catAccounts = accountsWithBalances.filter(a => a.type === cat.type);
          if (catAccounts.length === 0 && cat.type !== 'EQUITY') return null;

          return (
            <div key={cat.type} className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                 <cat.icon className={`w-4 h-4 ${cat.color}`} />
                 <h2 className="text-sm font-semibold text-slate-900">{cat.label}</h2>
                 <span className="text-xs text-slate-400">({catAccounts.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {catAccounts.map((acc) => {
                  const isAdvance = (acc.type === 'CLIENT' && acc.balance < 0) || 
                                   (acc.type === 'SUPPLIER' && acc.balance > 0);
                  
                  return (
                    <Link href={`/accounts/${acc.id}`} key={acc.id} className="group block">
                      <Card className="hover:border-slate-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 truncate">{acc.name}</h3>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">A/C: {acc.id.slice(-6)}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isAdvance && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  Advance
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                            <span className="text-xs text-slate-500 font-medium">Balance</span>
                            <div className="text-right">
                              <span className={`text-base font-bold tabular-nums ${acc.balance >= 0 ? "text-slate-900" : "text-rose-600"}`}>
                                {formatCurrency(Math.abs(acc.balance))}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 ml-1.5">{acc.balance >= 0 ? 'DR' : 'CR'}</span>
                            </div>
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

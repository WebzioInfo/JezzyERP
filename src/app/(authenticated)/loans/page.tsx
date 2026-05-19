import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import {
  Plus,
} from "lucide-react";
import Link from "next/link";
import { serializePrisma } from "@/utils/serialization";
import { LoansList } from "@/features/billing/components/LoansList";

export default async function LoansPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const [loans, advances, ledgerEntries] = await Promise.all([
    (db as any).loan.findMany({ orderBy: { date: "desc" } }),
    (db as any).advance.findMany({ orderBy: { date: "desc" } }),
    (db as any).ledgerEntry.findMany({
      where: {
        referenceType: { in: ['LOAN_TAKEN', 'LOAN_GIVEN'] }
      },
      include: {
        debitAccount: true,
        creditAccount: true
      }
    })
  ]);

  const loansWithMethod = loans.map((loan: any) => {
    const entry = ledgerEntries.find((e: any) => e.referenceId === loan.id);
    const isBank = entry?.debitAccount?.type === 'BANK' || entry?.creditAccount?.type === 'BANK';
    const isCash = entry?.debitAccount?.type === 'CASH' || entry?.creditAccount?.type === 'CASH';
    return {
      ...loan,
      paymentMethod: isBank ? 'BANK' : isCash ? 'CASH' : 'UNKNOWN'
    };
  });

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

      {/* Main Listing & Filtering Area */}
      <LoansList 
        loans={serializePrisma(loansWithMethod)} 
        advances={serializePrisma(advances)} 
      />
    </div>
  );
}

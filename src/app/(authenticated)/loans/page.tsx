import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Plus } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Loans & Capital Advances</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track borrowing liabilities, receivables, and unallocated advances</p>
        </div>

        <Link href="/loans/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span>New Capital Entry</span>
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 text-white border-0">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Liabilities (Taken)</p>
            <h3 className="text-2xl font-bold tabular-nums tracking-tight mt-1">
              {formatCurrency(loans.filter((l: any) => l.type === 'TAKEN').reduce((sum: number, l: any) => sum + Number(l.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-primary-600 text-white border-0">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-200">Total Receivables (Given)</p>
            <h3 className="text-2xl font-bold tabular-nums tracking-tight mt-1">
              {formatCurrency(loans.filter((l: any) => l.type === 'GIVEN').reduce((sum: number, l: any) => sum + Number(l.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="border border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Advances Received</p>
            <h3 className="text-2xl font-bold text-emerald-900 tabular-nums tracking-tight mt-1">
              {formatCurrency(advances.filter((a: any) => a.type === 'RECEIVED').reduce((sum: number, a: any) => sum + Number(a.amount), 0))}
            </h3>
          </CardContent>
        </Card>
        <Card className="border border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Advances Given</p>
            <h3 className="text-2xl font-bold text-amber-900 tabular-nums tracking-tight mt-1">
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

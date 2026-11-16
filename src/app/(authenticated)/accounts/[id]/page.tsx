import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  TrendingDown,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import { FinanceService } from "@/features/billing/services/FinanceService";
import { cn } from "@/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/ui/core/Table";

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
      debitAccount: { select: { id: true, name: true, type: true } },
      creditAccount: { select: { id: true, name: true, type: true } },
    },
    take: 100
  });

  const debitSum = entries
    .filter((e: any) => e.debitAccountId === id)
    .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    
  const creditSum = entries
    .filter((e: any) => e.creditAccountId === id)
    .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/accounts" 
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{account.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{account.type} Account Ledger & Statement</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance Card */}
        <Card className="bg-slate-900 text-white border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Balance</p>
            <h2 className="text-2xl font-bold tabular-nums mt-1">
              {formatCurrency(Math.abs(balance))}
              <span className="text-xs ml-1.5 opacity-60 font-semibold">{balance >= 0 ? 'DR' : 'CR'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {balance >= 0 ? 'Debit Balance (Asset / Receivable)' : 'Credit Balance (Liability / Payable)'}
            </p>
          </CardContent>
        </Card>

        {/* Debits Card */}
        <Card className="border border-emerald-200/80 bg-emerald-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Debits (+)</span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 tabular-nums">{formatCurrency(debitSum)}</h3>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Inward receipts & increases</p>
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card className="border border-rose-200/80 bg-rose-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-rose-800 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Credits (-)</span>
            </div>
            <h3 className="text-2xl font-bold text-rose-900 tabular-nums">{formatCurrency(creditSum)}</h3>
            <p className="text-xs text-rose-700 mt-1 font-medium">Outward payments & deductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Entries Table */}
      <Card>
        <CardContent className="p-0">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">General Ledger Activity</h2>
            <span className="text-xs text-slate-500 font-medium">{entries.length} recent entries</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Date</TableHead>
                <TableHead>Description & Reference</TableHead>
                <TableHead className="text-center w-36">Offset Account</TableHead>
                <TableHead className="text-right w-36">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-400 text-xs">
                    No transactions recorded for this account.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry: any) => {
                  const isDebit = entry.debitAccountId === id;
                  const counterAccount = isDebit ? entry.creditAccount : entry.debitAccount;
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-slate-600 text-xs">
                        {fmtDate(entry.date)}
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-slate-900 text-sm">{entry.description || "General Entry"}</p>
                        <p className="text-[10px] text-slate-400">Ref: {entry.referenceType} | #{entry.id.slice(-6)}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {counterAccount?.name || "System"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-semibold tabular-nums text-sm inline-flex items-center justify-end gap-1",
                          isDebit ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {isDebit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          {formatCurrency(Number(entry.amount))}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

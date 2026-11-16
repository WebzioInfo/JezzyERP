import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate, getBusinessLabel } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
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
    case 'PAYMENT_RECEIVED': return { label: 'Payment In', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: TrendingUp };
    case 'PAYMENT_MADE': return { label: 'Payment Out', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: TrendingDown };
    case 'EXPENSE': return { label: 'Expense', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: CircleDollarSign };
    case 'INVOICE': return { label: 'Invoice', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ArrowUpRight };
    case 'PURCHASE': return { label: 'Purchase', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: ArrowDownLeft };
    case 'FOUNDER_CONTRIBUTION': return { label: 'Equity In', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: UserPlus };
    case 'FOUNDER_WITHDRAWAL': return { label: 'Equity Out', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: UserMinus };
    case 'TRANSFER': return { label: 'Transfer', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: ArrowRightLeft };
    default: return { label: 'Entry', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: History };
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
      debitAccount: { select: { id: true, name: true, type: true } },
      creditAccount: { select: { id: true, name: true, type: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Master Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">Chronological double-entry transaction record across all accounts</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        {entries.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No ledger entries recorded yet</p>
            <p className="text-xs text-slate-500 mt-0.5">Transactions will automatically stream here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Date</TableHead>
                <TableHead className="w-32">Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>From (Debit)</TableHead>
                <TableHead>To (Credit)</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry: any) => {
                const badge = getTransactionBadge(entry.transactionType ?? entry.referenceType);
                return (
                  <TableRow key={entry.id} className="group">
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {fmtDate(entry.date)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                        badge.color
                      )}>
                        <badge.icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-semibold text-slate-900 leading-tight">
                        {entry.description || "Ledger Entry"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {getBusinessLabel(entry.referenceType)} {entry.referenceId ? `• #${entry.referenceId.slice(-6)}` : ''}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">
                      {entry.debitAccount?.name || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">
                      {entry.creditAccount?.name || "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(Number(entry.amount))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

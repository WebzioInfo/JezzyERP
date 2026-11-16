import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { 
  TrendingUp, 
  History, 
  ArrowUpRight,
  ShieldCheck,
  Plus
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/ui/core/Table";
import { cn } from "@/utils";

export default async function AdvancesPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const advances = await (db.advance as any).findMany({
    orderBy: { date: "desc" },
  });

  const totalReceived = advances.filter((a: any) => a.type === 'RECEIVED').reduce((sum: number, a: any) => sum + Number(a.amount), 0);
  const totalGiven = advances.filter((a: any) => a.type === 'GIVEN').reduce((sum: number, a: any) => sum + Number(a.amount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advances & Unallocated Funds</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track upfront customer deposits and advance supplier payments</p>
        </div>

        <Link href="/loans/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span>Record Advance</span>
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-emerald-200/80 bg-emerald-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Advances Received</span>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 tabular-nums">
              {formatCurrency(totalReceived)}
            </h3>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Customer deposits pending invoice settlement</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200/80 bg-blue-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-blue-800">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Advances Given</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 tabular-nums">
              {formatCurrency(totalGiven)}
            </h3>
            <p className="text-xs text-blue-700 mt-1 font-medium">Pre-payments to suppliers/vendors</p>
          </CardContent>
        </Card>
      </div>

      {/* Advances Table */}
      <Card>
        <CardContent className="p-0">
          {advances.length === 0 ? (
            <div className="text-center py-16 px-4">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No advance records found</h3>
              <p className="text-xs text-slate-500 mt-1">Advances recorded from payments will be listed here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Date</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-center w-28">Type</TableHead>
                  <TableHead className="text-center w-28">Status</TableHead>
                  <TableHead className="text-right w-36">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advances.map((advance: any) => (
                  <TableRow key={advance.id}>
                    <TableCell className="font-medium text-slate-600 text-xs">
                      {fmtDate(advance.date)}
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-900 text-sm">{advance.partyName}</p>
                      <p className="text-[10px] text-slate-400">ID: #{advance.id.slice(-6)}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        advance.type === 'RECEIVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      )}>
                        {advance.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                        {advance.status === 'ADJUSTED' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{advance.status}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 tabular-nums text-sm">
                      {formatCurrency(Number(advance.amount))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

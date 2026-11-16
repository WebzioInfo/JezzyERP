import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { 
  Plus, 
  Receipt,
  TrendingDown
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

export default async function ExpensesPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const expenses = await (db.expense as any).findMany({
    orderBy: { date: "desc" },
    take: 50,
  });

  const totalExpense = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operating Expenses</h1>
          <p className="text-sm text-slate-500 mt-0.5">Record and monitor operating expenditures and disbursements</p>
        </div>

        <Link href="/expenses/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span>Record Expense</span>
          </Button>
        </Link>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-rose-200/80 bg-rose-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-rose-800 mb-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Recorded Spend</span>
            </div>
            <h2 className="text-2xl font-bold text-rose-900 tabular-nums">
              {formatCurrency(totalExpense)}
            </h2>
            <p className="text-xs text-rose-700 mt-1 font-medium">From {expenses.length} recent transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No expense records found</h3>
              <p className="text-xs text-slate-500 mt-1">Start by recording your first company expense.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-36">Date</TableHead>
                  <TableHead className="w-44">Category</TableHead>
                  <TableHead>Description / Purpose</TableHead>
                  <TableHead className="text-right w-40">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense: any) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium text-slate-600 text-xs">
                      {fmtDate(expense.date)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 text-sm">
                      {expense.description || "Uncategorized Expense"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-rose-600 tabular-nums text-sm">
                      {formatCurrency(Number(expense.amount))}
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

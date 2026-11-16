"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  LifeBuoy,
  Calendar,
  TrendingUp,
  Search,
  Building2,
  Banknote,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  X
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { deleteLoanAction } from "@/features/billing/actions/LoanActions";
import { useToast } from "@/context/ToastContext";
import { LoanRepayButton } from "./LoanRepayButton";
import { cn } from "@/utils";

interface Loan {
  id: string;
  type: "TAKEN" | "GIVEN";
  partyName: string;
  amount: any;
  status: "ACTIVE" | "CLOSED";
  date: string;
  notes?: string | null;
  paymentMethod: "CASH" | "BANK" | "UNKNOWN";
  interestRate?: any;
}

interface LoansListProps {
  loans: Loan[];
  advances: any[];
}

export function LoansList({ loans: initialLoans, advances }: LoansListProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "TAKEN" | "GIVEN">("ALL");
  const [methodFilter, setMethodFilter] = useState<"ALL" | "BANK" | "CASH">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "CLOSED">("ALL");

  // Deletion confirm state per loan ID
  const [deletingLoanId, setDeletingLoanId] = useState<string | null>(null);

  const handleDelete = (loanId: string) => {
    startTransition(async () => {
      const res = await deleteLoanAction(loanId);
      if (res.success) {
        success("Loan and associated ledger transactions deleted successfully.");
        setDeletingLoanId(null);
        router.refresh();
      } else {
        const errMessage = 'error' in res ? (res.error as string) : "Failed to delete loan.";
        error(errMessage);
      }
    });
  };

  // Filter and search logic
  const filteredLoans = initialLoans.filter((loan) => {
    const matchesSearch =
      loan.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.notes && loan.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "ALL" || loan.type === typeFilter;
    const matchesMethod = methodFilter === "ALL" || loan.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === "ALL" || loan.status === statusFilter;

    return matchesSearch && matchesType && matchesMethod && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Search and Filters Toolbar */}
      <div className="col-span-full bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search party or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Classification */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(["ALL", "TAKEN", "GIVEN"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-medium transition-colors",
                  typeFilter === t
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {t === "ALL" ? "All" : t === "TAKEN" ? "Taken" : "Given"}
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(["ALL", "BANK", "CASH"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-medium transition-colors",
                  methodFilter === m
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {m === "ALL" ? "All Methods" : m}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(["ALL", "ACTIVE", "CLOSED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-medium transition-colors",
                  statusFilter === s
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {s === "ALL" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loans Section */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Loans Portfolio</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredLoans.length} entries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLoans.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <LifeBuoy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No matching loans found.</p>
            </div>
          ) : (
            filteredLoans.map((loan) => (
              <Card key={loan.id} className="relative overflow-hidden group">
                <div className={cn(
                  "p-4 text-white flex items-center justify-between",
                  loan.type === 'TAKEN' ? "bg-slate-900" : "bg-primary-600"
                )}>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-75">
                      {loan.type === 'TAKEN' ? 'Liability (Taken)' : 'Asset (Given)'}
                    </span>
                    <h3 className="text-sm font-bold truncate mt-0.5">{loan.partyName}</h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/loans/${loan.id}/edit`}
                      className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white"
                      title="Edit Loan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button 
                      onClick={() => setDeletingLoanId(loan.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/30 transition-colors text-white"
                      title="Delete Loan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Principal</p>
                      <p className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(Number(loan.amount))}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {loan.interestRate && (
                        <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-medium">
                          {Number(loan.interestRate)}% Int
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 text-xs font-medium">
                        {loan.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {loan.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
                      {loan.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {fmtDate(loan.date)}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full font-medium text-[10px]",
                      loan.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                    )}>
                      {loan.status}
                    </span>
                  </div>

                  {loan.status === 'ACTIVE' && (
                    <LoanRepayButton loanId={loan.id} />
                  )}

                  {/* Inline Delete Confirmation */}
                  {deletingLoanId === loan.id && (
                    <div className="absolute inset-0 bg-white/95 p-4 flex flex-col justify-center items-center text-center z-10">
                      <AlertTriangle className="w-6 h-6 text-rose-500 mb-1.5" />
                      <h4 className="text-xs font-semibold text-slate-900 mb-0.5">Delete this loan?</h4>
                      <p className="text-[11px] text-slate-500 max-w-[200px] mb-3">
                        This deletes the loan and associated double-entry ledger records.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeletingLoanId(null)}
                          disabled={isPending}
                          className="h-7 px-3 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(loan.id)}
                          loading={isPending}
                          className="h-7 px-3 text-xs"
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Advances Section */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Recent Advances</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Party</th>
                    <th className="text-center px-3 py-3 font-semibold text-slate-600">Type</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {advances.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-400">No advances recorded.</td>
                    </tr>
                  ) : (
                    advances.map((advance: any) => (
                      <tr key={advance.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 truncate max-w-[130px]">{advance.partyName}</p>
                          <p className="text-[10px] text-slate-400">{fmtDate(advance.date)}</p>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full font-medium text-[10px] border",
                            advance.type === 'RECEIVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {advance.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900 tabular-nums">
                          {formatCurrency(Number(advance.amount))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

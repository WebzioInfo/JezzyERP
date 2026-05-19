"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  History,
  LifeBuoy,
  ArrowRightLeft,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Search and Filters Block (Column span 12 for dashboard-wide toolbar layout) */}
      <div className="col-span-full bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-200/50 flex flex-col xl:flex-row xl:items-center justify-between gap-6 animate-in fade-in">
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search party or reference notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Classification */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["ALL", "TAKEN", "GIVEN"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  typeFilter === t
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                {t === "ALL" ? "All Types" : t === "TAKEN" ? "Taken" : "Given"}
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["ALL", "BANK", "CASH"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  methodFilter === m
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                {m === "ALL" ? "All Methods" : m}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["ALL", "ACTIVE", "CLOSED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  statusFilter === s
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                )}
              >
                {s === "ALL" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loans Section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-3 px-4">
          <LifeBuoy className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Loan Portfolio</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredLoans.length} entries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLoans.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching loans found.</p>
            </div>
          ) : (
            filteredLoans.map((loan) => (
              <Card key={loan.id} className="border-0 shadow-xl ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all bg-white relative">
                {/* Header */}
                <div className={cn(
                  "p-6 text-white transition-colors duration-500 relative",
                  loan.type === 'TAKEN' ? "bg-slate-900 group-hover:bg-slate-800" : "bg-primary-600 group-hover:bg-primary-700"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                      {loan.type === 'TAKEN' ? 'Liability' : 'Asset'}
                    </span>
                    
                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 z-10">
                      <Link 
                        href={`/loans/${loan.id}/edit`}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white/90"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button 
                        onClick={() => setDeletingLoanId(loan.id)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-200 transition-all text-white/90"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight truncate italic pr-12">{loan.partyName}</h3>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Amount and Method */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Principal</p>
                      <h4 className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{formatCurrency(Number(loan.amount))}</h4>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
                      {loan.paymentMethod === 'BANK' ? (
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest">{loan.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Notes (if any) */}
                  {loan.notes && (
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-bold italic leading-relaxed">
                      {loan.notes}
                    </div>
                  )}

                  {/* Footer Stats & Repay */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {fmtDate(loan.date)}
                    </div>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                      loan.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    )}>{loan.status}</span>
                  </div>

                  {/* Repayment button */}
                  {loan.status === 'ACTIVE' && (
                    <LoanRepayButton loanId={loan.id} />
                  )}

                  {/* Inline Delete Confirmation */}
                  {deletingLoanId === loan.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-6 flex flex-col justify-center items-center text-center animate-reveal z-20">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Purge entry?</h4>
                      <p className="text-[10px] text-slate-400 font-bold max-w-[200px] mb-4">
                        This deletes the loan and corresponding ledger double-entry transactions.
                      </p>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeletingLoanId(null)}
                          disabled={isPending}
                          className="h-9 px-4 rounded-xl text-[10px] font-black"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(loan.id)}
                          loading={isPending}
                          className="h-9 px-6 rounded-xl text-[10px] font-black shadow-lg shadow-red-500/20"
                        >
                          {isPending ? "Purging..." : "Confirm Purge"}
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
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center gap-3 px-4">
          <TrendingUp className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Advance Stream</h3>
        </div>
        <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem] bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Party</th>
                    <th className="text-center px-4 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
                    <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {advances.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No advances recorded.</td>
                    </tr>
                  ) : (
                    advances.map((advance: any) => (
                      <tr key={advance.id} className="hover:bg-slate-50 transition-all">
                        <td className="px-6 py-4">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{advance.partyName}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{fmtDate(advance.date)}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                            advance.type === 'RECEIVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                            {advance.type.slice(0, 3)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-slate-900 italic tracking-tighter tabular-nums">
                            {formatCurrency(Number(advance.amount))}
                          </span>
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

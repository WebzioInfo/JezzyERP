"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { recordLoanAction } from "@/features/billing/actions/LoanActions";
import {
  ArrowLeft,
  LifeBuoy,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  Wallet,
  Building2,
  Banknote,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

const LOAN_TYPES = [
  { value: "TAKEN", label: "Loan Taken", icon: TrendingDown, color: "slate", desc: "Liability - Payable to someone" },
  { value: "GIVEN", label: "Loan Given", icon: TrendingUp, color: "primary", desc: "Asset - Receivable from someone" },
];

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "BANK", label: "Bank Transfer", icon: Building2 },
];

export default function NewLoanPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"TAKEN" | "GIVEN">("TAKEN");
  const [selectedMethod, setSelectedMethod] = useState<"CASH" | "BANK">("BANK");

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const data = {
        type: selectedType,
        partyName: formData.get("partyName") as string,
        amount: parseFloat(formData.get("amount") as string),
        paymentMethod: selectedMethod,
        notes: formData.get("notes") as string,
      };

      const res = await recordLoanAction(data);
      if (res.success) {
        router.push("/loans?success=loan_recorded");
        router.refresh();
        return { success: true };
      }
      return { error: res.error };
    },
    null
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/loans"
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest group"
        >
          <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center border border-slate-200 group-hover:bg-slate-50 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Protocol
        </Link>
        <div className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
          Liability/Asset Entry
        </div>
      </div>

      {/* ── Page Title ── */}
      <div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase leading-none">
          New <span className="text-primary-600">Loan Entry</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-widest">
          Record financial obligations or receivables
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-900 uppercase tracking-tight">Entry Error</p>
              <p className="text-sm text-rose-700 mt-1">{state.error}</p>
            </div>
          </div>
        )}

        {/* Loan Type Selector */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Classification</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Choose the nature of this transaction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOAN_TYPES.map((type) => {
              const active = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value as any)}
                  className={cn(
                    "relative flex flex-col items-start gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300 text-left overflow-hidden group",
                    active
                      ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10 scale-[1.02]"
                      : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    active ? "bg-primary-600 text-white shadow-xl shadow-primary-600/30" : "bg-white text-slate-400 border border-slate-100 group-hover:text-slate-600"
                  )}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest block",
                      active ? "text-primary-700" : "text-slate-400"
                    )}>{type.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 block leading-tight">{type.desc}</span>
                  </div>
                  {active && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary-500 animate-in zoom-in" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Party & Amount */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Entity & Value</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Party Name / Source / Recipient</label>
              <div className="relative">
                <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  name="partyName"
                  required
                  placeholder="e.g. HDFC Bank, John Doe, Founder Name"
                  className="w-full h-16 pl-14 pr-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300 uppercase tracking-tight"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Principal Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl italic">₹</span>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full h-20 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-3xl text-3xl font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-400 transition-all tabular-nums placeholder:text-slate-200 italic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Method & Notes */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Transaction Details</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block ml-1">Disbursement / Receipt Method</label>
              <div className="grid grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((method) => {
                  const active = selectedMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value as any)}
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left group",
                        active
                          ? "border-primary-500 bg-primary-50/50 shadow-md shadow-primary-500/5"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        active ? "bg-primary-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 group-hover:text-slate-600"
                      )}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        active ? "text-primary-700" : "text-slate-400"
                      )}>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Internal Reference / Notes (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-5 top-5 w-5 h-5 text-slate-400 pointer-events-none" />
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="e.g. Personal loan for expansion, repayment expected in 6 months..."
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-8 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "w-full h-20 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl overflow-hidden group relative",
            pending
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-primary-600 hover:shadow-primary-500/30 hover:scale-[1.01] active:scale-[0.99]"
          )}
        >
          {pending ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> RECORDING IN LEDGER...</>
          ) : (
            <>
              <span>Initialize Loan Record</span>
              <LifeBuoy className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

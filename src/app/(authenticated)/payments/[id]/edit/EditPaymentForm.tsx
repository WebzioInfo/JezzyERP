"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { updatePaymentAction } from "@/features/billing/actions/billing";
import {
  ArrowLeft, CreditCard, Calendar, Hash,
  Loader2, CheckCircle2, AlertCircle, Users,
  Banknote, Smartphone, Building2, Receipt,
  Sparkles, CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

const PAYMENT_METHODS = [
  { value: "CASH",   label: "Cash",        icon: Banknote },
  { value: "UPI",    label: "UPI",         icon: Smartphone },
  { value: "BANK_TRANSFER",    label: "Bank Transfer",icon: Building2 },
  { value: "CHEQUE", label: "Cheque",      icon: Receipt },
];

export default function EditPaymentForm({ payment }: { payment: any }) {
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState(payment.method);
  const [amount, setAmount] = useState(String(payment.amount));

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const data = {
        amount: parseFloat(formData.get("amount") as string),
        method: formData.get("method") as any,
        reference: formData.get("reference") as string,
        notes: formData.get("notes") as string,
        paidAt: formData.get("paidAt") as string,
      };
      const res = await updatePaymentAction(payment.id, data);
      if (res && "error" in res) return { error: res.error };
      if (res && "success" in res) {
        if (payment.clientId) {
          router.push(`/clients/${payment.clientId}`);
        } else {
          router.push(`/payments`);
        }
        router.refresh();
        return { success: true };
      }
      return prevState;
    },
    null
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <Link
          href={payment.clientId ? `/clients/${payment.clientId}` : "/payments"}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest group"
        >
          <div className="w-10 h-10 glass clay-card flex items-center justify-center rounded-2xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border-white/50">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back
        </Link>
        <div className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border bg-primary-50 text-primary-700 border-primary-200">
          Edit Payment
        </div>
      </div>

      {/* ── Page Title ── */}
      <div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase leading-none">
          Edit <span className="text-primary-600">Collection</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-widest">
          Updating existing payment record
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── LEFT: Form ── */}
        <div className="lg:col-span-3 space-y-6">
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

          <form action={formAction} className="space-y-6">
            {/* Client Field (Read-only) */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-600" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Client</p>
              </div>
              <div className="h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{payment.client?.name || "N/A"}</span>
                <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">Read Only</span>
              </div>
            </div>

            {/* Amount & Date */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Payment Details</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Amount Received (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">₹</span>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-16 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 tabular-nums focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Payment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    name="paidAt"
                    required
                    defaultValue={new Date(payment.paidAt).toISOString().split("T")[0]}
                    className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-violet-600" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Payment Method</p>
              </div>

              <input type="hidden" name="method" value={selectedMethod} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => {
                  const active = selectedMethod === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedMethod(value)}
                      className={cn(
                        "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-300",
                        active
                          ? `border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10 scale-[1.02]`
                          : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        active ? "bg-primary-600 text-white shadow-md shadow-primary-600/30" : "bg-white text-slate-400 border border-slate-100"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        active ? "text-primary-700" : "text-slate-400"
                      )}>{label}</span>
                      {active && <CheckCircle2 className="w-3 h-3 text-primary-500" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Reference / UTR / Cheque No. <span className="text-slate-300">(Optional)</span></label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="reference"
                    defaultValue={payment.reference || ""}
                    className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-6 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Internal Notes <span className="text-slate-300">(Optional)</span></label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={payment.notes || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending || !amount || parseFloat(amount) <= 0}
              className={cn(
                "w-full h-16 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl",
                pending || !amount || parseFloat(amount) <= 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-slate-900 text-white hover:bg-primary-600 hover:shadow-primary-500/20 hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {pending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Update Payment</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

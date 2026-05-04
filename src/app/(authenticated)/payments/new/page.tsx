"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useActionState, Suspense } from "react";
import { recordPaymentAction } from "@/features/billing/actions/billing";
import {
  ArrowLeft, CreditCard, Calendar, Hash, FileText,
  Loader2, CheckCircle2, AlertCircle, Info, Users,
  TrendingUp, Banknote, Smartphone, Building2, Receipt,
  Sparkles, ShieldCheck, CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { cn } from "@/utils";

const PAYMENT_METHODS = [
  { value: "CASH",   label: "Cash",        icon: Banknote,      color: "emerald" },
  { value: "UPI",    label: "UPI",         icon: Smartphone,    color: "violet" },
  { value: "BANK_TRANSFER",    label: "Bank Transfer",icon: Building2,    color: "blue" },
  { value: "CHEQUE", label: "Cheque",      icon: Receipt,       color: "amber" },
];


function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get("invoiceId");
  const initialClientId = searchParams.get("clientId");

  const [invoice, setInvoice] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || "");
  const [selectedMethod, setSelectedMethod] = useState("BANK_TRANSFER");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (invoiceId) {
          const res = await fetch(`/api/invoices/${invoiceId}`);
          if (res.ok) {
            const data = await res.json();
            setInvoice(data);
            setSelectedClientId(data.clientId);
            const paid = data.allocations?.reduce((s: number, a: any) => s + Number(a.amount), 0) || 0;
            setAmount(String(Math.max(0, Number(data.grandTotal) - paid)));
          }
        }
        const cRes = await fetch("/api/clients");
        if (cRes.ok) setClients(await cRes.json());
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [invoiceId]);

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const data = {
        clientId: (formData.get("clientId") as string) || selectedClientId,
        invoiceId: invoiceId || null,
        amount: parseFloat(formData.get("amount") as string),
        method: formData.get("method") as string,
        reference: formData.get("reference") as string,
        notes: formData.get("notes") as string,
        paidAt: formData.get("paidAt") as string,
      };
      const res = await recordPaymentAction(data as any);
      if (res && "error" in res) return { error: res.error };
      if (res && "success" in res) {
        router.push(`/payments?success=payment_recorded`);
        router.refresh();
        return { success: true };
      }
      return prevState;
    },
    null
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-700 uppercase tracking-widest">Loading</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Pre-fetching financial data...</p>
        </div>
      </div>
    );
  }

  const amountPaid = invoice?.allocations?.reduce((s: number, a: any) => s + Number(a.amount), 0) || 0;
  const grandTotal = invoice ? Number(invoice.grandTotal) : 0;
  const balanceDue = grandTotal - amountPaid;
  const enteredAmount = parseFloat(amount) || 0;
  const remainingAfter = balanceDue - enteredAmount;
  const willBeFullyPaid = enteredAmount >= balanceDue && balanceDue > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <Link
          href={invoiceId ? `/invoices/${invoiceId}` : "/payments"}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest group"
        >
          <div className="w-10 h-10 glass clay-card flex items-center justify-center rounded-2xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border-white/50">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          {invoiceId ? `Invoice ${invoice?.invoiceNo}` : "Payments"}
        </Link>
        <div className={cn(
          "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border",
          invoiceId
            ? "bg-primary-50 text-primary-700 border-primary-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        )}>
          {invoiceId ? "Invoice Payment" : "Direct Advance"}
        </div>
      </div>

      {/* ── Page Title ── */}
      <div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase leading-none">
          Record <span className="text-primary-600">Collection</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-widest">
          {invoiceId ? `Applying payment to invoice ${invoice?.invoiceNo}` : "Unallocated advance — linked on next invoice"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── LEFT: Form (3 cols) ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Error Banner */}
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

            {/* Client Field */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-600" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Receiving From</p>
              </div>

              {invoiceId ? (
                <div className="h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{invoice?.client?.name}</span>
                  <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">Locked to Invoice</span>
                  <input type="hidden" name="clientId" value={invoice?.clientId} />
                </div>
              ) : (
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    name="clientId"
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                  >
                    <option value="">Select a Client...</option>
                    {clients.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
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
                    placeholder="0.00"
                    className="w-full h-16 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 tabular-nums focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                  />
                  {invoiceId && balanceDue > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(String(balanceDue))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      Full Balance
                    </button>
                  )}
                </div>

                {/* Live Preview */}
                {invoiceId && enteredAmount > 0 && (
                  <div className={cn(
                    "mt-3 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wide transition-all",
                    willBeFullyPaid
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border border-amber-200 text-amber-700"
                  )}>
                    {willBeFullyPaid ? (
                      <><CheckCircle2 className="w-4 h-4 shrink-0" /> Invoice will be marked as <span className="font-black">PAID</span></>
                    ) : (
                      <><Info className="w-4 h-4 shrink-0" /> {formatCurrency(Math.max(0, remainingAfter))} will remain — marked as <span className="font-black">PARTIAL</span></>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Payment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    name="paidAt"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
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
                {PAYMENT_METHODS.map(({ value, label, icon: Icon, color }) => {
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
                    placeholder={selectedMethod === "UPI" ? "e.g. UPI-1234567890" : selectedMethod === "CHEQUE" ? "e.g. CHQ-00128" : "e.g. NEFT-XXXX"}
                    className="w-full h-14 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
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
                placeholder="e.g. Partial payment for October supplies..."
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
                <><Loader2 className="w-5 h-5 animate-spin" /> Recording Collection...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Confirm Payment</>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Context (2 cols) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Invoice / Advance Card */}
          {invoiceId ? (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <FileText className="w-40 h-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Linked Invoice</p>

              <p className="text-4xl font-black italic tracking-tighter">{invoice?.invoiceNo}</p>
              <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-tight">{invoice?.client?.name}</p>

              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Billed</span>
                  <span className="text-sm font-black tabular-nums">{formatCurrency(grandTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Already Paid</span>
                  <span className="text-sm font-black tabular-nums text-emerald-400">{formatCurrency(amountPaid)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Balance Due</span>
                  <span className="text-xl font-black tabular-nums italic text-amber-400">{formatCurrency(balanceDue)}</span>
                </div>
              </div>

              {enteredAmount > 0 && (
                <div className={cn(
                  "mt-4 p-4 rounded-2xl border transition-all",
                  willBeFullyPaid
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-amber-500/10 border-amber-500/20"
                )}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">After This Payment</p>
                  <p className={cn("text-2xl font-black italic tabular-nums tracking-tighter", willBeFullyPaid ? "text-emerald-400" : "text-amber-400")}>
                    {willBeFullyPaid ? "₹ 0.00" : formatCurrency(Math.max(0, remainingAfter))}
                  </p>
                  <p className="text-[10px] font-bold mt-1 uppercase tracking-widest opacity-50">
                    {willBeFullyPaid ? "Invoice fully settled" : "Remaining balance"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <TrendingUp className="w-40 h-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mb-4">Direct Collection</p>
              <p className="text-3xl font-black italic tracking-tighter">On-Account Advance</p>
              <p className="text-sm text-emerald-100 mt-3 leading-relaxed">
                This payment will be stored as an unallocated credit and can be applied to future invoices.
              </p>
            </div>
          )}

          {/* How it works card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">How It Works</p>
            </div>
            <div className="space-y-3">
              {[
                { icon: CheckCircle2, color: "text-emerald-500", text: "Full payment → Invoice marked PAID" },
                { icon: TrendingUp, color: "text-amber-500", text: "Partial payment → Invoice marked PARTIAL" },
                { icon: ShieldCheck, color: "text-primary-500", text: "All transactions recorded in ledger" },
              ].map(({ icon: Icon, color, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", color)} />
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Payment Form...</p>
      </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}

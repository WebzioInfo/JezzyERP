"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useActionState, Suspense } from "react";
import { recordPaymentAction } from "@/features/billing/actions/billing";
import {
  ArrowLeft, CreditCard, Calendar, Hash, FileText,
  Loader2, CheckCircle2, AlertCircle, Info, Users,
  TrendingUp, Banknote, Smartphone, Building2, Receipt,
  ShieldCheck, CircleDollarSign
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";

const PAYMENT_METHODS = [
  { value: "CASH",          label: "Cash",          icon: Banknote },
  { value: "UPI",           label: "UPI",           icon: Smartphone },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
  { value: "CHEQUE",        label: "Cheque",        icon: Receipt },
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
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading payment data...</p>
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={invoiceId ? `/invoices/${invoiceId}` : "/payments"}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {invoiceId ? `Invoice ${invoice?.invoiceNo}` : "Payments"}</span>
        </Link>
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
          invoiceId
            ? "bg-primary-50 text-primary-700 border-primary-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        )}>
          {invoiceId ? "Invoice Payment" : "Direct Advance"}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Record Payment</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {invoiceId ? `Applying payment to invoice ${invoice?.invoiceNo}` : "Unallocated advance payment — linkable to upcoming invoices"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-4">
          {state?.error && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-rose-900">Submission Error</p>
                <p className="text-xs text-rose-700 mt-0.5">{state.error}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Client Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Client Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {invoiceId ? (
                  <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">{invoice?.client?.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Locked to Invoice</span>
                    <input type="hidden" name="clientId" value={invoice?.clientId} />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1.5">Select Client</label>
                    <select
                      name="clientId"
                      required
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="">Select a Client...</option>
                      {clients.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                  <CircleDollarSign className="w-4 h-4 text-slate-500" />
                  <span>Amount & Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Amount Received (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-10 pl-8 pr-28 bg-white border border-slate-300 rounded-lg text-base font-semibold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                    {invoiceId && balanceDue > 0 && (
                      <button
                        type="button"
                        onClick={() => setAmount(String(balanceDue))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors"
                      >
                        Full Balance
                      </button>
                    )}
                  </div>

                  {invoiceId && enteredAmount > 0 && (
                    <div className={cn(
                      "mt-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium border",
                      willBeFullyPaid
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    )}>
                      {willBeFullyPaid ? (
                        <><CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> Invoice will be fully settled as <span className="font-semibold">PAID</span></>
                      ) : (
                        <><Info className="w-4 h-4 shrink-0 text-amber-600" /> {formatCurrency(Math.max(0, remainingAfter))} remaining balance (<span className="font-semibold">PARTIAL</span>)</>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">Payment Date</label>
                  <input
                    type="date"
                    name="paidAt"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Method Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Payment Method & Reference</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <input type="hidden" name="method" value={selectedMethod} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => {
                    const active = selectedMethod === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedMethod(value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all",
                          active
                            ? "border-primary-600 bg-primary-50/60 text-primary-900 font-semibold"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", active ? "text-primary-600" : "text-slate-400")} />
                        <span className="text-xs">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Reference / Transaction ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="reference"
                    placeholder={selectedMethod === "UPI" ? "e.g. UPI-1234567890" : selectedMethod === "CHEQUE" ? "e.g. CHQ-00128" : "e.g. NEFT-XXXX"}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Internal Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="e.g. Partial settlement for invoice line items..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={pending || !amount || parseFloat(amount) <= 0}
              className="w-full h-10 text-sm font-semibold"
            >
              {pending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording Payment...</>
              ) : (
                "Confirm & Record Payment"
              )}
            </Button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-2 space-y-4">
          {invoiceId ? (
            <Card className="bg-slate-900 text-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Linked Invoice</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <p className="text-xl font-bold tracking-tight">{invoice?.invoiceNo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{invoice?.client?.name}</p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Total Billed</span>
                    <span className="font-semibold tabular-nums text-white">{formatCurrency(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Already Paid</span>
                    <span className="font-semibold tabular-nums text-emerald-400">{formatCurrency(amountPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-white">
                    <span className="font-medium">Balance Due</span>
                    <span className="text-base font-bold tabular-nums text-amber-400">{formatCurrency(balanceDue)}</span>
                  </div>
                </div>

                {enteredAmount > 0 && (
                  <div className={cn(
                    "p-3 rounded-lg text-xs border",
                    willBeFullyPaid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  )}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">After This Payment</p>
                    <p className="text-lg font-bold tabular-nums mt-0.5">
                      {willBeFullyPaid ? "₹ 0.00" : formatCurrency(Math.max(0, remainingAfter))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-emerald-700 text-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Direct Advance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-emerald-100 leading-relaxed">
                This advance payment will be stored as an unallocated credit and can be applied to future invoices generated for this client.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>Accounting Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-xs text-slate-600">
              <p>• Updates client ledger and accounts receivable balance.</p>
              <p>• Generates an immutable transaction entry in the general ledger.</p>
              <p>• Automatically updates invoice status to Paid or Partial.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading Payment Form...</p>
      </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}

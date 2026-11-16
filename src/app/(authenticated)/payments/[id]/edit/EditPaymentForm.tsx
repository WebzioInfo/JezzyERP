"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { updatePaymentAction } from "@/features/billing/actions/billing";
import {
  ArrowLeft, CreditCard, Calendar, Hash,
  Loader2, AlertCircle, Users,
  Banknote, Smartphone, Building2, Receipt,
  CircleDollarSign, Save
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";

const PAYMENT_METHODS = [
  { value: "CASH",          label: "Cash",          icon: Banknote },
  { value: "UPI",           label: "UPI",           icon: Smartphone },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
  { value: "CHEQUE",        label: "Cheque",        icon: Receipt },
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
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={payment.clientId ? `/clients/${payment.clientId}` : "/payments"}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {payment.clientId ? "Client" : "Payments"}</span>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-primary-50 text-primary-700 border-primary-200">
          Payment #{payment.id.slice(-6)}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Payment Record
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Update payment amount, date, method, or internal notes
        </p>
      </div>

      {state?.error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Client (Read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Counterparty Client</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">{payment.client?.name || "N/A"}</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Read Only</span>
            </div>
          </CardContent>
        </Card>

        {/* Amount & Date Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <CircleDollarSign className="w-4 h-4 text-slate-500" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label htmlFor="amount">Amount Received (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                <Input
                  id="amount"
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-base font-semibold tabular-nums"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paidAt">Payment Date</Label>
              <Input
                id="paidAt"
                type="date"
                name="paidAt"
                required
                defaultValue={new Date(payment.paidAt).toISOString().split("T")[0]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Method & Notes Card */}
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
              <Label htmlFor="reference">
                Reference / Transaction ID <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Input
                id="reference"
                type="text"
                name="reference"
                defaultValue={payment.reference || ""}
                placeholder="e.g. UTR-1234567890"
              />
            </div>

            <div>
              <Label htmlFor="notes">
                Internal Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                defaultValue={payment.notes || ""}
                placeholder="e.g. Settlement notes..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={pending || !amount || parseFloat(amount) <= 0}
          className="w-full h-10 text-sm font-semibold"
        >
          {pending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Payment Updates</>
          )}
        </Button>
      </form>
    </div>
  );
}
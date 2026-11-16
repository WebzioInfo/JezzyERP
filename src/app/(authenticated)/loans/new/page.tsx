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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";

const LOAN_TYPES = [
  { value: "TAKEN", label: "Loan Taken", icon: TrendingDown, desc: "Liability - Payable to third party" },
  { value: "GIVEN", label: "Loan Given", icon: TrendingUp, desc: "Asset - Receivable from borrower" },
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
        date: formData.get("date") as string,
        interestRate: formData.get("interestRate") ? parseFloat(formData.get("interestRate") as string) : undefined,
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
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/loans"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Loans & Advances</span>
        </Link>
        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
          Capital Entry
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Loan Record</h1>
        <p className="text-sm text-slate-500 mt-0.5">Record capital obligations, liabilities, or receivables</p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Loan Type Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <LifeBuoy className="w-4 h-4 text-slate-500" />
              <span>Transaction Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LOAN_TYPES.map((type) => {
                const active = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value as any)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all",
                      active
                        ? "border-primary-600 bg-primary-50/50 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                      active ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      <type.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={cn(
                        "text-xs font-semibold block",
                        active ? "text-primary-900" : "text-slate-800"
                      )}>{type.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{type.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Party & Amount Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Party & Principal Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label htmlFor="partyName">Party Name / Counterparty</Label>
              <Input
                id="partyName"
                name="partyName"
                required
                placeholder="e.g. HDFC Bank, John Doe, Founder Name"
              />
            </div>

            <div>
              <Label htmlFor="amount">Principal Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                <Input
                  id="amount"
                  type="number"
                  name="amount"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="pl-8 text-base font-semibold tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Transaction Date</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (%) <span className="text-slate-400 font-normal">(Optional)</span></Label>
                <Input
                  id="interestRate"
                  type="number"
                  name="interestRate"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method & Notes Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <Wallet className="w-4 h-4 text-slate-500" />
              <span>Disbursement & Reference</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label>Disbursement / Receipt Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const active = selectedMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value as any)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all",
                        active
                          ? "border-primary-600 bg-primary-50/50 text-primary-900 font-semibold"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <method.icon className={cn("w-4 h-4", active ? "text-primary-600" : "text-slate-400")} />
                      <span className="text-xs">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes / Reference <span className="text-slate-400 font-normal">(Optional)</span></Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="e.g. Terms, repayment schedule, purpose..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={pending}
          className="w-full h-10 text-sm font-semibold"
        >
          {pending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording in Ledger...</>
          ) : (
            "Confirm & Record Loan"
          )}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { updateLoanAction } from "@/features/billing/actions/LoanActions";
import {
  ArrowLeft,
  LifeBuoy,
  Loader2,
  AlertCircle,
  Users,
  Wallet,
  Building2,
  Banknote,
  FileText,
  TrendingDown,
  TrendingUp,
  Save,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "BANK", label: "Bank Transfer", icon: Building2 },
];

interface EditLoanClientProps {
  loan: any;
  initialPaymentMethod: "CASH" | "BANK";
}

export function EditLoanClient({ loan, initialPaymentMethod }: EditLoanClientProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"CASH" | "BANK">(initialPaymentMethod);

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const data = {
        partyName: formData.get("partyName") as string,
        amount: parseFloat(formData.get("amount") as string),
        paymentMethod: selectedMethod,
        notes: formData.get("notes") as string,
        date: formData.get("date") as string,
        interestRate: formData.get("interestRate") ? parseFloat(formData.get("interestRate") as string) : undefined,
      };

      const res = await updateLoanAction(loan.id, data);
      if (res.success) {
        router.push("/loans?success=loan_updated");
        router.refresh();
        return { success: true };
      }
      return { error: res.error };
    },
    null
  );

  const isTaken = loan.type === "TAKEN";
  const TypeIcon = isTaken ? TrendingDown : TrendingUp;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/loans"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Loans</span>
        </Link>
        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
          Loan #{loan.id.slice(-6)}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Loan Record
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Update counterparty, principal amount, or repayment details
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Loan Type Display (Read-Only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <LifeBuoy className="w-4 h-4 text-slate-500" />
              <span>Classification (Fixed)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary-600 text-white flex items-center justify-center shrink-0">
                <TypeIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {isTaken ? "Loan Taken (Liability)" : "Loan Given (Asset)"}
                </span>
                <span className="text-xs text-slate-500 block">
                  {isTaken ? "Liability payable to third party" : "Asset receivable from counterparty"}
                </span>
              </div>
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
              <Label htmlFor="partyName">Party Name</Label>
              <Input
                id="partyName"
                name="partyName"
                defaultValue={loan.partyName}
                required
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
                  defaultValue={Number(loan.amount)}
                  required
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
                  defaultValue={loan.date ? new Date(loan.date).toISOString().split("T")[0] : ""}
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
                  defaultValue={loan.interestRate ? Number(loan.interestRate) : ""}
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
              <span>Payment Method & Notes</span>
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
                defaultValue={loan.notes || ""}
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
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Loan Updates</>
          )}
        </Button>
      </form>
    </div>
  );
}
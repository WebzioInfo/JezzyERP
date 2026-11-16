'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { Button } from "@/ui/core/Button";
import {
  ArrowRightLeft,
  Building2,
  Wallet,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/financials";
import { recordInternalTransfer } from "@/features/billing/actions/FinanceActions";
import { useRouter } from "next/navigation";
import { Label } from "@/ui/core/Label";

export function TransferForm({ accounts }: { accounts: any[] }) {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [warning, setWarning] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, isConfirmed = false) => {
    e?.preventDefault();
    if (!sourceId || !targetId || !amount) return;

    setLoading(true);
    setError(null);
    setWarning(null);

    const res = await recordInternalTransfer({
      sourceAccountId: sourceId,
      targetAccountId: targetId,
      amount: parseFloat(amount),
      description,
      date: new Date(),
      confirmed: isConfirmed
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/transactions');
      }, 1500);
    } else {
      if (res.warning) {
        setWarning(res.warning);
      } else {
        setError(res.error || "Transfer failed");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Transfer Successful</h2>
        <p className="text-slate-500 text-xs mt-1">The double-entry ledger records have been generated. Redirecting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Account */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Source Account (From)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSourceId(acc.id)}
                className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between ${
                  sourceId === acc.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${sourceId === acc.id ? "bg-white/10" : "bg-slate-100 text-slate-600"}`}>
                    {acc.type === 'BANK' ? <Building2 className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${sourceId === acc.id ? "text-white" : "text-slate-900"}`}>{acc.name}</p>
                    <p className={`text-xs tabular-nums ${sourceId === acc.id ? "text-slate-300" : "text-slate-500"}`}>
                      {formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Target Account */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Destination Account (To)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {accounts.filter(a => a.id !== sourceId).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setTargetId(acc.id)}
                className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between ${
                  targetId === acc.id
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${targetId === acc.id ? "bg-white/10" : "bg-slate-100 text-slate-600"}`}>
                    {acc.type === 'BANK' ? <Building2 className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${targetId === acc.id ? "text-white" : "text-slate-900"}`}>{acc.name}</p>
                    <p className={`text-xs tabular-nums ${targetId === acc.id ? "text-emerald-100" : "text-slate-500"}`}>
                      {formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transfer Parameters Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <ArrowRightLeft className="w-4 h-4 text-slate-500" />
            <span>Transfer Amount & Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transferAmount">Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                <Input
                  id="transferAmount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-base font-semibold tabular-nums"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="transferDesc">Description / Remarks</Label>
              <Input
                id="transferDesc"
                placeholder="e.g. Cash withdrawal, petty cash top-up..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {warning && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{warning}</span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSubmit(undefined, true)}
                className="w-full text-xs"
              >
                Confirm & Proceed with Transfer
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!warning && (
            <Button
              type="submit"
              disabled={!sourceId || !targetId || !amount || loading}
              className="w-full h-10 text-sm font-semibold"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Transferring Funds...</>
              ) : (
                "Authorize Internal Transfer"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

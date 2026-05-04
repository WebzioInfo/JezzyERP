'use client';

import { useState } from "react";
import { Card, CardContent } from "@/ui/core/Card";
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
import { motion, AnimatePresence } from "framer-motion";
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

  const sourceAccount = accounts.find(a => a.id === sourceId);
  const targetAccount = accounts.find(a => a.id === targetId);

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
      }, 2000);
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Transfer Successful!</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">The ledger has been updated</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
        {/* Source Account */}
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">From Account</Label>
          <div className="grid grid-cols-1 gap-3">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSourceId(acc.id)}
                className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center justify-between ${sourceId === acc.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]"
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${sourceId === acc.id ? "bg-white/10" : "bg-slate-50 text-slate-400"}`}>
                    {acc.type === 'BANK' ? <Building2 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase tracking-tight ${sourceId === acc.id ? "text-white" : "text-slate-900"}`}>{acc.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${sourceId === acc.id ? "text-slate-400" : "text-slate-400"}`}>
                      {formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Connector */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-slate-100 rounded-full items-center justify-center z-10 shadow-sm">
          <ArrowRightLeft className="w-5 h-5 text-slate-400" />
        </div>

        {/* Target Account */}
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">To Account</Label>
          <div className="grid grid-cols-1 gap-3">
            {accounts.filter(a => a.id !== sourceId).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setTargetId(acc.id)}
                className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center justify-between ${targetId === acc.id
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xl scale-[1.02]"
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${targetId === acc.id ? "bg-white/10" : "bg-slate-50 text-slate-400"}`}>
                    {acc.type === 'BANK' ? <Building2 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase tracking-tight ${targetId === acc.id ? "text-white" : "text-slate-900"}`}>{acc.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${targetId === acc.id ? "text-emerald-100/60" : "text-slate-400"}`}>
                      {formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-2xl ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Transfer Amount (INR)</Label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-20 pl-14 text-3xl font-black rounded-3xl border-slate-100 bg-slate-50 focus:ring-slate-900 focus:border-slate-900"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description / Remarks</Label>
              <Input
                placeholder="Internal fund transfer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-20 px-8 text-sm font-bold rounded-3xl border-slate-100 bg-slate-50 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          {warning && (
            <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 space-y-4">
              <div className="flex items-center gap-3 text-amber-600 text-xs font-black uppercase tracking-tight">
                <AlertCircle className="w-5 h-5" />
                {warning}
              </div>
              <Button
                type="button"
                onClick={() => handleSubmit(undefined, true)}
                className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Confirm & Proceed with Transfer
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 text-xs font-bold uppercase tracking-tight">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!warning && (
            <Button
              disabled={!sourceId || !targetId || !amount || loading}
              className="w-full h-20 bg-slate-900 hover:bg-emerald-600 text-white rounded-3xl text-lg font-black uppercase italic tracking-widest transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize Transfer"}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

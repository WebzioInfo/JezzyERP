"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import { cn } from "@/utils";

interface Account {
    id: string;
    name: string;
    type: string;
}

export function FounderForm({ founderAccount, liquidAccounts }: { founderAccount: Account, liquidAccounts: Account[] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [opType, setOpType] = useState<'CONTRIBUTION' | 'DRAWAL'>('CONTRIBUTION');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            amount: Number(formData.get("amount")),
            type: opType,
            targetAccountId: formData.get("targetAccountId"),
            founderAccountId: founderAccount.id,
            description: formData.get("description"),
        };

        try {
            const endpoint = opType === 'CONTRIBUTION' ? '/api/founder/contribution' : '/api/founder/drawal';
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to record transaction");

            setSuccess(true);
            setTimeout(() => router.push(`/accounts/${founderAccount.id}`), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto border-0 shadow-2xl ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
            <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">Founder Protocol</h2>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Equity Movement Tracker</p>
                    </div>
                </div>
            </div>

            <CardContent className="p-10">
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-10">
                    <button 
                        onClick={() => setOpType('CONTRIBUTION')}
                        className={cn(
                            "flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            opType === 'CONTRIBUTION' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Add Capital (Contribution)
                    </button>
                    <button 
                        onClick={() => setOpType('DRAWAL')}
                        className={cn(
                            "flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            opType === 'DRAWAL' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <TrendingDown className="w-3.5 h-3.5" />
                        Withdraw (Drawal)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-shake">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 animate-bounce">
                            <CheckCircle2 className="w-5 h-5" />
                            <p className="text-xs font-bold uppercase tracking-tight">Transaction recorded successfully!</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Amount (₹)</Label>
                        <Input 
                            name="amount" 
                            type="number" 
                            step="0.01" 
                            required 
                            className="h-14 rounded-2xl text-lg font-black italic tracking-tight border-slate-200 focus:ring-primary-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {opType === 'CONTRIBUTION' ? 'Deposited To' : 'Withdrawn From'} (Liquid Account)
                        </Label>
                        <select 
                            name="targetAccountId" 
                            required 
                            className="w-full h-14 px-4 rounded-2xl border border-slate-200 text-sm font-bold bg-white focus:ring-primary-500 focus:border-primary-500 transition-all outline-hidden appearance-none"
                        >
                            <option value="">Select Account</option>
                            {liquidAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Memo</Label>
                        <Input 
                            name="description" 
                            placeholder={opType === 'CONTRIBUTION' ? "Capital infusion for expansion" : "Personal drawings"} 
                            className="h-14 rounded-2xl border-slate-200 font-bold"
                        />
                    </div>

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className={cn(
                                "w-full h-16 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all gap-3",
                                opType === 'CONTRIBUTION' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                            )}
                        >
                            {loading ? "Processing..." : `Record ${opType === 'CONTRIBUTION' ? 'Contribution' : 'Drawal'}`}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

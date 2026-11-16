"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Loader2
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
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900">Founder Equity Movement</CardTitle>
                        <p className="text-xs text-slate-500 mt-0.5">Record owner capital contributions or drawings</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200">
                    <button 
                        type="button"
                        onClick={() => setOpType('CONTRIBUTION')}
                        className={cn(
                            "flex-1 h-9 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2",
                            opType === 'CONTRIBUTION' ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Add Capital (Contribution)
                    </button>
                    <button 
                        type="button"
                        onClick={() => setOpType('DRAWAL')}
                        className={cn(
                            "flex-1 h-9 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2",
                            opType === 'DRAWAL' ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        <TrendingDown className="w-4 h-4" />
                        Withdraw (Drawal)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Equity transaction recorded successfully! Redirecting...</span>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="amount">Transaction Amount (₹)</Label>
                        <Input 
                            id="amount"
                            name="amount" 
                            type="number" 
                            step="0.01" 
                            required 
                            className="text-base font-semibold tabular-nums"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <Label htmlFor="targetAccountId">
                            {opType === 'CONTRIBUTION' ? 'Deposited To' : 'Withdrawn From'} (Liquid Account)
                        </Label>
                        <select 
                            id="targetAccountId"
                            name="targetAccountId" 
                            required 
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        >
                            <option value="">Select Account</option>
                            {liquidAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="description">Description / Memo</Label>
                        <Input 
                            id="description"
                            name="description" 
                            placeholder={opType === 'CONTRIBUTION' ? "Capital infusion for inventory expansion" : "Personal drawings for month"} 
                        />
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className={cn(
                                "w-full h-10 text-sm font-semibold",
                                opType === 'CONTRIBUTION' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
                            )}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording Transaction...</>
                            ) : (
                                `Confirm & Record ${opType === 'CONTRIBUTION' ? 'Capital Contribution' : 'Drawal'}`
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

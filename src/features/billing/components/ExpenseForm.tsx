"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";
import { 
  Receipt, 
  Wallet, 
  Building2, 
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { recordExpenseAction } from "@/features/billing/actions/FinanceActions";

interface Account {
    id: string;
    name: string;
    type: string;
}

export function ExpenseForm({ accounts }: { accounts: Account[] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [warning, setWarning] = useState<string | null>(null);

    const handleSubmit = async (e?: React.FormEvent, isConfirmed = false) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);
        setWarning(null);

        const form = e?.currentTarget as HTMLFormElement;
        const formData = e ? new FormData(form) : null;
        
        const data = {
            amount: Number(formData?.get("amount") || (document.getElementsByName("amount")[0] as any).value),
            category: (formData?.get("category") || (document.getElementsByName("category")[0] as any).value) as string,
            sourceAccountId: (formData?.get("sourceAccountId") || (document.getElementsByName("sourceAccountId")[0] as any).value) as string,
            description: (formData?.get("description") || (document.getElementsByName("description")[0] as any).value) as string,
            date: new Date(formData?.get("date") as string || (document.getElementsByName("date")[0] as any).value || new Date()),
            confirmed: isConfirmed
        };

        try {
            const res = await recordExpenseAction(data);

            if (!res.success) {
                if (res.warning) {
                    setWarning(res.warning);
                } else {
                    throw new Error(res.error || "Failed to record expense");
                }
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/expenses"), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "Salary / Wages",
        "Rent",
        "Office Supplies",
        "Utilities (Electricity/Water)",
        "Marketing / Ads",
        "Travel / Fuel",
        "Taxes / Fees",
        "Other"
    ];

    return (
        <Card className="max-w-2xl mx-auto border-0 shadow-2xl ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden">
            <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Receipt className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">Record Expense</h2>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Operational Outflow Entry</p>
                    </div>
                </div>
            </div>

            <CardContent className="p-10">
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
                            <p className="text-xs font-bold uppercase tracking-tight">Expense recorded successfully!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount (₹)</Label>
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
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Category</Label>
                            <select 
                                name="category" 
                                required 
                                className="w-full h-14 px-4 rounded-2xl border border-slate-200 text-sm font-bold bg-white focus:ring-primary-500 focus:border-primary-500 transition-all outline-hidden appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid Via (Source Account)</Label>
                        <select 
                            name="sourceAccountId" 
                            required 
                            className="w-full h-14 px-4 rounded-2xl border border-slate-200 text-sm font-bold bg-white focus:ring-primary-500 focus:border-primary-500 transition-all outline-hidden appearance-none"
                        >
                            <option value="">Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Notes</Label>
                        <Input 
                            name="description" 
                            placeholder="e.g. Office rent for May 2026" 
                            className="h-14 rounded-2xl border-slate-200 font-bold"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Date</Label>
                        <Input 
                            name="date" 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                            className="h-14 rounded-2xl border-slate-200 font-bold"
                        />
                    </div>

                    {warning && (
                        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 space-y-4">
                            <div className="flex items-center gap-3 text-amber-600 text-xs font-black uppercase tracking-tight">
                                <AlertCircle className="w-5 h-5" />
                                {warning}
                            </div>
                            <Button 
                                type="button"
                                onClick={() => handleSubmit(undefined, true)}
                                className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Confirm & Proceed
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
                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-primary-600 transition-all gap-3"
                            >
                                {loading ? "Processing..." : "Confirm & Record Expense"}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Label } from "@/ui/core/Label";
import { 
  Receipt, 
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
        <Card>
            <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-rose-600" />
                    <span>Expense Details</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            <span>Expense recorded successfully! Redirecting...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input 
                                id="amount"
                                name="amount" 
                                type="number" 
                                step="0.01" 
                                required 
                                placeholder="0.00"
                                className="text-base font-semibold tabular-nums"
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Expense Category</Label>
                            <select 
                                id="category"
                                name="category" 
                                required 
                                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="sourceAccountId">Paid Via (Source Account)</Label>
                        <select 
                            id="sourceAccountId"
                            name="sourceAccountId" 
                            required 
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        >
                            <option value="">Select Source Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="description">Description / Purpose</Label>
                        <Input 
                            id="description"
                            name="description" 
                            placeholder="e.g. Office rent for May 2026" 
                        />
                    </div>

                    <div>
                        <Label htmlFor="date">Transaction Date</Label>
                        <Input 
                            id="date"
                            name="date" 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                        />
                    </div>

                    {warning && (
                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
                            <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>{warning}</span>
                            </div>
                            <Button 
                                type="button"
                                variant="secondary"
                                onClick={() => handleSubmit(undefined, true)}
                                className="w-full"
                            >
                                Confirm & Proceed
                            </Button>
                        </div>
                    )}

                    {!warning && (
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording Expense...</>
                                ) : (
                                    "Confirm & Record Expense"
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

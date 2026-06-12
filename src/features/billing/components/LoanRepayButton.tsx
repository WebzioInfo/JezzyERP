"use client";

import { useTransition, useState } from "react";
import { repayLoanAction } from "@/features/billing/actions/LoanActions";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/ui/core/Button";
import { CheckCircle2, Loader2, Calendar, Banknote, Building2, X } from "lucide-react";
import { cn } from "@/utils";

interface Props {
    loanId: string;
}

export function LoanRepayButton({ loanId }: Props) {
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [method, setMethod] = useState<"BANK" | "CASH">("BANK");

    const handleRepay = async () => {
        startTransition(async () => {
            const res = await repayLoanAction(loanId, method, date);
            if (res && res.success) {
                success("Loan successfully settled!");
                setShowForm(false);
            } else {
                error(res?.error || "Failed to settle loan.");
            }
        });
    };

    if (!showForm) {
        return (
            <Button 
                onClick={() => setShowForm(true)} 
                className="w-full mt-4 h-10 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Settle Loan
            </Button>
        );
    }

    return (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-6 flex flex-col justify-center items-center text-center animate-reveal z-20">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Settle Loan</h4>
            
            <div className="w-full space-y-4 mb-6 text-left">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Repayment Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Method</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setMethod("BANK")}
                            className={cn(
                                "flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                method === "BANK" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                            )}
                        >
                            <Building2 className="w-3.5 h-3.5" /> Bank
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod("CASH")}
                            className={cn(
                                "flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                method === "CASH" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                            )}
                        >
                            <Banknote className="w-3.5 h-3.5" /> Cash
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowForm(false)}
                    disabled={isPending}
                    className="flex-1 h-10 rounded-xl text-[10px] font-black"
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleRepay}
                    loading={isPending}
                    className="flex-1 h-10 rounded-xl text-[10px] font-black shadow-lg shadow-primary-500/20"
                >
                    {isPending ? "Settling..." : "Confirm"}
                </Button>
            </div>
        </div>
    );
}

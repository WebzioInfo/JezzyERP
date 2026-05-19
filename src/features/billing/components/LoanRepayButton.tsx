"use client";

import { useTransition } from "react";
import { repayLoanAction } from "@/features/billing/actions/LoanActions";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/ui/core/Button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useConfirmStore } from "@/hooks/useConfirmStore";

interface Props {
    loanId: string;
}

export function LoanRepayButton({ loanId }: Props) {
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();
    const { confirm } = useConfirmStore();

    const handleRepay = async () => {
        const confirmed = await confirm({
            title: "Process Repayment",
            message: "Do you want to mark this loan as fully repaid/settled via Bank Transfer?",
            confirmText: "Yes, Settle Loan",
            type: "warning"
        });

        if (!confirmed) return;

        startTransition(async () => {
            const res = await repayLoanAction(loanId, 'BANK');
            if (res && res.success) {
                success("Loan successfully settled!");
            } else {
                error(res?.error || "Failed to settle loan.");
            }
        });
    };

    return (
        <Button 
            onClick={handleRepay} 
            disabled={isPending}
            className="w-full mt-4 h-10 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Settle Loan
        </Button>
    );
}

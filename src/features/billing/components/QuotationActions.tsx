"use client";

import { useTransition } from "react";
import { convertQuotationToInvoiceAction, updateQuotationStatusAction } from "@/features/billing/actions/quotations";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/ui/core/Button";
import { Send, CheckCircle2, TrendingUp, XCircle, ArrowRight, FileText, FileDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuotationActionsProps {
    quotationId: string;
    status: string;
    convertedInvoiceId?: string | null;
}

export function QuotationActions({ quotationId, status, convertedInvoiceId }: QuotationActionsProps) {
    const [isPending, startTransition] = useTransition();
    const { success, error } = useToast();
    const router = useRouter();

    const handleUpdateStatus = (newStatus: string) => {
        startTransition(async () => {
            const res = await updateQuotationStatusAction(quotationId, newStatus);
            if (res && 'success' in res) {
                success(`Proposal successfully moved to ${newStatus} state.`);
            } else if (res && 'error' in res) {
                error(res.error || "Failed to update status.");
            } else {
                error("Failed to update status.");
            }
        });
    };

    const handleConvert = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("quotationId", quotationId);
            
            const convertRes = await convertQuotationToInvoiceAction(formData);
            if (convertRes && 'success' in convertRes) {
                success("Transformation complete! Quotation has been converted to a Tax Invoice.");
                if ('invoiceId' in convertRes && convertRes.invoiceId) {
                    router.push(`/invoices/${convertRes.invoiceId}`);
                }
            } else if (convertRes && 'error' in convertRes) {
                error(convertRes.error || "Failed to convert quotation.");
            } else {
                error("Failed to convert quotation.");
            }
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {status === "DRAFT" && (
                <Button 
                    onClick={() => handleUpdateStatus("SENT")} 
                    disabled={isPending}
                    variant="secondary"
                    className="h-10 px-6 gap-2 border-slate-200"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Mark as Sent
                </Button>
            )}
            
            {status === "SENT" && (
                <>
                    <Button 
                        onClick={() => handleUpdateStatus("ACCEPTED")} 
                        disabled={isPending}
                        className="h-10 px-6 gap-2 shadow-xl shadow-success-500/20"
                        style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Accept Proposal
                    </Button>
                    <Button 
                        onClick={() => handleUpdateStatus("REJECTED")} 
                        disabled={isPending}
                        variant="ghost"
                        className="h-10 px-4 gap-2 text-danger-600 hover:bg-danger-50"
                    >
                        <XCircle className="w-4 h-4" /> Reject
                    </Button>
                </>
            )}

            {status === "ACCEPTED" && (
                <Button 
                    onClick={handleConvert} 
                    disabled={isPending}
                    className="h-11 px-8 gap-3 shadow-2xl shadow-primary-500/20 rounded-2xl animate-pulse-subtle"
                    style={{ background: "linear-gradient(135deg, #1B3A6B, #152E55)" }}
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                    CONVERT TO INVOICE <ArrowRight className="w-4 h-4" />
                </Button>
            )}

            {status === "CONVERTED" && convertedInvoiceId && (
                <Link href={`/invoices/${convertedInvoiceId}`}>
                    <Button variant="secondary" className="h-10 px-6 gap-2 text-primary-700 bg-primary-50 border-primary-200 hover:bg-primary-100">
                        <FileText className="w-4 h-4" /> View Linked Invoice
                    </Button>
                </Link>
            )}

            <Button variant="secondary" className="h-10 px-4 gap-2 border-slate-200">
                <FileDown className="w-4 h-4" /> PDF
            </Button>
        </div>
    );
}

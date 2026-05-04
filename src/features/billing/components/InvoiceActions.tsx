"use client";

import { useState, useTransition } from "react";
import { markInvoiceSentAction, deleteInvoiceAction } from "@/features/billing/actions/billing";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/ui/core/Button";
import { Send, FileDown, CheckCircle2, Edit, Loader2, Trash2, Printer } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { useConfirmStore } from "@/hooks/useConfirmStore";
import { useRouter } from "next/navigation";

interface InvoiceActionsProps {
    invoiceId: string;
    status: string;
}

export function InvoiceActions({
    invoiceId,
    status
}: InvoiceActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [isDownloading, setIsDownloading] = useState(false);
    const { success, error } = useToast();
    const { confirm } = useConfirmStore();
    const router = useRouter();


    const handleMarkSent = () => {
        startTransition(async () => {
            const res = await markInvoiceSentAction(invoiceId);
            if (res && 'success' in res) {
                success("Invoice marked as SENT. You can now track its age.");
            } else if (res && 'error' in res) {
                error(res.error || "Failed to update status.");
            } else {
                error("Failed to update status.");
            }
        });
    };

    const handleTrash = async () => {
        const confirmed = await confirm({
            title: "Move to Trash",
            message: "Are you sure you want to move this invoice to trash? You can restore it later if needed.",
            type: "warning",
            confirmText: "Trash It"
        });

        if (!confirmed) return;

        startTransition(async () => {
            const res = await deleteInvoiceAction(invoiceId);
            if (res && 'success' in res) {
                success("Invoice moved to trash.");
                router.push("/invoices");
            } else if (res && 'error' in res) {
                error(res.error || "Failed to trash invoice.");
            } else {
                error("Failed to trash invoice.");
            }
        });
    };

    const fetchPDFBlob = async () => {
        const res = await apiClient.post("/api/invoices/download", {
            invoiceId
        }, {
            responseType: 'blob'
        });
        return res;
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const res = await fetchPDFBlob();

            // Derive filename from Content-Disposition header or fallback
            const disposition = (res.headers as any)["content-disposition"] || "";
            const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
            const fileName = fileNameMatch ? fileNameMatch[1] : `invoice-${invoiceId}.pdf`;

            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            success("Invoice PDF downloaded successfully.");
        } catch (err: any) {
            console.error("[DOWNLOAD_ERROR]", err);
            const errorMsg = err.response?.data?.error || "Failed to generate PDF. Please try again.";
            error(errorMsg);
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = async () => {
        setIsDownloading(true);
        try {
            const res = await fetchPDFBlob();
            const url = URL.createObjectURL(res.data);

            // Create a hidden iframe to trigger print
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.print();
                // Clean up after a delay to allow print dialog to open
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                }, 1000);
            };

            success("Opening print dialog...");
        } catch (err: any) {
            console.error("[PRINT_ERROR]", err);
            const errorMsg = err.response?.data?.error || "Failed to generate PDF for printing.";
            error(errorMsg);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
                {status === "DRAFT" && (
                    <button
                        onClick={handleMarkSent}
                        disabled={isPending}
                        className="h-14 px-8 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-primary-500" />}
                        Mark as Sent
                    </button>
                )}

                {status !== "PAID" && status !== "DRAFT" && (
                    <Link href={`/payments/new?invoiceId=${invoiceId}`}>
                        <button
                            className="h-14 px-8 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-[0.98]"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Record Settlement
                        </button>
                    </Link>
                )}

                {status === "DRAFT" && (
                    <Link href={`/invoices/${invoiceId}/edit`}>
                        <button className="h-14 px-8 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-[0.98]">
                            <Edit className="w-4 h-4 text-indigo-500" /> Modify
                        </button>
                    </Link>
                )}

                <button
                    onClick={handlePrint}
                    disabled={isDownloading}
                    className="h-14 px-8 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4 text-slate-400" />}
                    {isDownloading ? "Preparing…" : "Print Protocol"}
                </button>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="h-14 px-8 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-primary-600 transition-all flex items-center gap-3 active:scale-[0.98] disabled:opacity-70"
                >
                    {isDownloading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <FileDown className="w-4 h-4" />
                    }
                    {isDownloading ? "Generating…" : "Download Ledger"}
                </button>

                <button
                    onClick={handleTrash}
                    disabled={isPending}
                    className="h-14 px-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-auto active:scale-90 group"
                    title="Terminate Record"
                >
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}

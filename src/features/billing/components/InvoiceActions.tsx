"use client";

import { useState, useTransition } from "react";
import { markInvoiceSentAction } from "@/features/billing/actions/billing";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/ui/core/Button";
import { Send, FileDown, CheckCircle2, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface InvoiceActionsProps {
    invoiceId: string;
    status: string;
}

export function InvoiceActions({ invoiceId, status }: InvoiceActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [isDownloading, setIsDownloading] = useState(false);
    const { success, error } = useToast();

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

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const res = await apiClient.post("/api/invoices/download", { invoiceId }, {
                responseType: 'blob'
            });

            // Derive filename from Content-Disposition header or fallback
            const disposition = res.headers["content-disposition"] || "";
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

    return (
        <div className="flex flex-wrap items-center gap-3">
            {status === "DRAFT" && (
                <Button 
                    onClick={handleMarkSent} 
                    disabled={isPending}
                    variant="secondary"
                    className="h-10 px-6 gap-2 border-slate-200 shadow-sm"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Mark as Sent
                </Button>
            )}

            {status !== "PAID" && status !== "DRAFT" && (
                <Link href={`/payments/new?invoiceId=${invoiceId}`}>
                    <Button 
                        className="h-10 px-6 gap-2 shadow-xl shadow-success-500/20"
                        style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Record Payment
                    </Button>
                </Link>
            )}

            {status === "DRAFT" && (
                <Link href={`/invoices/${invoiceId}/edit`}>
                    <Button variant="ghost" className="h-10 px-4 gap-2 text-slate-500 hover:text-slate-900">
                        <Edit className="w-4 h-4" /> Edit
                    </Button>
                </Link>
            )}

            <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="secondary"
                className="h-10 px-6 gap-2 border-slate-200"
            >
                {isDownloading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <FileDown className="w-4 h-4" />
                }
                {isDownloading ? "Generating PDF…" : "Download PDF"}
            </Button>
        </div>
    );
}

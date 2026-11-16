"use client";

import { useState, useTransition } from "react";
import { markInvoiceSentAction, deleteInvoiceAction } from "@/features/billing/actions/billing";
import { useToast } from "@/context/ToastContext";
import { 
    Send, FileDown, CheckCircle2, Edit, Loader2, Trash2, Printer, 
    Share2, MessageSquare, Mail, BellRing
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { useConfirmStore } from "@/hooks/useConfirmStore";
import { useRouter } from "next/navigation";
import { InvoiceShareModal } from "./InvoiceShareModal";
import { Button } from "@/ui/core/Button";

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

    // Modal state for invoice sharing & follow-up
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        actionType: 'SHARE' | 'FOLLOWUP';
        channel: 'WHATSAPP' | 'EMAIL';
    }>({
        isOpen: false,
        actionType: 'SHARE',
        channel: 'WHATSAPP'
    });

    const openShareModal = (actionType: 'SHARE' | 'FOLLOWUP', channel: 'WHATSAPP' | 'EMAIL') => {
        setModalConfig({
            isOpen: true,
            actionType,
            channel
        });
    };

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

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.print();
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

    const isPaid = status === "PAID";

    return (
        <div className="space-y-3 w-full">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                {/* ── SECTION 1: INVOICE ACTIONS ── */}
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-700">
                            Document Actions
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full"
                        >
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <FileDown className="w-4 h-4 text-slate-500 mr-1.5" />}
                            {isDownloading ? "Generating..." : "Download PDF"}
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => openShareModal('SHARE', 'WHATSAPP')}
                            className="w-full text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
                        >
                            <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
                            Share on WhatsApp
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => openShareModal('SHARE', 'EMAIL')}
                            className="w-full text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 border-indigo-200"
                        >
                            <Mail className="w-4 h-4 mr-1.5 text-indigo-600" />
                            Share via Email
                        </Button>
                    </div>
                </div>

                {/* ── SECTION 2: FOLLOW UP ── */}
                <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <BellRing className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-700">
                                Payment Follow-Up
                            </span>
                        </div>
                        {isPaid && (
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Fully Paid
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => openShareModal('FOLLOWUP', 'WHATSAPP')}
                            disabled={isPaid}
                            title={isPaid ? "Invoice is fully paid" : "Send WhatsApp Payment Follow-up"}
                            className="w-full"
                        >
                            <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
                            Follow Up via WhatsApp
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => openShareModal('FOLLOWUP', 'EMAIL')}
                            disabled={isPaid}
                            title={isPaid ? "Invoice is fully paid" : "Send Email Payment Follow-up"}
                            className="w-full"
                        >
                            <Mail className="w-4 h-4 mr-1.5 text-indigo-600" />
                            Follow Up via Email
                        </Button>
                    </div>
                </div>

                {/* ── SECTION 3: MANAGEMENT & SETTLEMENT ACTIONS ── */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        {status === "DRAFT" && (
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleMarkSent}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                                Mark as Sent
                            </Button>
                        )}

                        {!isPaid && status !== "DRAFT" && (
                            <Link href={`/payments/new?invoiceId=${invoiceId}`}>
                                <Button variant="primary" size="md">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Record Payment
                                </Button>
                            </Link>
                        )}

                        <Link href={`/invoices/${invoiceId}/edit`}>
                            <Button variant="outline" size="md">
                                <Edit className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                Edit Invoice
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            size="md"
                            onClick={handlePrint}
                            disabled={isDownloading}
                        >
                            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />}
                            Print
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleTrash}
                        disabled={isPending}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Move to Trash"
                        aria-label="Trash Invoice"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Invoice Share & Follow Up Modal */}
            <InvoiceShareModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                invoiceId={invoiceId}
                actionType={modalConfig.actionType}
                channel={modalConfig.channel}
            />
        </div>
    );
}

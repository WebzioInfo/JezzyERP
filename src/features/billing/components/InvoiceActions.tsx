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
        <div className="space-y-4 w-full">
            {/* Main Action Bar */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
                
                {/* ── SECTION 1: INVOICE ACTIONS ── */}
                <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <Share2 className="w-3.5 h-3.5 text-primary-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Invoice Share Actions
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="h-12 px-4 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4 text-slate-300" />}
                            {isDownloading ? "Generating..." : "View / PDF"}
                        </button>

                        <button
                            onClick={() => openShareModal('SHARE', 'WHATSAPP')}
                            className="h-12 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98]"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            Share via WhatsApp
                        </button>

                        <button
                            onClick={() => openShareModal('SHARE', 'EMAIL')}
                            className="h-12 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 active:scale-[0.98]"
                        >
                            <Mail className="w-4 h-4" />
                            Share via Email
                        </button>
                    </div>
                </div>

                {/* ── SECTION 2: FOLLOW UP ── */}
                <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                            <BellRing className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Payment Follow-Up
                            </span>
                        </div>
                        {isPaid && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                                Fully Paid
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                            onClick={() => openShareModal('FOLLOWUP', 'WHATSAPP')}
                            disabled={isPaid}
                            title={isPaid ? "Invoice is fully paid" : "Send WhatsApp Payment Follow-up"}
                            className="h-12 px-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-[0.98]"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Follow Up via WhatsApp
                        </button>

                        <button
                            onClick={() => openShareModal('FOLLOWUP', 'EMAIL')}
                            disabled={isPaid}
                            title={isPaid ? "Invoice is fully paid" : "Send Email Payment Follow-up"}
                            className="h-12 px-4 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-slate-800 active:scale-[0.98]"
                        >
                            <Mail className="w-4 h-4" />
                            Follow Up via Email
                        </button>
                    </div>
                </div>

                {/* ── SECTION 3: MANAGEMENT & SETTLEMENT ACTIONS ── */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                    {status === "DRAFT" && (
                        <button
                            onClick={handleMarkSent}
                            disabled={isPending}
                            className="flex-1 h-11 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-primary-400" />}
                            Mark as Sent
                        </button>
                    )}

                    {!isPaid && status !== "DRAFT" && (
                        <Link href={`/payments/new?invoiceId=${invoiceId}`} className="flex-1 flex">
                            <button className="w-full h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Record Settlement
                            </button>
                        </Link>
                    )}

                    <Link href={`/invoices/${invoiceId}/edit`} className="flex-1 flex">
                        <button className="w-full h-11 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2 transition-all">
                            <Edit className="w-3.5 h-3.5 text-indigo-400" /> Modify
                        </button>
                    </Link>

                    <button
                        onClick={handlePrint}
                        disabled={isDownloading}
                        className="flex-1 h-11 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5 text-slate-400" />}
                        Print
                    </button>

                    <button
                        onClick={handleTrash}
                        disabled={isPending}
                        className="h-11 px-3 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-900/50 rounded-xl flex items-center justify-center transition-all active:scale-95 group"
                        title="Trash Invoice"
                    >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
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

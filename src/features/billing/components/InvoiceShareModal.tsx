"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/ui/core/Modal";
import { Button } from "@/ui/core/Button";
import { useToast } from "@/context/ToastContext";
import { 
    MessageSquare, Mail, Download, ExternalLink, Send, Loader2, AlertCircle, FileText
} from "lucide-react";
import { prepareWhatsAppShareAction, sendInvoiceEmailAction, getInvoiceShareDataAction } from "../actions/shareActions";
import { getPartyAccountOverviewAction, prepareStatementWhatsAppAction, sendStatementEmailAction } from "../actions/accountActions";
import apiClient from "@/lib/apiClient";

import { 
    buildWhatsAppShareMessage, 
    buildWhatsAppFollowupMessage, 
    buildEmailShareContent, 
    buildEmailFollowupContent,
    buildWhatsAppStatementMessage,
    buildEmailStatementContent
} from "../utils/shareTemplates";

export interface InvoiceShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentType?: 'INVOICE' | 'CLIENT_STATEMENT' | 'VENDOR_STATEMENT';
    invoiceId?: string;
    partyId?: string;
    actionType: 'SHARE' | 'FOLLOWUP';
    channel: 'WHATSAPP' | 'EMAIL';
}

export function InvoiceShareModal({
    isOpen,
    onClose,
    documentType = 'INVOICE',
    invoiceId,
    partyId,
    actionType,
    channel
}: InvoiceShareModalProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [actionPending, setActionPending] = useState(false);
    const [shareData, setShareData] = useState<any>(null);
    const [recipient, setRecipient] = useState("");
    const [messagePreview, setMessagePreview] = useState("");
    const [errMessage, setErrMessage] = useState<string | null>(null);

    const isStatement = documentType === 'CLIENT_STATEMENT' || documentType === 'VENDOR_STATEMENT';
    const effectiveInvoiceId = invoiceId || (!isStatement ? partyId : "");
    const effectivePartyId = partyId || (isStatement ? invoiceId : "");

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, effectiveInvoiceId, effectivePartyId, documentType, actionType, channel]);

    const loadData = async () => {
        setLoading(true);
        setErrMessage(null);
        try {
            if (!isStatement && effectiveInvoiceId) {
                const res = await getInvoiceShareDataAction(effectiveInvoiceId);
                if (!res || 'error' in res) {
                    setErrMessage(res?.error || "Failed to load invoice details.");
                    return;
                }

                const data = res.data;
                setShareData(data);

                if (actionType === 'FOLLOWUP' && data.isFullyPaid) {
                    setErrMessage(`Invoice ${data.invoiceNo} is already fully paid (${data.formattedGrandTotal}). No outstanding follow-up is required.`);
                    return;
                }

                if (channel === 'WHATSAPP') {
                    setRecipient(data.customerPhone || "");
                    if (actionType === 'SHARE') {
                        setMessagePreview(buildWhatsAppShareMessage(data));
                    } else {
                        setMessagePreview(buildWhatsAppFollowupMessage(data));
                    }
                } else {
                    setRecipient(data.customerEmail || "");
                    if (actionType === 'SHARE') {
                        const content = buildEmailShareContent(data);
                        setMessagePreview(`Subject: ${content.subject}\n\n${content.body}`);
                    } else {
                        const content = buildEmailFollowupContent(data);
                        setMessagePreview(`Subject: ${content.subject}\n\n${content.body}`);
                    }
                }
            } else if (isStatement && effectivePartyId) {
                const partyKind = documentType === 'CLIENT_STATEMENT' ? 'CLIENT' : 'SUPPLIER';
                const isClient = partyKind === 'CLIENT';
                const res = await getPartyAccountOverviewAction(effectivePartyId, partyKind);
                if (!res || 'error' in res) {
                    setErrMessage((res as any)?.error || "Failed to load account statement data.");
                    return;
                }
                if (!res.data) {
                    setErrMessage("Failed to load account statement data.");
                    return;
                }

                const summary = res.data.summary;
                setShareData(summary);

                const companyName = summary.companyName || 'JEZZY ENTERPRISES';
                const bankDetails = `${companyName}\nFederal Bank, Chelari\nA/C No: 16470200011150\nIFSC: FDRL0001647`;
                const bankDetailsShort = `${companyName}\nFederal Bank, Chelari\nA/C: 16470200011150\nIFSC: FDRL0001647`;

                if (channel === 'WHATSAPP') {
                    setRecipient(summary.phone || "");
                    setMessagePreview(buildWhatsAppStatementMessage(summary, isClient, bankDetailsShort));
                } else {
                    setRecipient(summary.email || "");
                    const content = buildEmailStatementContent(summary, isClient, bankDetails);
                    setMessagePreview(`Subject: ${content.subject}\n\n${content.body}`);
                }
            }
        } catch (err: any) {
            setErrMessage(err.message || "Failed to fetch document share data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            if (!isStatement && effectiveInvoiceId) {
                const res = await apiClient.post("/api/invoices/download", { invoiceId: effectiveInvoiceId }, { responseType: 'blob' });
                const disposition = (res.headers as any)["content-disposition"] || "";
                const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
                const fileName = fileNameMatch ? fileNameMatch[1] : `invoice-${effectiveInvoiceId}.pdf`;

                const url = URL.createObjectURL(res.data);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                success("Invoice PDF downloaded.");
            } else if (isStatement && effectivePartyId) {
                const partyKind = documentType === 'CLIENT_STATEMENT' ? 'CLIENT' : 'SUPPLIER';
                const res = await apiClient.post("/api/statements/download", { partyId: effectivePartyId, partyType: partyKind }, { responseType: 'blob' });
                const disposition = (res.headers as any)["content-disposition"] || "";
                const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
                const fileName = fileNameMatch ? fileNameMatch[1] : `Statement_${shareData?.name || 'Account'}.pdf`;

                const url = URL.createObjectURL(res.data);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                success("Account Statement PDF downloaded.");
            }
        } catch (err) {
            console.error("[PDF_DOWNLOAD_ERROR]", err);
            error("Failed to download PDF.");
        }
    };

    const handleSubmit = async () => {
        setActionPending(true);
        try {
            if (!isStatement && effectiveInvoiceId) {
                if (channel === 'WHATSAPP') {
                    const res = await prepareWhatsAppShareAction(
                        effectiveInvoiceId,
                        actionType,
                        recipient,
                        messagePreview
                    );
                    if (!res || 'error' in res) {
                        error(res?.error || "Failed to prepare WhatsApp message.");
                    } else {
                        await handleDownloadPdf();
                        window.open(res.whatsappUrl, "_blank");
                        success("WhatsApp Web opened with pre-filled message! Attached PDF downloaded.");
                        onClose();
                    }
                } else {
                    let customSubject = "";
                    let customBody = messagePreview;
                    if (messagePreview.startsWith("Subject: ")) {
                        const firstLineEnd = messagePreview.indexOf("\n\n");
                        if (firstLineEnd !== -1) {
                            customSubject = messagePreview.substring(9, firstLineEnd).trim();
                            customBody = messagePreview.substring(firstLineEnd + 2);
                        }
                    }

                    const res = await sendInvoiceEmailAction(
                        effectiveInvoiceId,
                        actionType,
                        recipient,
                        customBody,
                        customSubject
                    );
                    if (!res || 'error' in res) {
                        error(res?.error || "Failed to send email.");
                    } else {
                        success(`Invoice ${actionType === 'SHARE' ? 'shared' : 'follow-up'} emailed successfully to ${recipient}!`);
                        onClose();
                    }
                }
            } else if (isStatement && effectivePartyId) {
                const partyKind = documentType === 'CLIENT_STATEMENT' ? 'CLIENT' : 'SUPPLIER';
                if (channel === 'WHATSAPP') {
                    const res = await prepareStatementWhatsAppAction(
                        effectivePartyId,
                        partyKind,
                        recipient,
                        messagePreview
                    );
                    if (!res || 'error' in res) {
                        error(res?.error || "Failed to prepare WhatsApp statement.");
                    } else {
                        await handleDownloadPdf();
                        window.open(res.whatsappUrl, "_blank");
                        success("WhatsApp Web opened with pre-filled Account Statement message!");
                        onClose();
                    }
                } else {
                    let customSubject = "";
                    let customBody = messagePreview;
                    if (messagePreview.startsWith("Subject: ")) {
                        const firstLineEnd = messagePreview.indexOf("\n\n");
                        if (firstLineEnd !== -1) {
                            customSubject = messagePreview.substring(9, firstLineEnd).trim();
                            customBody = messagePreview.substring(firstLineEnd + 2);
                        }
                    }

                    const res = await sendStatementEmailAction(
                        effectivePartyId,
                        partyKind,
                        recipient,
                        undefined,
                        customBody,
                        customSubject
                    );
                    if (!res || 'error' in res) {
                        error(res?.error || "Failed to email statement.");
                    } else {
                        success(`Account Statement emailed successfully to ${recipient}!`);
                        onClose();
                    }
                }
            }
        } catch (err: any) {
            error(err.message || "An unexpected error occurred.");
        } finally {
            setActionPending(false);
        }
    };

    const isWhatsApp = channel === 'WHATSAPP';
    const isShare = actionType === 'SHARE';

    const modalTitle = isStatement
        ? `Share Account Statement via ${isWhatsApp ? 'WhatsApp' : 'Email'}`
        : `${isShare ? 'Share Invoice' : 'Payment Follow-Up'} via ${isWhatsApp ? 'WhatsApp' : 'Email'}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-2xl"
        >
            <div className="p-6 sm:p-8 space-y-6">
                {/* Header Title Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 pr-10">
                    <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shrink-0 ${
                            isWhatsApp ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-indigo-600 shadow-indigo-600/20'
                        }`}>
                            {isWhatsApp ? <MessageSquare className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">
                                {modalTitle}
                            </h2>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                                {shareData?.invoiceNo 
                                    ? `Invoice #${shareData.invoiceNo} • ${shareData.customerName}` 
                                    : (shareData?.name ? `Account: ${shareData.name}` : 'Loading document details...')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub Header Badge / Document Indicator */}
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white truncate">
                            {isStatement 
                                ? 'Certified Account Statement Document' 
                                : (isShare ? 'Official Tax Invoice Document' : 'Payment Follow-Up Notice')}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                            Generated ERP PDF attachment included automatically
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Preparing document data & PDF...</p>
                    </div>
                ) : errMessage ? (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider mb-1">Notice</p>
                            <p className="text-xs font-medium leading-relaxed">{errMessage}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Recipient Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                                {isWhatsApp ? 'Mobile / WhatsApp Number' : 'Email Address'}
                            </label>
                            <input
                                type={isWhatsApp ? "tel" : "email"}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder={isWhatsApp ? "+91 98765 43210" : "client@company.com"}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-300"
                            />
                            {!recipient && (
                                <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5 pt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    No saved {isWhatsApp ? 'phone number' : 'email'} found for this party. Please enter one above.
                                </p>
                            )}
                        </div>

                        {/* Message Preview */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                                    Generated Message & Subject Preview
                                </label>
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                                    Official ERP Template
                                </span>
                            </div>
                            <textarea
                                value={messagePreview}
                                onChange={(e) => setMessagePreview(e.target.value)}
                                rows={6}
                                className="w-full p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all custom-scrollbar shadow-inner"
                            />
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={actionPending || !recipient.trim()}
                                className={`w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg text-white flex items-center justify-center gap-2 transition-all ${
                                    isWhatsApp ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                                }`}
                            >
                                {actionPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isWhatsApp ? 'Opening WhatsApp...' : 'Sending Email...'}
                                    </>
                                ) : isWhatsApp ? (
                                    <>
                                        <ExternalLink className="w-4 h-4" />
                                        Open WhatsApp & Download PDF
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Email with Attached PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

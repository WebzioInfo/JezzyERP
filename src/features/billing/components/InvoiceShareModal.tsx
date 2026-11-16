"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/ui/core/Modal";
import { Button } from "@/ui/core/Button";
import { useToast } from "@/context/ToastContext";
import { 
    MessageSquare, Mail, ExternalLink, Send, Loader2, AlertCircle, FileText
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

    const loadData = useCallback(async () => {
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
    }, [isStatement, effectiveInvoiceId, effectivePartyId, actionType, channel, documentType]);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, loadData]);

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
                        success("WhatsApp Web opened with pre-filled message. Attached PDF downloaded.");
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
                        success(`Invoice emailed successfully to ${recipient}.`);
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
                        success("WhatsApp Web opened with account statement message.");
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
                        success(`Account Statement emailed successfully to ${recipient}.`);
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
        ? `Share Statement via ${isWhatsApp ? 'WhatsApp' : 'Email'}`
        : `${isShare ? 'Share Invoice' : 'Payment Follow-Up'} via ${isWhatsApp ? 'WhatsApp' : 'Email'}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            maxWidth="max-w-2xl"
        >
            <div className="p-6 space-y-5">
                {/* Document summary info */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <FileText size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                            {shareData?.invoiceNo 
                                ? `Invoice #${shareData.invoiceNo} — ${shareData.customerName}` 
                                : (shareData?.name ? `Account: ${shareData.name}` : 'Document')}
                        </p>
                        <p className="text-[11px] text-slate-500">Official PDF attachment included automatically</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-10 flex flex-col items-center justify-center space-y-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                        <p className="text-xs text-slate-500">Preparing document details...</p>
                    </div>
                ) : errMessage ? (
                    <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold">Notice</p>
                            <p className="text-xs mt-0.5 leading-relaxed">{errMessage}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Recipient Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 block">
                                {isWhatsApp ? 'WhatsApp Phone Number' : 'Recipient Email Address'}
                            </label>
                            <input
                                type={isWhatsApp ? "tel" : "email"}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder={isWhatsApp ? "+91 98765 43210" : "client@company.com"}
                                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white shadow-xs focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors placeholder:text-slate-400"
                            />
                            {!recipient && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    No saved {isWhatsApp ? 'phone number' : 'email'} found for this party. Please enter one above.
                                </p>
                            )}
                        </div>

                        {/* Message Preview */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 block">
                                Message & Subject Preview
                            </label>
                            <textarea
                                value={messagePreview}
                                onChange={(e) => setMessagePreview(e.target.value)}
                                rows={6}
                                className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 resize-none transition-colors custom-scrollbar"
                            />
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={actionPending}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="button"
                                variant={isWhatsApp ? "success" : "primary"}
                                onClick={handleSubmit}
                                disabled={actionPending || !recipient.trim()}
                                loading={actionPending}
                            >
                                {actionPending ? (
                                    isWhatsApp ? 'Opening WhatsApp...' : 'Sending Email...'
                                ) : isWhatsApp ? (
                                    <>
                                        <ExternalLink className="w-4 h-4 mr-1.5" />
                                        Open WhatsApp & Download PDF
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-1.5" />
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

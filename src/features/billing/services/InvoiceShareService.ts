import "server-only";
import { db } from "@/db/prisma/client";
import { recordAuditLog } from "@/lib/audit";
import { InvoicePdfService } from "./InvoicePdfService";
import nodemailer from "nodemailer";

export interface InvoiceShareData {
    invoiceId: string;
    invoiceNo: string;
    invoiceDate: string;
    customerName: string;
    customerPhone: string | null;
    customerEmail: string | null;
    cleanPhone: string | null;
    itemSummary: string;
    grandTotal: number;
    totalPaid: number;
    balanceDue: number;
    isFullyPaid: boolean;
    formattedGrandTotal: string;
    formattedTotalPaid: string;
    formattedBalanceDue: string;
    bankDetails: string;
    bankDetailsShort: string;
    companyName: string;
    isVendor?: boolean;
}

export class InvoiceShareService {
    /**
     * Format currency cleanly in Indian Rupee format (e.g. ₹9,912 or ₹9,912.50)
     */
    static formatRupee(amount: number): string {
        const hasDecimals = amount % 1 !== 0;
        const formatted = amount.toLocaleString("en-IN", {
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: 2,
        });
        return `₹${formatted}`;
    }

    /**
     * Validate and clean Indian/International phone numbers for WhatsApp sharing
     */
    static validateAndCleanPhone(rawPhone: string | null | undefined): { valid: boolean; cleanPhone: string; error?: string } {
        if (!rawPhone || !rawPhone.trim()) {
            return { valid: false, cleanPhone: "", error: "Customer has no saved phone number." };
        }

        const digitsOnly = rawPhone.replace(/\D/g, "");

        if (digitsOnly.length < 10) {
            return { valid: false, cleanPhone: "", error: "Customer phone number is invalid (less than 10 digits)." };
        }

        let cleanPhone = digitsOnly;
        // If 10 digits starting with 6,7,8,9, prepend 91 for India country code
        if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
            cleanPhone = `91${digitsOnly}`;
        }

        return { valid: true, cleanPhone };
    }

    /**
     * Validate customer email address
     */
    static validateEmail(rawEmail: string | null | undefined): { valid: boolean; email: string; error?: string } {
        if (!rawEmail || !rawEmail.trim()) {
            return { valid: false, email: "", error: "Customer has no saved email address." };
        }

        const email = rawEmail.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, email: "", error: `Customer email (${email}) is invalid.` };
        }

        return { valid: true, email };
    }

    /**
     * Fetch complete invoice context & calculate financial standing
     */
    static async getShareData(invoiceId: string): Promise<InvoiceShareData> {
        const invoice = await db.invoice.findFirst({
            where: { id: invoiceId, deletedAt: null },
            include: {
                client: true,
                allocations: true,
                lineItems: {
                    orderBy: { id: "asc" },
                    include: { product: true }
                }
            }
        });

        if (!invoice) {
            throw new Error("Invoice not found or has been deleted.");
        }

        const settings = await db.companySetting.findFirst() || {
            companyName: "JEZZY ENTERPRISES",
            bankName: "FEDERAL BANK",
            bankBranch: "CHELARI",
            bankAccountNo: "16470200011150",
            bankIfsc: "FDRL0001647",
            bankAccountName: "JEZZY ENTERPRISES"
        };

        const grandTotal = invoice.grandTotal.toNumber();
        const totalPaid = (invoice.allocations || []).reduce((sum, a) => sum + a.amount.toNumber(), 0);
        const balanceDue = Math.max(0, grandTotal - totalPaid);
        const isFullyPaid = balanceDue <= 0.01;

        const invoiceDate = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(invoice.date));

        // Determine line items summary
        const items = invoice.lineItems || [];
        let itemSummary = "goods/services";
        if (items.length === 1) {
            itemSummary = items[0].description || items[0].product?.description || "goods";
        } else if (items.length > 1) {
            const firstItemName = items[0].description || items[0].product?.description || "item";
            itemSummary = `${firstItemName} and ${items.length - 1} other item${items.length > 2 ? 's' : ''}`;
        }

        const customerName = invoice.billingName || invoice.client?.name || "Valued Customer";
        const customerPhone = invoice.billingPhone || invoice.client?.phone || null;
        const customerEmail = invoice.client?.email || null;

        const phoneValidation = this.validateAndCleanPhone(customerPhone);
        const cleanPhone = phoneValidation.valid ? phoneValidation.cleanPhone : null;

        const companyName = settings.companyName || "JEZZY ENTERPRISES";
        const bankAccountName = (settings.bankAccountName || companyName).trim();
        const bankNameBranch = `${settings.bankName || 'FEDERAL BANK'}, ${settings.bankBranch || 'CHELARI'}`.trim();
        const bankAccountNo = (settings.bankAccountNo || '16470200011150').trim();
        const bankIfsc = (settings.bankIfsc || 'FDRL0001647').trim();

        const bankDetails = `${companyName}\n${bankNameBranch}\nA/C No: ${bankAccountNo}\nIFSC: ${bankIfsc}`;
        const bankDetailsShort = `${companyName}\n${bankNameBranch}\nA/C: ${bankAccountNo}\nIFSC: ${bankIfsc}`;

        return {
            invoiceId: invoice.id,
            invoiceNo: invoice.invoiceNo,
            invoiceDate,
            customerName,
            customerPhone,
            customerEmail,
            cleanPhone,
            itemSummary,
            grandTotal,
            totalPaid,
            balanceDue,
            isFullyPaid,
            formattedGrandTotal: this.formatRupee(grandTotal),
            formattedTotalPaid: this.formatRupee(totalPaid),
            formattedBalanceDue: this.formatRupee(balanceDue),
            bankDetails,
            bankDetailsShort,
            companyName,
            isVendor: false
        };
    }

    /**
     * Generate WhatsApp Invoice Share Message (Short, Clean, Mobile-Optimized)
     */
    static buildWhatsAppShareMessage(data: InvoiceShareData): string {
        if (data.isVendor) {
            return `Hi ${data.customerName},\n\nSharing purchase invoice ${data.invoiceNo} for ${data.itemSummary}.\n\nTotal: ${data.formattedGrandTotal}\nPayable: ${data.formattedBalanceDue}\n\nBank Details:\n${data.bankDetailsShort}\n\nPlease check the attached purchase invoice. Thank you. 😊`;
        }

        return `Hi ${data.customerName},\n\nSharing invoice ${data.invoiceNo} for ${data.itemSummary}.\n\nTotal: ${data.formattedGrandTotal}\nOutstanding: ${data.formattedBalanceDue}\n\nBank Details:\n${data.bankDetailsShort}\n\nPlease check the attached invoice. Thank you. 😊`;
    }

    /**
     * Generate WhatsApp Payment Follow-up Message (Short & Gentle)
     */
    static buildWhatsAppFollowupMessage(data: InvoiceShareData): string {
        if (data.isFullyPaid) {
            throw new Error(`Invoice ${data.invoiceNo} is already fully paid. No outstanding payment follow-up is required.`);
        }

        if (data.isVendor) {
            return `Hi ${data.customerName},\n\nJust a gentle follow-up regarding purchase invoice ${data.invoiceNo}.\n\nPayable Outstanding: ${data.formattedBalanceDue}\n\nKindly let us know if any further details are required.\n\nThank you. 😊`;
        }

        return `Hi ${data.customerName},\n\nJust a gentle follow-up regarding invoice ${data.invoiceNo}.\n\nOutstanding: ${data.formattedBalanceDue}\n\nBank Details:\n${data.bankDetailsShort}\n\nKindly arrange the payment when convenient. If already paid, please share the payment details.\n\nThank you. 😊`;
    }

    /**
     * Generate Formal Corporate Email Invoice Share Subject & Body
     */
    static buildEmailShareContent(data: InvoiceShareData): { subject: string; body: string } {
        if (data.isVendor) {
            const subject = `Purchase Invoice ${data.invoiceNo} - ${data.companyName}`;
            const body = `Dear ${data.customerName},\n\nPlease find attached the purchase invoice ${data.invoiceNo} dated ${data.invoiceDate} for the following transaction:\n\n${data.itemSummary}\n\nPurchase Amount: ${data.formattedGrandTotal}\nAmount Paid: ${data.formattedTotalPaid}\nOutstanding Payable: ${data.formattedBalanceDue}\n\nBank Details:\n\n${data.bankDetails}\n\nKindly review the attached purchase invoice.\n\nShould you require any clarification or additional information, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${data.companyName}`;
            return { subject, body };
        }

        const subject = `Invoice ${data.invoiceNo} - ${data.companyName}`;
        const body = `Dear ${data.customerName},\n\nPlease find attached the invoice ${data.invoiceNo} dated ${data.invoiceDate} for the following transaction:\n\n${data.itemSummary}\n\nInvoice Amount: ${data.formattedGrandTotal}\nAmount Paid: ${data.formattedTotalPaid}\nOutstanding Amount: ${data.formattedBalanceDue}\n\nBank Details:\n\n${data.bankDetails}\n\nKindly review the attached invoice and arrange the payment, if applicable.\n\nShould you require any clarification or additional information regarding the invoice, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${data.companyName}`;

        return { subject, body };
    }

    /**
     * Generate Formal Corporate Email Payment Follow-up Subject & Body
     */
    static buildEmailFollowupContent(data: InvoiceShareData): { subject: string; body: string } {
        if (data.isFullyPaid) {
            throw new Error(`Invoice ${data.invoiceNo} is already fully paid. No outstanding payment follow-up is required.`);
        }

        if (data.isVendor) {
            const subject = `Payment Status Follow-up - Purchase ${data.invoiceNo}`;
            const body = `Dear ${data.customerName},\n\nThis is a gentle follow-up regarding purchase invoice ${data.invoiceNo}, dated ${data.invoiceDate}.\n\nThe current outstanding payable amount is ${data.formattedBalanceDue}.\n\nWe kindly request you to share the updated account status at your earliest convenience.\n\nPlease feel free to contact us if you require any clarification.\n\nRegards,\n${data.companyName}`;
            return { subject, body };
        }

        const subject = `Payment Follow-up - Invoice ${data.invoiceNo}`;
        const body = `Dear ${data.customerName},\n\nThis is a gentle follow-up regarding invoice ${data.invoiceNo}, dated ${data.invoiceDate}.\n\nThe current outstanding amount is ${data.formattedBalanceDue}.\n\nBank Details:\n\n${data.bankDetails}\n\nWe kindly request you to arrange the payment at your earliest convenience, if it has not already been processed.\n\nIf the payment has already been made, please disregard this message or share the payment details for our records.\n\nPlease feel free to contact us if you require any clarification.\n\nThank you for your continued business with us.\n\nRegards,\n${data.companyName}`;

        return { subject, body };
    }

    /**
     * Statement Templates for WhatsApp & Email (Client & Vendor)
     */
    static buildWhatsAppStatementMessage(summary: any, isClient: boolean, bankDetailsShort: string): string {
        const balFormatted = this.formatRupee(Math.abs(summary.currentBalance || 0));
        const company = summary.companyName || 'JEZZY ENTERPRISES';

        if (isClient) {
            return `Hi ${summary.name},\n\nSharing your Account Statement from ${company}.\n\nOutstanding Balance: ${balFormatted}\n\nBank Details:\n${bankDetailsShort}\n\nPlease check the attached statement PDF. Thank you. 😊`;
        }
        return `Hi ${summary.name},\n\nSharing your Account Statement from ${company}.\n\nPayable Balance: ${balFormatted}\n\nBank Details:\n${bankDetailsShort}\n\nPlease check the attached statement PDF. Thank you. 😊`;
    }

    static buildEmailStatementContent(summary: any, isClient: boolean, bankDetails: string): { subject: string; body: string } {
        const company = summary.companyName || 'JEZZY ENTERPRISES';
        const balFormatted = this.formatRupee(Math.abs(summary.currentBalance || 0));
        const subject = `Account Statement - ${summary.name} (${company})`;

        if (isClient) {
            const body = `Dear ${summary.name},\n\nPlease find attached your complete Account Statement from ${company}.\n\nCurrent Outstanding Balance: ${balFormatted}\n\nBank Details:\n\n${bankDetails}\n\nKindly review the statement and arrange the outstanding payment at your earliest convenience.\n\nShould you require any clarification regarding your statement, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${company}`;
            return { subject, body };
        }

        const body = `Dear ${summary.name},\n\nPlease find attached your complete Account Statement from ${company}.\n\nCurrent Payable Balance: ${balFormatted}\n\nBank Details:\n\n${bankDetails}\n\nKindly review the attached statement.\n\nShould you require any clarification regarding your statement, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${company}`;
        return { subject, body };
    }

    /**
     * Prepare WhatsApp share deep link & message text with proper UTF-8 URL encoding
     */
    static async prepareWhatsAppShare(
        userId: string | null,
        invoiceId: string,
        actionType: 'SHARE' | 'FOLLOWUP',
        overridePhone?: string,
        customMessage?: string
    ) {
        const data = await this.getShareData(invoiceId);

        const phoneToUse = overridePhone || data.customerPhone;
        const phoneVal = this.validateAndCleanPhone(phoneToUse);

        if (!phoneVal.valid) {
            throw new Error(phoneVal.error || "Customer phone number is invalid.");
        }

        let message = customMessage || "";
        if (!message) {
            if (actionType === 'SHARE') {
                message = this.buildWhatsAppShareMessage(data);
            } else {
                message = this.buildWhatsAppFollowupMessage(data);
            }
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneVal.cleanPhone}?text=${encodedMessage}`;

        await recordAuditLog(db, {
            userId,
            action: actionType === 'SHARE' ? 'SHARE_WHATSAPP' : 'FOLLOWUP_WHATSAPP',
            entityType: 'Invoice',
            entityId: invoiceId,
            details: {
                channel: 'WhatsApp',
                actionType,
                recipient: phoneVal.cleanPhone,
                status: 'OPENED',
                invoiceNo: data.invoiceNo,
                grandTotal: data.grandTotal,
                balanceDue: data.balanceDue,
                timestamp: new Date().toISOString()
            }
        });

        return {
            success: true,
            whatsappUrl,
            phone: phoneVal.cleanPhone,
            message,
            data
        };
    }

    /**
     * Send Invoice/Follow-Up Email with attached official PDF
     */
    static async sendEmail(
        userId: string | null,
        invoiceId: string,
        actionType: 'SHARE' | 'FOLLOWUP',
        overrideEmail?: string,
        customBody?: string,
        customSubject?: string
    ) {
        const data = await this.getShareData(invoiceId);

        const emailToUse = overrideEmail || data.customerEmail;
        const emailVal = this.validateEmail(emailToUse);

        if (!emailVal.valid) {
            throw new Error(emailVal.error || "Customer email address is invalid.");
        }

        let content: { subject: string; body: string };
        if (customBody) {
            let subject = customSubject || "";
            if (!subject) {
                subject = actionType === 'SHARE' 
                    ? `Invoice ${data.invoiceNo} - ${data.companyName}` 
                    : `Payment Follow-up - Invoice ${data.invoiceNo}`;
            }
            content = { subject, body: customBody };
        } else if (actionType === 'SHARE') {
            content = this.buildEmailShareContent(data);
        } else {
            content = this.buildEmailFollowupContent(data);
        }

        // Generate official invoice PDF
        const { buffer, fileName } = await InvoicePdfService.generateInvoicePdf(invoiceId, 'ORIGINAL');

        // Check SMTP configuration from process.env
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpFrom = process.env.SMTP_FROM || `"${data.companyName}" <${smtpUser || "noreply@jezzyenterprises.com"}>`;

        if (!smtpHost || !smtpUser || !smtpPass) {
            const missingError = "SMTP email provider is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.";
            
            await recordAuditLog(db, {
                userId,
                action: actionType === 'SHARE' ? 'SHARE_EMAIL' : 'FOLLOWUP_EMAIL',
                entityType: 'Invoice',
                entityId: invoiceId,
                details: {
                    channel: 'Email',
                    actionType,
                    recipient: emailVal.email,
                    status: 'FAILED',
                    error: missingError,
                    invoiceNo: data.invoiceNo,
                    timestamp: new Date().toISOString()
                }
            });

            throw new Error(missingError);
        }

        try {
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            const sendResult = await transporter.sendMail({
                from: smtpFrom,
                to: emailVal.email,
                subject: content.subject,
                text: content.body,
                attachments: [
                    {
                        filename: fileName,
                        content: buffer,
                        contentType: "application/pdf"
                    }
                ]
            });

            await recordAuditLog(db, {
                userId,
                action: actionType === 'SHARE' ? 'SHARE_EMAIL' : 'FOLLOWUP_EMAIL',
                entityType: 'Invoice',
                entityId: invoiceId,
                details: {
                    channel: 'Email',
                    actionType,
                    recipient: emailVal.email,
                    status: 'SENT',
                    messageId: sendResult.messageId,
                    invoiceNo: data.invoiceNo,
                    grandTotal: data.grandTotal,
                    balanceDue: data.balanceDue,
                    timestamp: new Date().toISOString()
                }
            });

            return {
                success: true,
                recipient: emailVal.email,
                messageId: sendResult.messageId,
                data
            };
        } catch (err: any) {
            const errorMsg = err.message || "Failed to deliver email through SMTP server.";
            
            await recordAuditLog(db, {
                userId,
                action: actionType === 'SHARE' ? 'SHARE_EMAIL' : 'FOLLOWUP_EMAIL',
                entityType: 'Invoice',
                entityId: invoiceId,
                details: {
                    channel: 'Email',
                    actionType,
                    recipient: emailVal.email,
                    status: 'FAILED',
                    error: errorMsg,
                    invoiceNo: data.invoiceNo,
                    timestamp: new Date().toISOString()
                }
            });

            throw new Error(`Email Delivery Failed: ${errorMsg}`);
        }
    }
}


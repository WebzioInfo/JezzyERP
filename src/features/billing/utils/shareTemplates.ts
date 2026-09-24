/**
 * Pure client-and-server template builders for Email and WhatsApp communication.
 * This file MUST NOT import any Node.js native modules, Prisma, or server-only packages.
 */

export interface ShareTemplateData {
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

export function formatRupee(amount: number): string {
    const hasDecimals = amount % 1 !== 0;
    const formatted = amount.toLocaleString("en-IN", {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2,
    });
    return `₹${formatted}`;
}

/**
 * Generate WhatsApp Invoice Share Message (Short, Clean, Mobile-Optimized)
 */
export function buildWhatsAppShareMessage(data: ShareTemplateData): string {
    if (data.isVendor) {
        return `Hi ${data.customerName},\n\nSharing purchase invoice ${data.invoiceNo} for ${data.itemSummary}.\n\nTotal: ${data.formattedGrandTotal}\nPayable: ${data.formattedBalanceDue}\n\nBank Details:\n${data.bankDetailsShort}\n\nPlease check the attached purchase invoice. Thank you. 😊`;
    }

    return `Hi ${data.customerName},\n\nSharing invoice ${data.invoiceNo} for ${data.itemSummary}.\n\nTotal: ${data.formattedGrandTotal}\nOutstanding: ${data.formattedBalanceDue}\n\nBank Details:\n${data.bankDetailsShort}\n\nPlease check the attached invoice. Thank you. 😊`;
}

/**
 * Generate WhatsApp Payment Follow-up Message (Short & Gentle)
 */
export function buildWhatsAppFollowupMessage(data: ShareTemplateData): string {
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
export function buildEmailShareContent(data: ShareTemplateData): { subject: string; body: string } {
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
export function buildEmailFollowupContent(data: ShareTemplateData): { subject: string; body: string } {
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
export function buildWhatsAppStatementMessage(summary: any, isClient: boolean, bankDetailsShort: string): string {
    const balFormatted = formatRupee(Math.abs(summary.currentBalance || 0));
    const company = summary.companyName || 'JEZZY ENTERPRISES';

    if (isClient) {
        return `Hi ${summary.name},\n\nSharing your Account Statement from ${company}.\n\nOutstanding Balance: ${balFormatted}\n\nBank Details:\n${bankDetailsShort}\n\nPlease check the attached statement PDF. Thank you. 😊`;
    }
    return `Hi ${summary.name},\n\nSharing your Account Statement from ${company}.\n\nPayable Balance: ${balFormatted}\n\nBank Details:\n${bankDetailsShort}\n\nPlease check the attached statement PDF. Thank you. 😊`;
}

export function buildEmailStatementContent(summary: any, isClient: boolean, bankDetails: string): { subject: string; body: string } {
    const company = summary.companyName || 'JEZZY ENTERPRISES';
    const balFormatted = formatRupee(Math.abs(summary.currentBalance || 0));
    const subject = `Account Statement - ${summary.name} (${company})`;

    if (isClient) {
        const body = `Dear ${summary.name},\n\nPlease find attached your complete Account Statement from ${company}.\n\nCurrent Outstanding Balance: ${balFormatted}\n\nBank Details:\n\n${bankDetails}\n\nKindly review the statement and arrange the outstanding payment at your earliest convenience.\n\nShould you require any clarification regarding your statement, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${company}`;
        return { subject, body };
    }

    const body = `Dear ${summary.name},\n\nPlease find attached your complete Account Statement from ${company}.\n\nCurrent Payable Balance: ${balFormatted}\n\nBank Details:\n\n${bankDetails}\n\nKindly review the attached statement.\n\nShould you require any clarification regarding your statement, please feel free to contact us.\n\nThank you for your continued business with us.\n\nRegards,\n${company}`;
    return { subject, body };
}

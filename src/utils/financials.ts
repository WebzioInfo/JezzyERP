/**
 * Financial calculation utility for consistent rounding and arithmetic.
 * Ensures that all monetary values stay within 2 decimal precision.
 */

/**
 * Rounds a number to 2 decimal places using standard arithmetic rounding.
 */
export function roundTo2(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a number or Decimal as an Indian Rupee string.
 */
export function formatCurrency(amount: number | string | any): string {
    const val = typeof amount === "number" ? amount : Number(amount || 0);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(val);
}

export interface CalculatedItem {
    qty: number;
    rate: number;
    taxPercent: number;
    amount: number;      // qty * rate (rounded)
    taxAmount: number;   // (amount * taxPercent) / 100 (rounded)
    totalAmount: number; // amount + taxAmount (rounded)
}

/**
 * Calculates totals for a single invoice line item.
 */
export function calculateItemTotals(qty: number, rate: number, taxPercent: number): CalculatedItem {
    const amount = roundTo2(qty * rate);
    const taxAmount = roundTo2((amount * taxPercent) / 100);
    const totalAmount = roundTo2(amount + taxAmount);

    return {
        qty,
        rate,
        taxPercent,
        amount,
        taxAmount,
        totalAmount
    };
}

export interface BillingTotals {
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
    roundOff: number;
}

/**
 * Aggregates a list of line items and optional freight into final billing totals.
 */
export function calculateBillingTotals(
    items: { qty: number; rate: number; taxPercent: number }[],
    freightAmount: number = 0,
    freightTaxPercent: number = 0
): BillingTotals {
    const totals = items.reduce((acc, item) => {
        const { amount, taxAmount } = calculateItemTotals(item.qty, item.rate, item.taxPercent);
        
        acc.subTotal = roundTo2(acc.subTotal + amount);
        acc.taxTotal = roundTo2(acc.taxTotal + taxAmount);
        
        return acc;
    }, { subTotal: 0, taxTotal: 0, grandTotal: 0 });

    // Add Freight
    const fAmount = roundTo2(freightAmount);
    const fTax = roundTo2((fAmount * freightTaxPercent) / 100);

    totals.subTotal = roundTo2(totals.subTotal + fAmount);
    totals.taxTotal = roundTo2(totals.taxTotal + fTax);
    const rawGrandTotal = totals.subTotal + totals.taxTotal;
    totals.grandTotal = Math.round(rawGrandTotal);
    
    // Add roundOff property
    (totals as any).roundOff = roundTo2(totals.grandTotal - rawGrandTotal);

    return totals as BillingTotals;
}

/**
 * Converts a numeric amount into an Indian Rupee word string, including Paise.
 */
export function numberToWords(num: number): string {
    if (num === 0) return "Zero Rupees Only";
    
    // Split into Rupees and Paise
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convert = (n: number): string => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
    };

    let result = "";
    if (rupees > 0) {
        result += convert(rupees) + " Rupee" + (rupees === 1 ? "" : "s");
    }

    if (paise > 0) {
        if (result !== "") result += " and ";
        result += convert(paise) + " Paise";
    }

    return result ? result + " Only" : "Zero Rupees Only";
}

/**
 * Formats a date into Indian medium style (e.g., 03-May-2026).
 */
export function fmtDate(d: Date | string | null): string {
    if (!d) return "N/A";
    try {
        return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
    } catch (e) {
        return "Invalid Date";
    }
}

/**
 * Maps technical ledger/reference types to user-friendly business terms.
 * Used for displaying transactions in a way that non-accountants can easily understand.
 * Context-aware: Can use account types to differentiate labels.
 */
export function getBusinessLabel(type: string | null | undefined, debitAccountType?: string, creditAccountType?: string): string {
    // Guard: transactionType may be null/undefined if the DB column hasn't been migrated yet
    if (!type) return 'Ledger Entry';

    const mapping: Record<string, string> = {
        'PAYMENT_RECEIVED': 'Collection Received',
        'PAYMENT_MADE': 'Settlement Paid',
        'PAYMENT': 'Payment',
        'EXPENSE': 'Business Expense',
        'INVOICE': 'Sales Invoice',
        'PURCHASE': 'Stock Purchase',
        'OPENING_BALANCE': 'Opening Standing',
        'FOUNDER_CONTRIBUTION': 'Capital Infusion',
        'FOUNDER_WITHDRAWAL': 'Owner Withdrawal',
        'ADJUSTMENT': 'Ledger Correction',
        'TRANSFER': 'Internal Transfer',
        'ADVANCE': 'Direct Advance',
    };

    // Contextual Overrides
    if (type === 'PAYMENT' || type === 'PAYMENT_RECEIVED') {
        if (creditAccountType === 'CLIENT') return 'Collection Received';
        if (debitAccountType === 'SUPPLIER') return 'Supplier Settlement';
    }

    if (type === 'TRANSFER') {
        if (debitAccountType === 'CASH' && creditAccountType === 'BANK') return 'Cash Withdrawal';
        if (debitAccountType === 'BANK' && creditAccountType === 'CASH') return 'Cash Deposit';
    }

    if (!type) return 'General Transaction';
    return mapping[type] || mapping[type.replace('_', ' ')] || type;
}


/**
 * Standardized Financial Summary Calculation.
 * Outstanding = Total Invoiced - Total Allocated
 * Advance = Total Paid - Total Allocated
 * Net = Outstanding - Advance
 */
export function calculatePartySummary(invoices: { total: number; paid: number }[], payments: { amount: number; allocated: number }[]) {
    const outstanding = roundTo2(invoices.reduce((sum, inv) => sum + (inv.total - inv.paid), 0));
    const advance = roundTo2(payments.reduce((sum, p) => sum + (p.amount - p.allocated), 0));
    
    return {
        outstanding,
        advance,
        netBalance: roundTo2(outstanding - advance)
    };
}

/**
 * Maps account types to business-friendly labels.
 */
export function getAccountLabel(type: string): string {
    const mapping: Record<string, string> = {
        'EQUITY': 'Owner Account',
        'CASH': 'Cash in Hand',
        'BANK': 'Bank Account',
        'CLIENT': 'Client (Receivable)',
        'SUPPLIER': 'Supplier (Payable)',
    };
    return mapping[type] || type;
}

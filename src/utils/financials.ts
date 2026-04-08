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
}

/**
 * Aggregates a list of line items into final billing totals.
 */
export function calculateBillingTotals(items: { qty: number; rate: number; taxPercent: number }[]): BillingTotals {
    return items.reduce((acc, item) => {
        const { amount, taxAmount } = calculateItemTotals(item.qty, item.rate, item.taxPercent);
        
        acc.subTotal = roundTo2(acc.subTotal + amount);
        acc.taxTotal = roundTo2(acc.taxTotal + taxAmount);
        acc.grandTotal = roundTo2(acc.subTotal + acc.taxTotal);
        
        return acc;
    }, { subTotal: 0, taxTotal: 0, grandTotal: 0 });
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

export type DocumentType = 
    | "TAX INVOICE" 
    | "PROFORMA INVOICE" 
    | "DELIVERY CHALLAN" 
    | "PURCHASE ORDER" 
    | "CREDIT NOTE" 
    | "DEBIT NOTE"
    | "UNKNOWN";

export interface ConfidenceScore {
    value: any;
    confidence: number;
}

export interface ParsedLineItem {
    description: ConfidenceScore;
    hsn: ConfidenceScore;
    qty: ConfidenceScore;
    rate: ConfidenceScore;
    amount: ConfidenceScore;
    unit: ConfidenceScore;
    pkgCount: ConfidenceScore;
    pkgType: ConfidenceScore;
    taxPercent: ConfidenceScore;
}

export interface ParsedDocument {
    documentType: ConfidenceScore;
    vendorName: ConfidenceScore;
    vendorGst: ConfidenceScore;
    vendorAddress: ConfidenceScore;
    vendorEmail: ConfidenceScore;
    vendorPhone: ConfidenceScore;
    vendorPin: ConfidenceScore;
    vendorState: ConfidenceScore;
    invoiceNo: ConfidenceScore;
    date: ConfidenceScore;
    ewayBill: ConfidenceScore;
    items: ParsedLineItem[];
    subTotal: ConfidenceScore;
    cgst: ConfidenceScore;
    sgst: ConfidenceScore;
    igst: ConfidenceScore;
    grandTotal: ConfidenceScore;
}

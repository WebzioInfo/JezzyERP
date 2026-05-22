import { DocumentType } from "./types";

export function classifyDocument(text: string): { type: DocumentType, confidence: number } {
    const upperText = text.toUpperCase();
    
    if (upperText.includes("PROFORMA INVOICE")) {
        return { type: "PROFORMA INVOICE", confidence: 0.95 };
    }
    if (upperText.includes("TAX INVOICE")) {
        return { type: "TAX INVOICE", confidence: 0.95 };
    }
    if (upperText.includes("DELIVERY CHALLAN")) {
        return { type: "DELIVERY CHALLAN", confidence: 0.95 };
    }
    if (upperText.includes("PURCHASE ORDER")) {
        return { type: "PURCHASE ORDER", confidence: 0.95 };
    }
    if (upperText.includes("CREDIT NOTE")) {
        return { type: "CREDIT NOTE", confidence: 0.95 };
    }
    if (upperText.includes("DEBIT NOTE")) {
        return { type: "DEBIT NOTE", confidence: 0.95 };
    }
    if (upperText.includes("INVOICE") || upperText.includes("BILL")) {
        return { type: "TAX INVOICE", confidence: 0.6 }; // low confidence fallback
    }

    return { type: "UNKNOWN", confidence: 0.0 };
}

import { ParsedDocument, ConfidenceScore } from "./types";

function buildScore(value: any, confidence: number): ConfidenceScore {
    return { value, confidence };
}

export function validateFinances(doc: Partial<ParsedDocument>, companyGstStateCode: string = "29"): Partial<ParsedDocument> {
    const validatedDoc = { ...doc };
    
    // Auto-detect GST logic based on vendor state code vs company state code
    let isInterState = false;
    const vendorGst = doc.vendorGst?.value;
    if (vendorGst && vendorGst.length >= 2) {
        const vendorStateCode = vendorGst.substring(0, 2);
        isInterState = vendorStateCode !== companyGstStateCode;
    } else if (doc.vendorState?.value) {
        // Simple fallback if no GSTIN
        const stateStr = doc.vendorState.value.toLowerCase();
        // Assuming company is in Karnataka (29) based on default data
        if (!stateStr.includes("karnataka") && !stateStr.includes("29")) {
            isInterState = true;
        }
    }

    let calculatedTaxable = 0;
    let calculatedCgst = 0;
    let calculatedSgst = 0;
    let calculatedIgst = 0;

    // Validate and fix line items
    if (validatedDoc.items && validatedDoc.items.length > 0) {
        validatedDoc.items = validatedDoc.items.map(item => {
            const qty = item.qty.value || 0;
            let rate = item.rate.value || 0;
            let amount = item.amount.value || 0;

            // Fix zero value bug at line item level
            if (amount === 0 && qty > 0 && rate > 0) {
                amount = qty * rate;
                item.amount = buildScore(amount, 0.9);
            } else if (rate === 0 && qty > 0 && amount > 0) {
                rate = amount / qty;
                item.rate = buildScore(rate, 0.9);
            }

            calculatedTaxable += amount;

            // Estimate tax
            const taxPercent = item.taxPercent?.value || 18;
            const taxAmount = (amount * taxPercent) / 100;
            
            if (isInterState) {
                calculatedIgst += taxAmount;
            } else {
                calculatedCgst += taxAmount / 2;
                calculatedSgst += taxAmount / 2;
            }

            return item;
        });
    }

    // Fix zero value bug at document level
    let docTaxable = validatedDoc.subTotal?.value || 0;
    if (docTaxable === 0) {
        docTaxable = calculatedTaxable;
        validatedDoc.subTotal = buildScore(docTaxable, calculatedTaxable > 0 ? 0.9 : 0);
    }

    let docCgst = validatedDoc.cgst?.value || 0;
    let docSgst = validatedDoc.sgst?.value || 0;
    let docIgst = validatedDoc.igst?.value || 0;
    let docGrandTotal = validatedDoc.grandTotal?.value || 0;

    if (docCgst === 0 && docSgst === 0 && docIgst === 0 && calculatedTaxable > 0) {
        docCgst = calculatedCgst;
        docSgst = calculatedSgst;
        docIgst = calculatedIgst;
        validatedDoc.cgst = buildScore(docCgst, 0.8);
        validatedDoc.sgst = buildScore(docSgst, 0.8);
        validatedDoc.igst = buildScore(docIgst, 0.8);
    }

    if (docGrandTotal === 0 && calculatedTaxable > 0) {
        docGrandTotal = docTaxable + docCgst + docSgst + docIgst;
        validatedDoc.grandTotal = buildScore(docGrandTotal, 0.9);
    }

    // Final sanity check
    const tolerance = 2.0; // 2 rupees tolerance for rounding
    const expectedGrandTotal = docTaxable + docCgst + docSgst + docIgst;
    if (Math.abs(docGrandTotal - expectedGrandTotal) > tolerance) {
        // Flag for review if mismatch
        validatedDoc.grandTotal = buildScore(docGrandTotal, 0.5); 
    }

    return validatedDoc;
}

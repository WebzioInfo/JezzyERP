import { ParsedDocument, ParsedLineItem, ConfidenceScore } from "./types";

function buildScore(value: any, confidence: number): ConfidenceScore {
    return { value, confidence };
}

export function parseGstInvoice(text: string): Partial<ParsedDocument> {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    // 1. Extract GSTIN
    const gstMatch = text.match(/(?:GSTIN\/UIN|GSTIN|GST)\s*[:.]?\s*([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})/i);
    const vendorGst = gstMatch ? gstMatch[1] : (text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/)?.[0] || "");
    const vendorGstScore = vendorGst ? (gstMatch ? 0.95 : 0.8) : 0;

    // 2. Extract Vendor Name & Address
    const genericHeaders = ["TAX INVOICE", "PROFORMA INVOICE", "INVOICE", "CASH MEMO", "BILL", "ORIGINAL", "DUPLICATE", "ACK NO", "ACK DATE", "IRN", "ACK", "E-WAY", "E-INVOICE"];
    let vendorName = "";
    let vendorAddress = "";
    const businessSuffixes = ["PVT", "LTD", "LIMITED", "INDUSTRIES", "ENTERPRISES", "CORP", "INC", "CO", "SONS", "ASSOCIATES"];
    
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
        const line = lines[i].trim();
        const upperLine = line.toUpperCase();
        
        if (genericHeaders.some(h => upperLine.includes(h)) || 
            line.length < 3 ||
            line.includes("Page") ||
            line.match(/^[0-9\s\-]+$/) ||
            line.match(/GSTIN/i) ||
            line.match(/^[a-f0-9]{10,}$/i) ||
            line.match(/^[A-Z0-9]{10,}$/)
        ) {
            continue;
        }

        if (businessSuffixes.some(s => upperLine.includes(s)) || (!vendorName && line.length > 5)) {
            vendorName = line;
            vendorAddress = lines.slice(i + 1, i + 4).join(", ");
            break;
        }
    }
    const vendorNameScore = vendorName ? (businessSuffixes.some(s => vendorName.toUpperCase().includes(s)) ? 0.9 : 0.6) : 0;

    // 3. Extract Meta Details
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const vendorEmail = emailMatch ? emailMatch[0] : "";

    const phoneMatch = text.match(/(?:Contact|Phone|Mobile|Tel|Ph)\s*[:.]?\s*([0-9]{10,12})/i);
    const vendorPhone = phoneMatch ? phoneMatch[1] : (text.match(/\b\d{10}\b/)?.[0] || "");

    const pinMatch = text.match(/\b\d{3}\s?\d{3}\b/);
    const vendorPin = pinMatch ? pinMatch[0].replace(/\s/g, "") : "";

    const stateMatch = text.match(/(?:State Name|State)\s*[:.]?\s*([A-Za-z\s]+)(?:,|$)/i);
    const vendorState = stateMatch ? stateMatch[1].trim() : "";

    // 4. Extract Invoice No
    let invoiceNo = "";
    const invKeywords = ["Invoice No", "Inv No", "Bill No", "Invoice #", "Inv #", "Inv.", "Voucher No"];
    
    const directInvMatch = text.match(/(?:Invoice No|Inv No|Bill No|Voucher No)\s*[:.]?\s*([A-Za-z0-9\/-]+)/i);
    if (directInvMatch && directInvMatch[1].length > 2) {
        invoiceNo = directInvMatch[1];
    }

    if (!invoiceNo) {
        for (let i = 0; i < lines.length; i++) {
            if (invKeywords.some(k => lines[i].toLowerCase().includes(k.toLowerCase()))) {
                const sameLineMatch = lines[i].match(/(?:No|#)[:.]?\s*([A-Za-z0-9\/-]+)/i);
                if (sameLineMatch && sameLineMatch[1].length > 2) {
                    invoiceNo = sameLineMatch[1];
                } else if (i + 1 < lines.length) {
                    const nextLine = lines[i+1].trim();
                    if (nextLine.match(/^[A-Za-z0-9\/-]+$/) && nextLine.length > 3) {
                        invoiceNo = nextLine;
                    }
                }
                if (invoiceNo) break;
            }
        }
    }
    const invoiceNoScore = invoiceNo ? (directInvMatch ? 0.9 : 0.7) : 0;

    // 5. Extract Date
    let date = "";
    const dateMatch = text.match(/(?:Dated|Date|Date of Issue|Invoice Date)\s*[:.]?\s*(\d{1,2}[-/.\s](?:[A-Za-z]{3}|[0-9]{2,4})[-/.\s]\d{2,4})/i);
    if (dateMatch) {
        const parsedDate = new Date(dateMatch[1].trim());
        if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0];
        } else {
            date = dateMatch[1].trim().replace(/\s/g, '-');
        }
    }
    const dateScore = date ? (dateMatch ? 0.9 : 0.6) : 0;

    // 6. E-Way Bill
    const ewayMatch = text.match(/(?:E-Way Bill No|E-Way Bill|Eway No|Eway|E-Way)\s*[:.]?\s*(\d{12})/i);
    const ewayBill = ewayMatch ? ewayMatch[1] : "";

    // 7. Extract Line Items (Robust Multi-Line Parser)
    const items: ParsedLineItem[] = [];
    
    // Helper to check if a line is just a continuation of description
    const isDescriptionContinuation = (line: string) => {
        // Not a tax line, not a total line, not a purely numeric line, not containing HSN/Qty patterns natively
        if (line.match(/CGST|SGST|IGST|Total|Amount|Balance/i)) return false;
        if (line.match(/^[\d,.\s]+$/)) return false;
        if (line.match(/^\d{4,8}\s+[\d,.]+/)) return false; // Starts with HSN + Qty
        return true;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Single Line Patterns
        const tallyPattern1 = /^(\d+)\s+(.+?)\s+([\d,.]+)\s+(\w+)\s+([\d,.]+)\s+([\d,.]+)\s+(\w+)\s+(\d{4,8})$/;
        const tallyPattern2 = /^(\d+)\s+(.+?)\s+(\d{4,8})\s+([\d,.]+)\s+([a-zA-Z]+)\s+([\d,.]+)\s+([a-zA-Z]+)\s+([\d,.]+)$/;
        
        // Multi-Line Pattern Components
        // Component A: "1 PET PREFORM 690 ( 55 MM ) JAR( CLEAR PLANE)" -> SL and Desc
        const slDescPattern = /^(\d+)\s+(.+)$/;
        // Component B: "39239090 1,200 Nos 110.40 Nos 1,32,480.00" -> HSN Qty Unit Rate Per Amount
        const hsnStatsPattern = /^(\d{4,8})\s+([\d,.]+)\s+([a-zA-Z]+)\s+([\d,.]+)\s+([a-zA-Z]+)\s+([\d,.]+)$/;
        
        let match1 = line.match(tallyPattern1);
        let match2 = line.match(tallyPattern2);
        
        let desc = "", hsn = "", unit = "Nos";
        let qty: number | string = 0, rate: number | string = 0, amount: number | string = 0;
        let matched = false;

        if (match1) {
            [ , , desc, amount as any, , rate as any, qty as any, unit, hsn] = match1;
            matched = true;
        } else if (match2) {
            [ , , desc, hsn, qty as any, unit, rate as any, , amount as any] = match2;
            matched = true;
        } else {
            // Check for multi-line split
            let slMatch = line.match(slDescPattern);
            if (slMatch && i + 1 < lines.length) {
                let statsMatch = lines[i+1].trim().match(hsnStatsPattern);
                if (statsMatch) {
                    desc = slMatch[2].trim();
                    [ , hsn, qty as any, unit, rate as any, , amount as any] = statsMatch;
                    matched = true;
                    i++; // Skip the stats line as we consumed it
                }
            }

            if (!matched) {
                const simpleMatch = line.match(/^(.*?)\s+(\d+)\s+([\d,.]+)\s+([\d,.]+)$/);
                if (simpleMatch && !line.includes("Total") && !line.includes("Amount")) {
                    [ , desc, qty as any, rate as any, amount as any] = simpleMatch;
                    matched = true;
                }
            }
        }

        if (matched && desc) {
            let pkgCount = 1;
            let pkgType = "STANDARD";
            
            // Look ahead for up to 4 lines to find package count and continuation text
            for(let j=1; j<=4; j++) {
                if (i+j < lines.length) {
                    const nextLine = lines[i+j].trim();
                    
                    // Break early if we hit a tax line, a total, or a new line item (starts with a number and has HSN/stats)
                    if (nextLine.match(/CGST|SGST|IGST|Total|Amount/i)) break;
                    if (nextLine.match(/^\d+\s+.+/) && i+j+1 < lines.length && lines[i+j+1].match(hsnStatsPattern)) break;

                    const pkgMatch = nextLine.match(/^\(\s*(\d+)\s*([a-zA-Z]+)\s*\)$/);
                    if (pkgMatch) {
                        pkgCount = parseInt(pkgMatch[1], 10);
                        pkgType = pkgMatch[2].toUpperCase();
                        desc += ` ${nextLine}`; 
                    } else if (isDescriptionContinuation(nextLine)) {
                        // "GREEN"
                        desc += ` ${nextLine}`;
                    } else {
                        break;
                    }
                }
            }

            items.push({
                description: buildScore(desc.trim(), 0.9),
                hsn: buildScore(hsn, hsn ? 0.9 : 0),
                qty: buildScore(parseFloat(String(qty).replace(/,/g, '')) || 0, 0.9),
                rate: buildScore(parseFloat(String(rate).replace(/,/g, '')) || 0, 0.9),
                amount: buildScore(parseFloat(String(amount).replace(/,/g, '')) || 0, 0.9),
                unit: buildScore(unit, 0.8),
                pkgCount: buildScore(pkgCount, pkgCount > 1 ? 0.9 : 0.5),
                pkgType: buildScore(pkgType, pkgCount > 1 ? 0.9 : 0.5),
                taxPercent: buildScore(18, 0.5)
            });
        }
    }

    // 8. Extract Taxes
    let cgst = 0, sgst = 0, igst = 0;
    const cgstMatch = text.match(/CGST.*?([\d,.]+)\s*$/im);
    if (cgstMatch) cgst = parseFloat(cgstMatch[1].replace(/,/g, ''));
    
    const sgstMatch = text.match(/SGST.*?([\d,.]+)\s*$/im);
    if (sgstMatch) sgst = parseFloat(sgstMatch[1].replace(/,/g, ''));
    
    const igstMatch = text.match(/IGST.*?([\d,.]+)\s*$/im);
    if (igstMatch) igst = parseFloat(igstMatch[1].replace(/,/g, ''));

    // 9. Extract Grand Total
    let grandTotal = 0;
    const totalMatch = text.match(/(?:Grand Total|Total Amount|Total)\s*(?:Rs\.?|INR|₹)?\s*([\d,.]+)/i);
    if (totalMatch) grandTotal = parseFloat(totalMatch[1].replace(/,/g, ''));

    return {
        vendorName: buildScore(vendorName, vendorNameScore),
        vendorGst: buildScore(vendorGst, vendorGstScore),
        vendorAddress: buildScore(vendorAddress, vendorAddress ? 0.8 : 0),
        vendorEmail: buildScore(vendorEmail, vendorEmail ? 0.9 : 0),
        vendorPhone: buildScore(vendorPhone, vendorPhone ? 0.9 : 0),
        vendorPin: buildScore(vendorPin, vendorPin ? 0.9 : 0),
        vendorState: buildScore(vendorState, vendorState ? 0.8 : 0),
        invoiceNo: buildScore(invoiceNo, invoiceNoScore),
        date: buildScore(date || new Date().toISOString().split('T')[0], dateScore),
        ewayBill: buildScore(ewayBill, ewayBill ? 0.9 : 0),
        items: items,
        cgst: buildScore(cgst, cgst ? 0.8 : 0),
        sgst: buildScore(sgst, sgst ? 0.8 : 0),
        igst: buildScore(igst, igst ? 0.8 : 0),
        grandTotal: buildScore(grandTotal, grandTotal ? 0.8 : 0)
    };
}

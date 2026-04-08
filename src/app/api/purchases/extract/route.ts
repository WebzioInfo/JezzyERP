import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { createWorker } from "tesseract.js";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // OCR Processing
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(buffer);
        await worker.terminate();

        console.log("[OCR_RAW_TEXT]", text);

        // Advanced Parsing Logic (Regex)
        const parsedData = parseBillText(text);

        return NextResponse.json({ 
            success: true, 
            data: parsedData,
            raw: text.substring(0, 500) // For debugging
        });

    } catch (error: any) {
        console.error("[EXTRACT_API_ERROR]", error);
        return NextResponse.json({ error: error.message || "Failed to process bill" }, { status: 500 });
    }
}

function parseBillText(text: string) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    
    // 1. Extract GSTIN (15 characters)
    const gstMatch = text.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/);
    const vendorGst = gstMatch ? gstMatch[0] : "";

    // 2. Extract Invoice No
    const invMatch = text.match(/(?:Invoice|Inv|Bill)\s*(?:No|#)[:.]?\s*([A-Za-z0-9/-]+)/i);
    const invoiceNo = invMatch ? invMatch[1] : "";

    // 3. Extract Date
    const dateMatch = text.match(/(?:\d{2}[-/.]\d{2}[-/.]\d{2,4})|(?:\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/);
    const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    // 4. Extract Line Items (Toughest part with Tesseract)
    // We look for patterns: [Description] [HSN] [Qty] [Rate] [Amount]
    const items: any[] = [];
    
    // Simple heuristic: Line with numeric values at the end is likely an item
    lines.forEach(line => {
        const parts = line.split(/\s{2,}/); // Try splitting by multiple spaces
        if (parts.length >= 3) {
            const lastPart = parts[parts.length - 1].replace(/,/g, '');
            const secondLast = parts[parts.length - 2].replace(/,/g, '');
            
            if (!isNaN(parseFloat(lastPart)) && !isNaN(parseFloat(secondLast))) {
                items.push({
                    description: parts[0],
                    hsn: parts.find(p => p.length === 8 && /^\d+$/.test(p)) || "",
                    qty: parseFloat(secondLast),
                    rate: parseFloat(parts[parts.length - 3]?.replace(/,/g, '') || "0"),
                    amount: parseFloat(lastPart)
                });
            }
        }
    });

    return {
        vendorGst,
        invoiceNo,
        date,
        items: items.slice(0, 15) // Limit to first 15 detections
    };
}

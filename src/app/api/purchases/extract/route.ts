import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { createWorker } from "tesseract.js";
import { GoogleGenAI } from "@google/genai";
import { 
    classifyDocument, 
    parseGstInvoice, 
    validateFinances,
    ParsedDocument
} from "@/lib/parsers";

function buildScore(value: any, confidence: number) {
    return { value, confidence };
}

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const companyGstStateCode = formData.get("companyGstStateCode") as string || "29";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        let text = "";

        if (file.type === "application/pdf") {
            const { PDFParse } = await import('pdf-parse');
            const path = await import('path');
            const url = await import('url');
            
            const workerAbsPath = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
            const workerUrl = url.pathToFileURL(workerAbsPath).href;
            PDFParse.setWorker(workerUrl);

            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            text = result.text;
        } else {
            const path = await import('path');
            const workerPath = path.resolve(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js');
            
            const worker = await createWorker('eng', 1, {
                workerPath: workerPath,
            });
            const { data: { text: ocrText } } = await worker.recognize(buffer);
            text = ocrText;
            await worker.terminate();
        }

        const classification = classifyDocument(text);
        let parsedData: Partial<ParsedDocument> = {};

        // Dynamic Parsing using LLM (Gemini API) if configured
        if (process.env.GEMINI_API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                
                const prompt = `
Extract the following information from the provided purchase bill text. Return ONLY a valid JSON object matching this strict schema:
{
  "vendorName": { "value": "string", "confidence": number },
  "vendorGst": { "value": "string (15 chars, standard GSTIN)", "confidence": number },
  "vendorAddress": { "value": "string", "confidence": number },
  "vendorEmail": { "value": "string", "confidence": number },
  "vendorPhone": { "value": "string", "confidence": number },
  "vendorPin": { "value": "string", "confidence": number },
  "vendorState": { "value": "string", "confidence": number },
  "invoiceNo": { "value": "string", "confidence": number },
  "date": { "value": "string (YYYY-MM-DD)", "confidence": number },
  "ewayBill": { "value": "string (12 digits or empty)", "confidence": number },
  "subTotal": { "value": number (taxable value), "confidence": number },
  "cgst": { "value": number (total tax amount, NOT percentage), "confidence": number },
  "sgst": { "value": number (total tax amount, NOT percentage), "confidence": number },
  "igst": { "value": number (total tax amount, NOT percentage), "confidence": number },
  "grandTotal": { "value": number, "confidence": number },
  "items": [
    {
      "description": { "value": "string", "confidence": number },
      "hsn": { "value": "string", "confidence": number },
      "qty": { "value": number, "confidence": number },
      "rate": { "value": number, "confidence": number },
      "amount": { "value": number, "confidence": number },
      "unit": { "value": "string", "confidence": number },
      "pkgCount": { "value": number, "confidence": number },
      "pkgType": { "value": "string", "confidence": number },
      "taxPercent": { "value": number, "confidence": number }
    }
  ]
}

If a field is not found, leave it as an empty string ("") or an empty array ([]). Do not invent data. Provide a confidence score between 0.0 and 1.0 for each field based on extraction clarity.

Extracted Bill Text:
"""
${text}
"""
                `;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                    }
                });
                
                const jsonText = response.text || "{}";
                parsedData = JSON.parse(jsonText);
            } catch (aiError) {
                console.error("[GEMINI_EXTRACTION_ERROR]", aiError);
                // Fallback to static parsing
                parsedData = parseGstInvoice(text);
            }
        } else {
            // Static parsing if no LLM configured
            parsedData = parseGstInvoice(text);
        }

        parsedData.documentType = { value: classification.type, confidence: classification.confidence };

        // Validate and auto-correct financial errors
        const validatedData = validateFinances(parsedData, companyGstStateCode);

        return NextResponse.json({ 
            success: true, 
            data: validatedData
        });

    } catch (error: any) {
        console.error("[EXTRACT_API_ERROR]", error);
        return NextResponse.json({ error: error.message || "Failed to process bill" }, { status: 500 });
    }
}

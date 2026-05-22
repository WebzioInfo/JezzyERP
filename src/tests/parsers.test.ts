import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Compile TypeScript files using ts-node or similar in a real environment.
// For this quick test script, we'll assume it's run with tsx or ts-node.
import { classifyDocument, parseGstInvoice, validateFinances } from '../lib/parsers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturePath = path.join(__dirname, 'fixtures', 'invoices', 'proforma.txt');
const text = fs.readFileSync(fixturePath, 'utf-8');

console.log("=== Testing Classification ===");
const classification = classifyDocument(text);
console.log(classification);
if (classification.type !== "PROFORMA INVOICE") {
    console.error("❌ Classification Failed!");
    process.exit(1);
}

console.log("\n=== Testing Parsing ===");
const parsed = parseGstInvoice(text);
parsed.documentType = { value: classification.type, confidence: classification.confidence };

console.log("Invoice No:", parsed.invoiceNo);
console.log("Vendor Name:", parsed.vendorName);
console.log("GSTIN:", parsed.vendorGst);
console.log("Date:", parsed.date);
console.log("Items:", parsed.items?.length);
if (parsed.items && parsed.items.length > 0) {
    console.log("Item 1:", parsed.items[0]);
}
console.log("Taxes:", { cgst: parsed.cgst, sgst: parsed.sgst, igst: parsed.igst });
console.log("Grand Total:", parsed.grandTotal);

console.log("\n=== Testing Financial Validation ===");
const validated = validateFinances(parsed, "29"); // Company in Karnataka
console.log("Taxable (Subtotal):", validated.subTotal);
console.log("CGST:", validated.cgst);
console.log("SGST:", validated.sgst);
console.log("IGST:", validated.igst);
console.log("Grand Total:", validated.grandTotal);

if (validated.items && validated.items.length > 0) {
    const item = validated.items[0];
    if (item.pkgCount?.value !== 40) {
        console.error("❌ Package count extraction failed!");
        process.exit(1);
    }
    if (item.amount?.value !== 132480) {
        console.error("❌ Item amount extraction failed!");
        process.exit(1);
    }
}

if (validated.cgst?.value !== 11923.2) {
    console.error("❌ CGST validation failed!");
    process.exit(1);
}

console.log("\n✅ All Tests Passed!");

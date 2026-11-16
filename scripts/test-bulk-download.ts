import { PDFDocument, rgb } from "pdf-lib";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";

async function createSamplePdf(title: string, numPages: number): Promise<Buffer> {
    const doc = await PDFDocument.create();
    for (let i = 1; i <= numPages; i++) {
        const page = doc.addPage([595.28, 841.89]);
        page.drawText(`${title} - Page ${i}`, {
            x: 50,
            y: 800,
            size: 24,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Sample content for ${title} on page ${i}`, {
            x: 50,
            y: 750,
            size: 14,
            color: rgb(0.3, 0.3, 0.3),
        });
    }
    const bytes = await doc.save();
    return Buffer.from(bytes);
}

// Minimal 1x1 PNG
const SAMPLE_PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
);

async function attachEwayBillTest(
    invoicePdfBuffer: Buffer,
    ewayBytes: Buffer
): Promise<{ buffer: Buffer; pageCount: number }> {
    const isPdf = ewayBytes.length >= 4 &&
        ewayBytes[0] === 0x25 && ewayBytes[1] === 0x50 && ewayBytes[2] === 0x44 && ewayBytes[3] === 0x46; // %PDF
    const isPng = ewayBytes.length >= 8 &&
        ewayBytes[0] === 0x89 && ewayBytes[1] === 0x50 && ewayBytes[2] === 0x4E && ewayBytes[3] === 0x47;

    const mergedDoc = await PDFDocument.create();
    const invoiceDoc = await PDFDocument.load(invoicePdfBuffer);

    // 1. Copy all invoice pages
    const invoicePages = await mergedDoc.copyPages(invoiceDoc, invoiceDoc.getPageIndices());
    invoicePages.forEach(p => mergedDoc.addPage(p));

    // 2. Append E-Way bill
    if (isPdf) {
        const ewayDoc = await PDFDocument.load(ewayBytes);
        const ewayPages = await mergedDoc.copyPages(ewayDoc, ewayDoc.getPageIndices());
        ewayPages.forEach(p => mergedDoc.addPage(p));
    } else if (isPng) {
        const img = await mergedDoc.embedPng(ewayBytes);
        const a4Width = 595.28;
        const a4Height = 841.89;
        const margin = 20;
        const maxWidth = a4Width - (margin * 2);
        const maxHeight = a4Height - (margin * 2);
        const imgDims = img.scaleToFit(maxWidth, maxHeight);
        const x = margin + (maxWidth - imgDims.width) / 2;
        const y = margin + (maxHeight - imgDims.height) / 2;
        const page = mergedDoc.addPage([a4Width, a4Height]);
        page.drawImage(img, { x, y, width: imgDims.width, height: imgDims.height });
    }

    const mergedBytes = await mergedDoc.save();
    const resultDoc = await PDFDocument.load(mergedBytes);
    return {
        buffer: Buffer.from(mergedBytes),
        pageCount: resultDoc.getPageCount()
    };
}

async function runTests() {
    console.log("=== STARTING BULK INVOICE & E-WAY BILL MERGING AUDIT TESTS ===");

    // Scenario A: Invoice with NO E-Way Bill (1 page)
    console.log("\n[TEST A] Invoice with NO E-Way Bill...");
    const invoiceA = await createSamplePdf("INVOICE-001", 1);
    const docA = await PDFDocument.load(invoiceA);
    if (docA.getPageCount() !== 1) throw new Error("Scenario A failed");
    console.log("  ✓ PASS: Scenario A generated 1 page invoice normally.");

    // Scenario B: Invoice + Single-page E-Way Bill PDF
    console.log("\n[TEST B] Invoice + Single-page E-Way Bill PDF...");
    const ewaySinglePage = await createSamplePdf("EWAY-BILL-SINGLE", 1);
    const resultB = await attachEwayBillTest(invoiceA, ewaySinglePage);
    if (resultB.pageCount !== 2) throw new Error(`Scenario B failed: Expected 2 pages, got ${resultB.pageCount}`);
    console.log(`  ✓ PASS: Scenario B merged cleanly (Total pages: ${resultB.pageCount}, Page 1: Invoice, Page 2: E-Way Bill).`);

    // Scenario C: Invoice + Multi-page E-Way Bill PDF (3 pages)
    console.log("\n[TEST C] Invoice + Multi-page E-Way Bill PDF (3 pages)...");
    const ewayMultiPage = await createSamplePdf("EWAY-BILL-MULTI", 3);
    const resultC = await attachEwayBillTest(invoiceA, ewayMultiPage);
    if (resultC.pageCount !== 4) throw new Error(`Scenario C failed: Expected 4 pages, got ${resultC.pageCount}`);
    console.log(`  ✓ PASS: Scenario C merged cleanly (Total pages: ${resultC.pageCount}, Page 1: Invoice, Pages 2-4: E-Way Bill).`);

    // Scenario D: Invoice + PNG Image E-Way Bill
    console.log("\n[TEST D] Invoice + Image E-Way Bill...");
    const resultD = await attachEwayBillTest(invoiceA, SAMPLE_PNG);
    if (resultD.pageCount !== 2) throw new Error(`Scenario D failed: Expected 2 pages, got ${resultD.pageCount}`);
    console.log(`  ✓ PASS: Scenario D merged cleanly (Total pages: ${resultD.pageCount}, Page 1: Invoice, Page 2: Scaled A4 Image).`);

    // Scenario E: ZIP Archive Generation with Duplicate Invoice Names
    console.log("\n[TEST E] Bulk ZIP Archive generation & filename collision prevention...");
    const archive = archiver("zip", { zlib: { level: 9 } });
    const outputDir = path.join(process.cwd(), ".temp_test");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const zipPath = path.join(outputDir, "test_bulk_invoices.zip");
    const outStream = fs.createWriteStream(zipPath);

    const usedNames = new Map<string, number>();
    function getUniqueFileName(baseName: string): string {
        const count = usedNames.get(baseName) || 0;
        usedNames.set(baseName, count + 1);
        if (count === 0) return baseName;
        const dotIndex = baseName.lastIndexOf(".");
        const name = dotIndex !== -1 ? baseName.substring(0, dotIndex) : baseName;
        const ext = dotIndex !== -1 ? baseName.substring(dotIndex) : "";
        return `${name}_(${count})${ext}`;
    }

    archive.pipe(outStream);

    // Append 4 files with 2 duplicate names
    const filesToPack = [
        { name: "JEZZY_01_RELIANCE.pdf", buf: invoiceA },
        { name: "JEZZY_02_TATA.pdf", buf: resultB.buffer },
        { name: "JEZZY_01_RELIANCE.pdf", buf: resultC.buffer }, // Duplicate name!
        { name: "JEZZY_03_ADANI.pdf", buf: resultD.buffer },
    ];

    const packedNames: string[] = [];
    for (const f of filesToPack) {
        const unique = getUniqueFileName(f.name);
        packedNames.push(unique);
        archive.append(f.buf, { name: unique });
    }

    archive.append("JEZZY BULK EXPORT REPORT\nStatus: OK", { name: "EXPORT_SUMMARY.txt" });
    await archive.finalize();

    await new Promise<void>((resolve) => {
        outStream.on("close", () => resolve());
    });

    const zipStat = fs.statSync(zipPath);
    if (zipStat.size === 0) throw new Error("ZIP generation resulted in 0-byte file");

    console.log(`  ✓ PASS: ZIP archive created (${zipStat.size} bytes).`);
    console.log("  ✓ Packed files:", packedNames);
    if (packedNames[2] !== "JEZZY_01_RELIANCE_(1).pdf") {
        throw new Error(`Filename collision check failed: expected JEZZY_01_RELIANCE_(1).pdf, got ${packedNames[2]}`);
    }
    console.log("  ✓ PASS: Duplicate invoice filename collision resolved successfully.");

    // Clean up temp test directory
    fs.rmSync(outputDir, { recursive: true, force: true });

    console.log("\n============================================================");
    console.log(" ALL 5 SCENARIOS VERIFIED 100% SUCCESSFULLY!");
    console.log("============================================================\n");
}

runTests().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});

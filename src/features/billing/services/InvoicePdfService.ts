import "server-only";
import { db } from "@/db/prisma/client";
import { numberToWords } from "@/utils/financials";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

// Helpers for consistent layout
const LEFT_MARGIN = 15;
const RIGHT_MARGIN = 15;
const TEXT_GRAY = [80, 80, 80] as [number, number, number];
const TEXT_BLACK = [0, 0, 0] as [number, number, number];

function fmt(n: number) {
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: Date | string | null) {
    if (!d) return "N/A";
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
}

export type ExportFormat = 'ORIGINAL' | 'THERMAL' | 'PDF';

export interface InvoicePdfResult {
    buffer: Buffer;
    fileName: string;
    hasEwayBill: boolean;
    ewayBillMerged: boolean;
    mergeError?: string;
}

export class InvoicePdfService {
    /**
     * Attaches an E-Way Bill (PDF or Image) to an invoice PDF buffer.
     * Appends the E-Way Bill page(s) after the invoice page(s).
     */
    static async attachEwayBill(
        invoicePdfBuffer: Buffer,
        ewayBillUrl: string
    ): Promise<{ buffer: Buffer; merged: boolean; error?: string }> {
        try {
            let ewayBytes: Buffer;

            // Fetch or read from local disk
            if (ewayBillUrl.startsWith("http://") || ewayBillUrl.startsWith("https://")) {
                const response = await fetch(ewayBillUrl, {
                    headers: { "Accept": "application/pdf,image/*,*/*" },
                    signal: AbortSignal.timeout(15000),
                });
                if (!response.ok) {
                    return {
                        buffer: invoicePdfBuffer,
                        merged: false,
                        error: `Failed to fetch E-Way Bill from URL (HTTP ${response.status})`
                    };
                }
                const arrayBuffer = await response.arrayBuffer();
                ewayBytes = Buffer.from(arrayBuffer);
            } else {
                // Local file path
                const cleanPath = ewayBillUrl.startsWith("/") ? ewayBillUrl.slice(1) : ewayBillUrl;
                const localPath = path.join(process.cwd(), "public", cleanPath);
                if (!fs.existsSync(localPath)) {
                    return {
                        buffer: invoicePdfBuffer,
                        merged: false,
                        error: `E-Way Bill file not found on server: ${cleanPath}`
                    };
                }
                ewayBytes = fs.readFileSync(localPath);
            }

            if (!ewayBytes || ewayBytes.length === 0) {
                return {
                    buffer: invoicePdfBuffer,
                    merged: false,
                    error: "E-Way Bill attachment file is empty"
                };
            }

            // Detect format via magic bytes
            const isPdf = ewayBytes.length >= 4 &&
                ewayBytes[0] === 0x25 && ewayBytes[1] === 0x50 && ewayBytes[2] === 0x44 && ewayBytes[3] === 0x46; // %PDF
            const isJpg = ewayBytes.length >= 3 &&
                ewayBytes[0] === 0xFF && ewayBytes[1] === 0xD8 && ewayBytes[2] === 0xFF;
            const isPng = ewayBytes.length >= 8 &&
                ewayBytes[0] === 0x89 && ewayBytes[1] === 0x50 && ewayBytes[2] === 0x4E && ewayBytes[3] === 0x47;

            const mergedDoc = await PDFDocument.create();
            const invoiceDoc = await PDFDocument.load(invoicePdfBuffer, { ignoreEncryption: true });

            // 1. Copy all invoice pages first (Page 1..N)
            const invoicePages = await mergedDoc.copyPages(invoiceDoc, invoiceDoc.getPageIndices());
            invoicePages.forEach(p => mergedDoc.addPage(p));

            // 2. Append E-Way bill pages
            if (isPdf) {
                const ewayDoc = await PDFDocument.load(ewayBytes, { ignoreEncryption: true });
                const ewayPageIndices = ewayDoc.getPageIndices();
                const ewayPages = await mergedDoc.copyPages(ewayDoc, ewayPageIndices);
                ewayPages.forEach(p => mergedDoc.addPage(p));
            } else if (isJpg || isPng) {
                const img = isJpg
                    ? await mergedDoc.embedJpg(ewayBytes)
                    : await mergedDoc.embedPng(ewayBytes);

                // Standard A4 dimensions in points (72 DPI): 595.28 x 841.89
                const a4Width = 595.28;
                const a4Height = 841.89;
                const margin = 20;
                const maxWidth = a4Width - (margin * 2);
                const maxHeight = a4Height - (margin * 2);

                const imgDims = img.scaleToFit(maxWidth, maxHeight);
                const x = margin + (maxWidth - imgDims.width) / 2;
                const y = margin + (maxHeight - imgDims.height) / 2;

                const page = mergedDoc.addPage([a4Width, a4Height]);
                page.drawImage(img, {
                    x,
                    y,
                    width: imgDims.width,
                    height: imgDims.height,
                });
            } else {
                // Try PDF loading as fallback in case magic bytes differed slightly
                try {
                    const ewayDoc = await PDFDocument.load(ewayBytes, { ignoreEncryption: true });
                    const ewayPages = await mergedDoc.copyPages(ewayDoc, ewayDoc.getPageIndices());
                    ewayPages.forEach(p => mergedDoc.addPage(p));
                } catch {
                    return {
                        buffer: invoicePdfBuffer,
                        merged: false,
                        error: "Unsupported E-Way Bill attachment format (must be PDF, JPG, or PNG)"
                    };
                }
            }

            const mergedBytes = await mergedDoc.save();
            return {
                buffer: Buffer.from(mergedBytes),
                merged: true
            };
        } catch (err: any) {
            console.error("[EWAY_ATTACH_ERROR]", err);
            return {
                buffer: invoicePdfBuffer,
                merged: false,
                error: err?.message || "Failed to merge E-Way Bill"
            };
        }
    }

    /**
     * Generates a tax invoice PDF (with E-Way Bill merged if available).
     */
    static async generateInvoicePdf(
        invoiceId: string,
        format: ExportFormat = 'ORIGINAL'
    ): Promise<InvoicePdfResult> {
        const invoice = await db.invoice.findFirst({
            where: { id: invoiceId, deletedAt: null },
            select: {
                id: true,
                sequenceNumber: true,
                invoiceNo: true,
                date: true,
                gstType: true,
                subTotal: true,
                taxTotal: true,
                grandTotal: true,
                ewayBill: true,
                ewayBillUrl: true,
                vehicleNo: true,
                billingName: true,
                billingAddress1: true,
                billingAddress2: true,
                billingState: true,
                billingPinCode: true,
                billingPhone: true,
                billingGst: true,
                shippingName: true,
                shippingAddress1: true,
                shippingAddress2: true,
                shippingState: true,
                shippingPinCode: true,
                isFreightCollect: true,
                freightAmount: true,
                freightTaxPercent: true,
                client: true,
                lineItems: {
                    orderBy: { id: "asc" },
                    include: { product: true }
                },
            },
        });

        if (!invoice) throw new Error("Invoice not found");

        const settings = await db.companySetting.findFirst() || {
            companyName: "JEZZY ENTERPRISES",
            gstin: "32BMAPJ5504M1Z9",
            address1: "MP 4/3 IIA, MOONIYUR",
            address2: "VELIMUKKU PO, MALAPPURAM DIST",
            city: "Malappuram",
            pincode: "676317",
            phone: "+91 85531 85300",
            email: "jezzyenterprises@gmail.com",
            bankName: "FEDERAL BANK",
            bankBranch: "CHELARI",
            bankAccountNo: "16470200011150 ",
            bankIfsc: "FDRL0001647",
            bankAccountName: "JEZZY ENTERPRISES",
            showPkgDetails: true,
            showLogo: false,
            logoUrl: "logo.png"
        };

        let doc: jsPDF;
        if (format === 'THERMAL') {
            doc = new jsPDF({ unit: "mm", format: [80, 297] }); // Standard 80mm thermal paper
        } else {
            doc = new jsPDF({ unit: "mm", format: "a4" });
        }

        const W = doc.internal.pageSize.getWidth();
        let y = 15;

        // --- COMPANY HEADER ---
        let companyX = LEFT_MARGIN;
        if (settings.showLogo && format !== 'THERMAL') {
            try {
                const logoFileName = settings.logoUrl || "logo.png";
                const logoPath = path.join(process.cwd(), "public", logoFileName);
                if (fs.existsSync(logoPath)) {
                    const ext = path.extname(logoFileName).slice(1).toUpperCase() || "PNG";
                    const logoData = fs.readFileSync(logoPath).toString("base64");
                    doc.addImage(logoData, ext, LEFT_MARGIN, 10, 30, 20);
                    companyX = LEFT_MARGIN + 35;
                }
            } catch (err) {
                console.error("[LOGO_ERROR]", err);
            }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(format === 'THERMAL' ? 12 : 18);
        doc.setTextColor(...TEXT_BLACK);
        doc.text(
            settings.companyName.toUpperCase(),
            format === 'THERMAL' ? W / 2 : companyX,
            format === 'THERMAL' ? y : 16,
            format === 'THERMAL' ? { align: 'center' } : {}
        );

        if (format === 'THERMAL') y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(format === 'THERMAL' ? 8 : 8.5);
        doc.setTextColor(...TEXT_GRAY);
        if (format === 'THERMAL') {
            doc.text(`${settings.address1}`, W / 2, y, { align: 'center' }); y += 4;
            doc.text(`${settings.city} - ${settings.pincode}`, W / 2, y, { align: 'center' }); y += 4;
            doc.text(`GSTIN: ${settings.gstin}`, W / 2, y, { align: 'center' }); y += 6;
        } else {
            doc.text(`${settings.address1}, ${settings.address2 || ""}`, companyX, 22);
            doc.text(`${settings.city} - ${settings.pincode} | GSTIN: ${settings.gstin}`, companyX, 27);
            doc.text(`Email: ${settings.email} | Mobile: ${settings.phone}`, companyX, 31);
        }

        if (format !== 'THERMAL') {
            // --- TITLE (RIGHT) ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(26);
            doc.setTextColor(...TEXT_BLACK);
            doc.text("TAX INVOICE", W - RIGHT_MARGIN, 22, { align: "right" });

            y = 45;
            doc.setDrawColor(220, 220, 220);
            doc.line(LEFT_MARGIN, y, W - RIGHT_MARGIN, y);
            y += 10;
        } else {
            doc.setDrawColor(200, 200, 200);
            doc.line(5, y, W - 5, y);
            y += 5;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("SALES INVOICE", W / 2, y, { align: 'center' });
            y += 6;
        }

        // --- INVOICE INFO ---
        let infoY = y;
        if (format === 'THERMAL') {
            doc.setFontSize(8);
            doc.text(`Inv No: ${invoice.invoiceNo}`, 5, y); y += 4;
            doc.text(`Date: ${fmtDate(invoice.date)}`, 5, y); y += 6;
        } else {
            const infoX = W - RIGHT_MARGIN;
            const colWidth = 50;
            const drawInfoRow = (label: string, value: string, currentY: number) => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(...TEXT_BLACK);
                doc.text(label, infoX - colWidth, currentY);
                doc.setFont("helvetica", "normal");
                doc.text(value, infoX, currentY, { align: "right" });
                return currentY + 6;
            };

            infoY = drawInfoRow("Invoice No:", invoice.invoiceNo, infoY);
            infoY = drawInfoRow("Date:", fmtDate(invoice.date), infoY);
            if (invoice.ewayBill) infoY = drawInfoRow("E-Way Bill:", invoice.ewayBill, infoY);
            if (invoice.vehicleNo) infoY = drawInfoRow("Vehicle No:", invoice.vehicleNo, infoY);
        }

        // --- BILL TO & SHIP TO ---
        const inv = invoice as any;
        const billing = {
            name: inv.billingName || inv.client?.name,
            address1: inv.billingAddress1 || inv.client?.address1,
            address2: inv.billingAddress2 || inv.client?.address2,
            pinCode: inv.billingPinCode || inv.client?.pinCode,
            gst: inv.billingGst || inv.client?.gst
        };

        if (format === 'THERMAL') {
            doc.setFont("helvetica", "bold");
            doc.text("CUSTOMER:", 5, y); y += 4;
            doc.setFont("helvetica", "normal");
            doc.text(billing.name || "N/A", 5, y); y += 4;
            if (billing.gst) { doc.text(`GST: ${billing.gst}`, 5, y); y += 4; }
            y += 2;
            doc.line(5, y, W - 5, y);
            y += 5;
        } else {
            let addrY = y;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...TEXT_BLACK);
            doc.text("BILL TO", LEFT_MARGIN, addrY);

            const shipX = LEFT_MARGIN + (W - LEFT_MARGIN - RIGHT_MARGIN) / 3;
            doc.text("SHIP TO", shipX, addrY);
            addrY += 6;

            const drawAddress = (x: number, startY: number, addr: any) => {
                let currentY = startY;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(...TEXT_BLACK);

                const nameLines = doc.splitTextToSize(addr.name || "N/A", 65);
                doc.text(nameLines, x, currentY);
                currentY += (nameLines.length * 5);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(...TEXT_GRAY);
                if (addr.address1) {
                    const add1Lines = doc.splitTextToSize(addr.address1, 65);
                    doc.text(add1Lines, x, currentY);
                    currentY += (add1Lines.length * 4.5);
                }
                if (addr.address2 || addr.pinCode) {
                    const combined = `${addr.address2 || ""}${addr.address2 && addr.pinCode ? ", " : ""}${addr.pinCode || ""}`;
                    if (combined.trim()) {
                        const add2Lines = doc.splitTextToSize(combined, 65);
                        doc.text(add2Lines, x, currentY);
                        currentY += (add2Lines.length * 4.5);
                    }
                }
                if (addr.gst) {
                    doc.text(`GSTIN: ${addr.gst}`, x, currentY);
                    currentY += 4.5;
                }
                return currentY;
            };

            const shipping = {
                name: inv.shippingName || billing.name,
                address1: inv.shippingAddress1 || billing.address1,
                address2: inv.shippingAddress2 || billing.address2,
                pinCode: inv.shippingPinCode || billing.pinCode,
                gst: inv.billingGst || inv.client?.gst
            };

            const bFinalY = drawAddress(LEFT_MARGIN, addrY, billing);
            const sFinalY = drawAddress(shipX, addrY, shipping);
            y = Math.max(infoY, bFinalY, sFinalY) + 12;
        }

        // --- LINE ITEMS & PRODUCTS ---
        const lineItems = (invoice as any).lineItems || [];
        const productIds = lineItems.map((li: any) => li.productId).filter(Boolean);
        const productsRaw = await db.product.findMany({
            where: { id: { in: productIds } }
        });
        const productMap = new Map(productsRaw.map((p: any) => [p.id, p]));

        // --- HSN Summary Data Preparation ---
        const hsnSummaryMap = new Map();
        lineItems.forEach((item: any) => {
            const hsn = item.hsn || "N/A";
            const taxableValue = item.qty * item.rate.toNumber();
            const taxAmount = item.taxAmount.toNumber();
            const taxPercent = item.taxPercent.toNumber();

            if (!hsnSummaryMap.has(hsn)) {
                hsnSummaryMap.set(hsn, { hsn, taxableValue: 0, taxAmount: 0, taxPercent });
            }
            const existing = hsnSummaryMap.get(hsn);
            existing.taxableValue += taxableValue;
            existing.taxAmount += taxAmount;
        });

        const freightVal = invoice.freightAmount?.toNumber() || 0;
        const fTaxPercent = invoice.freightTaxPercent?.toNumber() || 0;

        if (freightVal > 0) {
            const fTax = (freightVal * fTaxPercent) / 100;
            hsnSummaryMap.set("FREIGHT", { hsn: "Freight Charges", taxableValue: freightVal, taxAmount: fTax, taxPercent: fTaxPercent });
        }

        const showPkg = !!(settings as any).showPkgDetails && format !== 'THERMAL';

        if (format === 'THERMAL') {
            const tableHead = [["Item", "Qty", "Rate", "Amt"]];
            const tableBody = lineItems.map((item: any) => [
                item.description.toUpperCase(),
                Number(item.qty).toString(),
                fmt(item.rate.toNumber()),
                fmt(item.qty * item.rate.toNumber())
            ]);

            autoTable(doc, {
                startY: y,
                head: tableHead,
                body: tableBody,
                theme: "plain",
                headStyles: { fontSize: 7, fontStyle: "bold", halign: 'center' },
                bodyStyles: { fontSize: 7, halign: 'right' },
                columnStyles: { 0: { halign: 'left', cellWidth: 35 } },
                margin: { left: 5, right: 5 },
            });
            // @ts-ignore
            y = doc.lastAutoTable.finalY + 5;
        } else {
            const tableHead = showPkg
                ? [["Sl No", "No. & Kind\nof Pkgs", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"]]
                : [["Sl No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"]];

            const tableBody = lineItems.map((item: any, i: number) => {
                const prod = productMap.get(item.productId) as any;
                const productName = prod?.description || item.description || "N/A";

                const subTitle = (item.description && item.description !== prod?.description)
                    ? `\n${item.description}`
                    : (prod?.notes ? `\n${prod.notes}` : "");

                const pkgCountStr = Number(item.pkgCount || 0);
                const rawPerBox = (Number(item.qtyPerBox || 0) > 0) ? item.qtyPerBox : (prod?.qtyPerBox || 0);

                const perBox = (rawPerBox && typeof rawPerBox === 'object' && 'toNumber' in rawPerBox)
                    ? (rawPerBox as any).toNumber()
                    : Number(rawPerBox || 0);

                const pkgTypeRaw = (item.pkgType || "BOX").toUpperCase();
                const pkgType = pkgCountStr > 1
                    ? (pkgTypeRaw.endsWith('X') ? `${pkgTypeRaw}ES` : `${pkgTypeRaw}S`)
                    : pkgTypeRaw;

                const pkgValue = (pkgCountStr > 0 && perBox > 0)
                    ? `${pkgCountStr} ${pkgType}\nX ${perBox} ${item.unit || prod?.unit || "NOS"}`
                    : (pkgCountStr > 0 ? `${pkgCountStr} ${pkgType}` : "-");

                const pkgInDesc = (!showPkg && pkgCountStr > 0)
                    ? `\nNo. & Kind of Pkgs: ${pkgValue}`
                    : "";

                const row = [
                    String(i + 1),
                    ...(showPkg ? [pkgValue] : []),
                    `${productName.toUpperCase()}${subTitle}${pkgInDesc}`,
                    item.hsn || "-",
                    `${Number(item.qty).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} ${item.unit || "NOS"}`,
                    fmt(item.rate.toNumber()),
                    item.unit || "NOS",
                    fmt(item.qty * item.rate.toNumber()),
                ];
                return row;
            });

            autoTable(doc, {
                startY: y,
                head: tableHead,
                body: tableBody,
                theme: "grid",
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    fontStyle: "bold",
                    lineWidth: 0.1,
                    halign: "center",
                },
                bodyStyles: {
                    fontSize: 7.5,
                    textColor: [0, 0, 0],
                    cellPadding: 2,
                    valign: "middle",
                },
                columnStyles: showPkg ? {
                    0: { halign: "center", cellWidth: 10 },
                    1: { halign: "center", cellWidth: 18, fontSize: 6, cellPadding: 1, overflow: 'linebreak' },
                    2: { halign: "left" },
                    3: { halign: "center", cellWidth: 20 },
                    4: { halign: "right", cellWidth: 22 },
                    5: { halign: "right", cellWidth: 20 },
                    6: { halign: "center", cellWidth: 12 },
                    7: { halign: "right", cellWidth: 28 },
                } : {
                    0: { halign: "center", cellWidth: 10 },
                    1: { halign: "left" },
                    2: { halign: "center", cellWidth: 20 },
                    3: { halign: "right", cellWidth: 22 },
                    4: { halign: "right", cellWidth: 20 },
                    5: { halign: "center", cellWidth: 12 },
                    6: { halign: "right", cellWidth: 28 },
                },
                margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
            });
            // @ts-ignore
            y = doc.lastAutoTable.finalY + 5;
        }

        // --- TOTALS & GST ---
        const gstType = invoice.gstType || "CGST_SGST";
        const subTotal = invoice.subTotal.toNumber();
        const taxVal = invoice.taxTotal.toNumber();
        let cgst = 0, sgst = 0, igst = 0;
        if (gstType === "CGST_SGST") {
            cgst = taxVal / 2;
            sgst = taxVal / 2;
        } else {
            igst = taxVal;
        }
        const grandTotal = invoice.grandTotal.toNumber();
        const rawGrandTotal = subTotal + taxVal;
        const rounded = grandTotal;
        const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

        if (format === 'THERMAL') {
            doc.setFont("helvetica", "bold");
            doc.text(`Sub Total:`, W - 35, y, { align: 'right' }); doc.text(fmt(subTotal), W - 5, y, { align: 'right' }); y += 4;
            doc.text(`Tax Total:`, W - 35, y, { align: 'right' }); doc.text(fmt(taxVal), W - 5, y, { align: 'right' }); y += 4;
            doc.setFontSize(10);
            doc.text(`GRAND TOTAL:`, W - 35, y, { align: 'right' }); doc.text(`Rs.${fmt(grandTotal)}`, W - 5, y, { align: 'right' }); y += 8;
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text("Thank you for your business!", W / 2, y, { align: 'center' });
        } else {
            // Sum and Totals Row inside the main table Area
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.text("Total", LEFT_MARGIN + 115, y, { align: "right" });
            doc.text(`${fmt(subTotal)}`, W - RIGHT_MARGIN, y, { align: "right" });
            y += 8;

            // --- HSN/SAC SUMMARY TABLE ---
            const hsnHead = [["HSN/SAC", "Taxable Value", `${gstType === 'IGST' ? 'IGST' : 'CGST'} Rate`, `${gstType === 'IGST' ? 'IGST' : 'CGST'} Amt`, `${gstType === 'IGST' ? '' : 'SGST Rate'}`, `${gstType === 'IGST' ? '' : 'SGST Amt'}`, "Total Tax"]];
            const hsnBody = Array.from(hsnSummaryMap.values()).map(h => {
                const igstRate = h.taxPercent;
                const cgstRate = h.taxPercent / 2;
                if (gstType === 'IGST') {
                    return [h.hsn, fmt(h.taxableValue), `${igstRate}%`, fmt(h.taxAmount), "", "", fmt(h.taxAmount)];
                } else {
                    return [h.hsn, fmt(h.taxableValue), `${cgstRate}%`, fmt(h.taxAmount / 2), `${cgstRate}%`, fmt(h.taxAmount / 2), fmt(h.taxAmount)];
                }
            });

            doc.setFontSize(8.5);
            doc.text("HSN/SAC Summary", LEFT_MARGIN, y);
            y += 4;

            const hsnTableHeight = (hsnBody.length + 1) * 7.5;
            if (y + hsnTableHeight > 270) {
                doc.addPage();
                y = 15;
                doc.text("HSN/SAC Summary (cont.)", LEFT_MARGIN, y);
                y += 4;
            }

            autoTable(doc, {
                startY: y,
                head: hsnHead,
                body: hsnBody,
                theme: "grid",
                headStyles: {
                    fontSize: 7.5,
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    halign: "center",
                    lineWidth: 0.1,
                    fontStyle: "bold"
                },
                bodyStyles: {
                    fontSize: 7,
                    halign: "right",
                    lineWidth: 0.1,
                    textColor: [0, 0, 0]
                },
                columnStyles: { 0: { halign: "center" } },
                margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
            });

            // @ts-ignore
            y = doc.lastAutoTable.finalY + 8;

            // --- TOTALS (RIGHT) ---
            const totalsX = W - RIGHT_MARGIN;
            const totalLabelOffset = 70;

            const drawTotalRow = (label: string, val: string, isBold = false) => {
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                doc.setFontSize(isBold ? 10.5 : 9);
                doc.setTextColor(...TEXT_BLACK);
                doc.text(label, totalsX - totalLabelOffset, y);
                doc.text(val, totalsX, y, { align: "right" });
                y += 6;
            };

            const itemsSubTotal = subTotal - freightVal;
            drawTotalRow("Taxable Amount (Items):", fmt(itemsSubTotal));
            if (freightVal > 0) {
                drawTotalRow(`Freight Amount ${invoice.isFreightCollect ? '(Collect)' : ''}:`, fmt(freightVal));
            }

            if (cgst > 0) drawTotalRow("Output CGST @ " + (lineItems[0]?.taxPercent.toNumber() / 2) + "%:", fmt(cgst));
            if (sgst > 0) drawTotalRow("Output SGST @ " + (lineItems[0]?.taxPercent.toNumber() / 2) + "%:", fmt(sgst));
            if (igst > 0) drawTotalRow("Output IGST @ " + (lineItems[0]?.taxPercent.toNumber()) + "%:", fmt(igst));

            if (Math.abs(roundOff) > 0) {
                drawTotalRow("Rounding Off:", (roundOff > 0 ? "+" : "") + fmt(roundOff));
            }

            y += 2;
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.line(totalsX - totalLabelOffset - 10, y - 5, totalsX, y - 5);
            drawTotalRow("TOTAL AMOUNT:", `Rs. ${fmt(rounded)}`, true);

            // --- FOOTER PROTECTION: Ensure words and bank details fit ---
            const blockHeightNeeded = 60;
            if (y + blockHeightNeeded > 275) {
                doc.addPage();
                y = 15;
            }

            y += 10;

            // --- AMOUNT IN WORDS (LEFT) ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...TEXT_BLACK);
            doc.text(`Amount Chargeable (in words):`, LEFT_MARGIN, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            const amtWordsLines = doc.splitTextToSize(`INR ${numberToWords(rounded)}`, W - LEFT_MARGIN - RIGHT_MARGIN);
            doc.text(amtWordsLines, LEFT_MARGIN, y);
            y += (amtWordsLines.length * 5) + 5;

            doc.setFont("helvetica", "bold");
            doc.text(`Tax Amount (in words):`, LEFT_MARGIN, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            const taxWordsLines = doc.splitTextToSize(`INR ${numberToWords(taxVal)}`, W - LEFT_MARGIN - RIGHT_MARGIN);
            doc.text(taxWordsLines, LEFT_MARGIN, y);
            y += (taxWordsLines.length * 5) + 10;

            // --- BANK DETAILS & SIGNATURE ---
            const bottomY = y;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(...TEXT_BLACK);
            doc.text("BANK DETAILS", LEFT_MARGIN, bottomY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            let bY = bottomY + 6;
            doc.text(`A/C Name: ${settings.bankAccountName}`, LEFT_MARGIN, bY); bY += 4.5;
            doc.text(`Bank: ${settings.bankName}`, LEFT_MARGIN, bY); bY += 4.5;
            doc.text(`Branch: ${settings.bankBranch}`, LEFT_MARGIN, bY); bY += 4.5;
            doc.text(`A/C No: ${settings.bankAccountNo}`, LEFT_MARGIN, bY); bY += 4.5;
            doc.text(`IFSC: ${settings.bankIfsc}`, LEFT_MARGIN, bY);

            const sigX = W - RIGHT_MARGIN;
            doc.setFont("helvetica", "bold");
            doc.text(`For ${settings.companyName.toUpperCase()}`, sigX, bottomY + 6, { align: "right" });

            doc.setDrawColor(180, 180, 180);
            doc.line(sigX - 45, bottomY + 30, sigX, bottomY + 30);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.text("Authorised Signatory", sigX, bottomY + 35, { align: "right" });

            // Computer-generated disclaimer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                "This is a computer-generated invoice. No signature is required.",
                W / 2, 285, { align: "center" }
            );
        }

        let finalBuffer: Buffer = Buffer.from(doc.output("arraybuffer"));
        let ewayBillMerged = false;
        let mergeError: string | undefined;

        // Automatically merge E-Way bill PDF/image if attached and not thermal
        if (invoice.ewayBillUrl && format !== 'THERMAL') {
            const mergeResult = await this.attachEwayBill(finalBuffer, invoice.ewayBillUrl);
            finalBuffer = mergeResult.buffer;
            ewayBillMerged = mergeResult.merged;
            mergeError = mergeResult.error;
        }

        const seqNum = String(invoice.sequenceNumber || 1).padStart(2, '0');
        const clientName = (invoice.client?.name || inv.billingName || "CLIENT").split(" ")[0].toUpperCase();
        const safeFileName = `JEZZY_${seqNum}_${clientName}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');

        return {
            buffer: finalBuffer,
            fileName: safeFileName,
            hasEwayBill: Boolean(invoice.ewayBillUrl),
            ewayBillMerged,
            mergeError
        };
    }
}

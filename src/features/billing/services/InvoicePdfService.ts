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

export class InvoicePdfService {
    static async generateInvoicePdf(invoiceId: string, format: ExportFormat = 'ORIGINAL'): Promise<{ buffer: Buffer, fileName: string }> {
        const invoice = await db.invoice.findFirst({
            where: { id: invoiceId, deletedAt: null },
            include: {
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
        doc.text(settings.companyName.toUpperCase(), format === 'THERMAL' ? W/2 : companyX, format === 'THERMAL' ? y : 16, format === 'THERMAL' ? { align: 'center' } : {});
        
        if (format === 'THERMAL') y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(format === 'THERMAL' ? 8 : 8.5);
        doc.setTextColor(...TEXT_GRAY);
        if (format === 'THERMAL') {
            doc.text(`${settings.address1}`, W/2, y, { align: 'center' }); y += 4;
            doc.text(`${settings.city} - ${settings.pincode}`, W/2, y, { align: 'center' }); y += 4;
            doc.text(`GSTIN: ${settings.gstin}`, W/2, y, { align: 'center' }); y += 6;
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
            doc.text("SALES INVOICE", W/2, y, { align: 'center' });
            y += 6;
        }

        // --- INVOICE INFO ---
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

            let infoY = y;
            infoY = drawInfoRow("Invoice No:", invoice.invoiceNo, infoY);
            infoY = drawInfoRow("Date:", fmtDate(invoice.date), infoY);
            if (invoice.ewayBill) infoY = drawInfoRow("E-Way Bill:", invoice.ewayBill, infoY);
            if (invoice.vehicleNo) infoY = drawInfoRow("Vehicle No:", invoice.vehicleNo, infoY);
        }

        // --- BILL TO ---
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
                doc.text(addr.name || "N/A", x, currentY);
                currentY += 5;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(...TEXT_GRAY);
                if (addr.address1) { doc.text(addr.address1, x, currentY); currentY += 4.5; }
                if (addr.address2 || addr.pinCode) {
                    doc.text(`${addr.address2 || ""}${addr.address2 && addr.pinCode ? ", " : ""}${addr.pinCode || ""}`, x, currentY);
                    currentY += 4.5;
                }
                if (addr.gst) { doc.text(`GSTIN: ${addr.gst}`, x, currentY); currentY += 4.5; }
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
            y = Math.max(y + 24, bFinalY, sFinalY) + 12;
        }

        // --- LINE ITEMS ---
        const lineItems = (invoice as any).lineItems || [];
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
                const row = [
                    String(i + 1),
                    ...(showPkg ? [item.pkgCount > 0 ? `${item.pkgCount} ${item.pkgType}` : "-"] : []),
                    item.description.toUpperCase(),
                    item.hsn || "-",
                    `${Number(item.qty).toLocaleString('en-IN')} ${item.unit || "NOS"}`,
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
                headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 8, fontStyle: "bold", lineWidth: 0.1, halign: "center" },
                bodyStyles: { fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 2, valign: "middle" },
                margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
            });
            // @ts-ignore
            y = doc.lastAutoTable.finalY + 5;
        }

        // --- TOTALS ---
        const subTotal = invoice.subTotal.toNumber();
        const taxTotal = invoice.taxTotal.toNumber();
        const grandTotal = invoice.grandTotal.toNumber();

        if (format === 'THERMAL') {
            doc.setFont("helvetica", "bold");
            doc.text(`Sub Total:`, W - 35, y, { align: 'right' }); doc.text(fmt(subTotal), W - 5, y, { align: 'right' }); y += 4;
            doc.text(`Tax Total:`, W - 35, y, { align: 'right' }); doc.text(fmt(taxTotal), W - 5, y, { align: 'right' }); y += 4;
            doc.setFontSize(10);
            doc.text(`GRAND TOTAL:`, W - 35, y, { align: 'right' }); doc.text(`Rs.${fmt(grandTotal)}`, W - 5, y, { align: 'right' }); y += 8;
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text("Thank you for your business!", W/2, y, { align: 'center' });
        } else {
            const totalsX = W - RIGHT_MARGIN;
            const drawTotalRow = (label: string, val: string, isBold = false) => {
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                doc.setFontSize(isBold ? 10.5 : 9);
                doc.text(label, totalsX - 70, y);
                doc.text(val, totalsX, y, { align: "right" });
                y += 6;
            };

            drawTotalRow("Sub Total:", fmt(subTotal));
            drawTotalRow("Tax Total:", fmt(taxTotal));
            y += 2;
            doc.line(totalsX - 80, y - 5, totalsX, y - 5);
            drawTotalRow("TOTAL AMOUNT:", `Rs. ${fmt(grandTotal)}`, true);

            y += 10;
            doc.setFont("helvetica", "bold");
            doc.text(`Amount in Words:`, LEFT_MARGIN, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.text(`INR ${numberToWords(grandTotal)}`, LEFT_MARGIN, y, { maxWidth: W - 30 });
        }

        let finalBuffer = Buffer.from(doc.output("arraybuffer"));

        // Handle Merging if E-Way bill exists and not thermal
        if (invoice.ewayBillUrl && format !== 'THERMAL') {
            try {
                const ewayBillResponse = await fetch(invoice.ewayBillUrl);
                if (ewayBillResponse.ok) {
                    const ewayBillBuffer = await ewayBillResponse.arrayBuffer();
                    const mergedPdf = await PDFDocument.create();
                    const invoiceDoc = await PDFDocument.load(finalBuffer);
                    const ewayBillDoc = await PDFDocument.load(ewayBillBuffer);

                    const invoicePages = await mergedPdf.copyPages(invoiceDoc, invoiceDoc.getPageIndices());
                    invoicePages.forEach(p => mergedPdf.addPage(p));
                    const ewayBillPages = await mergedPdf.copyPages(ewayBillDoc, ewayBillDoc.getPageIndices());
                    ewayBillPages.forEach(p => mergedPdf.addPage(p));

                    const mergedBytes = await mergedPdf.save();
                    finalBuffer = Buffer.from(mergedBytes);
                }
            } catch (err) { console.error("[MERGE_ERROR]", err); }
        }

        const clientName = (invoice.client?.name || "CLIENT").split(" ")[0].toUpperCase();
        const safeFileName = `JEZZY_${invoice.invoiceNo}_${clientName}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');

        return { buffer: finalBuffer, fileName: safeFileName };
    }
}

import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { db } from "@/db/prisma/client";
import { numberToWords } from "@/utils/financials";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { invoiceId } = body;

        if (!invoiceId) {
            return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
        }

        const invoice = await db.invoice.findFirst({
            where: { id: invoiceId, deletedAt: null },
            select: {
                id: true,
                invoiceNo: true,
                date: true,
                gstType: true,
                subTotal: true,
                taxTotal: true,
                grandTotal: true,
                ewayBill: true,
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
                client: true,
                lineItems: {
                    orderBy: { id: "asc" }
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

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
            showPkgDetails: true
        };

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
        const grandTotalRaw = invoice.grandTotal.toNumber();
        const rounded = Math.round(grandTotalRaw);
        const roundOff = rounded - grandTotalRaw;

        // Init PDF
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const W = doc.internal.pageSize.getWidth();
        let y = 15;


        // --- COMPANY HEADER (LEFT) ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(...TEXT_BLACK);
        // Position company name to the right of logo if logo exists, or at margin
        const companyX = LEFT_MARGIN;
        doc.text(settings.companyName.toUpperCase(), companyX, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...TEXT_GRAY);
        doc.text(`${settings.address1}, ${settings.address2 || ""}`, companyX, 22);
        doc.text(`${settings.city} - ${settings.pincode} | GSTIN: ${settings.gstin}`, companyX, 27);
        doc.text(`Email: ${settings.email} | Mobile: ${settings.phone}`, companyX, 31);

        // --- TITLE (RIGHT) ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.setTextColor(...TEXT_BLACK);
        doc.text("TAX INVOICE", W - RIGHT_MARGIN, 22, { align: "right" });

        y = 45;
        doc.setDrawColor(220, 220, 220);
        doc.line(LEFT_MARGIN, y, W - RIGHT_MARGIN, y);
        y += 10;

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

        // --- INVOICE INFO (RIGHT) ---
        let infoY = y;
        infoY = drawInfoRow("Invoice No:", invoice.invoiceNo, infoY);
        infoY = drawInfoRow("Date:", fmtDate(invoice.date), infoY);

        // --- BILL TO & SHIP TO (LEFT - Split Screen) ---
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
            if (addr.address1) {
                doc.text(addr.address1, x, currentY);
                currentY += 4.5;
            }
            if (addr.address2 || addr.pinCode) {
                doc.text(`${addr.address2 || ""}${addr.address2 && addr.pinCode ? ", " : ""}${addr.pinCode || ""}`, x, currentY);
                currentY += 4.5;
            }
            if (addr.gst) {
                doc.text(`GSTIN: ${addr.gst}`, x, currentY);
                currentY += 4.5;
            }
            return currentY;
        };

        const inv = invoice as any;
        const billing = {
            name: inv.billingName || inv.client?.name,
            address1: inv.billingAddress1 || inv.client?.address1,
            address2: inv.billingAddress2 || inv.client?.address2,
            pinCode: inv.billingPinCode || inv.client?.pinCode,
            gst: inv.billingGst || inv.client?.gst
        };

        const shipping = {
            name: inv.shippingName || billing.name,
            address1: inv.shippingAddress2 || billing.address1,
            address2: inv.shippingAddress2 || billing.address2,
            pinCode: inv.shippingPinCode || billing.pinCode,
            gst: inv.billingGst || inv.client?.gst
        };

        const bFinalY = drawAddress(LEFT_MARGIN, addrY, billing);
        const sFinalY = drawAddress(shipX, addrY, shipping);

        y = Math.max(infoY, bFinalY, sFinalY) + 12;

        // Manual Product Fetch to bypass relation issues
        const lineItems = (invoice as any).lineItems || [];
        const productIds = lineItems.map((li: any) => li.productId).filter(Boolean);
        const productsRaw = await db.product.findMany({
            where: { id: { in: productIds } }
        });
        const productMap = new Map(productsRaw.map(p => [p.id, p]));

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

        // --- LINE ITEMS TABLE ---
        const showPkg = !!(settings as any).showPkgDetails;
        const tableHead = showPkg 
            ? [["Sl No", "No. & Kind of Pkgs", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"]]
            : [["Sl No", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"]];

        const tableBody = lineItems.map((item: any, i: number) => {
            const prod = productMap.get(item.productId) as any;
            const productName = prod?.description || item.description || "N/A";

            // Tally Style Hierarchy: BOLD UPPERCASE NAME + Small Normal Description
            const subTitle = (item.description && item.description !== prod?.description)
                ? `\n${item.description}`
                : (prod?.notes ? `\n${prod.notes}` : "");

            const pkgCountStr = Number(item.pkgCount || 0);
            const pkgValue = (pkgCountStr > 0) ? `${pkgCountStr} ${item.pkgType || "BOX"}` : "-";
            
            // If showing pkg in separate column, don't put it in description
            const pkgInDesc = (!showPkg && pkgCountStr > 0)
                ? `\nNo. & Kind of Pkgs: ${pkgCountStr} ${item.pkgType || "BOX"}`
                : "";

            const row = [
                String(i + 1),
                ...(showPkg ? [pkgValue] : []),
                `${productName.toUpperCase()}${subTitle}${pkgInDesc}`,
                item.hsn || "-",
                `${Number(item.qty)} ${item.unit || "NOS"}`,
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
                valign: "top",
            },
            columnStyles: showPkg ? {
                0: { halign: "center", cellWidth: 10 },
                1: { halign: "center", cellWidth: 18, fontStyle: "bold" },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y = (doc as any).lastAutoTable.finalY + 5;

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

        // Ensure HSN table fits or break to new page
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
            headStyles: { fontSize: 6.5, fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: "center" },
            bodyStyles: { fontSize: 6.5, halign: "right" },
            columnStyles: { 0: { halign: "center" } },
            margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y = (doc as any).lastAutoTable.finalY + 8;

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

        drawTotalRow("Taxable Amount:", fmt(subTotal));
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

        // --- FOOTER PROTECTION: Ensure Amount in Words and Bank details fit as a block ---
        const blockHeightNeeded = 60; // Approximate height for words + bank + signature
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
        doc.text(`INR ${numberToWords(rounded)} Only`, LEFT_MARGIN, y, { maxWidth: W - LEFT_MARGIN - RIGHT_MARGIN });

        y += 10;
        doc.setFont("helvetica", "bold");
        doc.text(`Tax Amount (in words):`, LEFT_MARGIN, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`INR ${numberToWords(taxVal)} Only`, LEFT_MARGIN, y, { maxWidth: W - LEFT_MARGIN - RIGHT_MARGIN });

        y += 15;

        // --- BANK DETAILS & SIGNATURE ---
        const bottomY = y;

        // Bank
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

        // Signature
        const sigX = W - RIGHT_MARGIN;
        doc.setFont("helvetica", "bold");
        doc.text(`For ${settings.companyName.toUpperCase()}`, sigX, bottomY + 6, { align: "right" });

        doc.setDrawColor(180, 180, 180);
        doc.line(sigX - 45, bottomY + 30, sigX, bottomY + 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text("Authorised Signatory", sigX, bottomY + 35, { align: "right" });

        // --- FOOTER ---
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            "This is a computer-generated invoice. No signature is required.",
            W / 2, 285, { align: "center" }
        );

        // --- Output ---
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

        const clientName = (invoice.client?.name || "JEZZY").split(" ")[0].toUpperCase();
        const safeFileName = `${clientName}_${invoice.invoiceNo}.pdf`.replace(/[/\\?%*:|"<>]/g, '-');

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${safeFileName}"`,
                "Content-Length": String(pdfBuffer.length),
            },
        });
    } catch (err: unknown) {
        console.error("[INVOICE_DOWNLOAD]", err);
        const message = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

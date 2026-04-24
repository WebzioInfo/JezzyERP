//generateInvoicePDF.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import { numberToWords } from "@/utils/financials";
import { formatDateDMY } from "@/utils/date";

export async function generateInvoicePDF(invoice: any, settings: any) {
    const doc = new jsPDF();

    // Use default values if settings are missing
    const company = {
        name: settings?.companyName || "JEZZY ENTERPRISES",
        gstin: settings?.gstin || "32BMAPJ5504M1Z9",
        address1: settings?.address1 || "MP 4/3 IIA",
        address2: settings?.address2 || "MOONIYUR, VELIMUKKU PO, MALAPPURAM DIST - 676317",
        phone: settings?.phone || "+91 85531 85300",
        email: settings?.email || "jezzyenterprises@gmail.com",
        bank: {
            name: settings?.bankName || "FEDERAL BANK",
            branch: settings?.bankBranch || "CHELARI",
            accNo: settings?.bankAccountNo || "16470200011150 ",
            ifsc: settings?.bankIfsc || "FDRL0001647",
            accName: settings?.bankAccountName || "JEZZY ENTERPRISES",
        }
    };

    /* LOGO */
    try {
        const logo = await fetch("/logo.png").then(r => r.blob()).then(b => URL.createObjectURL(b));
        doc.addImage(logo, "PNG", 10, 16, 40, 16);
    } catch (e) {
        console.warn("Logo not found, skipping...");
    }

    /* COMPANY HEADER */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(company.name, 56, 16);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
        `${company.address1}
${company.address2}
GSTIN: ${company.gstin}
Mobile: ${company.phone}
Email: ${company.email}`,
        56, 22
    );

    doc.line(10, 45, 200, 45);

    /* INVOICE INFO */
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNo}`, 10, 52);
    doc.text(`Date: ${formatDateDMY(new Date(invoice.date))}`, 150, 52);

    /* TRANSPORT DETAILS (OPTIONAL) */
    let transportY = 58;
    doc.setFontSize(9);

    if (invoice.ewayBill) {
        doc.text(`E-Way Bill No: ${invoice.ewayBill}`, 10, transportY);
        transportY += 5;
    }

    if (invoice.vehicleNo) {
        doc.text(`Vehicle No: ${invoice.vehicleNo}`, 10, transportY);
        transportY += 5;
    }

    /* BILLING / SHIPPING */
    const addressStartY = transportY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("Billing To:", 10, addressStartY);

    doc.setFontSize(9);
    doc.text(invoice.client.name, 10, addressStartY + 5);

    doc.setFont("helvetica", "normal");
    doc.text(
        `${invoice.client.address1}
${invoice.client.address2 || ""}
${invoice.gstType !== "NO_GST" && invoice.client.gst ? `GSTIN: ${invoice.client.gst}` : ""}
Phone: ${invoice.client.phone}
State: ${invoice.client.state}
`,
        10,
        addressStartY + 10
    );

    /* PRODUCT TABLE */
    const showGST = invoice.gstType !== "NO_GST";
    const tableHead = showGST
        ? ["Sl", "Description of Goods", "HSN", "Qty", "Rate", "GST %", "Amount"]
        : ["Sl", "Description of Goods", "HSN", "Qty", "Rate", "Amount"];

    const tableBody = invoice.lineItems.map((p: any, i: number) => {
        const amount = p.qty * p.rate;
        return showGST
            ? [
                i + 1,
                p.description,
                p.hsn || "—",
                Number(p.qty).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }),
                `Rs. ${Number(p.rate).toFixed(2)}`,
                `${p.taxPercent}%`,
                `Rs. ${Number(p.totalAmount).toFixed(2)}`
            ]
            : [
                i + 1,
                p.description,
                p.hsn || "—",
                p.qty,
                `Rs. ${Number(p.rate).toFixed(2)}`,
                `Rs. ${Number(p.totalAmount).toFixed(2)}`
            ];
    });

    autoTable(doc, {
        startY: 105,
        head: [tableHead],
        body: tableBody,
        styles: { fontSize: 9, valign: "middle", halign: "center" },
        headStyles: { fillColor: [40, 40, 40], textColor: 255, valign: "middle" },
        columnStyles: {
            1: { halign: "left" },
            4: { halign: "right" },
            6: { halign: "right" }
        }
    });

    /* TOTALS */
    const y = (doc as any).lastAutoTable.finalY + 8;
    const subTotal = Number(invoice.subTotal);
    const taxTotal = Number(invoice.taxTotal);
    const grandTotal = Number(invoice.grandTotal);

    doc.setFontSize(10);
    doc.text("Subtotal", 130, y);
    doc.text(`Rs. ${subTotal.toFixed(2)}`, 195, y, { align: "right" });

    if (invoice.gstType === "CGST_SGST") {
        doc.text("CGST (9%)", 130, y + 6);
        doc.text(`Rs. ${(taxTotal / 2).toFixed(2)}`, 195, y + 6, { align: "right" });
        doc.text("SGST (9%)", 130, y + 12);
        doc.text(`Rs. ${(taxTotal / 2).toFixed(2)}`, 195, y + 12, { align: "right" });
    } else if (invoice.gstType === "IGST") {
        doc.text("IGST (18%)", 130, y + 6);
        doc.text(`Rs. ${taxTotal.toFixed(2)}`, 195, y + 6, { align: "right" });
    }

    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL", 130, y + 25);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 195, y + 25, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Amount in Words: ${numberToWords(Math.round(grandTotal))}`, 10, y + 38);

    /* BANK DETAILS */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details for Settlement", 10, y + 50);

    doc.setFont("helvetica", "normal");
    const bankY = y + 57;
    const labelX = 10;
    const valueX = 40;

    doc.text("Bank Name", labelX, bankY);
    doc.text(`: ${company.bank.name}`, valueX, bankY);
    doc.text("Account No", labelX, bankY + 6);
    doc.text(`: ${company.bank.accNo}`, valueX, bankY + 6);
    doc.text("IFSC Code", labelX, bankY + 12);
    doc.text(`: ${company.bank.ifsc}`, valueX, bankY + 12);
    doc.text("Branch", labelX, bankY + 18);
    doc.text(`: ${company.bank.branch}`, valueX, bankY + 18);
    doc.text("A/C Holder", labelX, bankY + 24);
    doc.text(`: ${company.bank.accName}`, valueX, bankY + 24);

    /* SIGNATURE */
    doc.setFont("helvetica", "bold");
    doc.text(`For ${company.name}`, 150, bankY + 5);
    doc.setFont("helvetica", "normal");
    doc.text("Authorised Signatory", 150, bankY + 30);

    // ─── PDF HANDLING (MERGING OR CUSTOM FALLBACK) ───
    if (invoice.ewayBillUrl) {
        try {
            const invoicePdfBytes = doc.output('arraybuffer');
            const ewayBillPdfResponse = await fetch(invoice.ewayBillUrl);
            if (!ewayBillPdfResponse.ok) throw new Error("Failed to fetch E-Way bill PDF");
            const ewayBillPdfBytes = await ewayBillPdfResponse.arrayBuffer();

            const mergedPdf = await PDFDocument.create();
            const invoiceDoc = await PDFDocument.load(invoicePdfBytes);
            const ewayBillDoc = await PDFDocument.load(ewayBillPdfBytes);

            const invoicePages = await mergedPdf.copyPages(invoiceDoc, invoiceDoc.getPageIndices());
            invoicePages.forEach(page => mergedPdf.addPage(page));

            const ewayBillPages = await mergedPdf.copyPages(ewayBillDoc, ewayBillDoc.getPageIndices());
            ewayBillPages.forEach(page => mergedPdf.addPage(page));

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${invoice.invoiceNo}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            return;
        } catch (error) {
            console.error("Merging Error:", error);
            doc.save(`${invoice.invoiceNo}.pdf`);
        }
    } else if (invoice.ewayBill || invoice.vehicleNo) {
        // ─── GENERATE CUSTOM LOGISTICS PAGE ───
        doc.addPage();
        
        // Header
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("LOGISTICS & TRANSPORT", 20, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Electronic Way Bill & Goods Movement Declaration", 20, 32);

        // Watermark for Custom Page
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(60);
        doc.text("GENERATED COPY", 40, 150, { angle: 45 });

        // Details Grid
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        
        // Left Column Labels
        doc.setFont("helvetica", "bold");
        doc.text("E-Way Bill Number:", 20, 60);
        doc.text("Vehicle Number:", 20, 75);
        doc.text("Dispatch Date:", 20, 90);
        doc.text("Transport Mode:", 20, 105);
        
        // Right Column Values
        doc.setFont("helvetica", "normal");
        doc.text(invoice.ewayBill || "NOT PROVIDED", 70, 60);
        doc.text(invoice.vehicleNo || "NOT PROVIDED", 70, 75);
        doc.text(formatDateDMY(invoice.date), 70, 90);
        doc.text("ROAD (SURFACE)", 70, 105);

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 115, 190, 115);

        // Origin/Destination Info
        doc.setFont("helvetica", "bold");
        doc.text("Consignor (From):", 20, 130);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("JEZZY ENTERPRISES", 20, 137);
        doc.text("GSTIN: " + (process.env.NEXT_PUBLIC_COMPANY_GST || "32XXXXX"), 20, 142);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Consignee (To):", 110, 130);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(invoice.billingAddress?.name || "CLIENT", 110, 137);
        doc.text("GSTIN: " + (invoice.billingAddress?.gst || "UNREGISTERED"), 110, 142);

        // Bottom Footer
        doc.setFillColor(248, 250, 252);
        doc.rect(20, 240, 170, 30, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("This is a computer-generated logistics summary associated with Invoice " + invoice.invoiceNo + ".", 30, 255);
        doc.text("Valid for internal tracking and goods movement records only.", 30, 260);

        doc.save(`${invoice.invoiceNo}.pdf`);
    } else {
        doc.save(`${invoice.invoiceNo}.pdf`);
    }
}

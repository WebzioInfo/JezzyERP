import "server-only";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { db } from "@/db/prisma/client";
import { PartyAccountService } from "./PartyAccountService";

const LEFT_MARGIN = 15;
const RIGHT_MARGIN = 15;

function fmt(n: number) {
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: Date | string | null) {
    if (!d) return "N/A";
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
}

export class StatementPdfService {
    static async generateStatementPdf(
        partyId: string,
        partyType: 'CLIENT' | 'SUPPLIER',
        filters?: { startDate?: string; endDate?: string }
    ): Promise<{ buffer: Buffer; fileName: string }> {
        const data = await PartyAccountService.getAccountOverview(partyId, partyType, filters);
        const { summary, ledger } = data;

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
            bankAccountName: "JEZZY ENTERPRISES"
        };

        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const W = doc.internal.pageSize.getWidth();
        let y = 15;

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(settings.companyName.toUpperCase(), LEFT_MARGIN, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`${settings.address1}, ${settings.address2 || ""}`, LEFT_MARGIN, 22);
        doc.text(`${settings.city} - ${settings.pincode} | GSTIN: ${settings.gstin}`, LEFT_MARGIN, 27);
        doc.text(`Email: ${settings.email} | Phone: ${settings.phone}`, LEFT_MARGIN, 31);

        // Document Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42);
        doc.text("ACCOUNT STATEMENT", W - RIGHT_MARGIN, 22, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const dateRangeStr = filters?.startDate && filters?.endDate
            ? `${fmtDate(filters.startDate)} to ${fmtDate(filters.endDate)}`
            : "All Transactions";
        doc.text(`Period: ${dateRangeStr}`, W - RIGHT_MARGIN, 28, { align: "right" });

        y = 42;
        doc.setDrawColor(226, 232, 240);
        doc.line(LEFT_MARGIN, y, W - RIGHT_MARGIN, y);
        y += 8;

        // Party Info (Left) & Summary (Right)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(partyType === 'CLIENT' ? "STATEMENT FOR CLIENT:" : "STATEMENT FOR VENDOR:", LEFT_MARGIN, y);

        doc.text("ACCOUNT SUMMARY:", W - RIGHT_MARGIN - 60, y);
        y += 6;

        // Left Col
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(summary.name.toUpperCase(), LEFT_MARGIN, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        if (summary.gstin) { doc.text(`GSTIN: ${summary.gstin}`, LEFT_MARGIN, y); y += 4.5; }
        if (summary.phone) { doc.text(`Phone: ${summary.phone}`, LEFT_MARGIN, y); y += 4.5; }
        if (summary.email) { doc.text(`Email: ${summary.email}`, LEFT_MARGIN, y); y += 4.5; }
        if (summary.address) { doc.text(`Address: ${summary.address}`, LEFT_MARGIN, y); y += 4.5; }

        // Right Col (Summary Box)
        let rightY = y - 14;
        const rightX = W - RIGHT_MARGIN;
        const drawSummaryRow = (label: string, val: string, isBold = false) => {
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text(label, rightX - 60, rightY);
            doc.text(val, rightX, rightY, { align: "right" });
            rightY += 5;
        };

        drawSummaryRow("Opening Balance:", `Rs. ${fmt(summary.openingBalance)}`);
        drawSummaryRow("Total Purchases/Sales:", `Rs. ${fmt(summary.totalTurnover)}`);
        drawSummaryRow("Total Payments Received/Paid:", `Rs. ${fmt(summary.totalPaid)}`);
        drawSummaryRow("Closing Balance:", `Rs. ${fmt(Math.abs(summary.currentBalance))} ${summary.currentBalance >= 0 ? (partyType === 'CLIENT' ? 'Dr' : 'Cr') : (partyType === 'CLIENT' ? 'Cr' : 'Dr')}`, true);

        y = Math.max(y, rightY) + 8;

        // Transactions Table
        const tableHead = [["Date", "Type", "Reference", "Description", "Debit (Rs.)", "Credit (Rs.)", "Balance (Rs.)"]];
        
        let totalDebit = 0;
        let totalCredit = 0;

        const tableBody = ledger.map(r => {
            totalDebit += r.debit;
            totalCredit += r.credit;
            return [
                fmtDate(r.date),
                r.type.replace("_", " "),
                r.reference,
                r.description,
                r.debit > 0 ? fmt(r.debit) : "-",
                r.credit > 0 ? fmt(r.credit) : "-",
                fmt(Math.abs(r.runningBalance)) + (r.runningBalance >= 0 ? " Dr" : " Cr")
            ];
        });

        autoTable(doc, {
            startY: y,
            head: tableHead,
            body: tableBody,
            theme: "grid",
            headStyles: {
                fillColor: [15, 23, 42], // slate-900
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: "bold",
                halign: "center"
            },
            bodyStyles: {
                fontSize: 7.5,
                textColor: [30, 41, 59],
                cellPadding: 2,
                valign: "middle"
            },
            columnStyles: {
                0: { cellWidth: 22, halign: "center" },
                1: { cellWidth: 22, halign: "center" },
                2: { cellWidth: 25, halign: "center" },
                3: { halign: "left" },
                4: { cellWidth: 25, halign: "right" },
                5: { cellWidth: 25, halign: "right" },
                6: { cellWidth: 28, halign: "right", fontStyle: "bold" }
            },
            margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN }
        });

        // @ts-ignore
        y = doc.lastAutoTable.finalY + 8;

        // Totals Footer
        if (y + 40 > 275) {
            doc.addPage();
            y = 15;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text("TOTAL DEBITS:", W - RIGHT_MARGIN - 80, y);
        doc.text(`Rs. ${fmt(totalDebit)}`, W - RIGHT_MARGIN, y, { align: "right" });
        y += 5;

        doc.text("TOTAL CREDITS:", W - RIGHT_MARGIN - 80, y);
        doc.text(`Rs. ${fmt(totalCredit)}`, W - RIGHT_MARGIN, y, { align: "right" });
        y += 5;

        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.3);
        doc.line(W - RIGHT_MARGIN - 90, y, W - RIGHT_MARGIN, y);
        y += 5;

        doc.setFontSize(10);
        doc.text("CLOSING BALANCE:", W - RIGHT_MARGIN - 80, y);
        doc.text(`Rs. ${fmt(Math.abs(summary.currentBalance))}`, W - RIGHT_MARGIN, y, { align: "right" });
        y += 12;

        // Bank & Signatory Footer
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text("BANK REMITTANCE DETAILS:", LEFT_MARGIN, y);
        doc.text(`For ${settings.companyName.toUpperCase()}`, W - RIGHT_MARGIN, y, { align: "right" });
        y += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`A/C Name: ${settings.bankAccountName}`, LEFT_MARGIN, y); y += 4;
        doc.text(`Bank: ${settings.bankName}, ${settings.bankBranch}`, LEFT_MARGIN, y); y += 4;
        doc.text(`A/C No: ${settings.bankAccountNo.trim()} | IFSC: ${settings.bankIfsc.trim()}`, LEFT_MARGIN, y);

        doc.setDrawColor(200, 200, 200);
        doc.line(W - RIGHT_MARGIN - 45, y + 5, W - RIGHT_MARGIN, y + 5);
        doc.setFont("helvetica", "bold");
        doc.text("Authorised Signatory", W - RIGHT_MARGIN, y + 10, { align: "right" });

        const buffer = Buffer.from(doc.output("arraybuffer"));
        const safeName = summary.name.split(" ")[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
        const fileName = `Statement_${partyType}_${safeName}.pdf`;

        return { buffer, fileName };
    }
}

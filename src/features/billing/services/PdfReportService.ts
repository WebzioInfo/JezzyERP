import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, fmtDate } from "@/utils/financials";
import fs from "fs";
import path from "path";

// Colors and margins consistent with Invoice layout
const LEFT_MARGIN = 15;
const RIGHT_MARGIN = 15;
const TEXT_BLACK = [0, 0, 0] as [number, number, number];
const TEXT_GRAY = [80, 80, 80] as [number, number, number];

export class PdfReportService {
    static async generateLedgerStatement(client: any, entries: any[], settings: any) {
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const W = doc.internal.pageSize.getWidth();
        let y = 15;

        // --- COMPANY HEADER ---
        let companyX = LEFT_MARGIN;
        if (settings.showLogo) {
            try {
                const logoFileName = settings.logoUrl || "logo.png";
                const logoPath = path.join(process.cwd(), "public", logoFileName);
                if (fs.existsSync(logoPath)) {
                    const ext = path.extname(logoFileName).slice(1).toUpperCase() || "PNG";
                    const logoData = fs.readFileSync(logoPath).toString("base64");
                    doc.addImage(logoData, ext, LEFT_MARGIN, 10, 25, 15);
                    companyX = LEFT_MARGIN + 30;
                }
            } catch (err) {
                console.error("[LEDGER_LOGO_ERROR]", err);
            }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(...TEXT_BLACK);
        doc.text(settings.companyName.toUpperCase(), companyX, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...TEXT_GRAY);
        doc.text(`${settings.address1}, ${settings.address2 || ""}`, companyX, y);
        y += 4.5;
        doc.text(`${settings.city} - ${settings.pincode} | GSTIN: ${settings.gstin}`, companyX, y);
        y += 15;

        // --- TITLE ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...TEXT_BLACK);
        doc.text("STATEMENT OF ACCOUNT", W / 2, y, { align: "center" });
        y += 10;

        // --- CLIENT INFO ---
        doc.setFontSize(10);
        doc.text("ACCOUNT FOR:", LEFT_MARGIN, y);
        y += 6;
        doc.setFontSize(12);
        doc.text(client.name.toUpperCase(), LEFT_MARGIN, y);
        y += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_GRAY);
        doc.text(`${client.address1}, ${client.state}`, LEFT_MARGIN, y);
        y += 4;
        if (client.gst) doc.text(`GSTIN: ${client.gst}`, LEFT_MARGIN, y);
        y += 15;

        // --- ENTRIES TABLE ---
        const tableHead = [["Date", "Reference / Description", "Type", "Debit (₹)", "Credit (₹)", "Balance (₹)"]];
        
        let runningBalance = 0;
        const tableBody = entries.map((entry: any) => {
            const amount = Number(entry.amount);
            if (entry.type === 'DEBIT') {
                runningBalance -= amount;
            } else {
                runningBalance += amount;
            }

            return [
                fmtDate(entry.date),
                entry.description || entry.referenceType,
                entry.type,
                entry.type === 'DEBIT' ? amount.toFixed(2) : "-",
                entry.type === 'CREDIT' ? amount.toFixed(2) : "-",
                runningBalance.toFixed(2)
            ];
        });

        autoTable(doc, {
            startY: y,
            head: tableHead,
            body: tableBody,
            theme: "grid",
            headStyles: {
                fillColor: [40, 40, 40],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: "bold",
                halign: "center",
            },
            bodyStyles: {
                fontSize: 7.5,
                textColor: [0, 0, 0],
                valign: "middle",
            },
            columnStyles: {
                0: { cellWidth: 25, halign: "center" },
                1: { halign: "left" },
                2: { cellWidth: 20, halign: "center" },
                3: { cellWidth: 25, halign: "right" },
                4: { cellWidth: 25, halign: "right" },
                5: { cellWidth: 30, halign: "right", fontStyle: "bold" },
            },
            margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
        });

        // @ts-ignore
        y = doc.lastAutoTable.finalY + 10;

        // --- SUMMARY ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...TEXT_BLACK);
        const balanceLabel = runningBalance >= 0 ? "CURRENT ADVANCE (CREDIT):" : "CURRENT OUTSTANDING (DEBIT):";
        doc.text(balanceLabel, W - RIGHT_MARGIN - 80, y);
        doc.text(`₹ ${Math.abs(runningBalance).toFixed(2)}`, W - RIGHT_MARGIN, y, { align: "right" });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Generated on ${fmtDate(new Date())} | This is a computer-generated statement.`,
            W / 2, 285, { align: "center" }
        );

        return Buffer.from(doc.output("arraybuffer"));
    }
}

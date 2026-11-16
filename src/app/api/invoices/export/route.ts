import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { db } from "@/db/prisma/client";
import { InvoicePdfService, ExportFormat } from "@/features/billing/services/InvoicePdfService";
import archiver from "archiver";
import { PassThrough } from "stream";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function POST(req: NextRequest) {
    try {
        const session = await verifySessionVerified();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json().catch(() => ({}));
        const {
            invoiceIds,
            range,
            startDate,
            endDate,
            clientId,
            status,
            gstType,
            format = 'ORIGINAL'
        } = body;

        const where: any = { deletedAt: null };

        // 1. If explicit invoiceIds provided (e.g. bulk table selection)
        if (invoiceIds && Array.isArray(invoiceIds) && invoiceIds.length > 0) {
            where.id = { in: invoiceIds };
        } else {
            // 2. Otherwise apply date and filter options
            const now = new Date();
            if (range === "today") {
                where.date = { gte: startOfDay(now), lte: endOfDay(now) };
            } else if (range === "yesterday") {
                const yesterday = subDays(now, 1);
                where.date = { gte: startOfDay(yesterday), lte: endOfDay(yesterday) };
            } else if (range === "last7") {
                where.date = { gte: subDays(now, 7) };
            } else if (range === "last30") {
                where.date = { gte: subDays(now, 30) };
            } else if (range === "thisMonth") {
                where.date = { gte: startOfMonth(now), lte: endOfMonth(now) };
            } else if (range === "lastMonth") {
                const lastMonth = subMonths(now, 1);
                where.date = { gte: startOfMonth(lastMonth), lte: endOfMonth(lastMonth) };
            } else if (range === "custom" && startDate && endDate) {
                where.date = { gte: new Date(startDate), lte: new Date(endDate) };
            }

            if (clientId) where.clientId = clientId;
            if (status) where.status = status;
            if (gstType) where.gstType = gstType;
        }

        const invoices = await db.invoice.findMany({
            where,
            select: {
                id: true,
                invoiceNo: true,
                ewayBill: true,
                ewayBillUrl: true
            },
            orderBy: { invoiceNo: 'asc' }
        });

        if (invoices.length === 0) {
            return NextResponse.json({ error: "No invoices found for the selected items" }, { status: 404 });
        }

        // Audit / Export Log (gracefully ignore if schema doesn't support)
        try {
            await (db as any).exportLog?.create({
                data: {
                    userId: session.userId,
                    exportType: "INVOICE_ZIP",
                    format,
                    invoiceCount: invoices.length,
                    filters: where,
                    status: "COMPLETED"
                }
            });
        } catch (logErr) {
            console.warn("[EXPORT_LOG_WARN]", logErr);
        }

        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = new PassThrough();

        const usedNames = new Map<string, number>();
        function getUniqueFileName(baseName: string): string {
            const count = usedNames.get(baseName) || 0;
            usedNames.set(baseName, count + 1);
            if (count === 0) return baseName;
            const dotIndex = baseName.lastIndexOf('.');
            const name = dotIndex !== -1 ? baseName.substring(0, dotIndex) : baseName;
            const ext = dotIndex !== -1 ? baseName.substring(dotIndex) : '';
            return `${name}_(${count})${ext}`;
        }

        const ewayWarnings: Array<{ invoiceNo: string; warning: string }> = [];
        const failures: Array<{ invoiceNo: string; error: string }> = [];
        const mergedEwayList: string[] = [];

        // Run the archive generation and pipe to PassThrough stream
        archive.on('error', (err) => {
            console.error("[ARCHIVER_ERROR]", err);
            stream.destroy(err);
        });

        archive.pipe(stream);

        // Asynchronously pack all PDFs
        (async () => {
            for (const inv of invoices) {
                try {
                    const result = await InvoicePdfService.generateInvoicePdf(inv.id, format as ExportFormat);
                    const uniqueFileName = getUniqueFileName(result.fileName);
                    archive.append(result.buffer, { name: uniqueFileName });

                    if (result.hasEwayBill) {
                        if (result.ewayBillMerged) {
                            mergedEwayList.push(inv.invoiceNo);
                        } else {
                            ewayWarnings.push({
                                invoiceNo: inv.invoiceNo,
                                warning: result.mergeError || "E-Way Bill attachment could not be fetched/merged."
                            });
                        }
                    }
                } catch (err: any) {
                    console.error(`Failed to generate PDF for invoice ${inv.id}:`, err);
                    failures.push({
                        invoiceNo: inv.invoiceNo,
                        error: err?.message || "Unknown error generating PDF"
                    });
                }
            }

            // Append detailed export manifest/summary
            const summaryLines: string[] = [
                "============================================================",
                " JEZZY ERP - BULK INVOICE EXPORT REPORT",
                "============================================================",
                `Date & Time: ${new Date().toISOString()}`,
                `Total Invoices Requested: ${invoices.length}`,
                `Successfully Packaged:   ${invoices.length - failures.length}`,
                `Failed Invoices:          ${failures.length}`,
                `E-Way Bills Attached:     ${mergedEwayList.length}`,
                "============================================================",
                ""
            ];

            if (mergedEwayList.length > 0) {
                summaryLines.push("INVOICES WITH ATTACHED E-WAY BILLS (MERGED AS PAGE 2+):");
                mergedEwayList.forEach(invNo => summaryLines.push(`  ✓ ${invNo}`));
                summaryLines.push("");
            }

            if (ewayWarnings.length > 0) {
                summaryLines.push("E-WAY BILL WARNINGS (Invoice generated without attachment):");
                ewayWarnings.forEach(w => summaryLines.push(`  ⚠ ${w.invoiceNo}: ${w.warning}`));
                summaryLines.push("");
            }

            if (failures.length > 0) {
                summaryLines.push("FAILED INVOICES:");
                failures.forEach(f => summaryLines.push(`  ✕ ${f.invoiceNo}: ${f.error}`));
                summaryLines.push("");
            }

            archive.append(summaryLines.join("\n"), { name: "EXPORT_SUMMARY.txt" });

            await archive.finalize();
        })().catch((err) => {
            console.error("[ASYNC_ARCHIVE_ERROR]", err);
            stream.destroy(err);
        });

        const dateStr = new Date().toISOString().split('T')[0];
        const zipFileName = invoiceIds ? `JEZZY_Bulk_Invoices_${dateStr}.zip` : `Invoices_Export_${dateStr}.zip`;

        return new Response(stream as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFileName}"`,
            },
        });

    } catch (err: any) {
        console.error("[BULK_EXPORT_ERROR]", err);
        const message = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

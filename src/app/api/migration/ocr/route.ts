import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { verifySessionVerified } from "@/lib/auth-server";
import { OcrMigrationService } from "@/features/settings/services/OcrMigrationService";
import { MigrationService, DryRunRollback } from "@/features/settings/services/MigrationService";

export async function GET(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const exportFormat = searchParams.get("export");

    if (exportFormat === "json" || exportFormat === "csv") {
      // Aggregate Migration Statistics
      const totalInvoices = await db.invoice.count({ where: { deletedAt: null } });
      const draftInvoices = await db.invoice.count({ where: { status: "DRAFT", deletedAt: null } });
      const finalizedInvoices = totalInvoices - draftInvoices;
      
      const totalClients = await db.client.count({ where: { deletedAt: null } });
      const totalProducts = await db.product.count({ where: { deletedAt: null } });
      
      const invoiceSums = await db.invoice.aggregate({
        where: { deletedAt: null },
        _sum: { grandTotal: true, taxTotal: true }
      });

      const reportData = {
        timestamp: new Date().toISOString(),
        totalPDFsFound: totalInvoices,
        successfullyProcessed: finalizedInvoices,
        manualReviewQueueCount: draftInvoices,
        duplicateInvoicesChecked: 0,
        clientsCount: totalClients,
        productsCount: totalProducts,
        totalInvoiceValue: invoiceSums._sum.grandTotal?.toNumber() || 0,
        totalGstValue: invoiceSums._sum.taxTotal?.toNumber() || 0,
      };

      if (exportFormat === "csv") {
        const csvRows = [
          ["Metric", "Value"],
          ["Report Date", reportData.timestamp],
          ["Total Invoices Processed", reportData.totalPDFsFound],
          ["Finalized Ledger Invoices", reportData.successfullyProcessed],
          ["Manual Review Queue (Draft Invoices)", reportData.manualReviewQueueCount],
          ["Active Client Mappings", reportData.clientsCount],
          ["Active Product SKU Catalog", reportData.productsCount],
          ["Aggregated Grand Total Value (INR)", reportData.totalInvoiceValue],
          ["Aggregated Output GST (INR)", reportData.totalGstValue]
        ];
        
        const csvString = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
        return new NextResponse(csvString, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=migration_summary_report.csv"
          }
        });
      }

      return NextResponse.json(reportData);
    }

    const files = await OcrMigrationService.scanFolder();
    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    console.error("[OCR_SCANNER_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { filename, dryRun = true, batchId } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Initialize/retrieve a MigrationBatch for tracing logs
    let activeBatchId = batchId;
    if (!activeBatchId && !dryRun) {
      const newBatch = await db.migrationBatch.create({
        data: {
          module: "OCR_INVOICES",
          status: "PENDING",
          totalRecords: 1,
          successCount: 0,
          errorCount: 0
        }
      });
      activeBatchId = newBatch.id;
    }

    // 1. Process extraction
    console.log(`[OCR_MIGRATION] Extracting data from file: ${filename}...`);
    const extracted = await OcrMigrationService.extractInvoiceData(filename);

    // 2. Seed database inside Transaction
    try {
      const result = await db.$transaction(async (tx) => {
        const invoice = await OcrMigrationService.seedInvoice(tx, extracted.structured, activeBatchId);
        
        if (dryRun) {
          throw new DryRunRollback({
            successCount: 1,
            errorCount: 0,
            logs: [{ status: "SUCCESS", sourceRow: 1, message: `Dry Run Passed: Ready to seed ${invoice.invoiceNo} (Status: ${invoice.status})` }]
          });
        }

        // Increment successCount on active batch
        await tx.migrationBatch.update({
          where: { id: activeBatchId },
          data: {
            successCount: { increment: 1 },
            status: "COMPLETED"
          }
        });

        return {
          success: true,
          invoiceNo: invoice.invoiceNo,
          grandTotal: Number(invoice.grandTotal),
          clientName: invoice.billingName,
          status: invoice.status,
          batchId: activeBatchId,
          dryRun: false
        };
      }, { timeout: 45000, isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); // Serializable isolation level as requested

      // Run post-import reconciliation audit
      try {
        await MigrationService.reconcileBalances();
      } catch (recErr) {
        console.error("[RECONCILIATION_WARNING]", recErr);
      }

      return NextResponse.json(result, { status: 200 });

    } catch (err: any) {
      if (!dryRun && activeBatchId) {
        try {
          await db.migrationBatch.update({
            where: { id: activeBatchId },
            data: {
              errorCount: { increment: 1 },
              status: "FAILED",
              errorMessage: err.message
            }
          });
        } catch (updateErr) {
          console.error("[BATCH_ERROR_LOG_FAILED]", updateErr);
        }
      }

      if (err instanceof DryRunRollback) {
        return NextResponse.json({
          success: true,
          dryRun: true,
          extracted: extracted.structured,
          logs: err.result.logs
        }, { status: 200 });
      }
      throw err;
    }

  } catch (error: any) {
    console.error("[OCR_MIGRATION_EXECUTE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to process migration file" }, { status: 500 });
  }
}

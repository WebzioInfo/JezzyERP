import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { verifySessionVerified } from "@/lib/auth-server";
import { MigrationService, DryRunRollback } from "@/features/settings/services/MigrationService";

export async function POST(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { module, data, dryRun = false } = await req.json();

    if (!module || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
      const result = await db.$transaction(async (tx) => {
        // 1. Create Migration Batch inside the transaction
        const batch = await tx.migrationBatch.create({
          data: {
            module,
            totalRecords: data.length,
            status: "PROCESSING",
            userId: session.userId,
          }
        });

        // 2. Process records using MigrationService
        const importResult = await MigrationService.runImport(tx, module, data, dryRun);

        // 3. Write logs and update batch
        const logsToInsert = importResult.logs.map((log) => ({
          batchId: batch.id,
          sourceRow: log.sourceRow,
          status: log.status,
          message: log.message,
        }));

        if (logsToInsert.length > 0) {
          await tx.migrationLog.createMany({ data: logsToInsert });
        }

        await tx.migrationBatch.update({
          where: { id: batch.id },
          data: {
            status: importResult.errorCount > 0 ? (importResult.successCount > 0 ? "PARTIAL" : "FAILED") : "COMPLETED",
            successCount: importResult.successCount,
            errorCount: importResult.errorCount,
          }
        });

        // If dry run, throw rollback carrying results
        if (dryRun) {
          throw new DryRunRollback({
            successCount: importResult.successCount,
            errorCount: importResult.errorCount,
            logs: importResult.logs,
          });
        }

        return {
          batchId: batch.id,
          success: importResult.successCount,
          failed: importResult.errorCount,
          logs: importResult.logs,
        };
      }, { timeout: 60000 });

      // Run reconciliation audit on successful actual imports
      try {
        await MigrationService.reconcileBalances();
      } catch (recErr) {
        console.error("[POST_IMPORT_RECONCILIATION_WARNING]", recErr);
      }

      return NextResponse.json(result, { status: 200 });

    } catch (err: any) {
      if (err instanceof DryRunRollback) {
        return NextResponse.json({
          batchId: "DRY_RUN_PREVIEW",
          success: err.result.successCount,
          failed: err.result.errorCount,
          logs: err.result.logs,
          dryRun: true,
        }, { status: 200 });
      }
      throw err;
    }

  } catch (error: any) {
    console.error("[MIGRATION_EXECUTE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}


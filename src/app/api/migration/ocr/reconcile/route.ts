import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { MigrationService } from "@/features/settings/services/MigrationService";

export async function POST(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const auditData = await MigrationService.reconcileBalances();
    return NextResponse.json({
      success: true,
      ...auditData
    });
  } catch (error: any) {
    console.error("[MIGRATION_OCR_RECONCILE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Audit failed" }, { status: 500 });
  }
}

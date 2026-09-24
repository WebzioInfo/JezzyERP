import { NextRequest, NextResponse } from "next/server";
import { verifySessionVerified } from "@/lib/auth-server";
import { GlobalSearchService } from "@/features/search/services/GlobalSearchService";

export async function GET(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const results = await GlobalSearchService.search(q);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("[GLOBAL_SEARCH_ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to execute global search." }, { status: 500 });
  }
}

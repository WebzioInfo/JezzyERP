import { db } from "@/db/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vendors = await db.vendor.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

import { db } from "@/db/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      orderBy: { description: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

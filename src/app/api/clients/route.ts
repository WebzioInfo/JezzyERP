import { db } from "@/db/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await db.client.findMany({
      where: { 
        deletedAt: null,
        active: true 
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

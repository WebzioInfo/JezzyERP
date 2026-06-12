import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/prisma/client";
import { verifySessionVerified } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { module, data } = await req.json();

    if (!module || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1. Create Migration Batch
    const batch = await db.migrationBatch.create({
      data: {
        module,
        totalRecords: data.length,
        status: "PROCESSING",
        userId: session.userId,
      }
    });

    let successCount = 0;
    let errorCount = 0;
    const logs: any[] = [];

    // 2. Process Records
    // We process sequentially to handle dependencies and avoid locking issues
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const sourceRow = i + 2; // Assuming row 1 is header

      try {
        if (module === "CLIENTS") {
          if (!row.name || !row.address1 || !row.state) {
            throw new Error("Missing required fields: Name, Address1, or State.");
          }

          // Check duplicate
          const existing = await db.client.findFirst({
            where: { name: row.name }
          });

          if (existing) {
            throw new Error(`Client '${row.name}' already exists.`);
          }

          const client = await db.client.create({
            data: {
              name: row.name,
              email: row.email || null,
              phone: row.phone || null,
              gst: row.gst || null,
              address1: row.address1,
              address2: row.address2 || null,
              state: row.state,
              pinCode: row.pinCode || null,
            }
          });

          logs.push({ batchId: batch.id, sourceRow, destinationId: client.id, destinationModel: "Client", status: "SUCCESS", message: "Client created successfully." });
          successCount++;
        } 
        else if (module === "PRODUCTS") {
          if (!row.description || !row.sellingRate || !row.gstRate) {
            throw new Error("Missing required fields: Description, Selling Rate, or GST %.");
          }

          let sku = row.sku || `PROD-${Date.now()}-${i}`;
          
          const existing = await db.product.findFirst({
            where: { OR: [{ sku }, { description: row.description }] }
          });

          if (existing) {
            throw new Error(`Product '${row.description}' or SKU '${sku}' already exists.`);
          }

          const product = await db.product.create({
            data: {
              sku,
              description: row.description,
              hsn: row.hsn || null,
              sellingRate: parseFloat(row.sellingRate) || 0,
              gstRate: parseFloat(row.gstRate) || 0,
            }
          });

          logs.push({ batchId: batch.id, sourceRow, destinationId: product.id, destinationModel: "Product", status: "SUCCESS", message: "Product created successfully." });
          successCount++;
        }
        else {
          throw new Error(`Module ${module} is not yet fully supported for import.`);
        }
      } catch (err: any) {
        errorCount++;
        logs.push({ batchId: batch.id, sourceRow, status: "ERROR", message: err.message, rawData: row });
      }
    }

    // 3. Save Logs & Update Batch
    if (logs.length > 0) {
      await db.migrationLog.createMany({ data: logs });
    }

    await db.migrationBatch.update({
      where: { id: batch.id },
      data: {
        status: errorCount > 0 ? (successCount > 0 ? "PARTIAL" : "FAILED") : "COMPLETED",
        successCount,
        errorCount,
      }
    });

    return NextResponse.json({
      batchId: batch.id,
      success: successCount,
      failed: errorCount,
      logs: logs.filter(l => l.status === "ERROR").concat(logs.filter(l => l.status === "SUCCESS").slice(0, 5)) // Send back errors and a few successes
    }, { status: 200 });

  } catch (error: any) {
    console.error("[MIGRATION_EXECUTE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

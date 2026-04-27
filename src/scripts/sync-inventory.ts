import { StockService } from "../features/inventory/services/StockService";
import { db } from "../db/prisma/client";

async function main() {
    console.log("🚀 Starting Inventory Synchronization Protocol...");
    try {
        const result = await StockService.syncAllInventory();
        console.log("✅ Sync Complete:", result);
    } catch (err) {
        console.error("❌ Sync Failed:", err);
    } finally {
        await db.$disconnect();
    }
}

main();

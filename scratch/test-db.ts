import { db } from "../src/db/prisma/client";

async function test() {
    try {
        const inv = await db.invoice.findFirst();
        if (!inv) {
            console.log("No invoice found to test");
            return;
        }
        console.log("Testing update on invoice:", inv.id);
        const updated = await db.invoice.update({
            where: { id: inv.id },
            data: {
                isFreightCollect: true,
                freightAmount: 123.45,
                freightTaxPercent: 18
            }
        });
        console.log("Update successful:", updated.isFreightCollect, updated.freightAmount);
    } catch (e) {
        console.error("Update failed:", e);
    } finally {
        process.exit(0);
    }
}

test();

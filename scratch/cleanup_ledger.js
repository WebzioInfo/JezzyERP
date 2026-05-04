const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function run() {
    console.log("Starting SQL-based ledger cleanup...");
    const entries = await db.ledgerEntry.findMany({
        where: { description: { contains: 'Backfilled' } },
        select: {
            id: true,
            description: true,
            amount: true
        }
    });
    
    console.log(`Found ${entries.length} backfilled entries.`);
    
    let deletedCount = 0;
    for (const entry of entries) {
        const match = entry.description.match(/JE\/[A-Z0-9]+\/[0-9]+\/[0-9-]+/);
        if (!match) continue;
        
        const invoiceNo = match[0];
        
        const counterpart = await db.ledgerEntry.findFirst({
            where: {
                description: { contains: invoiceNo },
                id: { not: entry.id }
            },
            select: { id: true }
        });
        
        if (counterpart) {
            console.log(`Deleting redundant backfilled entry for ${invoiceNo}`);
            // Use raw SQL to bypass Prisma column checks
            await db.$executeRaw`DELETE FROM ledger_entries WHERE id = ${entry.id}`;
            deletedCount++;
        }
    }
    
    console.log(`Cleanup complete. Deleted ${deletedCount} redundant entries.`);
    process.exit(0);
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});

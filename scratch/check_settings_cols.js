const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function run() {
    try {
        console.log("Checking columns for company_settings...");
        // Use raw query for MySQL/SQLite/Postgres compatibility
        const res = await db.$queryRawUnsafe("DESCRIBE company_settings");
        console.log(JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Failed to describe table. Trying SELECT * LIMIT 0...");
        try {
            const res = await db.$queryRawUnsafe("SELECT * FROM company_settings LIMIT 0");
            console.log("Table exists.");
        } catch (inner) {
            console.error("Table might not exist or raw query failed.", inner.message);
        }
    }
    process.exit(0);
}

run();

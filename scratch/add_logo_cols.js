const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function run() {
    try {
        console.log("Adding showLogo and logoUrl to company_settings...");
        await db.$executeRawUnsafe("ALTER TABLE company_settings ADD COLUMN showLogo TINYINT(1) DEFAULT 0");
        await db.$executeRawUnsafe("ALTER TABLE company_settings ADD COLUMN logoUrl VARCHAR(255) DEFAULT 'logo.png'");
        console.log("Columns added successfully.");
    } catch (e) {
        console.error("Failed to add columns. They might already exist.", e.message);
    }
    process.exit(0);
}

run();

import { db } from "../db/prisma/client";

async function list() {
  console.log("================ MIGRATION LOGS ================");
  const logs = await db.migrationLog.findMany();
  for (const log of logs) {
    console.log(`Row: ${log.sourceRow} | Status: ${log.status} | Model: ${log.destinationModel} | Message: ${log.message}`);
  }
}

list().catch(console.error);

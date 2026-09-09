import { db } from "../db/prisma/client";

async function list() {
  console.log("================ LEDGER ENTRIES ================");
  const entries = await db.ledgerEntry.findMany({
    include: {
      debitAccount: true,
      creditAccount: true
    }
  });

  for (const entry of entries) {
    console.log(
      `Date: ${entry.date.toISOString().split("T")[0]} | Debit: ${entry.debitAccount?.name} | Credit: ${entry.creditAccount?.name} | Amount: Rs. ${Number(entry.amount)} | Ref: ${entry.referenceType} (${entry.referenceId})`
    );
  }

  console.log("\n================ ACCOUNTS ================");
  const accounts = await db.account.findMany();
  for (const acc of accounts) {
    console.log(`Account: ${acc.name} | Type: ${acc.type} | Opening Balance: Rs. ${Number(acc.openingBalance)}`);
  }
}

list().catch(console.error);

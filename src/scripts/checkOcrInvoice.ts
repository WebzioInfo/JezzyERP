import { db } from "../db/prisma/client";

async function check() {
  const inv = await db.invoice.findFirst({
    where: { invoiceNo: { startsWith: "JE-OCR-" } }
  });

  if (inv) {
    console.log("Found JE-OCR invoice in DB:");
    console.log(JSON.stringify(inv, null, 2));
  } else {
    console.log("No JE-OCR invoice found.");
  }
}

check().catch(console.error);

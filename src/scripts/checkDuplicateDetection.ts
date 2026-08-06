import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "../db/prisma/client";

async function check() {
  const dirPath = path.resolve(process.cwd(), "old data invoices");
  const files = ["SPELL_JE-B2B-03-26-27.pdf", "SPELL_JE-B2B-06-26-27.pdf"];

  for (const file of files) {
    console.log(`\nAnalyzing scanner matches for: ${file}`);
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const derivedNo = file.replace(".pdf", "").split("_")[1] || "MOCK_INV_NO";

    console.log(`  * SHA256 Hash: ${hash}`);
    console.log(`  * Derived invoiceNo: ${derivedNo}`);

    // Query by hash
    const matchByHash = await db.invoice.findFirst({
      where: { notes: { contains: `[PDF_HASH: ${hash}]` }, deletedAt: null }
    });
    if (matchByHash) {
      console.log(`  * Found match by Hash in DB! Invoice ID: ${matchByHash.id}, InvoiceNo: ${matchByHash.invoiceNo}, Notes: ${matchByHash.notes}`);
    } else {
      console.log(`  * No match by Hash.`);
    }

    // Query by derived invoice number
    const matchByNo = await db.invoice.findFirst({
      where: { invoiceNo: derivedNo, deletedAt: null }
    });
    if (matchByNo) {
      console.log(`  * Found match by invoiceNo in DB! Invoice ID: ${matchByNo.id}, InvoiceNo: ${matchByNo.invoiceNo}`);
    } else {
      console.log(`  * No match by invoiceNo.`);
    }
  }
}

check().catch(console.error);

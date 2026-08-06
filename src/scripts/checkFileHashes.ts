import fs from "fs";
import path from "path";
import crypto from "crypto";

function run() {
  const dirPath = path.resolve(process.cwd(), "old data invoices");
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".pdf")) continue;
    const buffer = fs.readFileSync(path.join(dirPath, file));
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    if (hash.startsWith("eb170eb5") || file.includes("OCR")) {
      console.log(`Match: ${file} -> Hash: ${hash}`);
    }
  }
}

run();

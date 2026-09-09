import fs from "fs";
import path from "path";

function sortCache() {
  const cachePath = path.resolve(process.cwd(), "old data invoices", "extracted_cache.json");
  if (!fs.existsSync(cachePath)) {
    console.error("Cache file not found at:", cachePath);
    return;
  }

  const cacheContent = fs.readFileSync(cachePath, "utf-8");
  const cache = JSON.parse(cacheContent);

  const entries = Object.entries(cache) as [string, any][];
  console.log(`Loaded ${entries.length} cache records.`);

  // Natural numeric sort by sequence number
  entries.sort((a, b) => {
    const invA = a[1].structured?.invoiceNo || "";
    const invB = b[1].structured?.invoiceNo || "";

    const seqA = getSequence(invA);
    const seqB = getSequence(invB);

    return seqA - seqB;
  });

  const sortedCache: Record<string, any> = {};
  for (const [key, value] of entries) {
    sortedCache[key] = value;
  }

  fs.writeFileSync(cachePath, JSON.stringify(sortedCache, null, 2), "utf-8");
  console.log("Successfully sorted cache file!");

  // Output sorted sequence validation check
  console.log("\nValidation of sorted sequence:");
  entries.forEach(([key, val]) => {
    console.log(`  * ${val.structured?.invoiceNo} | Hash: ${key.substring(0, 12)}...`);
  });
}

function getSequence(invoiceNo: string): number {
  // Matches JE-B2B-01-26-27 or JE/B2B/01/26-27
  const match = invoiceNo.match(/(?:JE-B2B-|JE\/B2B\/)(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  const digits = invoiceNo.match(/\d+/);
  return digits ? parseInt(digits[0], 10) : 999999;
}

sortCache();

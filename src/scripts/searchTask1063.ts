import fs from "fs";
import path from "path";

function search() {
  const logPath = path.resolve(
    "C:\\Users\\LAPTEX\\.gemini\\antigravity-ide\\brain\\f19d8b0a-e4bf-41e7-b4f5-f3389bea2ac9\\.system_generated\\tasks\\task-1063.log"
  );
  if (!fs.existsSync(logPath)) {
    console.log("Log file not found.");
    return;
  }

  const content = fs.readFileSync(logPath, "utf-8");
  const lines = content.split("\n");
  
  console.log("Ingestion results from log:");
  lines.forEach((line) => {
    if (line.includes("Ingesting") || line.includes("SUCCESS") || line.includes("FAILED") || line.includes("SKIP") || line.includes("Validation")) {
      console.log(line);
    }
  });
}

search();

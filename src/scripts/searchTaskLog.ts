import fs from "fs";
import path from "path";

function search() {
  const logPath = path.resolve(
    "C:\\Users\\LAPTEX\\.gemini\\antigravity-ide\\brain\\f19d8b0a-e4bf-41e7-b4f5-f3389bea2ac9\\.system_generated\\tasks\\task-863.log"
  );
  if (!fs.existsSync(logPath)) {
    console.log("Log file not found.");
    return;
  }

  const content = fs.readFileSync(logPath, "utf-8");
  const lines = content.split("\n");
  
  console.log("Lines 1180 to 1250:");
  lines.slice(1179, 1250).forEach((line, idx) => {
    console.log(`[Line ${1180 + idx}] ${line}`);
  });
}

search();

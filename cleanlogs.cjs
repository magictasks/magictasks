const fs = require("fs");

// Input and output file paths
const inputPath = "firebase-debug.log";
const outputPath = "emulator-cleaned.log";

// Read the raw log content
const rawLogs = fs.readFileSync(inputPath, "utf-8");

// Step 1: Remove all [debug] and [warn] lines
let cleaned = rawLogs
  .split("\n")
  .filter((line) => !line.startsWith("[debug]") && !line.includes("[warn]"))
  .join("\n");

// Step 2: Remove ISO 8601 timestamps
cleaned = cleaned
  .replace(/\d{4}-\d{2}-\d{2}T.*?Z/g, "") // remove timestamps
  .replace(/^\s*\n/gm, ""); // remove blank lines created from removals

// Write to new file
fs.writeFileSync(outputPath, cleaned.trim());

console.log(`✅ Cleaned logs saved to ${outputPath}`);

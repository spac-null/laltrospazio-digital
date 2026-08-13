import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { approvalSummary, readCandidateInput } from "./candidate-lib.mjs";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/create-event-candidate.mjs <structured-input.json>");
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidate = readCandidateInput(input);
const output = path.join(root, "content", "candidates", `${candidate.candidate_id}.json`);
fs.writeFileSync(output, `${JSON.stringify(candidate, null, 2)}\n`);
console.log(approvalSummary(candidate));
console.log(`\nSaved pending candidate: ${path.relative(root, output)}`);

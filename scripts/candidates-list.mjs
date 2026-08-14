import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CANDIDATE_REVIEW_JSON } from "./candidates-refresh.mjs";
import { sortForReport } from "./candidate-review-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadReview({ jsonPath } = {}) {
  const file = jsonPath ?? path.join(root, CANDIDATE_REVIEW_JSON);
  if (!fs.existsSync(file)) throw new Error(`No candidate review found at ${jsonPath ?? CANDIDATE_REVIEW_JSON}; run npm run candidates:refresh first`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function listCandidates({ all = false } = {}) {
  const review = loadReview();
  const sorted = sortForReport(review.candidates).filter((candidate) => all || candidate.time_relevance !== "past");
  return sorted;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const all = process.argv.includes("--all");
    const candidates = listCandidates({ all });
    if (!candidates.length) {
      console.log(all ? "No candidates found. Run npm run candidates:refresh first." : "No actionable (non-past) candidates. Pass --all to include past candidates.");
    } else {
      console.log(`${"ID".padEnd(28)} ${"TYPE".padEnd(20)} ${"RELEVANCE".padEnd(10)} ${"READINESS".padEnd(14)} SOURCES`);
      for (const candidate of candidates) {
        console.log(`${candidate.candidate_id.padEnd(28)} ${candidate.candidate_type.padEnd(20)} ${candidate.time_relevance.padEnd(10)} ${candidate.promotion_readiness.padEnd(14)} ${candidate.sources.length}`);
      }
    }
  } catch (error) {
    console.error(`CANDIDATES LIST FAILED\n${error.message}`);
    process.exitCode = 1;
  }
}

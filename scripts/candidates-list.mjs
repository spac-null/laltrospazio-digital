import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CANDIDATE_REVIEW_JSON } from "./candidates-refresh.mjs";
import { defaultReviewQueue, filterCandidates, sortForReport } from "./candidate-review-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadReview({ jsonPath } = {}) {
  const file = jsonPath ?? path.join(root, CANDIDATE_REVIEW_JSON);
  if (!fs.existsSync(file)) throw new Error(`No candidate review found at ${jsonPath ?? CANDIDATE_REVIEW_JSON}; run npm run candidates:refresh first`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// The default "review" view: unresolved (not ignored/promoted), non-past,
// non-low-priority candidates — the material actually worth an owner's
// attention right now. Any explicit filter switches to that filtered view
// instead (still excluding "ignore"/"promoted" decisions unless --all).
export function listCandidates({ all = false, priority, type, upcomingOnly, blockedOnly, pastOnly, limit, jsonPath } = {}) {
  const review = loadReview({ jsonPath });
  const hasExplicitFilter = Boolean(priority || type || upcomingOnly || blockedOnly || pastOnly || typeof limit === "number");
  const pool = all ? review.candidates : review.candidates.filter((candidate) => !["ignore", "promoted"].includes(candidate.review_decision));
  if (!hasExplicitFilter) return all ? sortForReport(pool) : defaultReviewQueue(pool);
  return filterCandidates(pool, { priority, type, upcomingOnly, blockedOnly, pastOnly, limit });
}

function parseArgs(argv) {
  const args = { all: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--upcoming") args.upcomingOnly = true;
    else if (arg === "--blocked") args.blockedOnly = true;
    else if (arg === "--past") args.pastOnly = true;
    else if (arg === "--priority" && argv[i + 1]) { args.priority = argv[i + 1]; i += 1; }
    else if (arg === "--type" && argv[i + 1]) { args.type = argv[i + 1]; i += 1; }
    else if (arg === "--limit" && argv[i + 1]) { args.limit = Number(argv[i + 1]); i += 1; }
  }
  return args;
}

function dateCell(candidate) {
  if (candidate.date_state === "undated") return "undated";
  if (candidate.fields.start_date?.value) return `${candidate.fields.start_date.value} (${candidate.date_state})`;
  return candidate.date_state;
}

function titleCell(candidate) {
  return candidate.fields.title_suggestion?.value ?? "(none)";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const candidates = listCandidates(args);
    if (!candidates.length) {
      console.log("No candidates match this view. Try --all, or run npm run candidates:refresh first.");
    } else {
      console.log(`${"ID".padEnd(26)} ${"TYPE".padEnd(18)} ${"PRIORITY".padEnd(9)} ${"DATE".padEnd(28)} ${"TITLE SUGGESTION".padEnd(24)} ${"NETWORKS".padEnd(18)} BLOCKERS`);
      for (const candidate of candidates) {
        const networks = [...new Set(candidate.sources.map((source) => source.network))].join("+");
        const blockers = candidate.missing_fields.concat(candidate.conflicting_fields, candidate.ambiguous_fields).join(",") || "-";
        console.log(`${candidate.candidate_id.padEnd(26)} ${candidate.candidate_type.padEnd(18)} ${candidate.review_priority.padEnd(9)} ${dateCell(candidate).padEnd(28)} ${titleCell(candidate).slice(0, 22).padEnd(24)} ${networks.padEnd(18)} ${blockers}`);
      }
      console.log(`\n${candidates.length} candidate(s) shown. Use candidates:show -- <id> for full detail.`);
    }
  } catch (error) {
    console.error(`CANDIDATES LIST FAILED\n${error.message}`);
    process.exitCode = 1;
  }
}

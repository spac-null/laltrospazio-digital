import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCandidates, fromD1Row, fromNormalizedRecord, renderReviewMarkdown } from "./candidate-review-lib.mjs";
import { CANDIDATE_DECISIONS_FILE, decisionFor, loadDecisions } from "./candidate-decisions-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CANDIDATE_REVIEW_JSON = ".local/candidate-review.json";
export const CANDIDATE_REVIEW_MARKDOWN = ".local/candidate-review.md";

const WRANGLER_VERSION = "4.122.0";
const D1_DATABASE_NAME = "laltrospazio-meta";

function loadFromRemoteD1() {
  const output = execFileSync(
    "npx",
    [`wrangler@${WRANGLER_VERSION}`, "d1", "execute", D1_DATABASE_NAME, "--remote", "--json", "--command", "SELECT network, source_id, source_account_id, source_timestamp, message_or_caption, permalink, media_type, candidate_signals FROM meta_source_records;"],
    { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
  const parsed = JSON.parse(output);
  const rows = parsed[0]?.results ?? [];
  return rows.map(fromD1Row);
}

function loadFromLocalFixture(fixturePath) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(root, fixturePath), "utf8"));
  if (Array.isArray(raw.records)) return raw.records.map((row) => (row.candidate_signals !== undefined && row.source_network ? fromNormalizedRecord(row) : fromD1Row(row)));
  const facebook = raw.facebook?.records ?? [];
  const instagram = raw.instagram?.records ?? [];
  return [...facebook, ...instagram].map(fromNormalizedRecord);
}

function parseArgs(argv) {
  const args = { source: "remote", all: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--source" && argv[i + 1]) {
      args.source = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--all") {
      args.all = true;
    }
  }
  return args;
}

// candidates:refresh never writes decisions — it only READS the existing
// private decision file (if any) to attach each candidate's current
// review_decision, so a previously ignored/deferred/promoted candidate is
// never silently resurrected into the default actionable view after a
// re-run. Source records and canonical content remain untouched either way.
export function refresh({ source = "remote", now = new Date(), all = false, jsonPath: jsonPathOverride, mdPath: mdPathOverride, decisionsPath: decisionsPathOverride } = {}) {
  const rawRecords = source === "remote" ? loadFromRemoteD1() : loadFromLocalFixture(source);
  const built = buildCandidates(rawRecords, { now });

  const decisionsPath = decisionsPathOverride ?? path.join(root, CANDIDATE_DECISIONS_FILE);
  const decisionState = loadDecisions(decisionsPath);
  const candidates = built.candidates.map((candidate) => ({ ...candidate, review_decision: decisionFor(decisionState, candidate.candidate_id) }));
  const result = { ...built, candidates };

  const jsonPath = jsonPathOverride ?? path.join(root, CANDIDATE_REVIEW_JSON);
  const mdPath = mdPathOverride ?? path.join(root, CANDIDATE_REVIEW_MARKDOWN);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(jsonPath, 0o600);
  fs.writeFileSync(mdPath, renderReviewMarkdown(result, { includePast: all }), { mode: 0o600 });
  fs.chmodSync(mdPath, 0o600);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const { summary } = refresh(args);
    console.log([
      "CANDIDATES REFRESH",
      `Source: ${args.source}`,
      `Total source records considered: ${summary.total_source_records}`,
      `Total candidates (after duplicate grouping): ${summary.total_candidates}`,
      `Duplicate groups: ${summary.duplicate_groups}`,
      `By type: ${Object.entries(summary.by_type).map(([type, count]) => `${type}=${count}`).join(", ")}`,
      `By priority: high=${summary.by_priority.high} medium=${summary.by_priority.medium} low=${summary.by_priority.low}`,
      `By time relevance: past=${summary.by_time_relevance.past} near_term=${summary.by_time_relevance.near_term} upcoming=${summary.by_time_relevance.upcoming} future_distant=${summary.by_time_relevance.future_distant} recurring_or_multi_date=${summary.by_time_relevance.recurring_or_multi_date} ambiguous=${summary.by_time_relevance.ambiguous} undated=${summary.by_time_relevance.undated}`,
      `Title suggestions available: ${summary.title_suggestions}`,
      `Ambiguous-date: ${summary.ambiguous_date_count} | Multiple-event-dates: ${summary.multiple_event_dates_count} | Recurring/multi-date: ${summary.recurring_or_multi_date_count}`,
      `Promotion-ready: ${summary.promotion_ready} | Blocked: ${summary.promotion_blocked} (blocked only by title: ${summary.blocked_only_by_title})`,
      `Private output: ${CANDIDATE_REVIEW_JSON}, ${CANDIDATE_REVIEW_MARKDOWN}`,
      "No candidate was promoted or written to canonical content by this command.",
    ].join("\n"));
  } catch (error) {
    console.error(`CANDIDATES REFRESH FAILED\n${error.message}`);
    process.exitCode = 1;
  }
}

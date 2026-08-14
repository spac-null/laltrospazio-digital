import { loadReview } from "./candidates-list.mjs";

export function findCandidate(candidateId, { jsonPath } = {}) {
  const review = loadReview({ jsonPath });
  const candidate = review.candidates.find((item) => item.candidate_id === candidateId);
  if (!candidate) throw new Error(`Candidate not found: ${candidateId}`);
  return candidate;
}

// Never assumes any optional field is a populated object: title,
// title_suggestion, per-field date/location entries, recurring_series, and
// similar fields may legitimately be null/undefined/missing depending on
// candidate type and available evidence. Every one of them is rendered as
// "(none) [missing]" rather than throwing.
function renderFieldEntry(name, entry) {
  if (entry === null || entry === undefined || typeof entry !== "object") return `  - ${name}: (none) [missing]`;
  const shown = entry.value === null || entry.value === undefined ? "(none)" : JSON.stringify(entry.value);
  const status = entry.status ?? "missing";
  const note = entry.evidence ?? entry.reason ?? null;
  return `  - ${name}: ${shown} [${status}]${note ? ` — evidence: ${note}` : ""}`;
}

function renderList(label, items) {
  return `${label}: ${Array.isArray(items) && items.length ? items.join(", ") : "(none)"}`;
}

export function render(candidate) {
  const sources = Array.isArray(candidate.sources) ? candidate.sources : [];
  const fields = candidate.fields && typeof candidate.fields === "object" ? candidate.fields : {};
  const classificationReasons = Array.isArray(candidate.classification_reasons) ? candidate.classification_reasons : [];
  const blockedReasons = Array.isArray(candidate.blocked_reasons) ? candidate.blocked_reasons : [];
  const priorityWhy = Array.isArray(candidate.review_priority_why) ? candidate.review_priority_why : [];

  const lines = [
    `Candidate: ${candidate.candidate_id ?? "(unknown)"}`,
    `Type: ${candidate.candidate_type ?? "(unknown)"}`,
    `Date state: ${candidate.date_state ?? "(none)"} | Time relevance: ${candidate.time_relevance ?? "(none)"}`,
    `Review priority: ${candidate.review_priority ?? "(none)"}${priorityWhy.length ? ` — ${priorityWhy.join("; ")}` : ""}`,
    `Classification reason(s): ${classificationReasons.join("; ") || "(none)"}`,
    "",
    "Sources:",
    ...(sources.length
      ? sources.map((source) => `  - ${source?.network ?? "(unknown)"} ${source?.source_id ?? "(unknown)"}\n    timestamp: ${source?.source_timestamp ?? "(none)"}\n    permalink: ${source?.permalink ?? "(none)"}`)
      : ["  (none)"]),
  ];

  const fieldEntries = Object.entries(fields);
  if (fieldEntries.length) {
    lines.push("", "Fields:");
    for (const [name, entry] of fieldEntries) lines.push(renderFieldEntry(name, entry));
  }

  if (candidate.recurring_series) {
    lines.push("", `Recurring series: ${candidate.recurring_series.cluster_size ?? "?"} related posts (${(candidate.recurring_series.related_candidate_ids ?? []).join(", ") || "none listed"})`);
  }

  lines.push(
    "",
    renderList("Missing fields", candidate.missing_fields),
    renderList("Conflicting fields", candidate.conflicting_fields),
    renderList("Ambiguous fields", candidate.ambiguous_fields),
    `Promotion readiness: ${candidate.promotion_readiness ?? "(unknown)"}`,
  );
  if (blockedReasons.length) lines.push(`Blocked because: ${blockedReasons.join("; ")}`);
  if (candidate.next_owner_action) lines.push(`Next owner action: ${candidate.next_owner_action}`);
  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const candidateId = process.argv[2];
  if (!candidateId) {
    console.error("Usage: npm run candidates:show -- <candidate-id>");
    process.exitCode = 1;
  } else {
    try {
      console.log(render(findCandidate(candidateId)));
    } catch (error) {
      console.error(`CANDIDATES SHOW FAILED\n${error.message}`);
      process.exitCode = 1;
    }
  }
}

import { loadReview } from "./candidates-list.mjs";

export function findCandidate(candidateId, { jsonPath } = {}) {
  const review = loadReview({ jsonPath });
  const candidate = review.candidates.find((item) => item.candidate_id === candidateId);
  if (!candidate) throw new Error(`Candidate not found: ${candidateId}`);
  return candidate;
}

function render(candidate) {
  const lines = [
    `Candidate: ${candidate.candidate_id}`,
    `Type: ${candidate.candidate_type}`,
    `Time relevance: ${candidate.time_relevance}`,
    `Classification reason(s): ${candidate.classification_reasons.join("; ")}`,
    "",
    "Sources:",
    ...candidate.sources.map((source) => `  - ${source.network} ${source.source_id}\n    timestamp: ${source.source_timestamp ?? "(none)"}\n    permalink: ${source.permalink ?? "(none)"}`),
  ];
  if (Object.keys(candidate.fields).length) {
    lines.push("", "Fields:");
    for (const [name, value] of Object.entries(candidate.fields)) {
      lines.push(`  - ${name}: ${value.value === null ? "(none)" : JSON.stringify(value.value)} [${value.status}]${value.evidence ? ` — evidence: ${value.evidence}` : ""}`);
    }
  }
  lines.push(
    "",
    `Missing fields: ${candidate.missing_fields.join(", ") || "(none)"}`,
    `Conflicting fields: ${candidate.conflicting_fields.join(", ") || "(none)"}`,
    `Promotion readiness: ${candidate.promotion_readiness}`,
  );
  if (candidate.blocked_reasons.length) lines.push(`Blocked because: ${candidate.blocked_reasons.join("; ")}`);
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

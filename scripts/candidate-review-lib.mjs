import {
  candidateIdForGroup,
  classifyCandidateType,
  classifyTimeRelevance,
  extractExplicitDate,
  extractExplicitTime,
  findDateConflicts,
  groupDuplicates,
  todayInTimezone,
} from "./candidate-detect.mjs";

export const VENUE_ID = "l-altro-spazio-bologna";
export const VENUE_NAME = "L'Altro Spazio";
export const VENUE_ADDRESS = "Via Nazario Sauro 24/F, Bologna";
export const VENUE_TIMEZONE = "Europe/Rome";

// Builds a correct-offset ISO 8601 datetime for a given local wall-clock
// date/time in `timezone`, using the real (DST-aware) UTC offset for that
// calendar date rather than a hardcoded +01:00/+02:00. Deterministic: no
// guessing, just Intl's own timezone database.
export function isoWithOffset(dateStr, timeStr, timezone = VENUE_TIMEZONE) {
  const seed = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "longOffset" }).formatToParts(seed);
  const offsetPart = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";
  const offset = offsetPart.replace("GMT", "") || "+00:00";
  return `${dateStr}T${timeStr}:00${offset}`;
}

// Adapts a raw meta_source_records D1 row (candidate_signals stored as a
// JSON text column) into the common shape used by this module.
export function fromD1Row(row) {
  return {
    source_network: row.network,
    source_id: row.source_id,
    source_account_id: row.source_account_id,
    source_timestamp: row.source_timestamp ?? null,
    message_or_caption: row.message_or_caption ?? null,
    permalink: row.permalink ?? null,
    media_type: row.media_type ?? null,
    candidate_signals: typeof row.candidate_signals === "string" ? JSON.parse(row.candidate_signals) : (row.candidate_signals ?? {}),
  };
}

// Adapts an already-normalized feeders/meta/normalize.mjs record (as written
// by scripts/meta-ingest-lib.mjs / npm run meta:ingest) into the same shape.
// This does not re-run normalization; it only renames fields.
export function fromNormalizedRecord(record) {
  return {
    source_network: record.source_network,
    source_id: record.source_id,
    source_account_id: record.source_account_id,
    source_timestamp: record.published_at ?? null,
    message_or_caption: record.caption ?? null,
    permalink: record.permalink ?? null,
    media_type: record.media?.type ?? null,
    candidate_signals: record.candidate_signals ?? {},
  };
}

function sourceRef(record) {
  return {
    network: record.source_network,
    source_id: record.source_id,
    source_account_id: record.source_account_id,
    source_timestamp: record.source_timestamp,
    permalink: record.permalink,
  };
}

function field(value, status, evidence = null) {
  return { value, status, evidence };
}

function buildEventOrNoticeFields(sourceRecords, conflictedDateSourceIds, referenceDate) {
  const primary = sourceRecords[0];
  const text = primary.message_or_caption;
  const dateResult = extractExplicitDate(text, { referenceDate });
  const { value: timeValue, evidence: timeEvidence } = extractExplicitTime(text);

  const hasConflict = sourceRecords.some((record) => conflictedDateSourceIds.has(`${record.source_network}:${record.source_id}`));

  const startDateField = hasConflict
    ? field(null, "conflicting", "source records disagree on the explicit date (see conflicting_fields)")
    : dateResult.status === "extracted"
      ? field(dateResult.value, "extracted", dateResult.evidence)
      : dateResult.status === "inferred"
        ? field(dateResult.value, "inferred", `${dateResult.evidence} (year not stated in source; guessed as the nearest same-or-future occurrence — never publishable without owner confirmation)`)
        : field(null, "missing", null);

  const fields = {
    title: field(null, "missing", null),
    description: text ? field(text, "extracted", "verbatim source caption/message") : field(null, "missing", null),
    start_date: startDateField,
    start_time: timeValue ? field(timeValue, "extracted", timeEvidence) : field(null, "missing", null),
    location_name: field(VENUE_NAME, "extracted", "derived from posting account identity (the venue's own Facebook Page / Instagram account)"),
  };

  const missing = Object.entries(fields).filter(([, entry]) => entry.status === "missing").map(([name]) => name);
  const conflicting = Object.entries(fields).filter(([, entry]) => entry.status === "conflicting").map(([name]) => name);
  const inferred = Object.entries(fields).filter(([, entry]) => entry.status === "inferred").map(([name]) => name);

  return { fields, missing, conflicting, inferred };
}

function promotionReadiness(candidateType, missing, conflicting, inferred) {
  if (!["event", "operational_notice"].includes(candidateType)) {
    return { readiness: "not_applicable", reasons: [`candidate_type "${candidateType}" is not a promotable type`] };
  }
  const reasons = [];
  if (missing.length) reasons.push(`missing required field(s): ${missing.join(", ")}`);
  if (conflicting.length) reasons.push(`conflicting field(s) need owner resolution: ${conflicting.join(", ")}`);
  if (inferred.length) reasons.push(`inferred (guessed, not verified) field(s) need owner confirmation: ${inferred.join(", ")}`);
  if (candidateType === "operational_notice") reasons.push("operational notices always require explicit owner confirmation of message/dates (see docs)");
  return { readiness: reasons.length ? "blocked" : "ready", reasons };
}

export function buildCandidates(rawRecords, { now = new Date(), timezone = VENUE_TIMEZONE } = {}) {
  const today = todayInTimezone(now, timezone);
  const conflicts = findDateConflicts(rawRecords, { referenceDate: today });
  const conflictedSourceIds = new Set();
  for (const conflict of conflicts) {
    conflictedSourceIds.add(`${conflict.a.source_network}:${conflict.a.source_id}`);
    conflictedSourceIds.add(`${conflict.b.source_network}:${conflict.b.source_id}`);
  }

  const groups = groupDuplicates(rawRecords, { referenceDate: today });

  const candidates = groups.map((sourceRecords) => {
    const primary = sourceRecords[0];
    const { type: candidateType, reasons: classificationReasons } = classifyCandidateType(primary);
    const explicitDate = extractExplicitDate(primary.message_or_caption, { referenceDate: today }).value;
    const timeRelevance = classifyTimeRelevance(explicitDate, { today });

    let fieldsResult = { fields: {}, missing: [], conflicting: [], inferred: [] };
    if (["event", "operational_notice"].includes(candidateType)) {
      fieldsResult = buildEventOrNoticeFields(sourceRecords, conflictedSourceIds, today);
    }
    const { readiness, reasons: blockedReasons } = promotionReadiness(candidateType, fieldsResult.missing, fieldsResult.conflicting, fieldsResult.inferred);

    return {
      visibility: "private",
      candidate_id: candidateIdForGroup(sourceRecords),
      candidate_type: candidateType,
      classification_reasons: classificationReasons,
      time_relevance: timeRelevance,
      sources: sourceRecords.map(sourceRef),
      fields: fieldsResult.fields,
      missing_fields: fieldsResult.missing,
      conflicting_fields: fieldsResult.conflicting,
      inferred_fields: fieldsResult.inferred,
      promotion_readiness: readiness,
      blocked_reasons: blockedReasons,
      generated_at: now.toISOString(),
    };
  });

  const summary = {
    total_source_records: rawRecords.length,
    total_candidates: candidates.length,
    duplicate_groups: candidates.filter((candidate) => candidate.sources.length > 1).length,
    by_time_relevance: Object.fromEntries(["past", "current", "upcoming", "undated"].map((key) => [key, candidates.filter((candidate) => candidate.time_relevance === key).length])),
    by_type: Object.fromEntries(candidates.reduce((map, candidate) => map.set(candidate.candidate_type, (map.get(candidate.candidate_type) ?? 0) + 1), new Map())),
    promotion_ready: candidates.filter((candidate) => candidate.promotion_readiness === "ready").length,
    promotion_blocked: candidates.filter((candidate) => candidate.promotion_readiness === "blocked").length,
    date_conflicts_detected: conflicts.length,
    generated_at: now.toISOString(),
  };

  return { visibility: "private", candidates, summary };
}

function priorityRank(candidate) {
  if (candidate.time_relevance === "upcoming") return 0;
  if (candidate.candidate_type === "operational_notice" && candidate.time_relevance === "current") return 1;
  if (candidate.time_relevance === "current") return 2;
  if (candidate.time_relevance === "undated") return 3;
  return 4; // past
}

export function sortForReport(candidates) {
  return [...candidates].sort((a, b) => priorityRank(a) - priorityRank(b) || (b.sources[0]?.source_timestamp ?? "").localeCompare(a.sources[0]?.source_timestamp ?? ""));
}

function renderCandidateMarkdown(candidate) {
  const lines = [
    `### ${candidate.candidate_id}`,
    "",
    `- Type: ${candidate.candidate_type}`,
    `- Time relevance: ${candidate.time_relevance}`,
    `- Classification reason(s): ${candidate.classification_reasons.join("; ")}`,
    `- Source network(s): ${candidate.sources.map((source) => source.network).join(", ")}`,
  ];
  for (const source of candidate.sources) {
    lines.push(`  - ${source.network} ${source.source_id} — ${source.source_timestamp ?? "no timestamp"} — ${source.permalink ?? "no permalink"}`);
  }
  if (Object.keys(candidate.fields).length) {
    lines.push("- Fields:");
    for (const [name, value] of Object.entries(candidate.fields)) {
      const shown = value.value === null ? "(none)" : JSON.stringify(value.value);
      lines.push(`  - ${name}: ${shown} [${value.status}]${value.evidence ? ` — evidence: ${value.evidence}` : ""}`);
    }
  }
  if (candidate.missing_fields.length) lines.push(`- Missing: ${candidate.missing_fields.join(", ")}`);
  if (candidate.conflicting_fields.length) lines.push(`- Conflicting: ${candidate.conflicting_fields.join(", ")}`);
  lines.push(`- Promotion readiness: ${candidate.promotion_readiness}`);
  if (candidate.blocked_reasons.length) lines.push(`- Blocked because: ${candidate.blocked_reasons.join("; ")}`);
  lines.push("");
  return lines.join("\n");
}

export function renderReviewMarkdown({ candidates, summary }, { includePast = false } = {}) {
  const sorted = sortForReport(candidates).filter((candidate) => includePast || candidate.time_relevance !== "past");
  const header = [
    "# Meta candidate review",
    "",
    `Generated: ${summary.generated_at}`,
    "",
    `Total source records considered: ${summary.total_source_records}`,
    `Total candidates (after duplicate grouping): ${summary.total_candidates}`,
    `Duplicate groups: ${summary.duplicate_groups}`,
    `Date conflicts detected: ${summary.date_conflicts_detected}`,
    `By time relevance: past=${summary.by_time_relevance.past} current=${summary.by_time_relevance.current} upcoming=${summary.by_time_relevance.upcoming} undated=${summary.by_time_relevance.undated}`,
    `Promotion-ready: ${summary.promotion_ready} | Blocked: ${summary.promotion_blocked}`,
    "",
    includePast ? "Showing all candidates, including past." : "Past candidates are hidden by default (pass --all to candidates:list to see them).",
    "",
    "## Actionable candidates",
    "",
  ];
  return header.join("\n") + sorted.map(renderCandidateMarkdown).join("\n");
}

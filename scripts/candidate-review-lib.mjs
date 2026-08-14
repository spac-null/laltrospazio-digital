import {
  candidateIdForGroup,
  classifyCandidateType,
  classifyDateShape,
  classifyTimeRelevance,
  extractExplicitDate,
  extractExplicitTime,
  findDateRelationships,
  groupDuplicates,
  suggestTitle,
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

function normalizeQuotes(text) {
  return `${text ?? ""}`.replace(/[’‘]/g, "'");
}

// Deterministic and conservative: this does NOT guess a new location from
// arbitrary text. It only checks whether the ALREADY-KNOWN canonical venue
// name and/or street address appears verbatim (apostrophe-normalized) in
// the post's own text. If so, the location is genuinely EXTRACTED — traced
// to explicit source text, exactly like a date or time. If neither appears,
// there is no textual evidence for the location in this specific post; the
// venue-identity default is available only as INFERRED/contextual (derived
// from which account posted it), never as a verified fact.
function extractExplicitLocation(text, venueName, venueAddress) {
  if (!text) return null;
  const normalized = normalizeQuotes(text);
  const streetPart = venueAddress.split(",")[0].trim();
  const nameMatch = normalized.includes(venueName);
  const addressMatch = normalized.includes(streetPart);
  if (!nameMatch && !addressMatch) return null;
  const evidence = [nameMatch && venueName, addressMatch && streetPart].filter(Boolean).join(" / ");
  return { evidence };
}

const recordKey = (record) => `${record.source_network}:${record.source_id}`;

// Determines this candidate's date_state and the resulting start_date/
// end_date fields, from three deterministic inputs: what the primary
// record's OWN text implies (single/range/list — classifyDateShape), and
// whether this record participates in an isolated ambiguous pair or a
// recurring cluster (from findDateRelationships, computed once for the
// whole batch). Only "ambiguous_date" and "conflicting_sources" block
// because of date conflict; "multiple_event_dates" blocks separately
// because no single date field value can be chosen, not because of a
// cross-source disagreement.
function resolveDateState(sourceRecords, { ambiguousSourceIds, recurringSourceIds, recurringClusterInfo, referenceDate, timezone }) {
  const primary = sourceRecords[0];
  const text = primary.message_or_caption;
  // Anchor yearless-date resolution to the record's OWN source timestamp
  // (converted to venue-local date) — never to "today" — so an archived
  // post's date is never rolled into the future merely because time has
  // passed since it was posted. referenceDate is only a last-resort
  // fallback for the rare record with no source_timestamp at all.
  const anchor = primary.source_timestamp ? todayInTimezone(new Date(primary.source_timestamp), timezone) : referenceDate;
  const shape = classifyDateShape(text, { anchorDate: anchor });
  const isAmbiguousCrossSource = sourceRecords.some((record) => ambiguousSourceIds.has(recordKey(record)));
  const isRecurring = sourceRecords.some((record) => recurringSourceIds.has(recordKey(record)));
  const recurringInfo = isRecurring ? sourceRecords.map((record) => recurringClusterInfo.get(recordKey(record))).find(Boolean) : null;

  if (isAmbiguousCrossSource || shape.shape === "ambiguous") {
    return {
      dateState: "ambiguous_date",
      startDate: field(
        null,
        "ambiguous",
        shape.shape === "ambiguous"
          ? "the source states a day/month (and possibly a weekday) that does not resolve to exactly one plausible year near the post's own timestamp"
          : "this candidate's date disagrees with a highly similar, but not clearly recurring, other source — see the related candidate",
      ),
      endDate: field(null, "missing", null),
      recurringInfo: null,
    };
  }

  if (shape.shape === "none") {
    return { dateState: "undated", startDate: field(null, "missing", null), endDate: field(null, "missing", null), recurringInfo };
  }

  if (shape.shape === "range") {
    const [start, end] = shape.dates;
    return {
      dateState: "explicit_date_range",
      startDate: field(start.value, start.status, start.evidence),
      endDate: field(end.value, end.status, end.evidence),
      recurringInfo,
    };
  }

  // Two dates directly joined by "e"/"ed"/"&"/"," (e.g. "venerdì 31 ottobre e
  // sabato 1 novembre") are a genuine two-night programme with two real,
  // known dates — not an unresolved ambiguity. Canonical event records only
  // carry one start/end pair (docs/project/event-schema.md), so this still
  // cannot auto-populate a single start_date and still blocks promotion —
  // but the block reason correctly says "two real dates were found", not
  // "cannot determine which one applies".
  if (shape.shape === "multi_date_event") {
    const [first, second] = shape.dates;
    return {
      dateState: "multi_date_event",
      startDate: field(
        null,
        "missing",
        `source text describes two separate genuine event dates joined by "e"/"and" (not an unclear reference): ${first.value} and ${second.value}. Canonical event records only support one start/end pair, so this cannot auto-populate a single date — promote each date as its own event with an explicit --date, or extend the schema before combining them.`,
      ),
      endDate: field(null, "missing", null),
      recurringInfo,
    };
  }

  if (shape.shape === "list") {
    return {
      dateState: "multiple_event_dates",
      startDate: field(null, "missing", `source text lists ${shape.dates.length} distinct dates with no recognized range connector; cannot determine which one this candidate refers to without an owner override`),
      endDate: field(null, "missing", null),
      recurringInfo,
    };
  }

  const [only] = shape.dates;
  return {
    dateState: "single_explicit_date",
    startDate: field(only.value, only.status, only.status === "inferred" ? `${only.evidence} (year not stated in source; resolved to the calendar year closest to this post's own timestamp — never publishable without owner confirmation)` : only.evidence),
    endDate: field(null, "missing", null),
    recurringInfo,
  };
}

function buildEventOrNoticeFields(sourceRecords, dateResolution) {
  const primary = sourceRecords[0];
  const text = primary.message_or_caption;
  const { value: timeValue, evidence: timeEvidence } = extractExplicitTime(text);
  const titleSuggestion = suggestTitle(sourceRecords);
  const explicitLocation = extractExplicitLocation(text, VENUE_NAME, VENUE_ADDRESS);

  const fields = {
    title: field(null, "missing", null),
    description: text ? field(text, "extracted", "verbatim source caption/message") : field(null, "missing", null),
    start_date: dateResolution.startDate,
    end_date: dateResolution.endDate,
    start_time: timeValue ? field(timeValue, "extracted", timeEvidence) : field(null, "missing", null),
    location_name: explicitLocation
      ? field(VENUE_NAME, "extracted", `explicit source text contains: ${explicitLocation.evidence}`)
      : field(VENUE_NAME, "inferred", "derived from posting account identity (the venue's own Facebook Page / Instagram account), not explicitly restated in this post's own text — confirm before publishing"),
  };

  const missing = Object.entries(fields).filter(([name, entry]) => entry.status === "missing" && name !== "end_date").map(([name]) => name);
  const conflicting = Object.entries(fields).filter(([, entry]) => entry.status === "conflicting").map(([name]) => name);
  const ambiguous = Object.entries(fields).filter(([, entry]) => entry.status === "ambiguous").map(([name]) => name);
  const inferred = Object.entries(fields).filter(([, entry]) => entry.status === "inferred").map(([name]) => name);

  return {
    fields,
    missing,
    conflicting,
    ambiguous,
    inferred,
    title_suggestion: titleSuggestion ? { value: titleSuggestion.value, status: "inferred", reason: titleSuggestion.reason } : null,
  };
}

function promotionReadiness(candidateType, { missing, conflicting, ambiguous, inferred }) {
  if (!["event", "operational_notice"].includes(candidateType)) {
    return { readiness: "not_applicable", reasons: [`candidate_type "${candidateType}" is not a promotable type`] };
  }
  const reasons = [];
  if (missing.length) reasons.push(`missing required field(s): ${missing.join(", ")}`);
  if (conflicting.length) reasons.push(`conflicting field(s) need owner resolution: ${conflicting.join(", ")}`);
  if (ambiguous.length) reasons.push(`ambiguous field(s) need owner resolution: ${ambiguous.join(", ")}`);
  if (inferred.length) reasons.push(`inferred (guessed, not verified) field(s) need owner confirmation: ${inferred.join(", ")}`);
  if (candidateType === "operational_notice") reasons.push("operational notices always require explicit owner confirmation of message/dates (see docs)");
  return { readiness: reasons.length ? "blocked" : "ready", reasons };
}

// Deterministic, categorical (no numeric pseudo-confidence) review priority.
export function computeReviewPriority(candidate) {
  const isEventOrNotice = ["event", "operational_notice"].includes(candidate.candidate_type);
  const hasPermalink = candidate.sources.some((source) => source.permalink);
  const substantiveMissing = candidate.missing_fields.filter((name) => name !== "title");
  const lowAmbiguity = ["single_explicit_date", "explicit_date_range"].includes(candidate.date_state);
  const nearOrUpcoming = ["near_term", "upcoming"].includes(candidate.time_relevance);

  if (isEventOrNotice && lowAmbiguity && nearOrUpcoming && hasPermalink && substantiveMissing.length === 0) {
    return {
      priority: "high",
      why: [
        `explicit ${candidate.time_relevance === "near_term" ? "near-term" : "upcoming"} date (${candidate.fields.start_date?.value ?? "n/a"})`,
        `strong ${candidate.candidate_type} signal`,
        "has a usable source permalink",
        `low date ambiguity (date_state: ${candidate.date_state})`,
        candidate.missing_fields.length ? `only owner-confirmable field(s) remain: ${candidate.missing_fields.join(", ")}` : "no missing fields besides the always-required owner title confirmation",
      ],
    };
  }

  if (isEventOrNotice) {
    const why = [`${candidate.candidate_type} signal present`];
    if (candidate.date_state === "multi_date_event") why.push("date_state is \"multi_date_event\" — two genuine separate dates found, not an unclear reference");
    else if (["multiple_event_dates", "ambiguous_date", "conflicting_sources"].includes(candidate.date_state)) why.push(`date_state is "${candidate.date_state}", needs clarification`);
    if (candidate.time_relevance === "future_distant") why.push("date is more than 60 days out");
    if (candidate.time_relevance === "recurring_or_multi_date") why.push(`part of a likely recurring series (${candidate.recurring_series?.cluster_size ?? "?"} related posts found)`);
    if (substantiveMissing.length) why.push(`missing substantive field(s): ${substantiveMissing.join(", ")}`);
    if (why.length === 1) why.push("not near-term/upcoming, or missing a usable permalink");
    return { priority: "medium", why };
  }

  return { priority: "low", why: [`candidate_type "${candidate.candidate_type}" is weak/generic, or the date is past/undated/ambiguous`] };
}

function nextOwnerAction(candidate) {
  if (candidate.candidate_type === "operational_notice") return "Review with candidates:show, then promote with --message/--valid-from/--valid-until/--notice-type if genuine.";
  if (candidate.candidate_type === "event") {
    if (candidate.date_state === "multi_date_event") return "Inspect the source with candidates:show: it names two genuine separate dates (a multi-night programme) — promote each date as its own event with an explicit --date, since one canonical record can only hold a single start/end pair.";
    if (candidate.date_state === "multiple_event_dates") return "Inspect the source with candidates:show: it lists multiple dates — decide which one applies, then promote with --date (and --time).";
    if (candidate.date_state === "ambiguous_date") return "Inspect the disagreeing sources with candidates:show, then promote with an explicit --date to resolve.";
    if (candidate.missing_fields.length === 1 && candidate.missing_fields[0] === "title") return `Confirm a title${candidate.fields.title_suggestion ? ` (suggestion: "${candidate.fields.title_suggestion.value}")` : ""} and promote with --title.`;
    if (candidate.missing_fields.length) return `Provide the missing field(s) via promote flags: ${candidate.missing_fields.join(", ")}.`;
    return "Review with candidates:show, then promote.";
  }
  return "No owner action needed unless this classification looks wrong.";
}

export function buildCandidates(rawRecords, { now = new Date(), timezone = VENUE_TIMEZONE, recurringClusterMinSize } = {}) {
  const today = todayInTimezone(now, timezone);
  const { ambiguousPairs, recurringClusters } = findDateRelationships(rawRecords, { referenceDate: today, recurringClusterMinSize, timezone });

  const ambiguousSourceIds = new Set();
  for (const pair of ambiguousPairs) for (const record of pair) ambiguousSourceIds.add(recordKey(record));

  const recurringSourceIds = new Set();
  const recurringClusterInfo = new Map();
  for (const cluster of recurringClusters) {
    const relatedIds = cluster.map((record) => `meta-${record.source_network}-${record.source_id}`);
    for (const record of cluster) {
      recurringSourceIds.add(recordKey(record));
      recurringClusterInfo.set(recordKey(record), { cluster_size: cluster.length, related_candidate_ids: relatedIds });
    }
  }

  const groups = groupDuplicates(rawRecords, { referenceDate: today, timezone });

  const candidates = groups.map((sourceRecords) => {
    const primary = sourceRecords[0];
    const { type: candidateType, reasons: classificationReasons } = classifyCandidateType(primary);

    let fieldsResult = { fields: {}, missing: [], conflicting: [], ambiguous: [], inferred: [], title_suggestion: null };
    let dateState = "undated";
    let recurringInfo = null;
    if (["event", "operational_notice"].includes(candidateType)) {
      const dateResolution = resolveDateState(sourceRecords, { ambiguousSourceIds, recurringSourceIds, recurringClusterInfo, referenceDate: today, timezone });
      dateState = dateResolution.dateState;
      recurringInfo = dateResolution.recurringInfo;
      fieldsResult = buildEventOrNoticeFields(sourceRecords, dateResolution);
    }

    const explicitDate = fieldsResult.fields.start_date?.value ?? null;
    const isAmbiguousTime = dateState === "ambiguous_date" || dateState === "conflicting_sources";
    const timeRelevance = classifyTimeRelevance(explicitDate, { today, isAmbiguous: isAmbiguousTime, isRecurring: Boolean(recurringInfo) });

    const { readiness, reasons: blockedReasons } = promotionReadiness(candidateType, fieldsResult);

    const candidate = {
      visibility: "private",
      candidate_id: candidateIdForGroup(sourceRecords),
      candidate_type: candidateType,
      classification_reasons: classificationReasons,
      date_state: dateState,
      recurring_series: recurringInfo,
      time_relevance: timeRelevance,
      sources: sourceRecords.map(sourceRef),
      fields: { ...fieldsResult.fields, title_suggestion: fieldsResult.title_suggestion },
      missing_fields: fieldsResult.missing,
      conflicting_fields: fieldsResult.conflicting,
      ambiguous_fields: fieldsResult.ambiguous,
      inferred_fields: fieldsResult.inferred,
      promotion_readiness: readiness,
      blocked_reasons: blockedReasons,
      generated_at: now.toISOString(),
    };

    const { priority, why } = computeReviewPriority(candidate);
    candidate.review_priority = priority;
    candidate.review_priority_why = why;
    candidate.next_owner_action = nextOwnerAction(candidate);

    return candidate;
  });

  const summary = {
    total_source_records: rawRecords.length,
    total_candidates: candidates.length,
    duplicate_groups: candidates.filter((candidate) => candidate.sources.length > 1).length,
    by_time_relevance: Object.fromEntries(["past", "near_term", "upcoming", "future_distant", "recurring_or_multi_date", "ambiguous", "undated"].map((key) => [key, candidates.filter((candidate) => candidate.time_relevance === key).length])),
    by_type: Object.fromEntries(candidates.reduce((map, candidate) => map.set(candidate.candidate_type, (map.get(candidate.candidate_type) ?? 0) + 1), new Map())),
    by_priority: Object.fromEntries(["high", "medium", "low"].map((key) => [key, candidates.filter((candidate) => candidate.review_priority === key).length])),
    promotion_ready: candidates.filter((candidate) => candidate.promotion_readiness === "ready").length,
    promotion_blocked: candidates.filter((candidate) => candidate.promotion_readiness === "blocked").length,
    blocked_only_by_title: candidates.filter((candidate) => candidate.promotion_readiness === "blocked" && candidate.missing_fields.length === 1 && candidate.missing_fields[0] === "title" && candidate.conflicting_fields.length === 0 && candidate.ambiguous_fields.length === 0 && candidate.inferred_fields.length === 0).length,
    title_suggestions: candidates.filter((candidate) => candidate.fields.title_suggestion).length,
    ambiguous_date_count: candidates.filter((candidate) => candidate.date_state === "ambiguous_date").length,
    multiple_event_dates_count: candidates.filter((candidate) => candidate.date_state === "multiple_event_dates").length,
    multi_date_event_count: candidates.filter((candidate) => candidate.date_state === "multi_date_event").length,
    recurring_or_multi_date_count: candidates.filter((candidate) => Boolean(candidate.recurring_series)).length,
    generated_at: now.toISOString(),
  };

  return { visibility: "private", candidates, summary };
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function timeRelevanceRank(candidate) {
  const order = ["near_term", "upcoming", "recurring_or_multi_date", "future_distant", "ambiguous", "undated", "past"];
  return order.indexOf(candidate.time_relevance);
}

export function sortForReport(candidates) {
  return [...candidates].sort(
    (a, b) => PRIORITY_RANK[a.review_priority] - PRIORITY_RANK[b.review_priority]
      || timeRelevanceRank(a) - timeRelevanceRank(b)
      || (b.sources[0]?.source_timestamp ?? "").localeCompare(a.sources[0]?.source_timestamp ?? ""),
  );
}

export function filterCandidates(candidates, { priority, type, upcomingOnly, blockedOnly, pastOnly, limit } = {}) {
  let result = candidates;
  if (priority) result = result.filter((candidate) => candidate.review_priority === priority);
  if (type) result = result.filter((candidate) => candidate.candidate_type === type);
  if (upcomingOnly) result = result.filter((candidate) => ["near_term", "upcoming", "future_distant"].includes(candidate.time_relevance));
  if (blockedOnly) result = result.filter((candidate) => candidate.promotion_readiness === "blocked");
  if (pastOnly) result = result.filter((candidate) => candidate.time_relevance === "past");
  const sorted = sortForReport(result);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

// The default "review" view: only unresolved, non-past, non-low-priority
// noise — the material actually worth an owner's attention right now.
export function defaultReviewQueue(candidates) {
  return sortForReport(candidates.filter((candidate) => candidate.time_relevance !== "past" && candidate.review_priority !== "low"));
}

function renderCandidateMarkdown(candidate) {
  const lines = [
    `### ${candidate.candidate_id}`,
    "",
    `- Type: ${candidate.candidate_type}`,
    `- Priority: ${candidate.review_priority} — ${candidate.review_priority_why.join("; ")}`,
    `- Date state: ${candidate.date_state} | Time relevance: ${candidate.time_relevance}`,
    `- Classification reason(s): ${candidate.classification_reasons.join("; ")}`,
    `- Source network(s): ${candidate.sources.map((source) => source.network).join(", ")}`,
  ];
  for (const source of candidate.sources) {
    lines.push(`  - ${source.network} ${source.source_id} — ${source.source_timestamp ?? "no timestamp"} — ${source.permalink ?? "no permalink"}`);
  }
  if (candidate.fields.title_suggestion) lines.push(`- Title suggestion: "${candidate.fields.title_suggestion.value}" [inferred — ${candidate.fields.title_suggestion.reason}]`);
  const structuredFields = Object.entries(candidate.fields).filter(([name]) => name !== "title_suggestion");
  if (structuredFields.length) {
    lines.push("- Fields:");
    for (const [name, value] of structuredFields) {
      const shown = value.value === null ? "(none)" : JSON.stringify(value.value);
      lines.push(`  - ${name}: ${shown} [${value.status}]${value.evidence ? ` — evidence: ${value.evidence}` : ""}`);
    }
  }
  if (candidate.missing_fields.length) lines.push(`- Missing: ${candidate.missing_fields.join(", ")}`);
  if (candidate.conflicting_fields.length) lines.push(`- Conflicting: ${candidate.conflicting_fields.join(", ")}`);
  if (candidate.ambiguous_fields.length) lines.push(`- Ambiguous: ${candidate.ambiguous_fields.join(", ")}`);
  if (candidate.recurring_series) lines.push(`- Recurring series: ${candidate.recurring_series.cluster_size} related posts (${candidate.recurring_series.related_candidate_ids.join(", ")})`);
  lines.push(`- Promotion readiness: ${candidate.promotion_readiness}`);
  if (candidate.blocked_reasons.length) lines.push(`- Blocked because: ${candidate.blocked_reasons.join("; ")}`);
  lines.push(`- Next owner action: ${candidate.next_owner_action}`);
  lines.push("");
  return lines.join("\n");
}

export function renderReviewMarkdown({ candidates, summary }, { includePast = false } = {}) {
  const base = includePast ? candidates : candidates.filter((candidate) => candidate.time_relevance !== "past");
  const sorted = sortForReport(base);
  const header = [
    "# Meta candidate review",
    "",
    `Generated: ${summary.generated_at}`,
    "",
    `Total source records considered: ${summary.total_source_records}`,
    `Total candidates (after duplicate grouping): ${summary.total_candidates}`,
    `Duplicate groups: ${summary.duplicate_groups}`,
    `By priority: high=${summary.by_priority.high} medium=${summary.by_priority.medium} low=${summary.by_priority.low}`,
    `By time relevance: past=${summary.by_time_relevance.past} near_term=${summary.by_time_relevance.near_term} upcoming=${summary.by_time_relevance.upcoming} future_distant=${summary.by_time_relevance.future_distant} recurring_or_multi_date=${summary.by_time_relevance.recurring_or_multi_date} ambiguous=${summary.by_time_relevance.ambiguous} undated=${summary.by_time_relevance.undated}`,
    `Title suggestions available: ${summary.title_suggestions}`,
    `Ambiguous-date count: ${summary.ambiguous_date_count} | Multiple-event-dates count: ${summary.multiple_event_dates_count} | Multi-date-event count: ${summary.multi_date_event_count} | Recurring/multi-date count: ${summary.recurring_or_multi_date_count}`,
    `Promotion-ready: ${summary.promotion_ready} | Blocked: ${summary.promotion_blocked} (of which blocked only by title confirmation: ${summary.blocked_only_by_title})`,
    "",
    includePast ? "Showing all candidates, including past." : "Past candidates are hidden by default (pass --all to candidates:list to see them).",
    "",
    "## Actionable candidates",
    "",
  ];
  return header.join("\n") + sorted.map(renderCandidateMarkdown).join("\n");
}

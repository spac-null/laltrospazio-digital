import { createHash } from "node:crypto";

export const CANDIDATE_TYPES = ["event", "operational_notice", "art_or_exhibition", "menu_or_product", "venue_generic", "irrelevant", "unknown"];
export const TIME_RELEVANCE = ["past", "current", "upcoming", "undated"];

const MONTHS_IT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function pad2(value) {
  return String(value).padStart(2, "0");
}

function validDayMonth(day, month) {
  return day >= 1 && day <= 31 && month >= 1 && month <= 12;
}

function inferYear(day, month, referenceDate) {
  const [refYear, refMonth, refDay] = referenceDate.split("-").map(Number);
  const hasPassedThisYear = month < refMonth || (month === refMonth && day < refDay);
  return hasPassedThisYear ? refYear + 1 : refYear;
}

// Deterministic date extraction/inference:
// - An explicit year in the source text (ISO, DD/MM/YYYY, or "20 agosto
//   2026") yields status "extracted" — the value is traceable verbatim to
//   source text, just reformatted.
// - A bare day/month with NO year (e.g. "20/08", "20 agosto") yields status
//   "inferred": the year is guessed deterministically as the nearest
//   same-or-future occurrence of that day/month relative to referenceDate.
//   This is never treated as a verified fact — callers must block
//   publication on an "inferred" status without an explicit owner override.
// - No date-shaped text at all yields status "missing".
export function extractExplicitDate(text, { referenceDate } = {}) {
  if (!text) return { value: null, status: "missing", evidence: null };
  const today = referenceDate ?? new Date().toISOString().slice(0, 10);

  const isoMatch = text.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (isoMatch) {
    const [raw, year, month, day] = isoMatch;
    if (validDayMonth(Number(day), Number(month))) {
      return { value: `${year}-${pad2(month)}-${pad2(day)}`, status: "extracted", evidence: raw };
    }
  }

  const dmyMatch = text.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/);
  if (dmyMatch) {
    const [raw, day, month, year] = dmyMatch;
    if (validDayMonth(Number(day), Number(month))) {
      return { value: `${year}-${pad2(month)}-${pad2(day)}`, status: "extracted", evidence: raw };
    }
  }

  const monthNamePattern = new RegExp(`\\b(\\d{1,2})\\s+(${MONTHS_IT.join("|")})(?:\\s+(\\d{4}))?\\b`, "i");
  const monthNameMatch = text.match(monthNamePattern);
  if (monthNameMatch) {
    const [raw, day, monthName, year] = monthNameMatch;
    const month = MONTHS_IT.indexOf(monthName.toLowerCase()) + 1;
    if (validDayMonth(Number(day), month)) {
      if (year) return { value: `${year}-${pad2(month)}-${pad2(day)}`, status: "extracted", evidence: raw };
      const inferredYear = inferYear(Number(day), month, today);
      return { value: `${inferredYear}-${pad2(month)}-${pad2(day)}`, status: "inferred", evidence: raw };
    }
  }

  const bareMatch = text.match(/\b(\d{1,2})[./-](\d{1,2})\b/);
  if (bareMatch) {
    const [raw, day, month] = bareMatch;
    if (validDayMonth(Number(day), Number(month)) && Number(month) <= 12) {
      const inferredYear = inferYear(Number(day), Number(month), today);
      return { value: `${inferredYear}-${pad2(month)}-${pad2(day)}`, status: "inferred", evidence: raw };
    }
  }

  return { value: null, status: "missing", evidence: null };
}

// Deterministic time extraction. Returns null unless an explicit HH:MM (or
// Italian "ore HH"/"h HH") pattern is present with valid ranges.
export function extractExplicitTime(text) {
  if (!text) return { value: null, evidence: null };

  const hhmm = text.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
  if (hhmm) {
    const [raw, hour, minute] = hhmm;
    return { value: `${pad2(hour)}:${minute}`, evidence: raw };
  }

  const oreMatch = text.match(/\bore\s+([01]?\d|2[0-3])(?:[:.]([0-5]\d))?\b/i);
  if (oreMatch) {
    const [raw, hour, minute] = oreMatch;
    return { value: `${pad2(hour)}:${minute ?? "00"}`, evidence: raw };
  }

  const hMatch = text.match(/\bh\.?\s?([01]?\d|2[0-3])(?:[:.]([0-5]\d))?\b/i);
  if (hMatch) {
    const [raw, hour, minute] = hMatch;
    return { value: `${pad2(hour)}:${minute ?? "00"}`, evidence: raw };
  }

  return { value: null, evidence: null };
}

const ART_PATTERN = /mostra|vernissage|esposizione|inaugurazione|opening|galleria/i;
const MENU_PATTERN = /men[uù]|piatto del giorno|menu del giorno|carta dei vini/i;

// Deterministic, explainable classification only. No LLM, no fuzzy scoring:
// a fixed priority order over the already-deterministic candidate_signals
// plus two additional keyword sets. Reasons list exactly which rule matched.
export function classifyCandidateType(record) {
  const text = `${record.message_or_caption ?? ""}`;
  const signals = record.candidate_signals ?? {};
  const reasons = [];

  if (!text.trim() && !record.permalink && !record.media_type) {
    return { type: "irrelevant", reasons: ["empty record: no caption, permalink, or media type"] };
  }

  if (signals.notice_like) {
    reasons.push("candidate_signals.notice_like matched (closure/reopening/hours keyword)");
    return { type: "operational_notice", reasons };
  }

  if (signals.event_like) {
    reasons.push("candidate_signals.event_like matched (event-format keyword)");
    return { type: "event", reasons };
  }

  if (ART_PATTERN.test(text)) {
    reasons.push(`text matches art/exhibition keyword pattern: ${ART_PATTERN}`);
    return { type: "art_or_exhibition", reasons };
  }

  if (MENU_PATTERN.test(text)) {
    reasons.push(`text matches menu/product keyword pattern: ${MENU_PATTERN}`);
    return { type: "menu_or_product", reasons };
  }

  if (!text.trim()) {
    return { type: "unknown", reasons: ["media-only post with no caption/message and no other deterministic signal"] };
  }

  return { type: "unknown", reasons: ["no deterministic keyword signal matched"] };
}

export function classifyTimeRelevance(dateIso, { today } = {}) {
  if (!dateIso) return "undated";
  if (dateIso < today) return "past";
  if (dateIso > today) return "upcoming";
  return "current";
}

export function todayInTimezone(now, timezone = "Europe/Rome") {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function normalizeForDedup(text) {
  return `${text ?? ""}`
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function tokenSet(normalizedText) {
  return new Set(normalizedText.split(" ").filter(Boolean));
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) if (setB.has(token)) intersection += 1;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const DEDUP_JACCARD_THRESHOLD = 0.5;

// Deterministic, threshold-based duplicate assistance (no probabilistic
// model): two records are grouped only if they share the same extracted
// explicit date AND their normalized caption token sets overlap at or above
// DEDUP_JACCARD_THRESHOLD. Records without a shared explicit date are never
// merged, even if the text is similar, to avoid false grouping across
// unrelated posts that happen to share generic phrasing.
export function groupDuplicates(records, { referenceDate } = {}) {
  const withMeta = records.map((record) => ({
    record,
    date: extractExplicitDate(record.message_or_caption, { referenceDate }).value,
    tokens: tokenSet(normalizeForDedup(record.message_or_caption)),
  }));

  const groups = [];
  const assigned = new Set();

  for (let i = 0; i < withMeta.length; i += 1) {
    if (assigned.has(i)) continue;
    const group = [i];
    assigned.add(i);
    if (withMeta[i].date) {
      for (let j = i + 1; j < withMeta.length; j += 1) {
        if (assigned.has(j)) continue;
        if (withMeta[j].date !== withMeta[i].date) continue;
        const similarity = jaccard(withMeta[i].tokens, withMeta[j].tokens);
        if (similarity >= DEDUP_JACCARD_THRESHOLD) {
          group.push(j);
          assigned.add(j);
        }
      }
    }
    groups.push(group.map((index) => withMeta[index].record));
  }

  return groups;
}

const CONFLICT_JACCARD_THRESHOLD = 0.7;

// Detects likely-same-post pairs (high text similarity, above the dedup
// threshold) that nonetheless carry two different explicit dates — e.g. a
// caption edited after a reschedule, or a Facebook/Instagram cross-post
// where one copy was updated and the other wasn't. These are never merged
// into one record; they are surfaced so a candidate's date can be marked
// CONFLICTING instead of silently trusting either value.
export function findDateConflicts(records, { referenceDate } = {}) {
  const withMeta = records.map((record) => ({
    record,
    date: extractExplicitDate(record.message_or_caption, { referenceDate }).value,
    tokens: tokenSet(normalizeForDedup(record.message_or_caption)),
  }));
  const conflicts = [];
  for (let i = 0; i < withMeta.length; i += 1) {
    for (let j = i + 1; j < withMeta.length; j += 1) {
      if (!withMeta[i].date || !withMeta[j].date) continue;
      if (withMeta[i].date === withMeta[j].date) continue;
      const similarity = jaccard(withMeta[i].tokens, withMeta[j].tokens);
      if (similarity >= CONFLICT_JACCARD_THRESHOLD) {
        conflicts.push({
          a: withMeta[i].record,
          b: withMeta[j].record,
          dateA: withMeta[i].date,
          dateB: withMeta[j].date,
          similarity,
        });
      }
    }
  }
  return conflicts;
}

export function candidateIdForGroup(sourceRecords) {
  if (sourceRecords.length === 1) {
    const record = sourceRecords[0];
    return `meta-${record.source_network}-${record.source_id}`;
  }
  const key = sourceRecords
    .map((record) => `${record.source_network}:${record.source_id}`)
    .sort()
    .join("|");
  const hash = createHash("sha256").update(key).digest("hex").slice(0, 12);
  return `meta-group-${hash}`;
}

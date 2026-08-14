import { createHash } from "node:crypto";

export const CANDIDATE_TYPES = ["event", "operational_notice", "art_or_exhibition", "menu_or_product", "venue_generic", "irrelevant", "unknown"];
export const TIME_RELEVANCE = ["past", "near_term", "upcoming", "future_distant", "recurring_or_multi_date", "ambiguous", "undated"];
export const DATE_STATES = ["single_explicit_date", "explicit_date_range", "multi_date_event", "multiple_event_dates", "ambiguous_date", "conflicting_sources", "undated"];

const MONTHS_IT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function pad2(value) {
  return String(value).padStart(2, "0");
}

function validDayMonth(day, month) {
  return day >= 1 && day <= 31 && month >= 1 && month <= 12;
}

function dateRangeOverlaps(claimed, start, end) {
  return claimed.some(([s, e]) => start < e && end > s);
}

const WEEKDAYS_IT = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"]; // index matches Date#getUTCDay()

function weekdayIndexOf(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

// Finds the weekday name occurrence CLOSEST (in either direction) to a given
// date match's position. A caption naming two different dates each with its
// own weekday ("Venerdì 31 ottobre e sabato 1 novembre") must resolve each
// date against the weekday actually adjacent to IT, not against whichever
// weekday happens to appear first anywhere in the whole text.
function nearestWeekdayIndex(text, matchIndex) {
  const normalized = text.toLowerCase();
  let bestIndex = null;
  let bestDistance = Infinity;
  for (let index = 0; index < WEEKDAYS_IT.length; index += 1) {
    const withAccent = WEEKDAYS_IT[index];
    const noAccent = withAccent.replace(/ì/g, "i");
    for (const form of [withAccent, noAccent]) {
      let searchFrom = 0;
      let pos = normalized.indexOf(form, searchFrom);
      while (pos !== -1) {
        const distance = Math.abs(pos - matchIndex);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
        searchFrom = pos + form.length;
        pos = normalized.indexOf(form, searchFrom);
      }
    }
  }
  return bestIndex;
}

// Anchors a bare (yearless) day/month to the calendar year temporally
// CLOSEST TO THE POST'S OWN TIMESTAMP — never to "today". An archived
// social post's yearless date describes something near when it was posted;
// interpreting it relative to whenever this pipeline happens to run would
// roll a years-old post's date into a future year merely because time has
// passed, which is exactly the bug this guards against.
//
// If an explicit weekday is stated in the text, it must match the actual
// weekday of exactly one of the three candidate years (anchorYear-1,
// anchorYear, anchorYear+1); that match wins even if a different year is
// numerically closer. If zero or more than one candidate year matches the
// stated weekday, or (with no weekday stated) the two closest candidates
// are equally close, the result is unresolvable — returns null rather than
// guessing.
function resolveAnchoredYear(day, month, anchorDateStr, statedWeekdayIndex) {
  const anchorYear = Number(anchorDateStr.slice(0, 4));
  const candidates = [anchorYear - 1, anchorYear, anchorYear + 1].map((year) => {
    const dateStr = `${year}-${pad2(month)}-${pad2(day)}`;
    return { dateStr, distance: Math.abs(daysBetween(dateStr, anchorDateStr)) };
  });

  if (statedWeekdayIndex !== null) {
    const matching = candidates.filter((candidate) => weekdayIndexOf(candidate.dateStr) === statedWeekdayIndex);
    return matching.length === 1 ? matching[0].dateStr : null;
  }

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0].distance === candidates[1].distance ? null : candidates[0].dateStr;
}

// Deterministic date extraction: scans the WHOLE text and returns every
// distinct date-shaped match (deduped by resolved value), not just the
// first. Matches are claimed left-to-right in priority order (ISO >
// DD/MM/YYYY > Italian month name > bare day/month) so a full "20/08/2026"
// is never double-counted as also a bare "20/08" match.
//
// - An explicit year in the source text yields status "extracted".
// - A bare day/month with NO year yields status "inferred", with the year
//   resolved by resolveAnchoredYear against `anchorDate` (the record's OWN
//   source timestamp, converted to venue-local date — never "today"/
//   referenceDate, which is only a last-resort fallback when no anchor is
//   available at all).
// - If the year cannot be safely resolved (weekday mismatch, or a genuine
//   tie with no weekday stated), the match yields status "ambiguous" with a
//   null value rather than a guess.
const DATE_STATUS_RANK = { extracted: 2, inferred: 1, ambiguous: 0 };

export function extractAllDates(text, { anchorDate, referenceDate } = {}) {
  if (!text) return [];
  const anchor = anchorDate ?? referenceDate ?? new Date().toISOString().slice(0, 10);
  const claimed = [];
  const results = [];

  // The SAME calendar date is often stated twice in one post, in different
  // formats (e.g. a weekday-implied "Sabato 21 marzo" earlier, and an
  // explicit-year "21 marzo 2026" later in the same caption). That is ONE
  // distinct date, not two — collapsing by value (keeping whichever mention
  // has the strongest/most-authoritative status) prevents a single-date post
  // from being miscounted as "multiple_event_dates" merely because it
  // restates its own date in a second format.
  function record(value, status, evidence, start, end) {
    claimed.push([start, end]);
    const existingIndex = results.findIndex((existing) => existing.value === value);
    if (existingIndex === -1) {
      results.push({ value, status, evidence, start, end });
      return;
    }
    if (DATE_STATUS_RANK[status] > DATE_STATUS_RANK[results[existingIndex].status]) {
      results[existingIndex] = { value, status, evidence, start, end };
    }
  }

  for (const match of text.matchAll(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/g)) {
    const [raw, year, month, day] = match;
    if (validDayMonth(Number(day), Number(month))) record(`${year}-${pad2(month)}-${pad2(day)}`, "extracted", raw, match.index, match.index + raw.length);
  }

  for (const match of text.matchAll(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/g)) {
    const [raw, day, month, year] = match;
    if (dateRangeOverlaps(claimed, match.index, match.index + raw.length)) continue;
    if (validDayMonth(Number(day), Number(month))) record(`${year}-${pad2(month)}-${pad2(day)}`, "extracted", raw, match.index, match.index + raw.length);
  }

  const monthNamePattern = new RegExp(`\\b(\\d{1,2})\\s+(${MONTHS_IT.join("|")})(?:\\s+(\\d{4}))?\\b`, "gi");
  for (const match of text.matchAll(monthNamePattern)) {
    const [raw, day, monthName, year] = match;
    if (dateRangeOverlaps(claimed, match.index, match.index + raw.length)) continue;
    const month = MONTHS_IT.indexOf(monthName.toLowerCase()) + 1;
    if (!validDayMonth(Number(day), month)) continue;
    if (year) {
      record(`${year}-${pad2(month)}-${pad2(day)}`, "extracted", raw, match.index, match.index + raw.length);
    } else {
      const resolved = resolveAnchoredYear(Number(day), month, anchor, nearestWeekdayIndex(text, match.index));
      record(resolved, resolved ? "inferred" : "ambiguous", raw, match.index, match.index + raw.length);
    }
  }

  for (const match of text.matchAll(/\b(\d{1,2})[./-](\d{1,2})\b/g)) {
    const [raw, day, month] = match;
    if (dateRangeOverlaps(claimed, match.index, match.index + raw.length)) continue;
    if (validDayMonth(Number(day), Number(month))) {
      const resolved = resolveAnchoredYear(Number(day), Number(month), anchor, nearestWeekdayIndex(text, match.index));
      record(resolved, resolved ? "inferred" : "ambiguous", raw, match.index, match.index + raw.length);
    }
  }

  // Fallback only: no absolute date-shaped token was found at all, but the
  // text may still state an explicit SOURCE-RELATIVE day word ("stasera",
  // "oggi", "domani"). Resolved against this record's own anchor date
  // (its source_timestamp's local calendar date) — never against "today"
  // when this pipeline happens to run — and always "inferred" (the absolute
  // date is derived from relative language + the post's own timestamp, not
  // literally stated in the source).
  if (results.length === 0) {
    for (const relative of extractRelativeDate(text, anchor)) {
      record(relative.value, relative.status, relative.evidence, relative.start, relative.end);
    }
  }

  return results;
}

const RELATIVE_DAY_OFFSETS_IT = { oggi: 0, stasera: 0, stanotte: 0, domani: 1 };
const RELATIVE_DAY_PATTERN = new RegExp(`\\b(${Object.keys(RELATIVE_DAY_OFFSETS_IT).join("|")})\\b`, "gi");

function addDaysToDateStr(dateStr, days) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

// Resolves an explicit source-relative day word against `anchorDate` (the
// record's own source-timestamp-derived local date). Only used when no
// absolute date-shaped token exists at all. If more than one DISTINCT
// relative meaning is referenced (e.g. both "oggi" and "domani" in the same
// post), the reading is left unresolved rather than guessed which one the
// post's own date field should use.
function extractRelativeDate(text, anchorDate) {
  if (!text || !anchorDate) return [];
  const matches = [...text.matchAll(RELATIVE_DAY_PATTERN)];
  if (matches.length === 0) return [];
  const distinctOffsets = new Set(matches.map((match) => RELATIVE_DAY_OFFSETS_IT[match[1].toLowerCase()]));
  if (distinctOffsets.size > 1) {
    const [first] = matches;
    return [{ value: null, status: "ambiguous", evidence: matches.map((match) => match[1]).join(", "), start: first.index, end: first.index + first[0].length }];
  }
  const [offset] = distinctOffsets;
  const [first] = matches;
  const value = addDaysToDateStr(anchorDate, offset);
  return [{
    value,
    status: "inferred",
    evidence: `"${first[1]}" resolved relative to this post's own timestamp (${anchorDate}); not an absolute date stated in the source`,
    start: first.index,
    end: first.index + first[0].length,
  }];
}

// Convenience wrapper for callers that only want the first/primary date.
export function extractExplicitDate(text, { anchorDate, referenceDate } = {}) {
  const [first] = extractAllDates(text, { anchorDate, referenceDate });
  return first ?? { value: null, status: "missing", evidence: null };
}

const RANGE_CONNECTOR_PATTERN = /\bdal\b[\s\S]{0,40}\bal\b|\bda\b[\s\S]{0,25}\ba\b[\s\S]{0,5}(?:20\d{2}|\d{1,2}[./-]|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/i;

// "Capodanno 2025" / "San Silvestro 2025" is a fixed, unambiguous Italian
// idiom for the New Year's Eve night: it always spans 31 December of the
// PREVIOUS year into 1 January of the STATED year. This is a calendar fact,
// not a guess — the year is read directly from the source text, and the
// resulting dates are "inferred" (derived from the idiom + stated year, not
// literally spelled out as "31 dicembre"/"1 gennaio" in the source).
const YEAR_BOUNDARY_PATTERN = /\b(?:capodanno|san silvestro)\s*(\d{4})\b/i;

function extractYearBoundaryRange(text) {
  if (!text) return null;
  const match = text.match(YEAR_BOUNDARY_PATTERN);
  if (!match) return null;
  const year = Number(match[1]);
  const evidence = match[0].trim();
  return {
    shape: "range",
    dates: [
      { value: `${year - 1}-12-31`, status: "inferred", evidence: `"${evidence}" — New Year's Eve idiom: the night begins 31 December ${year - 1}` },
      { value: `${year}-01-01`, status: "inferred", evidence: `"${evidence}" — New Year's Eve idiom: the night ends 1 January ${year}` },
    ],
  };
}

const WEEKDAY_ALTERNATION = WEEKDAYS_IT.flatMap((weekday) => [weekday, weekday.replace(/ì/g, "i")]).join("|");
// The gap between two date matches contains nothing but a joining word (and
// optionally a weekday name) — e.g. "31 ottobre e sabato 1 novembre". This is
// deliberately narrow: it only fires on the exact textual shape of two dates
// directly joined by "e"/"ed"/"&"/",", never on loose textual similarity.
const CONJUNCTION_GAP_PATTERN = new RegExp(`^\\s*(?:e|ed|&|,)\\s*(?:${WEEKDAY_ALTERNATION})?\\s*$`, "i");

function isJoinedDatePair(text, resolved) {
  if (resolved.length !== 2) return false;
  const [a, b] = resolved[0].start <= resolved[1].start ? resolved : [resolved[1], resolved[0]];
  if (a.end == null || b.start == null || b.start < a.end) return false;
  return CONJUNCTION_GAP_PATTERN.test(text.slice(a.end, b.start));
}

// Classifies what a SINGLE record's own text implies about its date(s):
// - "ambiguous": at least one date-shaped match could not be safely
//   resolved to a year (weekday mismatch or a genuine tie) — never
//   downgraded to "none"/"single"/etc.; the whole record's date reading is
//   untrustworthy until an owner resolves it.
// - "none": no date-shaped text at all.
// - "single": exactly one distinct resolved date.
// - "range": exactly two dates joined by an explicit "dal...al..."/"da...a..."
//   range connector, or the fixed Capodanno/San Silvestro year-boundary
//   idiom — e.g. an exhibition or closure (or a New Year's Eve night)
//   spanning a known start/end. Not ambiguous: the two dates are the start
//   and end of one known span.
// - "multi_date_event": exactly two dates directly joined by "e"/"ed"/"&"/","
//   (optionally with a weekday in between) — e.g. "venerdì 31 ottobre e
//   sabato 1 novembre". This is a genuine multi-night programme with two
//   real, known dates, NOT an unresolved ambiguity — but it is still not a
//   single date, so it is tracked distinctly from "list".
// - "list": two or more dates with no recognized range/conjunction shape —
//   e.g. a programme listing several separate occasions with no connector.
//   We cannot deterministically pick a single date for a "list" shape.
export function classifyDateShape(text, { anchorDate, referenceDate } = {}) {
  const yearBoundary = extractYearBoundaryRange(text);
  if (yearBoundary) return yearBoundary;

  const dates = extractAllDates(text, { anchorDate, referenceDate });
  if (dates.some((entry) => entry.status === "ambiguous")) return { shape: "ambiguous", dates };
  const resolved = dates.filter((entry) => entry.value !== null);
  if (resolved.length === 0) return { shape: "none", dates: resolved };
  if (resolved.length === 1) return { shape: "single", dates: resolved };
  if (resolved.length === 2 && RANGE_CONNECTOR_PATTERN.test(text ?? "")) return { shape: "range", dates: resolved };
  if (resolved.length === 2 && isJoinedDatePair(text, resolved)) return { shape: "multi_date_event", dates: resolved };
  return { shape: "list", dates: resolved };
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

// Single source of truth for the "event_like" keyword set, shared with
// feeders/meta/normalize.mjs. Word-bounded: these are whole Italian nouns, so
// a compound hashtag like "#aperitivoabologna" must not trip "aperitivo" —
// only a standalone occurrence of the word counts. "dj" is a special case:
// this venue's own captions routinely write it glued to "set" as one token
// ("djset"/"DJSet"), which is a real, deliberate spelling, not an accident —
// so "dj" alone OR "djset" both count, while still refusing to match "dj"
// merely as a substring of an unrelated word (e.g. the name "Django").
export const EVENT_LIKE_PATTERN = /\b(?:concerto|evento|serata|laboratorio|aperitivo|dj(?:set)?|mostra|incontro)\b/i;

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

  // The stored candidate_signals.event_like hint is an ingest-time regex
  // over the whole caption, including hashtags. Re-checking the same
  // keyword set with word boundaries against the live text is a strictly
  // narrower filter (it can only turn a stored true into false, never the
  // reverse), so this only removes false positives — e.g. a compound
  // hashtag like "#aperitivoabologna" on an otherwise unrelated menu post —
  // and can never introduce a new one.
  if (signals.event_like && EVENT_LIKE_PATTERN.test(text)) {
    reasons.push("candidate_signals.event_like matched (event-format keyword) and confirmed as a standalone word in the caption");
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

function daysBetween(dateIso, todayIso) {
  const [ty, tm, td] = todayIso.split("-").map(Number);
  const [dy, dm, dd] = dateIso.split("-").map(Number);
  return Math.round((Date.UTC(dy, dm - 1, dd) - Date.UTC(ty, tm - 1, td)) / 86400000);
}

// near_term: next 14 days | upcoming: 15-60 days | future_distant: >60 days.
// A date already in the past always stays "past", even if it is part of a
// recurring series — a past occurrence is never treated as proof a future
// one exists. isAmbiguous (ambiguous_date/conflicting_sources) always wins;
// isRecurring only changes the bucket for a non-past date.
export function classifyTimeRelevance(dateIso, { today, isAmbiguous = false, isRecurring = false } = {}) {
  if (isAmbiguous) return "ambiguous";
  if (!dateIso) return "undated";
  const diff = daysBetween(dateIso, today);
  if (diff < 0) return "past";
  if (isRecurring) return "recurring_or_multi_date";
  if (diff <= 14) return "near_term";
  if (diff <= 60) return "upcoming";
  return "future_distant";
}

export function todayInTimezone(now, timezone = "Europe/Rome") {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

// Purely-numeric tokens are almost always fragments of a date or time
// (e.g. "01", "2026", "21", "00") — matching on them inflates similarity
// between two otherwise-unrelated short captions that just happen to both
// contain a date and a time. They are excluded from similarity comparison
// (not from date/time extraction itself, which is separate).
function normalizeForDedup(text) {
  return `${text ?? ""}`
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token && !/^\d+$/.test(token))
    .sort()
    .join(" ");
}

function tokenSet(normalizedText) {
  return new Set(normalizedText.split(" ").filter(Boolean));
}

// A minimum meaningful-token count before trusting Jaccard similarity at
// all: with very few words, a couple of coincidentally shared generic terms
// can push similarity above threshold even for unrelated posts.
const MIN_MEANINGFUL_TOKENS = 5;

function jaccard(setA, setB) {
  if (setA.size < MIN_MEANINGFUL_TOKENS || setB.size < MIN_MEANINGFUL_TOKENS) return 0;
  let intersection = 0;
  for (const token of setA) if (setB.has(token)) intersection += 1;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Deliberately NOT folded into jaccard() as a "similarity === 1 bypass":
// normalizeForDedup strips numeric tokens, so two SHORT captions that differ
// only in their date/time digits (e.g. two different real occurrences of a
// generic template) can become byte-for-byte identical token sets even
// though the original text differs — a perfect-token-match bypass would
// silently merge exactly the short-caption false positive fixed above.
// Comparing the RAW text (digits included) is the only safe way to detect
// a genuine exact duplicate (e.g. the identical caption cross-posted to
// Facebook and Instagram seconds apart) regardless of length.
function exactCaptionMatch(textA, textB) {
  const a = `${textA ?? ""}`.trim().toLowerCase();
  const b = `${textB ?? ""}`.trim().toLowerCase();
  return a.length > 0 && a === b;
}

const DEDUP_JACCARD_THRESHOLD = 0.5;

// Each record is anchored to ITS OWN source_timestamp (converted to the
// venue's local calendar date) for yearless-date resolution — never to a
// single shared "today". Falls back to referenceDate only when a record has
// no source_timestamp at all.
function anchorForRecord(record, referenceDate, timezone) {
  return record.source_timestamp ? todayInTimezone(new Date(record.source_timestamp), timezone) : referenceDate;
}

// Deterministic, threshold-based duplicate assistance (no probabilistic
// model): two records are grouped when EITHER (a) their raw captions are a
// byte-for-byte exact match (case/whitespace-insensitive) — safe regardless
// of whether a date was extracted, since identical text can carry no
// conflicting date digits — OR (b) they share the same extracted explicit
// date AND their normalized caption token sets overlap at or above
// DEDUP_JACCARD_THRESHOLD. Records with neither an exact match nor a shared
// explicit date are never merged, even if the text is similar, to avoid
// false grouping across unrelated posts that happen to share generic
// phrasing.
export function groupDuplicates(records, { referenceDate, timezone = "Europe/Rome" } = {}) {
  const withMeta = records.map((record) => ({
    record,
    date: extractExplicitDate(record.message_or_caption, { anchorDate: anchorForRecord(record, referenceDate, timezone) }).value,
    tokens: tokenSet(normalizeForDedup(record.message_or_caption)),
  }));

  const groups = [];
  const assigned = new Set();

  for (let i = 0; i < withMeta.length; i += 1) {
    if (assigned.has(i)) continue;
    const group = [i];
    assigned.add(i);
    for (let j = i + 1; j < withMeta.length; j += 1) {
      if (assigned.has(j)) continue;
      const exactMatch = exactCaptionMatch(withMeta[i].record.message_or_caption, withMeta[j].record.message_or_caption);
      if (!exactMatch) {
        if (!withMeta[i].date || withMeta[j].date !== withMeta[i].date) continue;
        const similarity = jaccard(withMeta[i].tokens, withMeta[j].tokens);
        if (similarity < DEDUP_JACCARD_THRESHOLD) continue;
      }
      group.push(j);
      assigned.add(j);
    }
    groups.push(group.map((index) => withMeta[index].record));
  }

  return groups;
}

const CONFLICT_JACCARD_THRESHOLD = 0.7;
const RECURRING_CLUSTER_MIN_SIZE = 3;

function unionFind() {
  const parent = new Map();
  function find(key) {
    if (!parent.has(key)) parent.set(key, key);
    if (parent.get(key) !== key) parent.set(key, find(parent.get(key)));
    return parent.get(key);
  }
  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }
  return { find, union, parent };
}

const recordKey = (record) => `${record.source_network}:${record.source_id}`;

// Diagnostic evidence (real production read, 200 records, 2026-08-14): every
// text-similar pair with disagreeing explicit dates turned out to belong to
// just two connected clusters (sizes 3 and 14) — i.e. one recurring
// weekly/monthly post template reused with a different real date each time,
// not genuine data disagreement. Flagging every pairwise combination inside
// such a cluster as a "conflict" was the bug: a large cluster of mutually
// similar, differently-dated posts is evidence of a RECURRING SERIES, not an
// unresolvable conflict. Only an ISOLATED PAIR (no third similar variant) is
// treated as a true ambiguity, since there we have no series evidence to
// explain the disagreement away.
//
// Returns:
// - ambiguousPairs: connected components of exactly 2 records — genuinely
//   suspicious, should block promotion (date_state "ambiguous_date").
// - recurringClusters: connected components of >= RECURRING_CLUSTER_MIN_SIZE
//   records — treated as separate legitimate occurrences of a recurring
//   format, not blocking; each member keeps its own single extracted/inferred
//   date, annotated with the cluster for owner context.
export function findDateRelationships(records, { referenceDate, recurringClusterMinSize = RECURRING_CLUSTER_MIN_SIZE, timezone = "Europe/Rome" } = {}) {
  const withMeta = records.map((record) => ({
    record,
    date: extractExplicitDate(record.message_or_caption, { anchorDate: anchorForRecord(record, referenceDate, timezone) }).value,
    tokens: tokenSet(normalizeForDedup(record.message_or_caption)),
  }));

  const { find, union, parent } = unionFind();
  for (let i = 0; i < withMeta.length; i += 1) {
    for (let j = i + 1; j < withMeta.length; j += 1) {
      if (!withMeta[i].date || !withMeta[j].date || withMeta[i].date === withMeta[j].date) continue;
      if (jaccard(withMeta[i].tokens, withMeta[j].tokens) >= CONFLICT_JACCARD_THRESHOLD) {
        union(recordKey(withMeta[i].record), recordKey(withMeta[j].record));
      }
    }
  }

  const byKey = new Map(withMeta.map((item) => [recordKey(item.record), item.record]));
  const membersByRoot = new Map();
  for (const key of parent.keys()) {
    const root = find(key);
    if (!membersByRoot.has(root)) membersByRoot.set(root, []);
    membersByRoot.get(root).push(byKey.get(key));
  }

  const ambiguousPairs = [];
  const recurringClusters = [];
  for (const members of membersByRoot.values()) {
    if (members.length >= recurringClusterMinSize) recurringClusters.push(members);
    else if (members.length === 2) ambiguousPairs.push(members);
  }

  return { ambiguousPairs, recurringClusters };
}

const MAX_TITLE_LENGTH = 70;
const MAX_TITLE_WORDS = 10;

// A heading is the first non-empty line of a caption/message, ONLY when
// there is further content after it (so we know it functions structurally
// as a heading, not merely the whole short message) and it doesn't already
// end like a full sentence.
function firstLineHeading(text) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return null;
  const [first] = lines;
  if (!first || first.length > MAX_TITLE_LENGTH || /[.!?]$/.test(first)) return null;
  if (first.split(/\s+/).length > MAX_TITLE_WORDS) return null;
  return { value: first, reason: "first standalone line of the caption, followed by further content, short and not sentence-punctuated" };
}

// Text before a strong delimiter (colon, dash, pipe), when followed by more
// content, e.g. "Serata Jazz — stasere alle 21 vi aspettiamo...".
function delimiterHeading(text) {
  if (!text) return null;
  const match = text.match(/^(.{3,70}?)\s+[-–—:|]\s+\S/);
  if (!match) return null;
  const candidate = match[1].trim();
  if (!candidate || candidate.length > MAX_TITLE_LENGTH || /[.!?]$/.test(candidate)) return null;
  if (candidate.split(/\s+/).length > MAX_TITLE_WORDS) return null;
  return { value: candidate, reason: "text before a strong delimiter, followed by further programme detail" };
}

function headingCandidate(text) {
  return firstLineHeading(text) ?? delimiterHeading(text);
}

// A title is NEVER invented from arbitrary prose. It is only suggested when
// there is a genuine structural heading marker (a standalone first line, or
// short pre-delimiter text) with further content after it — never a
// truncated substring of a running sentence. Always status "inferred": it
// requires explicit owner confirmation before it can satisfy a title
// requirement.
export function suggestTitle(sourceRecords) {
  const candidates = sourceRecords.map((record) => headingCandidate(record.message_or_caption));
  const [primary, ...rest] = candidates;
  if (sourceRecords.length > 1 && primary && rest.some((candidate) => candidate && candidate.value.toLowerCase() === primary.value.toLowerCase())) {
    return { value: primary.value, reason: "identical heading line repeated across Facebook/Instagram duplicate sources" };
  }
  if (primary) return primary;
  return null;
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

import assert from "node:assert/strict";
import test from "node:test";
import {
  candidateIdForGroup,
  classifyCandidateType,
  classifyDateShape,
  classifyTimeRelevance,
  EVENT_LIKE_PATTERN,
  extractAllDates,
  extractExplicitDate,
  extractExplicitTime,
  findDateRelationships,
  groupDuplicates,
  suggestTitle,
  todayInTimezone,
} from "../scripts/candidate-detect.mjs";

test("extractExplicitDate extracts a full ISO date verbatim from source text", () => {
  const result = extractExplicitDate("Ci vediamo il 2026-09-03 per una serata speciale!");
  assert.equal(result.value, "2026-09-03");
  assert.equal(result.status, "extracted");
  assert.equal(result.evidence, "2026-09-03");
});

test("extractExplicitDate extracts DD/MM/YYYY with an explicit year", () => {
  const result = extractExplicitDate("Vi aspettiamo il 03/09/2026 alle 21:00");
  assert.equal(result.value, "2026-09-03");
  assert.equal(result.status, "extracted");
});

test("extractExplicitDate extracts an Italian month name with an explicit year", () => {
  const result = extractExplicitDate("Concerto il 3 settembre 2026, non mancate");
  assert.equal(result.value, "2026-09-03");
  assert.equal(result.status, "extracted");
});

test("extractExplicitDate infers a year for a bare day/month, never claiming it as extracted", () => {
  const result = extractExplicitDate("Serata speciale il 20/08, vi aspettiamo", { referenceDate: "2026-08-01" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2026-08-20");
});

test("extractExplicitDate picks the calendar year closest to the anchor, even if that means the recent past relative to the anchor", () => {
  // The anchor represents when the post itself was made — a post from
  // 2026-09-01 mentioning "20/08" almost certainly means 12 days earlier
  // that same year, not a roll forward to next year's 20/08.
  const result = extractExplicitDate("Ci vediamo il 20/08", { referenceDate: "2026-09-01" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2026-08-20");
});

test("extractExplicitDate returns missing when there is no date-shaped text", () => {
  const result = extractExplicitDate("Buongiorno a tutti dallo staff!");
  assert.equal(result.value, null);
  assert.equal(result.status, "missing");
});

test("a yearless date is anchored to the post's OWN source timestamp, not to today — the real reported bug", () => {
  // Real case: posted 2025-09-28, caption "Lunedì 29 settembre – ore 19.00".
  // The old (buggy) today-anchored logic rolled this to 2026-09-29 and
  // called it "upcoming". The correct reading is 2025-09-29 (the Monday
  // right after the post), which is in the past by 2026.
  const result = extractExplicitDate("Lunedì 29 settembre – ore 19.00", { anchorDate: "2025-09-28" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2025-09-29");
});

test("an old social post never becomes a future event merely because the current date is later", () => {
  // The anchor (post date) is years in the past relative to any realistic
  // "today"; the resolved date must stay anchored near the post, not near
  // whenever this pipeline happens to run.
  const result = extractExplicitDate("Vi aspettiamo il 12 marzo per la presentazione", { anchorDate: "2019-03-01" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2019-03-12", "must stay anchored to the 2019 post, never rolled toward the pipeline's real run date");
});

test("a post made in late December mentioning an early-January date resolves into the following year", () => {
  const result = extractExplicitDate("Vi aspettiamo il 3 gennaio per il primo evento del nuovo anno", { anchorDate: "2025-12-30" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2026-01-03");
});

test("a stated weekday overrides the naively-closest year when they disagree", () => {
  // 1 January is naively closest to 2021 (78 days from the 2020-10-15
  // anchor), but the caption states "martedì" (Tuesday), which only
  // 2019-01-01 satisfies within the 3-year window — so that must win even
  // though it is numerically much farther from the anchor.
  const result = extractExplicitDate("Ci vediamo martedì 1 gennaio per il brindisi di fine anno", { anchorDate: "2020-10-15" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2019-01-01");
});

test("a genuinely tied yearless date (no weekday, two equally-plausible years) is marked ambiguous, never guessed", () => {
  const result = extractExplicitDate("Vi aspettiamo il 1 marzo per il grande evento", { anchorDate: "2023-08-31" });
  assert.equal(result.status, "ambiguous");
  assert.equal(result.value, null);
});

test("extractAllDates does not double-count a full DD/MM/YYYY as also a bare DD/MM match", () => {
  const results = extractAllDates("Appuntamento il 03/09/2026, segnatevi la data!", { referenceDate: "2026-08-14" });
  assert.equal(results.length, 1);
  assert.equal(results[0].value, "2026-09-03");
  assert.equal(results[0].status, "extracted");
});

test("extractExplicitTime extracts HH:MM and Italian 'ore HH' patterns", () => {
  assert.equal(extractExplicitTime("si comincia alle 21:00 in punto").value, "21:00");
  assert.equal(extractExplicitTime("apertura porte ore 20").value, "20:00");
  assert.equal(extractExplicitTime("nessun orario qui").value, null);
});

test("classifyDateShape: a single date is 'single'", () => {
  const shape = classifyDateShape("Concerto il 03/09/2026 alle 21:00", { referenceDate: "2026-08-14" });
  assert.equal(shape.shape, "single");
  assert.equal(shape.dates.length, 1);
});

test("classifyDateShape: an explicit 'dal...al...' range is 'range', not a conflict", () => {
  const shape = classifyDateShape("Mostra fotografica aperta dal 03/09/2026 al 10/09/2026, ingresso libero", { referenceDate: "2026-08-14" });
  assert.equal(shape.shape, "range");
  assert.equal(shape.dates.length, 2);
  assert.equal(shape.dates[0].value, "2026-09-03");
  assert.equal(shape.dates[1].value, "2026-09-10");
});

test("classifyDateShape: a programme listing several separate dates with no range connector is 'list'", () => {
  const shape = classifyDateShape("Aperitivo il 04/09/2026, il 11/09/2026, il 18/09/2026 e il 25/09/2026, tutti i venerdì di settembre", { referenceDate: "2026-08-14" });
  assert.equal(shape.shape, "list");
  assert.equal(shape.dates.length, 4);
});

test("classifyDateShape: no date-shaped text is 'none'", () => {
  assert.equal(classifyDateShape("Buongiorno a tutti!").shape, "none");
});

test("classifyCandidateType recognizes an operational notice over an event keyword", () => {
  const result = classifyCandidateType({ message_or_caption: "Attenzione: chiusura straordinaria per lavori, riapriamo presto", candidate_signals: { notice_like: true, event_like: false } });
  assert.equal(result.type, "operational_notice");
});

test("classifyCandidateType recognizes an explicit-date event candidate", () => {
  const result = classifyCandidateType({ message_or_caption: "Concerto live venerdì, ingresso libero", candidate_signals: { event_like: true, notice_like: false } });
  assert.equal(result.type, "event");
});

test("classifyCandidateType keeps a generic venue post as unknown, never promotable by accident", () => {
  const result = classifyCandidateType({ message_or_caption: "Buongiorno a tutti, buona giornata dallo staff!", candidate_signals: { event_like: false, notice_like: false } });
  assert.equal(result.type, "unknown");
});

test("classifyCandidateType marks a fully empty record as irrelevant", () => {
  const result = classifyCandidateType({ message_or_caption: null, permalink: null, media_type: null, candidate_signals: {} });
  assert.equal(result.type, "irrelevant");
});

test("classifyTimeRelevance buckets near-term, upcoming, future-distant, past, and undated", () => {
  assert.equal(classifyTimeRelevance("2026-08-20", { today: "2026-08-14" }), "near_term"); // 6 days
  assert.equal(classifyTimeRelevance("2026-09-10", { today: "2026-08-14" }), "upcoming"); // 27 days
  assert.equal(classifyTimeRelevance("2026-12-01", { today: "2026-08-14" }), "future_distant"); // >60 days
  assert.equal(classifyTimeRelevance("2026-01-01", { today: "2026-08-14" }), "past");
  assert.equal(classifyTimeRelevance(null, { today: "2026-08-14" }), "undated");
});

test("classifyTimeRelevance: ambiguous always wins over the date's own distance", () => {
  assert.equal(classifyTimeRelevance("2026-08-20", { today: "2026-08-14", isAmbiguous: true }), "ambiguous");
});

test("classifyTimeRelevance: recurring wins for a future date, but a past date always stays past", () => {
  assert.equal(classifyTimeRelevance("2026-09-10", { today: "2026-08-14", isRecurring: true }), "recurring_or_multi_date");
  assert.equal(classifyTimeRelevance("2026-01-01", { today: "2026-08-14", isRecurring: true }), "past", "a past occurrence of a recurring event must not be upgraded — it is not proof a future one exists");
});

test("todayInTimezone returns the Europe/Rome calendar date", () => {
  assert.equal(todayInTimezone(new Date("2026-08-14T23:30:00Z"), "Europe/Rome"), "2026-08-15");
});

test("groupDuplicates merges same-date, similar-caption Facebook/Instagram cross-posts", () => {
  const facebook = { source_network: "facebook", source_id: "fb-1", message_or_caption: "Concerto jazz il 03/09/2026 alle 21:00, ingresso libero, vi aspettiamo numerosi!" };
  const instagram = { source_network: "instagram", source_id: "ig-1", message_or_caption: "Concerto jazz il 03/09/2026 alle 21:00, ingresso libero, vi aspettiamo numerosi!" };
  const unrelated = { source_network: "facebook", source_id: "fb-2", message_or_caption: "Aperitivo del venerdì, tutti i venerdì sera da noi" };
  const groups = groupDuplicates([facebook, instagram, unrelated], { referenceDate: "2026-08-14" });
  assert.equal(groups.length, 2);
  const merged = groups.find((group) => group.length === 2);
  assert.ok(merged);
  assert.deepEqual(merged.map((record) => record.source_id).sort(), ["fb-1", "ig-1"]);
});

test("groupDuplicates never merges records with different explicit dates even if text overlaps", () => {
  const a = { source_network: "facebook", source_id: "fb-1", message_or_caption: "Serata musica dal vivo il 03/09/2026" };
  const b = { source_network: "instagram", source_id: "ig-1", message_or_caption: "Serata musica dal vivo il 10/09/2026" };
  const groups = groupDuplicates([a, b], { referenceDate: "2026-08-14" });
  assert.equal(groups.length, 2);
});

test("findDateRelationships: a large cluster of similar-but-differently-dated posts is recurring, not ambiguous", () => {
  const base = "Aperitivo del venerdì con musica dal vivo e drink speciali, vi aspettiamo numerosi il";
  const records = [
    { source_network: "facebook", source_id: "fb-1", message_or_caption: `${base} 04/09/2026` },
    { source_network: "facebook", source_id: "fb-2", message_or_caption: `${base} 11/09/2026` },
    { source_network: "facebook", source_id: "fb-3", message_or_caption: `${base} 18/09/2026` },
  ];
  const { ambiguousPairs, recurringClusters } = findDateRelationships(records, { referenceDate: "2026-08-14" });
  assert.equal(ambiguousPairs.length, 0);
  assert.equal(recurringClusters.length, 1);
  assert.equal(recurringClusters[0].length, 3);
});

test("findDateRelationships: an isolated pair with disagreeing dates and no third similar variant is ambiguous", () => {
  const a = { source_network: "facebook", source_id: "fb-1", message_or_caption: "Serata di beneficenza il 03/09/2026 alle 21:00 con musica dal vivo e buffet per tutti" };
  const b = { source_network: "instagram", source_id: "ig-1", message_or_caption: "Serata di beneficenza il 10/09/2026 alle 21:00 con musica dal vivo e buffet per tutti" };
  const { ambiguousPairs, recurringClusters } = findDateRelationships([a, b], { referenceDate: "2026-08-14" });
  assert.equal(recurringClusters.length, 0);
  assert.equal(ambiguousPairs.length, 1);
  assert.equal(ambiguousPairs[0].length, 2);
});

test("suggestTitle finds a genuine heading line, never a truncated arbitrary sentence", () => {
  const heading = suggestTitle([{ message_or_caption: "Serata Jazz\nStasera dalle 21:00 vi aspettiamo con musica dal vivo e drink speciali" }]);
  assert.equal(heading.value, "Serata Jazz");

  const noHeading = suggestTitle([{ message_or_caption: "Buongiorno a tutti, oggi vi aspettiamo per un aperitivo speciale con tanta musica dal vivo" }]);
  assert.equal(noHeading, null);
});

test("suggestTitle prefers a heading repeated identically across Facebook/Instagram duplicates", () => {
  const heading = suggestTitle([
    { message_or_caption: "Aperitivo del Venerdì\nDalle 19 in poi, musica e drink scontati" },
    { message_or_caption: "Aperitivo del Venerdì\nVi aspettiamo numerosi stasera!" },
  ]);
  assert.equal(heading.value, "Aperitivo del Venerdì");
  assert.match(heading.reason, /repeated/);
});

test("candidateIdForGroup is deterministic and stable regardless of input order", () => {
  const a = { source_network: "facebook", source_id: "1" };
  const b = { source_network: "instagram", source_id: "2" };
  assert.equal(candidateIdForGroup([a, b]), candidateIdForGroup([b, a]));
  assert.equal(candidateIdForGroup([a]), "meta-facebook-1");
});

// --- Issue 1: false event classification from a hashtag substring match ---

test("EVENT_LIKE_PATTERN does not match a keyword hidden inside an unrelated hashtag", () => {
  const text = "novità di menu: veg melt, mezza tasca #streetfoodbolognese #aperitivoabologna";
  assert.equal(EVENT_LIKE_PATTERN.test(text), false, "\"aperitivo\" inside the compound hashtag \"aperitivoabologna\" must not count as the standalone word");
});

test("EVENT_LIKE_PATTERN still matches the same keyword when it is a real standalone word", () => {
  assert.equal(EVENT_LIKE_PATTERN.test("l'aperitivo giusto è solo da noi"), true);
  assert.equal(EVENT_LIKE_PATTERN.test("stasera dj set dalle 22"), true);
});

test("EVENT_LIKE_PATTERN matches this venue's real 'djset'/'DJSet' compound spelling", () => {
  // Real production captions consistently write it as one glued word
  // ("Il djset by @massi_electropoprock", "ATOMIC Night DJSet"), not "dj set"
  // — a plain \bdj\b boundary would wrongly miss every one of these.
  assert.equal(EVENT_LIKE_PATTERN.test("Il djset by @massi_electropoprock ti farà ballare"), true);
  assert.equal(EVENT_LIKE_PATTERN.test("ATOMIC Night DJSet RadioAttive Leggende"), true);
});

test("EVENT_LIKE_PATTERN does not match 'dj' hidden inside an unrelated word like the name 'Django'", () => {
  assert.equal(EVENT_LIKE_PATTERN.test("i repertori di Django Reinhardt, lo swing americano"), false);
});

test("classifyCandidateType: a menu/product post is not misclassified as an event merely because a keyword hides inside a hashtag", () => {
  const result = classifyCandidateType({
    message_or_caption: "Nuova ossessione da noi: le tasche di chapati.\n\nNovità di menu: Veg Melt, Mezza Tasca.\n\n#streetfoodbolognese #aperitivoabologna",
    candidate_signals: { event_like: true, notice_like: false, explicit_date: false },
  });
  assert.equal(result.type, "menu_or_product");
});

test("classifyCandidateType: a genuine event keyword used as a real word still classifies as an event", () => {
  const result = classifyCandidateType({
    message_or_caption: "Stasera aperitivo e dj set dalle 21:00, vi aspettiamo!",
    candidate_signals: { event_like: true, notice_like: false, explicit_date: false },
  });
  assert.equal(result.type, "event");
});

// --- Issue 2: cross-network exact-duplicate posts with no extractable date ---

test("groupDuplicates merges an exact-match Facebook/Instagram cross-post even when neither has an extractable date", () => {
  const shared = "🔊 THE SUB_BAR SHOW #1 🔊\n\nUn evento immersivo su misura, senza data fissa annunciata qui.\n\n#LAltroSpazio";
  const facebook = { source_network: "facebook", source_id: "fb-1", message_or_caption: shared };
  const instagram = { source_network: "instagram", source_id: "ig-1", message_or_caption: shared };
  const groups = groupDuplicates([facebook, instagram], { referenceDate: "2026-08-14" });
  assert.equal(groups.length, 1, "byte-identical cross-posted captions must merge even with no shared date to key off");
  assert.deepEqual(groups[0].map((record) => record.source_id).sort(), ["fb-1", "ig-1"]);
});

test("groupDuplicates still never merges two dateless posts that are merely similar, not identical", () => {
  const a = { source_network: "facebook", source_id: "fb-1", message_or_caption: "Un evento speciale vi aspetta questo weekend, non mancate per nessun motivo!" };
  const b = { source_network: "instagram", source_id: "ig-1", message_or_caption: "Un evento speciale vi aspetta questo weekend, ma stavolta con un ospite diverso!" };
  const groups = groupDuplicates([a, b], { referenceDate: "2026-08-14" });
  assert.equal(groups.length, 2, "similar-but-not-identical dateless captions must stay separate candidates");
});

// --- Issue 3: source-relative temporal language ("stasera"/"oggi"/"domani") ---

test("extractAllDates resolves 'stasera' against the record's own anchor date, never today", () => {
  const results = extractAllDates("Stasera aperitivo e dj set, vi aspettiamo!", { anchorDate: "2025-09-13" });
  assert.equal(results.length, 1);
  assert.equal(results[0].value, "2025-09-13");
  assert.equal(results[0].status, "inferred", "a source-relative reading is inferred, never claimed as an extracted absolute date");
});

test("extractAllDates resolves 'domani' as the day after the anchor date", () => {
  const results = extractAllDates("Ci vediamo domani sera per l'evento", { anchorDate: "2025-09-13" });
  assert.equal(results[0].value, "2025-09-14");
  assert.equal(results[0].status, "inferred");
});

test("extractAllDates leaves conflicting relative-day words unresolved rather than guessing", () => {
  const results = extractAllDates("Oggi prove, domani il grande evento", { anchorDate: "2025-09-13" });
  assert.equal(results.length, 1);
  assert.equal(results[0].status, "ambiguous");
  assert.equal(results[0].value, null);
});

test("an explicit absolute date takes priority over relative-day language when both are present", () => {
  const results = extractAllDates("Stasera vi aspettiamo, ma segnatevi già il 20/09/2026 per il prossimo", { anchorDate: "2025-09-13" });
  assert.equal(results.length, 1, "the absolute date wins; 'stasera' is only a fallback when no absolute date is found at all");
  assert.equal(results[0].status, "extracted");
  assert.equal(results[0].value, "2026-09-20");
});

// --- Issue 4: Capodanno / San Silvestro year-boundary idiom ---

test("classifyDateShape resolves 'Capodanno YYYY' to the New Year's Eve night range, not a guess", () => {
  const shape = classifyDateShape("Capodanno 2025 al L'Altro Spazio, festeggia con noi! #Capodanno2025");
  assert.equal(shape.shape, "range");
  assert.equal(shape.dates.length, 2);
  assert.equal(shape.dates[0].value, "2024-12-31");
  assert.equal(shape.dates[0].status, "inferred");
  assert.equal(shape.dates[1].value, "2025-01-01");
  assert.equal(shape.dates[1].status, "inferred");
});

test("classifyDateShape resolves the 'San Silvestro YYYY' synonym the same way", () => {
  const shape = classifyDateShape("San Silvestro 2027: prenota il tuo tavolo!");
  assert.equal(shape.shape, "range");
  assert.equal(shape.dates[0].value, "2026-12-31");
  assert.equal(shape.dates[1].value, "2027-01-01");
});

test("'Capodanno' with no year stated is left undated rather than guessed", () => {
  const shape = classifyDateShape("Festeggia Capodanno con noi, dettagli in arrivo!");
  assert.equal(shape.shape, "none");
});

// --- Issue 5a: the same date restated in two formats is ONE date, not two ---

test("classifyDateShape: a weekday-implied date and an explicit-year restatement of the SAME day collapse to a single date", () => {
  // Real pattern: "Sabato 21 marzo ... 📅 21 marzo 2026" — the same calendar
  // day stated twice in different formats must not be miscounted as
  // "multiple_event_dates".
  const shape = classifyDateShape("Sabato 21 marzo si suona live! 📅 21 marzo 2026 🕙 Ore 22:00", { anchorDate: "2026-03-18" });
  assert.equal(shape.shape, "single");
  assert.equal(shape.dates.length, 1);
  assert.equal(shape.dates[0].value, "2026-03-21");
  assert.equal(shape.dates[0].status, "extracted", "the explicit-year mention is the stronger provenance and must win over the weekday-implied inference of the same day");
});

// --- Issue 5b: two genuinely different joined dates are a distinct, non-ambiguous shape ---

test("classifyDateShape: two dates joined by 'e' (and an intervening weekday) are 'multi_date_event', not an unclear list", () => {
  const shape = classifyDateShape("Venerdì 31 ottobre e sabato 1 novembre, due notti di festa!", { anchorDate: "2025-10-30" });
  assert.equal(shape.shape, "multi_date_event");
  assert.equal(shape.dates.length, 2);
  assert.equal(shape.dates[0].value, "2025-10-31");
  assert.equal(shape.dates[1].value, "2025-11-01");
});

test("classifyDateShape: three or more unconnected dates remain 'list' (multiple_event_dates), not multi_date_event", () => {
  const shape = classifyDateShape("Aperitivo il 04/09/2026, il 11/09/2026, il 18/09/2026 e il 25/09/2026, tutti i venerdì di settembre", { referenceDate: "2026-08-14" });
  assert.equal(shape.shape, "list");
  assert.equal(shape.dates.length, 4);
});

test("classifyDateShape: two dates with unrelated text in between (no direct conjunction) remain 'list', not multi_date_event", () => {
  const shape = classifyDateShape("Il primo incontro è il 04/09/2026. Per qualsiasi domanda scriveteci. Il secondo incontro è il 11/09/2026.", { referenceDate: "2026-08-14" });
  assert.equal(shape.shape, "list");
});

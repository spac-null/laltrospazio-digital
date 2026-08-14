import assert from "node:assert/strict";
import test from "node:test";
import {
  candidateIdForGroup,
  classifyCandidateType,
  classifyTimeRelevance,
  extractExplicitDate,
  extractExplicitTime,
  findDateConflicts,
  groupDuplicates,
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

test("extractExplicitDate infers next year when the bare day/month has already passed", () => {
  const result = extractExplicitDate("Ci vediamo il 20/08", { referenceDate: "2026-09-01" });
  assert.equal(result.status, "inferred");
  assert.equal(result.value, "2027-08-20");
});

test("extractExplicitDate returns missing when there is no date-shaped text", () => {
  const result = extractExplicitDate("Buongiorno a tutti dallo staff!");
  assert.equal(result.value, null);
  assert.equal(result.status, "missing");
});

test("extractExplicitTime extracts HH:MM and Italian 'ore HH' patterns", () => {
  assert.equal(extractExplicitTime("si comincia alle 21:00 in punto").value, "21:00");
  assert.equal(extractExplicitTime("apertura porte ore 20").value, "20:00");
  assert.equal(extractExplicitTime("nessun orario qui").value, null);
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

test("classifyTimeRelevance distinguishes past, current, and upcoming", () => {
  assert.equal(classifyTimeRelevance("2026-01-01", { today: "2026-08-14" }), "past");
  assert.equal(classifyTimeRelevance("2026-08-14", { today: "2026-08-14" }), "current");
  assert.equal(classifyTimeRelevance("2026-12-31", { today: "2026-08-14" }), "upcoming");
  assert.equal(classifyTimeRelevance(null, { today: "2026-08-14" }), "undated");
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

test("findDateConflicts flags a likely-same-post pair with disagreeing explicit dates", () => {
  const a = { source_network: "facebook", source_id: "fb-1", message_or_caption: "Serata di beneficenza il 03/09/2026 alle 21:00 con musica dal vivo e buffet" };
  const b = { source_network: "instagram", source_id: "ig-1", message_or_caption: "Serata di beneficenza il 10/09/2026 alle 21:00 con musica dal vivo e buffet" };
  const conflicts = findDateConflicts([a, b], { referenceDate: "2026-08-14" });
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].dateA, "2026-09-03");
  assert.equal(conflicts[0].dateB, "2026-09-10");
});

test("candidateIdForGroup is deterministic and stable regardless of input order", () => {
  const a = { source_network: "facebook", source_id: "1" };
  const b = { source_network: "instagram", source_id: "2" };
  assert.equal(candidateIdForGroup([a, b]), candidateIdForGroup([b, a]));
  assert.equal(candidateIdForGroup([a]), "meta-facebook-1");
});

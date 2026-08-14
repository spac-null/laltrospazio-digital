import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assertPublicDataSafe } from "../scripts/feeder-health.mjs";
import { buildCandidates, fromD1Row, fromNormalizedRecord, renderReviewMarkdown } from "../scripts/candidate-review-lib.mjs";
import { refresh } from "../scripts/candidates-refresh.mjs";
import { loadDecisions, recordDecision, saveDecisions } from "../scripts/candidate-decisions-lib.mjs";

const NOW = new Date("2026-08-14T12:00:00Z");

function d1Row(overrides = {}) {
  return {
    network: "facebook",
    source_id: "fb-1",
    source_account_id: "264601140373284",
    source_timestamp: "2026-09-03T10:00:00Z",
    message_or_caption: null,
    permalink: "https://www.facebook.com/laltrospazio.bologna/posts/1",
    media_type: null,
    candidate_signals: JSON.stringify({ event_like: false, notice_like: false, explicit_date: false }),
    ...overrides,
  };
}

test("fromD1Row parses the JSON-text candidate_signals column", () => {
  const record = fromD1Row(d1Row({ candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }));
  assert.equal(record.candidate_signals.event_like, true);
  assert.equal(record.source_network, "facebook");
});

test("fromNormalizedRecord adapts a feeders/meta/normalize.mjs-shaped record without re-normalizing", () => {
  const record = fromNormalizedRecord({ source_network: "instagram", source_id: "ig-1", source_account_id: "17841402902868891", published_at: "2026-08-01T10:00:00Z", caption: "Ciao a tutti", permalink: "https://instagram.test/p/1", media: { type: "IMAGE" }, candidate_signals: { event_like: false, notice_like: false, explicit_date: false } });
  assert.equal(record.message_or_caption, "Ciao a tutti");
  assert.equal(record.media_type, "IMAGE");
});

test("an explicit-date event candidate has extracted date/time, a single_explicit_date state, and is blocked only on title", () => {
  const rows = [d1Row({
    message_or_caption: "Concerto jazz dal vivo il 03/09/2026 alle ore 21:00, ingresso libero!",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates.length, 1);
  const [candidate] = candidates;
  assert.equal(candidate.candidate_type, "event");
  assert.equal(candidate.date_state, "single_explicit_date");
  assert.equal(candidate.fields.start_date.value, "2026-09-03");
  assert.equal(candidate.fields.start_time.value, "21:00");
  assert.equal(candidate.time_relevance, "upcoming"); // 2026-09-03 is 20 days after 2026-08-14
  assert.equal(candidate.promotion_readiness, "blocked");
  assert.deepEqual(candidate.missing_fields, ["title"]);
  assert.equal(candidate.visibility, "private");
  assert.equal(candidate.review_priority, "high");
});

test("several dates that form a programme/list are NOT automatically a conflict", () => {
  const rows = [d1Row({
    message_or_caption: "Aperitivo il 04/09/2026, il 11/09/2026 e il 18/09/2026, tutti i venerdì di settembre",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].date_state, "multiple_event_dates");
  assert.notEqual(candidates[0].date_state, "ambiguous_date");
  assert.equal(candidates[0].fields.start_date.status, "missing");
  assert.deepEqual(candidates[0].missing_fields.includes("start_date"), true);
});

test("an explicit date range is represented as explicit_date_range with both start and end extracted", () => {
  const rows = [d1Row({
    message_or_caption: "Mostra fotografica aperta dal 03/09/2026 al 10/09/2026, ingresso libero",
    candidate_signals: JSON.stringify({ event_like: false, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].candidate_type, "art_or_exhibition");
  // art_or_exhibition isn't a promotable type, but date_state should still reflect a real range if it were an event/notice;
  // re-run classified as event to check the field-building path directly.
  const eventRows = [d1Row({
    message_or_caption: "Mostra fotografica aperta dal 03/09/2026 al 10/09/2026, ingresso libero",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates: eventCandidates } = buildCandidates(eventRows.map(fromD1Row), { now: NOW });
  assert.equal(eventCandidates[0].date_state, "explicit_date_range");
  assert.equal(eventCandidates[0].fields.start_date.value, "2026-09-03");
  assert.equal(eventCandidates[0].fields.end_date.value, "2026-09-10");
  assert.equal(eventCandidates[0].fields.end_date.status, "extracted");
});

test("a recurring multi-date post cluster is not blocked as a date conflict, and each stays its own candidate", () => {
  const base = "Aperitivo del venerdì alle 19:00 con musica dal vivo e drink speciali, vi aspettiamo numerosi il";
  const rows = [
    d1Row({ source_id: "fb-1", message_or_caption: `${base} 04/09/2026`, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "fb-2", message_or_caption: `${base} 11/09/2026`, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "fb-3", message_or_caption: `${base} 18/09/2026`, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates.length, 3);
  for (const candidate of candidates) {
    assert.equal(candidate.date_state, "single_explicit_date");
    assert.equal(candidate.time_relevance, "recurring_or_multi_date");
    assert.ok(candidate.recurring_series);
    assert.equal(candidate.recurring_series.cluster_size, 3);
    assert.notEqual(candidate.promotion_readiness, "blocked_by_date_conflict"); // no such reason exists — only missing title should block
    assert.deepEqual(candidate.missing_fields, ["title"]);
  }
});

test("a genuine disagreement between an isolated pair of duplicate-like sources IS a date conflict (ambiguous_date) and blocks", () => {
  const rows = [
    d1Row({ network: "facebook", source_id: "fb-1", message_or_caption: "Serata di beneficenza il 03/09/2026 alle 21:00 con musica dal vivo e buffet per tutti", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ network: "instagram", source_id: "ig-1", source_account_id: "17841402902868891", message_or_caption: "Serata di beneficenza il 10/09/2026 alle 21:00 con musica dal vivo e buffet per tutti", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const ambiguous = candidates.find((candidate) => candidate.date_state === "ambiguous_date");
  assert.ok(ambiguous);
  assert.equal(ambiguous.fields.start_date.status, "ambiguous");
  assert.equal(ambiguous.promotion_readiness, "blocked");
  assert.equal(ambiguous.time_relevance, "ambiguous");
});

test("a deterministic title suggestion is produced from a genuine heading line", () => {
  const rows = [d1Row({
    message_or_caption: "Serata Jazz\nStasera dalle 21:00 vi aspettiamo con musica dal vivo il 03/09/2026",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].fields.title_suggestion.value, "Serata Jazz");
  assert.equal(candidates[0].fields.title_suggestion.status, "inferred");
});

test("no title suggestion is produced from arbitrary prose with no structural heading", () => {
  const rows = [d1Row({
    message_or_caption: "Buongiorno a tutti, oggi vi aspettiamo per un aperitivo speciale il 03/09/2026 con tanta musica",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].fields.title_suggestion, null);
});

test("an operational notice candidate is detected and always requires owner confirmation", () => {
  const rows = [d1Row({
    message_or_caption: "Attenzione: chiusura straordinaria dal 20 al 27 agosto, riapriamo presto",
    candidate_signals: JSON.stringify({ event_like: false, notice_like: true, explicit_date: false }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].candidate_type, "operational_notice");
  assert.equal(candidates[0].promotion_readiness, "blocked");
  assert.match(candidates[0].blocked_reasons.join(" "), /owner confirmation/);
});

test("a generic venue post with no deterministic signal remains unknown and non-promotable", () => {
  const rows = [d1Row({ message_or_caption: "Buongiorno a tutti, buona giornata dallo staff!" })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].candidate_type, "unknown");
  assert.equal(candidates[0].promotion_readiness, "not_applicable");
  assert.equal(candidates[0].review_priority, "low");
});

test("a historic event candidate is recognized as past", () => {
  const rows = [d1Row({
    message_or_caption: "Concerto speciale il 01/01/2026, grazie a tutti per essere venuti",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].time_relevance, "past");
});

test("priority is high/medium/low deterministically and near-term/upcoming/future-distant are distinguished", () => {
  const near = d1Row({ source_id: "near", message_or_caption: "Concerto il 20/08/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) });
  const upcoming = d1Row({ source_id: "upcoming", message_or_caption: "Concerto il 10/09/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) });
  const distant = d1Row({ source_id: "distant", message_or_caption: "Concerto il 01/12/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) });
  const { candidates } = buildCandidates([near, upcoming, distant].map(fromD1Row), { now: NOW });
  const byId = Object.fromEntries(candidates.map((c) => [c.sources[0].source_id, c]));
  assert.equal(byId.near.time_relevance, "near_term");
  assert.equal(byId.near.review_priority, "high");
  assert.equal(byId.upcoming.time_relevance, "upcoming");
  assert.equal(byId.upcoming.review_priority, "high");
  assert.equal(byId.distant.time_relevance, "future_distant");
  assert.equal(byId.distant.review_priority, "medium");
});

test("Facebook and Instagram duplicate posts are grouped into one candidate with both sources retained", () => {
  const shared = "Serata di beneficenza il 05/09/2026 alle 20:00, buffet e musica dal vivo per tutti";
  const rows = [
    d1Row({ network: "facebook", source_id: "fb-dup", message_or_caption: shared, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ network: "instagram", source_id: "ig-dup", source_account_id: "17841402902868891", message_or_caption: shared, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const { candidates, summary } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].sources.length, 2);
  assert.equal(summary.duplicate_groups, 1);
});

test("no credentials or tokens ever appear in the built review (structural safety on synthetic data)", () => {
  const rows = [d1Row({ message_or_caption: "Concerto il 01/09/2026 alle 21:00" })];
  const result = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const dump = JSON.stringify(result);
  assert.equal(dump.includes("access_token"), false);
  assert.equal(dump.includes("appsecret_proof"), false);
});

test("the private candidate review fails the shared public-data safety check", () => {
  const rows = [d1Row({ message_or_caption: "Concerto il 01/09/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) })];
  const result = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.throws(() => assertPublicDataSafe(result), /private feeder data/);
  assert.throws(() => assertPublicDataSafe(result.candidates), /private feeder data/);
});

test("renderReviewMarkdown hides past candidates by default and includes them with includePast", () => {
  const rows = [
    d1Row({ source_id: "fb-past", message_or_caption: "Concerto il 01/01/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "fb-future", message_or_caption: "Concerto il 01/12/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const result = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const defaultMarkdown = renderReviewMarkdown(result);
  const allMarkdown = renderReviewMarkdown(result, { includePast: true });
  assert.equal(defaultMarkdown.includes("meta-facebook-fb-future"), true);
  assert.equal(defaultMarkdown.includes("meta-facebook-fb-past"), false);
  assert.equal(allMarkdown.includes("meta-facebook-fb-past"), true);
});

test("candidates:refresh alone never writes to content/events or content/notices, only to its own private output paths", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "candidate-refresh-test-"));
  const fixturePath = path.join(dir, "fixture.json");
  fs.writeFileSync(fixturePath, JSON.stringify({ records: [d1Row({ message_or_caption: "Concerto il 01/12/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) })] }));
  const jsonPath = path.join(dir, "candidate-review.json");
  const mdPath = path.join(dir, "candidate-review.md");
  const decisionsPath = path.join(dir, "candidate-decisions.json");

  const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
  const eventsBefore = fs.readdirSync(path.join(repoRoot, "content", "events"));
  const noticesBefore = fs.readdirSync(path.join(repoRoot, "content", "notices"));

  const result = refresh({ source: fixturePath, now: NOW, jsonPath, mdPath, decisionsPath });

  const eventsAfter = fs.readdirSync(path.join(repoRoot, "content", "events"));
  const noticesAfter = fs.readdirSync(path.join(repoRoot, "content", "notices"));
  assert.deepEqual(eventsBefore, eventsAfter);
  assert.deepEqual(noticesBefore, noticesAfter);
  assert.equal(fs.existsSync(jsonPath), true);
  assert.equal(fs.existsSync(mdPath), true);
  assert.equal(result.summary.total_source_records, 1);
  assert.equal(fs.statSync(jsonPath).mode & 0o777, 0o600);
});

test("an ignored candidate's decision survives a subsequent candidates:refresh and is excluded from the default queue", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "candidate-decisions-test-"));
  const fixturePath = path.join(dir, "fixture.json");
  const record = d1Row({ source_id: "fb-ignore-me", message_or_caption: "Concerto il 01/12/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) });
  fs.writeFileSync(fixturePath, JSON.stringify({ records: [record] }));
  const jsonPath = path.join(dir, "candidate-review.json");
  const mdPath = path.join(dir, "candidate-review.md");
  const decisionsPath = path.join(dir, "candidate-decisions.json");

  const first = refresh({ source: fixturePath, now: NOW, jsonPath, mdPath, decisionsPath });
  const candidateId = first.candidates[0].candidate_id;
  assert.equal(first.candidates[0].review_decision, "pending");

  const decisionState = loadDecisions(decisionsPath);
  saveDecisions(decisionsPath, recordDecision(decisionState, candidateId, "ignore", { now: NOW }));

  const second = refresh({ source: fixturePath, now: NOW, jsonPath, mdPath, decisionsPath });
  assert.equal(second.candidates[0].review_decision, "ignore", "the decision must survive a subsequent refresh");

  const actionable = second.candidates.filter((candidate) => !["ignore", "promoted"].includes(candidate.review_decision));
  assert.equal(actionable.length, 0, "an ignored candidate must be excluded from the default actionable pool");
});

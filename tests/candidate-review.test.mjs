import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assertPublicDataSafe } from "../scripts/feeder-health.mjs";
import { buildCandidates, fromD1Row, fromNormalizedRecord, renderReviewMarkdown } from "../scripts/candidate-review-lib.mjs";
import { refresh } from "../scripts/candidates-refresh.mjs";

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

test("an explicit-date event candidate is detected, has extracted date/time, and is blocked only on title", () => {
  const rows = [d1Row({
    message_or_caption: "Concerto jazz dal vivo il 03/09/2026 alle ore 21:00, ingresso libero!",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates.length, 1);
  const [candidate] = candidates;
  assert.equal(candidate.candidate_type, "event");
  assert.equal(candidate.fields.start_date.value, "2026-09-03");
  assert.equal(candidate.fields.start_date.status, "extracted");
  assert.equal(candidate.fields.start_time.value, "21:00");
  assert.equal(candidate.time_relevance, "upcoming");
  assert.equal(candidate.promotion_readiness, "blocked");
  assert.deepEqual(candidate.missing_fields, ["title"]);
  assert.equal(candidate.visibility, "private");
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
});

test("a historic event candidate is recognized as past", () => {
  const rows = [d1Row({
    message_or_caption: "Concerto speciale il 01/01/2026, grazie a tutti per essere venuti",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].time_relevance, "past");
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

test("summary aggregates by type, time relevance, and promotion readiness", () => {
  const rows = [
    d1Row({ source_id: "fb-1", message_or_caption: "Concerto il 01/09/2026", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "fb-2", message_or_caption: "Chiusura straordinaria domani", candidate_signals: JSON.stringify({ event_like: false, notice_like: true, explicit_date: false }) }),
    d1Row({ source_id: "fb-3", message_or_caption: "Buona giornata a tutti" }),
  ];
  const { summary } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(summary.total_source_records, 3);
  assert.equal(summary.by_type.event, 1);
  assert.equal(summary.by_type.operational_notice, 1);
  assert.equal(summary.by_type.unknown, 1);
  assert.equal(summary.promotion_blocked, 2);
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
    d1Row({ source_id: "fb-past", message_or_caption: "Concerto il 01/01/2026", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "fb-future", message_or_caption: "Concerto il 01/12/2026", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const result = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const defaultMarkdown = renderReviewMarkdown(result);
  const allMarkdown = renderReviewMarkdown(result, { includePast: true });
  assert.equal(defaultMarkdown.includes("fb-future"), true);
  assert.equal(defaultMarkdown.includes("meta-facebook-fb-past"), false);
  assert.equal(allMarkdown.includes("meta-facebook-fb-past"), true);
});

test("candidates:refresh alone never writes to content/events or content/notices, only to its own private output paths", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "candidate-refresh-test-"));
  const fixturePath = path.join(dir, "fixture.json");
  fs.writeFileSync(fixturePath, JSON.stringify({ records: [d1Row({ message_or_caption: "Concerto il 01/12/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) })] }));
  const jsonPath = path.join(dir, "candidate-review.json");
  const mdPath = path.join(dir, "candidate-review.md");

  const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
  const eventsBefore = fs.readdirSync(path.join(repoRoot, "content", "events"));
  const noticesBefore = fs.readdirSync(path.join(repoRoot, "content", "notices"));

  const result = refresh({ source: fixturePath, now: NOW, jsonPath, mdPath });

  const eventsAfter = fs.readdirSync(path.join(repoRoot, "content", "events"));
  const noticesAfter = fs.readdirSync(path.join(repoRoot, "content", "notices"));
  assert.deepEqual(eventsBefore, eventsAfter);
  assert.deepEqual(noticesBefore, noticesAfter);
  assert.equal(fs.existsSync(jsonPath), true);
  assert.equal(fs.existsSync(mdPath), true);
  assert.equal(result.summary.total_source_records, 1);
  assert.equal(fs.statSync(jsonPath).mode & 0o777, 0o600);
});

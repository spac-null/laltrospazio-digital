import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCandidates, fromD1Row } from "../scripts/candidate-review-lib.mjs";
import { listCandidates } from "../scripts/candidates-list.mjs";

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

function writeReviewFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "candidate-list-test-"));
  const rows = [
    d1Row({ source_id: "near", message_or_caption: "Concerto il 20/08/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "past", message_or_caption: "Concerto il 01/01/2026 alle 21:00", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ source_id: "notice", message_or_caption: "Chiusura straordinaria per lavori", candidate_signals: JSON.stringify({ event_like: false, notice_like: true, explicit_date: false }) }),
    d1Row({ source_id: "unknown", message_or_caption: "Buongiorno a tutti dallo staff" }),
  ];
  const result = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const jsonPath = path.join(dir, "candidate-review.json");
  fs.writeFileSync(jsonPath, JSON.stringify({ ...result, candidates: result.candidates.map((c) => ({ ...c, review_decision: "pending" })) }));
  return jsonPath;
}

test("default view (no filters) excludes past and low-priority candidates", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath });
  assert.equal(candidates.some((c) => c.time_relevance === "past"), false);
  assert.equal(candidates.some((c) => c.candidate_type === "unknown"), false);
});

test("--upcoming filters to near_term/upcoming/future_distant only", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath, upcomingOnly: true });
  assert.ok(candidates.length > 0);
  assert.ok(candidates.every((c) => ["near_term", "upcoming", "future_distant"].includes(c.time_relevance)));
});

test("--type event filters to only event candidates", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath, type: "event", all: true });
  assert.ok(candidates.length > 0);
  assert.ok(candidates.every((c) => c.candidate_type === "event"));
});

test("--past shows only past candidates", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath, pastOnly: true });
  assert.ok(candidates.length > 0);
  assert.ok(candidates.every((c) => c.time_relevance === "past"));
});

test("--limit bounds the result count", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath, all: true, limit: 1 });
  assert.equal(candidates.length, 1);
});

test("--blocked shows only blocked candidates", () => {
  const jsonPath = writeReviewFixture();
  const candidates = listCandidates({ jsonPath, blockedOnly: true });
  assert.ok(candidates.length > 0);
  assert.ok(candidates.every((c) => c.promotion_readiness === "blocked"));
});

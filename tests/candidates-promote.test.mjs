import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCandidates, fromD1Row } from "../scripts/candidate-review-lib.mjs";
import { PromotionError, promoteCandidate } from "../scripts/candidates-promote.mjs";
import { validateEvent, validateNotice } from "../scripts/content-lib.mjs";

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

function setupRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "candidate-promote-test-"));
  fs.mkdirSync(path.join(root, "content", "events"), { recursive: true });
  fs.mkdirSync(path.join(root, "content", "notices"), { recursive: true });
  fs.writeFileSync(path.join(root, "content", "venue.json"), JSON.stringify({ id: "l-altro-spazio-bologna" }));
  return root;
}

function writeReview(root, candidates) {
  const jsonPath = path.join(root, "candidate-review.json");
  fs.writeFileSync(jsonPath, JSON.stringify({ visibility: "private", candidates, summary: {} }));
  return jsonPath;
}

function eventCandidate(overrides = {}) {
  const rows = [d1Row({
    message_or_caption: "Concerto jazz dal vivo il 03/09/2026 alle ore 21:00, ingresso libero!",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
    ...overrides.row,
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  return { ...candidates[0], ...overrides.candidate };
}

test("promotion is blocked when the event date is missing", () => {
  const root = setupRoot();
  const candidate = eventCandidate({ row: { message_or_caption: "Serata speciale, ingresso libero per tutti!", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: false }) } });
  const jsonPath = writeReview(root, [candidate]);
  assert.throws(
    () => promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Serata speciale" }, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /start date is missing/.test(error.message),
  );
});

test("promotion is blocked on an inferred (guessed) date without an explicit owner override", () => {
  const root = setupRoot();
  const candidate = eventCandidate({ row: { message_or_caption: "Concerto speciale il 20/08, non mancate!", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) } });
  assert.equal(candidate.fields.start_date.status, "inferred");
  const jsonPath = writeReview(root, [candidate]);
  assert.throws(
    () => promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto speciale" }, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /only inferred\/guessed/.test(error.message),
  );
});

test("an owner-supplied --date resolves an inferred date and is recorded as owner_confirmed", () => {
  const root = setupRoot();
  const candidate = eventCandidate({ row: { message_or_caption: "Concerto speciale il 20/08, non mancate!", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) } });
  const jsonPath = writeReview(root, [candidate]);
  const result = promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto speciale", date: "2026-08-20", time: "21:00" }, confirm: true, root, jsonPath, now: NOW });
  assert.equal(result.status, "written");
  assert.equal(result.provenance.start_date, "owner_confirmed");
  assert.equal(result.draft.start, "2026-08-20T21:00:00+02:00");
});

test("promotion is blocked when sources disagree on the date (conflicting)", () => {
  const root = setupRoot();
  const shared = "Serata di beneficenza il 03/09/2026 alle 21:00 con musica dal vivo e buffet per tutti";
  const conflicting = "Serata di beneficenza il 10/09/2026 alle 21:00 con musica dal vivo e buffet per tutti";
  const rows = [
    d1Row({ network: "facebook", source_id: "fb-1", message_or_caption: shared, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ network: "instagram", source_id: "ig-1", source_account_id: "17841402902868891", message_or_caption: conflicting, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const conflictingCandidate = candidates.find((candidate) => candidate.fields.start_date?.status === "conflicting");
  assert.ok(conflictingCandidate, "expected at least one candidate with a conflicting start_date");
  const jsonPath = writeReview(root, candidates);
  assert.throws(
    () => promoteCandidate({ candidateId: conflictingCandidate.candidate_id, flags: { title: "Serata di beneficenza" }, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /conflicting across sources/.test(error.message),
  );
});

test("an explicit --date override resolves a conflicting date", () => {
  const root = setupRoot();
  const shared = "Serata di beneficenza il 03/09/2026 alle 21:00 con musica dal vivo e buffet per tutti";
  const conflicting = "Serata di beneficenza il 10/09/2026 alle 21:00 con musica dal vivo e buffet per tutti";
  const rows = [
    d1Row({ network: "facebook", source_id: "fb-1", message_or_caption: shared, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
    d1Row({ network: "instagram", source_id: "ig-1", source_account_id: "17841402902868891", message_or_caption: conflicting, candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }) }),
  ];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const conflictingCandidate = candidates.find((candidate) => candidate.fields.start_date?.status === "conflicting");
  const jsonPath = writeReview(root, candidates);
  const result = promoteCandidate({ candidateId: conflictingCandidate.candidate_id, flags: { title: "Serata di beneficenza", date: "2026-09-03", time: "21:00" }, confirm: true, root, jsonPath, now: NOW });
  assert.equal(result.status, "written");
});

test("promotion writes a valid draft canonical event and passes the existing validateEvent schema", () => {
  const root = setupRoot();
  const candidate = eventCandidate();
  const jsonPath = writeReview(root, [candidate]);
  const result = promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto jazz dal vivo" }, confirm: true, root, jsonPath, now: NOW });
  assert.equal(result.status, "written");
  assert.equal(result.draft.publication_status, "draft");
  const errors = validateEvent(result.draft, { id: "l-altro-spazio-bologna" });
  assert.deepEqual(errors, []);
  const writtenFile = path.join(root, "content", "events", `${result.draft.slug}.json`);
  assert.equal(fs.existsSync(writtenFile), true);
  const onDisk = JSON.parse(fs.readFileSync(writtenFile, "utf8"));
  assert.equal(onDisk.title, "Concerto jazz dal vivo");
});

test("source provenance (network, permalink, timestamp) survives into the promoted draft", () => {
  const root = setupRoot();
  const candidate = eventCandidate();
  const jsonPath = writeReview(root, [candidate]);
  const result = promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto jazz dal vivo" }, confirm: true, root, jsonPath, now: NOW });
  assert.equal(result.draft.source.type, "facebook");
  assert.equal(result.draft.source.url, "https://www.facebook.com/laltrospazio.bologna/posts/1");
  assert.equal(result.draft.source.retrieved_at, "2026-09-03T10:00:00Z");
});

test("without --confirm, promotion is a dry run and writes nothing", () => {
  const root = setupRoot();
  const candidate = eventCandidate();
  const jsonPath = writeReview(root, [candidate]);
  const result = promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto jazz dal vivo" }, root, jsonPath, now: NOW });
  assert.equal(result.status, "dry_run");
  const writtenFile = path.join(root, "content", "events", `${result.draft.slug}.json`);
  assert.equal(fs.existsSync(writtenFile), false);
});

test("an operational notice always requires explicit owner-confirmed message and dates, and writes a valid draft notice", () => {
  const root = setupRoot();
  const rows = [d1Row({ message_or_caption: "Attenzione: chiusura per lavori", candidate_signals: JSON.stringify({ event_like: false, notice_like: true, explicit_date: false }) })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const jsonPath = writeReview(root, candidates);
  assert.throws(
    () => promoteCandidate({ candidateId: candidates[0].candidate_id, flags: {}, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /message is missing/.test(error.message),
  );
  const result = promoteCandidate({
    candidateId: candidates[0].candidate_id,
    flags: { message: "Chiusura per lavori dal 1 al 5 settembre 2026", validFrom: "2026-09-01", validUntil: "2026-09-05", noticeType: "temporary_closure" },
    confirm: true,
    root,
    jsonPath,
    now: NOW,
  });
  assert.equal(result.status, "written");
  assert.equal(result.draft.source.type, "owner_confirmation");
  assert.equal(result.draft.owner_confirmed, true);
  assert.equal(result.draft.publication_status, "draft");
  const errors = validateNotice(result.draft, { id: "l-altro-spazio-bologna" });
  assert.deepEqual(errors, []);
});

test("a duplicate slug is refused rather than silently overwritten", () => {
  const root = setupRoot();
  fs.writeFileSync(path.join(root, "content", "events", "concerto-jazz-dal-vivo-2026-09-03.json"), "{}");
  const candidate = eventCandidate();
  const jsonPath = writeReview(root, [candidate]);
  assert.throws(
    () => promoteCandidate({ candidateId: candidate.candidate_id, flags: { title: "Concerto jazz dal vivo" }, confirm: true, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /already exists/.test(error.message),
  );
});

test("an irrelevant/unknown candidate type can never be promoted", () => {
  const root = setupRoot();
  const rows = [d1Row({ message_or_caption: "Buongiorno a tutti dallo staff!" })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const jsonPath = writeReview(root, candidates);
  assert.throws(
    () => promoteCandidate({ candidateId: candidates[0].candidate_id, flags: {}, root, jsonPath, now: NOW }),
    (error) => error instanceof PromotionError && /cannot be promoted/.test(error.message),
  );
});

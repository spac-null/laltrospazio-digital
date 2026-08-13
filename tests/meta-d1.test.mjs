import assert from "node:assert/strict";
import test from "node:test";
import { finishFeederRun, startFeederRun, upsertMetaSourceRecords } from "../worker/meta-d1.mjs";
import { createD1Double } from "./meta-d1-double.mjs";

function record(overrides = {}) {
  return {
    source_network: "facebook",
    source_id: "fb-1",
    source_account_id: "264601140373284",
    published_at: "2026-08-01T10:00:00Z",
    caption: "Original caption",
    permalink: "https://example.test/1",
    media: { type: null },
    candidate_signals: { event_like: false, notice_like: false, explicit_date: false },
    ...overrides,
  };
}

function rows(db) {
  return db.raw.prepare("SELECT network, source_id, message_or_caption, first_seen_at, last_seen_at FROM meta_source_records ORDER BY network, source_id").all();
}

test("first ingestion inserts a record with matching first/last seen", async () => {
  const db = createD1Double();
  await upsertMetaSourceRecords(db, [record()], "2026-08-01T12:00:00Z");
  const stored = rows(db);
  assert.equal(stored.length, 1);
  assert.equal(stored[0].first_seen_at, "2026-08-01T12:00:00Z");
  assert.equal(stored[0].last_seen_at, "2026-08-01T12:00:00Z");
});

test("second identical ingestion does not duplicate the row", async () => {
  const db = createD1Double();
  await upsertMetaSourceRecords(db, [record()], "2026-08-01T12:00:00Z");
  await upsertMetaSourceRecords(db, [record()], "2026-08-13T12:00:00Z");
  const stored = rows(db);
  assert.equal(stored.length, 1);
});

test("a changed caption updates last_seen_at and content but preserves first_seen_at", async () => {
  const db = createD1Double();
  await upsertMetaSourceRecords(db, [record()], "2026-08-01T12:00:00Z");
  await upsertMetaSourceRecords(db, [record({ caption: "Updated caption" })], "2026-08-13T12:00:00Z");
  const [stored] = rows(db);
  assert.equal(stored.message_or_caption, "Updated caption");
  assert.equal(stored.first_seen_at, "2026-08-01T12:00:00Z");
  assert.equal(stored.last_seen_at, "2026-08-13T12:00:00Z");
});

test("Facebook and Instagram records with the same numeric id cannot collide", async () => {
  const db = createD1Double();
  await upsertMetaSourceRecords(db, [record({ source_network: "facebook", source_id: "1" }), record({ source_network: "instagram", source_id: "1", source_account_id: "17841402902868891" })], "2026-08-13T12:00:00Z");
  const stored = rows(db);
  assert.equal(stored.length, 2);
  assert.deepEqual(stored.map((row) => row.network).sort(), ["facebook", "instagram"]);
});

test("feeder-run history records start, success, counts, and pagination state", async () => {
  const db = createD1Double();
  const runId = await startFeederRun(db, "2026-08-13T12:00:00Z");
  await finishFeederRun(db, runId, { finishedAt: "2026-08-13T12:00:05Z", success: true, facebookCount: 100, instagramCount: 100, facebookTruncated: true, instagramTruncated: true, freshness: "fresh" });
  const run = db.raw.prepare("SELECT * FROM meta_feeder_runs WHERE id = ?").get(runId);
  assert.equal(run.success, 1);
  assert.equal(run.facebook_record_count, 100);
  assert.equal(run.instagram_record_count, 100);
  assert.equal(run.facebook_truncated, 1);
  assert.equal(run.instagram_truncated, 1);
  assert.equal(run.freshness, "fresh");
});

test("feeder-run history records a safe error class without any credential", async () => {
  const db = createD1Double();
  const runId = await startFeederRun(db, "2026-08-13T12:00:00Z");
  await finishFeederRun(db, runId, { finishedAt: "2026-08-13T12:00:05Z", success: false, freshness: "failed", errors: [{ surface: "facebook", error_class: "invalid_token" }] });
  const run = db.raw.prepare("SELECT * FROM meta_feeder_runs WHERE id = ?").get(runId);
  assert.equal(run.success, 0);
  assert.equal(run.freshness, "failed");
  assert.match(run.errors_json, /invalid_token/);
  assert.equal(run.errors_json.includes("access_token"), false);
});

test("no secret, token, or paging URL column exists on the stored record", async () => {
  const db = createD1Double();
  await upsertMetaSourceRecords(db, [record()], "2026-08-01T12:00:00Z");
  const columns = db.raw.prepare("PRAGMA table_info(meta_source_records)").all().map((column) => column.name);
  for (const forbidden of ["access_token", "token", "appsecret_proof", "client_secret", "paging"]) {
    assert.equal(columns.some((name) => name.toLowerCase().includes(forbidden)), false, `unexpected column matching "${forbidden}"`);
  }
});

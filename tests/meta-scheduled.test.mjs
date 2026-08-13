import assert from "node:assert/strict";
import test from "node:test";
import { requireMetaSecrets, runScheduledMetaIngest } from "../worker/meta-scheduled.mjs";
import { createD1Double } from "./meta-d1-double.mjs";

function fakeFetch({ instagramError = false, facebookError = false } = {}) {
  return async (url) => {
    const value = String(url);
    if (value.includes("fields=id%2Cname")) return new Response(JSON.stringify({ id: "264601140373284", name: "L'Altro Spazio" }), { status: 200 });
    if (value.includes("fields=id%2Cinstagram_business_account")) return new Response(JSON.stringify({ id: "264601140373284", instagram_business_account: { id: "17841402902868891" } }), { status: 200 });
    if (value.includes("/264601140373284/posts")) return new Response(JSON.stringify(facebookError ? { error: { code: 190, message: "synthetic" } } : { data: [{ id: "fb-1", message: "Post" }] }), { status: 200 });
    if (value.includes("/17841402902868891/media")) return new Response(JSON.stringify(instagramError ? { error: { code: 10, message: "synthetic" } } : { data: [{ id: "ig-1", caption: "Caption", media_type: "IMAGE", timestamp: "2026-08-13T10:00:00Z" }] }), { status: 200 });
    throw new Error(`unexpected synthetic URL ${value}`);
  };
}

function env(db) {
  return { META_DB: db, META_PAGE_ACCESS_TOKEN: "synthetic-page-token", META_SYSTEM_USER_ACCESS_TOKEN: "synthetic-system-token" };
}

test("requireMetaSecrets rejects a missing binding with a clear, credential-free message", () => {
  assert.throws(() => requireMetaSecrets({}), /META_PAGE_ACCESS_TOKEN/);
  assert.throws(() => requireMetaSecrets({ META_PAGE_ACCESS_TOKEN: "x", META_SYSTEM_USER_ACCESS_TOKEN: "y" }), /META_DB/);
});

test("a scheduled run ingests and persists both surfaces idempotently", async () => {
  const db = createD1Double();
  const first = await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch(), now: () => "2026-08-13T12:00:00Z" });
  assert.equal(first.report.facebook.ok, true);
  assert.equal(first.report.instagram.ok, true);
  const second = await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch(), now: () => "2026-08-20T12:00:00Z" });
  assert.equal(second.report.facebook.ok, true);
  const stored = db.raw.prepare("SELECT COUNT(*) as count FROM meta_source_records").get();
  assert.equal(stored.count, 2);
  const runs = db.raw.prepare("SELECT COUNT(*) as count FROM meta_feeder_runs").get();
  assert.equal(runs.count, 2);
});

test("a failed Facebook read does not erase a previously stored Instagram record or run history", async () => {
  const db = createD1Double();
  await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch(), now: () => "2026-08-13T12:00:00Z" });
  const beforeCount = db.raw.prepare("SELECT COUNT(*) as count FROM meta_source_records WHERE network = 'instagram'").get().count;
  const result = await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch({ facebookError: true }), now: () => "2026-08-20T12:00:00Z" });
  assert.equal(result.report.facebook.ok, false);
  assert.equal(result.report.instagram.ok, true);
  const afterCount = db.raw.prepare("SELECT COUNT(*) as count FROM meta_source_records WHERE network = 'instagram'").get().count;
  assert.equal(afterCount, beforeCount);
  const facebookStillPresent = db.raw.prepare("SELECT COUNT(*) as count FROM meta_source_records WHERE network = 'facebook'").get().count;
  assert.equal(facebookStillPresent, 1, "the earlier successful Facebook row must not be deleted by a later failed run");
  const run = db.raw.prepare("SELECT * FROM meta_feeder_runs ORDER BY id DESC LIMIT 1").get();
  assert.equal(run.success, 1, "instagram still succeeded, so the run is a partial success, not a hard failure");
  assert.match(run.errors_json, /facebook/);
});

test("a failed Instagram read does not erase a previously stored Facebook record or run history", async () => {
  const db = createD1Double();
  await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch(), now: () => "2026-08-13T12:00:00Z" });
  const result = await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch({ instagramError: true }), now: () => "2026-08-20T12:00:00Z" });
  assert.equal(result.report.instagram.ok, false);
  assert.equal(result.report.facebook.ok, true);
  const instagramStillPresent = db.raw.prepare("SELECT COUNT(*) as count FROM meta_source_records WHERE network = 'instagram'").get().count;
  assert.equal(instagramStillPresent, 1, "the earlier successful Instagram row must not be deleted by a later failed run");
});

test("no access token, paging URL, or secret ever reaches a stored row or run record", async () => {
  const db = createD1Double();
  await runScheduledMetaIngest(env(db), { fetchImpl: fakeFetch(), now: () => "2026-08-13T12:00:00Z" });
  const dump = JSON.stringify({
    records: db.raw.prepare("SELECT * FROM meta_source_records").all(),
    runs: db.raw.prepare("SELECT * FROM meta_feeder_runs").all(),
  });
  assert.equal(dump.includes("synthetic-page-token"), false);
  assert.equal(dump.includes("synthetic-system-token"), false);
  assert.equal(dump.includes("access_token"), false);
});

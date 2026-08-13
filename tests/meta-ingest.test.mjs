import assert from "node:assert/strict";
import test from "node:test";
import { assertPublicDataSafe } from "../scripts/feeder-health.mjs";
import { MAX_ALLOWED_INGEST_PAGES, runMetaIngest } from "../scripts/meta-ingest-lib.mjs";

function fakeFetch({ instagramError = false, pages = 1 } = {}) {
  let postsFetched = 0;
  return async (url) => {
    const value = String(url);
    if (value.includes("fields=id%2Cname")) return new Response(JSON.stringify({ id: "264601140373284", name: "L'Altro Spazio" }), { status: 200 });
    if (value.includes("fields=id%2Cinstagram_business_account")) return new Response(JSON.stringify({ id: "264601140373284", instagram_business_account: { id: "17841402902868891" } }), { status: 200 });
    if (value.includes("/264601140373284/posts")) {
      postsFetched += 1;
      const hasMore = postsFetched < pages;
      return new Response(JSON.stringify({ data: [{ id: `page-post-${postsFetched}`, message: "Post" }], ...(hasMore ? { paging: { next: `https://graph.facebook.com/v26.0/264601140373284/posts?after=cursor-${postsFetched}&access_token=secret` } } : {}) }), { status: 200 });
    }
    if (value.includes("/17841402902868891/media")) return new Response(JSON.stringify(instagramError ? { error: { code: 10, message: "permission denied" } } : { data: [{ id: "ig-media-1", caption: "Serata concerto", media_type: "IMAGE", timestamp: "2026-08-13T10:00:00Z" }] }), { status: 200 });
    throw new Error(`unexpected synthetic URL ${value}`);
  };
}

test("real read-only ingestion normalizes bounded Facebook and Instagram records", async () => {
  const report = await runMetaIngest({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch(), fetchedAt: "2026-08-13T12:00:00Z" });
  assert.equal(report.page_identity_verified, true);
  assert.equal(report.instagram_linkage_verified, true);
  assert.equal(report.facebook.ok, true);
  assert.equal(report.instagram.ok, true);
  assert.equal(report.total_records, 2);
  assert.equal(report.facebook.records[0].source_account_id, "264601140373284");
  assert.equal(report.instagram.records[0].source_account_id, "17841402902868891");
  assert.equal(report.instagram.records[0].candidate_signals.event_like, true);
  assert.equal(report.feeder_health.facebook.freshness, "fresh");
  assert.equal(report.feeder_health.instagram.freshness, "fresh");
  assert.equal(report.token_health.system_user, "unknown");
  assert.equal(report.token_health.page, "unknown");
});

test("pagination is bounded and never follows more than the allowed page count", async () => {
  const report = await runMetaIngest({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch({ pages: 5 }), fetchedAt: "2026-08-13T12:00:00Z", maxPages: 999 });
  assert.equal(report.pagination.max_pages, MAX_ALLOWED_INGEST_PAGES);
  assert.equal(report.facebook.truncated, true);
});

test("Instagram permission failure is reported without blocking the Facebook read", async () => {
  const report = await runMetaIngest({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch({ instagramError: true }), fetchedAt: "2026-08-13T12:00:00Z" });
  assert.equal(report.facebook.ok, true);
  assert.equal(report.instagram.ok, false);
  assert.equal(report.errors.find((error) => error.surface === "instagram").error_class, "permission_denied");
  assert.equal(report.feeder_health.instagram.freshness, "failed");
});

test("real ingestion output never contains credentials and cannot enter public output unapproved", async () => {
  const report = await runMetaIngest({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch(), fetchedAt: "2026-08-13T12:00:00Z" });
  assert.equal(JSON.stringify(report).includes("access_token"), false);
  assert.equal(JSON.stringify(report).includes("synthetic-system-token"), false);
  assert.equal(JSON.stringify(report).includes("synthetic-page-token"), false);
  assert.throws(() => assertPublicDataSafe(report.facebook.records), /unapproved feeder candidate/);
  assert.throws(() => assertPublicDataSafe(report.instagram.records), /unapproved feeder candidate/);
});

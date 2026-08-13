import assert from "node:assert/strict";
import test from "node:test";
import { assertPublicDataSafe, makeFeederHealth } from "../scripts/feeder-health.mjs";
import { normalizeSearchAnalytics } from "../feeders/google-search-console/normalize.mjs";

test("shared feeder health has the common fields and visibility", () => {
  const health = makeFeederHealth({ source: "google_search_console", visibility: "private", freshness: "stale", lastError: "delayed" });
  assert.deepEqual(health, {
    source: "google_search_console", visibility: "private", authentication_status: "not_configured",
    last_attempt: null, last_success: null, freshness: "stale", last_error: "delayed",
    records_received: 0, conflicts_found: [],
  });
});

test("private feeder records cannot cross into public output", () => {
  assert.throws(() => assertPublicDataSafe({ visibility: "private", rows: [] }), /private feeder data/);
  assert.throws(() => assertPublicDataSafe({ visibility: "public_candidate", records: [] }), /unapproved feeder candidate/);
  const gsc = normalizeSearchAnalytics({ rows: [{ keys: ["venue"], clicks: 1 }] }, { property: "sc-domain:altrospazio.org", requested: { dimensions: ["query"] }, fetchedAt: "2026-08-13T12:00:00Z" });
  assert.throws(() => assertPublicDataSafe(gsc), /private feeder data/);
  assert.doesNotThrow(() => assertPublicDataSafe({ visibility: "public", value: "approved" }));
});

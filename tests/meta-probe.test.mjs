import assert from "node:assert/strict";
import test from "node:test";
import { META_GRAPH_BASE } from "../feeders/meta/client.mjs";
import { runMetaProbe } from "../scripts/meta-probe-lib.mjs";

function fakeFetch({ instagramError = false } = {}) {
  return async (url, init) => {
    const value = String(url);
    assert.equal(init.headers.Authorization, value.includes("/17841402902868891/media") || value.includes("fields=id%2Cinstagram_business_account") ? "Bearer synthetic-system-token" : "Bearer synthetic-page-token");
    if (value.includes("fields=id%2Cname")) return new Response(JSON.stringify({ id: "264601140373284", name: "L'Altro Spazio" }), { status: 200 });
    if (value.includes("fields=id%2Cinstagram_business_account")) return new Response(JSON.stringify({ id: "264601140373284", instagram_business_account: { id: "17841402902868891" } }), { status: 200 });
    if (value.includes("/264601140373284/posts")) return new Response(JSON.stringify({ data: [{ id: "page-post-1", message: "Post" }] }), { status: 200 });
    if (value.includes("/17841402902868891/media")) return new Response(JSON.stringify(instagramError ? { error: { code: 10, message: "permission denied" } } : { data: [{ id: "ig-media-1", caption: "Caption", media_type: "IMAGE", timestamp: "2026-08-13T10:00:00Z" }] }), { status: 200 });
    throw new Error(`unexpected synthetic URL ${value}`);
  };
}

test("complete system-user probe path is viable", async () => {
  const report = await runMetaProbe({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch(), checkedAt: "2026-08-13T12:00:00Z" });
  assert.equal(report.page_identity_verified, true);
  assert.equal(report.instagram_linkage_verified, true);
  assert.deepEqual(report.page_read, { ok: true, records: 1 });
  assert.deepEqual(report.instagram_read, { ok: true, records: 1 });
  assert.equal(report.system_user_viability, "YES - dual credential");
});

test("Page success and Instagram permission failure remain explicit", async () => {
  const report = await runMetaProbe({ systemUserToken: "synthetic-system-token", pageToken: "synthetic-page-token", fetchImpl: fakeFetch({ instagramError: true }), checkedAt: "2026-08-13T12:00:00Z" });
  assert.equal(report.page_read.ok, true);
  assert.equal(report.instagram_read.ok, false);
  assert.deepEqual(report.errors, [{ surface: "instagram", error_class: "SYSTEM_USER_INSTAGRAM_UNSUPPORTED_OR_UNAUTHORIZED" }]);
  assert.match(report.system_user_viability, /^NO:/);
  assert.equal(JSON.stringify(report).includes("access_token"), false);
});

test("Instagram success and Page code 190 remain a resource-specific partial result", async () => {
  const report = await runMetaProbe({
    systemUserToken: "synthetic-system-token",
    pageToken: "synthetic-page-token",
    fetchImpl: async (url, init) => {
      const value = String(url);
      assert.equal(init.headers.Authorization, value.includes("/17841402902868891/media") || value.includes("fields=id%2Cinstagram_business_account") ? "Bearer synthetic-system-token" : "Bearer synthetic-page-token");
      if (value.includes("fields=id%2Cname")) return new Response(JSON.stringify({ id: "264601140373284", name: "L'Altro Spazio" }), { status: 200 });
      if (value.includes("fields=id%2Cinstagram_business_account")) return new Response(JSON.stringify({ id: "264601140373284", instagram_business_account: { id: "17841402902868891" } }), { status: 200 });
      if (value.includes("/264601140373284/posts")) return new Response(JSON.stringify({ error: { code: 190, message: "synthetic resource token error" } }), { status: 200 });
      if (value.includes("/17841402902868891/media")) return new Response(JSON.stringify({ data: [{ id: "ig-media-1" }] }), { status: 200 });
      throw new Error(`unexpected synthetic URL ${value}`);
    },
    checkedAt: "2026-08-13T12:00:00Z",
  });
  assert.equal(report.page_read.ok, false);
  assert.equal(report.instagram_read.ok, true);
  assert.equal(report.errors[0].error_class, "SYSTEM_USER_PAGE_READ_TOKEN_CONTEXT_UNSUPPORTED_OR_UNAUTHORIZED");
  assert.match(report.system_user_viability, /^PARTIAL:/);
  assert.equal(report.feeder_health.last_error, "SYSTEM_USER_PAGE_READ_TOKEN_CONTEXT_UNSUPPORTED_OR_UNAUTHORIZED");
});

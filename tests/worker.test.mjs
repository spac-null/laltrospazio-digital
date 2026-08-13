import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker/index.mjs";

function poisonedDb() {
  return new Proxy({}, { get() { throw new Error("fetch handler must never touch META_DB"); } });
}

test("fetch delegates every request to the Asset Worker and never touches META_DB", async () => {
  const request = new Request("https://www.altrospazio.org/eventi");
  let assetsRequest = null;
  const env = {
    ASSETS: { fetch: async (req) => { assetsRequest = req; return new Response("ok", { status: 200 }); } },
    META_DB: poisonedDb(),
  };
  const response = await worker.fetch(request, env);
  assert.equal(await response.text(), "ok");
  assert.equal(assetsRequest, request);
});

test("fetch has no route that can query or expose Meta source records", async () => {
  const request = new Request("https://www.altrospazio.org/api/meta-source-records");
  const env = { ASSETS: { fetch: async () => new Response("not found", { status: 404 }) }, META_DB: poisonedDb() };
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 404, "there is no admin/query endpoint; unmatched paths fall through to the SPA asset worker");
});

test("scheduled() runs ingestion inside ctx.waitUntil, using our fetch stub rather than a real network call", async () => {
  const originalFetch = globalThis.fetch;
  let stubCalls = 0;
  globalThis.fetch = async () => { stubCalls += 1; throw new Error("test stub: no real Meta network call should occur"); };
  try {
    let waited = null;
    const ctx = { waitUntil: (promise) => { waited = promise; } };
    const env = {
      META_DB: {
        batch: async () => [],
        prepare: () => ({ bind: () => ({ run: async () => ({ meta: { last_row_id: 1 } }) }) }),
      },
      META_PAGE_ACCESS_TOKEN: "x",
      META_SYSTEM_USER_ACCESS_TOKEN: "y",
    };
    await worker.scheduled({}, env, ctx);
    assert.ok(waited, "scheduled() must call ctx.waitUntil with the ingestion promise");
    const { report } = await waited;
    assert.ok(stubCalls > 0, "ingestion must have used the injectable fetch, not skipped network entirely");
    assert.equal(report.page_identity_verified, false, "our fetch stub always fails, so identity verification must fail rather than silently succeed");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { HUMAN_PROOF_PERMISSIONS, listInstagramMedia, listPagePosts, metaRequest, redactMetaUrl, SYSTEM_USER_REQUIRED_CAPABILITIES, verifyAssetIdentity } from "../feeders/meta/client.mjs";

const token = "synthetic-token-never-real";

test("Meta client rejects mutation methods", async () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) await assert.rejects(() => metaRequest("123", { accessToken: token, method }), /mutation method/);
});

test("Graph error codes classify invalid tokens and permission failures", async () => {
  const response = (code) => async () => new Response(JSON.stringify({ error: { code, message: "redacted synthetic error" } }), { status: 200 });
  await assert.rejects(() => metaRequest("123", { accessToken: token, fetchImpl: response(10) }), (error) => error.code === "permission_denied" && error.graph_code === 10);
  await assert.rejects(() => metaRequest("123", { accessToken: token, fetchImpl: response(190) }), (error) => error.code === "invalid_token" && error.graph_code === 190);
});

test("system-user capabilities are separate from human discovery permissions", () => {
  assert.deepEqual(HUMAN_PROOF_PERMISSIONS, ["public_profile", "pages_show_list", "pages_read_engagement", "instagram_basic"]);
  assert.deepEqual(SYSTEM_USER_REQUIRED_CAPABILITIES, ["facebook_page_own_post_read", "instagram_professional_own_media_read"]);
});

test("Meta URLs redact access credentials before logging or persistence", () => {
  const safe = redactMetaUrl("https://graph.facebook.com/v26.0/page/posts?access_token=secret&limit=10&appsecret_proof=proof");
  assert.equal(safe.includes("access_token"), false);
  assert.equal(safe.includes("appsecret_proof"), false);
  assert.match(safe, /limit=10/);
});

test("identity verification requires the owner-confirmed Page and Instagram link", () => {
  assert.deepEqual(verifyAssetIdentity({ page: { id: "264601140373284", name: "L'Altro Spazio", instagram_business_account: { id: "17841402902868891" } } }), { page_id: "264601140373284", instagram_professional_account_id: "17841402902868891" });
  assert.throws(() => verifyAssetIdentity({ page: { id: "other", name: "L'Altro Spazio", instagram_business_account: { id: "17841402902868891" } } }), /Page identity/);
});

test("Page and Instagram pagination uses bearer auth and redacts next URLs", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    const first = !String(url).includes("after=cursor");
    return new Response(JSON.stringify(first ? { data: [{ id: "1" }], paging: { next: "https://graph.facebook.com/v26.0/next?after=cursor&access_token=secret" } } : { data: [{ id: "2" }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  const page = await listPagePosts(token, { fetchImpl, maxPages: 2 });
  const instagram = await listInstagramMedia(token, { fetchImpl, maxPages: 1 });
  assert.deepEqual(page.records.map((record) => record.id), ["1", "2"]);
  assert.equal(page.pages[0].next.includes("access_token"), false);
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${token}`);
  assert.equal(instagram.records.length, 1);
  assert.equal(calls.every((call) => !call.url.includes("access_token")), true);
});

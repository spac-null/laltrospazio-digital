import assert from "node:assert/strict";
import test from "node:test";
import { getUserPermissions, listManagedPages, META_PAGE_OAUTH_PERMISSIONS, selectOwnerPage, validateGrantedPermissions, verifyPageIdentity } from "../feeders/meta/client.mjs";

const page = { id: "264601140373284", name: "L'Altro Spazio", access_token: "synthetic-page-token", instagram_business_account: { id: "17841402902868891" } };

test("Page discovery selects exactly the owner-confirmed Page", () => {
  assert.equal(selectOwnerPage({ data: [page] }).access_token, page.access_token);
  assert.throws(() => selectOwnerPage({ data: [] }), /not returned/);
  assert.throws(() => selectOwnerPage({ data: [page, page] }), /Multiple/);
  assert.throws(() => selectOwnerPage({ data: [{ ...page, id: "other" }] }), /not returned/);
});

test("Page discovery and identity validation use the supplied token", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), auth: init.headers.Authorization });
    if (String(url).includes("/me/accounts")) return new Response(JSON.stringify({ data: [page] }), { status: 200 });
    return new Response(JSON.stringify({ ...page, access_token: undefined }), { status: 200 });
  };
  const result = await listManagedPages("synthetic-user-token", { fetchImpl });
  assert.equal(result.data[0].id, page.id);
  await verifyPageIdentity(page.access_token, { fetchImpl });
  assert.equal(calls[0].auth, "Bearer synthetic-user-token");
  assert.equal(calls[1].auth, "Bearer synthetic-page-token");
});

test("Page discovery requests only Page identity and token fields", async () => {
  let requestUrl;
  await listManagedPages("synthetic-user-token", {
    fetchImpl: async (url) => {
      requestUrl = String(url);
      return new Response(JSON.stringify({ data: [page] }), { status: 200 });
    },
  });
  assert.match(requestUrl, /fields=id%2Cname%2Caccess_token/);
  assert.equal(requestUrl.includes("instagram_business_account"), false);
});

test("Page identity rejects the wrong linked Instagram account", async () => {
  await assert.rejects(() => verifyPageIdentity("synthetic-page-token", { fetchImpl: async () => new Response(JSON.stringify({ id: page.id, name: page.name, instagram_business_account: { id: "wrong" } }), { status: 200 }) }), /not linked/);
});

test("Page OAuth accepts the exact Page when Instagram linkage is absent", async () => {
  const result = await verifyPageIdentity("synthetic-page-token", { requireInstagramLinkage: false, fetchImpl: async () => new Response(JSON.stringify({ id: page.id, name: page.name }), { status: 200 }) });
  assert.equal(result.page_id, page.id);
  assert.equal(Object.hasOwn(result, "instagram_professional_account_id"), false);
});

test("Page OAuth requests and validates only the bounded permission set", async () => {
  assert.deepEqual(META_PAGE_OAUTH_PERMISSIONS, ["business_management", "pages_show_list", "pages_read_engagement", "public_profile"]);
  const permissions = { data: META_PAGE_OAUTH_PERMISSIONS.map((permission) => ({ permission, status: "granted" })) };
  assert.deepEqual(validateGrantedPermissions(permissions).missing, []);
  assert.throws(() => validateGrantedPermissions({ data: [{ permission: "pages_show_list", status: "granted" }, { permission: "pages_read_engagement", status: "granted" }] }), /business_management/);
});

test("/me/permissions uses the user token and does not expose it in the URL", async () => {
  let call;
  const response = await getUserPermissions("synthetic-user-token", { fetchImpl: async (url, init) => { call = { url: String(url), auth: init.headers.Authorization }; return new Response(JSON.stringify({ data: [] }), { status: 200 }); } });
  assert.deepEqual(response.data, []);
  assert.equal(call.auth, "Bearer synthetic-user-token");
  assert.equal(call.url.includes("access_token"), false);
});

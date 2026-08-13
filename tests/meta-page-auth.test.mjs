import assert from "node:assert/strict";
import test from "node:test";
import { listManagedPages, selectOwnerPage, verifyPageIdentity } from "../feeders/meta/client.mjs";

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

test("Page identity rejects the wrong linked Instagram account", async () => {
  await assert.rejects(() => verifyPageIdentity("synthetic-page-token", { fetchImpl: async () => new Response(JSON.stringify({ id: page.id, name: page.name, instagram_business_account: { id: "wrong" } }), { status: 200 }) }), /not linked/);
});

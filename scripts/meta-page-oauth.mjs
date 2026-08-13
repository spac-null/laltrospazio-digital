import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META_API_VERSION, META_GRAPH_BASE, getUserPermissions, listManagedPages, META_PAGE_OAUTH_PERMISSIONS, selectOwnerPage, validateGrantedPermissions, verifyPageIdentity } from "../feeders/meta/client.mjs";
import { loadLocalMetaEnv, META_PAGE_TOKEN_FILE, requireMetaAppCredentials } from "./meta-env.mjs";
import { createLocalHttpsServer, META_PAGE_OAUTH_PORT, META_PAGE_REDIRECT_URI, validateOAuthCallback } from "./meta-page-oauth-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = META_PAGE_OAUTH_PORT;
const redirectUri = META_PAGE_REDIRECT_URI;
loadLocalMetaEnv(root);
let credentials;
try { credentials = requireMetaAppCredentials(); } catch (error) { console.error(`META PAGE AUTHORIZATION BLOCKED\n${error.message}`); process.exit(1); }

const state = crypto.randomBytes(32).toString("base64url");
const verifier = crypto.randomBytes(48).toString("base64url");
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
const authorization = new URL(`https://www.facebook.com/${META_API_VERSION}/dialog/oauth`);
authorization.search = new URLSearchParams({ client_id: credentials.appId, redirect_uri: redirectUri, response_type: "code", scope: META_PAGE_OAUTH_PERMISSIONS.join(","), state, code_challenge: challenge, code_challenge_method: "S256" });
console.log(`Open this URL in the owner Facebook account for L'Altro Spazio:\n\n${authorization}\n`);
console.log(`Waiting for OAuth callback on ${redirectUri} ...`);

let server;
try {
  server = createLocalHttpsServer(root, async (request, response) => {
  const url = new URL(request.url, redirectUri);
  if (url.pathname !== "/oauth2callback") { response.writeHead(404); response.end("Not found"); return; }
  try {
    const code = validateOAuthCallback(request.url, state, redirectUri);
    const tokenResponse = await fetch(`${META_GRAPH_BASE}/oauth/access_token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: credentials.appId, client_secret: credentials.appSecret, redirect_uri: redirectUri, code, code_verifier: verifier }) });
    const tokens = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokens.access_token) throw new Error("Facebook did not return a user access token");
    validateGrantedPermissions(await getUserPermissions(tokens.access_token));
    const pages = await listManagedPages(tokens.access_token);
    const page = selectOwnerPage(pages);
    await verifyPageIdentity(page.access_token);
    fs.mkdirSync(path.join(root, ".local"), { recursive: true, mode: 0o700 });
    const tokenPath = path.join(root, META_PAGE_TOKEN_FILE);
    fs.writeFileSync(tokenPath, `${JSON.stringify({ access_token: page.access_token, token_type: "page", page_id: page.id, source: "owner_oauth", installed_at: new Date().toISOString(), expires_at: null }, null, 2)}\n`, { mode: 0o600 });
    fs.chmodSync(tokenPath, 0o600);
    response.writeHead(200, { "Content-Type": "text/plain" }); response.end("Meta Page authorization complete. You may close this window.");
    console.log(`Validated Page access token stored at ${META_PAGE_TOKEN_FILE}. Token values were not printed.`);
    server.close();
  } catch (error) { response.writeHead(error.message.includes("OAuth state") || error.message.includes("authorization was denied") || error.message.includes("Missing authorization") ? 400 : 500); response.end("Meta Page authorization failed"); console.error(`Meta Page authorization failed: ${error.message}`); server.close(); process.exitCode = 1; }
  });
} catch (error) {
  console.error(`META PAGE AUTHORIZATION BLOCKED\n${error.message}`);
  process.exit(1);
}
server.listen(port, "127.0.0.1");

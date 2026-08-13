import crypto from "node:crypto";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GBP_SCOPE } from "./gbp-client.mjs";
import { loadLocalGbpEnv } from "./gbp-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalGbpEnv(root);
const localDir = path.join(root, ".local");
const tokenPath = path.join(localDir, "gbp-refresh-token.json");
const port = Number(process.env.GBP_OAUTH_PORT ?? 8787);
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("GBP AUTHORIZATION BLOCKED\nSet GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.gbp.local before authorization.");
  process.exit(1);
}

const state = crypto.randomBytes(32).toString("base64url");
const verifier = crypto.randomBytes(48).toString("base64url");
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authorization.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: GBP_SCOPE, access_type: "offline", prompt: "consent", include_granted_scopes: "true", state, code_challenge: challenge, code_challenge_method: "S256" });

console.log(`Open this URL in the Google account that manages L'Altro Spazio:\n\n${authorization}\n`);
console.log(`Waiting for OAuth callback on ${redirectUri} ...`);
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, redirectUri);
  if (url.pathname !== "/oauth2callback") { response.writeHead(404); response.end("Not found"); return; }
  if (url.searchParams.get("state") !== state) { response.writeHead(400); response.end("OAuth state mismatch"); server.close(); process.exitCode = 1; return; }
  if (url.searchParams.get("error")) { response.writeHead(400); response.end("Google authorization was denied"); console.error(`Google authorization failed: ${url.searchParams.get("error")}`); server.close(); process.exitCode = 1; return; }
  const code = url.searchParams.get("code");
  if (!code) { response.writeHead(400); response.end("Missing authorization code"); server.close(); process.exitCode = 1; return; }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: verifier }) });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.refresh_token) throw new Error(tokens.error_description ?? "No refresh token returned; retry with consent prompt.");
    fs.mkdirSync(localDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(tokenPath, `${JSON.stringify({ refresh_token: tokens.refresh_token, scope: tokens.scope, obtained_at: new Date().toISOString() }, null, 2)}\n`, { mode: 0o600 });
    response.writeHead(200, { "Content-Type": "text/plain" }); response.end("GBP authorization complete. You may close this window.");
    console.log(`Refresh token saved to ignored local path ${path.relative(root, tokenPath)}. It was not printed.`);
    server.close();
  } catch (error) { response.writeHead(500); response.end("Token exchange failed"); console.error(`OAuth token exchange failed: ${error.message}`); server.close(); process.exitCode = 1; }
});
server.listen(port, "127.0.0.1");

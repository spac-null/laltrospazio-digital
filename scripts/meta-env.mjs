import fs from "node:fs";
import path from "node:path";

export const META_ENV_FILE = ".env.meta.local";
export const META_TOKEN_FILE = ".local/meta-access-token.json";
export const META_PAGE_TOKEN_FILE = ".local/meta-page-access-token.json";
export const META_REPORT_FILE = ".local/meta-probe-report.json";
export const META_INGEST_FILE = ".local/meta-ingest.json";

export function loadLocalMetaEnv(root) {
  const file = path.join(root, META_ENV_FILE);
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

export function assertMetaTokenConfiguration() {
  if (process.env.META_SYSTEM_USER_TOKEN && process.env.META_USER_ACCESS_TOKEN) throw new Error("Configure one Meta token model, not both");
  if (!process.env.META_SYSTEM_USER_TOKEN && !process.env.META_USER_ACCESS_TOKEN) throw new Error(`No Meta token configured; future authorization uses ignored ${META_ENV_FILE} or ${META_TOKEN_FILE}`);
}

export function resolveMetaTokenPath(root) {
  return process.env.META_TOKEN_PATH || path.join(root, META_TOKEN_FILE);
}

export function readStoredMetaToken(root) {
  const file = resolveMetaTokenPath(root);
  if (!fs.existsSync(file)) throw new Error(`Meta token is not installed at ${META_TOKEN_FILE}; use npm run meta:store-token`);
  let stored;
  try { stored = JSON.parse(fs.readFileSync(file, "utf8")); } catch { throw new Error("Meta token storage is not valid JSON"); }
  if (!stored.access_token || typeof stored.access_token !== "string") throw new Error("Meta token storage is missing access_token");
  return { accessToken: stored.access_token, tokenType: stored.token_type ?? "unknown" };
}

export function requireMetaAppCredentials() {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) throw new Error(`Meta Page OAuth requires META_APP_ID and META_APP_SECRET in ${META_ENV_FILE}`);
  return { appId: process.env.META_APP_ID, appSecret: process.env.META_APP_SECRET };
}

export function readStoredPageToken(root) {
  const file = path.join(root, META_PAGE_TOKEN_FILE);
  if (!fs.existsSync(file)) throw new Error(`Meta Page access token is not installed at ${META_PAGE_TOKEN_FILE}; run npm run meta:authorize-page`);
  let stored;
  try { stored = JSON.parse(fs.readFileSync(file, "utf8")); } catch { throw new Error("Meta Page token storage is not valid JSON"); }
  if (!stored.access_token || stored.page_id !== "264601140373284") throw new Error("Meta Page token storage is missing the validated owner Page token");
  return { accessToken: stored.access_token, tokenType: stored.token_type ?? "page" };
}

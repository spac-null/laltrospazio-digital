import fs from "node:fs";
import path from "node:path";

export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const GSC_ENV_FILE = ".env.gsc.local";
export const GSC_TOKEN_FILE = ".local/gsc-refresh-token.json";
export const GSC_SNAPSHOT_FILE = ".local/gsc-snapshot.json";
export const GSC_REPORT_FILE = ".local/gsc-report.md";

export function loadLocalGscEnv(root) {
  const file = path.join(root, GSC_ENV_FILE);
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

export function requireGscCredentials() {
  const clientId = process.env.GSC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GSC_GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error(`GSC authorization requires GSC_GOOGLE_CLIENT_ID and GSC_GOOGLE_CLIENT_SECRET in ${GSC_ENV_FILE}`);
  return { clientId, clientSecret };
}

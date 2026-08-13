import fs from "node:fs";
import path from "node:path";

export const META_ENV_FILE = ".env.meta.local";
export const META_TOKEN_FILE = ".local/meta-access-token.json";

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

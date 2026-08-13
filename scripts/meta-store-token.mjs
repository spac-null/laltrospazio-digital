import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META_TOKEN_FILE, resolveMetaTokenPath } from "./meta-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chunks = [];
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) chunks.push(chunk);
const token = chunks.join("").trim();
if (!token) {
  console.error("META TOKEN STORE BLOCKED\nNo token was received on stdin.");
  process.exit(1);
}
const tokenPath = resolveMetaTokenPath(root);
fs.mkdirSync(path.dirname(tokenPath), { recursive: true, mode: 0o700 });
const payload = { access_token: token, token_type: "system_user", source: "owner_local_install", installed_at: new Date().toISOString() };
fs.writeFileSync(tokenPath, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
fs.chmodSync(tokenPath, 0o600);
console.log(`Meta system-user token stored successfully at ${path.relative(root, tokenPath) || META_TOKEN_FILE}. Token value was not printed.`);

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname);

test("token store reads stdin, writes mode 600 metadata, and never prints the token", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "meta-token-test-"));
  const tokenPath = path.join(directory, "meta-access-token.json");
  const secret = "synthetic-system-token-never-real";
  const result = await new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, "scripts/meta-store-token.mjs")], { cwd: root, env: { ...process.env, META_TOKEN_PATH: tokenPath } });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(`${secret}\n`);
  });
  assert.equal(result.code, 0);
  assert.equal(result.stdout.includes(secret), false);
  assert.equal(result.stderr.includes(secret), false);
  const stored = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  assert.equal(stored.access_token, secret);
  assert.equal(stored.token_type, "system_user");
  assert.equal(fs.statSync(tokenPath).mode & 0o777, 0o600);
});

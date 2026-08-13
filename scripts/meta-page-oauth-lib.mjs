import { execFileSync } from "node:child_process";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

export const META_PAGE_OAUTH_PORT = 8789;
export const META_PAGE_REDIRECT_URI = `https://127.0.0.1:${META_PAGE_OAUTH_PORT}/oauth2callback`;
export const META_TLS_CERT_FILE = ".local/meta-oauth-cert.pem";
export const META_TLS_KEY_FILE = ".local/meta-oauth-key.pem";

export function ensureLocalTls(root) {
  const certPath = path.join(root, META_TLS_CERT_FILE);
  const keyPath = path.join(root, META_TLS_KEY_FILE);
  fs.mkdirSync(path.dirname(keyPath), { recursive: true, mode: 0o700 });
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    try {
      execFileSync("mkcert", ["-install"], { stdio: "ignore" });
      execFileSync("mkcert", ["-cert-file", certPath, "-key-file", keyPath, "127.0.0.1"], { stdio: "ignore" });
    } catch {
      throw new Error("HTTPS TLS setup unavailable. Install mkcert with `brew install mkcert`, run `mkcert -install`, then run `mkcert -cert-file .local/meta-oauth-cert.pem -key-file .local/meta-oauth-key.pem 127.0.0.1`.");
    }
  }
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) throw new Error("HTTPS TLS certificate files are missing under .local/; run the mkcert setup commands from the previous message.");
  fs.chmodSync(keyPath, 0o600);
  return { cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath), certPath, keyPath };
}

export function createLocalHttpsServer(root, handler) {
  return https.createServer(ensureLocalTls(root), handler);
}

export function validateOAuthCallback(requestUrl, expectedState, baseUrl) {
  const url = new URL(requestUrl, baseUrl);
  if (url.searchParams.get("state") !== expectedState) throw new Error("OAuth state mismatch");
  if (url.searchParams.get("error")) throw new Error("Facebook authorization was denied");
  const code = url.searchParams.get("code");
  if (!code) throw new Error("Missing authorization code");
  return code;
}

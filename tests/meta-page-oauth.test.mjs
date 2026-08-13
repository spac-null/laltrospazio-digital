import assert from "node:assert/strict";
import test from "node:test";
import { META_PAGE_REDIRECT_URI, META_TLS_CERT_FILE, META_TLS_KEY_FILE, validateOAuthCallback } from "../scripts/meta-page-oauth-lib.mjs";

test("Meta Page OAuth uses the exact HTTPS redirect URI", () => {
  assert.equal(META_PAGE_REDIRECT_URI, "https://127.0.0.1:8789/oauth2callback");
  assert.equal(META_PAGE_REDIRECT_URI.startsWith("http://"), false);
  assert.equal(META_TLS_CERT_FILE.startsWith(".local/"), true);
  assert.equal(META_TLS_KEY_FILE.startsWith(".local/"), true);
});

test("Page OAuth callback requires matching state and code", () => {
  assert.equal(validateOAuthCallback("/oauth2callback?state=ok&code=authorization-code", "ok", "http://127.0.0.1:8789"), "authorization-code");
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=bad&code=code", "ok", "http://127.0.0.1:8789"), /state mismatch/);
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=ok&error=access_denied", "ok", "http://127.0.0.1:8789"), /authorization was denied/);
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=ok", "ok", "http://127.0.0.1:8789"), /Missing authorization code/);
});

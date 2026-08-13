import assert from "node:assert/strict";
import test from "node:test";
import { validateOAuthCallback } from "../scripts/meta-page-oauth-lib.mjs";

test("Page OAuth callback requires matching state and code", () => {
  assert.equal(validateOAuthCallback("/oauth2callback?state=ok&code=authorization-code", "ok", "http://127.0.0.1:8789"), "authorization-code");
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=bad&code=code", "ok", "http://127.0.0.1:8789"), /state mismatch/);
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=ok&error=access_denied", "ok", "http://127.0.0.1:8789"), /authorization was denied/);
  assert.throws(() => validateOAuthCallback("/oauth2callback?state=ok", "ok", "http://127.0.0.1:8789"), /Missing authorization code/);
});

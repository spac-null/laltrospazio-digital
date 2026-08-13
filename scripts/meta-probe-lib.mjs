import { listInstagramMedia, listPagePosts, MetaError, verifyPageIdentity } from "../feeders/meta/client.mjs";
import { normalizeFacebookPosts, normalizeInstagramMedia } from "../feeders/meta/normalize.mjs";
import { makeFeederHealth } from "./feeder-health.mjs";

function safeError(error, surface) {
  const code = error instanceof MetaError ? error.code : "unknown_error";
  if (surface === "instagram" && code === "permission_denied") return "SYSTEM_USER_INSTAGRAM_UNSUPPORTED_OR_UNAUTHORIZED";
  return code;
}

export async function runMetaProbe({ accessToken, fetchImpl = fetch, checkedAt = new Date().toISOString() }) {
  const report = {
    source: "meta",
    visibility: "public_candidate",
    token_type: "system_user",
    page_identity_verified: false,
    instagram_linkage_verified: false,
    page_read: { ok: false, records: 0 },
    instagram_read: { ok: false, records: 0 },
    errors: [],
    feeder_health: null,
    system_user_viability: "UNDETERMINED",
    checked_at: checkedAt,
  };
  try {
    await verifyPageIdentity(accessToken, { fetchImpl });
    report.page_identity_verified = true;
    report.instagram_linkage_verified = true;
  } catch (error) {
    report.errors.push({ surface: "identity", error_class: safeError(error, "identity") });
  }
  if (report.page_identity_verified) {
    try {
      const result = await listPagePosts(accessToken, { fetchImpl, maxPages: 1 });
      normalizeFacebookPosts(result.records, { fetchedAt: checkedAt });
      report.page_read = { ok: true, records: result.records.length };
    } catch (error) {
      report.errors.push({ surface: "page", error_class: safeError(error, "page") });
    }
    try {
      const result = await listInstagramMedia(accessToken, { fetchImpl, maxPages: 1 });
      normalizeInstagramMedia(result.records, { fetchedAt: checkedAt });
      report.instagram_read = { ok: true, records: result.records.length };
    } catch (error) {
      report.errors.push({ surface: "instagram", error_class: safeError(error, "instagram") });
    }
  }
  const totalRecords = report.page_read.records + report.instagram_read.records;
  report.feeder_health = makeFeederHealth({ source: "meta", visibility: "public_candidate", authenticationStatus: "authenticated", lastAttempt: checkedAt, lastSuccess: report.page_read.ok || report.instagram_read.ok ? checkedAt : null, freshness: report.page_read.ok || report.instagram_read.ok ? "fresh" : "failed", recordsReceived: totalRecords, conflictsFound: [] });
  if (report.page_read.ok && report.instagram_read.ok) report.system_user_viability = "YES";
  else if (report.page_read.ok && report.errors.some((error) => error.error_class === "SYSTEM_USER_INSTAGRAM_UNSUPPORTED_OR_UNAUTHORIZED")) report.system_user_viability = "NO: Instagram capability unavailable for this system-user token";
  return report;
}

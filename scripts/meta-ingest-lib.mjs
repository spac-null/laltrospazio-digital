import { listInstagramMedia, listPagePosts, MetaError, verifyInstagramLinkage, verifyPageIdentity } from "../feeders/meta/client.mjs";
import { normalizeFacebookPosts, normalizeInstagramMedia } from "../feeders/meta/normalize.mjs";
import { makeFeederHealth } from "./feeder-health.mjs";

export const DEFAULT_INGEST_MAX_PAGES = 1;
export const MAX_ALLOWED_INGEST_PAGES = 3;

function safeError(error) {
  return error instanceof MetaError ? error.code : "unknown_error";
}

function boundMaxPages(requested) {
  const value = Number.isFinite(requested) ? Math.trunc(requested) : DEFAULT_INGEST_MAX_PAGES;
  return Math.min(Math.max(value, 1), MAX_ALLOWED_INGEST_PAGES);
}

function surfaceHealth(source, { ok, records, error, fetchedAt }) {
  return makeFeederHealth({
    source,
    visibility: "public_candidate",
    authenticationStatus: "authenticated",
    lastAttempt: fetchedAt,
    lastSuccess: ok ? fetchedAt : null,
    freshness: ok ? "fresh" : "failed",
    lastError: error ?? null,
    recordsReceived: records,
  });
}

export async function runMetaIngest({
  systemUserToken,
  pageToken,
  fetchImpl = fetch,
  fetchedAt = new Date().toISOString(),
  maxPages = DEFAULT_INGEST_MAX_PAGES,
} = {}) {
  const boundedMaxPages = boundMaxPages(maxPages);
  const report = {
    source: "meta",
    visibility: "public_candidate",
    fetched_at: fetchedAt,
    pagination: { max_pages: boundedMaxPages, max_pages_allowed: MAX_ALLOWED_INGEST_PAGES },
    token_health: { system_user: "unknown", page: "unknown" },
    page_identity_verified: false,
    instagram_linkage_verified: false,
    facebook: { ok: false, records: [], truncated: false },
    instagram: { ok: false, records: [], truncated: false },
    errors: [],
    feeder_health: null,
  };

  try {
    await verifyPageIdentity(pageToken, { fetchImpl, requireInstagramLinkage: false });
    report.page_identity_verified = true;
  } catch (error) {
    report.errors.push({ surface: "identity", error_class: safeError(error) });
  }
  try {
    await verifyInstagramLinkage(systemUserToken, { fetchImpl });
    report.instagram_linkage_verified = true;
  } catch (error) {
    report.errors.push({ surface: "instagram_linkage", error_class: safeError(error) });
  }

  if (report.page_identity_verified) {
    try {
      const { records, truncated } = await listPagePosts(pageToken, { fetchImpl, maxPages: boundedMaxPages });
      report.facebook = { ok: true, records: normalizeFacebookPosts(records, { fetchedAt }).records, truncated };
    } catch (error) {
      report.errors.push({ surface: "facebook", error_class: safeError(error) });
    }
    try {
      const { records, truncated } = await listInstagramMedia(systemUserToken, { fetchImpl, maxPages: boundedMaxPages });
      report.instagram = { ok: true, records: normalizeInstagramMedia(records, { fetchedAt }).records, truncated };
    } catch (error) {
      report.errors.push({ surface: "instagram", error_class: safeError(error) });
    }
  }

  const facebookError = report.errors.find((error) => error.surface === "facebook")?.error_class ?? null;
  const instagramError = report.errors.find((error) => error.surface === "instagram")?.error_class ?? null;
  report.feeder_health = {
    facebook: surfaceHealth("meta.facebook", { ok: report.facebook.ok, records: report.facebook.records.length, error: facebookError, fetchedAt }),
    instagram: surfaceHealth("meta.instagram", { ok: report.instagram.ok, records: report.instagram.records.length, error: instagramError, fetchedAt }),
  };
  report.total_records = report.facebook.records.length + report.instagram.records.length;
  return report;
}

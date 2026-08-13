import { makeFeederHealth } from "../../scripts/feeder-health.mjs";

export const GSC_SOURCE = "google_search_console";
export const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const CANONICAL_PROPERTIES = Object.freeze([
  "https://www.altrospazio.org/",
  "sc-domain:altrospazio.org",
]);

const DIMENSION_FIELDS = new Set(["query", "page", "date", "device", "country"]);

export function findCanonicalProperty(properties = []) {
  const matches = properties.filter((property) => CANONICAL_PROPERTIES.includes(property.siteUrl));
  if (matches.length === 0) throw new Error("no canonical Search Console property was found");
  if (matches.length > 1) throw new Error("multiple canonical Search Console properties were found");
  return matches[0];
}

export function normalizeProperties(response, { fetchedAt } = {}) {
  if (!fetchedAt) throw new Error("fetchedAt is required for Search Console normalization");
  const properties = (response?.siteEntry ?? []).map((property) => ({
    source: GSC_SOURCE,
    visibility: "private",
    site_url: property.siteUrl ?? null,
    permission_level: property.permissionLevel ?? null,
    fetched_at: fetchedAt,
  }));
  return {
    source: GSC_SOURCE,
    visibility: "private",
    fetched_at: fetchedAt,
    properties,
    health: makeFeederHealth({ source: GSC_SOURCE, visibility: "private", authenticationStatus: "authenticated", lastAttempt: fetchedAt, lastSuccess: fetchedAt, freshness: "fresh", recordsReceived: properties.length }),
  };
}

export function normalizeSearchAnalytics(response, { property, requested, fetchedAt } = {}) {
  if (!property || !fetchedAt) throw new Error("property and fetchedAt are required for Search Console analytics normalization");
  const dimensions = requested?.dimensions ?? [];
  if (dimensions.some((dimension) => !DIMENSION_FIELDS.has(dimension))) throw new Error("unsupported Search Console dimension");
  const rows = (response?.rows ?? []).map((row) => ({
    source: GSC_SOURCE,
    visibility: "private",
    property,
    fetched_at: fetchedAt,
    dimensions: Object.fromEntries(dimensions.map((dimension, index) => [dimension, row.keys?.[index] ?? null])),
    metrics: {
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      average_position: row.position ?? null,
    },
  }));
  return {
    source: GSC_SOURCE,
    visibility: "private",
    property,
    fetched_at: fetchedAt,
    requested: { ...requested, dimensions },
    response_aggregation_type: response?.responseAggregationType ?? null,
    rows,
    health: makeFeederHealth({ source: GSC_SOURCE, visibility: "private", authenticationStatus: "authenticated", lastAttempt: fetchedAt, lastSuccess: fetchedAt, freshness: "fresh", recordsReceived: rows.length }),
  };
}

export function normalizeSitemaps(response, { property, fetchedAt } = {}) {
  if (!property || !fetchedAt) throw new Error("property and fetchedAt are required for sitemap normalization");
  const sitemaps = (response?.sitemap ?? []).map((sitemap) => ({
    path: sitemap.path ?? null,
    last_submitted: sitemap.lastSubmitted ?? null,
    last_downloaded: sitemap.lastDownloaded ?? null,
    is_pending: sitemap.isPending ?? null,
    is_sitemap: sitemap.isSitemap ?? null,
    errors: sitemap.errors ?? 0,
    warnings: sitemap.warnings ?? 0,
    type: sitemap.type ?? null,
  }));
  return {
    source: GSC_SOURCE,
    visibility: "private",
    property,
    fetched_at: fetchedAt,
    sitemaps,
    health: makeFeederHealth({ source: GSC_SOURCE, visibility: "private", authenticationStatus: "authenticated", lastAttempt: fetchedAt, lastSuccess: fetchedAt, freshness: "fresh", recordsReceived: sitemaps.length }),
  };
}

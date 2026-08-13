import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listSites, listSitemaps, querySearchAnalytics, refreshAccessToken } from "../feeders/google-search-console/client.mjs";
import { normalizeProperties, normalizeSearchAnalytics, normalizeSitemaps, selectCanonicalProperty } from "../feeders/google-search-console/normalize.mjs";
import { GSC_REPORT_FILE, GSC_SCOPE, GSC_SNAPSHOT_FILE, loadLocalGscEnv, requireGscCredentials, GSC_TOKEN_FILE } from "./gsc-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiBase = "https://www.googleapis.com";
loadLocalGscEnv(root);

function readRefreshToken() {
  const tokenPath = path.join(root, GSC_TOKEN_FILE);
  if (!fs.existsSync(tokenPath)) throw new Error(`GSC refresh token is missing at ${GSC_TOKEN_FILE}; run npm run gsc:authorize first.`);
  try {
    const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    if (!token.refresh_token) throw new Error("refresh_token is missing");
    return token.refresh_token;
  } catch (error) {
    throw new Error(`GSC refresh token file is invalid: ${error.message}`);
  }
}

function isoDate(date) { return date.toISOString().slice(0, 10); }

function dateRange() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

const sumBy = (rows, key) => rows.reduce((sum, row) => sum + Number(row.metrics[key] ?? 0), 0);
const percentage = (value, total) => total ? `${((value / total) * 100).toFixed(1)}%` : "n/a";
const table = (headers, rows) => [
  `| ${headers.join(" | ")} |`,
  `| ${headers.map(() => "---").join(" | ")} |`,
  ...rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("|", "\\|")).join(" | ")} |`),
].join("\n");

function report(snapshot) {
  const rows = snapshot.analytics.rows;
  const totalClicks = sumBy(rows, "clicks");
  const totalImpressions = sumBy(rows, "impressions");
  const aggregate = (field, limit = 10) => {
    const groups = new Map();
    for (const row of rows) {
      const value = row.dimensions[field] ?? "(unknown)";
      const current = groups.get(value) ?? { value, clicks: 0, impressions: 0 };
      current.clicks += row.metrics.clicks;
      current.impressions += row.metrics.impressions;
      groups.set(value, current);
    }
    return [...groups.values()].sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks).slice(0, limit);
  };
  const queries = aggregate("query");
  const pages = aggregate("page");
  const devices = aggregate("device");
  const countries = aggregate("country");
  const opportunities = queries.filter((item) => item.impressions >= 10 && item.clicks === 0).slice(0, 10);
  const brandedTerms = ["altro", "spazio", "l'altro", "laltro"];
  const branded = rows.filter((row) => brandedTerms.some((term) => (row.dimensions.query ?? "").toLowerCase().includes(term)));
  const daily = aggregate("date", 1000).sort((a, b) => a.value.localeCompare(b.value));
  const midpoint = Math.ceil(daily.length / 2);
  const firstHalf = daily.slice(0, midpoint);
  const secondHalf = daily.slice(midpoint);
  const enoughForTrend = totalImpressions >= 20 && firstHalf.length > 0 && secondHalf.length > 0;
  const trend = enoughForTrend ? `${firstHalf.reduce((sum, item) => sum + item.impressions, 0)} impressions in the first period versus ${secondHalf.reduce((sum, item) => sum + item.impressions, 0)} in the second period` : "insufficient volume for a reliable direction";

  return `# Private Search Console Report

Generated: ${snapshot.fetched_at}
Property: ${snapshot.property.site_url}
Permission: ${snapshot.property.permission_level ?? "not reported"}
Period: ${snapshot.analytics.requested.startDate} to ${snapshot.analytics.requested.endDate}

## DATA

- Total clicks: ${totalClicks}
- Total impressions: ${totalImpressions}
- Aggregate CTR: ${percentage(totalClicks, totalImpressions)}
- Rows returned: ${rows.length}
- Sitemaps returned: ${snapshot.sitemaps.sitemaps.length}
- Branded-query rows using altro, spazio, or laltro: ${branded.length} (${percentage(branded.reduce((sum, row) => sum + row.metrics.impressions, 0), totalImpressions)} of impressions)

### Highest-impression queries

${table(["Query", "Impressions", "Clicks", "CTR"], queries.map((item) => [item.value, item.impressions, item.clicks, percentage(item.clicks, item.impressions)]))}

### Pages receiving search traffic

${table(["Page", "Impressions", "Clicks"], pages.map((item) => [item.value, item.impressions, item.clicks]))}

### Device mix

${table(["Device", "Impressions", "Clicks"], devices.map((item) => [item.value, item.impressions, item.clicks]))}

### Country mix

${table(["Country", "Impressions", "Clicks"], countries.map((item) => [item.value, item.impressions, item.clicks]))}

## OBSERVATION

- High-impression, zero-click queries (minimum 10 impressions): ${opportunities.length ? opportunities.map((item) => `'${item.value}' (${item.impressions})`).join(", ") : "none identified in this sample"}.
- Recent direction: ${trend}.

## INFERENCE

- Branded versus non-branded classification is heuristic, based only on query text containing the venue name tokens. It is not an attribution claim.
- A zero-click opportunity is a prioritization signal, not proof that a title or description is wrong.
- ${totalImpressions < 20 ? "The sample is too small for dependable conclusions." : "The sample is large enough for directional review, but not causal conclusions."}

## RECOMMENDATION

- Review the highest-impression non-branded queries and their landing pages before changing copy.
- Confirm that the canonical homepage, menu, visit, and event routes remain crawlable.
- Repeat this private snapshot on a consistent cadence; do not publish query or user-discovery data.
`;
}

let accessibleProperties = [];

try {
  const { clientId, clientSecret } = requireGscCredentials();
  const access = await refreshAccessToken({ clientId, clientSecret, refreshToken: readRefreshToken() });
  const fetchedAt = new Date().toISOString();
  const propertiesResponse = await listSites(apiBase, { accessToken: access.access_token });
  const normalizedProperties = normalizeProperties(propertiesResponse, { fetchedAt });
  accessibleProperties = normalizedProperties.properties;
  const property = selectCanonicalProperty(normalizedProperties.properties);
  const range = dateRange();
  const requested = { ...range, dimensions: ["query", "page", "device", "country", "date"], type: "web", rowLimit: 25000, aggregationType: "auto" };
  const [sitemapsResponse, analyticsResponse] = await Promise.all([
    listSitemaps(apiBase, property.site_url, { accessToken: access.access_token }),
    querySearchAnalytics(apiBase, property.site_url, requested, { accessToken: access.access_token }),
  ]);
  const snapshot = {
    source: "google_search_console",
    visibility: "private",
    fetched_at: fetchedAt,
    scope: GSC_SCOPE,
    property,
    properties: normalizedProperties,
    sitemaps: normalizeSitemaps(sitemapsResponse, { property: property.site_url, fetchedAt }),
    analytics: normalizeSearchAnalytics(analyticsResponse, { property: property.site_url, requested, fetchedAt }),
  };
  fs.mkdirSync(path.join(root, ".local"), { recursive: true, mode: 0o700 });
  fs.writeFileSync(path.join(root, GSC_SNAPSHOT_FILE), `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(path.join(root, GSC_SNAPSHOT_FILE), 0o600);
  fs.writeFileSync(path.join(root, GSC_REPORT_FILE), report(snapshot), { mode: 0o600 });
  fs.chmodSync(path.join(root, GSC_REPORT_FILE), 0o600);
  console.log(`GSC ACCOUNT/PROPERTY DISCOVERY COMPLETE\nProperty: ${property.site_url}\nPermission: ${property.permission_level ?? "not reported"}\nSitemaps: ${snapshot.sitemaps.sitemaps.length}\nAnalytics rows: ${snapshot.analytics.rows.length}\nPrivate snapshot: ${GSC_SNAPSHOT_FILE}\nPrivate report: ${GSC_REPORT_FILE}`);
} catch (error) {
  console.error(`GSC PROBE FAILED\n${error.message}`);
  if (error.message === "no canonical Search Console property was found") {
    console.error("ACCESSIBLE SEARCH CONSOLE PROPERTIES");
    if (accessibleProperties.length === 0) {
      console.error("- none returned by sites.list");
    } else {
      for (const property of accessibleProperties) {
        console.error(`- siteUrl: ${property.site_url ?? "(missing)"}`);
        console.error(`  permissionLevel: ${property.permission_level ?? "(not reported)"}`);
      }
    }
  }
  if (error.code === "permission_or_approval") console.error("Check Search Console API enablement, OAuth scope, property ownership, and Google project access.");
  if (error.code === "quota") console.error("Google reports quota exhaustion or zero quota; wait for project/API access or reduce request volume.");
  process.exitCode = 1;
}

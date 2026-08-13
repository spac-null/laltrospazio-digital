import assert from "node:assert/strict";
import test from "node:test";
import { findCanonicalProperty, normalizeProperties, normalizeSearchAnalytics, normalizeSitemaps, selectCanonicalProperty, GSC_SCOPE } from "../feeders/google-search-console/normalize.mjs";
import { gscRequest } from "../feeders/google-search-console/client.mjs";

const fetchedAt = "2026-08-13T12:00:00Z";

test("finds the canonical URL-prefix Search Console property", () => {
  const property = findCanonicalProperty([{ siteUrl: "https://example.test/" }, { siteUrl: "https://www.altrospazio.org/", permissionLevel: "siteOwner" }]);
  assert.equal(property.permissionLevel, "siteOwner");
  assert.equal(GSC_SCOPE, "https://www.googleapis.com/auth/webmasters.readonly");
});

test("rejects missing canonical properties and prefers the domain property", () => {
  assert.throws(() => findCanonicalProperty([]), /no canonical/);
  assert.equal(selectCanonicalProperty([{ siteUrl: "https://www.altrospazio.org/" }, { siteUrl: "sc-domain:altrospazio.org" }]).siteUrl, "sc-domain:altrospazio.org");
  assert.equal(selectCanonicalProperty([{ site_url: "https://www.altrospazio.org/" }, { site_url: "sc-domain:altrospazio.org" }]).site_url, "sc-domain:altrospazio.org");
});

test("normalizes private site, analytics, and sitemap snapshots", () => {
  const sites = normalizeProperties({ siteEntry: [{ siteUrl: "https://www.altrospazio.org/", permissionLevel: "siteOwner" }] }, { fetchedAt });
  const analytics = normalizeSearchAnalytics({ responseAggregationType: "auto", rows: [{ keys: ["evento", "https://www.altrospazio.org/eventi", "2026-08-12", "mobile", "ITA"], clicks: 4, impressions: 40, ctr: 0.1, position: 3.2 }] }, { property: "https://www.altrospazio.org/", requested: { dimensions: ["query", "page", "date", "device", "country"] }, fetchedAt });
  const sitemaps = normalizeSitemaps({ sitemap: [{ path: "https://www.altrospazio.org/sitemap.xml", isPending: false, errors: 0, warnings: 0 }] }, { property: "https://www.altrospazio.org/", fetchedAt });
  assert.equal(sites.visibility, "private");
  assert.equal(analytics.rows[0].metrics.average_position, 3.2);
  assert.equal(analytics.rows[0].dimensions.country, "ITA");
  assert.equal(sitemaps.sitemaps[0].path, "https://www.altrospazio.org/sitemap.xml");
});

test("Search Console transport rejects mutation methods", async () => {
  for (const method of ["PUT", "PATCH", "DELETE"]) await assert.rejects(() => gscRequest("https://example.test", { accessToken: "redacted", method }), /mutation method/);
});

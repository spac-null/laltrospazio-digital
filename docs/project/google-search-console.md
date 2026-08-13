# Google Search Console Connector

This connector is read-only and private. It normalizes Search Console property
discovery, Search Analytics rows, and sitemap status without exposing them to
the public website.

## API boundary

The official Search Console API supports:

- `GET /webmasters/v3/sites` for accessible properties.
- `POST /webmasters/v3/sites/{siteUrl}/searchAnalytics/query` for read-only
  analytics queries. The HTTP method is POST because the endpoint accepts a
  query body; it is not a mutation.
- `GET /webmasters/v3/sites/{siteUrl}/sitemaps` for sitemap status.

The minimum OAuth scope is
`https://www.googleapis.com/auth/webmasters.readonly`. This is separate from
GBP's `business.manage` scope. A future authorization command must request
only the Search Console scope and store its refresh token separately.

The normalized property must match either the URL-prefix property
`https://www.altrospazio.org/` or the domain property
`sc-domain:altrospazio.org`. Search data is private operational intelligence:
it is suitable for trend and discrepancy reports, never for public content.

Search Analytics is not real-time. Recent data can take roughly two to three
days to become available, so a future feeder should retain the last valid
snapshot when a query is delayed or fails.

## Owner setup checklist

Owner actions:

1. In Search Console, confirm that the Google account managing L'Altro Spazio
   has owner/full access to `https://www.altrospazio.org/` or
   `sc-domain:altrospazio.org`.
2. If the property is not already verified, complete Google's property
   verification flow. Do not create a second property merely for this
   connector.
3. When engineering provides the local authorization URL, sign in with that
   same managing account and approve the read-only Search Console scope.

Engineering actions:

1. Enable the Search Console API in the Trident Google Cloud project, or in a
   separately approved integration project if Google requires separation.
2. Configure the OAuth consent screen and a local OAuth client for this scope.
   If the app remains External/Testing, add the managing account as a test
   user and treat the refresh token as temporary.
3. Store client configuration and the refresh token only in ignored local
   files. Never commit or print credentials.
4. Run property discovery, select the canonical property, then query a bounded
   date range and save only normalized private snapshots.

## Normalized output

Analytics rows contain only normalized dimensions (`query`, `page`, `date`,
`device`, `country`) and metrics (`clicks`, `impressions`, `ctr`,
`average_position`). Sitemap records contain status and error/warning counts.
Every record is marked `visibility: private` and carries `fetched_at`.

References: [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Sites list](https://developers.google.com/webmaster-tools/v1/sites/list), [Sitemaps list](https://developers.google.com/webmaster-tools/v1/sitemaps/list), and [OAuth 2.0 for web server applications](https://developers.google.com/identity/protocols/oauth2/web-server).

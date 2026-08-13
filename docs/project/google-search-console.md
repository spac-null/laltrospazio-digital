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

## Trident OAuth client strategy

Use the existing Trident project (`gen-lang-client-0047032066`) but create a
separate Web application client named `L'Altro Spazio GSC Local Connector`.
This keeps client configuration and token rotation operationally separate from
the GBP connector while retaining the same Google Cloud project. The client
must use the loopback redirect
`http://127.0.0.1:8788/oauth2callback`.

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

1. In Google Cloud Console, select project `Trident`, then APIs & Services >
   Library > enable the Google Search Console API.
2. In Google Auth Platform > Branding, keep the existing external consent
   configuration and verify the app name/support information.
3. In Google Auth Platform > Audience, add the managing Google account as a
   test user if the app is still External/Testing. Testing-mode refresh tokens
   are temporary and are not unattended production credentials.
4. In Google Auth Platform > Clients, create a Web application client named
   `L'Altro Spazio GSC Local Connector` and add exactly
   `http://127.0.0.1:8788/oauth2callback` as an authorized redirect URI.
5. Put the new client values in the ignored local file described below, then
   run `npm run gsc:authorize`. The authorization URL must show only
   `https://www.googleapis.com/auth/webmasters.readonly`.
6. Store the client configuration and the refresh token only in ignored local
   files. Never commit or print credentials.
7. Run property discovery, select the canonical property, then query a bounded
   date range and save only normalized private snapshots.

The owner should not paste client secrets, access tokens, or refresh tokens
into chat or repository files.

## Local files and commands

Create `.env.gsc.local` with mode `600` containing only:

```text
GSC_GOOGLE_CLIENT_ID=...
GSC_GOOGLE_CLIENT_SECRET=...
```

The commands use `.local/gsc-refresh-token.json`, `.local/gsc-snapshot.json`,
and `.local/gsc-report.md`; all are ignored and the latter two are private
analytics output. Run:

```sh
npm run gsc:authorize
npm run gsc:probe
```

The probe performs GET requests for properties/sitemaps and the official POST
Search Analytics query endpoint. It has no mutation methods. It prefers
`sc-domain:altrospazio.org` and falls back to
`https://www.altrospazio.org/`.

## Normalized output

Analytics rows contain only normalized dimensions (`query`, `page`, `date`,
`device`, `country`) and metrics (`clicks`, `impressions`, `ctr`,
`average_position`). Sitemap records contain status and error/warning counts.
Every record is marked `visibility: private` and carries `fetched_at`.

References: [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Sites list](https://developers.google.com/webmaster-tools/v1/sites/list), [Sitemaps list](https://developers.google.com/webmaster-tools/v1/sitemaps/list), and [OAuth 2.0 for web server applications](https://developers.google.com/identity/protocols/oauth2/web-server).

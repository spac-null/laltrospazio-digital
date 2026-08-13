# Meta Integration Feasibility

This is an implementation plan, not an authorization or an active integration.
No Meta account, app, token, webhook, or profile change has been performed.
Permissions and review rules are version-dependent and must be rechecked in
Meta's dashboard when authorization is actually provisioned.

## Adapter status

The credential-free adapter at `feeders/meta/normalize.mjs` accepts synthetic
Instagram media and Facebook Page post records and emits `public_candidate`
source records. It preserves network, source ID, permalink, timestamp,
caption/text, media metadata, deterministic event/notice signals, provenance,
and fetch time. Candidate records cannot cross the public-data boundary or
become canonical events without deterministic validation and owner approval.

No Meta request, token, webhook, publication call, or profile write has been
implemented.

## Verified first-party assets

Owner/API proof confirmed the following assets. These are configuration
identifiers, not credentials:

- Business Portfolio `1760245797391981`, L'Altro Spazio, business verified.
- Facebook Page `264601140373284`, L'Altro Spazio.
- Instagram professional account `17841402902868891`, `@laltrospazio`.
- The Page's `instagram_business_account` points to that exact Instagram ID.

The read-only proof succeeded with `pages_show_list`,
`pages_read_engagement`, `instagram_basic`, and `public_profile`. No broader
permission is part of the connector.

An exposed temporary Page token from copied Graph API Explorer output is
compromised. It must not be stored, inspected, reused, or requested. The owner
is revoking that development authorization. No token from chat, Explorer
output, URLs, logs, or reports is valid project configuration.

## Required account and app prerequisites

- Instagram must be a Professional account (Business or Creator) and be linked
  to the Facebook Page used for the integration.
- The integration needs the Instagram professional account ID and Facebook Page
  ID. These are not safely inferred from public profile URLs.
- A Meta app, OAuth authorization by an authorized owner, and server-side token
  storage are required. No token belongs in the repository, browser bundle, or
  chat.
- Reading Instagram media, reading Page content, and publishing to either
  surface are separate capabilities. Request the minimum permissions shown by
  Meta for the selected API version and endpoints. The commonly encountered
  read permissions include `instagram_basic`, `pages_show_list`, and
  `pages_read_engagement`; confirm in the current app dashboard whether Page
  post reads require an additional Page-content permission. Do not request
  `instagram_content_publish` or `pages_manage_posts` for this read-only
  phase.

## Asset discovery checklist

These facts are not verified yet and must come from owner-side Meta UI. IDs
must not be inferred from public URLs.

1. In Meta Business Suite, open Settings / Business settings and inspect
   Accounts > Pages. Locate the Page for `laltrospazio.bologna`, record its
   Page ID, the owning/managing Business Portfolio, and whether Jascha has
   full control or only task access.
2. Inspect Accounts > Instagram accounts. Locate `laltrospazio`, record its
   professional-account ID, account type (Business or Creator), linked Page,
   owning/managing Business Portfolio, and Jascha's access level.
3. In Instagram, open Edit profile > Page under Public business information
   and confirm the linked Page. The alternative Facebook path is Page profile
   > Settings & privacy > Settings > Permissions > Linked accounts > Instagram.
4. In Business settings > People, confirm that Jascha's account has full
   control of the relevant Page, Instagram asset, and app/portfolio. Record
   any different owner or administrator as an owner decision, not as an
   engineering assumption.

Meta's own help documentation confirms that the Instagram account must be
Professional to connect to a Page, and that Page access is required to make
the connection. Professional accounts can be Business or Creator.

## API model and permissions

There are two current Instagram API login models:

### Preferred first probe: Facebook Login for Business

This is the practical choice because the target includes both the Facebook
Page and its linked Instagram professional account. It requires a linked
Facebook Page and Professional Instagram account. The initial least-privilege
read request should be validated in the selected API version with:

- `public_profile` as the baseline Facebook Login permission.
- `pages_show_list` to discover the Pages the authorized person can access.
- `pages_read_engagement` for eligible Page content/engagement reads.
- `instagram_basic` for the linked Instagram professional account's basic
  information and media reads through the Facebook Login model.

Do not request `business_management`, `pages_manage_posts`,
`instagram_content_publish`, `instagram_manage_messages`, comment-management,
ads, or messaging permissions. `pages_read_user_content` is not needed for
the first goal of reading the Page's own posts; request it only if a later,
explicit requirement is to read user-generated Page content.

The flow uses a Facebook user access token, then a Page access token for Page
Graph API calls. The token response is handled in memory, with only the
minimum reviewed token material stored in ignored local secret storage. Token
expiry, revocation, and reauthorization are health states, not reasons to
overwrite canonical content.

### Instagram Login: not the first combined probe

Instagram Login uses the newer `instagram_business_basic` scope for
Professional Instagram accounts and does not require a linked Facebook Page.
It is appropriate for an Instagram-only connector, but it does not replace
the separate Facebook Login/Page token path needed to read Facebook Page
posts. The older Instagram Login scope names were deprecated; do not use the
old `business_basic` spelling. Do not combine both login models until a real
capability requires it.

Access level is distinct from OAuth scope. App/admin roles can test during
development when the account and assets are assigned to the app. For a
first-party app serving only assets the owner controls, Meta's current model
may allow Standard Access once the assets are added; Advanced Access/App Review
is relevant if the app serves assets outside the app owner's control or the
dashboard requires review for the selected permission. Confirm the actual
status per permission in App Dashboard before production use.

## Unattended token model decision

### A. System-user access token

For a single verified Business Portfolio that owns both target assets, a
Business Settings system user is the preferred unattended model to validate
first. The owner would create a least-privilege system user, assign the
dedicated app to it, assign only the Page and Instagram assets with read tasks,
and generate a token with only the already-proven read permissions. The token
belongs to the business integration rather than Jascha's browser session, is
server-side only, and can be revoked by removing the asset assignment or
revoking the token.

The exact compatibility of a system-user token with the current Instagram
media edge and `instagram_basic` must be proven with a fresh token. Meta's
current documentation and dashboard are authoritative here; do not assume a
system-user token is valid merely because the business owns the assets.

### B. Long-lived user token plus Page token

This is the already-proven development path: an authorized user token discovers
the Page and linked Instagram account, then a Page token reads Page posts and
Instagram media. It is simple and has clear owner consent, but it couples
unattended access to a human authorization and token lifecycle. It is the
fallback if Meta does not permit the required read edges with the system-user
configuration.

Recommendation: attempt A after owner setup, with only the four proven read
permissions and exact asset assignments. Retain B as a controlled fallback,
not as a browser-persisted credential. In either model, use a single server-side
secret, monitor expiry/revocation, and fail closed while retaining the last
valid normalized candidate snapshot.

## App strategy

No suitable existing project-owned Meta app has been identified. If the owner
checklist finds none, create a dedicated first-party Business app named
`L'Altro Spazio Digital System` under the owning Business Portfolio. Do not
reuse a personal, agency, or unrelated app. Add only Facebook Login for
Business for the first read-only probe, configure the local callback when
engineering supplies it, and leave all publishing/products disabled.

Owner app steps:

1. Open Meta for Developers > My Apps and verify whether an existing app is
   clearly owned by L'Altro Spazio.
2. If none exists, choose Create App > Business, use the dedicated name, and
   select the owning Business Portfolio.
3. Add/configure Facebook Login for Business and add the owner/developer as an
   app role. Do not request publication, ads, messaging, or comment scopes.
4. Keep the app in Development mode until the read-only probe is proven.
   Enable Live mode or request review only after a concrete production need.

## Read-only first probe

After owner confirmation and app authorization, the first connector should:

1. Obtain a user token with the selected read scopes.
2. Discover Pages and match the owner-confirmed Page ID; do not match only by
   display name or public URL.
3. Validate the linked Instagram professional-account ID independently through
   the system-user Instagram path; Page OAuth does not require the linkage
   field or an Instagram permission.
4. Read the Page's own post records and the Instagram media edge with only
   IDs, timestamps, captions/messages, permalinks, media type, and permitted
   media URLs.
5. Normalize into the existing Meta source-record shape and write an ignored
   private/candidate snapshot. Never write Page/Instagram content or tokens
   back to Meta.

The first output is a source inventory. It must not classify every post as an
event, and no record can become a published notice/event without the existing
candidate validation and owner-approval workflow.

## Real local ingestion (implemented)

Real dual-auth ingestion is implemented as `npm run meta:ingest`. It reuses the
existing `feeders/meta/client.mjs` and `feeders/meta/normalize.mjs` boundary and
does not duplicate the probe: it verifies Page identity with the Page token,
independently verifies Instagram linkage with the system-user token, then reads
Facebook Page posts with the Page token and Instagram media with the
system-user token, exactly like `npm run meta:probe` but without the
single-page limit.

Pagination is bounded, not a crawler: `DEFAULT_INGEST_MAX_PAGES = 1` (matching
the already-proven 100-record-per-network read), with an operator override via
`META_INGEST_MAX_PAGES` capped at `MAX_ALLOWED_INGEST_PAGES = 3` (scripts/meta-
ingest-lib.mjs). A `truncated: true` flag on each surface records when more
pages existed than were fetched; nothing follows `paging.next` beyond that
bound.

Each normalized record now also carries `source_account_id` (the fixed Page or
Instagram ID it came from), in addition to the existing network, source ID,
timestamp, caption/message, permalink, media metadata, provenance, and
`fetched_at`. The existing `candidate_signals` (`event_like`, `notice_like`,
`explicit_date`) remain the only classification signal; they are deterministic
regex triage hints, not event/notice extraction, and no field on a record is
LLM-derived.

Output is written only to ignored `.local/meta-ingest.json` (mode `0600`); it
is never written to `content/`, `dist/`, or any frontend bundle path. Every
record keeps `visibility: "public_candidate"`, so `assertPublicDataSafe`
(`scripts/feeder-health.mjs`) rejects it from public output until an explicit
approval step promotes specific fields through the existing
`scripts/candidate-lib.mjs` event-candidate workflow. `npm run meta:ingest`
performs no classification into event/notice/exhibition/menu/irrelevant
categories and creates no candidate or canonical record; that promotion step
remains a separate, owner-gated future task.

Token health is intentionally reported as `unknown` for both the system-user
and Page tokens: Meta's `debug_token` endpoint requires sending the App Secret
as a diagnostic input, which this project has already decided not to automate.
Expiry/revocation therefore continues to surface only as a failed `feeder_health`
read, not as a predicted expiry date.

`npm run meta:ingest` is local-only. No Cloudflare Worker secret, Cron,
KV/D1 binding, or scheduled deployment was added.

## Implementation preparation

The credential-free client at `feeders/meta/client.mjs` is prepared for API
v26.0. It:

- verifies the owner-confirmed Page ID/name for Page authorization; the
  system-user path independently verifies the Instagram linkage;
- reads Page posts and Instagram media with fixed field selections;
- follows `paging.next` without trusting its embedded credentials;
- sends tokens only in the `Authorization: Bearer` header;
- strips `access_token`, `appsecret_proof`, and `client_secret` from URLs;
- rejects POST, PUT, PATCH, and DELETE before network access; and
- returns sanitized pagination metadata suitable for feeder health.

The owner-facing bootstrap is now `npm run meta:store-token`. It reads stdin,
never accepts a token as an argument, writes only ignored
`.local/meta-access-token.json`, and sets mode `0600`. The schema is:

```json
{
  "access_token": "<owner-installed secret>",
  "token_type": "system_user",
  "source": "owner_local_install",
  "installed_at": "<timestamp>"
}
```

The token value is never printed. The safe macOS workflow is:

```sh
pbpaste | npm run meta:store-token
pbcopy < /dev/null
```

The real read-only probe is `npm run meta:probe`. It reads that ignored file,
reads the separate ignored Page-token file for Facebook, reads the system-user
file for Instagram, queries only the fixed owner-confirmed Page and Instagram
IDs, verifies the Page identity and independently verifies the linkage through
the system-user path, reads one bounded page of Page posts and
Instagram media, and writes only the redacted summary
`.local/meta-probe-report.json`. It never
prints media URLs, paging URLs, cursors, raw responses, or tokens.

## Dual-token owner authorization

The Page authorization command is `npm run meta:authorize-page`. It uses the
existing app `L'Altro Spazio Digital System`, the exact HTTPS loopback callback
`https://127.0.0.1:8789/oauth2callback`, state validation, PKCE, and only
`pages_show_list,pages_read_engagement`.

The current OAuth request is bounded to exactly
`business_management`, `pages_show_list`, `pages_read_engagement`, and
`public_profile`. Immediately after exchanging the authorization code, the
flow reads `/me/permissions` with the in-memory user token. If
`business_management` is absent or declined, it stops with a specific
diagnostic and does not call `/me/accounts`.

Owner/engineering local setup:

1. In the ignored mode-600 `.env.meta.local`, set `META_APP_ID` and
   `META_APP_SECRET`. Do not put either value in Git or chat. No
   `META_CONFIG_ID` is needed for the current standard loopback flow unless
   Meta's app dashboard explicitly requires a Facebook Login for Business
   configuration ID; if it does, add that value to the same ignored file and
   document the dashboard configuration before authorizing.
2. In the Meta app dashboard, confirm exactly
   `https://127.0.0.1:8789/oauth2callback` is an allowed redirect URI for the
   existing app. HTTP is not supported by the current Facebook Login for
   Business configuration.
3. Install locally trusted TLS with mkcert if it is not already installed:

   ```sh
   brew install mkcert
   mkcert -install
   mkdir -p .local
   mkcert -cert-file .local/meta-oauth-cert.pem -key-file .local/meta-oauth-key.pem 127.0.0.1
   chmod 600 .local/meta-oauth-key.pem
   ```

   The certificate and private key remain under ignored `.local/`. The command
   also bootstraps them automatically when `mkcert` is available; otherwise it
   fails closed with these exact setup commands.
4. Run `npm run meta:authorize-page`, sign in as the authorized owner, and
   approve only the four bounded permissions requested by the current flow.
5. The flow calls `/me/accounts` with the temporary user token, selects only
   Page `264601140373284`, verifies the Page name using the returned Page
   token, and stores only the final Page token at
  `.local/meta-page-access-token.json` mode `0600`. The exact HTTPS redirect URI
  is sent byte-for-byte both to Meta's authorization endpoint and token
exchange.

If `/me/accounts` still returns no owner Page after `/me/permissions` confirms
the required grants, the connector does not select a legacy or alternate Page
and does not broaden permissions. Record the safe empty-result diagnostic and
evaluate the existing Facebook Login for Business Configuration ID as the next
owner/UI step: the configuration can define the token type, selected assets,
and permissions. No configuration ID is currently assumed or stored.

The intermediate user token and authorization code exist only in process
memory. The Page token schema is:

```json
{
  "access_token": "<secret>",
  "token_type": "page",
  "page_id": "264601140373284",
  "source": "owner_oauth",
  "installed_at": "<timestamp>",
  "expires_at": null
}
```

`expires_at: null` means Meta did not provide a verified expiry in this flow;
it is not a claim that the token is permanent. Expiry/revocation remains a
health condition. Token-debug inspection is intentionally not automated here
because it would require handling the App Secret and token as diagnostic
inputs; no token is printed or persisted in reports.

The final routing is explicit:

- Instagram media: `.local/meta-access-token.json`, system-user token.
- Facebook Page posts: `.local/meta-page-access-token.json`, Page token.

There is no fallback between these token types.

The separation is deliberate: Page OAuth authorizes only Facebook Page
own-post reads. The system-user credential owns Instagram media reads and
independently verifies the owner-confirmed Page-to-Instagram linkage. A
missing or inaccessible `instagram_business_account` field during Page OAuth
is non-fatal and never triggers scope expansion.

No raw authenticated response, media CDN URL, token, cursor payload, or report
has been committed. `.env.meta.local` is reserved for future non-token
configuration; the access token is not placed there.

The existing normalizer remains the boundary:

`raw Meta record -> normalized source record -> candidate signals -> deterministic validation -> owner approval -> canonical content`

The deterministic signals are triage hints only. They are not event extraction,
and a missing Page message remains a valid source record with null text.

## Error and capability model

Graph error codes are classified independently of HTTP status: code `190` is an
invalid/revoked token, code `10` is permission/asset denial, common rate-limit
codes are rate-limited, and 5xx responses are temporary API failures. Reports
retain only the safe error class.

The successful human proof permissions remain separate from machine-token
capabilities. `pages_show_list` and `public_profile` are not required merely to
read known fixed assets. The system-user probe tests only:

- Facebook Page own-post read.
- Instagram professional-account own-media read.

If Page reads succeed but Instagram media fails with permission denial, the
probe reports `SYSTEM_USER_INSTAGRAM_UNSUPPORTED_OR_UNAUTHORIZED`; it does not
request broader permissions.

If Instagram media succeeds but Page own-post reads return Graph code `190`,
the probe reports `SYSTEM_USER_PAGE_READ_TOKEN_CONTEXT_UNSUPPORTED_OR_UNAUTHORIZED`
and marks the system-user result partial. This is not treated as proof that the
token is globally expired, because the same probe has authenticated successfully
against the Page identity and Instagram media. Do not broaden permissions
automatically; validate whether the current Page endpoint requires a compatible
Page-token context or a separate asset assignment.

## Capability boundary

Reading the venue's own Instagram media is feasible through the Instagram
Graph API after the professional-account and Page-link prerequisites are met.
Reading the Page's own posts is feasible through the Pages Graph API with a
Page access token and the current Page read permissions. The exact permission
set and review requirement are version- and endpoint-dependent and must be
confirmed in Meta's current dashboard before authorization. Publishing is out
of scope and must not be enabled merely to read candidate events.

Long-lived user/Page tokens require secure storage, expiry monitoring, and
rotation or reauthorization. The future scheduled job should fail closed when
the token is expired and retain the last valid candidate snapshot. Webhooks can
reduce polling for supported Page/Instagram events, but they are not needed for
the first ingestion and should be added only after a concrete synchronization
requirement exists.

## Owner checklist

1. Confirm the Instagram account type and its linked Facebook Page.
2. Confirm the authorized owner of both assets and provide the account/Page IDs
   through a secret-management channel, not this repository.
3. Create or identify the Meta app and confirm the selected API product/version.
4. Authorize a least-privilege test user and record which read permissions Meta
   grants without review.
5. Decide whether the first integration is read-only; defer publishing scopes.
6. Approve token storage, rotation owner, expiry alert, and failure contact.
7. Approve the rule that imported posts become candidates/drafts and never
   public events without deterministic validation and human approval.

References: [Instagram Graph API](https://developers.facebook.com/docs/instagram-api),
[Instagram content publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing),
[Facebook Graph API](https://developers.facebook.com/docs/graph-api), and
[Graph API access tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/).
For current account-linking requirements, see [Meta's Instagram/Page help](https://www.facebook.com/help/1148909221857370). Meta's current API material also distinguishes the Facebook Login path from [Instagram Login](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-26e7999c-fc7e-44c8-8f71-ab2de8d35c32); recheck permission and review status in the dashboard before authorization.

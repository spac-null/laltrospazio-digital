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

## Scheduled Cloudflare ingestion foundation (feature branch, not deployed)

Branch `feature/meta-scheduled-ingestion` (worktree only; not merged, not
pushed, not deployed) prepares a scheduled Worker version of the exact same
proven dual-credential read used by `npm run meta:ingest`. Nothing in this
section has been activated in production.

### Reuse, not a fork

`worker/meta-scheduled.mjs` calls the same `runMetaIngest` from
`scripts/meta-ingest-lib.mjs` used by the local CLI, which in turn reuses
`feeders/meta/client.mjs` and `feeders/meta/normalize.mjs` unchanged. Facebook
still only ever uses the Page token; Instagram still only ever uses the
system-user token; there is still no fallback between them and no write
method. The Worker adds only persistence (D1) and run/health bookkeeping on
top of the existing read path.

### D1 schema (`migrations/0001_create_meta_source_records.sql`)

Two private tables, applied only to a local D1 instance so far
(`wrangler d1 migrations apply laltrospazio-meta --local`; verified against a
real local SQLite-backed D1 with `wrangler d1 execute --local`):

- `meta_source_records`: `network`, `source_id`, `source_account_id`,
  `source_timestamp`, `message_or_caption`, `permalink`, `media_type`,
  `candidate_signals` (JSON text of the existing deterministic
  event_like/notice_like/explicit_date signals — no LLM-derived field),
  `first_seen_at`, `last_seen_at`, `last_fetched_at`, with a
  `UNIQUE (network, source_id)` constraint so Facebook and Instagram IDs
  cannot collide and repeated ingestion is idempotent by construction.
- `meta_feeder_runs`: `started_at`, `finished_at`, `success`,
  `credential_model`, `facebook_record_count`, `instagram_record_count`,
  `facebook_truncated`, `instagram_truncated`, `freshness`, and `errors_json`
  (an array of `{surface, error_class}`, never a raw Graph error body or
  credential).

No access token, `appsecret_proof`, client secret, OAuth code, or
token-bearing paging URL is ever written to either table; `worker/meta-d1.mjs`
only ever receives already-normalized, already-redacted record objects.

### Idempotent upsert model

`upsertMetaSourceRecords` (`worker/meta-d1.mjs`) issues one
`INSERT ... ON CONFLICT(network, source_id) DO UPDATE SET ...` per record,
batched through `db.batch()`. The `DO UPDATE SET` clause intentionally omits
`first_seen_at`, so a record's first-seen timestamp is set once on insert and
never overwritten; `last_seen_at` and `last_fetched_at` always advance to the
current run's timestamp; content columns (`message_or_caption`, `permalink`,
`media_type`, `candidate_signals`) always refresh to the latest fetched
value. This was verified against a real local D1/SQLite instance: a second
identical ingestion does not duplicate the row, and a changed caption updates
content and `last_seen_at` while `first_seen_at` stays fixed.

### Failure isolation

Facebook and Instagram reads remain independent inside `runMetaIngest` (each
in its own try/catch, as in the existing probe). `runScheduledMetaIngest`
(`worker/meta-scheduled.mjs`) only upserts records for the surface(s) that
actually succeeded; a failing surface contributes zero rows to that run and
never deletes or overwrites rows a previous successful run wrote for the
other surface. Tests prove this in both directions (Facebook failing leaves
Instagram history intact, and vice versa) using a real SQLite-backed D1
double (`tests/meta-d1-double.mjs`, via Node's built-in `node:sqlite`).

### Feeder-run/health model

Every scheduled invocation writes one `meta_feeder_runs` row: a `started_at`
row is inserted before any network call, then updated with `finished_at`,
`success`, per-network record counts, per-network `truncated` (pagination)
state, `freshness`, and a safe `errors_json`. If `runMetaIngest` itself throws
unexpectedly (rather than reporting a per-surface error, as it normally does),
the run row is still closed out as a failure before the error is re-thrown —
no run is left open indefinitely.

### Worker secret contract

The Worker requires two Cloudflare secret bindings, checked at the start of
every scheduled run by `requireMetaSecrets()`:

- `META_PAGE_ACCESS_TOKEN`
- `META_SYSTEM_USER_ACCESS_TOKEN`

These are ordinary Wrangler secrets (`wrangler secret put ...`), never
`vars`/plaintext config, and are not declared with any value in
`wrangler.jsonc` — Wrangler secrets are never declared in config. No value
for either secret exists anywhere in this repository; local testing used only
synthetic values in an ignored `.dev.vars` file
(`META_PAGE_ACCESS_TOKEN=synthetic-...`). No production secret was set in
this task.

### Public/private boundary

`worker/index.mjs`'s `fetch` handler is unchanged from static-only serving:
it does exactly one thing, `return env.ASSETS.fetch(request)`, for every
request. It has no branch, route, or query parameter that touches `META_DB`.
D1 is private infrastructure with no public query surface: the website must
never expose a generic "list Meta source records" endpoint. Promotion from a
D1 source record into public `content/events/` or `content/notices/` remains
exactly the existing owner-gated `scripts/candidate-lib.mjs` workflow; nothing
in the scheduled Worker writes to `content/`.

### Local schedule testing performed

- `wrangler d1 migrations apply laltrospazio-meta --local` applied cleanly to
  a real local D1/SQLite instance.
- Real local-D1 SQL was exercised directly with `wrangler d1 execute --local`:
  first insert, idempotent re-insert, caption update preserving
  `first_seen_at`, and Facebook/Instagram non-collision on the same numeric
  ID all verified against genuine SQLite semantics, not just JS logic.
- `wrangler dev --test-scheduled` was run locally with synthetic `.dev.vars`
  secrets. `GET /` and `GET /eventi` both returned `200` (static/SPA serving
  unchanged). `POST /__scheduled` ran the real scheduled handler, which made
  real (network-reachable, but credential-invalid) calls to the Meta Graph
  API, correctly classified the synthetic token as `invalid_token`, and
  recorded `meta_feeder_runs.success = 0` / `freshness = "failed"` with a
  redacted `errors_json` — with zero new rows written to
  `meta_source_records`, confirming a failed run cannot corrupt state.
- No real Meta credential was used at any point in this branch's testing.

### Production rollout (completed)

All of the previously-listed future steps have now been performed for real,
in this order:

1. `npx wrangler@4.122.0 d1 create laltrospazio-meta` created the real
   production D1 database, region EEUR:
   `d3f2054c-2010-4dbc-9a4e-58d73a821c02`. Wired into the existing `META_DB`
   binding in `wrangler.jsonc` (no second binding, no rename).
2. `npx wrangler@4.122.0 d1 migrations apply laltrospazio-meta --remote`
   applied `migrations/0001_create_meta_source_records.sql` to the real
   production database.
3. One controlled real end-to-end test ran the actual `feature/meta-scheduled-
   ingestion` Worker code locally (`wrangler dev --test-scheduled` with a
   temporary `remote: true` on `META_DB` and real local Meta credentials in an
   untracked, mode-600 `.dev.vars`) against the real Meta Graph API and the
   real remote D1 — before any Worker secret or Cron existed. Result: 100
   Facebook + 100 Instagram records upserted, one `meta_feeder_runs` row
   (`success = 1`, `freshness = "fresh"`, both networks `truncated = 1`). The
   temporary `remote: true` was reverted immediately after and confirmed
   byte-for-byte identical to the committed config. Credential-pattern checks
   (`access_token`, `appsecret_proof`, `client_secret`, OAuth-code/paging
   patterns) against the remote D1 content and schema found zero matches.
4. `wrangler secret put META_PAGE_ACCESS_TOKEN` and
   `... secret put META_SYSTEM_USER_ACCESS_TOKEN` installed the two real
   Worker secrets (interactive prompt only). `wrangler.jsonc` also declares
   `secrets.required` with just the two names, so wrangler validates their
   presence — no value ever entered config or Git.
5. A candidate Worker version (`35802989-f989-4408-b519-68daa71a14aa`) was
   uploaded and smoke-tested on its preview URL: static/SPA routes
   (`/`, `/eventi`, `/robots.txt`, `/sitemap.xml`) all returned the expected
   status/content-type, and private-path smoke tests (`.local/meta-ingest.json`,
   `/api/meta`, `/meta_source_records`, `/meta_feeder_runs`) found zero
   matches for credential or table-name leakage.
6. `feature/meta-scheduled-ingestion` was merged into `main` (which was
   already connected to production Workers Builds) and pushed, producing the
   live production deployment `df0ef32e-34b5-4210-abdd-5459cbe2979b`.
7. A single daily Cron Trigger, `17 5 * * *` (05:17 UTC — Cloudflare Cron
   Triggers always use UTC), was added to `wrangler.jsonc` on `main` and
   deployed. This is the only schedule configured. Rollback/disable is
   `triggers.crons: []`, committed and deployed like any other config change.

As of this Cron activation, `meta_source_records` and `meta_feeder_runs`
still reflect only that one pre-Cron end-to-end test (200 records, 1 run);
the first automated row is expected after the first `05:17 UTC` firing.

## Private candidate review + controlled promotion (feature branch, not deployed)

`feature/candidate-review-pipeline` (local worktree only; not merged, not
pushed) implements the missing layer between the scheduled Meta feeder and
canonical content:

```text
private meta_source_records (D1, production)
  -> deterministic candidate detection (scripts/candidate-detect.mjs)
  -> private review queue (.local/candidate-review.json, .local/candidate-review.md)
  -> explicit owner promotion (npm run candidates:promote -- <id> --confirm)
  -> canonical draft (content/events/<slug>.json or content/notices/<slug>.json,
     publication_status: "draft")
  -> existing public build (unchanged: only publication_status: "published"
     records ever reach normalizePublicContent/dist)
```

This is a read/propose system, not a publisher. No command in this pipeline
ever sets `publication_status: "published"`, commits, pushes, or deploys.

### Commands

- `npm run candidates:refresh [-- --source <path>] [--all]` — reads
  `meta_source_records` from the real remote D1 (default) or a local fixture
  file (for tests), classifies and deduplicates them, and writes only
  `.local/candidate-review.json` and `.local/candidate-review.md` (mode
  `0600`, git-ignored). Read-only with respect to D1: it only ever executes a
  `SELECT`.
- `npm run candidates:list [-- --all]` — prints id/type/time-relevance/
  readiness/source-count from the private review file. Past candidates are
  hidden unless `--all` is given.
- `npm run candidates:show -- <candidate-id>` — prints full detail for one
  candidate, including its source caption(s), for owner review. This is the
  only command that surfaces raw caption text, and only for a single
  candidate at a time, in a local terminal — never in a public or generated
  file.
- `npm run candidates:promote -- <candidate-id> [owner flags...] [--confirm]`
  — the only command that can write a canonical file, and only after an
  explicit gate passes (see below). Without `--confirm` it prints a preview
  and writes nothing.

### Reuse, not a fork

The pipeline reuses the existing normalized shape rather than re-normalizing:
`scripts/candidate-review-lib.mjs` adapts either a `meta_source_records` D1
row or an already-normalized `feeders/meta/normalize.mjs` record (as written
by `scripts/meta-ingest-lib.mjs`) into one common shape. Classification
reuses the existing deterministic `candidate_signals`
(`event_like`/`notice_like`/`explicit_date`) computed at ingestion time and
only adds two further deterministic keyword sets
(`art_or_exhibition`, `menu_or_product`). Promotion validates against the
existing, unmodified `validateEvent`/`validateNotice` from
`scripts/content-lib.mjs` — there is no second public content schema.

### Candidate classification

Deterministic, priority-ordered, no LLM: `operational_notice` (notice_like)
> `event` (event_like) > `art_or_exhibition` (keyword match) >
> `menu_or_product` (keyword match) > `unknown` (has content, no signal) >
> `irrelevant` (no caption, no permalink, no media type at all). Every
classification carries an explicit, human-readable reason string.

### Field provenance model

Every extractable field on an `event`/`operational_notice` candidate carries
one of: `extracted` (deterministic, traceable to explicit source text —
e.g. an ISO or DD/MM/YYYY date, or an HH:MM/`ore HH` time), `inferred`
(deterministically guessed, e.g. a bare day/month with no year — never
promotable without an explicit owner override), `missing` (absent), or
`conflicting` (two source records in the same duplicate-candidate disagree).
An owner-supplied CLI override always becomes `owner_confirmed` and is
recorded with a timestamp; it is layered on top of, and never rewrites, the
original source-derived provenance.

`title` is deliberately always `missing` for every Meta-derived event
candidate: Facebook/Instagram posts carry no structured title field, and
inventing one from caption text would be exactly the kind of
language-sounds-likely inference this system is designed to refuse. It
always requires an explicit `--title` override.

`location_name` defaults to the venue's own name/address, with status
`extracted` — its evidence is "derived from posting account identity" (the
Page/Instagram account is the venue's own), not a guess about post content.

### Duplicate detection and date conflicts

`scripts/candidate-detect.mjs` groups likely-duplicate source records
(typically the same real post cross-published to Facebook and Instagram)
when they share the same extracted/inferred date AND their normalized
caption token sets overlap at or above a fixed Jaccard threshold (0.5) — both
deterministic, explainable, threshold-based checks, not a probabilistic
model. A second, stricter check (0.7 threshold) flags likely-same-post pairs
that disagree on their explicit date without merging them, marking the
resulting candidate's `start_date` as `conflicting` rather than trusting
either value.

The real production read (200 source records) found 143 candidates after
grouping (57 duplicate groups) and 86 flagged date conflicts. The high
conflict count is a known limitation worth flagging: this venue posts
recurring weekly formats with a near-identical template but a different real
date each week, which the 0.7 text-similarity threshold cannot distinguish
from "the same post, edited." Before relying on the conflict count for real
review triage, this heuristic likely needs a refinement (e.g. excluding
recurring-format posts, or a per-series identifier) — noted as a follow-up,
not fixed in this task.

### Promotion gate

`npm run candidates:promote` builds a draft record, then validates it with
the unmodified `validateEvent`/`validateNotice`, and only writes a file to
disk if that validation passes AND `--confirm` was given. Missing,
`inferred`, or `conflicting` required fields fail loudly with the exact
field and reason before any file is touched; nothing is silently defaulted
to a placeholder like "TBD". A duplicate slug is refused rather than
overwritten.

Because `validateNotice` already hard-requires `source.type ===
"owner_confirmation"`, an operational-notice promotion can never carry Meta
provenance directly in its `source` field — every notice promotion requires
explicit `--message`, `--valid-from`, `--valid-until`, and `--notice-type`
flags; the source caption is never auto-copied as the final message.

Every promoted record is written with `publication_status: "draft"` — the
existing schema's own separation between promotion and publication. A draft
is invisible to `normalizePublicContent`/the public build until a human
separately edits it to `"published"` (events) or sets
`owner_confirmed: true` with a real `source.confirmed_at` (already true for
notice drafts, since the CLI flags themselves are the confirmation) and
commits/pushes that change — this pipeline does none of that automatically.

### D1 read-only boundary

Candidate review only ever issues `SELECT` against `meta_source_records`
(verified: the real read against production D1 reported `changed_db: false`,
`rows_written: 0`). No `meta_candidate_reviews` or other review-state D1
table was created in this task. If persistent cross-run review state (e.g.
"already looked at and dismissed") becomes valuable, a minimal table is
proposed for later, explicit approval:

```sql
CREATE TABLE meta_candidate_reviews (
  candidate_id TEXT PRIMARY KEY,
  decision TEXT NOT NULL,        -- e.g. 'pending' | 'dismissed' | 'promoted'
  candidate_type TEXT,
  reviewed_at TEXT,
  source_refs TEXT,              -- JSON array of {network, source_id}
  owner_overrides TEXT,          -- JSON of any --flags supplied
  promoted_path TEXT             -- e.g. content/events/<slug>.json, or null
);
```

This is a proposal only — no migration file was added and no remote D1
schema change was made for it in this task.

## Candidate quality + owner review UX (feature branch, not deployed)

### The 86 "date conflicts" were almost entirely one false-positive cause

A real read against production D1 (200 records) originally flagged 86
same-similarity-different-date pairs as conflicts. Diagnosis (aggregate
counts only; no caption was committed) found this was overwhelmingly one
root cause: nearly all 86 pairs traced back to just **two connected
clusters** of mutually-similar text (sizes 3 and 14) — one recurring
weekly/monthly post template reused with a different real date each time,
not genuine data disagreement. A second, unrelated robustness bug was found
and fixed in the same pass: very short captions could hit the similarity
threshold purely because shared date/time digit fragments (e.g. "01" vs
"12") were being counted as ordinary tokens; numeric-only tokens are now
excluded from similarity comparison, and a minimum meaningful-token count
guards against short-text false positives.

### Refined deterministic date model

`scripts/candidate-detect.mjs` now computes, per candidate, a `date_state`:
`single_explicit_date`, `explicit_date_range` (an explicit "dal...al..."
span — both ends extracted, never treated as a conflict), `multiple_event_dates`
(a programme listing several separate dates with no range connector — blocks
promotion because no single date can be chosen, not because of a
cross-source disagreement), `ambiguous_date` (an **isolated pair** — no
third similar variant — of near-identical text with disagreeing dates), or
`conflicting_sources` (reserved for an already-merged duplicate group whose
members' extracted dates disagree, which cannot currently happen given how
`groupDuplicates` merges). Only `ambiguous_date` and `conflicting_sources`
block for a "date conflict" reason. A cluster of 3+ similar-but-differently-
dated records is instead recorded as `recurring_series` (cluster size +
related candidate IDs) — informational, not blocking; each member keeps its
own valid single date. A past date always stays classified `past` even when
part of a recurring series — a historic occurrence is never used as implicit
proof a future one exists.

### Deterministic title suggestions

`suggestTitle()` proposes a `title_suggestion` only from a genuine
structural heading marker: a standalone first line followed by further
content, or short text before a strong delimiter (colon/dash/pipe) followed
by more content — confidence increases when the same heading line repeats
across Facebook/Instagram duplicate sources. It never truncates arbitrary
prose into a fake title. Its status is always `inferred` and it is a
**separate field** from `title` — `candidates:promote`'s title-resolution
path only ever reads an explicit `--title` flag or the fixed "missing"
default; `title_suggestion.value` is never read automatically, confirmed by
test.

### Time relevance and review priority

`time_relevance` is now `past | near_term (0-14d) | upcoming (15-60d) |
future_distant (>60d) | recurring_or_multi_date | ambiguous | undated`.
`review_priority` (`high`/`medium`/`low`, categorical — no numeric
pseudo-confidence) is computed from explainable rules: HIGH requires a
strong event/notice signal, a low-ambiguity date_state, a near-term/upcoming
date, a usable permalink, and no substantive missing field besides the
always-owner-confirmable title. Every candidate carries `review_priority_why`
(the matched reasons) and `next_owner_action` (a concrete, deterministic
suggestion — e.g. "provide --date to resolve the ambiguous date").

### CLI review UX

`candidates:list` now supports `--upcoming`, `--priority <high|medium|low>`,
`--type <event|...>`, `--blocked`, `--past`, `--limit <n>`, and a compact
default table (id/type/priority/date-state/title-suggestion/networks/
blockers) — no full captions by default. With no flags it shows the default
**review queue**: unresolved (not ignored/promoted), non-past,
non-low-priority candidates only. `candidates:show -- <id>` remains the only
place full caption text is shown, one candidate at a time.

### Local review-state (not D1 yet)

`.local/candidate-decisions.json` (mode `0600`, git-ignored) records
`pending | reviewed | ignore | defer | promoted` per `candidate_id`, each
change timestamped and appended to a `history` array — never silently
overwritten. `npm run candidates:review -- <id> --ignore|--defer|--reviewed`
sets it; `candidates:promote` sets `promoted` automatically on a successful
write, linking `promoted_path`. `candidates:refresh` only ever *reads* this
file to attach `review_decision` to each candidate — it never writes
decisions, and an ignored/promoted candidate is excluded from the default
queue on every subsequent refresh (verified by test: the decision survives a
refresh). Source records and canonical content are never touched by any of
this. No D1 table was added for review state in this task — the proposed
`meta_candidate_reviews` schema above remains a proposal only.

### Real-data result after the refinement

Read-only against the real production D1 (200 records, unchanged —
`changed_db: false`): 144 candidates (56 duplicate groups), by priority
high=2/medium=59/low=83, by type event=56/operational_notice=5/
art_or_exhibition=1/menu_or_product=3/unknown=79. **Ambiguous-date count: 0**
(down from the original 86 false positives); multiple-event-dates: 2
(genuine, different reason); 7 candidates correctly tagged as part of a
recurring series. 39 candidates got a deterministic title suggestion. Of 61
blocked candidates, 32 are blocked *only* by the always-required title
confirmation; 29 are blocked by a more substantive missing/ambiguous fact.
The default review queue (unresolved, non-past, non-low-priority) contains
27 candidates. No candidate was promoted.

References: [Instagram Graph API](https://developers.facebook.com/docs/instagram-api),
[Instagram content publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing),
[Facebook Graph API](https://developers.facebook.com/docs/graph-api), and
[Graph API access tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/).
For current account-linking requirements, see [Meta's Instagram/Page help](https://www.facebook.com/help/1148909221857370). Meta's current API material also distinguishes the Facebook Login path from [Instagram Login](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-26e7999c-fc7e-44c8-8f71-ab2de8d35c32); recheck permission and review status in the dashboard before authorization.

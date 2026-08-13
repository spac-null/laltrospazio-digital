# Current state

Last updated: 2026-08-13

## What this repo currently is

- Frontend: Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui
- Hosting target in production: Cloudflare Worker Custom Domain; Vercel remains
  intact as rollback hosting
- Public site pattern today: single-page static venue site rendered from `src/pages/Index.tsx`
- Canonical branch: `main`, with phase-0 foundation merged and pushed at
  `0f8a5f4` on 2026-08-13
- Canonical GitHub repository: `git@github.com:spac-null/laltrospazio-digital.git`

## Source and hosting boundaries

- New GitHub `main` is the canonical source branch for
  `spac-null/laltrospazio-digital`.
- Vercel rollback project remains intact and is served by the separate
  `spac-null/landing-space-generator` repository, verified through the Vercel
  project API on 2026-08-13.
- Cloudflare DNS is production/authoritative infrastructure for
  `altrospazio.org` and now serves the production site through the Worker.
- The Cloudflare Worker is deployed from canonical `main` at
  `https://laltrospazio-digital.dev-c05.workers.dev/` and through the custom
  domain `https://www.altrospazio.org/`.
- The approved workers.dev deployment remains available as a comparison and
  rollback diagnostic endpoint.
- Preview URL now available and audited:
  `https://preview-gptengineer-removal-laltrospazio-digital.dev-c05.workers.dev/`.
  The focused preview audit found matching desktop/mobile geometry and no
  script-removal regression. Playfair is externally loaded from Google Fonts
  and returned HTTP 200.
- The earlier preview recheck corrected the Playfair diagnosis: Google Fonts
  returned HTTP 200, and the Vercel-specific Speed Insights request was
  removed before production cutover.

## Production relationship

- Production URL: `https://www.altrospazio.org/`, served by the Cloudflare
  Worker Custom Domain as of 2026-08-13.
- Vercel project `landing-laltrospazio` remains intact and connected to the
  separate `spac-null/landing-space-generator` repository for rollback.
- Apex `https://altrospazio.org` is now a Cloudflare-native `301` redirect to
  `https://www.altrospazio.org/`, preserving path and query string.
- `festa.altrospazio.org` remains intentionally outside the Worker cutover.
- No GitHub Pages configuration found in repo
- No GitHub Actions deployment workflow found in repo
- A minimal `wrangler.jsonc` now defines Worker Static Assets from `dist/` with
  SPA fallback; canonical `main` is deployed through Workers Builds.

## Current repo findings

- Existing pre-audit dirty change: `package-lock.json` was already modified and must remain untouched unless explicitly requested
- `robots.txt` and `sitemap.xml` were missing from production during the initial audit
- Base document language had been `en`; corrected locally to `it`
- Canonical URL and robots metadata are now present locally
- No structured event/content system exists in repo yet
- Structured content foundation is now implemented: `content/venue.json`,
  individual `content/events/<slug>.json` records, deterministic build
  validation, generated public content, `/eventi`, and `/eventi/:slug`.
- No production event records are present because no event has been authorized
  for publication. The public event index intentionally shows an empty state.
- Public venue data is limited to provenance-permitted name, address, phone,
  website, coordinates, menu, social, and map fields. Email, opening hours,
  seasonal location, and accessibility facilities remain absent.
- Meta read/publish feasibility and owner actions are documented in
  `docs/project/meta-integration-plan.md`. Real dual-credential read
  authentication is now operational and proven (Page token for Facebook Page
  posts, system-user token for Instagram media). A bounded real local
  ingestion command, `npm run meta:ingest`, is implemented at
  `scripts/meta-ingest-lib.mjs`/`scripts/meta-ingest.mjs`; it writes only
  ignored `.local/meta-ingest.json` as `public_candidate` source records that
  `assertPublicDataSafe` still rejects from public output. No scheduler, Cron,
  KV, D1, Worker secret, or admin surface has been added.
- Real-event proof preparation is implemented in `scripts/candidate-lib.mjs`
  and `scripts/create-event-candidate.mjs`. Candidates are stored separately
  under `content/candidates/`, require owner confirmation, and cannot publish
  automatically. No candidate or production event exists yet.
- A separate canonical operational-notice model now exists under
  `content/notices/`. The owner-confirmed August 2026 temporary closure is
  published with Europe/Rome date validity and expires automatically at
  `2026-08-27T00:00` Europe/Rome; no reopening hour is asserted.
- Operational-notice details and expiry semantics are documented in
  `docs/project/operational-notices.md`.
- No GA4 or GTM detected in repo or live HTML
- Project memory has been moved from obsolete `.claude/` files into `docs/project/`
- A machine-readable provenance layer now exists at `docs/project/content-provenance.json`

## Current risk areas

- Public homepage contains multiple unsupported or unverified factual claims
- Named testimonials in current homepage copy have no provenance in repo
- Accessibility/program claims are mixed with marketing copy and need structured verification
- Public discovery ecosystem appears inconsistent across third-party listings
- `vercel.js` still contains a `festa.altrospazio.org` host rewrite, but
  `curl` could not publicly resolve `festa.altrospazio.org` on 2026-08-12, so
  current config and current public DNS behavior are not aligned

## Vercel Git integration evidence

- Vercel project: `landing-laltrospazio`
- Vercel project production URL: `https://festa.altrospazio.org`
- Git provider/repository: GitHub `spac-null/landing-space-generator`
- Vercel production branch: `main`
- Latest production deployment metadata references the old repository, not
  `spac-null/laltrospazio-digital`.
- Therefore changes to the new repository's `main` do not change current Vercel
  production.

## Hosting re-evaluation

- Preferred future target: Cloudflare Worker Static Assets serving the existing
  Vite `dist/` output, connected directly to GitHub through Workers Builds.
- Cloudflare Pages is a viable fallback/comparison option; GitHub Pages is a
  fallback only.
- The existing build passes and emits a Workers-compatible static asset tree.
- Cloudflare is now the active authoritative DNS provider for
  `altrospazio.org` on the Free plan.
- Assigned nameservers are `cris.ns.cloudflare.com` and
  `lady.ns.cloudflare.com`.
- DNSSEC remains disabled and will be re-enabled separately only after final DNS
  verification.
- Phase 1 DNS delegation is complete while Vercel remains production. Phase 2
  is the parallel Worker preview. Phase 3 is a separately approved production
  cutover.
- Vercel-oriented DNS records remain DNS-only. Proton Mail records have been
  migrated. Proton Mail MX, SPF, DMARC, and all three DKIM records were
  independently verified through public DNS. Menu and group redirect hosts are
  being replaced with Cloudflare Single Redirects using proxied `192.0.2.1`
  records.
- Production custom-domain cutover is complete. DNS, DNSSEC, apex behavior,
  wildcard/`festa.altrospazio.org`, menu/gruppo routing, Vercel, and external
  profiles were not modified by this verification pass.

## Latest validation

- `pwd`: confirmed the canonical local workdir is
  `/Users/stargatesgx/code/laltrospazio-digital` on 2026-08-12.
- `git status --short --branch`: the working branch is
  `preview/gptengineer-removal` tracking its origin branch; the only
  pre-existing dirty file is `package-lock.json`.
- `git remote -v`: fetch and push both point to
  `git@github.com:spac-null/laltrospazio-digital.git`.
- `https://www.altrospazio.org/` returned `200` with Cloudflare headers on
- 2026-08-13. DNS answers for `www` and the apex carried the public resolver
  DNSSEC `ad` flag. Browser verification passed at 1440, 1200, 768, 390, and
  375px widths with no homepage console errors or failed requests; Playfair,
  all four page images, CSS, and JavaScript loaded.
- Production and the approved workers.dev deployment matched on metadata,
  typography, responsive dimensions, image health, and forbidden-script
  absence.
- Production direct SPA paths `/`, `/foo`, `/menu`, and `/contatti` returned
  `200`; unknown paths render the intentional NotFound route, whose expected
  diagnostic is the only console error on those paths.
- Production `robots.txt`, `sitemap.xml`, `/menu-gruppo-nazario.pdf`, and
  `/og-image.png` returned `200`. WhatsApp, Google Maps, Instagram, and
  Facebook destinations resolved successfully. TripAdvisor remains present;
  its automated request returned `403` from TripAdvisor.
- Keyboard Tab navigation advanced through the interactive Instagram,
  WhatsApp, Maps, Facebook, Instagram, and TripAdvisor controls.
- `festa.altrospazio.org` resolves via CNAME `cname.vercel-dns.com` and serves
  a Vercel response (`server: Vercel`, `x-vercel-cache: HIT`). Its root returns
  `200`, while `/foo` and `/robots.txt` return `404`; this is the next
  infrastructure investigation and was not changed.
- `npm run build`: passed on 2026-08-12; Vite emitted `dist/` with the expected
  SPA assets and public files, including the preview-only GPT Engineer removal
  path guarded by the dedicated Workers CI branch.
- `npm run lint`: existing baseline failure remains, unrelated to this hosting
  review. No lint fix was made in this pass.
- `package-lock.json`: pre-existing dirty change; not modified, staged, or
  included in this work.
- Local `wrangler` is not installed in PATH in this workdir. The prior recorded
  dry run remains historical evidence, not a current-session recheck.
- `npm run build`: passed on canonical `main` after the merge on 2026-08-13.
- `package-lock.json` remains the only dirty worktree file and is uncommitted;
  its content hash was unchanged across the merge.
- A clean worktree from committed `HEAD` passed `npm ci` and `npm run build` on
  2026-08-13 without modifying the committed npm lockfile.
- `bun.lockb` was tracked legacy residue and caused Workers Builds to select
  `bun install --frozen-lockfile`; it is removed in the package-manager cleanup
  commit. npm is the canonical package manager.
- A clean committed-`HEAD` audit reproduced 20 npm findings: 2 low, 4
  moderate, and 14 high. No `npm audit fix` was run. Detailed runtime versus
  build-only classification and remediation order are in
  `docs/project/dependency-audit-2026-08-13.md`.
- Full Vercel/Worker parity results are recorded in
  `docs/project/parity-audit-2026-08-13.md`. Production custom-domain cutover
  is complete; wildcard, `festa`, Vercel, and external profiles were not
  changed by this verification.

## Vercel dependency inventory

- `vercel.js` supplies `cleanUrls` and the host-specific rewrite for
  `festa.altrospazio.org`; it is deployment behavior, not app content.
- Public DNS for `festa.altrospazio.org` now resolves through Vercel's CNAME;
  its current behavior is separate from the Cloudflare Worker.
- `vercel.js` is the only remaining Vercel-specific application/configuration
  file in canonical `main`; it enables clean URLs and rewrites the
  `festa.altrospazio.org` host to `/index.html` on Vercel.
- `@vercel/speed-insights` is absent from canonical `main` source and npm
  manifests. Vercel remains intact as rollback infrastructure.

## Local workdir rename

- Rename complete: the active workspace is
  `/Users/stargatesgx/code/laltrospazio-digital`.
- Git status and remotes resolve correctly from the renamed path.
- No further local rename action is required.

## GPT Engineer script status

- `https://cdn.gpteng.co/gptengineer.js` has been permanently removed from
  `index.html`
- Current evidence indicates it is a Lovable / GPT Engineer editor bridge script, not core app logic
- Current repo code does not reference it directly
- Search evidence indicates the script posts messages to allowed editor origins and supports DOM selection/edit overlays
- No preview-only removal path remains in `vite.config.ts`.

## Current docs to read before major work

- `docs/project/architecture.md`
- `docs/project/integrations.md`
- `docs/project/content-provenance.md`
- `docs/project/decisions.md`
- `docs/project/roadmap.md`

## Latest Worker deployment

- Permanent cleanup commit: `228a674`; main merge commit: `881e803`.
- Independent desktop/mobile verification passed on 2026-08-13: homepage,
  Playfair font, robots, and sitemap returned HTTP 200; console and network
  failure logs were empty; GPT Engineer and Speed Insights paths were absent.
- Production custom domain is `www.altrospazio.org`; wildcard/
  `festa.altrospazio.org`, and Vercel project state remain unchanged.
- The apex returns a Cloudflare `301` to `https://www.altrospazio.org/` with
  path/query preservation; `www` returns the Cloudflare Worker site.

## Residual Vercel host inventory (2026-08-13)

The primary-domain migration is complete. This inventory is bounded to
residual Vercel/DNS dependencies and does not change DNS, Worker, or Vercel.

| Hostname | DNS/origin | Current behavior | Purpose/evidence | Disposition |
|---|---|---|---|---|
| `festa.altrospazio.org` | CNAME `cname.vercel-dns.com`; Vercel project URL | `/` `200`; `/foo` and `/robots.txt` `404`; Vercel headers; legacy HTML/assets | Named by current `vercel.js`; no current site/repo public link; seasonal purpose is not proven | Owner decision required; preserve until reconciled |
| `program.altrospazio.org` | CNAME `cname.vercel-dns.com` via wildcard; Vercel | `/` `200`; `/foo` and `/robots.txt` `404`; same legacy deployment as `festa` | No current link or distinct content found; purpose unknown | Owner decision required; preserve until identified |
| `qr.altrospazio.org` | CNAME `cname.vercel-dns.com` | `/` `200`; `/foo` and `/robots.txt` `404`; same legacy deployment | Historical `vercel.js` redirected QR traffic to the menu PDF; no current link found | Owner decision required; likely redirect to menu PDF |
| `*.altrospazio.org` | Wildcard CNAME to `cname.vercel-dns.com` | Arbitrary labels resolve to Vercel; random unconfigured HTTPS label fails TLS | No useful wildcard behavior demonstrated; explicit live hosts must be handled separately | Retire after explicit-host replacements are approved |
| `menu.altrospazio.org` | Cloudflare proxied record/redirect | `301` to `https://www.leggimenu.it/menu/laltrospazio` | Current menu destination; no Vercel dependency | Preserve on Cloudflare |
| `gruppo.altrospazio.org` | Cloudflare proxied record/redirect | `301` to `https://altrospazio.org/menu.html` | Current group/menu destination; no Vercel dependency | Preserve on Cloudflare; owner may later review target |

No additional residual hostnames were found in the historical repository DNS
inventory or current public material. The wildcard means arbitrary unlisted
labels still resolve through Vercel even though they have no demonstrated
useful behavior.

### Festa reconciliation

The repository `vercel.js` declares `cleanUrls`, removes trailing slashes, and
rewrites every request whose host is `festa.altrospazio.org` to `/index.html`.
Public behavior does not match that declaration: the root is `200`, but
`/foo` and `/robots.txt` are `404`. The Vercel project inspection confirms the
project and build settings but does not expose the deployed route configuration;
the account-level domain list is empty and direct domain inspection is denied
for the current scope. The evidence supports an unresolved deployment/config
boundary, not a claim about which setting overrides the file.

### Vercel retirement plan

1. Obtain owner confirmation for the purpose and required destination of
   `festa`, `program`, and `qr`, including whether QR signage still exists.
2. Replace each approved live hostname with an explicit Cloudflare redirect or
   Worker route, and remove the Vercel wildcard only after those replacements
   are verified.
3. Recheck the Vercel project has no required domain, deployment, or rollback
   role; retain a reversible export/record of the legacy configuration.
4. Only then retire the Vercel project/domain dependency. Do not remove Vercel
   in this audit.

## Digital system findings: event and venue data

- No canonical current/upcoming event source exists in the repository or
  public ecosystem.
- The current site contains generic activity categories but no event records,
  feed, calendar endpoint, or event API.
- Instagram and Facebook are the strongest candidates for operational
  announcements, but owner/API access and a machine-readable feed are not
  verified. Their public pages were access-limited during this investigation.
- Google Maps/Business Profile is useful for venue identity and discovery, not
  a dependable event calendar. Cultura Bologna, Cheventi, and OggiBo provide
  structured or historical secondary evidence only; Cheventi's organizer page
  labeled 2026 contained stale 2025 event records.
- Historical recurring formats include Spazi Migranti, Serata Erasmus,
  exhibitions, concert series, Pasta & Friends, Cena al Buio, and DJ formats.
  These are not current programming.
- Normalized venue facts and field-level status are recorded in
  `docs/project/venue-record.json`.
- Source classification is recorded in
  `docs/project/event-source-inventory-2026-08-13.md`.
- The minimal event model is recorded in `docs/project/event-schema.md`.

Recommended source of truth: owner-controlled versioned records under
`content/events/`. Social channels publish from or point to them; optional API
imports may create drafts, but unreviewed social or aggregator content must
never publish automatically.

## Next action

## Post-notice production verification

- The owner-confirmed temporary closure notice from commit `396aac0` is live
  at `https://www.altrospazio.org/` as of 2026-08-13. Production returned
  HTTP 200 with `server: cloudflare`; the browser check confirmed the
  `Stato attuale` band and readable reopening message at desktop and 390px
  mobile widths.
- The production browser check reported zero console errors/warnings and no
  failed first-party requests. Homepage, JS, CSS, images, and fonts loaded
  successfully.
- The notice remains date-aware and expires at `2026-08-27 00:00 Europe/Rome`.

## Local worktree state

- The primary local worktree is now on `main`, tracking `origin/main` at
  `396aac0`.
- The pre-existing dependency-resolution change to `package-lock.json` was
  preserved without commit. It is still the only dirty tracked file. A
  reversible patch backup is at
  `/private/tmp/laltrospazio-primary-package-lock-20260813.patch`.
- `preview/gptengineer-removal` has no commits absent from `main`; its remote
  branch was not deleted. Deletion remains a separate explicit action.

## External-owned data architecture

- A per-field authority model is implemented in
  `scripts/field-authority.mjs`. It preserves source, authority level,
  fetched/owner/external timestamps, publication eligibility, and conflict
  state without replacing the existing provenance statuses.
- The Google Business Profile adapter boundary is implemented at
  `feeders/google-business-profile/normalize.mjs`. It is credential-free and
  tested only with synthetic API-shaped fixtures; no real GBP response or
  secret is stored.
- GBP setup, OAuth, account/location discovery, owner actions, field policy,
  feeder health, and Places comparison rules are documented in
  `docs/project/google-business-profile.md`,
  `docs/project/field-authority.md`, and
  `docs/project/google-places-watchdog.md`.
- No authenticated GBP probe, Cron, KV, D1, dashboard, or Meta connector has
  been added. The next concrete step is a read-only authenticated GBP proof
  after Basic API Access approval.
- A one-account local OAuth bootstrap and read-only GBP probe are now
  implemented as `npm run gbp:authorize` and `npm run gbp:probe`. The flow uses
  the full `business.manage` scope as required by Google, offline access,
  state, PKCE, ignored local token storage, and GET-only API methods. OAuth
  authorization has completed, but no GBP response has been retrieved.
- GBP access bootstrap is now submitted for Google Cloud project `Trident`
  (`gen-lang-client-0047032066`, number `283285520695`) under support case
  `3-0370000040820`. Approval is pending; the selected profile is only Via
  Nazario Sauro 24/F, not Via del Pratello 29/A.
- OAuth is configured as External/Testing in the same project with app
  `L'Altro Spazio GBP Sync`, web client `L'Altro Spazio GBP Local Connector`,
  loopback redirect `http://127.0.0.1:8787/oauth2callback`, and the full
  `business.manage` scope. Testing refresh tokens expire after 7 days; no
  unattended synchronization is enabled.
- Local OAuth bootstrap has completed successfully using the rotated secret.
  `.env.gbp.local` and `.local/gbp-refresh-token.json` exist with mode 600;
  both are Git-ignored and no contents are recorded or committed. The local
  callback completed at `http://127.0.0.1:8787/oauth2callback` for the owner
  account using `business.manage`.
- The External/Testing refresh token may expire after 7 days and is not a
  production credential. Do not repeatedly reauthorize while approval is
  pending.
- Do not run the GBP probe until Google approves Basic API Access. Do not add
  Worker secrets or deploy connector behavior in this pending state.

## Independent feeder foundations (2026-08-13)

- Google Business Profile remains blocked on Basic API Access approval. No
  GBP probe or connector change was made in this workstream.
- A read-only Google Search Console adapter is implemented at
  `feeders/google-search-console/`. It normalizes canonical property discovery,
  Search Analytics dimensions/metrics, and sitemap status using synthetic
  fixtures only. Its required scope is
  `https://www.googleapis.com/auth/webmasters.readonly`; all output is marked
  `visibility: private`.
- A Meta adapter foundation is implemented at `feeders/meta/`. It normalizes
  synthetic Instagram media and Facebook Page post records into candidate
  records only. It performs no Meta requests, writes, publication, or token
  handling.
- Shared feeder health and privacy enforcement are implemented in
  `scripts/feeder-health.mjs`. Private Search Console data and unapproved Meta
  candidates are rejected by the public-output boundary.
- Production was audited for analytics bootstrap code: no GA4, GTM, Vercel
  Speed Insights, or other analytics script was detected. The recommendation is
  Cloudflare Web Analytics as the first low-maintenance private baseline,
  subject to owner/privacy approval; defer GA4/GTM until a concrete click-
  measurement question exists.
- The venue-first IA plan is recorded in
  `docs/project/public-information-architecture.md`; no visual redesign or
  analytics deployment was performed.
- A real read-only Search Console OAuth/probe path is implemented as
  `npm run gsc:authorize` and `npm run gsc:probe`. It uses a separate client
  namespace/file/token path, PKCE, state validation, offline access, the
  `webmasters.readonly` scope only, and mode-600 ignored local outputs. The
  probe prefers `sc-domain:altrospazio.org`, falls back to the canonical
  URL-prefix property, and generates a private normalized snapshot/report.
- Recommended GSC client: create `L'Altro Spazio GSC Local Connector` in the
  existing Trident project with loopback redirect
  `http://127.0.0.1:8788/oauth2callback`. No Google credentials are recorded in
  project files.
- Search Console's first real probe selected `sc-domain:altrospazio.org` with
  `siteOwner`, found the submitted/processed canonical sitemap with zero
  errors and warnings, and returned zero analytics rows while the new property
  was still processing. No GSC connector change is required; probe again once
  data is available.

## Meta account discovery preparation (2026-08-13)

- No Meta asset relationship is verified yet. The Page ID, Instagram
  professional-account ID/type, linked Page, owning Business Portfolio, and
  Jascha's access level must be confirmed in Meta UI; no ID is inferred from a
  public URL.
- The preferred combined read-only model is Facebook Login for Business with
  the minimum current permissions to validate in the selected API version:
  `pages_show_list`, `pages_read_engagement`, and `instagram_basic`, plus the
  baseline `public_profile`. Instagram Login's newer
  `instagram_business_basic` is documented as an Instagram-only alternative,
  not a replacement for Facebook Page reads.
- No Meta app has been created or reused, no tokens requested, and no profile
  or publication operation performed. The existing normalized Meta adapter and
  candidate/publication boundary remain unchanged.
- The smallest public IA improvement available without Meta or GBP is a
  homepage `Next` empty state driven by the existing canonical event registry:
  display a concise no-confirmed-event message and link to `/eventi`, without
  inventing programming. The current verified operational-status block and
  visit/contact facts remain the primary current-state content.
- Meta read-only API proof is complete for the owner-confirmed Page and linked
  Instagram professional account. The four permissions are proven:
  `pages_show_list`, `pages_read_engagement`, `instagram_basic`, and
  `public_profile`. No broader permission is approved.
- A temporary Page access token was exposed in copied Graph API Explorer output
  and is treated as compromised. It must not be inspected, reused, requested,
  logged, or committed. The owner is revoking that development authorization.
- `feeders/meta/client.mjs` now provides credential-free read-only preparation:
  fixed asset identity checks, Page/Instagram pagination, Bearer-header token
  use, URL credential redaction, mutation rejection, and sanitized pagination
  metadata. No real token or raw response is stored.
- The preferred unattended model to validate is a least-privilege Business
  Portfolio system-user token assigned only to the Page/Instagram assets; the
  proven user-token/Page-token chain remains a controlled fallback. No token
  model has been created or configured.
- Owner-facing Meta token installation and probing are implemented as
  `npm run meta:store-token` and `npm run meta:probe`. Installation reads stdin
  only and writes mode-600 `.local/meta-access-token.json`; probing uses fixed
  owner-confirmed IDs and persists only redacted health/report data. Graph
  error codes 10 and 190 are classified explicitly. No real Meta credential was
  requested or installed.
- The first real system-user probe authenticated Page identity and read 100
  Instagram media records, but Page own-post reads returned Graph code 190.
  Because Instagram succeeded, this is classified as
  `SYSTEM_USER_PAGE_READ_TOKEN_CONTEXT_UNSUPPORTED_OR_UNAUTHORIZED`, not a
  globally invalid token. System-user viability is partial pending a Meta
  decision about compatible Page-token context/asset authorization.
- Meta authentication is now intentionally dual-credential: the existing
  system-user token is used only for Instagram media, while
  `npm run meta:authorize-page` obtains and validates a separate Page token
  for Page own-post reads. The final Page token is stored only at ignored
  mode-600 `.local/meta-page-access-token.json`; the intermediate user token is
  not persisted. `npm run meta:probe` routes each endpoint to its required
  token type and reports dual-model viability without exposing credentials.
- Meta's owner-confirmed redirect URI is HTTPS-only:
  `https://127.0.0.1:8789/oauth2callback`. The Page OAuth callback now uses an
  actual local HTTPS server with mkcert certificate/key files under ignored
  `.local/`; it fails closed rather than weakening TLS. The exact redirect URI
  is reused for authorization and token exchange.
- The Page OAuth bootstrap now requests only `business_management`,
  `pages_show_list`, `pages_read_engagement`, and `public_profile`, verifies
  `/me/permissions` before `/me/accounts`, and fails specifically when
  `business_management` is absent. If permissions are granted but
  `/me/accounts` remains empty, the next investigation is a Facebook Login for
  Business Configuration ID; no workaround or broader permission is used.
- The Page OAuth boundary is intentionally limited to the owner-confirmed
  Facebook Page: it validates the exact Page ID/name and stores that Page
  token, but does not require `instagram_business_account` to be returned.
  Instagram linkage is validated separately with the system-user credential
  in `npm run meta:probe`; the Page OAuth flow never expands its scopes to
  make that diagnostic pass.
- Stop infrastructure migration work after this bounded inventory. Return to
  canonical content/provenance, the real event source, structured venue/event
  data, and public information architecture.
- Use `/` as the root directory, set `SKIP_DEPENDENCY_INSTALL=1`, and use
  `npm ci && npm run build` as the build command,
  `npx wrangler@4.122.0 deploy` as the production deploy command, and
  `npx wrangler@4.122.0 versions upload` as the non-production deploy command.
- Do not remove Vercel rollback hosting or alter apex DNS, wildcard/
  `festa.altrospazio.org`, or external profiles without explicit authorization.

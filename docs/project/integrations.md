# Integrations

Last updated: 2026-08-13

## Source / integration matrix

| Source | Access status | Data available | Auth needed | Public/private | Refresh cadence | Technical approach | Blocker |
|---|---|---|---|---|---|---|---|
| Website repo | available | code, content, assets, deploy hints | no | private workspace | continuous | repo inspection + build | none |
| Production website | available | live HTML, headers, redirects | no | public | ad hoc baseline / monitoring | direct fetch + browser audit | none |
| Search Console | unknown | search queries, clicks, impressions, indexing signals | yes | private | daily | server-side scheduled ingestion | ownership/access unknown |
| GA4 | not detected | user event measurement if configured later | yes | private | near-real-time / daily export | privacy-reviewed analytics setup | not configured |
| Google Tag Manager | not detected | tag orchestration | yes | private | as configured | avoid unless clearly justified | not configured |
| Google Business Profile | public presence likely, ownership unknown | listing data, attributes, performance | yes | mixed | daily/weekly | API or manual owner workflow | ownership/access unknown |
| Google Ads | unknown | campaign, conversion, cost data | yes | private | daily | only after measurement prerequisites | account unknown |
| Instagram account | public profile linked | public posts/media; insights if business access exists | yes for API | mixed | daily | server-side API ingestion + cache | access/app permissions unknown |
| Facebook Page | public page linked | page posts/events; insights with access | yes for API | mixed | daily | server-side API ingestion + cache | access/app permissions unknown |
| WhatsApp contact | public click target present | click destination only | no for link, yes for business analytics | public/private | event-based | outbound event measurement | business analytics access unknown |
| Event source | not found | future canonical events dataset | likely | mixed | event-driven / daily sync | choose one canonical source only | source of truth unknown |
| TripAdvisor | public profile found | reviews/profile data under platform terms | yes for non-public data | mixed | occasional | audit only unless approved/legal | ownership/API unknown |
| GPT Engineer script | public script embedded | editor bridge behavior | no | third-party public script | on page load | evaluate and remove only after verification | runtime removal not yet tested |

## Cloudflare hosting/runtime matrix

| Component | Access status | Intended data/use | Auth needed | Public/private | Refresh/cadence | Technical approach | Blocker |
|---|---|---|---|---|---|---|---|
| Workers Static Assets | local configuration prepared; not deployed | serve Vite `dist/` | Cloudflare account/repository authorization | public runtime | per deploy | Workers Builds + Wrangler configuration | account and preview not verified |
| Workers Builds | not configured | GitHub build/deploy and preview versions | Cloudflare/GitHub authorization | deployment control plane | push/PR by branch policy | direct Git integration | account connection not verified |
| DNS/custom domain | zone onboarding/propagation pending; custom domain not attached | DNS and future `www` Worker hostname | Cloudflare zone access | public infrastructure | persistent | account audit, then custom domain | zone not Active; no production cutover |
| Cron Triggers | not configured | future scheduled ingestion | Worker deployment and source credentials | private job control | scheduled UTC cadence | `scheduled()` handler only when needed | no canonical live source yet |
| Workers Secrets | not configured | future server-side Google/Meta credentials | account authorization | private | on job execution | secret bindings, never frontend | no authorized API integration |
| KV | not configured | possible small public feed snapshots | account/resource authorization | public snapshot data only | refresh-driven | add only if static snapshots are insufficient | no demonstrated need |
| D1 | not configured | possible structured event/provenance/sync records | account/resource authorization | private or controlled | transactional | add only if files/KV cannot model requirement | no demonstrated need |
| Access | not configured | future private admin/growth view | account/policy authorization | private | per request | protect a separately justified admin surface | no admin surface exists |

Cloudflare is the preferred future boundary, but no account, zone, DNS, Worker,
storage binding, secret, or Access policy has been changed during this audit.
The first useful proof is a Worker Static Assets preview serving the existing
`dist/` output; storage and runtime additions are deferred until requirements
are recorded.

## Confirmed Cloudflare DNS state

- Zone: `altrospazio.org`, Free plan, onboarding in progress.
- Assigned nameservers: `cris.ns.cloudflare.com`, `lady.ns.cloudflare.com`.
- Registrar nameservers were changed from one.com; Cloudflare is waiting for
  propagation.
- DNSSEC was disabled at one.com before delegation and must not be enabled in
  Cloudflare yet.
- Vercel-oriented production records remain DNS-only.
- Proton Mail records migrated: MX, SPF, Proton verification, DMARC, and three
  DKIM CNAME records.
- Redirect-only hosts being replaced: `menu.altrospazio.org` to
  `https://leggimenu.it/menu/laltrospazio`; `gruppo.altrospazio.org` to
  `https://altrospazio.org/menu.html`.
- No `www` cutover or Worker custom domain exists yet.

## GPT Engineer script finding

Current evidence from public search results indicates:
- the script is associated with Lovable / GPT Engineer generated projects
- it supports editor-origin messaging, DOM selection, highlighting, inline editing, and style overrides
- allowed origins shown in indexed code snippets include `https://gptengineer.app`, `http://localhost:3000`, and `https://lovable.dev`
- the script appears intended for embedded editing/preview workflows rather than end-user venue functionality

Current local evidence:
- it is only referenced in `index.html`
- app code does not import or call it

Current assessment:
- functional dependency for ordinary site rendering appears unlikely
- privacy/performance cost exists because it adds a third-party script request and possible editor messaging logic
- removal should be tested in local preview or a non-production preview before deletion

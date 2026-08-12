# Current state

Last updated: 2026-08-13

## What this repo currently is

- Frontend: Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui
- Hosting target observed in production: Vercel (migration not started)
- Public site pattern today: single-page static venue site rendered from `src/pages/Index.tsx`
- Current branch for audit work: `laltrospazio-phase0-audit`
- Canonical GitHub repository: `git@github.com:spac-null/laltrospazio-digital.git`

## Production relationship

- Production URL: `https://www.altrospazio.org/`
- Apex redirect observed: `https://altrospazio.org` -> `https://www.altrospazio.org/` via HTTP 308 on 2026-08-12
- Live HTML broadly matches this repo’s current app structure and content
- No GitHub Pages configuration found in repo
- No GitHub Actions deployment workflow found in repo
- A minimal `wrangler.jsonc` now defines Worker Static Assets from `dist/` with
  SPA fallback; no account deployment has been performed.

## Current repo findings

- Existing pre-audit dirty change: `package-lock.json` was already modified and must remain untouched unless explicitly requested
- `robots.txt` and `sitemap.xml` were missing from production during the initial audit
- Base document language had been `en`; corrected locally to `it`
- Canonical URL and robots metadata are now present locally
- No structured event/content system exists in repo yet
- No GA4 or GTM detected in repo or live HTML
- Project memory has been moved from obsolete `.claude/` files into `docs/project/`
- A machine-readable provenance layer now exists at `docs/project/content-provenance.json`

## Current risk areas

- Public homepage contains multiple unsupported or unverified factual claims
- Named testimonials in current homepage copy have no provenance in repo
- Accessibility/program claims are mixed with marketing copy and need structured verification
- Public discovery ecosystem appears inconsistent across third-party listings
- Current Vercel behavior includes a `festa.altrospazio.org` host rewrite that
  must be accounted for before hosting migration

## Hosting re-evaluation

- Preferred future target: Cloudflare Worker Static Assets serving the existing
  Vite `dist/` output, connected directly to GitHub through Workers Builds.
- Cloudflare Pages is a viable fallback/comparison option; GitHub Pages is a
  fallback only.
- The existing build passes and emits a Workers-compatible static asset tree.
- Cloudflare onboarding is in progress for the `altrospazio.org` zone on Free.
- Assigned nameservers are `cris.ns.cloudflare.com` and
  `lady.ns.cloudflare.com`; propagation is pending.
- DNSSEC was disabled at one.com and must remain disabled until the zone is
  Active and DNS has been verified.
- Phase 1 is DNS migration while Vercel remains production. Phase 2 is the
  parallel Worker preview. Phase 3 is a separately approved production cutover.
- Vercel-oriented DNS records remain DNS-only. Proton Mail records have been
  migrated. Menu and group redirect hosts are being replaced with Cloudflare
  Single Redirects using proxied `192.0.2.1` records.
- No DNS, custom domain, production traffic, or Worker deployment has been
  changed by this workspace.

## Latest validation

- `npm run build`: passed on 2026-08-13; Vite emitted `dist/` with the expected
  SPA assets and public files.
- `npm run lint`: existing baseline failure, unrelated to this hosting review:
  four errors in generated/UI/config files (`command.tsx`, `textarea.tsx`,
  `tailwind.config.ts`, and `vercel.js`) plus warnings. No lint fix was made.
- `package-lock.json`: pre-existing dirty change; not modified, staged, or
  included in this work.
- Git remote now points to `git@github.com:spac-null/laltrospazio-digital.git`
  for fetch and push. The original local `main` history was pushed to the new
  repository as `main` on 2026-08-13.
- `npx wrangler@latest deploy --dry-run`: passed with Wrangler 4.122.0; read 35
  files from `dist/`, found no bindings, and performed no upload.

## Vercel dependency inventory

- `vercel.js` supplies `cleanUrls` and the host-specific rewrite for
  `festa.altrospazio.org`; it is deployment behavior, not app content.
- `@vercel/speed-insights` is imported by `src/App.tsx` and rendered as
  `<SpeedInsights />`.
- No other Vercel references were found outside these files and project docs.
- These items remain in place while Vercel is production. Removal or
  replacement requires a successful Worker preview comparison.

## Local workdir rename

- Current path: `/Users/stargatesgx/code/landing-space-generator`.
- Target path: `/Users/stargatesgx/code/laltrospazio-digital` (currently absent).
- The active Codex workspace is path-bound; it was not renamed during this
  session.
- Safe next-session operation: close/end the current workspace session, move
  the directory to the target path, reopen the repository from the target path,
  then verify `pwd`, `git status`, `git remote -v`, and the build. Do not rename
  the directory while this session is active.

## GPT Engineer script status

- `https://cdn.gpteng.co/gptengineer.js` is present in `index.html`
- Current evidence indicates it is a Lovable / GPT Engineer editor bridge script, not core app logic
- Current repo code does not reference it directly
- Search evidence indicates the script posts messages to allowed editor origins and supports DOM selection/edit overlays
- Script removal has not yet been runtime-tested locally or in preview, so it remains in place for now

## Current docs to read before major work

- `docs/project/architecture.md`
- `docs/project/integrations.md`
- `docs/project/content-provenance.md`
- `docs/project/decisions.md`
- `docs/project/roadmap.md`

## Next action

- Push and verify `laltrospazio-phase0-audit` on the canonical repository, then
  connect `spac-null/laltrospazio-digital` to Cloudflare Workers Builds and
  create a non-production preview using `wrangler.jsonc`.

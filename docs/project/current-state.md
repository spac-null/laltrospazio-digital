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
- Apex redirect behavior and `festa.altrospazio.org` were not modified in the
  production cutover.
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
- `curl -I https://festa.altrospazio.org` and
  `curl -L https://festa.altrospazio.org`: both failed with host-resolution
  errors on 2026-08-12, so the seasonal hostname is not currently reachable via
  public DNS from this environment.
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
  `docs/project/parity-audit-2026-08-13.md`. The Worker remains unpromoted and
  no production DNS or custom domain was changed.

## Vercel dependency inventory

- `vercel.js` supplies `cleanUrls` and the host-specific rewrite for
  `festa.altrospazio.org`; it is deployment behavior, not app content.
- Public DNS for `festa.altrospazio.org` did not resolve from this environment
  on 2026-08-12, so the rewrite exists in config even though the hostname is
  not currently reachable here.
- No Vercel runtime dependency remains in the app source or canonical npm
  dependency graph. The Worker preview comparison passed before this cleanup.
- `vercel.js` remains as deployment configuration for the separate Vercel
  project and is not part of the Worker runtime.

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
- Production custom domain is `www.altrospazio.org`; apex DNS, wildcard/
  `festa.altrospazio.org`, and Vercel project state were not changed.
- The apex currently returns an unchanged Vercel `308` redirect to
  `https://www.altrospazio.org/`; `www` returns the Cloudflare Worker site.

## Next action

- Keep custom domains and production DNS unchanged while the dependency audit
  and remaining content verification continue.
- Use `/` as the root directory, set `SKIP_DEPENDENCY_INSTALL=1`, and use
  `npm ci && npm run build` as the build command,
  `npx wrangler@4.122.0 deploy` as the production deploy command, and
  `npx wrangler@4.122.0 versions upload` as the non-production deploy command.
- Do not remove Vercel rollback hosting or alter apex DNS, wildcard/
  `festa.altrospazio.org`, or external profiles without explicit authorization.

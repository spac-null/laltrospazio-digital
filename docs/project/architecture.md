# Architecture

Last updated: 2026-08-13

## Current architecture

- Vite SPA
- React client renders the public website
- Static assets live in `public/`
- Vercel currently serves production, based on the previous public-header audit
- No visible backend or CMS in this repo

## Vercel dependencies retained during migration

- `vercel.js` controls `cleanUrls` and the `festa.altrospazio.org` host rewrite.
- `@vercel/speed-insights` and `<SpeedInsights />` provide current Vercel
  performance instrumentation.
- No other Vercel-specific references were found in application/configuration
  files.

These remain until the Cloudflare preview demonstrates equivalent routing and
the measurement decision is made. The migration must not silently discard
performance measurement.

## Hosting decision under review

Cloudflare is now the preferred hosting target because Jascha already operates
Cloudflare for DNS, Workers, scheduled jobs, secrets, and private-access
capabilities. GitHub remains the canonical source-control and project-memory
system.

Preferred future shape:

```text
GitHub repository
  -> Cloudflare Workers Builds / Git integration
  -> Worker Static Assets (Vite dist/)
  -> www.altrospazio.org
```

This is a hosting evaluation and migration plan, not a production cutover.
DNS, custom domains, Vercel, and traffic remain unchanged until a parallel
deployment passes functional, accessibility, performance, and SEO checks.

Workers Static Assets is the leading candidate because the existing
`npm run build` already produces `dist/`, SPA fallback is supported, static
assets can be served without runtime code, and runtime code can be added later
for justified APIs or scheduled ingestion. Workers Builds supports direct
GitHub integration and preview versions.

References: [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/),
[Workers Builds Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/),
[Workers Builds previews](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/),
[Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

### Hosting comparison

| Option | Assessment | Decision |
| --- | --- | --- |
| Cloudflare Worker + Static Assets | Fits the Vite output, existing Cloudflare operating context, future cron/API/secrets, and direct GitHub builds | Preferred candidate |
| Cloudflare Pages | Viable static deployment, but a separate product model when future Worker runtime may be needed | Fallback/comparison |
| Vercel | Current production and simplest continuity path | Keep until migration is proven |
| GitHub Pages | Possible static fallback, but conflicts with the preferred Cloudflare separation | Fallback only |

### Minimum initial Cloudflare architecture

Start with only a Workers-compatible configuration pointing at `dist/`, a
Worker Static Assets deployment, GitHub-to-Cloudflare build integration, and a
non-production preview workflow. Add a custom domain only after validation and
explicit cutover approval.

Do not add KV, D1, Access, API routes, or scheduled jobs until a concrete
requirement exists.

### Safe parallel deployment plan

1. Confirm the Cloudflare account/zone and repository connection in the
   dashboard; this requires Jascha’s account access but no DNS change.
2. Add and validate a Workers configuration on the feature branch using the
   existing build and `dist/` output, with SPA fallback and all public assets.
3. Connect the repository to Workers Builds with the production branch excluded
   from automatic production promotion during the trial; use preview versions
   for pull requests or non-production branches.
4. Test routes, assets, PDF access, mobile behavior, keyboard/screen-reader
   behavior, robots/sitemap, canonical metadata, and external links.
5. Reconcile the Vercel-only `festa.altrospazio.org` host rewrite before any
   cutover; preserve, separately map, or retire it only by owner-approved
   decision.
6. Audit the live Cloudflare DNS zone and record apex, `www`, email, and
   seasonal-host records before proposing changes.
7. Only after approval, attach `www.altrospazio.org` as a Worker Custom Domain,
   establish apex redirect behavior, and execute a reversible cutover with
   Vercel retained for rollback.

### Current DNS/account evidence

- Cloudflare onboarding is in progress for the `altrospazio.org` zone on the
  Free plan.
- Assigned authoritative nameservers are `cris.ns.cloudflare.com` and
  `lady.ns.cloudflare.com`; registrar nameservers have been changed from one.com
  and propagation is pending at Cloudflare.
- DNSSEC was disabled at one.com before the nameserver change. Cloudflare DNSSEC
  must remain disabled until the zone is Active and the migration is verified.
- Existing Vercel-oriented apex, `www`, wildcard, `program`, and `qr` records
  remain DNS-only during Phase 1.
- Proton Mail MX/SPF/verification/DMARC and three DKIM CNAME records have been
  migrated to Cloudflare.
- `menu.altrospazio.org` and `gruppo.altrospazio.org` are being replaced by
  Cloudflare Single Redirects backed by explicit proxied `192.0.2.1` A records.
- No production traffic has been moved from Vercel and no Worker custom domain
  has been attached.

## Recommended data/runtime direction

Keep the frontend static-first, with Cloudflare as the eventual runtime boundary:

1. static frontend
2. scheduled ingestion jobs
3. normalized cached venue data
4. private metrics snapshots for internal use

This fits the current repo because:
- the site is already static-first
- secrets should stay server-side
- most value comes from freshness and structure, not per-request personalization
- cached snapshots give better failure tolerance than direct third-party API calls from the browser
- the Vite output is directly deployable as static assets

## Recommended data boundaries

Public website data:
- venue identity
- locations
- contact
- hours when verified
- events
- access information
- announcements
- selected social-derived content

Private operational/growth data:
- Search Console metrics
- Business Profile performance
- analytics summaries
- sync health and failures

## Failure behavior

- if a feed fails, show last valid cached data
- record source, last successful sync, last attempted sync, and error state
- do not let one broken upstream source break the public site

## Open hosting checks

- verify Cloudflare zone ownership and current DNS records with Jascha’s account
- verify Workers Builds can connect to the `spac-null/laltrospazio-digital`
  repository under the intended Cloudflare account
- create a non-production Worker preview and compare it to current Vercel
- verify `festa.altrospazio.org` behavior before any custom-domain change

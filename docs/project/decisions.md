# Decisions

Last updated: 2026-08-13

- Treat repo documentation as the project memory, not chat history.
- Treat production linkage as an account-level fact; do not infer it from
  branch names or matching historical deployment content.
- Do not deploy exploratory work directly to production.
- Preserve pre-existing dirty worktree changes and record them.
- Prefer static frontend + scheduled ingestion + cached normalized data.
- Do not treat current public homepage claims as canonical without provenance.
- Keep accessibility as a system requirement, not a rhetorical theme.
- Do not introduce new marketing claims during technical-foundation work.
- Leave `gptengineer.js` in place until removal is verified in a safe preview workflow.
- Prefer Cloudflare Worker Static Assets as the next hosting target because the
  existing Vite app already builds to `dist/` and the operating account already
  includes Cloudflare infrastructure.
- Keep Vercel production unchanged until a parallel Cloudflare preview is
  validated and an owner-approved cutover plan exists.
- Treat GitHub Pages as a fallback, not the preferred target; evaluate Cloudflare
  Pages only as a comparison option.
- Add Cron, KV, D1, API routes, Secrets, or Access only when a documented
  requirement justifies each component.
- Keep public venue data separate from private analytics and credentials.
- Do not infer Cloudflare zone ownership or DNS-provider control from repository
  evidence; require account-level verification.
- Treat Cloudflare migration as separate phases: DNS delegation with Vercel
  still serving production, a parallel Worker preview, then an approved hosting
  cutover.
- Keep Cloudflare DNSSEC disabled until final DNS verification is complete, then
  re-enable it separately.
- Keep `vercel.js` and Vercel Speed Insights during the parallel phase; remove
  or replace them only after preview behavior and measurement have been tested.
- Merge `laltrospazio-phase0-audit` into the new repository's `main` after the
  phase commit audit. Vercel remains unchanged because it is linked to the
  separate `landing-space-generator` repository.
- Test `gptengineer.js` removal only in a non-production Worker preview using a
  build-time flag, not by changing the default build output.

# GPT Engineer Preview Removal

Status: proposed
Start date: 2026-08-12
End date:

Hypothesis:

The public site does not require `gptengineer.js` for visitor-facing rendering or
navigation, so a Worker preview can remove it without changing visible behavior.

Change:

Strip the script automatically only when Cloudflare Workers Builds reports
`WORKERS_CI_BRANCH=preview/gptengineer-removal`. An explicit local
`STRIP_GPTENGINEER_SCRIPT=1` override remains available, while normal local,
Vercel-style, and `main` Worker builds retain the script by default.

Metric:

- preview HTML omits the third-party script tag
- visual rendering matches current Vercel production
- navigation, external links, PDFs, and console behavior remain acceptable

Time window:

First Worker preview validation session

Result:

Decision:

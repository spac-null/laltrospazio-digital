# GPT Engineer Preview Removal

Status: proposed
Start date: 2026-08-12
End date:

Hypothesis:

The public site does not require `gptengineer.js` for visitor-facing rendering or
navigation, so a Worker preview can remove it without changing visible behavior.

Change:

Enable `STRIP_GPTENGINEER_SCRIPT=1` only in the Cloudflare Workers
non-production build configuration, leaving normal local and Vercel-style builds
unchanged.

Metric:

- preview HTML omits the third-party script tag
- visual rendering matches current Vercel production
- navigation, external links, PDFs, and console behavior remain acceptable

Time window:

First Worker preview validation session

Result:

Decision:

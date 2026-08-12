# Content provenance

Last updated: 2026-08-12

This project separates:

- factual claims and their provenance
- unresolved facts
- editorial/marketing copy

The machine-readable factual layer lives in:

- `docs/project/content-provenance.json`

## Status meanings

- `verified`: verified directly from controlled source material in this project or another strong primary source
- `owner_confirmed`: confirmed by owner/operator but not yet independently evidenced in repo/public primary material
- `externally_supported`: supported by multiple public external sources, but not yet confirmed by owner/system of record
- `unverified`: currently presented as fact, but lacking adequate support
- `conflicting`: competing public evidence exists
- `outdated`: evidence suggests the claim may have been true previously but should not be treated as current
- `remove`: should be removed from public copy unless later re-supported

## Current rule

Do not promote a claim from `unverified`, `conflicting`, `outdated`, or `remove` into new public copy without new evidence.

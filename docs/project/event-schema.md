# Canonical Event Content Model

Production event records are individual JSON files in `content/events/<slug>.json`.
The directory is currently empty because no event has been authorized for
publication. Test fixtures are in-memory only.

Each record has two status axes:

- `publication_status`: `draft`, `published`, or `archived`.
- `event_status`: `scheduled`, `cancelled`, or `postponed`.

This preserves the requested lifecycle vocabulary without making a cancelled
event indistinguishable from a draft. Only `publication_status: "published"`
records enter the generated public snapshot. Published cancelled and postponed
records remain addressable so their state can be communicated.

Required fields are `id`, `slug`, `title`, `start`, `end`, `timezone`,
`location.venue_id`, `location.name`, `description`, `source`,
`published_at`, and `updated_at`. Published records require an ISO source URL;
dates must carry an explicit offset and use a valid IANA timezone. A cancelled
record requires a reason and announcement date. A postponed record requires a
reason and either a new start date or an explicit null.

`content/venue.json` is the canonical venue implementation record. It is a
public-safe projection of `docs/project/venue-record.json`: conflicting,
unverified, and unknown fields are intentionally omitted. The build step
validates both sources, writes `src/generated/content.ts`, and regenerates
`public/sitemap.xml` with `/eventi` and every published event page.

## Editorial and automation boundary

The current fallback is a reviewed Git change to a single event file. Future
inputs should create candidate/draft records, run the same deterministic
validation, and require owner approval before changing `publication_status` to
`published`. Social/API imports never publish directly.

The next thin editorial surface can be a Cloudflare Access-protected API that
writes these records, with audit history and the same build validator. D1,
KV, Cron, and a full admin UI are not justified until file-based editing is an
actual operational blocker.

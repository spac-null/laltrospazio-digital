# Operational Notices

Operational notices are canonical content distinct from events. Records live
in `content/notices/<slug>.json` and use a small lifecycle model:

- `type`: `temporary_closure`, `exceptional_opening`, `location_change`,
  `sold_out`, or `service_interruption`.
- `publication_status`: `draft`, `published`, or `archived`.
- `valid_from` is inclusive and `valid_until` is exclusive calendar date.
- `timezone` controls date evaluation; current records use `Europe/Rome`.
- `source` and `owner_confirmed` preserve the approval boundary.

The build validates records and generates them into the public content
snapshot. The homepage filters the snapshot at runtime by the venue-local
calendar date. This means the current closure is shown through 26 August 2026
and disappears at `2026-08-27 00:00 Europe/Rome`. The record intentionally has
no reopening time because none is confirmed.

This pattern is deliberately file-based and database-free:

`canonical notice -> validation -> generated public output -> date-aware display -> automatic expiry`

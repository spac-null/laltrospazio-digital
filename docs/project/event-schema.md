# Minimal Event Data Model

Initial representation: a versioned `content/events.json` file in the
repository. No database or third-party runtime calls are required for the
first implementation.

```json
{
  "id": "2026-09-12-example-slug",
  "status": "draft",
  "title": "",
  "slug": "",
  "start": "2026-09-12T20:30:00+02:00",
  "end": null,
  "timezone": "Europe/Rome",
  "recurrence": null,
  "location": {
    "venue_id": "l-altro-spazio-bologna",
    "name": "L'Altro Spazio",
    "address": null,
    "coordinates": null
  },
  "description": "",
  "image": null,
  "booking_url": null,
  "accessibility": {
    "summary": null,
    "details": [],
    "status": "unverified"
  },
  "source": {
    "type": "owner_registry",
    "url": null,
    "retrieved_at": null,
    "source_event_id": null
  },
  "published_at": null,
  "updated_at": "2026-08-13",
  "notes": null
}
```

## Rules

- `status` is one of `draft`, `published`, `cancelled`, `postponed`, or
  `archived`.
- `published` requires a title, start time, location, description or short
  summary, and a source reference.
- Dates must include an offset or use `Europe/Rome`; never infer a timezone.
- A recurring event stores a recurrence rule plus explicit exceptions and
  cancellations. It does not generate public occurrences until validated.
- Historical events remain in the same file with `archived` status and their
  original source URL.
- Accessibility is event-specific. Venue-level claims do not automatically
  transfer to an event.
- Missing image, booking URL, end time, or accessibility detail is valid null
  data, not a reason to invent a value.

## Automation boundary

| Stage | Implementation | Failure behavior | Cadence |
|---|---|---|---|
| Input | Owner edits one registry; optional social/API imports create drafts only | No source change means no new event | On update |
| Normalization | Build-time schema validation and date normalization | Reject invalid records; keep last valid published snapshot | Every build |
| Validation | Required fields, dates, status, source URL, duplicate IDs | Block publication of invalid records; report actionable errors | Every build |
| Cache/storage | Versioned JSON in Git; generated static output | Serve last committed valid snapshot | Per deploy |
| Public output | Upcoming list, event detail pages, archive, JSON-LD where complete | Omit drafts and invalid records | Per deploy |
| Human action | Approve/edit drafts, cancellations, recurring exceptions, accessibility facts | No automatic publication from untrusted mirrors | As needed |

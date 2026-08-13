# Event Source Inventory: 2026-08-13

This is a bounded source assessment. It does not assert any current or
upcoming event without a current owner-controlled source.

## Findings

| Source | Authority | Structure | History | Upcoming | Frequency | API/feed | Cost | Reliability | Recommended role |
|---|---|---|---|---|---|---|---|---|---|
| Repository and current website | Canonical for deployed copy; no event owner workflow | No event records or feed; generic activity copy only | No | No | On deploy | None found | Low | High for present static copy, zero for event freshness | Venue baseline and public output, not event source |
| Official Instagram `@laltrospazio` | Likely operational source; owner/API access unverified | Posts, reels, stories; dates are unstructured | Potentially | Potentially | Frequent/irregular | Instagram Graph API possible only with owner permissions and suitable account/app setup | Medium-high | Potentially high after owner confirmation; currently inaccessible to automated retrieval | Primary operational announcement channel and candidate ingestion source |
| Official Facebook page | Likely operational mirror; owner/API access unverified | Posts/events, dates may be structured or embedded in copy | Potentially | Potentially | Frequent/irregular | Meta Graph API possible only with Page access/token | Medium-high | Potentially high after owner confirmation; public retrieval was blocked | Complementary announcement channel and fallback ingestion source |
| Google Maps / Business Profile | Strong venue identity source; ownership unverified | Place identity, address, coordinates, hours, updates/posts | Some | Not a dependable event calendar | Irregular | Business Profile APIs require owner access; no public event feed established | Medium | Strong for identity after owner confirmation; weak for events | Canonical venue identity/discovery, not event source |
| Cultura Bologna | Institutional/editorial publisher | Structured event pages with dates, location, access, description, images | Yes | Only when submitted/published | Per submission | No feed/API established | High/manual | Strong for published past events; not complete | Secondary provenance and discovery |
| Cheventi | Third-party aggregator | JSON-LD event objects with dates, descriptions, locations, offers | Yes | Claims upcoming, but stale records observed | Irregular/crawl-based | Page JSON-LD available; no owner-authoritative feed | Medium | Useful historical mirror; not authoritative. Organizer page labeled 2026 contained 2025 events | Secondary history/discovery only |
| OggiBo | Third-party local directory in development | Venue record plus event list | Limited | Page currently says no events | Unknown | No stable feed established | Medium | Low for current events; useful corroborating venue evidence | Secondary discovery only |
| Ticket/event platforms | No L'Altro Spazio canonical account or current feed found | Platform-specific | Unknown | Unknown | Unknown | Platform APIs vary and require account ownership | Unknown/high | Unverified | Do not ingest until a current owner-controlled account is identified |

## Historical event evidence

Public secondary records establish that the venue has hosted recurring or
repeatable formats including Spazi Migranti, Serata Erasmus, exhibitions,
concert series, Pasta & Friends, Cena al Buio, and DJ formats. These are
historical patterns only. They are not current or upcoming programming.

The strongest structured historical records reviewed were Cultura Bologna’s
“Mappe del possibile” page for 5–8 February 2026 and Cheventi JSON-LD records
for 2023–2025 events. Neither source is sufficient to publish current events
without owner confirmation.

## Canonical-source decision

No canonical event source exists today. The lowest-maintenance target is one
owner-controlled event registry, initially a versioned `content/events.json`
file in this repository. Instagram and Facebook remain publication channels;
they should not be independently treated as truth. A later importer may read
the official social APIs into a review queue, but ingestion must never publish
unreviewed social text directly.

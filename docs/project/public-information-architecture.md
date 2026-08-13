# Public Information Architecture Preparation

This is a content/component plan, not a visual redesign. The public site must
derive factual sections from canonical content and render a useful absence
state instead of filling gaps with generic claims.

| Section | Canonical source | Verified content now | Missing content | Can render now | Absence behavior |
|---|---|---|---|---|---|
| Home / Now | venue record, active notices | venue identity, address, current closure notice | confirmed hours, richer current-program status | Yes | show the active notice; otherwise show ordinary venue status without invented hours |
| Next | published event records | none currently | first real published event | Yes | omit the block or show a concise “nessun prossimo evento confermato” state |
| Events | published event records | empty registry and validated routes | upcoming/archive records | Yes | useful empty state; no fake cards |
| Visit | venue record | Via Nazario Sauro 24/F, Bologna, coordinates, phone, map link | verified opening hours, seasonal location, accessibility facilities | Yes | show only verified contact/location facts |
| Menu | venue record / approved static menu | menu URL and existing static menu assets | menu provenance refresh policy | Yes | retain the verified link; do not claim availability beyond it |
| Access | venue record field authority | no owner-confirmed facility claims | entrances, toilets, step-free route, sensory/access details | Partly | state that details are to be confirmed or omit claims entirely |
| Art / Space | reviewed editorial content and image assets | venue imagery and broad descriptive material | provenance-clean program/archive and current exhibitions | Partly | use specific verified descriptions, not unsupported statistics or testimonials |

The next implementation should add a small venue-first shell around the
existing content rather than redesigning every visual surface at once. The
homepage's first viewport should establish what the venue is, its current
status, and the next useful action; event and visit sections can then be
assembled from the existing normalized boundaries.

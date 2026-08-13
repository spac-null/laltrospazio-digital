# Field Authority Model

Canonical facts are resolved per field, not by selecting one global source.
Each normalized field carries:

```json
{
  "value": "...",
  "source": "google_business_profile",
  "authority_level": "authoritative_feeder",
  "fetched_at": "2026-08-13T12:00:00Z",
  "owner_confirmed_at": null,
  "external_updated_at": null,
  "publication_eligibility": "review",
  "conflict_state": "none"
}
```

Source classes are `owner_confirmed`, `google_business_profile`,
`google_places`, `meta`, `external_editorial`, and `derived`. Authority levels
are `canonical`, `authoritative_feeder`, `comparison_only`, `candidate_only`,
and `derived`.

## Initial policy

| Field | Canonical authority | GBP role | Public rule |
|---|---|---|---|
| Regular hours | GBP after owner-controlled access is confirmed | authoritative feeder | Eligible after access confirmation and validation |
| Special hours | Owner-confirmed operational notice | feeder | Candidate for review; never silently replaces notices |
| Address | Existing canonical venue record | comparison | GBP discrepancies create review items |
| Phone | Existing canonical venue record | comparison | GBP discrepancies create review items |
| Website | Existing canonical venue record | comparison | No automatic replacement |
| Coordinates | Existing canonical venue record | comparison/support | Compare and review meaningful changes |
| Categories/profile | Reviewed external data | feeder | Not automatically asserted as canonical copy |
| Accessibility | Owner-confirmed | candidate/external-supported | Owner confirmation required |
| Events | Canonical event registry | candidate feeder only | Social/directories never publish directly |

The existing provenance statuses remain intact. This model adds source and
authority metadata; it does not promote conflicting or unverified facts.

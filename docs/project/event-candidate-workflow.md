# Real Event Intake Workflow

The candidate layer is separate from `content/events/`. It accepts an owner-
supplied Instagram/Facebook URL, flyer/text source, or event URL and records
only a structured extraction report:

`raw source -> candidate -> validation report -> owner confirmation -> canonical event -> build/publication`

Candidate fields are labelled `extracted`, `inferred`, `missing`,
`conflicting`, or `owner_confirmed`. Extracted means literally present in the
source; inferred means a reasonable interpretation that is not explicit;
conflicting means multiple values were found. Missing and ambiguous required
fields are listed in the approval summary. No candidate command can create a
published event automatically.

## Developer/operator command

Prepare a structured input file outside production content, then run:

```sh
npm run candidate -- /path/to/event-input.json
```

The command writes `content/candidates/<id>.json` with state
`pending_owner_confirmation` and prints a concise approval summary. The input
shape is intentionally friendlier than the canonical event schema:

```json
{
  "candidate_id": "candidate-2026-09-example",
  "source": { "type": "instagram", "url": "https://www.instagram.com/p/..." },
  "fields": {
    "title": "Literal title from the source",
    "start": { "value": "2099-09-12T20:30:00+02:00", "status": "extracted", "evidence": "..." },
    "location": { "value": "L'Altro Spazio", "status": "inferred" },
    "description": "Literal source description"
  }
}
```

Owner confirmation must explicitly settle missing or conflicting required
facts. Only then should a reviewed canonical record be created in
`content/events/<slug>.json` with `publication_status: "published"`. The
existing deterministic content validator and build remain the final gate.

This command is an engineering fallback, not the intended permanent staff
workflow. If the first real-event proof is low-friction, the next step is a
small Access-protected editor that writes the same candidate format and keeps
the approval boundary intact. Meta ingestion remains a later candidate source.

import assert from "node:assert/strict";
import test from "node:test";
import { buildCandidates, fromD1Row } from "../scripts/candidate-review-lib.mjs";
import { render } from "../scripts/candidates-show.mjs";

const NOW = new Date("2026-08-14T12:00:00Z");

function d1Row(overrides = {}) {
  return {
    network: "facebook",
    source_id: "fb-1",
    source_account_id: "264601140373284",
    source_timestamp: "2026-09-03T10:00:00Z",
    message_or_caption: null,
    permalink: "https://www.facebook.com/laltrospazio.bologna/posts/1",
    media_type: null,
    candidate_signals: JSON.stringify({ event_like: false, notice_like: false, explicit_date: false }),
    ...overrides,
  };
}

test("render() never throws on a sparse unknown candidate with empty fields", () => {
  const rows = [d1Row({ message_or_caption: "Buongiorno a tutti dallo staff!" })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.doesNotThrow(() => render(candidates[0]));
});

test("an operational notice candidate has a null title_suggestion, and render() does not crash on it", () => {
  const rows = [d1Row({ message_or_caption: "Attenzione: chiusura straordinaria per lavori", candidate_signals: JSON.stringify({ event_like: false, notice_like: true, explicit_date: false }) })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  assert.equal(candidates[0].fields.title_suggestion, null, "precondition: title_suggestion really is a bare null, not an object");
  const output = render(candidates[0]);
  assert.match(output, /title_suggestion: \(none\) \[missing\]/);
  assert.match(output, /title: \(none\) \[missing\]/);
});

test("a candidate with missing optional date/location fields renders '(none) [missing]' instead of throwing", () => {
  const rows = [d1Row({ message_or_caption: "Serata speciale, ingresso libero per tutti!", candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: false }) })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const output = render(candidates[0]);
  assert.match(output, /start_date: \(none\) \[missing\]/);
  assert.match(output, /title: \(none\) \[missing\]/);
});

test("a fully populated event candidate (with a title suggestion) renders all fields without crashing", () => {
  const rows = [d1Row({
    message_or_caption: "Serata Jazz\nStasera dalle 21:00 vi aspettiamo con musica dal vivo il 03/09/2026",
    candidate_signals: JSON.stringify({ event_like: true, notice_like: false, explicit_date: true }),
  })];
  const { candidates } = buildCandidates(rows.map(fromD1Row), { now: NOW });
  const output = render(candidates[0]);
  assert.match(output, /title_suggestion: "Serata Jazz" \[inferred\]/);
  assert.match(output, /start_date: "2026-09-03" \[extracted\]/);
});

test("a raw null value inside the fields object (the exact reported crash shape) is rendered safely", () => {
  const candidate = {
    candidate_id: "meta-synthetic-null-field-test",
    candidate_type: "event",
    classification_reasons: ["synthetic"],
    date_state: "single_explicit_date",
    recurring_series: null,
    time_relevance: "upcoming",
    sources: [{ network: "facebook", source_id: "1", source_account_id: "x", source_timestamp: "2026-09-01T00:00:00Z", permalink: "https://x" }],
    fields: { title: null, title_suggestion: null, start_date: { value: "2026-09-03", status: "extracted", evidence: "3 settembre" } },
    missing_fields: ["title"],
    conflicting_fields: [],
    ambiguous_fields: [],
    inferred_fields: [],
    promotion_readiness: "blocked",
    blocked_reasons: ["missing required field(s): title"],
    review_priority: "high",
    review_priority_why: ["synthetic"],
    next_owner_action: "Confirm a title.",
  };
  assert.doesNotThrow(() => render(candidate));
  const output = render(candidate);
  assert.match(output, /title: \(none\) \[missing\]/);
  assert.match(output, /start_date: "2026-09-03" \[extracted\]/);
});

test("render() tolerates a completely minimal/malformed candidate object without throwing", () => {
  assert.doesNotThrow(() => render({}));
  assert.doesNotThrow(() => render({ candidate_id: "x", fields: null, sources: null, missing_fields: null }));
});

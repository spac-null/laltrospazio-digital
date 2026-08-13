import assert from "node:assert/strict";
import test from "node:test";
import { approvalSummary, createCandidate, validationReport } from "../scripts/candidate-lib.mjs";

const input = (fields = {}) => ({ candidate_id: "candidate-test", source: { type: "instagram", url: "https://instagram.com/p/example" }, fields });

test("literal source values are extracted and missing required fields are reported", () => {
  const candidate = createCandidate(input({ title: "Real event", description: "Source text" }));
  assert.equal(candidate.fields.title.status, "extracted");
  assert.deepEqual(validationReport(candidate).missing, ["start", "timezone", "location"]);
  assert.match(approvalSummary(candidate), /READY TO PUBLISH: No/);
});

test("inferred and conflicting values are never ready", () => {
  const candidate = createCandidate(input({ title: "Event", start: { value: "2099-01-01T20:00:00+01:00", status: "inferred" }, timezone: "Europe/Rome", location: { value: "L'Altro Spazio", status: "conflicting" }, description: "Details" }));
  assert.deepEqual(validationReport(candidate).ambiguous, ["start", "location"]);
  assert.equal(validationReport(candidate).ready_to_publish, false);
});

test("owner confirmation is required even when fields are complete", () => {
  const candidate = createCandidate(input({ title: "Event", start: "2099-01-01T20:00:00+01:00", timezone: "Europe/Rome", location: "L'Altro Spazio", description: "Details" }));
  assert.equal(validationReport(candidate).ready_to_publish, false);
  candidate.state = "owner_confirmed";
  assert.equal(validationReport(candidate).ready_to_publish, true);
});

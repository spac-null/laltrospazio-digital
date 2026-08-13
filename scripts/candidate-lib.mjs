import fs from "node:fs";
import path from "node:path";

export const CANDIDATE_FIELDS = ["title", "start", "end", "timezone", "location", "description", "image", "booking_url", "accessibility"];
export const REQUIRED_CANDIDATE_FIELDS = ["title", "start", "timezone", "location", "description"];
export const FIELD_STATUSES = ["extracted", "inferred", "missing", "conflicting", "owner_confirmed"];

const statusFor = (field) => {
  if (field === undefined || field === null || field === "") return "missing";
  if (typeof field === "object" && field.status) return field.status;
  return "extracted";
};

const valueFor = (field) => (typeof field === "object" && field !== null && "value" in field ? field.value : field);

export function createCandidate(input) {
  if (!input || typeof input !== "object") throw new Error("Candidate input must be an object");
  if (!input.source?.type || !input.source?.url) throw new Error("Candidate source.type and source.url are required");
  const fields = Object.fromEntries(CANDIDATE_FIELDS.map((name) => {
    const raw = input.fields?.[name];
    const status = statusFor(raw);
    if (!FIELD_STATUSES.includes(status)) throw new Error(`Invalid status for ${name}: ${status}`);
    return [name, { value: valueFor(raw), status, evidence: typeof raw === "object" && raw?.evidence ? raw.evidence : null }];
  }));
  return {
    candidate_version: 1,
    candidate_id: input.candidate_id ?? `candidate-${Date.now()}`,
    state: "pending_owner_confirmation",
    source: input.source,
    fields,
    created_at: input.created_at ?? new Date().toISOString(),
  };
}

export function validationReport(candidate) {
  const missing = [];
  const ambiguous = [];
  for (const name of REQUIRED_CANDIDATE_FIELDS) {
    const field = candidate.fields?.[name];
    if (!field || field.status === "missing") missing.push(name);
    if (field?.status === "inferred" || field?.status === "conflicting") ambiguous.push(name);
  }
  return {
    missing,
    ambiguous,
    ready_to_publish: missing.length === 0 && ambiguous.length === 0 && candidate.state === "owner_confirmed",
  };
}

export function approvalSummary(candidate) {
  const field = (name) => candidate.fields?.[name] ?? { value: null, status: "missing" };
  const display = (name) => field(name).value ?? "[missing]";
  const report = validationReport(candidate);
  const needs = [...report.missing.map((name) => `${name} is missing`), ...report.ambiguous.map((name) => `${name} needs owner confirmation (${field(name).status})`)];
  return [
    "EVENT CANDIDATE",
    "",
    `Title: ${display("title")}`,
    `Date/start: ${display("start")}`,
    `End: ${display("end")}`,
    `Timezone: ${display("timezone")}`,
    `Location: ${display("location")}`,
    `Image: ${display("image")}`,
    `Description: ${display("description")}`,
    `Booking/info: ${display("booking_url")}`,
    `Accessibility: ${display("accessibility")}`,
    "",
    "SOURCE",
    `${candidate.source.type} ${candidate.source.url}`,
    "",
    "MISSING / NEEDS CONFIRMATION",
    ...(needs.length ? needs.map((item) => `- ${item}`) : ["- none"]),
    "",
    `READY TO PUBLISH: ${report.ready_to_publish ? "Yes" : "No"}`,
  ].join("\n");
}

export function readCandidateInput(file) {
  return createCandidate(JSON.parse(fs.readFileSync(path.resolve(file), "utf8")));
}

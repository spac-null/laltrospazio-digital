import assert from "node:assert/strict";
import test from "node:test";
import { normalizeGoogleBusinessProfile } from "../feeders/google-business-profile/normalize.mjs";
import { makeField, resolveField, FIELD_AUTHORITY_POLICY } from "../scripts/field-authority.mjs";

// These are synthetic API-shaped fixtures, not copied production responses.
const fetchedAt = "2026-08-13T12:00:00Z";
const response = (overrides = {}) => ({
  name: "locations/123",
  title: "L'Altro Spazio",
  storefrontAddress: { addressLines: ["Via Nazario Sauro 24/F"], locality: "Bologna", postalCode: "40121", regionCode: "IT" },
  phoneNumbers: { primaryPhone: "+39 351 704 8064" },
  websiteUri: "https://www.altrospazio.org/",
  regularHours: { periods: [{ openDay: "TUESDAY", openTime: "18:00" }] },
  specialHours: { specialHourPeriods: [{ date: "2026-08-15", closed: true }] },
  openInfo: { status: "OPEN" },
  latlng: { latitude: 44.4977164, longitude: 11.3394358 },
  categories: { primaryCategory: { displayName: "Bar" } },
  profile: { description: "Profile text" },
  attributes: { attributes: [{ attributeId: "has_wheelchair_accessible_entrance", valueType: "BOOL", values: [true] }] },
  googleUpdated: { title: "Google title" },
  ...overrides,
});

test("normalizes regular and special hours with GBP provenance", () => {
  const result = normalizeGoogleBusinessProfile(response(), { fetchedAt });
  assert.equal(result.location_id, "locations/123");
  assert.equal(result.fields.regular_hours.value.periods[0].openDay, "TUESDAY");
  assert.equal(result.fields.special_hours.value.specialHourPeriods[0].closed, true);
  assert.equal(result.fields.regular_hours.source, "google_business_profile");
  assert.equal(result.fields.regular_hours.fetched_at, fetchedAt);
});

test("missing GBP fields normalize as null without invented values", () => {
  const result = normalizeGoogleBusinessProfile(response({ phoneNumbers: undefined, regularHours: undefined, attributes: undefined }), { fetchedAt });
  assert.equal(result.fields.phone.value, null);
  assert.equal(result.fields.regular_hours.value, null);
  assert.equal(result.fields.attributes.value, null);
});

test("address and phone remain comparison-only against canonical values", () => {
  const result = normalizeGoogleBusinessProfile(response({ storefrontAddress: { addressLines: ["Changed address"] }, phoneNumbers: { primaryPhone: "+39 000" } }), { fetchedAt });
  assert.equal(result.fields.address.publication_eligibility, "comparison_only");
  assert.equal(result.fields.phone.publication_eligibility, "comparison_only");
});

test("accessibility attributes require owner confirmation", () => {
  const result = normalizeGoogleBusinessProfile(response(), { fetchedAt });
  assert.equal(result.fields.attributes.publication_eligibility, "owner_confirmation_required");
  assert.equal(FIELD_AUTHORITY_POLICY.accessibility.canonical_source, "owner_confirmed");
});

test("external updated fields retain fetch and external timestamps", () => {
  const result = normalizeGoogleBusinessProfile(response(), { fetchedAt, externalUpdatedAt: "2026-08-12T09:00:00Z" });
  assert.equal(result.external_updated_at, "2026-08-12T09:00:00Z");
  assert.equal(result.fields.google_updated.external_updated_at, "2026-08-12T09:00:00Z");
});

test("stale health is represented without pretending a fetch succeeded", () => {
  const result = normalizeGoogleBusinessProfile(response(), { fetchedAt: "2025-01-01T00:00:00Z" });
  result.health.freshness = "stale";
  result.health.last_error = "fetch older than policy threshold";
  assert.equal(result.health.freshness, "stale");
  assert.equal(result.health.last_error, "fetch older than policy threshold");
});

test("canonical accepted field wins over a changed GBP feeder", () => {
  const canonical = makeField({ value: "Canonical address", source: "external_editorial", authorityLevel: "canonical", publicationEligibility: "public_if_valid" });
  const feeder = makeField({ value: "Changed Google address", source: "google_business_profile", authorityLevel: "authoritative_feeder", publicationEligibility: "comparison_only", fetchedAt });
  const resolved = resolveField({ canonical, feeder, policy: FIELD_AUTHORITY_POLICY.address });
  assert.equal(resolved.value, "Canonical address");
  assert.equal(resolved.resolution, "canonical");
});

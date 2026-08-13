import assert from "node:assert/strict";
import test from "node:test";
import { normalizePublicContent, validateContent } from "../scripts/content-lib.mjs";

const venue = { id: "venue", fields: { name: { value: "Venue", status: "externally_supported", sources: ["test"] }, address: { value: "Address", status: "externally_supported", sources: ["test"] }, phone: { value: "+39 1", status: "externally_supported", sources: ["test"] }, website: { value: "https://example.com", status: "verified", sources: ["test"] }, coordinates: { value: { latitude: 1, longitude: 2 }, status: "externally_supported", sources: ["test"] }, menu_url: { value: "https://example.com/menu.pdf", status: "verified", sources: ["test"] }, social_profiles: { value: { instagram: "https://instagram.com/example" }, status: "externally_supported", sources: ["test"] }, map_profile: { value: { url: "https://maps.example.com" }, status: "verified", sources: ["test"] } } };
const event = (overrides = {}) => ({ id: "event-1", slug: "event-1", publication_status: "published", event_status: "scheduled", title: "Event", start: "2099-01-02T20:00:00+01:00", end: null, timezone: "Europe/Rome", location: { venue_id: "venue", name: "Venue", address: null }, description: "Description", image: null, booking_url: null, accessibility: { status: "unknown", summary: null, details: [] }, source: { type: "owner_registry", url: "https://example.com/source", retrieved_at: "2098-12-01T00:00:00+01:00", source_event_id: null }, published_at: "2098-12-01T00:00:00+01:00", updated_at: "2098-12-01T00:00:00+01:00", cancellation: null, postponement: null, recurrence: null, ...overrides });

test("no events produces an empty public collection", () => assert.equal(normalizePublicContent({ venue, events: [] }).events.length, 0));
test("one event is normalized", () => assert.equal(normalizePublicContent({ venue, events: [event()] }).events[0].slug, "event-1"));
test("multiple events sort chronologically", () => {
  const result = normalizePublicContent({ venue, events: [event({ id: "b", slug: "b", start: "2099-02-01T20:00:00+01:00" }), event({ id: "a", slug: "a", start: "2099-01-01T20:00:00+01:00" })] });
  assert.deepEqual(result.events.map((item) => item.slug), ["a", "b"]);
});
test("past and archived events are separated from upcoming behavior", () => {
  const result = normalizePublicContent({ venue, events: [event({ id: "past", slug: "past", start: "2020-01-01T20:00:00+01:00" }), event({ id: "archived", slug: "archived", publication_status: "archived" })] });
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].slug, "past");
});
test("cancelled event requires and retains cancellation state", () => {
  const cancelled = event({ event_status: "cancelled", cancellation: { reason: "Cancelled by organizer", announced_at: "2098-12-02T00:00:00+01:00" } });
  assert.doesNotThrow(() => validateContent({ venue, events: [cancelled] }));
  assert.equal(normalizePublicContent({ venue, events: [cancelled] }).events[0].event_status, "cancelled");
});
test("invalid event is rejected", () => assert.throws(() => validateContent({ venue, events: [event({ start: "tomorrow" })] }), /start must be an ISO date/));
test("slug collision is rejected", () => assert.throws(() => validateContent({ venue, events: [event(), event({ id: "event-2" })] }), /duplicate event slug/));
test("missing accessibility information is valid", () => assert.doesNotThrow(() => validateContent({ venue, events: [event({ accessibility: { status: "unknown", summary: null, details: [] } })] })));

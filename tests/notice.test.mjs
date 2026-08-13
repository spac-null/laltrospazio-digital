import assert from "node:assert/strict";
import test from "node:test";
import { isNoticeActive, normalizePublicContent, validateContent } from "../scripts/content-lib.mjs";

const venue = { id: "venue", fields: { name: { value: "Venue", status: "externally_supported", sources: ["test"] }, address: { value: "Address", status: "externally_supported", sources: ["test"] }, phone: { value: "+39 1", status: "externally_supported", sources: ["test"] }, website: { value: "https://example.com", status: "verified", sources: ["test"] }, coordinates: { value: { latitude: 1, longitude: 2 }, status: "externally_supported", sources: ["test"] }, menu_url: { value: "https://example.com/menu.pdf", status: "verified", sources: ["test"] }, social_profiles: { value: { instagram: "https://instagram.com/example" }, status: "externally_supported", sources: ["test"] }, map_profile: { value: { url: "https://maps.example.com" }, status: "verified", sources: ["test"] } } };
const notice = (overrides = {}) => ({ id: "notice-1", slug: "notice-1", type: "temporary_closure", venue_id: "venue", location: { name: "Venue", address: "Address" }, message: "Temporarily closed.", valid_from: "2026-08-13", valid_until: "2026-08-27", timezone: "Europe/Rome", reopening_date: "2026-08-27", publication_status: "published", owner_confirmed: true, source: { type: "owner_confirmation", confirmed_at: "2026-08-13", reference: "Owner" }, ...overrides });

test("active published notice is included", () => assert.equal(normalizePublicContent({ venue, events: [], notices: [notice()] }).notices.length, 1));
test("future notice is not active prematurely", () => assert.equal(isNoticeActive(notice({ valid_from: "2026-08-20" }), new Date("2026-08-19T19:00:00Z")), false));
test("expired notice disappears at the Europe/Rome date boundary", () => {
  assert.equal(isNoticeActive(notice(), new Date("2026-08-26T21:59:59Z")), true);
  assert.equal(isNoticeActive(notice(), new Date("2026-08-26T22:00:00Z")), false);
});
test("unpublished notices are not public", () => assert.equal(normalizePublicContent({ venue, events: [], notices: [notice({ publication_status: "draft" })] }).notices.length, 0));
test("no notices produces an empty notice collection", () => assert.equal(normalizePublicContent({ venue, events: [], notices: [] }).notices.length, 0));
test("notice validation requires owner confirmation and valid dates", () => {
  assert.throws(() => validateContent({ venue, events: [], notices: [notice({ owner_confirmed: false })] }), /owner_confirmed/);
  assert.throws(() => validateContent({ venue, events: [], notices: [notice({ valid_until: "2026-08-12" })] }), /valid_until/);
});

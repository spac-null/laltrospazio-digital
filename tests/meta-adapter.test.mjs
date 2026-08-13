import assert from "node:assert/strict";
import test from "node:test";
import { normalizeFacebookPosts, normalizeInstagramMedia } from "../feeders/meta/normalize.mjs";
import { assertPublicDataSafe } from "../scripts/feeder-health.mjs";

const fetchedAt = "2026-08-13T12:00:00Z";

test("normalizes Instagram media as candidate records", () => {
  const result = normalizeInstagramMedia([{ id: "ig-1", permalink: "https://instagram.test/p/1", timestamp: "2026-08-12T10:00:00Z", caption: "Serata il 20/08", media_type: "IMAGE", media_url: "https://cdn.test/1.jpg" }], { fetchedAt });
  assert.equal(result.records[0].source_network, "instagram");
  assert.equal(result.records[0].visibility, "public_candidate");
  assert.equal(result.records[0].candidate_signals.event_like, true);
  assert.equal(result.records[0].candidate_signals.explicit_date, true);
});

test("normalizes Facebook posts and preserves missing optional fields", () => {
  const result = normalizeFacebookPosts([{ id: "fb-1", message: "Riapertura presto", created_time: "2026-08-12T10:00:00Z" }], { fetchedAt });
  assert.equal(result.records[0].permalink, null);
  assert.equal(result.records[0].candidate_signals.notice_like, true);
  assert.equal(result.health.records_received, 1);
});

test("Meta candidate data cannot be published without approval", () => {
  const result = normalizeInstagramMedia([{ id: "ig-1", caption: "Evento" }], { fetchedAt });
  assert.throws(() => assertPublicDataSafe(result), /unapproved feeder candidate/);
});

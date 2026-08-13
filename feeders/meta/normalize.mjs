import { makeFeederHealth } from "../../scripts/feeder-health.mjs";

const signalText = (record) => `${record.caption ?? ""} ${record.message ?? ""}`.toLowerCase();

function candidateSignals(record) {
  const text = signalText(record);
  return {
    event_like: /concerto|evento|serata|laboratorio|aperitivo|dj|mostra|incontro/.test(text),
    notice_like: /chius|riapert|pausa|orari|sold.?out|annull|posticip/.test(text),
    explicit_date: /\b(?:20\d{2}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?)\b/.test(text),
  };
}

function normalizeRecord(record, network, fetchedAt) {
  if (!record?.id) throw new Error(`${network} record id is required`);
  return {
    source: "meta",
    visibility: "public_candidate",
    source_network: network,
    source_id: record.id,
    permalink: record.permalink_url ?? record.permalink ?? null,
    published_at: record.timestamp ?? record.created_time ?? null,
    caption: record.caption ?? record.message ?? null,
    media: {
      type: record.media_type ?? (record.full_picture ? "IMAGE" : null),
      url: record.media_url ?? record.full_picture ?? null,
      thumbnail_url: record.thumbnail_url ?? null,
    },
    candidate_signals: candidateSignals(record),
    provenance: { source_class: "meta", source_record_id: record.id, fetched_at: fetchedAt },
    fetched_at: fetchedAt,
  };
}

export function normalizeInstagramMedia(records = [], { fetchedAt } = {}) {
  if (!fetchedAt) throw new Error("fetchedAt is required for Meta normalization");
  const normalized = records.map((record) => normalizeRecord(record, "instagram", fetchedAt));
  return { source: "meta", visibility: "public_candidate", network: "instagram", fetched_at: fetchedAt, records: normalized, health: makeFeederHealth({ source: "meta.instagram", visibility: "public_candidate", authenticationStatus: "authenticated", lastAttempt: fetchedAt, lastSuccess: fetchedAt, freshness: "fresh", recordsReceived: normalized.length }) };
}

export function normalizeFacebookPosts(records = [], { fetchedAt } = {}) {
  if (!fetchedAt) throw new Error("fetchedAt is required for Meta normalization");
  const normalized = records.map((record) => normalizeRecord(record, "facebook", fetchedAt));
  return { source: "meta", visibility: "public_candidate", network: "facebook", fetched_at: fetchedAt, records: normalized, health: makeFeederHealth({ source: "meta.facebook", visibility: "public_candidate", authenticationStatus: "authenticated", lastAttempt: fetchedAt, lastSuccess: fetchedAt, freshness: "fresh", recordsReceived: normalized.length }) };
}

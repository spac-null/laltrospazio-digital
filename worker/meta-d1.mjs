const UPSERT_SOURCE_RECORD_SQL = `
  INSERT INTO meta_source_records
    (network, source_id, source_account_id, source_timestamp, message_or_caption, permalink, media_type, candidate_signals, first_seen_at, last_seen_at, last_fetched_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(network, source_id) DO UPDATE SET
    source_account_id = excluded.source_account_id,
    source_timestamp = excluded.source_timestamp,
    message_or_caption = excluded.message_or_caption,
    permalink = excluded.permalink,
    media_type = excluded.media_type,
    candidate_signals = excluded.candidate_signals,
    last_seen_at = excluded.last_seen_at,
    last_fetched_at = excluded.last_fetched_at
`;

export function upsertStatement(db, record, fetchedAt) {
  return db.prepare(UPSERT_SOURCE_RECORD_SQL).bind(
    record.source_network,
    record.source_id,
    record.source_account_id,
    record.published_at ?? null,
    record.caption ?? null,
    record.permalink ?? null,
    record.media?.type ?? null,
    JSON.stringify(record.candidate_signals ?? {}),
    fetchedAt,
    fetchedAt,
    fetchedAt,
  );
}

export async function upsertMetaSourceRecords(db, records, fetchedAt) {
  if (!records.length) return { upserted: 0 };
  await db.batch(records.map((record) => upsertStatement(db, record, fetchedAt)));
  return { upserted: records.length };
}

export async function startFeederRun(db, startedAt) {
  const result = await db
    .prepare("INSERT INTO meta_feeder_runs (started_at, success, credential_model) VALUES (?, 0, 'dual_credential')")
    .bind(startedAt)
    .run();
  return result.meta.last_row_id;
}

export async function finishFeederRun(db, runId, {
  finishedAt,
  success,
  facebookCount = 0,
  instagramCount = 0,
  facebookTruncated = false,
  instagramTruncated = false,
  freshness = "unknown",
  errors = [],
} = {}) {
  await db
    .prepare(`
      UPDATE meta_feeder_runs SET
        finished_at = ?,
        success = ?,
        facebook_record_count = ?,
        instagram_record_count = ?,
        facebook_truncated = ?,
        instagram_truncated = ?,
        freshness = ?,
        errors_json = ?
      WHERE id = ?
    `)
    .bind(
      finishedAt,
      success ? 1 : 0,
      facebookCount,
      instagramCount,
      facebookTruncated ? 1 : 0,
      instagramTruncated ? 1 : 0,
      freshness,
      errors.length ? JSON.stringify(errors) : null,
      runId,
    )
    .run();
}

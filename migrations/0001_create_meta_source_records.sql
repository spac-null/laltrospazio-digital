-- Migration number: 0001 	 2026-08-13T18:58:33.382Z

-- Private normalized Meta source records. Never public: nothing here is
-- served by the website's fetch handler, and no field stores credentials.
CREATE TABLE IF NOT EXISTS meta_source_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  network TEXT NOT NULL CHECK (network IN ('facebook', 'instagram')),
  source_id TEXT NOT NULL,
  source_account_id TEXT NOT NULL,
  source_timestamp TEXT,
  message_or_caption TEXT,
  permalink TEXT,
  media_type TEXT,
  candidate_signals TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  last_fetched_at TEXT NOT NULL,
  UNIQUE (network, source_id)
);

CREATE INDEX IF NOT EXISTS idx_meta_source_records_network ON meta_source_records (network);

-- Feeder-run/health history for the scheduled Meta ingestion job. No secret,
-- token, or raw Graph API response is ever stored here.
CREATE TABLE IF NOT EXISTS meta_feeder_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  success INTEGER NOT NULL DEFAULT 0,
  credential_model TEXT NOT NULL DEFAULT 'dual_credential',
  facebook_record_count INTEGER NOT NULL DEFAULT 0,
  instagram_record_count INTEGER NOT NULL DEFAULT 0,
  facebook_truncated INTEGER NOT NULL DEFAULT 0,
  instagram_truncated INTEGER NOT NULL DEFAULT 0,
  freshness TEXT NOT NULL DEFAULT 'unknown',
  errors_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_meta_feeder_runs_started_at ON meta_feeder_runs (started_at);

import { runMetaIngest } from "../scripts/meta-ingest-lib.mjs";
import { finishFeederRun, startFeederRun, upsertMetaSourceRecords } from "./meta-d1.mjs";

export const REQUIRED_META_SECRETS = Object.freeze(["META_PAGE_ACCESS_TOKEN", "META_SYSTEM_USER_ACCESS_TOKEN"]);

export function requireMetaSecrets(env) {
  const missing = REQUIRED_META_SECRETS.filter((name) => !env?.[name]);
  if (missing.length) throw new Error(`Missing required Meta secret binding(s): ${missing.join(", ")}`);
  if (!env?.META_DB) throw new Error("Missing required D1 binding: META_DB");
}

export async function runScheduledMetaIngest(env, { fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  requireMetaSecrets(env);
  const startedAt = now();
  const runId = await startFeederRun(env.META_DB, startedAt);

  let report;
  try {
    report = await runMetaIngest({
      systemUserToken: env.META_SYSTEM_USER_ACCESS_TOKEN,
      pageToken: env.META_PAGE_ACCESS_TOKEN,
      fetchImpl,
      fetchedAt: startedAt,
    });
  } catch (error) {
    await finishFeederRun(env.META_DB, runId, {
      finishedAt: now(),
      success: false,
      freshness: "failed",
      errors: [{ surface: "ingest", error_class: error?.code ?? "unknown_error" }],
    });
    throw error;
  }

  const recordsToStore = [
    ...(report.facebook.ok ? report.facebook.records : []),
    ...(report.instagram.ok ? report.instagram.records : []),
  ];
  if (recordsToStore.length) await upsertMetaSourceRecords(env.META_DB, recordsToStore, startedAt);

  const anySuccess = report.facebook.ok || report.instagram.ok;
  await finishFeederRun(env.META_DB, runId, {
    finishedAt: now(),
    success: anySuccess,
    facebookCount: report.facebook.records.length,
    instagramCount: report.instagram.records.length,
    facebookTruncated: report.facebook.truncated,
    instagramTruncated: report.instagram.truncated,
    freshness: anySuccess ? "fresh" : "failed",
    errors: report.errors,
  });

  return { runId, report };
}

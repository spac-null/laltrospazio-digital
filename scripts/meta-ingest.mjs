import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META_INGEST_FILE, readStoredMetaToken, readStoredPageToken } from "./meta-env.mjs";
import { runMetaIngest } from "./meta-ingest-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  const { accessToken: systemUserToken } = readStoredMetaToken(root);
  const { accessToken: pageToken } = readStoredPageToken(root);
  const maxPages = process.env.META_INGEST_MAX_PAGES ? Number(process.env.META_INGEST_MAX_PAGES) : undefined;
  const report = await runMetaIngest({ systemUserToken, pageToken, maxPages });
  const reportPath = path.join(root, META_INGEST_FILE);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(reportPath, 0o600);
  console.log(`META INGESTION\nPage identity verified: ${report.page_identity_verified ? "YES" : "NO"}\nInstagram linkage verified: ${report.instagram_linkage_verified ? "YES" : "NO"}\nFacebook records: ${report.facebook.records.length} (truncated: ${report.facebook.truncated})\nInstagram records: ${report.instagram.records.length} (truncated: ${report.instagram.truncated})\nPagination: bounded to ${report.pagination.max_pages} page(s), max allowed ${report.pagination.max_pages_allowed}\nToken health: system_user=${report.token_health.system_user}, page=${report.token_health.page}\nFeeder health: facebook=${report.feeder_health.facebook.freshness}, instagram=${report.feeder_health.instagram.freshness}\nError class: ${report.errors.length ? report.errors.map((error) => `${error.surface}=${error.error_class}`).join(", ") : "none"}\nPrivate output: ${META_INGEST_FILE}`);
} catch (error) {
  console.error(`META INGESTION FAILED\n${error.message}`);
  process.exitCode = 1;
}

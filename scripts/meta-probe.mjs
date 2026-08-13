import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { META_REPORT_FILE, readStoredMetaToken, readStoredPageToken } from "./meta-env.mjs";
import { runMetaProbe } from "./meta-probe-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  const { accessToken: systemUserToken } = readStoredMetaToken(root);
  const { accessToken: pageToken } = readStoredPageToken(root);
  const report = await runMetaProbe({ systemUserToken, pageToken });
  const reportPath = path.join(root, META_REPORT_FILE);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(reportPath, 0o600);
  console.log(`META READ-ONLY PROBE\nSystem-user token loaded: YES\nPage token loaded: YES\nPage identity verified: ${report.page_identity_verified ? "YES" : "NO"}\nInstagram linkage verified: ${report.instagram_linkage_verified ? "YES" : "NO"}\nFacebook Page read: ${report.page_read.ok ? "YES" : "NO"} (${report.page_read.records} records)\nInstagram read: ${report.instagram_read.ok ? "YES" : "NO"} (${report.instagram_read.records} records)\nFacebook auth model: page_access_token\nInstagram auth model: system_user\nFeeder health: ${report.feeder_health.freshness}\nError class: ${report.errors.length ? report.errors.map((error) => `${error.surface}=${error.error_class}`).join(", ") : "none"}\nMeta connector model viable: ${report.system_user_viability}\nPrivate report: ${META_REPORT_FILE}`);
} catch (error) {
  console.error(`META PROBE FAILED\n${error.message}`);
  process.exitCode = 1;
}

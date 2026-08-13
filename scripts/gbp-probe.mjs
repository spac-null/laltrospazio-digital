import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getGoogleUpdatedLocation, getLocation, getLocationAttributes, listAccounts, listLocations, refreshAccessToken, GbpError } from "./gbp-client.mjs";
import { normalizeGoogleBusinessProfile } from "../feeders/google-business-profile/normalize.mjs";
import { loadLocalGbpEnv } from "./gbp-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalGbpEnv(root);
const tokenFile = path.join(root, ".local", "gbp-refresh-token.json");
const localToken = fs.existsSync(tokenFile) ? JSON.parse(fs.readFileSync(tokenFile, "utf8")).refresh_token : null;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN ?? localToken;
const json = process.argv.includes("--json");
const expectedAddress = "via nazario sauro 24/f";

function fail(error) {
  const message = error instanceof GbpError ? error.message : `Unexpected probe failure: ${error.message}`;
  console.error(`GBP PROBE FAILED\n${message}`);
  process.exitCode = 1;
}

function compactAddress(address) {
  return [address?.addressLines?.join(", "), address?.postalCode, address?.locality].filter(Boolean).join(" ").toLowerCase();
}

function chooseLocation(locations) {
  if (process.env.GBP_LOCATION_ID) return locations.find((location) => location.name === process.env.GBP_LOCATION_ID) ?? null;
  const candidates = locations.filter((location) => compactAddress(location.storefrontAddress).includes(expectedAddress));
  return candidates.length === 1 ? candidates[0] : null;
}

function compare(normalized, venue) {
  const canonical = venue.fields;
  const discrepancies = [];
  const address = compactAddress(normalized.fields.address.value);
  if (address && !address.includes(canonical.address.value.toLowerCase().split(",")[0])) discrepancies.push({ field: "address", canonical: canonical.address.value, google_business_profile: normalized.fields.address.value, action: "owner_review" });
  if (normalized.fields.phone.value && normalized.fields.phone.value !== canonical.phone.value) discrepancies.push({ field: "phone", canonical: canonical.phone.value, google_business_profile: normalized.fields.phone.value, action: "owner_review" });
  if (normalized.fields.website.value && normalized.fields.website.value.replace(/\/$/, "") !== canonical.website.value.replace(/\/$/, "")) discrepancies.push({ field: "website", canonical: canonical.website.value, google_business_profile: normalized.fields.website.value, action: "owner_review" });
  const googleCoordinates = normalized.fields.coordinates.value;
  const canonicalCoordinates = canonical.coordinates.value;
  if (googleCoordinates && (Math.abs(googleCoordinates.latitude - canonicalCoordinates.latitude) > 0.001 || Math.abs(googleCoordinates.longitude - canonicalCoordinates.longitude) > 0.001)) discrepancies.push({ field: "coordinates", canonical: canonicalCoordinates, google_business_profile: googleCoordinates, action: "owner_review" });
  return discrepancies;
}

try {
  if (!refreshToken) throw new GbpError("No refresh token found. Run npm run gbp:authorize after setting local client credentials.", { code: "not_authorized" });
  const tokens = await refreshAccessToken({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, refreshToken });
  const accessToken = tokens.access_token;
  const accountsResponse = await listAccounts(accessToken);
  const accounts = accountsResponse.accounts ?? [];
  if (!accounts.length) throw new GbpError("Authorization succeeded but no GBP accounts are accessible to this Google account.", { code: "no_accounts" });
  const accountId = process.env.GBP_ACCOUNT_ID ?? (accounts.length === 1 ? accounts[0].name : null);
  if (!accountId) throw new GbpError(`Multiple GBP accounts found (${accounts.map((account) => account.name).join(", ")}). Set GBP_ACCOUNT_ID in .env.gbp.local.`, { code: "multiple_accounts" });
  let locations = [];
  let pageToken;
  do { const page = await listLocations(accessToken, accountId, pageToken); locations.push(...(page.locations ?? [])); pageToken = page.nextPageToken; } while (pageToken);
  if (!locations.length) throw new GbpError(`Account ${accountId} is accessible but contains no accessible locations.`, { code: "no_locations" });
  const selected = chooseLocation(locations);
  if (!selected) throw new GbpError(`Could not uniquely identify Via Nazario Sauro 24/F among ${locations.length} locations. Set GBP_LOCATION_ID in .env.gbp.local.`, { code: "location_not_found_or_ambiguous" });
  const location = await getLocation(accessToken, selected.name);
  const attributes = await getLocationAttributes(accessToken, selected.name);
  const googleUpdated = await getGoogleUpdatedLocation(accessToken, selected.name).catch(() => null);
  location.attributes = attributes;
  location.googleUpdated = googleUpdated;
  const normalized = normalizeGoogleBusinessProfile(location, { fetchedAt: new Date().toISOString() });
  const venue = JSON.parse(fs.readFileSync(path.join(root, "content", "venue.json"), "utf8"));
  const report = { generated_at: new Date().toISOString(), account: accounts.find((account) => account.name === accountId) ?? { name: accountId }, location: { name: selected.name, title: location.title, address: location.storefrontAddress }, normalized, discrepancies: compare(normalized, venue), fields_safe_to_auto_sync: [], fields_requiring_review: ["regular_hours", "special_hours", "address", "phone", "website", "coordinates", "open_info", "attributes", "profile", "categories", "google_updated"], mutations: "not_supported" };
  fs.mkdirSync(path.join(root, ".local"), { recursive: true, mode: 0o700 });
  fs.writeFileSync(path.join(root, ".local", "gbp-probe-report.json"), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  if (json) console.log(JSON.stringify(report, null, 2));
  else console.log(`GBP PROBE OK\nAccount: ${accountId}\nLocation: ${selected.name} (${location.title})\nDiscrepancies: ${report.discrepancies.length}\nReport: .local/gbp-probe-report.json\nNo canonical facts were changed.`);
} catch (error) { fail(error); }

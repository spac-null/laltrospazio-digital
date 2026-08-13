export const GBP_SCOPE = "https://www.googleapis.com/auth/business.manage";
export const ACCOUNT_API = "https://mybusinessaccountmanagement.googleapis.com/v1";
export const BUSINESS_INFO_API = "https://mybusinessbusinessinformation.googleapis.com/v1";
export const GBP_READ_MASK = [
  "name", "title", "storefrontAddress", "phoneNumbers", "websiteUri",
  "regularHours", "specialHours", "openInfo", "latlng", "categories",
  "profile", "attributes", "metadata",
].join(",");

export class GbpError extends Error {
  constructor(message, { status = null, code = null, cause = null } = {}) {
    super(message, { cause });
    this.name = "GbpError";
    this.status = status;
    this.code = code;
  }
}

function classifyHttp(status, body) {
  if (status === 401) return new GbpError("OAuth access token is expired or invalid; re-authorize the GBP connector.", { status, code: "invalid_token" });
  if (status === 403) return new GbpError("Google denied GBP access. The project may be unapproved, the API may be disabled, quota may be zero, or the account lacks Business Profile access.", { status, code: "permission_or_approval" });
  if (status === 429) return new GbpError("Google GBP quota is exhausted or still zero; check project approval and quotas.", { status, code: "quota" });
  if (status >= 500) return new GbpError("Google GBP is temporarily unavailable; retry later.", { status, code: "upstream_unavailable" });
  return new GbpError(`Google GBP request failed with HTTP ${status}: ${body?.error?.message ?? "unknown error"}`, { status, code: "api_error" });
}

export async function gbpRequest(url, { accessToken, method = "GET", params = {} } = {}) {
  if (method !== "GET") throw new GbpError(`Read-only GBP client rejected mutation method ${method}`, { code: "mutation_blocked" });
  const target = new URL(url);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null) target.searchParams.set(key, value);
  const response = await fetch(target, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw classifyHttp(response.status, body);
  return body;
}

export async function listAccounts(accessToken) {
  return gbpRequest(`${ACCOUNT_API}/accounts`, { accessToken });
}

export async function listLocations(accessToken, accountId, pageToken) {
  return gbpRequest(`${BUSINESS_INFO_API}/${accountId}/locations`, { accessToken, params: { readMask: GBP_READ_MASK, pageSize: "100", pageToken } });
}

export async function getLocation(accessToken, locationName) {
  return gbpRequest(`${BUSINESS_INFO_API}/${locationName}`, { accessToken, params: { readMask: GBP_READ_MASK } });
}

export async function getLocationAttributes(accessToken, locationName) {
  return gbpRequest(`${BUSINESS_INFO_API}/${locationName}/attributes`, { accessToken });
}

export async function getGoogleUpdatedLocation(accessToken, locationName) {
  return gbpRequest(`${BUSINESS_INFO_API}/${locationName}:getGoogleUpdated`, { accessToken, params: { readMask: GBP_READ_MASK } });
}

export async function refreshAccessToken({ clientId, clientSecret, refreshToken }) {
  if (!clientId || !clientSecret || !refreshToken) throw new GbpError("GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are required", { code: "missing_credentials" });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (body.error === "invalid_grant") throw new GbpError("Refresh token is expired or revoked; run npm run gbp:authorize again.", { status: response.status, code: "refresh_revoked" });
    throw new GbpError(`Google OAuth token refresh failed: ${body.error_description ?? body.error ?? "unknown error"}`, { status: response.status, code: "token_refresh_failed" });
  }
  return body;
}

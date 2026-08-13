const MUTATION_METHODS = new Set(["PUT", "PATCH", "DELETE"]);

export class GscError extends Error {
  constructor(message, { status = null, code = null, cause = null } = {}) {
    super(message, { cause });
    this.name = "GscError";
    this.status = status;
    this.code = code;
  }
}

function classifyHttp(status, body) {
  if (status === 401) return new GscError("Search Console access token is expired or invalid; run npm run gsc:authorize again.", { status, code: "invalid_token" });
  if (status === 403) return new GscError("Google denied Search Console access. Check API enablement, OAuth scope, property permission, and project approval.", { status, code: "permission_or_approval" });
  if (status === 429) return new GscError("Search Console quota was exceeded; retry later or reduce the query range/row limit.", { status, code: "quota" });
  if (status >= 500) return new GscError("Google Search Console is temporarily unavailable; retry later.", { status, code: "api_unavailable" });
  return new GscError(`Google Search Console request failed with HTTP ${status}: ${body?.error?.message ?? "unknown error"}`, { status, code: "api_error" });
}

export async function gscRequest(url, { accessToken, method = "GET", body, fetchImpl = fetch } = {}) {
  const normalizedMethod = method.toUpperCase();
  if (MUTATION_METHODS.has(normalizedMethod)) throw new GscError(`Read-only Search Console client rejected mutation method ${normalizedMethod}`, { code: "mutation_blocked" });
  if (!accessToken) throw new GscError("Search Console access token is required", { code: "missing_access_token" });
  const response = await fetchImpl(url, {
    method: normalizedMethod,
    headers: { Authorization: `Bearer ${accessToken}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw classifyHttp(response.status, body);
  return response.json();
}

export const listSites = (baseUrl, options) => gscRequest(`${baseUrl}/webmasters/v3/sites`, options);
export const querySearchAnalytics = (baseUrl, siteUrl, body, options = {}) => gscRequest(`${baseUrl}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { ...options, method: "POST", body });
export const listSitemaps = (baseUrl, siteUrl, options = {}) => gscRequest(`${baseUrl}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`, options);

export async function refreshAccessToken({ clientId, clientSecret, refreshToken, fetchImpl = fetch }) {
  if (!clientId || !clientSecret || !refreshToken) throw new GscError("GSC client ID, client secret, and refresh token are required", { code: "missing_credentials" });
  const response = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (body.error === "invalid_grant") throw new GscError("GSC refresh token is expired or revoked; run npm run gsc:authorize again.", { status: response.status, code: "refresh_revoked" });
    throw new GscError(`Google OAuth token refresh failed: ${body.error_description ?? body.error ?? "unknown error"}`, { status: response.status, code: "token_refresh_failed" });
  }
  return body;
}

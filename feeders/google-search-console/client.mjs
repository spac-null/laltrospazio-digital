const MUTATION_METHODS = new Set(["PUT", "PATCH", "DELETE"]);

export async function gscRequest(url, { accessToken, method = "GET", body, fetchImpl = fetch } = {}) {
  const normalizedMethod = method.toUpperCase();
  if (MUTATION_METHODS.has(normalizedMethod)) throw new Error(`Google Search Console client rejects mutation method ${normalizedMethod}`);
  if (!accessToken) throw new Error("Search Console access token is required");
  const response = await fetchImpl(url, {
    method: normalizedMethod,
    headers: { Authorization: `Bearer ${accessToken}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error(`Search Console API request failed (${response.status})`);
  return response.json();
}

export const listSites = (baseUrl, options) => gscRequest(`${baseUrl}/webmasters/v3/sites`, options);
export const querySearchAnalytics = (baseUrl, siteUrl, body, options = {}) => gscRequest(`${baseUrl}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { ...options, method: "POST", body });
export const listSitemaps = (baseUrl, siteUrl, options = {}) => gscRequest(`${baseUrl}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`, options);

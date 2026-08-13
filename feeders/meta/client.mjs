export const META_API_VERSION = "v26.0";
export const META_GRAPH_BASE = `https://graph.facebook.com/${META_API_VERSION}`;
export const HUMAN_PROOF_PERMISSIONS = Object.freeze([
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
]);
export const META_READ_PERMISSIONS = HUMAN_PROOF_PERMISSIONS;
export const SYSTEM_USER_REQUIRED_CAPABILITIES = Object.freeze([
  "facebook_page_own_post_read",
  "instagram_professional_own_media_read",
]);
export const META_ASSETS = Object.freeze({
  businessPortfolioId: "1760245797391981",
  pageId: "264601140373284",
  instagramProfessionalAccountId: "17841402902868891",
});

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SENSITIVE_QUERY_KEYS = new Set(["access_token", "appsecret_proof", "client_secret"]);

export class MetaError extends Error {
  constructor(message, { status = null, code = null, graphCode = null, cause = null } = {}) {
    super(message, { cause });
    this.name = "MetaError";
    this.status = status;
    this.code = code;
    this.graph_code = graphCode;
  }
}

export function redactMetaUrl(value) {
  const url = new URL(value);
  for (const key of SENSITIVE_QUERY_KEYS) url.searchParams.delete(key);
  return url.toString();
}

function classifyHttp(status, body) {
  const graphCode = Number(body?.error?.code ?? NaN);
  if (status === 401 || graphCode === 190) return new MetaError("Meta access token is expired, revoked, or invalid; reauthorize through the approved owner flow.", { status, code: "invalid_token", graphCode });
  if (status === 403 || graphCode === 10) return new MetaError("Meta denied the requested read permission or asset access.", { status, code: "permission_denied", graphCode });
  if (status === 429 || [4, 17, 32, 613].includes(graphCode)) return new MetaError("Meta rate limit reached; retry later and retain the last valid snapshot.", { status, code: "rate_limited", graphCode });
  if (status >= 500) return new MetaError("Meta is temporarily unavailable; retry later.", { status, code: "api_unavailable", graphCode });
  return new MetaError(`Meta Graph API request failed with HTTP ${status}; no raw Graph error was retained.`, { status, code: "api_error", graphCode });
}

export function classifyMetaError(error) {
  if (error instanceof MetaError) return error.code;
  return "unknown_error";
}

export async function metaRequest(pathOrUrl, { accessToken, method = "GET", params = {}, fetchImpl = fetch } = {}) {
  const normalizedMethod = method.toUpperCase();
  if (MUTATION_METHODS.has(normalizedMethod)) throw new MetaError(`Read-only Meta client rejected mutation method ${normalizedMethod}`, { code: "mutation_blocked" });
  if (!accessToken) throw new MetaError("Meta access token is required", { code: "missing_token" });
  const target = new URL(pathOrUrl.startsWith("http") ? pathOrUrl : `${META_GRAPH_BASE}/${pathOrUrl.replace(/^\//, "")}`);
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null) target.searchParams.set(key, value);
  target.searchParams.delete("access_token");
  target.searchParams.delete("appsecret_proof");
  target.searchParams.delete("client_secret");
  const response = await fetchImpl(target, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.error) throw classifyHttp(response.status, body);
  return body;
}

export function verifyAssetIdentity({ page, instagram }) {
  if (page?.id !== META_ASSETS.pageId || page?.name !== "L'Altro Spazio") throw new MetaError("Meta Page identity does not match the owner-confirmed L'Altro Spazio Page", { code: "page_identity_mismatch" });
  if (page.instagram_business_account?.id !== META_ASSETS.instagramProfessionalAccountId) throw new MetaError("Meta Page is not linked to the owner-confirmed Instagram professional account", { code: "instagram_link_mismatch" });
  if (instagram && instagram.id !== META_ASSETS.instagramProfessionalAccountId) throw new MetaError("Meta Instagram identity does not match the owner-confirmed account", { code: "instagram_identity_mismatch" });
  return { page_id: page.id, instagram_professional_account_id: page.instagram_business_account.id };
}

export async function verifyPageIdentity(accessToken, { fetchImpl = fetch } = {}) {
  const page = await metaRequest(META_ASSETS.pageId, { accessToken, params: { fields: "id,name,instagram_business_account" }, fetchImpl });
  return verifyAssetIdentity({ page });
}

export async function paginateMeta(pathOrUrl, { accessToken, params = {}, maxPages = 100, fetchImpl = fetch } = {}) {
  const records = [];
  const pages = [];
  let next = pathOrUrl;
  let pageCount = 0;
  while (next && pageCount < maxPages) {
    const body = await metaRequest(next, { accessToken, params: pageCount === 0 ? params : {}, fetchImpl });
    records.push(...(body.data ?? []));
    pages.push({ page: pageCount + 1, next: body.paging?.next ? redactMetaUrl(body.paging.next) : null, cursors: body.paging?.cursors ? { before: body.paging.cursors.before ?? null, after: body.paging.cursors.after ?? null } : null });
    next = body.paging?.next ? redactMetaUrl(body.paging.next) : null;
    pageCount += 1;
  }
  return { records, pages, truncated: Boolean(next) };
}

export const listPagePosts = (accessToken, options = {}) => paginateMeta(`${META_ASSETS.pageId}/posts`, { accessToken, ...options, params: { fields: "id,message,created_time,permalink_url", limit: "100", ...(options.params ?? {}) } });
export const listInstagramMedia = (accessToken, options = {}) => paginateMeta(`${META_ASSETS.instagramProfessionalAccountId}/media`, { accessToken, ...options, params: { fields: "id,caption,media_type,media_url,permalink,timestamp", limit: "100", ...(options.params ?? {}) } });

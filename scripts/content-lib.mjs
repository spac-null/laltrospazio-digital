import fs from "node:fs";
import path from "node:path";

export const EVENT_PUBLICATION_STATUSES = ["draft", "published", "archived"];
export const EVENT_STATUSES = ["scheduled", "cancelled", "postponed"];
const SOURCE_TYPES = ["owner_registry", "instagram", "facebook", "cultura_bologna", "cheventi", "other"];
const PUBLIC_PROVENANCE_STATUSES = ["verified", "owner_confirmed", "externally_supported"];
const URL_FIELDS = ["booking_url"];
const NOTICE_TYPES = ["temporary_closure", "exceptional_opening", "location_change", "sold_out", "service_interruption"];

function issue(message, file) {
  return `${file}: ${message}`;
}

function isIsoDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && /(?:Z|[+-]\d{2}:?\d{2})$/.test(value);
}

function isUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isTimezone(value) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return typeof value === "string" && value.includes("/");
  } catch {
    return false;
  }
}

function requireString(record, field, errors, file, { url = false } = {}) {
  if (typeof record[field] !== "string" || record[field].trim() === "") {
    errors.push(issue(`${field} is required`, file));
  } else if (url && !isUrl(record[field])) {
    errors.push(issue(`${field} must be an HTTP(S) URL`, file));
  }
}

export function validateVenue(venue, file = "content/venue.json") {
  const errors = [];
  requireString(venue, "id", errors, file);
  if (!venue.fields || typeof venue.fields !== "object") return [...errors, issue("fields are required", file)];
  for (const [name, field] of Object.entries(venue.fields)) {
    if (!PUBLIC_PROVENANCE_STATUSES.includes(field.status)) continue;
    if (!Array.isArray(field.sources) || field.sources.length === 0) errors.push(issue(`fields.${name}.sources are required`, file));
  }
  const value = (name) => venue.fields[name]?.value;
  for (const name of ["name", "address", "phone"]) if (typeof value(name) !== "string" || value(name).trim() === "") errors.push(issue(`fields.${name}.value is required`, file));
  for (const name of ["website", "menu_url"]) if (!isUrl(value(name))) errors.push(issue(`fields.${name}.value must be an HTTP(S) URL`, file));
  if (!value("coordinates") || typeof value("coordinates").latitude !== "number" || typeof value("coordinates").longitude !== "number") errors.push(issue("fields.coordinates.value must contain latitude and longitude numbers", file));
  for (const [name, url] of Object.entries(value("social_profiles") ?? {})) {
    if (!isUrl(url)) errors.push(issue(`social_profiles.${name} must be an HTTP(S) URL`, file));
  }
  if (!isUrl(value("map_profile")?.url)) errors.push(issue("fields.map_profile.value.url must be an HTTP(S) URL", file));
  return errors;
}

export function validateEvent(event, venue, file = "event") {
  const errors = [];
  if (!event || typeof event !== "object") return [issue("record must be an object", file)];
  requireString(event, "id", errors, file);
  requireString(event, "slug", errors, file);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug ?? "")) errors.push(issue("slug must be lowercase kebab-case", file));
  if (!EVENT_PUBLICATION_STATUSES.includes(event.publication_status)) errors.push(issue("invalid publication_status", file));
  if (!EVENT_STATUSES.includes(event.event_status)) errors.push(issue("invalid event_status", file));
  requireString(event, "title", errors, file);
  requireString(event, "description", errors, file);
  if (!isIsoDate(event.start)) errors.push(issue("start must be an ISO date with an explicit offset", file));
  if (event.end !== null && event.end !== undefined && !isIsoDate(event.end)) errors.push(issue("end must be null or an ISO date with an explicit offset", file));
  if (isIsoDate(event.start) && isIsoDate(event.end) && Date.parse(event.end) <= Date.parse(event.start)) errors.push(issue("end must be after start", file));
  if (!isTimezone(event.timezone)) errors.push(issue("timezone must be a valid IANA timezone", file));
  if (event.location?.venue_id !== venue.id) errors.push(issue("location.venue_id must reference the canonical venue", file));
  requireString(event.location ?? {}, "name", errors, file);
  if (event.location?.address !== null && event.location?.address !== undefined && typeof event.location.address !== "string") errors.push(issue("location.address must be a string or null", file));
  if (event.image !== null && event.image !== undefined && (typeof event.image !== "string" || (!event.image.startsWith("/") && !isUrl(event.image)))) errors.push(issue("image must be null, a site path, or an HTTP(S) URL", file));
  for (const field of URL_FIELDS) if (event[field] !== null && event[field] !== undefined && !isUrl(event[field])) errors.push(issue(`${field} must be null or an HTTP(S) URL`, file));
  requireString(event.source ?? {}, "type", errors, file);
  if (!SOURCE_TYPES.includes(event.source?.type)) errors.push(issue("source.type is not a supported provenance type", file));
  requireString(event.source ?? {}, "url", errors, file, { url: true });
  if (event.source?.retrieved_at !== null && event.source?.retrieved_at !== undefined && !isIsoDate(event.source.retrieved_at)) errors.push(issue("source.retrieved_at must be null or an ISO date", file));
  if (event.publication_status === "published" && !isIsoDate(event.published_at)) errors.push(issue("published_at is required for published events", file));
  if (!isIsoDate(event.updated_at)) errors.push(issue("updated_at must be an ISO date", file));

  if (event.event_status === "cancelled") {
    if (!event.cancellation?.reason || !isIsoDate(event.cancellation.announced_at)) errors.push(issue("cancelled events require cancellation.reason and cancellation.announced_at", file));
    if (event.postponement !== null && event.postponement !== undefined) errors.push(issue("cancelled events cannot include postponement", file));
  } else if (event.event_status === "postponed") {
    if (!event.postponement?.reason || (event.postponement.new_start !== null && !isIsoDate(event.postponement.new_start))) errors.push(issue("postponed events require postponement.reason and a null or ISO postponement.new_start", file));
    if (event.cancellation !== null && event.cancellation !== undefined) errors.push(issue("postponed events cannot include cancellation", file));
  } else if (event.cancellation !== null && event.cancellation !== undefined || event.postponement !== null && event.postponement !== undefined) {
    errors.push(issue("scheduled events cannot include cancellation or postponement", file));
  }
  return errors;
}

export function validateContent({ venue, events, files = [], notices = [], noticeFiles = [] }) {
  const errors = validateVenue(venue);
  const ids = new Set();
  const slugs = new Set();
  events.forEach((event, index) => {
    const file = files[index] ?? `event[${index}]`;
    errors.push(...validateEvent(event, venue, file));
    if (ids.has(event.id)) errors.push(issue(`duplicate event id ${event.id}`, file));
    if (slugs.has(event.slug)) errors.push(issue(`duplicate event slug ${event.slug}`, file));
    ids.add(event.id);
    slugs.add(event.slug);
  });
  const noticeIds = new Set();
  const noticeSlugs = new Set();
  notices.forEach((notice, index) => {
    const file = noticeFiles[index] ?? `notice[${index}]`;
    errors.push(...validateNotice(notice, venue, file));
    if (noticeIds.has(notice.id)) errors.push(issue(`duplicate notice id ${notice.id}`, file));
    if (noticeSlugs.has(notice.slug)) errors.push(issue(`duplicate notice slug ${notice.slug}`, file));
    noticeIds.add(notice.id);
    noticeSlugs.add(notice.slug);
  });
  if (errors.length) throw new Error(`Content validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  return true;
}

export function validateNotice(notice, venue, file = "notice") {
  const errors = [];
  if (!notice || typeof notice !== "object") return [issue("record must be an object", file)];
  for (const field of ["id", "slug", "type", "message", "valid_from", "valid_until", "timezone"]) requireString(notice, field, errors, file);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(notice.slug ?? "")) errors.push(issue("slug must be lowercase kebab-case", file));
  if (!NOTICE_TYPES.includes(notice.type)) errors.push(issue("invalid notice type", file));
  if (notice.venue_id !== venue.id) errors.push(issue("venue_id must reference the canonical venue", file));
  requireString(notice.location ?? {}, "name", errors, file);
  requireString(notice.location ?? {}, "address", errors, file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(notice.valid_from ?? "")) errors.push(issue("valid_from must be a calendar date", file));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(notice.valid_until ?? "")) errors.push(issue("valid_until must be a calendar date", file));
  if (notice.valid_from >= notice.valid_until) errors.push(issue("valid_until must be after valid_from", file));
  if (!isTimezone(notice.timezone)) errors.push(issue("timezone must be a valid IANA timezone", file));
  if (notice.reopening_date !== null && notice.reopening_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(notice.reopening_date)) errors.push(issue("reopening_date must be null or a calendar date", file));
  if (! ["draft", "published", "archived"].includes(notice.publication_status)) errors.push(issue("invalid publication_status", file));
  if (notice.publication_status === "published" && notice.owner_confirmed !== true) errors.push(issue("published notices require owner_confirmed", file));
  if (!notice.source || notice.source.type !== "owner_confirmation" || !/^\d{4}-\d{2}-\d{2}$/.test(notice.source.confirmed_at ?? "") || !notice.source.reference) errors.push(issue("source requires owner_confirmation, confirmed_at, and reference", file));
  return errors;
}

function localCalendarDate(date, timezone) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isNoticeActive(notice, now = new Date()) {
  const date = localCalendarDate(now, notice.timezone);
  return notice.publication_status === "published" && date >= notice.valid_from && date < notice.valid_until;
}

export function normalizePublicContent({ venue, events, notices = [] }) {
  const publicVenue = Object.fromEntries(Object.entries(venue.fields).filter(([, field]) => PUBLIC_PROVENANCE_STATUSES.includes(field.status)).map(([name, field]) => [name, field.value]));
  return {
    venue: structuredClone({ id: venue.id, ...publicVenue }),
    events: events
      .filter((event) => event.publication_status === "published")
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
      .map((event) => structuredClone(event)),
    notices: notices.filter((notice) => notice.publication_status === "published").map((notice) => structuredClone(notice)),
  };
}

export function readContent(root) {
  const venuePath = path.join(root, "content", "venue.json");
  const eventDir = path.join(root, "content", "events");
  const noticeDir = path.join(root, "content", "notices");
  const venue = JSON.parse(fs.readFileSync(venuePath, "utf8"));
  const files = fs.readdirSync(eventDir).filter((name) => name.endsWith(".json")).sort().map((name) => path.join(eventDir, name));
  const events = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const noticeFiles = fs.readdirSync(noticeDir).filter((name) => name.endsWith(".json")).sort().map((name) => path.join(noticeDir, name));
  const notices = noticeFiles.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  validateContent({ venue, events, files, notices, noticeFiles });
  return normalizePublicContent({ venue, events, notices });
}

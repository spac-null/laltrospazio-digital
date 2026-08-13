import { makeField } from "../../scripts/field-authority.mjs";

const firstPhone = (phoneNumbers) => phoneNumbers?.primaryPhone ?? phoneNumbers?.additionalPhones?.[0] ?? null;

export function normalizeGoogleBusinessProfile(location, { fetchedAt, externalUpdatedAt = null } = {}) {
  if (!location || typeof location !== "object") throw new Error("GBP location response must be an object");
  if (!fetchedAt) throw new Error("fetchedAt is required for GBP normalization");
  const source = "google_business_profile";
  const feeder = (value, publicationEligibility = "review", conflictState = "none") => makeField({ value, source, authorityLevel: "authoritative_feeder", fetchedAt, externalUpdatedAt, publicationEligibility, conflictState });
  return {
    feeder: "google_business_profile",
    fetched_at: fetchedAt,
    external_updated_at: externalUpdatedAt,
    location_id: location.name ?? null,
    fields: {
      name: feeder(location.title ?? null),
      address: feeder(location.storefrontAddress ?? null, "comparison_only"),
      phone: feeder(firstPhone(location.phoneNumbers), "comparison_only"),
      website: feeder(location.websiteUri ?? null, "comparison_only"),
      regular_hours: feeder(location.regularHours ?? null, "candidate_until_access_confirmed"),
      special_hours: feeder(location.specialHours ?? null, "candidate_for_notice_review"),
      open_info: feeder(location.openInfo ?? null, "candidate_until_access_confirmed"),
      coordinates: feeder(location.latlng ?? null, "comparison_only"),
      categories: feeder(location.categories ?? null, "review"),
      profile: feeder(location.profile ?? null, "review"),
      attributes: feeder(location.attributes ?? null, "owner_confirmation_required"),
      google_updated: feeder(location.googleUpdated ?? null, "comparison_only"),
    },
    health: {
      last_success: fetchedAt,
      last_attempt: fetchedAt,
      freshness: "fresh",
      authentication_status: "authenticated",
      last_error: null,
      records_received: 1,
      conflicts_found: [],
    },
  };
}

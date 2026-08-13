export const SOURCE_CLASSES = [
  "owner_confirmed",
  "google_business_profile",
  "google_places",
  "meta",
  "external_editorial",
  "derived",
];

export const AUTHORITY_LEVELS = [
  "canonical",
  "authoritative_feeder",
  "comparison_only",
  "candidate_only",
  "derived",
];

export const FIELD_AUTHORITY_POLICY = {
  name: { canonical_source: "external_editorial", accepted_sources: ["owner_confirmed", "google_business_profile", "external_editorial"], publication: "public_if_valid" },
  address: { canonical_source: "external_editorial", accepted_sources: ["owner_confirmed", "external_editorial"], comparison_sources: ["google_business_profile", "google_places"], publication: "public_if_valid" },
  phone: { canonical_source: "external_editorial", accepted_sources: ["owner_confirmed", "external_editorial"], comparison_sources: ["google_business_profile", "google_places"], publication: "public_if_valid" },
  website: { canonical_source: "external_editorial", accepted_sources: ["owner_confirmed", "external_editorial"], comparison_sources: ["google_business_profile", "google_places"], publication: "public_if_valid" },
  regular_hours: { canonical_source: "google_business_profile", accepted_sources: ["owner_confirmed", "google_business_profile"], publication: "public_after_access_confirmation" },
  special_hours: { canonical_source: "owner_confirmed", accepted_sources: ["owner_confirmed"], feeder_sources: ["google_business_profile"], publication: "public_only_after_notice_policy" },
  open_info: { canonical_source: "google_business_profile", accepted_sources: ["owner_confirmed", "google_business_profile"], publication: "public_after_access_confirmation" },
  coordinates: { canonical_source: "external_editorial", accepted_sources: ["owner_confirmed", "external_editorial"], comparison_sources: ["google_business_profile", "google_places"], publication: "public_if_valid" },
  categories: { canonical_source: "google_business_profile", accepted_sources: ["google_business_profile"], publication: "internal_or_public_after_review" },
  accessibility: { canonical_source: "owner_confirmed", accepted_sources: ["owner_confirmed"], feeder_sources: ["google_business_profile", "google_places"], publication: "owner_confirmation_required" },
  events: { canonical_source: "owner_confirmed", accepted_sources: ["owner_confirmed"], candidate_sources: ["meta", "external_editorial"], publication: "canonical_registry_only" },
};

export function makeField({ value, source, authorityLevel, fetchedAt = null, ownerConfirmedAt = null, externalUpdatedAt = null, publicationEligibility = "review", conflictState = "none" }) {
  if (!SOURCE_CLASSES.includes(source)) throw new Error(`Unsupported source class: ${source}`);
  if (!AUTHORITY_LEVELS.includes(authorityLevel)) throw new Error(`Unsupported authority level: ${authorityLevel}`);
  return { value, source, authority_level: authorityLevel, fetched_at: fetchedAt, owner_confirmed_at: ownerConfirmedAt, external_updated_at: externalUpdatedAt, publication_eligibility: publicationEligibility, conflict_state: conflictState };
}

export function resolveField({ canonical, feeder, policy }) {
  if (canonical?.value !== undefined && policy.accepted_sources.includes(canonical.source)) return { ...canonical, resolution: "canonical" };
  if (feeder?.value !== undefined && policy.canonical_source === feeder.source && policy.publication !== "owner_confirmation_required") return { ...feeder, resolution: "feeder_authoritative" };
  if (feeder?.value !== undefined) return { ...feeder, resolution: "comparison_or_candidate" };
  return canonical ? { ...canonical, resolution: "canonical" } : null;
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findCandidate } from "./candidates-show.mjs";
import { isoWithOffset, VENUE_ADDRESS, VENUE_ID, VENUE_NAME, VENUE_TIMEZONE } from "./candidate-review-lib.mjs";
import { todayInTimezone } from "./candidate-detect.mjs";
import { validateEvent, validateNotice } from "./content-lib.mjs";
import { CANDIDATE_DECISIONS_FILE, loadDecisions, recordDecision, saveDecisions } from "./candidate-decisions-lib.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTICE_TYPES = ["temporary_closure", "exceptional_opening", "location_change", "sold_out", "service_interruption"];

export class PromotionError extends Error {
  constructor(reasons) {
    super(reasons.join("; "));
    this.name = "PromotionError";
    this.reasons = reasons;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function existingSlugs(dir) {
  return new Set(fs.readdirSync(dir).filter((name) => name.endsWith(".json")).map((name) => name.replace(/\.json$/, "")));
}

function ensureUniqueSlug(candidateSlug, dir, root) {
  if (!candidateSlug) throw new PromotionError(["could not derive a slug; pass --slug explicitly"]);
  const slug = slugify(candidateSlug);
  if (existingSlugs(dir).has(slug)) throw new PromotionError([`slug "${slug}" already exists in ${path.relative(root, dir)}; pass --slug to choose a different one`]);
  return slug;
}

function loadVenue(root) {
  return JSON.parse(fs.readFileSync(path.join(root, "content", "venue.json"), "utf8"));
}

function resolvedField(candidateField, overrideValue, label) {
  if (overrideValue !== undefined && overrideValue !== null) return { value: overrideValue, status: "owner_confirmed" };
  if (candidateField?.status === "extracted") return { value: candidateField.value, status: "extracted" };
  if (candidateField?.status === "conflicting") throw new PromotionError([`${label} is conflicting across sources; pass an explicit override to resolve it`]);
  if (candidateField?.status === "ambiguous") throw new PromotionError([`${label} is ambiguous: it disagrees with a highly similar but not clearly recurring source; pass an explicit override to resolve it`]);
  if (candidateField?.status === "inferred") throw new PromotionError([`${label} is only inferred/guessed (${candidateField.value}), not verified from source text; pass an explicit override to confirm it`]);
  return { value: null, status: "missing" };
}

function buildEventDraft(candidate, flags, now, root) {
  if (candidate.candidate_type !== "event") throw new PromotionError([`candidate type "${candidate.candidate_type}" is not an event; use the notice path or a different candidate`]);

  const title = resolvedField({ status: "missing" }, flags.title, "title");
  if (title.status === "missing") throw new PromotionError(["title is missing (Meta posts carry no structured title field): pass --title \"...\""]);

  const startDate = resolvedField(candidate.fields.start_date, flags.date, "start date");
  if (startDate.status === "missing") {
    const hint = candidate.date_state === "multi_date_event"
      ? " (the source describes two separate genuine dates joined by \"e\"/\"and\"; promote each date separately with --date, or extend the schema to support multi-date events)"
      : candidate.date_state === "multiple_event_dates" ? " (the source lists multiple dates with no recognized range; pick the correct one)" : "";
    throw new PromotionError([`start date is missing${hint}: pass --date YYYY-MM-DD`]);
  }

  const startTime = resolvedField(candidate.fields.start_time, flags.time, "start time");
  if (startTime.status === "missing") throw new PromotionError(["start time is missing: pass --time HH:MM"]);

  const description = resolvedField(candidate.fields.description, flags.description, "description");
  if (description.status === "missing") throw new PromotionError(["description is missing: the source record has no caption/message, and no --description override was given"]);

  const location = resolvedField(candidate.fields.location_name, flags.location, "location");
  if (location.status === "missing") throw new PromotionError(["location is missing: pass --location \"...\""]);
  const locationName = location.value;
  const locationAddress = flags.address ?? VENUE_ADDRESS;

  const primarySource = candidate.sources[0];
  if (!primarySource?.permalink) throw new PromotionError(["source permalink is missing; cannot set a valid source.url"]);

  const slugBase = flags.slug ?? `${slugify(title.value)}-${startDate.value}`;
  const slug = ensureUniqueSlug(slugBase, path.join(root, "content", "events"), root);

  const start = isoWithOffset(startDate.value, startTime.value, VENUE_TIMEZONE);
  const endDateValue = flags.endDate ?? (candidate.fields.end_date?.status === "extracted" ? candidate.fields.end_date.value : null);
  const end = endDateValue && flags.endTime ? isoWithOffset(endDateValue, flags.endTime, VENUE_TIMEZONE) : null;

  const draft = {
    id: slug,
    slug,
    publication_status: "draft",
    event_status: "scheduled",
    title: title.value,
    description: description.value,
    start,
    end,
    timezone: VENUE_TIMEZONE,
    location: { venue_id: VENUE_ID, name: locationName, address: locationAddress },
    image: null,
    booking_url: flags.bookingUrl ?? null,
    source: { type: primarySource.network, url: primarySource.permalink, retrieved_at: primarySource.source_timestamp ?? null },
    published_at: null,
    updated_at: now.toISOString(),
  };

  return { draft, targetDir: "events", provenance: { title: title.status, start_date: startDate.status, start_time: startTime.status, description: description.status, location: location.status } };
}

function buildNoticeDraft(candidate, flags, now, root) {
  if (candidate.candidate_type !== "operational_notice") throw new PromotionError([`candidate type "${candidate.candidate_type}" is not an operational notice`]);
  if (!flags.message) throw new PromotionError(["message is missing: operational notices always require explicit owner-confirmed wording via --message \"...\" (never auto-copied from the source caption)"]);
  if (!flags.validFrom) throw new PromotionError(["valid_from is missing: pass --valid-from YYYY-MM-DD"]);
  if (!flags.validUntil) throw new PromotionError(["valid_until is missing: pass --valid-until YYYY-MM-DD"]);
  if (!flags.noticeType) throw new PromotionError([`notice type is missing: pass --notice-type <${NOTICE_TYPES.join("|")}>`]);
  if (!NOTICE_TYPES.includes(flags.noticeType)) throw new PromotionError([`invalid --notice-type "${flags.noticeType}"; must be one of ${NOTICE_TYPES.join(", ")}`]);

  const slugBase = flags.slug ?? `${flags.noticeType.replace(/_/g, "-")}-${flags.validFrom}`;
  const slug = ensureUniqueSlug(slugBase, path.join(root, "content", "notices"), root);

  const draft = {
    id: slug,
    slug,
    type: flags.noticeType,
    venue_id: VENUE_ID,
    location: { name: flags.location ?? VENUE_NAME, address: flags.address ?? VENUE_ADDRESS },
    message: flags.message,
    valid_from: flags.validFrom,
    valid_until: flags.validUntil,
    timezone: VENUE_TIMEZONE,
    reopening_date: flags.reopeningDate ?? null,
    publication_status: "draft",
    owner_confirmed: true,
    source: {
      type: "owner_confirmation",
      confirmed_at: todayInTimezone(now, VENUE_TIMEZONE),
      reference: `Promoted from Meta candidate ${candidate.candidate_id} (${candidate.sources.map((source) => `${source.network}:${source.source_id}`).join(", ")}); owner confirmed via candidates:promote`,
    },
  };

  return { draft, targetDir: "notices", provenance: { message: "owner_confirmed", valid_from: "owner_confirmed", valid_until: "owner_confirmed" } };
}

export function promoteCandidate({ candidateId, flags = {}, confirm = false, now = new Date(), root = DEFAULT_ROOT, jsonPath, decisionsPath } = {}) {
  const candidate = findCandidate(candidateId, { jsonPath });
  const venue = loadVenue(root);

  let built;
  if (candidate.candidate_type === "event") built = buildEventDraft(candidate, flags, now, root);
  else if (candidate.candidate_type === "operational_notice") built = buildNoticeDraft(candidate, flags, now, root);
  else throw new PromotionError([`candidate type "${candidate.candidate_type}" cannot be promoted; only "event" and "operational_notice" candidates are promotable`]);

  const errors = built.targetDir === "events" ? validateEvent(built.draft, venue) : validateNotice(built.draft, venue);
  if (errors.length) throw new PromotionError(errors);

  const targetPath = path.join(root, "content", built.targetDir, `${built.draft.slug}.json`);
  const relativeTargetPath = path.relative(root, targetPath);

  if (!confirm) {
    return { status: "dry_run", draft: built.draft, targetPath: relativeTargetPath, provenance: built.provenance };
  }

  fs.writeFileSync(targetPath, `${JSON.stringify(built.draft, null, 2)}\n`);

  const decisionsFile = decisionsPath ?? path.join(root, CANDIDATE_DECISIONS_FILE);
  const decisionState = loadDecisions(decisionsFile);
  saveDecisions(decisionsFile, recordDecision(decisionState, candidateId, "promoted", { promotedPath: relativeTargetPath, now }));

  return { status: "written", draft: built.draft, targetPath: relativeTargetPath, provenance: built.provenance };
}

function parseArgs(argv) {
  const candidateId = argv[0];
  const flags = { confirm: false };
  const rename = { date: "date", time: "time", "end-date": "endDate", "end-time": "endTime", title: "title", description: "description", location: "location", address: "address", "booking-url": "bookingUrl", slug: "slug", message: "message", "valid-from": "validFrom", "valid-until": "validUntil", "notice-type": "noticeType", "reopening-date": "reopeningDate" };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--confirm") {
      flags.confirm = true;
      continue;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const mapped = rename[key];
      if (mapped) {
        flags[mapped] = argv[i + 1];
        i += 1;
      }
    }
  }
  return { candidateId, flags };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { candidateId, flags } = parseArgs(process.argv.slice(2));
  if (!candidateId) {
    console.error("Usage: npm run candidates:promote -- <candidate-id> [--title ...] [--date YYYY-MM-DD] [--time HH:MM] [--message ...] [--confirm]");
    process.exitCode = 1;
  } else {
    try {
      const result = promoteCandidate({ candidateId, flags, confirm: flags.confirm });
      console.log(`CANDIDATE PROMOTION PREVIEW\nCandidate: ${candidateId}\nTarget: ${result.targetPath}\n\n${JSON.stringify(result.draft, null, 2)}\n`);
      if (result.status === "dry_run") {
        console.log("DRY RUN — nothing was written. Re-run with --confirm to write this file. Nothing is committed, pushed, or deployed automatically.");
      } else {
        console.log(`WRITTEN: ${result.targetPath} (publication_status: "draft" — not public until an owner separately sets it to "published" and commits/pushes).`);
      }
    } catch (error) {
      if (error instanceof PromotionError) {
        console.error(`PROMOTION BLOCKED\n${error.reasons.map((reason) => `- ${reason}`).join("\n")}`);
      } else {
        console.error(`CANDIDATES PROMOTE FAILED\n${error.message}`);
      }
      process.exitCode = 1;
    }
  }
}

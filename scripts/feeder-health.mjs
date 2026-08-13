export const FEEDER_VISIBILITY = Object.freeze(["private", "public_candidate", "public"]);
export const FEEDER_FRESHNESS = Object.freeze(["unknown", "fresh", "stale", "failed"]);

export function makeFeederHealth({
  source,
  visibility,
  authenticationStatus = "not_configured",
  lastAttempt = null,
  lastSuccess = null,
  freshness = "unknown",
  lastError = null,
  recordsReceived = 0,
  conflictsFound = [],
} = {}) {
  if (!source) throw new Error("feeder health source is required");
  if (!FEEDER_VISIBILITY.includes(visibility)) throw new Error(`invalid feeder visibility: ${visibility}`);
  if (!FEEDER_FRESHNESS.includes(freshness)) throw new Error(`invalid feeder freshness: ${freshness}`);
  return {
    source,
    visibility,
    authentication_status: authenticationStatus,
    last_attempt: lastAttempt,
    last_success: lastSuccess,
    freshness,
    last_error: lastError,
    records_received: recordsReceived,
    conflicts_found: conflictsFound,
  };
}

export function assertPublicDataSafe(value, { allowCandidate = false } = {}) {
  const visit = (item) => {
    if (!item || typeof item !== "object") return;
    if (item.visibility === "private") throw new Error("private feeder data cannot enter public output");
    if (item.visibility === "public_candidate" && !allowCandidate) {
      throw new Error("unapproved feeder candidate cannot enter public output");
    }
    for (const child of Object.values(item)) visit(child);
  };
  visit(value);
  return value;
}

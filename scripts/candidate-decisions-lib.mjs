import fs from "node:fs";
import path from "node:path";

export const CANDIDATE_DECISIONS_FILE = ".local/candidate-decisions.json";
export const DECISIONS = ["pending", "reviewed", "ignore", "defer", "promoted"];

export function loadDecisions(filePath) {
  if (!fs.existsSync(filePath)) return { visibility: "private", decisions: {} };
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveDecisions(filePath, state) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(filePath, 0o600);
}

// Source records and canonical content are never touched here — this is
// purely a private local record of what the owner has decided about a
// candidate_id. Every change is timestamped and kept in `history`, never
// overwritten silently.
export function recordDecision(state, candidateId, decision, { promotedPath = null, now = new Date() } = {}) {
  if (!DECISIONS.includes(decision)) throw new Error(`Invalid decision "${decision}"; must be one of ${DECISIONS.join(", ")}`);
  const existing = state.decisions[candidateId];
  const entry = {
    decision,
    updated_at: now.toISOString(),
    promoted_path: decision === "promoted" ? promotedPath : (existing?.promoted_path ?? null),
    history: [...(existing?.history ?? []), { decision, at: now.toISOString() }],
  };
  return { ...state, visibility: "private", decisions: { ...state.decisions, [candidateId]: entry } };
}

export function decisionFor(state, candidateId) {
  return state.decisions?.[candidateId]?.decision ?? "pending";
}

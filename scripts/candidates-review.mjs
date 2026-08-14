import path from "node:path";
import { fileURLToPath } from "node:url";
import { CANDIDATE_DECISIONS_FILE, loadDecisions, recordDecision, saveDecisions } from "./candidate-decisions-lib.mjs";
import { findCandidate } from "./candidates-show.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const candidateId = argv[0];
  let decision = null;
  for (const arg of argv.slice(1)) {
    if (arg === "--ignore") decision = "ignore";
    else if (arg === "--defer") decision = "defer";
    else if (arg === "--reviewed") decision = "reviewed";
    else if (arg === "--pending") decision = "pending";
  }
  return { candidateId, decision };
}

export function reviewCandidate({ candidateId, decision, root = DEFAULT_ROOT, jsonPath, decisionsPath, now = new Date() }) {
  findCandidate(candidateId, { jsonPath }); // throws if the candidate doesn't exist in the current review
  const filePath = decisionsPath ?? path.join(root, CANDIDATE_DECISIONS_FILE);
  const state = loadDecisions(filePath);
  const updated = recordDecision(state, candidateId, decision, { now });
  saveDecisions(filePath, updated);
  return updated.decisions[candidateId];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { candidateId, decision } = parseArgs(process.argv.slice(2));
  if (!candidateId || !decision) {
    console.error("Usage: npm run candidates:review -- <candidate-id> --ignore|--defer|--reviewed|--pending");
    process.exitCode = 1;
  } else {
    try {
      const entry = reviewCandidate({ candidateId, decision });
      console.log(`Recorded decision "${entry.decision}" for ${candidateId} at ${entry.updated_at}.`);
    } catch (error) {
      console.error(`CANDIDATES REVIEW FAILED\n${error.message}`);
      process.exitCode = 1;
    }
  }
}

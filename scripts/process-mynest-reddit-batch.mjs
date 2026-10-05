import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "data/mynest/reddit-insights.jsonl");
const allowedSubreddits = new Set(["r/Parenting", "r/toddlers", "r/sleeptrain", "r/ScienceBasedParenting"]);
const allowedAgeBands = new Set(["unknown", "2.5-3", "3-4", "4-5", "5-6", "outside-cohort"]);
const allowedSetups = new Set(["unknown", "co-sleeping", "parent-room", "own-room-parent-present", "own-room-returns", "own-room-independent", "other"]);
const allowedIntent = new Set(["none", "information", "action", "purchase"]);
const allowedFit = new Set(["low", "medium", "high"]);
const allowedInputFields = new Set([
  "source", "subreddit", "published_period", "age_band", "current_sleep_setup",
  "raw_problem_wording", "failed_solution", "parent_action_already_tried",
  "purchase_or_action_intent", "pilot_fit", "internal_source_url"
]);
const prohibitedFields = new Set([
  "username", "user_name", "name", "email", "phone", "profile_url", "child_name",
  "address", "exact_birthday", "exact_birthdate", "date_of_birth", "dob"
]);
const piiPatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(?:https?:\/\/)?(?:www\.)?reddit\.com\/user\//i,
  /(?:^|\s)u\/[A-Za-z0-9_-]+/i,
  /(?:\+?\d[\s().-]*){8,}/
];

const barrierRules = [
  ["F01", /dark|light|shadow|nightlight|night light|lights?[- ]?out|黑|灯/i],
  ["F02", /alone|leave|leaving|separation|stay with|parent present|come back|comes back|return.*bed|own-room-returns|cry.*leave|陪|分离/i],
  ["F03", /own room|their room|refus.*room|hate.*room|won't enter|will not enter|ownership|自己房间|不进房/i],
  ["F04", /noise|sound|temperature|hot|cold|scratch|texture|clutter|environment|噪音|温度/i],
  ["F05", /routine|bedtime|schedule|consistent|habit|transition|co[- ]?sleep|cosleep|流程|作息/i]
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function boundedString(value, field, { nullable = false, max = 500 } = {}) {
  if (nullable && (value === null || value === undefined || value === "")) return null;
  if (typeof value !== "string") throw new Error(`${field} must be a string${nullable ? " or null" : ""}`);
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > max) throw new Error(`${field} must contain 1-${max} characters`);
  return trimmed;
}

function assertNoIdentity(record, index) {
  for (const key of Object.keys(record)) {
    if (prohibitedFields.has(key.toLowerCase())) throw new Error(`record ${index}: prohibited identity field ${key}`);
    if (!allowedInputFields.has(key)) throw new Error(`record ${index}: unknown field ${key}`);
  }
  for (const field of ["raw_problem_wording", "failed_solution", "parent_action_already_tried"]) {
    const value = record[field];
    if (typeof value === "string" && piiPatterns.some((pattern) => pattern.test(value))) {
      throw new Error(`record ${index}: ${field} appears to contain contact, profile, or username data; redact it manually`);
    }
  }
}

function barrierScores(text) {
  return barrierRules
    .map(([code, pattern]) => [code, (text.match(new RegExp(pattern.source, `${pattern.flags}g`)) || []).length])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);
}

function classifyBarriers(text) {
  const scores = barrierScores(text);
  return { primary: scores[0]?.[0] || "F06", secondary: scores[1]?.[0] || null };
}

function normalizeProblem(raw, primary) {
  const cleaned = raw.replace(/^example only:\s*/i, "").replace(/[!?]+$/g, "").trim();
  const prefixes = {
    F01: "Darkness or lighting resistance:",
    F02: "Separation or parent-presence resistance:",
    F03: "Own-room acceptance resistance:",
    F04: "Physical room-environment resistance:",
    F05: "Routine or transition-sequence resistance:",
    F06: "Unclear or mixed room-transition resistance:"
  };
  return `${prefixes[primary]} ${cleaned}`.slice(0, 240);
}

function transitionIntent(text) {
  if (/tonight|now|this week|already trying|started|currently|every night/i.test(text)) return "active";
  if (/next 14 days|soon|planning|about to|ready to/i.test(text)) return "planning";
  if (/how|should|could|consider|thinking|advice/i.test(text)) return "exploring";
  return "none";
}

function urgency(text) {
  if (/urgent|desperate|exhausted|breaking point|every night|hours|cannot cope|can't cope/i.test(text)) return "high";
  if (/soon|struggling|keeps|repeated|multiple|again/i.test(text)) return "medium";
  return "low";
}

function questionCluster(primary, setup, text) {
  if (/dark|light|shadow|nightlight/i.test(text)) return "afraid-of-dark-at-bedtime";
  if (/return|comes? back|parents?'? bed|night waking/i.test(text)) return "returns-to-parents-bed";
  if (/co[- ]?sleep|cosleep|co sleeping/i.test(text) || setup === "co-sleeping") return "cosleeping-to-own-room";
  if (/stay|parent present|sit.*room|lie.*down/i.test(text)) return "parent-must-stay";
  if (primary === "F03") return "refuses-own-room";
  if (primary === "F04") return "room-environment-friction";
  if (primary === "F05") return "bedtime-routine-transition";
  return "wont-sleep-alone";
}

function answerGap(primary, failedSolution) {
  const base = {
    F01: "Needs a bounded way to test lighting without changing the whole room.",
    F02: "Needs a predictable separation response tied to the exact resistance moment.",
    F03: "Needs a small ownership choice that remains parent-approved and observable.",
    F04: "Needs one physical room variable isolated and tested at a time.",
    F05: "Needs a short repeatable transition sequence with a clear ending.",
    F06: "Needs observation to locate the barrier before selecting an intervention."
  }[primary];
  return failedSolution ? `${base} Prior attempt: ${failedSolution}`.slice(0, 240) : base;
}

function makeId(record) {
  const seed = [record.subreddit, record.published_period, record.internal_source_url || "", record.raw_problem_wording].join("\n");
  const digest = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 8).toUpperCase();
  return `RDI-${record.published_period.replace("-", "")}01-${digest}`;
}

function enrich(record, index) {
  assertNoIdentity(record, index);
  if (record.source !== "reddit") throw new Error(`record ${index}: source must be reddit`);
  if (!allowedSubreddits.has(record.subreddit)) throw new Error(`record ${index}: subreddit is outside the frozen manual set`);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(record.published_period || "")) throw new Error(`record ${index}: published_period must be YYYY-MM`);
  if (!allowedAgeBands.has(record.age_band)) throw new Error(`record ${index}: invalid age_band`);
  if (!allowedSetups.has(record.current_sleep_setup)) throw new Error(`record ${index}: invalid current_sleep_setup`);
  if (!allowedIntent.has(record.purchase_or_action_intent)) throw new Error(`record ${index}: invalid purchase_or_action_intent`);
  if (!allowedFit.has(record.pilot_fit)) throw new Error(`record ${index}: invalid pilot_fit`);

  const raw = boundedString(record.raw_problem_wording, "raw_problem_wording");
  const failed = boundedString(record.failed_solution, "failed_solution", { nullable: true, max: 240 });
  const tried = boundedString(record.parent_action_already_tried, "parent_action_already_tried", { nullable: true, max: 240 });
  let internalUrl = boundedString(record.internal_source_url, "internal_source_url", { nullable: true, max: 500 });
  if (internalUrl) {
    const url = new URL(internalUrl);
    if (url.protocol !== "https:" || !/(^|\.)reddit\.com$/i.test(url.hostname)) throw new Error(`record ${index}: internal_source_url must be an HTTPS reddit.com URL`);
    if (/\/user\//i.test(url.pathname)) throw new Error(`record ${index}: profile URLs are prohibited`);
    internalUrl = url.toString();
  }

  const combined = [raw, failed, tried, record.current_sleep_setup].filter(Boolean).join(" ");
  const barriers = classifyBarriers(combined);
  const enriched = {
    insight_id: "",
    source: "reddit",
    subreddit: record.subreddit,
    published_period: record.published_period,
    age_band: record.age_band,
    current_sleep_setup: record.current_sleep_setup,
    raw_problem_wording: raw,
    normalized_problem: normalizeProblem(raw, barriers.primary),
    failed_solution: failed,
    parent_action_already_tried: tried,
    primary_barrier: barriers.primary,
    secondary_barrier: barriers.secondary,
    transition_intent: transitionIntent(combined),
    urgency: urgency(combined),
    purchase_or_action_intent: record.purchase_or_action_intent,
    question_cluster: questionCluster(barriers.primary, record.current_sleep_setup, combined),
    answer_gap: answerGap(barriers.primary, failed),
    pilot_fit: record.pilot_fit,
    internal_source_url: internalUrl
  };
  enriched.insight_id = makeId(enriched);
  return enriched;
}

function countBy(records, key) {
  return records.reduce((counts, record) => ({ ...counts, [record[key]]: (counts[record[key]] || 0) + 1 }), {});
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const inputArg = args.find((arg) => !arg.startsWith("--"));
if (!inputArg) {
  fail("usage: node scripts/process-mynest-reddit-batch.mjs <manual-batch.json> [--dry-run]");
} else {
  try {
    const inputPath = path.resolve(process.cwd(), inputArg);
    const batch = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    if (!batch || batch.collected_by_human !== true || !Array.isArray(batch.records)) {
      throw new Error("batch must declare collected_by_human=true and contain a records array");
    }
    if (batch.records.length < 1 || batch.records.length > 30) throw new Error("a manual batch must contain 1-30 records");
    const enriched = batch.records.map((record, index) => enrich(record, index + 1));
    const existingLines = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8").split("\n").filter(Boolean) : [];
    const existing = existingLines.map(JSON.parse);
    const ids = new Set(existing.map((record) => record.insight_id));
    const accepted = enriched.filter((record) => !ids.has(record.insight_id));
    const duplicates = enriched.length - accepted.length;

    if (!dryRun && accepted.length > 0) {
      const prefix = existingLines.length > 0 ? "\n" : "";
      fs.appendFileSync(outputPath, `${prefix}${accepted.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
    }

    console.log(JSON.stringify({
      batch_id: batch.batch_id || null,
      mode: dryRun ? "DRY_RUN" : "APPEND",
      reviewed: enriched.length,
      accepted: accepted.length,
      duplicates_skipped: duplicates,
      primary_barriers: countBy(accepted, "primary_barrier"),
      question_clusters: countBy(accepted, "question_cluster"),
      urgency: countBy(accepted, "urgency"),
      pilot_fit: countBy(accepted, "pilot_fit")
    }, null, 2));
  } catch (error) {
    fail(error.message);
  }
}

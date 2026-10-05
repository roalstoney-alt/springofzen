import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));

const policy = json("data/mynest/research-policy.json");
const schema = json("data/mynest/reddit-insight-schema.json");
const map = json("data/mynest/question-map.json");
const queue = json("data/mynest/platform-content-queue.json");
const corpus = read("data/mynest/problem-corpus.jsonl").trim().split("\n").map(JSON.parse);
const insightText = read("data/mynest/reddit-insights.jsonl").trim();
const insights = insightText ? insightText.split("\n").map(JSON.parse) : [];
const prohibited = new Set(["username", "user_name", "name", "email", "phone", "profile_url", "child_name", "address", "exact_birthday", "exact_birthdate"]);

assert.equal(policy.project, "MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1.1");
assert.equal(policy.primary_manual_demand_source, "REDDIT");
assert.equal(policy.broad_autonomous_web_crawl, "DISABLED");
assert.equal(policy.primary_recruitment, "PAID_ACQUISITION");
assert.deepEqual(policy.paid_channels, ["META", "GOOGLE", "CHATGPT_ADS"]);
assert.equal(policy.direct_reddit_contact, "EXCEPTION_ONLY");
assert.equal(policy.mass_dm, "PROHIBITED");
assert.equal(policy.identity_scraping, "PROHIBITED");
assert.deepEqual(policy.child_choice, ["LIGHT", "STORY_OR_SOUND", "ROOM_FRIEND"]);

assert.equal(corpus.length, 111, "legacy corpus must remain unchanged at 111 records");
assert.equal(map.raw_problem_records, 111);
assert.equal(map.research_policy.legacy_corpus_status, "PRESERVED_HISTORICAL_EVIDENCE");
assert.equal(map.research_policy.broad_autonomous_web_crawl, "DISABLED");

assert.equal(schema.additionalProperties, false);
for (const field of prohibited) assert.ok(schema.privacy.prohibited_fields.includes(field), `${field} must be prohibited`);
for (const record of insights) {
  assert.equal(record.source, "reddit");
  assert.ok(!Object.keys(record).some((key) => prohibited.has(key.toLowerCase())), "insight contains an identity field");
  assert.match(record.primary_barrier, /^F0[1-6]$/);
  assert.match(record.insight_id, /^RDI-[0-9]{8}-[A-F0-9]{8}$/);
}

assert.equal(queue.external_posting, "DISABLED");
assert.equal(queue.broad_autonomous_web_crawl, "DISABLED");
assert.equal(queue.reddit.mass_dm, "PROHIBITED");
assert.equal(queue.reddit.identity_scraping, "PROHIBITED");
assert.deepEqual(queue.recruitment.channels, ["META", "GOOGLE", "CHATGPT_ADS"]);
assert.ok(queue.review_queue.every((item) => item.status === "HUMAN_REVIEW_REQUIRED"));
assert.equal(queue.review_queue.filter((item) => item.type === "REDDIT_PUBLIC_ANSWER").length, 1);
assert.equal(queue.review_queue.filter((item) => item.type === "SEO_IMPROVEMENT").length, 1);
assert.equal(queue.review_queue.filter((item) => item.type === "PAID_AD_ANGLE").length, 1);

const standard = read("docs/mynest/MYNEST_REDDIT_MANUAL_RESEARCH_STANDARD_v0.1.md");
assert.match(standard, /Broad\s+autonomous web crawling is disabled/i);
assert.match(standard, /must not search Reddit/i);
assert.match(standard, /Mass direct messages and\s+automated outreach are prohibited/i);

const recruit = read("mynest/recruit/index.html");
assert.match(recruit, /US\$39-equivalent completion voucher/);
assert.match(recruit, /not conditional on success, a purchase, a review, or a testimonial/i);
assert.match(recruit, /<link rel="canonical" href="https:\/\/www\.springofzen\.com\/mynest\/recruit\/">/);

const method = read("mynest/method/index.html");
assert.match(method, /manually reviewed from relevant public Reddit discussions/i);
assert.match(method, /broad autonomous web crawling is disabled/i);

for (const page of [
  "mynest/index.html",
  "mynest/recruit/index.html",
  "mynest/questions/index.html",
  "mynest/questions/child-wont-sleep-alone/index.html",
  "mynest/questions/child-refuses-own-room/index.html",
  "mynest/questions/child-afraid-of-dark-at-bedtime/index.html",
  "mynest/questions/child-keeps-coming-to-parents-bed/index.html",
  "mynest/questions/transition-from-cosleeping-to-own-room/index.html",
  "mynest/method/index.html",
  "mynest/results/index.html"
]) assert.match(read(page), /acquisition\.js\?v=20261005-v011/, `${page} must preserve bounded UTM attribution`);

const acquisition = read("mynest/acquisition.js");
assert.match(acquisition, /utm_source/);
assert.match(acquisition, /utm_medium/);
assert.doesNotMatch(acquisition, /email|phone|profile/i);

const worker = read("workers/mynest-api/src/index.js");
assert.match(worker, /acquisition_source/);
assert.match(worker, /voucher_eligible = 1/);
assert.match(worker, /COUNT\(DISTINCT checkpoint_day\)/);
assert.match(worker, /RECRUITMENT_ID_PATTERNS\.pilot_id/);
assert.match(worker, /recruitment_household_id/);
assert.match(worker, /recruitment_child_id/);

const migration = read("migrations/mynest/0003_add_acquisition_and_completion.sql");
for (const column of ["acquisition_source", "acquisition_medium", "campaign_key", "content_key", "voucher_eligible", "completed_at", "pilot_id", "recruitment_household_id", "recruitment_child_id"]) {
  assert.ok(migration.includes(column), `migration missing ${column}`);
}

console.log(`PASS v0.1.1: broad crawl disabled; 111 legacy records preserved; ${insights.length} manual Reddit insights; privacy schema, reviewed queue, UTM attribution, pilot linkage, and voucher completion gate verified.`);

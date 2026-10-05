import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const corpus = read("data/mynest/problem-corpus.jsonl").trim().split("\n").map(JSON.parse);
const map = JSON.parse(read("data/mynest/question-map.json"));
const queue = JSON.parse(read("data/mynest/platform-content-queue.json"));
const published = map.canonical_questions.filter((question) => question.status === "PUBLISHED");
const prohibited = new Set(["name", "child_name", "email", "phone", "address", "private_account_id", "child_name"]);

assert.ok(corpus.length >= 100, "corpus must contain at least 100 records");
assert.equal(map.canonical_questions.length, 20, "topic map must contain 20 canonical questions");
assert.equal(published.length, 5, "exactly five pages should launch in v0.1");
assert.ok(corpus.every((record) => record.source_url.startsWith("https://")), "every source must be public HTTPS");
assert.ok(corpus.every((record) => record.raw_question && record.normalized_question && record.primary_problem_code), "required problem fields must exist");
assert.ok(corpus.every((record) => !Object.keys(record).some((key) => prohibited.has(key))), "corpus must not carry identity fields");
assert.equal(queue.external_posting, "DISABLED");
assert.equal(queue.broad_autonomous_web_crawl, "DISABLED");
assert.ok(queue.review_queue.every((draft) => draft.status === "HUMAN_REVIEW_REQUIRED"));

const canonicalUrls = new Set();
for (const question of published) {
  assert.ok(question.publish_gate.real_demand_examples >= 3, `${question.slug} needs demand evidence`);
  const html = read(`mynest/questions/${question.slug}/index.html`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.ok(canonical, `${question.slug} is missing a canonical`);
  assert.ok(!canonicalUrls.has(canonical), `${question.slug} canonical is duplicated`);
  canonicalUrls.add(canonical);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.doesNotMatch(html, /"@type":"QAPage"/);
  assert.match(html, /href="\/mynest\/#room-check"/);
  assert.match(html, /Pilot data not yet sufficient\./);
  assert.match(html, /not medical treatment/i);
  assert.match(html, /Last materially updated: 2026-10-05/);
}

const main = read("mynest/index.html");
assert.match(main, /id="room-check"/);
for (const question of published) assert.match(main, new RegExp(`questions/${question.slug}/`));

const results = read("mynest/results/index.html");
assert.match(results, /Pilot data not yet sufficient\./);
assert.match(results, /We do not use invented sample results\./);

const sitemap = read("sitemap.xml");
for (const canonical of canonicalUrls) assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${canonical} missing from sitemap`);
assert.ok(!/queue-test|pilot_id|utm_/.test(sitemap), "sitemap contains a session or campaign URL");

console.log(`PASS: ${corpus.length} problem records; ${map.canonical_questions.length} canonical questions; ${published.length} published answer pages; ${canonicalUrls.size} unique canonicals; structured data, Room Check links, result linkage, privacy fields, and sitemap verified.`);

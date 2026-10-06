import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "/Users/roal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const base = process.env.MYNEST_QA_URL || "http://127.0.0.1:8894/mynest/magic-room/";
const output = new URL("../docs/mynest/ocean/qa/living-v02/", import.meta.url).pathname;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const errors = [];
const results = {};

async function shot(page, viewport, state) {
  await page.screenshot({ path: `${output}${viewport}-${state}.jpg`, type: "jpeg", quality: 76 });
}

async function forceState(page, state) {
  await page.evaluate((next) => {
    const b = document.body;
    const isMobile = innerWidth <= 680;
    const firstCopy = document.querySelector(".first-copy");
    firstCopy.style.transition = next === "00-real-room" ? "" : "none";
    b.className = "wake-ripple wake-water wake-life milo-entered ocean-ready";
    b.dataset.mode = "explore";
    b.dataset.fishState = "return";
    b.dataset.miloState = "idle";
    if (next === "00-real-room") b.className = "";
    if (next === "01-fish-discovery") { b.className = "wake-ripple wake-water wake-life"; b.dataset.fishState = "move"; }
    if (next === "02-milo-entry") b.classList.add("milo-arriving");
    if (next === "03-milo-approach") { b.classList.add("milo-response"); b.dataset.miloState = "approach"; }
    if (next === "04-shell-event") { b.classList.add("shell-response"); b.dataset.miloState = "notice_child"; b.dataset.fishState = "observe"; }
    if (next === "05-milo-return-home") { b.dataset.mode = "rest"; b.dataset.miloState = "return_home"; b.classList.add("return-quiet", "return-turn", "return-travel"); b.dataset.fishState = "hide"; }
    if (next === "06-sleep") { b.dataset.mode = "rest"; b.dataset.miloState = "sleep"; b.classList.add("return-quiet", "return-turn", "return-travel", "return-transfer", "return-sleep", "rest-complete"); b.dataset.fishState = "hide"; document.querySelector("[data-rest-phrase]").textContent = "Milo is sleeping."; }
    firstCopy.style.setProperty("opacity", next === "01-fish-discovery" ? "1" : "0", "important");
    document.querySelectorAll(".fish").forEach((fish, index) => {
      fish.style.setProperty("animation", "none", "important");
      fish.style.setProperty("opacity", ["01-fish-discovery", "02-milo-entry", "03-milo-approach", "04-shell-event"].includes(next) ? String(.92 - index * .07) : "0", "important");
    });
    const milo = document.querySelector("[data-milo]");
    milo.style.setProperty("animation", "none", "important");
    milo.style.setProperty("opacity", ["02-milo-entry", "03-milo-approach", "04-shell-event", "05-milo-return-home"].includes(next) ? ".94" : "0", "important");
    milo.style.setProperty("left", next === "05-milo-return-home" ? (isMobile ? "40%" : "65%") : (isMobile ? "18%" : next === "02-milo-entry" ? "33%" : "39%"), "important");
    milo.style.setProperty("top", next === "05-milo-return-home" ? (isMobile ? "42%" : "38%") : (isMobile ? "58%" : next === "02-milo-entry" ? "52%" : "49%"), "important");
    const shell = document.querySelector(".shell-event");
    shell.style.setProperty("animation", "none", "important");
    shell.style.setProperty("opacity", next === "04-shell-event" ? ".72" : "0", "important");
    const breath = document.querySelector(".sleep-breath");
    breath.style.setProperty("animation", "none", "important");
    breath.style.setProperty("opacity", next === "06-sleep" ? ".22" : "0", "important");
  }, state);
  await page.waitForTimeout(180);
}

for (const config of [
  { name: "desktop", viewport: { width: 1280, height: 720 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
]) {
  const context = await browser.newContext({ viewport: config.viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`${config.name}: ${error}`));
  await page.goto(base, { waitUntil: "networkidle" });
  for (const state of ["00-real-room", "01-fish-discovery", "02-milo-entry", "03-milo-approach", "04-shell-event", "05-milo-return-home", "06-sleep"]) {
    await forceState(page, state);
    await shot(page, config.name, state);
  }
  results[config.name] = await page.evaluate(() => {
    const stage = document.querySelector("[data-room-stage]").getBoundingClientRect();
    const fish = [...document.querySelectorAll("[data-fish]")];
    return {
      viewport: [innerWidth, innerHeight],
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      roomImage: document.querySelector(".room-photo img").currentSrc,
      fishSlots: fish.length,
      visibleFishSlots: fish.filter((node) => getComputedStyle(node).display !== "none").length,
      fishLow: fish.filter((node) => getComputedStyle(node).display !== "none").every((node) => node.getBoundingClientRect().top >= stage.top + stage.height * .5),
      controls: [...document.querySelectorAll(".scene-controls button")].map((node) => node.getAttribute("aria-label") || node.textContent.trim()),
    };
  });
  await context.close();
}

const actual = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const actualPage = await actual.newPage();
actualPage.on("pageerror", (error) => errors.push(`actual: ${error}`));
await actualPage.goto(base, { waitUntil: "networkidle" });
await actualPage.waitForTimeout(10_200);
results.actual = await actualPage.evaluate(() => ({
  ready: document.body.classList.contains("ocean-ready"),
  mode: document.body.dataset.mode,
  visibleFishSlots: [...document.querySelectorAll("[data-fish]")].filter((node) => getComputedStyle(node).display !== "none").length,
  firstCopyOpacity: Number(getComputedStyle(document.querySelector(".first-copy")).opacity),
  miloOpacity: Number(getComputedStyle(document.querySelector("[data-milo]")).opacity),
}));
await actualPage.locator('[data-room-zone="shell"]').click();
await actualPage.waitForTimeout(1_100);
results.actual.shellResponse = await actualPage.evaluate(() => document.body.classList.contains("shell-response"));
await actual.close();

const reduced = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
const reducedPage = await reduced.newPage();
reducedPage.on("pageerror", (error) => errors.push(`reduced: ${error}`));
await reducedPage.goto(base, { waitUntil: "networkidle" });
await reducedPage.waitForTimeout(3100);
await reducedPage.locator("[data-rest-toggle]").click();
await reducedPage.waitForTimeout(2800);
results.reduced = await reducedPage.evaluate(() => ({
  sleep: document.body.classList.contains("return-sleep"),
  miloState: document.body.dataset.miloState,
  caustics: getComputedStyle(document.querySelector(".wall-caustics")).display,
}));
await reduced.close();

await browser.close();
assert.equal(errors.length, 0, errors.join("\n"));
for (const key of ["desktop", "mobile"]) {
  assert.equal(results[key].overflow, false);
  assert.equal(results[key].fishSlots, 5);
  assert.equal(results[key].visibleFishSlots, 3);
  assert.equal(results[key].fishLow, true);
}
assert.match(results.mobile.roomImage, /ocean-room-child-eye-mobile-v03\.jpg/);
assert.equal(results.actual.ready, true);
assert.equal(results.actual.mode, "explore");
assert.equal(results.actual.visibleFishSlots, 3);
assert.ok(results.actual.firstCopyOpacity < .1);
assert.ok(results.actual.miloOpacity > .5);
assert.equal(results.actual.shellResponse, true);
assert.equal(results.reduced.sleep, true);
assert.equal(results.reduced.miloState, "sleep");
assert.equal(results.reduced.caustics, "none");
results.errors = errors;
console.log(JSON.stringify(results, null, 2));

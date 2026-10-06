import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "/Users/roal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseURL = process.env.MYNEST_QA_URL || "http://127.0.0.1:8898";
const output = resolve(import.meta.dirname, "../docs/mynest/ocean/qa/rest-v031");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});

async function prepareRoom(page) {
  await page.goto(`${baseURL}/mynest/magic-room/`, { waitUntil: "networkidle" });
  await page.locator(".room-photo img").evaluateAll((images) => Promise.all(images.map((img) => img.complete && img.naturalWidth > 0 ? true : new Promise((done) => img.addEventListener("load", done, { once: true })) )));
  await page.evaluate(() => {
    const lastTimer = window.setTimeout(() => {}, 0);
    for (let timer = 0; timer <= lastTimer; timer += 1) {
      window.clearTimeout(timer);
      window.clearInterval(timer);
    }
    document.body.className = "controls-ready ocean-ready wake-water wake-life discovery-one discovery-two discovery-three milo-entered";
    document.body.dataset.mode = "explore";
    document.body.dataset.roomLight = "day";
    document.body.dataset.miloState = "idle";
    document.body.dataset.fishState = "observe";
    const milo = document.querySelector(".milo");
    milo.style.animation = "none";
    milo.style.opacity = ".92";
  });
}

async function roomSuite(label, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await prepareRoom(page);

  const daySrc = await page.locator(".room-photo-day img").evaluate((img) => img.currentSrc);
  const nightSrc = await page.locator(".room-photo-night img").evaluate((img) => img.currentSrc);
  assert.match(daySrc, label === "mobile" ? /ocean-room-base-v03-mobile\.jpg/ : /ocean-room-base-v03-desktop\.jpg/);
  assert.match(nightSrc, label === "mobile" ? /ocean-room-base-v03-mobile-night\.jpg/ : /ocean-room-base-v03-desktop-night\.jpg/);
  const rects = await page.locator(".room-photo").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return [rect.x, rect.y, rect.width, rect.height];
  }));
  assert.deepEqual(rects[0], rects[1], `${label}: DAY and NIGHT layers must align exactly`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${label}: no horizontal overflow`);
  await page.screenshot({ path: `${output}/${label}-day.jpg`, type: "jpeg", quality: 90 });

  await page.locator("[data-rest-toggle]").click();
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "day");
  await page.waitForTimeout(1050);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "dusk");
  assert.equal(await page.locator(".room-photo-night").evaluate((el) => getComputedStyle(el).transitionDuration), "1.8s", `${label}: DAY → DUSK must use a timed crossfade`);
  await page.waitForTimeout(1500);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "dusk");
  assert.ok(await page.locator(".room-photo-night").evaluate((el) => Number(getComputedStyle(el).opacity)) > .45, `${label}: DUSK blend must be visible before NIGHT begins`);
  await page.screenshot({ path: `${output}/${label}-dusk.jpg`, type: "jpeg", quality: 90 });

  await page.waitForTimeout(2950);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "night");
  assert.ok(await page.locator(".room-photo-night").evaluate((el) => Number(getComputedStyle(el).opacity)) > .96, `${label}: NIGHT base must become dominant`);
  assert.ok(await page.locator(".fish-field").evaluate((el) => Number(getComputedStyle(el).opacity)) < .02, `${label}: fish must be gone at NIGHT`);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("return-travel")), true, `${label}: Milo returns only after NIGHT is substantially complete`);
  await page.screenshot({ path: `${output}/${label}-night.jpg`, type: "jpeg", quality: 90 });

  await page.waitForTimeout(7200);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("rest-complete")), true);
  assert.ok(await page.locator(".milo").evaluate((el) => Number(getComputedStyle(el).opacity)) < .02, `${label}: digital Milo must be gone in final sleep`);
  await page.screenshot({ path: `${output}/${label}-milo-home-night.jpg`, type: "jpeg", quality: 90 });

  await page.locator("[data-rest-toggle]").click();
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "dusk", `${label}: Rest exit must begin at DUSK`);
  await page.waitForTimeout(1900);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "day", `${label}: Rest exit must restore DAY without a jump`);
  assert.equal(await page.locator("body").getAttribute("data-fish-state"), "hide", `${label}: fish must remain hidden during the reverse crossfade`);
  await page.waitForTimeout(1950);
  assert.equal(await page.locator("body").getAttribute("data-fish-state"), "return", `${label}: fish return only after DAY`);
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await context.close();
}

async function reducedMotionSuite() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await prepareRoom(page);
  await page.locator("[data-rest-toggle]").click();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "dusk");
  assert.equal(await page.locator(".room-photo-night").evaluate((el) => getComputedStyle(el).transitionDuration), "2s", "reduced motion must retain a slow opacity crossfade");
  await page.waitForTimeout(1500);
  const duskOpacity = await page.locator(".room-photo-night").evaluate((el) => Number(getComputedStyle(el).opacity));
  assert.ok(duskOpacity > .44 && duskOpacity < .5, "reduced motion must reach the DUSK blend before NIGHT begins");
  await page.waitForTimeout(2900);
  assert.equal(await page.locator("body").getAttribute("data-room-light"), "night");
  assert.ok(await page.locator(".room-photo-night").evaluate((el) => Number(getComputedStyle(el).opacity)) > .95);
  await context.close();
}

try {
  await Promise.all([
    roomSuite("desktop", { width: 1440, height: 900 }),
    roomSuite("mobile", { width: 390, height: 844 }),
    reducedMotionSuite(),
  ]);
  console.log(`PASS browser Rest lighting QA and 8 visual states: ${output}`);
} finally {
  await browser.close();
}

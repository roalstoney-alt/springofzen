import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "/Users/roal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseURL = process.env.MYNEST_QA_URL || "http://127.0.0.1:8896";
const output = resolve(import.meta.dirname, "../docs/mynest/ocean/qa/lived-v03");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});

async function roomSuite(label, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/mynest/magic-room/`, { waitUntil: "networkidle" });
  await page.locator(".room-photo img").evaluate((img) => img.complete && img.naturalWidth > 0 || new Promise((done) => img.addEventListener("load", done, { once: true })));
  await page.evaluate(() => {
    const lastTimer = window.setTimeout(() => {}, 0);
    for (let timer = 0; timer <= lastTimer; timer += 1) {
      window.clearTimeout(timer);
      window.clearInterval(timer);
    }
  });

  const currentSrc = await page.locator(".room-photo img").evaluate((img) => img.currentSrc);
  assert.match(currentSrc, label === "mobile" ? /ocean-room-base-v03-mobile\.jpg/ : /ocean-room-base-v03-desktop\.jpg/);
  assert.equal(await page.locator(".first-copy,.wake-control,.ocean-brand").count(), 0, `${label}: staging copy/controls must not exist`);
  assert.equal(await page.locator(".method-fold").getAttribute("open"), null, `${label}: method must start closed`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${label}: no horizontal overflow`);

  await page.evaluate(() => {
    document.body.className = "";
    document.body.dataset.mode = "explore";
    document.body.dataset.miloState = "idle";
    document.body.removeAttribute("data-fish-state");
  });
  await page.screenshot({ path: `${output}/${label}-real-room.jpg`, type: "jpeg", quality: 88 });

  await page.evaluate(() => {
    document.body.dataset.fishState = "observe";
    document.body.classList.add("controls-ready", "wake-ripple", "fish-peek", "discovery-one");
  });
  await page.waitForTimeout(1300);
  const firstFishOpacity = await page.locator(".fish-a").evaluate((el) => Number(getComputedStyle(el).opacity));
  const secondFishOpacity = await page.locator(".fish-b").evaluate((el) => Number(getComputedStyle(el).opacity));
  assert.ok(firstFishOpacity > secondFishOpacity, `${label}: first fish must be isolated`);
  await page.screenshot({ path: `${output}/${label}-first-fish.jpg`, type: "jpeg", quality: 88 });

  await page.evaluate(() => document.body.classList.add("wake-water", "wake-life", "discovery-two", "discovery-three", "milo-entered", "ocean-ready"));
  await page.waitForTimeout(4400);
  await page.screenshot({ path: `${output}/${label}-milo.jpg`, type: "jpeg", quality: 88 });

  await page.evaluate(() => {
    document.body.dataset.mode = "rest";
    document.body.dataset.miloState = "sleep";
    document.body.classList.add("return-sleep");
  });
  await page.waitForTimeout(2100);
  assert.ok(await page.locator(".fish-field").evaluate((el) => Number(getComputedStyle(el).opacity)) < .02, `${label}: fish must leave in Rest`);
  await page.screenshot({ path: `${output}/${label}-rest.jpg`, type: "jpeg", quality: 88 });
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await context.close();
}

async function timingSuite() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/mynest/magic-room/`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("controls-ready")), false);
  await page.waitForTimeout(1700);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("controls-ready")), true, "controls must appear after 1.5 seconds");
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("discovery-one")), false, "fish must not arrive with controls");
  await page.waitForTimeout(1600);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("discovery-one")), true, "first fish must appear around 3 seconds");
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("discovery-two")), false, "second discovery must pause");
  await page.waitForTimeout(3100);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("discovery-two")), true, "second fish must appear around 6 seconds");
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("milo-entered")), false, "Milo must not arrive before 10 seconds");
  await page.waitForTimeout(4400);
  assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("milo-entered")), true, "Milo must arrive after the room has settled");
  await context.close();
}

async function homeSuite(label, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/mynest/`, { waitUntil: "networkidle" });
  const currentSrc = await page.locator(".home-room-visual img").evaluate((img) => img.currentSrc);
  assert.match(currentSrc, label === "mobile" ? /ocean-room-base-v03-mobile\.jpg/ : /ocean-room-base-v03-desktop\.jpg/);
  assert.equal(await page.locator(".lived-home").evaluate((el) => el.getBoundingClientRect().height >= innerHeight * .95), true, `${label}: visual hero must own the first viewport`);
  assert.equal(await page.getByText("See the room", { exact: false }).first().isVisible(), true);
  assert.equal(await page.getByText("My child won’t sleep alone", { exact: false }).isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${label}: home must not overflow`);
  await context.close();
}

try {
  await Promise.all([
    roomSuite("desktop", { width: 1440, height: 900 }),
    roomSuite("mobile", { width: 390, height: 844 }),
    timingSuite(),
    homeSuite("desktop", { width: 1440, height: 900 }),
    homeSuite("mobile", { width: 390, height: 844 }),
  ]);
  console.log(`PASS browser QA and 8 visual states: ${output}`);
} finally {
  await browser.close();
}

import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const read = (relative) => readFile(path.join(root, relative));
const text = async (relative) => (await read(relative)).toString("utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

const controlHashes = {
  "forest-room-day-desktop-v01.jpg": "cd8bd8f7676de35155e7836f5a003bce88815cc271e5163abc5a14b2f9f826b3",
  "forest-room-day-mobile-v01.jpg": "29986e14b7bc2ebca94359d2a776c26c572cae37b8413038bb530ab2913488d3",
  "forest-room-night-desktop-v01.jpg": "deb857902781c3decaa96db545649112053887d25175bfb3896f5ca76ecb7625",
  "forest-room-night-mobile-v01.jpg": "ecd3fc6e94b50a3d21769cbb28de35cd5b15e4187b2dab46b2b2b9afb160d68b",
  "forest-room-rest-desktop-v01.jpg": "49efe595ec06528b094b0af7f6a629989ed4d97a59cb3c409514bbe31810282c",
  "forest-room-rest-mobile-v01.jpg": "3023a7cc55858690a35ebe10ae65703499f5815b59c713549838fdc6ba482a50"
};

const [html, js, css] = await Promise.all([
  text("mynest/forest-room/index.html"),
  text("mynest/forest-room/forest-room.js"),
  text("mynest/forest-room/forest-room.css")
]);

for (const [filename, expectedHash] of Object.entries(controlHashes)) {
  const bytes = await read(`mynest/forest-room/assets/${filename}`);
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  assert(actualHash === expectedHash, `A control retained byte-for-byte: ${filename}`);
}

for (const state of ["day", "night", "rest"]) {
  for (const size of ["desktop", "mobile"]) {
    const filename = `forest-room-${state}-${size}-b-practical-v02.webp`;
    const relative = `mynest/forest-room/assets/${filename}`;
    await access(path.join(root, relative));
    const bytes = await read(relative);
    assert(bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP", `B asset is WebP: ${filename}`);
    assert((await stat(path.join(root, relative))).size > 150_000, `B asset is production-sized: ${filename}`);
    assert(html.includes(filename), `B asset is wired into the comparison route: ${filename}`);
    const metadata = await sharp(path.join(root, relative)).metadata();
    const expected = size === "desktop" ? [1672, 941] : [941, 1672];
    assert(metadata.width === expected[0] && metadata.height === expected[1], `B asset has the intended ${size} framing: ${filename}`);
  }
}

assert(html.includes('get("floor") === "b" ? "b" : "a"'), "query assignment accepts only explicit floor=b");
assert(js.includes('window.__forestFloorVariant === "b" ? "b" : "a"'), "runtime defaults safely to A control");
assert(js.includes("body.dataset.floorVariant = floorVariant"), "selected floor variant is exposed for deterministic QA");
assert(!/localStorage|sessionStorage/.test(html + js), "A/B preview stores no visitor identifier");
assert(!/fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), "A/B preview adds no backend or telemetry call");
assert((html.match(/data-mode=/g) || []).length === 3, "day, night, and lights-off controls remain unchanged");
assert(js.includes("seedFireflies") && css.includes("firefly-drift"), "existing firefly behavior remains unchanged");
assert(css.includes('body[data-forest-mode="night"] .firefly-field { opacity: 1; }'), "fireflies are reserved for the night mode");
assert(css.includes('html[data-floor-variant="b"] .window-stars { display: none; }'), "B relies on the photographed night window without an extra star layer");
assert(html.includes("Exactly two practical bedside lamps") && html.includes("fitted short-pile carpet"), "practical implementation boundaries are public");
assert(js.includes('body.dataset.forestMode === "rest"') && css.includes('data-forest-mode="rest"] .firefly-field'), "lights-off motion boundary remains unchanged");
assert(js.includes("prefers-reduced-motion") && css.includes("prefers-reduced-motion"), "reduced-motion behavior remains unchanged");

console.log("MYNEST_FOREST_PRACTICAL_V02_QA=PASS");

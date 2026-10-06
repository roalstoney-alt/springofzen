import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const room = read("mynest/magic-room/index.html");
const css = read("mynest/magic-room/magic-room.css");
const runtime = read("mynest/magic-room/magic-room.js");
const sync = read("mynest/magic-room/magic-room-sync.js");
const home = read("mynest/index.html");
const portalCss = read("mynest/portal.css");
const map = JSON.parse(read("data/mynest/OCEAN_ROOM_001_MAP.json"));
const desktop = JSON.parse(read("data/mynest/ocean-room-001-desktop-map.json"));
const mobile = JSON.parse(read("data/mynest/ocean-room-001-mobile-map.json"));
const paths = JSON.parse(read("data/mynest/ocean-room-001-paths.json"));

for (const name of [
  "MYNEST_OCEAN_REAL_ROOM_001_LIVED_IN_REFRAME_v0.3.md",
  "OCEAN_ROOM_001_BASE_ART_v0.3.md",
  "OCEAN_ROOM_001_FIRST_VIEWPORT_v0.3.md",
  "OCEAN_ROOM_001_CONSUMER_COPY_v0.1.md",
]) assert.ok(statSync(resolve(root, "docs/mynest/ocean", name)).size > 500, `${name} must be substantive`);

for (const asset of [
  "ocean-room-base-v03-desktop.jpg",
  "ocean-room-base-v03-mobile.jpg",
  "milo-living-cutout-v02.webp",
  "baby-fish-family-v01.webp",
]) assert.ok(statSync(resolve(root, "mynest/magic-room/assets", asset)).size > 20_000, `${asset} is missing or implausibly small`);

assert.match(room, /ocean-room-base-v03-desktop\.jpg/);
assert.match(room, /ocean-room-base-v03-mobile\.jpg/);
assert.doesNotMatch(room, /Something lives|Watch closely|Wake the room|Ocean Room 001/i);
assert.doesNotMatch(room, /data-wake|data-restart/);
assert.doesNotMatch(room, /\bSKU\b|\bP0\b|\bP1\b/);
assert.equal((room.match(/data-room-zone=/g) || []).length, 3, "exactly three physical anchors are allowed");
assert.equal((room.match(/data-fish/g) || []).length, 5, "five slots preserve the hard population ceiling");
for (const name of ["Milo Plush", "Shell Light", "Reef Accent", "Own-room night setup", "How we're testing this"]) assert.match(room, new RegExp(name));
assert.match(room, /<details class="method-fold" id="pilot"><summary>/, "method section must be collapsed by default");

assert.match(home, /class="home-room-visual"/);
assert.match(home, /See the room/);
assert.match(home, /My child won.t sleep alone/);
assert.doesNotMatch(home, /pilot-chip|Ocean Room 001|See Magic/i);
assert.match(portalCss, /\.lived-home/);
assert.match(portalCss, /ocean-room-base-v03-mobile\.jpg|home-room-visual/);

assert.match(runtime, /\[3000, 4500, 6000, 8000, 10500, 13500\]/);
for (const state of ["discovery-one", "discovery-two", "discovery-three", "milo-entered"]) assert.match(runtime, new RegExp(state));
assert.match(runtime, /classList\.add\("controls-ready"\), reducedMotion \? 250 : 1500/);
assert.doesNotMatch(runtime, /getUserMedia|MediaRecorder|sendBeacon/);
assert.match(sync, /MyNestMagicRoomSync/);

assert.match(css, /ocean-room-base-v03-desktop\.jpg/);
assert.match(css, /ocean-room-base-v03-mobile\.jpg/);
assert.match(css, /body\.controls-ready/);
assert.match(css, /body\.discovery-one/);
assert.match(css, /prefers-reduced-motion:reduce/);

assert.equal(map.schema_version, "0.3");
assert.equal(map.measurement_status, "pending_physical_room");
assert.equal(map.room.physical_width_mm, null, "unknown measurements must stay explicit");
assert.equal(desktop.schema_version, "0.3");
assert.equal(desktop.aspect_ratio, "16:9");
assert.equal(mobile.schema_version, "0.3");
assert.equal(mobile.aspect_ratio, "9:16");
assert.notDeepEqual(desktop.anchors, mobile.anchors, "mobile anchors must be independently authored");
assert.equal(Object.keys(desktop.masks).length, 9);
assert.equal(Object.keys(mobile.masks).length, 9);
assert.ok(Object.keys(desktop.masks).every((name) => name.startsWith("MASK_DESKTOP_")));
assert.ok(Object.keys(mobile.masks).every((name) => name.startsWith("MASK_MOBILE_")));
assert.equal(paths.schema_version, "0.3");
for (const path of Object.values(paths.paths)) {
  assert.equal(path.desktop.length, 4);
  assert.equal(path.mobile.length, 4);
  assert.notDeepEqual(path.desktop, path.mobile);
}

console.log("PASS Lived-in Reframe v0.3: room-only first viewport, delayed controls, independent desktop/mobile art and maps, staged discovery, consumer framing, collapsed method, and frozen backend contract verified.");

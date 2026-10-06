import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const page = read("mynest/magic-room/index.html");
const css = read("mynest/magic-room/magic-room.css");
const runtime = read("mynest/magic-room/magic-room.js");
const sync = read("mynest/magic-room/magic-room-sync.js");

for (const asset of [
  "ocean-room-base-v03-desktop.jpg",
  "ocean-room-base-v03-desktop-night.jpg",
  "ocean-room-base-v03-mobile.jpg",
  "ocean-room-base-v03-mobile-night.jpg",
]) assert.ok(statSync(resolve(root, "mynest/magic-room/assets", asset)).size > 100_000, `${asset} is missing or implausibly small`);

for (const doc of [
  "MYNEST_OCEAN_REST_NIGHT_LIGHTING_PATCH_v0.3.1.md",
  "OCEAN_ROOM_001_NIGHT_LIGHTING_v0.3.1.md",
]) assert.ok(statSync(resolve(root, "docs/mynest/ocean", doc)).size > 900, `${doc} must be substantive`);

assert.match(page, /data-room-light="day"/);
assert.match(page, /room-photo-day/);
assert.match(page, /room-photo-night/);
assert.match(page, /ocean-room-base-v03-desktop-night\.jpg/);
assert.match(page, /ocean-room-base-v03-mobile-night\.jpg/);
assert.equal((page.match(/room-photo-night/g) || []).length, 1, "exactly one paired NIGHT layer is allowed");

for (const state of ["day", "dusk", "night"]) assert.match(css, new RegExp(`data-room-light=\\"${state}\\"`));
assert.match(css, /room-photo-night/);
assert.match(css, /opacity:\.48/);
assert.match(css, /body\.fish-exit \.fish-field/);
assert.match(css, /body\[data-room-light="night"\] \.fish-field\{opacity:0!important\}/);
assert.match(css, /body\.rest-complete\[data-room-light="night"\]/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.doesNotMatch(css.slice(css.lastIndexOf("Rest Night Lighting Patch v0.3.1")), /background:\s*(?:#000|black)|rgba\(0,0,0,1\)/i, "patch must not fake night with one black overlay");

assert.match(runtime, /function setRoomLight\(state\)/);
assert.match(runtime, /\["day", "dusk", "night"\]/);
assert.match(runtime, /\[300, 800, 1500, 2000, 3000, 4500, 5200, 9400, 12600\]/);
assert.match(runtime, /setRoomLight\("dusk"\)/);
assert.match(runtime, /setRoomLight\("night"\)/);
assert.match(runtime, /queueTimer\(returnTimers, 1800, \(\) => setRoomLight\("day"\)\)/);
assert.match(runtime, /queueTimer\(returnTimers, 3700/);
assert.ok(runtime.indexOf('setRoomLight("night")') < runtime.indexOf('logLocal("MILO_RETURN_HOME_STARTED")'), "NIGHT must begin before Milo return");
assert.doesNotMatch(runtime, /getUserMedia|MediaRecorder|sendBeacon/);
assert.match(sync, /MyNestMagicRoomSync/);

console.log("PASS Rest Night Lighting v0.3.1: paired night assets, DAY/DUSK/NIGHT crossfade, fish exit, Milo dependency, reverse transition, reduced motion, and frozen backend contract verified.");

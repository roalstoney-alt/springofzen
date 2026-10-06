import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const page = read("mynest/magic-room/index.html");
const css = read("mynest/magic-room/magic-room.css");
const runtime = read("mynest/magic-room/magic-room.js");
const sync = read("mynest/magic-room/magic-room-sync.js");
const home = read("mynest/index.html");
const map = JSON.parse(read("data/mynest/OCEAN_ROOM_001_MAP.json"));
const paths = JSON.parse(read("data/mynest/ocean-room-001-paths.json"));

const docs = [
  "MYNEST_OCEAN_REAL_ROOM_001_LIVING_SCENE_v0.2.md",
  "OCEAN_ROOM_001_ART_DIRECTION_v0.2.md",
  "MILO_VISUAL_IDENTITY_v0.2.md",
  "BABY_FISH_BEHAVIOR_v0.1.md",
  "OCEAN_ROOM_001_OCCLUSION_MAP_v0.2.md",
  "MILO_RETURN_HOME_SEQUENCE_v0.2.md",
];
for (const name of docs) assert.ok(statSync(resolve(root, "docs/mynest/ocean", name)).size > 300, `${name} must be substantive`);

for (const asset of [
  "ocean-room-child-eye-desktop-v03.jpg",
  "ocean-room-child-eye-mobile-v03.jpg",
  "milo-living-cutout-v02.webp",
  "baby-fish-family-v01.webp",
]) assert.ok(statSync(resolve(root, "mynest/magic-room/assets", asset)).size > 20_000, `${asset} is missing or implausibly small`);

assert.equal((page.match(/data-fish/g) || []).length, 5, "five slots must enforce the hard population ceiling");
assert.match(css, /\.fish-d,\.fish-e\{display:none!important\}/, "default population must be three");
assert.equal((page.match(/data-room-zone=/g) || []).length, 3, "exactly three physical anchors are allowed");
for (const anchor of ["plush", "shell", "reef"]) assert.match(page, new RegExp(`data-room-zone="${anchor}"`));
assert.match(page, /ocean-room-child-eye-desktop-v03\.jpg/);
assert.match(page, /ocean-room-child-eye-mobile-v03\.jpg/);
assert.match(page, /data-restart/);
assert.match(page, /data-rest-toggle/);
assert.doesNotMatch(page, /<button[^>]*data-mode=/, "first viewport must not expose mode tabs");
assert.doesNotMatch(page, /forest-preview|space-preview|checkout|subscription/i);
assert.match(home, /Milo and three small fish/);

for (const state of ["move", "observe", "hide", "return"]) assert.match(runtime, new RegExp(`"${state}"`));
for (const state of ["idle", "notice_child", "approach", "play", "return_home", "sleep"]) assert.match(runtime, new RegExp(`"${state}"`));
for (const phase of ["return-quiet", "return-turn", "return-travel", "return-transfer", "return-sleep"]) assert.match(runtime, new RegExp(phase));
for (const event of ["SHELL_CLICKED", "REEF_CLICKED", "PLUSH_CLICKED", "MILO_RETURN_HOME_STARTED", "MILO_RETURNED_HOME"]) assert.match(runtime, new RegExp(event));
assert.match(runtime, /activeInteraction/);
assert.match(runtime, /FISH_FOLLOWED_BRIEFLY/);
assert.doesNotMatch(runtime, /getUserMedia|MediaRecorder|sendBeacon/);

assert.match(css, /milo-living-cutout-v02\.webp/);
assert.match(css, /baby-fish-family-v01\.webp/);
assert.match(css, /body\.return-sleep \.sleep-breath/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.doesNotMatch(css.slice(css.lastIndexOf("Living Scene v0.2")), /ceiling-ocean/);

assert.equal(map.schema_version, "0.2");
assert.equal(map.measurement_status, "pending_physical_room");
assert.equal(map.room.physical_width_mm, null, "unknown measurements must stay explicit");
assert.deepEqual(Object.keys(map.objects), ["shell_light", "reef_accent", "milo_plush"]);
assert.equal(paths.schema_version, "0.2");
for (const name of ["FISH_PATH_REEF_TO_BED", "FISH_PATH_BED_TO_WALL", "FISH_PATH_WALL_TO_CURTAIN", "MILO_PATH_ENTRY", "MILO_PATH_APPROACH", "MILO_PATH_HOME"]) {
  assert.equal(paths.paths[name].desktop.length, 4);
  assert.equal(paths.paths[name].mobile.length, 4);
}

assert.match(sync, /MyNestMagicRoomSync/);
console.log("PASS Living Scene v0.2: child-eye masters, three-fish default/five maximum, realistic sprites, finite autonomy, three physical anchors, Milo return, reduced motion, and frozen backend contract verified.");

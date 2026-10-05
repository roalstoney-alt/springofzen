import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const page = read("mynest/magic-room/index.html");
const css = read("mynest/magic-room/magic-room.css");
const runtime = read("mynest/magic-room/magic-room.js");
const home = read("mynest/index.html");
const map = JSON.parse(read("data/mynest/OCEAN_ROOM_001_MAP.json"));

const requiredDocs = [
  "docs/mynest/ocean/MYNEST_OCEAN_REAL_ROOM_001_SCENE_AND_SKU_SPEC_v0.1.md",
  "docs/mynest/ocean/OCEAN_ROOM_001_SCENE_MAP_v0.1.md",
  "docs/mynest/ocean/MILO_RETURN_HOME_SEQUENCE_v0.1.md",
  "docs/mynest/ocean/MILO_PLUSH_SKU_v0.1.md",
  "docs/mynest/ocean/SHELL_LIGHT_SKU_v0.1.md",
  "docs/mynest/ocean/REEF_ACCENT_SKU_v0.1.md",
  "docs/mynest/ocean/OCEAN_ROOM_001_CHILD_TEST_v0.1.md",
];
for (const path of requiredDocs) assert.ok(statSync(resolve(root, path)).size > 300, `${path} must be substantive`);

assert.equal((page.match(/data-fish/g) || []).length, 5, "Room 001 must render exactly five fish");
assert.equal((page.match(/data-room-zone=/g) || []).length, 3, "Room 001 must expose exactly three physical anchors");
for (const anchor of ["plush", "shell", "reef"]) assert.match(page, new RegExp(`data-room-zone="${anchor}"`));
assert.match(page, /data-milo/);
assert.doesNotMatch(page, /follow-school|ceiling-ocean|bubble-field|nini-glow|pip-discovery|story-shells/);
assert.doesNotMatch(page, /forest-preview|space-preview|checkout|subscription/i);
assert.match(page, /See Milo go home/);
assert.match(page, /SKU_OCEAN_001/);
assert.match(page, /SKU_OCEAN_002/);
assert.match(page, /SKU_OCEAN_003/);
assert.match(home, /Ocean Room 001/);
assert.match(home, /digital Milo return into the physical plush/);
assert.doesNotMatch(home, /Forest · Mosswood|Space · NovaNest/);

for (const fishState of ["move", "observe", "hide", "return"]) assert.match(runtime, new RegExp(`"${fishState}"`));
for (const miloState of ["idle", "notice_child", "approach", "play", "return_home", "sleep"]) assert.match(runtime, new RegExp(`"${miloState}"`));
for (const phase of ["return-quiet", "return-turn", "return-travel", "return-transfer", "return-sleep"]) assert.match(runtime, new RegExp(phase));
for (const event of ["SHELL_CLICKED", "REEF_CLICKED", "PLUSH_CLICKED", "MILO_RETURN_HOME_STARTED", "MILO_RETURNED_HOME"]) assert.match(runtime, new RegExp(event));
assert.match(runtime, /2200/);
assert.match(runtime, /scheduleFishCycle/);
assert.match(runtime, /scheduleResidentLoop/);
assert.doesNotMatch(runtime, /fetch\(|sendBeacon|getUserMedia|MediaRecorder/);

assert.match(css, /Ocean Room 001/);
assert.match(css, /body\[data-fish-state="hide"\]/);
assert.match(css, /body\.return-travel \.milo/);
assert.match(css, /body\.return-transfer \.plush-glow/);
assert.match(css, /body\.return-sleep \.sleep-breath/);
assert.match(css, /prefers-reduced-motion:reduce/);

assert.equal(map.schema_version, "0.1");
assert.equal(map.measurement_status, "pending_physical_room");
assert.equal(map.room.width_mm, null, "unknown physical dimensions must not be fabricated");
assert.deepEqual(Object.keys(map.objects).slice(2, 5), ["shell_light", "reef_accent", "milo_plush"]);
assert.deepEqual(Object.keys(map.zones), ["floor_edge", "child_wall", "milo_transit", "sleep_zone"]);

console.log("PASS Room 001: restrained five-fish scene, finite life states, three physical anchors, Milo resident behavior, return-to-plush sequence, SKU briefs, and honest pending geometry verified.");

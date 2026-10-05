import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const exists = (path) => access(resolve(root, path));

const requiredFiles = [
  "mynest/magic-room/index.html",
  "mynest/magic-room/magic-room.css",
  "mynest/magic-room/worlds.js",
  "mynest/magic-room/magic-room.js",
  "mynest/magic-room/magic-room-sync.js",
  "data/mynest/magic-room-config.json",
  "migrations/mynest/0004_create_magic_room_events.sql",
  "docs/mynest/MYNEST_THREE_WORLDS_IP_AND_MAGIC_ROOM_PILOT_v0.1.md",
  "docs/mynest/ip/MYNEST_WORLD_BIBLE_v0.1.md",
  "docs/mynest/ip/OCEAN_LUMISEA_v0.1.md",
  "docs/mynest/ip/FOREST_MOSSWOOD_v0.1.md",
  "docs/mynest/ip/SPACE_NOVANEST_v0.1.md",
  "docs/mynest/pilot/MYNEST_ROOM_GRAVITY_PROTOCOL_v0.1.md",
  "docs/mynest/technical/MYNEST_MAGIC_ROOM_TECH_SPIKE_v0.1.md"
];

await Promise.all(requiredFiles.map(exists));

const [page, worlds, runtime, sync, worker, migration, home, protocol, spike, configText] = await Promise.all([
  read("mynest/magic-room/index.html"),
  read("mynest/magic-room/worlds.js"),
  read("mynest/magic-room/magic-room.js"),
  read("mynest/magic-room/magic-room-sync.js"),
  read("workers/mynest-api/src/index.js"),
  read("migrations/mynest/0004_create_magic_room_events.sql"),
  read("mynest/index.html"),
  read("docs/mynest/pilot/MYNEST_ROOM_GRAVITY_PROTOCOL_v0.1.md"),
  read("docs/mynest/technical/MYNEST_MAGIC_ROOM_TECH_SPIKE_v0.1.md"),
  read("data/mynest/magic-room-config.json")
]);

const config = JSON.parse(configText);
const stateButtons = [...page.matchAll(/data-state-button="([^"]+)"/g)].map((match) => match[1]);
const expectedStates = ["entry", "awaken", "discover", "interact", "story", "wind_down", "sleep", "return"];
assert.deepEqual(stateButtons, expectedStates, "the shared eight-state sequence must remain frozen");
assert.deepEqual(config.world_engine.map((state) => state.toLowerCase()), expectedStates);
assert.deepEqual(config.worlds.map((world) => world.key), ["ocean", "forest", "space"]);

assert.match(page, /noindex,nofollow/);
assert.match(page, /No camera · no recording · no rapid flashing/);
assert.match(page, /pilot consent only—not permission to publish/i);
assert.match(page, /data-observation-form="baseline"/);
assert.match(page, /data-observation-form="first_exposure"/);
assert.match(page, /data-observation-form="day3"/);
assert.match(page, /data-observation-form="day7"/);
assert.match(page, /data-observation-form="day14"/);
assert.match(page, /8–12 second share moment/);

for (const key of ["ocean", "forest", "space"]) {
  assert.match(worlds, new RegExp(`${key}: \\{`));
}
for (const state of expectedStates) assert.match(worlds, new RegExp(`${state}: \\[`));
assert.match(worlds, /availability: "HERO_L0"/);
assert.match(worlds, /availability: "SKELETON_L0"/);

assert.match(runtime, /localStorage/);
assert.doesNotMatch(runtime, /getUserMedia|MediaRecorder|camera|microphone/i);
assert.match(sync, /MYNEST_MAGIC_ROOM_CONSENT_v0\.1/);
assert.match(sync, /const FIELDS =/);
assert.doesNotMatch(sync, /notes|child_name|email|photo|video/);

assert.match(worker, /\/api\/mynest\/magic-room-events/);
assert.match(worker, /validateMagicRoomEvent/);
assert.match(worker, /Explicit Magic Room pilot consent is required/);
assert.match(migration, /CREATE TABLE IF NOT EXISTS mynest_magic_room_events/);
assert.match(migration, /client_event_id TEXT NOT NULL UNIQUE/);

assert.match(home, /My Room\.<br><em>My World\.<\/em>/);
assert.match(home, /href="magic-room\/"/);
assert.match(home, /working names pending IP review/i);

assert.match(protocol, /Room Gravity/);
assert.match(protocol, /not collapsed into an opaque composite score/i);
assert.match(protocol, /PILOT_HOLD/);
assert.match(protocol, /UGC publication consent are separate/i);
assert.match(spike, /STATIC_ROOM_TRANSFORMATION.*PENDING_REAL_ROOM/);
assert.match(spike, /must not report `OCEAN_PILOT_READY = PASS`/);

console.log(`MyNest Magic Room QA passed: ${requiredFiles.length} required artifacts, ${stateButtons.length} engine states, 3 worlds, 5 checkpoints.`);

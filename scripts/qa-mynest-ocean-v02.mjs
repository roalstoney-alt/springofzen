import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const exists = (path) => access(resolve(root, path));

const required = [
  "mynest/magic-room/index.html",
  "mynest/magic-room/magic-room.css",
  "mynest/magic-room/magic-room.js",
  "mynest/magic-room/magic-room-sync.js",
  "mynest/magic-room/worlds.js",
  "mynest/magic-room/assets/ocean-room-base-v02.jpg",
  "mynest/magic-room/assets/ocean-room-base-mobile-v02.jpg",
  "docs/mynest/MYNEST_OCEAN_REAL_ROOM_REDIRECT_v0.2.md",
  "docs/mynest/design/OCEAN_REAL_ROOM_SCENE_SPEC_v0.2.md",
  "docs/mynest/design/MILO_ROOM_INTERACTION_SPEC_v0.1.md",
  "docs/mynest/design/MOON_OCEAN_TRANSITION_SPEC_v0.1.md",
  "docs/mynest/testing/MYNEST_FIRST_10_SECONDS_ACCEPTANCE_v0.1.md"
];

await Promise.all(required.map(exists));
const [page, css, runtime, sync, home, scene, milo, moon, testing] = await Promise.all([
  read("mynest/magic-room/index.html"), read("mynest/magic-room/magic-room.css"),
  read("mynest/magic-room/magic-room.js"), read("mynest/magic-room/magic-room-sync.js"),
  read("mynest/index.html"), read("docs/mynest/design/OCEAN_REAL_ROOM_SCENE_SPEC_v0.2.md"),
  read("docs/mynest/design/MILO_ROOM_INTERACTION_SPEC_v0.1.md"),
  read("docs/mynest/design/MOON_OCEAN_TRANSITION_SPEC_v0.1.md"),
  read("docs/mynest/testing/MYNEST_FIRST_10_SECONDS_ACCEPTANCE_v0.1.md")
]);

for (const asset of ["mynest/magic-room/assets/ocean-room-base-v02.jpg", "mynest/magic-room/assets/ocean-room-base-mobile-v02.jpg"]) {
  const size = (await stat(resolve(root, asset))).size;
  assert.ok(size > 100_000 && size < 600_000, `${asset} must be a production-sized room image`);
}

assert.match(page, /ocean-room-base-v02\.jpg/);
assert.match(page, /ocean-room-base-mobile-v02\.jpg/);
for (const item of ["bed", "lamp", "bookshelf", "window", "curtain", "ceiling", "whale room friend"]) assert.match(page, new RegExp(item, "i"));
for (const zone of ["bed", "lamp", "shelf"]) assert.match(page, new RegExp(`data-room-zone="${zone}"`));
assert.match(page, /data-milo/);
assert.equal((page.match(/<button type="button" data-mode="/g) || []).length, 3, "only Explore, Story, and Rest mode controls may appear");
assert.doesNotMatch(page, /data-state-button|state-console|engine-state/);
assert.doesNotMatch(page, /magic-moment-mark/);
assert.match(page, /The ocean is quiet now\./);
assert.match(page, /noindex,nofollow/);

assert.match(css, /body\.milo-entered \.milo\{clip-path:polygon/);
assert.match(css, /body\.bed-response \.milo/);
assert.match(css, /\.ceiling-ocean\{[^}]*clip-path:polygon/);
assert.match(css, /body\.shelf-response \.fish-a/);
for (const phase of ["wake-ripple", "wake-water", "wake-life", "milo-entered", "ocean-ready"]) assert.match(runtime, new RegExp(phase));
for (const event of ["ROOM_LOADED", "OCEAN_WOKE", "MILO_SEEN", "BED_CLICKED", "LAMP_CLICKED", "SHELF_CLICKED", "MILO_CLICKED", "REST_STARTED", "MAGIC_MOMENT_PLAYED"]) assert.match(runtime, new RegExp(event));
assert.match(runtime, /MYNEST_LOCAL_QA_EVENTS/);
assert.doesNotMatch(runtime, /getUserMedia|MediaRecorder|sendBeacon/);
assert.match(sync, /MYNEST_MAGIC_ROOM_CONSENT_v0\.1/);

assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /ocean-room-base-mobile-v02\.jpg/);
assert.match(css, /body\[data-mode="rest"\]/);
assert.match(css, /body\.magic-moment/);

assert.match(home, />See the Magic Room </);
assert.match(home, />My child won’t sleep alone</);
assert.match(scene, /Geometry masks/);
assert.match(milo, /No camera, microphone, body tracking/);
assert.match(moon, /no flashes or hard cuts/);
assert.match(testing, /Human results must be recorded separately/);

console.log("PASS v0.2: real-room first frame, staged Ocean wake, geometry masks, Milo plus four interactions, Explore/Story/Rest, Magic Moment, responsive assets, and reduced-motion coverage verified.");

import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

const [html, css, js, home, portal, ocean, space] = await Promise.all([
  read("mynest/forest-room/index.html"),
  read("mynest/forest-room/forest-room.css"),
  read("mynest/forest-room/forest-room.js"),
  read("mynest/index.html"),
  read("mynest/portal.css"),
  read("mynest/magic-room/index.html"),
  read("mynest/space-room/index.html")
]);

for (const state of ["day", "night", "rest"]) {
  for (const size of ["desktop", "mobile"]) {
    const relative = `mynest/forest-room/assets/forest-room-${state}-${size}-v01.jpg`;
    await access(path.join(root, relative));
    assert((await stat(path.join(root, relative))).size > 350_000, `${state} ${size} image is production-sized`);
    assert(html.includes(path.basename(relative)), `${state} ${size} image is wired into the route`);
  }
}

for (const mode of ["day", "night", "rest"]) {
  assert(html.includes(`data-mode="${mode}"`), `${mode} mode control exists`);
  assert(js.includes(`${mode}: {`), `${mode} state copy is explicit`);
}
assert((html.match(/data-mode=/g) || []).length === 3, "exactly three Forest mode controls are public");
assert(html.includes("A real bedroom that blooms into a gentle enchanted forest."), "frozen Forest positioning copy is present");
assert(html.indexOf("<h1") > html.indexOf('id="forest-story"'), "explanation begins below the room-first viewport");
for (const phrase of ["Princess Bed", "Meadow Floor", "Mushroom Lights", "Deer Presence", "Natural Tree", "Window Wall"]) {
  assert(html.includes(phrase), `physical anchor is documented: ${phrase}`);
}
assert(js.includes("seedFireflies") && css.includes("firefly-drift"), "ambient fireflies are implemented");
assert(css.includes('data-forest-mode="night"') && css.includes("animation-duration: calc(var(--duration) * 1.8)"), "night fireflies are fewer and slower");
assert(css.includes('data-forest-mode="rest"] .firefly-field') && css.includes("opacity: 0"), "lights-off mode removes active fireflies");
assert(js.includes("createRipple") && js.includes('body.dataset.forestMode === "rest"'), "meadow response is local and disabled at lights-off");
assert(css.includes("transition: opacity 2.8s"), "day-to-night and night-to-rest use a real crossfade");
assert(js.includes("loadPicture") && html.includes("data-a-srcset"), "night and rest imagery load after the first day render");
assert(js.includes("prefers-reduced-motion") && css.includes("prefers-reduced-motion"), "reduced-motion behavior is implemented");
assert(!/fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage/.test(js), "Forest Room adds no backend, tracking, or local persistence");
assert(!/getUserMedia|MediaRecorder|microphone|camera/i.test(js), "Forest Room requests no camera or microphone access");
assert(html.includes("No camera") && html.includes("No rapid light"), "public safety and privacy boundaries are present");

assert(home.includes('href="forest-room/"'), "Forest Room is linked from the MyNest entry page");
assert(portal.includes('url("forest-room/assets/forest-room-day-desktop-v01.jpg")'), "Forest Room has a first-class homepage preview");
assert(ocean.includes('href="/mynest/forest-room/"'), "Ocean links to Forest");
assert(space.includes('href="/mynest/forest-room/"'), "Space links to Forest");
assert(html.includes('href="/mynest/magic-room/"') && html.includes('href="/mynest/space-room/"'), "Forest links back to both existing worlds");
assert(html.includes('name="robots" content="noindex,nofollow"'), "Forest prototype remains excluded from indexing");
assert(!/price|checkout|buy now|add to cart/i.test(html), "Forest Room introduces no commerce claims");

console.log("MYNEST_FOREST_ROOM_QA=PASS");

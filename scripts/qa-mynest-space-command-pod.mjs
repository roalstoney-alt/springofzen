import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "mynest/space-room/index.html");
const cssPath = path.join(root, "mynest/space-room/space-room.css");
const jsPath = path.join(root, "mynest/space-room/space-room.js");
const html = await readFile(pagePath, "utf8");
const css = await readFile(cssPath, "utf8");
const js = await readFile(jsPath, "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); console.log(`PASS ${message}`); };

const states = ["idle", "mission", "return", "sleep"];
const sizes = ["desktop", "mobile"];
for (const state of states) {
  for (const size of sizes) {
    const rel = `mynest/space-room/assets/space-command-pod-${state}-${size}-v01.jpg`;
    const file = path.join(root, rel);
    await access(file);
    assert((await stat(file)).size > 150_000, `${state} ${size} asset exists and is production-sized`);
    assert(html.includes(path.basename(file)), `${state} ${size} asset is wired into the page`);
  }
}

for (const command of ["wake", "explore", "home"]) assert(html.includes(`data-command="${command}"`), `${command} command is present`);
assert((html.match(/data-command=/g) || []).length === 3, "exactly three pod controls are public");
for (const phrase of ["Sleep Command Pod", "Orbit", "Navigation Beacon", "Cabin idle", "Mission active", "Return home", "Sleep", "Leave Home", "Find Blue Planet"]) assert(html.includes(phrase), `required copy is present: ${phrase}`);
assert(html.includes("A quiet room that becomes a spacecraft when your child is ready."), "public framing is present");
assert(html.includes('name="robots" content="noindex,nofollow"'), "prototype is excluded from indexing");
assert(!/price|checkout|buy now|add to cart/i.test(html), "no commerce language is present");
assert(!/fetch\(|\/api\//.test(js), "prototype makes no backend calls");
assert(states.every((state) => js.includes(`${state}: {`)), "all four state descriptions exist in the controller");
assert(css.includes("@media(max-width:680px)"), "mobile-specific composition is supported");
console.log("MYNEST_SPACE_COMMAND_POD_QA=PASS");

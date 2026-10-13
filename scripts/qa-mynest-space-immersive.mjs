import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const html = await readFile(path.join(root, "mynest/space-room/index.html"), "utf8");
const css = await readFile(path.join(root, "mynest/space-room/space-room.css"), "utf8");
const js = await readFile(path.join(root, "mynest/space-room/space-room.js"), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

for (const phase of ["cabin", "wake", "launch", "earth", "warp", "deep-space", "galaxy", "return", "sleep"]) {
  assert(js.includes(`"${phase}"`), `mission phase exists: ${phase}`);
}
assert(html.includes("data-mission-canvas"), "real-time mission canvas is mounted");
assert(js.includes('getContext?.("2d"'), "Canvas 2D renderer initializes defensively");
assert(js.includes("PHASE_TIMINGS") && js.includes("requestAnimationFrame"), "mission autoplays through a timed animation loop");
assert(html.includes("data-srcset") && js.includes("loadMissionAssets"), "heavy foreground assets lazy-load only after Explore");
assert(js.includes("class MissionEngine") && js.includes("missionPhase(elapsed)"), "mission state machine is explicit");
assert(js.includes("button.dataset.command === \"explore\"") && js.includes("engine.start()"), "Explore triggers Mission 001");
assert(js.includes("engine.home()") && js.includes("this.mode = \"return\""), "Home interrupts any active mission into Return");
assert(js.includes("this.returnOrigin = this.phase") && js.includes('returnOrigin === "earth"'), "Return reverses from the interrupted phase without adding a new spectacle");
assert(js.includes("RETURN_DURATION") && js.includes("this.sleep()"), "Return completes with a Sleep handoff");
assert(js.includes("class StaticFallbackEngine") && js.includes("forceFallback"), "static v0.2 fallback remains available");
assert(css.includes("is-static-fallback") && html.includes("space-command-pod-mission-desktop-v02.jpg"), "fallback presentation uses retained v0.2 assets");
assert(js.includes("prefers-reduced-motion") && css.includes("prefers-reduced-motion"), "reduced-motion behavior is implemented");
assert(js.includes("streak > .02 && !reduceMotion") && js.includes("const px = reduceMotion ? 0"), "reduced motion removes streak and parallax acceleration");
assert(html.includes("physical-anchors") && html.includes("space-command-pod-foreground-desktop-v03.png"), "transparent foreground cutout preserves Pod occlusion");
assert(html.includes("space-command-pod-foreground-mobile-v03.png") && css.match(/\.physical-cutout img/g)?.length >= 2, "desktop and mobile foreground compositions are independent");
assert(js.includes("drawEarth") && js.includes("drawGalaxy") && js.includes("drawNebula"), "Earth, Galaxy, and depth layers are rendered independently");
assert(js.includes("drawInteraction") && js.includes("pointermove"), "pointer and touch-capable star interaction is wired");
assert(js.includes("The universe noticed you") && js.includes('body.dataset.missionPhase === "galaxy"'), "Galaxy interaction produces a discoverable local acknowledgement");
assert(js.includes("deviceorientation") && js.includes("this.tilt"), "optional mobile orientation parallax is isolated");
assert(js.includes("class MissionAudio") && html.includes('aria-label="Turn mission sound on"'), "optional audio has an accessible control");
assert(js.includes("drawRoute") && js.includes("emitter()"), "navigation expands from the Pod emitter");
assert(html.includes("pod-holo") && css.includes('data-mission-phase="wake"'), "local Pod hologram remains visible above the occlusion layer");
assert(js.includes("drawFloorReflection") && js.includes("drawSpaceBase"), "multi-surface field includes controlled floor response");
assert(!/fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), "renderer makes no backend or tracking requests");
assert(!/getUserMedia|MediaDevices|camera/i.test(js), "renderer does not request camera access");
assert(!/strobe|flash\(|whiteout|screenShake/i.test(js), "unsafe lighting patterns are absent");
assert(html.includes("No camera") && html.includes("does not watch or record"), "privacy copy remains unchanged");
assert((html.match(/data-command=/g) || []).length === 3, "Wake, Explore, and Home remain the only Pod controls");
assert(html.includes("data-sound-toggle") && html.includes("aria-pressed=\"false\""), "Sound is optional and off by default");
assert(!/three\.js|THREE\.|import\s+.*three/i.test(js + html), "no heavy framework or WebGL dependency was introduced");
console.log("MYNEST_SPACE_IMMERSIVE_QA=PASS");

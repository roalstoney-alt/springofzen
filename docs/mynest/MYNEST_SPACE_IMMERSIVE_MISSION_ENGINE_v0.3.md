# MYNEST_SPACE_IMMERSIVE_MISSION_ENGINE_v0.3

## 0. Project

PROJECT =
MYNEST_SPACE_IMMERSIVE_MISSION_ENGINE_v0.3

PARENT_PROJECT =
MYNEST_SPACE_COMMAND_POD_ROOM_REFINEMENT_v0.2

BASELINE_COMMIT =
d7ac60d02c27c40d7f1ee00d85f7dd2ca9440b39

LIVE_ROUTE =
https://www.springofzen.com/mynest/space-room/

WORLD =
SPACE

CORE_FANTASY =
THIS IS MY SPACECRAFT

HERO_OBJECT =
SLEEP COMMAND POD

COMPANION =
ORBIT

SECONDARY_OBJECT =
NAVIGATION BEACON

PRIMARY_CHANGE =
STATIC STATE PRESENTATION
→
REAL-TIME IMMERSIVE MISSION EXPERIENCE

BACKEND_CHANGE =
PROHIBITED UNLESS STRICTLY REQUIRED

STATUS =
READY_TO_EXECUTE


---

# 1. Frozen Product Doctrine

The Space Room is NOT:

- a space-themed bedroom;
- a star-projector bedroom;
- a solar-system ceiling;
- a room with sci-fi decorations;
- a slideshow of space images.

The Space Room IS:

> A quiet child spacecraft cabin that can temporarily open into a huge interactive universe.

Core state logic:

CABIN_IDLE
↓
POD_WAKE
↓
LAUNCH
↓
EARTH_ORBIT
↓
DEEP_SPACE
↓
GALAXY_SCALE
↓
INTERACTION
↓
RETURN_HOME
↓
SLEEP


---

# 2. Core Experience Rule

Freeze:

IDLE =
MINIMAL

MISSION =
MAXIMUM IMMERSION

RETURN =
CINEMATIC REVERSE JOURNEY

SLEEP =
COMPLETE CALM

Do not compromise between these states.

The contrast is the experience.


---

# 3. Visual Coverage Rules

## CABIN_IDLE

ACTIVE_PROJECTION_COVERAGE =
0–5%

Allowed:

- pod internal light;
- navigation beacon idle glow;
- Orbit dock indicator;
- tiny local holo element after user input.

No:

- permanent stars;
- planets;
- galaxy ceiling;
- space wallpaper.


## MISSION_ACTIVE

TARGET_SPATIAL_COVERAGE =
65–85%

Allowed:

MAIN_WALL =
100% active

CEILING =
70–100% active

SIDE_WALLS =
40–70% active where geometry permits

FLOOR =
10–30% controlled light / navigation / reflection

POD =
must remain visible as physical anchor


## RETURN_HOME

PROJECTION =
85% → 0%

CABIN_VISIBILITY =
0–100%


## SLEEP

ACTIVE_PROJECTION_COVERAGE =
0–2%

Only:

- low cabin lighting;
- low Beacon;
- optional very subtle pod status light.


---

# 4. Mandatory Direction Change

Current v0.2 assets:

space-command-pod-idle-*-v02.jpg
space-command-pod-mission-*-v02.jpg
space-command-pod-return-*-v02.jpg
space-command-pod-sleep-*-v02.jpg

must remain as:

- poster assets;
- fallbacks;
- preload backgrounds;
- reduced-motion fallback.

They must NOT remain the primary Mission implementation.

Primary Mission must become:

REAL ROOM BASE
+
REAL-TIME RENDERED SPACE
+
DEPTH / PARALLAX
+
ROOM MASKS
+
INTERACTION
+
LIGHT RESPONSE
+
AUDIO
+
STATE MACHINE


---

# 5. Technology Selection Logic

Codex must inspect the current front-end first.

IF an existing performant WebGL layer exists
THEN
    reuse it.

ELSE IF Three.js can be introduced without restructuring the site
THEN
    use Three.js.

ELSE IF WebGL complexity would create major regression risk
THEN
    use Canvas 2D + pre-rendered layered assets + masks + parallax.

DO NOT:
- migrate site framework;
- introduce heavy SPA architecture;
- rewrite unrelated MyNest pages.

Preferred:

BASE =
existing static site

REAL-TIME MISSION =
Three.js / WebGL where justified

COMPOSITING =
Canvas/WebGL

AUDIO =
Web Audio API

FALLBACK =
v0.2 static states


---

# 6. Rendering Layers

Implement independent visual layers.

LAYER_0 =
real cabin base

LAYER_1 =
room ambient lighting response

LAYER_2 =
far star field

LAYER_3 =
deep-space nebula / galaxy

LAYER_4 =
large planetary bodies

LAYER_5 =
navigation trajectories

LAYER_6 =
near-field particles / dust / markers

LAYER_7 =
Orbit digital interface

LAYER_8 =
room occlusion masks

LAYER_9 =
Pod local interface

LAYER_10 =
minimal UI

Each layer must support independent:

- opacity;
- scale;
- parallax;
- speed;
- transition timing.


---

# 7. Scene Geometry

Reuse the frozen v0.2 room geometry.

Do not redesign:

- Command Pod;
- Orbit Dock;
- Beacon;
- window;
- walls;
- camera;
- storage.

Create masks:

MASK_POD
MASK_POD_CANOPY
MASK_WINDOW
MASK_WALL_MAIN
MASK_CEILING
MASK_SIDE_LEFT
MASK_SIDE_RIGHT
MASK_FLOOR
MASK_ORBIT_DOCK
MASK_BEACON

Desktop and mobile require independent masks.

Do not scale desktop coordinates directly to mobile.


---

# 8. Mission 001

Freeze only one hero experience:

MISSION_ID =
SPACE_MISSION_001_GALAXY_SCALE

PURPOSE =
WOW + INTERACTION + RETURN RITUAL

TARGET_WEB_DURATION =
25–40 sec

TARGET_PHYSICAL_DURATION =
45–90 sec

Sequence:

CABIN
→
WAKE
→
LAUNCH
→
EARTH
→
WARP
→
GALAXY
→
INTERACT
→
RETURN


---

# 9. Phase 0 — Cabin Idle

Duration:

3–5 sec

Scene:

- quiet cabin;
- clean ceiling;
- clean wall;
- Command Pod visible;
- Orbit docked;
- Beacon warm/neutral;
- no space visuals.

No headline over the experience.

No explanation.

Only minimal controls after delay if needed.


---

# 10. Phase 1 — Pod Wake

Trigger:

EXPLORE

The child must cause the mission.

Sequence:

T+0.0
Pod receives input

T+0.3
Pod control ring illuminates

T+0.6
Orbit eyes / dock status wakes

T+1.0
small local holo sphere appears above / inside Pod console

T+1.5
navigation arcs begin forming

Initial hologram size:

40–60 cm apparent size

The universe starts locally.

It must visibly originate from the Pod.


---

# 11. Pod Holographic Source

Define:

HOLO_EMITTER_ANCHOR

Recommended location:

- head-side console;
or
- inner right rail.

The source should be visually identifiable.

IF Mission looks like projection starts randomly from room
THEN
    strengthen HOLO_EMITTER visual origin.

The child must understand:

> “I opened space from my cockpit.”


---

# 12. Phase 2 — Launch

Duration:

3–6 sec

Sequence:

Pod interface accelerates
↓
window darkens / shade closes
↓
main wall loses normal contrast
↓
navigation lines extend outward
↓
upper wall joins
↓
ceiling joins
↓
stars accelerate
↓
controlled floor reflections appear

Goal:

ROOM_PERCEPTION =
CABIN → SPACECRAFT IN MOTION

Do not instantly swap images.

The transformation itself is part of the magic.


---

# 13. Window Integration

CABIN_IDLE:

WINDOW =
real-world exterior

MISSION_START:

IF smart-shade visual exists
THEN
    visually lower/darken shade.

ELSE
    gradually reduce exterior exposure.

MISSION:

WINDOW =
nearly absent as domestic reference.

RETURN:

real exterior gradually returns.

SLEEP:

shade mostly closed / exterior dim.

The window participates in the state machine.


---

# 14. Phase 3 — Earth Orbit

Do not show many planets.

Show one overwhelming planetary scale.

Visual:

- giant Earth limb;
- only part of planet visible;
- slow orbital motion;
- atmosphere edge;
- deep stars behind.

Rule:

Earth must exceed visible room boundaries.

BAD:

a complete small globe centered on wall.

GOOD:

a massive curved horizon that appears larger than the room.


---

# 15. Earth Scale Acceptance

PASS if observer feels:

> “We are beside Earth.”

FAIL if observer feels:

> “There is an Earth picture on the wall.”

IF Earth feels small
THEN
    crop more aggressively;
    enlarge;
    slow movement;
    reduce unrelated objects.


---

# 16. Room Light Response — Earth

During Earth state:

Pod should receive:

- subtle blue reflection;
- soft atmosphere glow;
- reduced warm cabin tone.

Beacon may shift slightly cooler.

Do not leave physical room illumination unchanged.

Environment must react to the virtual world.


---

# 17. Phase 4 — Warp

Duration:

2–4 sec

Sequence:

navigation locks
↓
Orbit confirmation
↓
stars stretch
↓
near particles accelerate backward
↓
far field deepens
↓
room seams become less perceptible
↓
low-frequency audio swell

No:

- strobe;
- high-frequency flashing;
- aggressive screen shake;
- roller-coaster camera motion.

Goal:

SCALE TRANSITION

not motion sickness.


---

# 18. Phase 5 — Deep Space

After Warp:

Movement slows dramatically.

Contrast:

WARP =
fast

DEEP_SPACE =
slow

This contrast makes space feel huge.

Visual:

- few nearby stars;
- vast dark field;
- distant nebula;
- one navigational route;
- minimal UI.

Hold briefly before Galaxy Reveal.


---

# 19. Phase 6 — Galaxy Scale Reveal

This is the core WOW state.

Reference principle:

The galaxy must feel larger than the room and continue beyond visible surfaces.

Do not render:

“a picture of the Milky Way.”

Render:

“the child has arrived beside a vast galaxy.”

Use:

MAIN_WALL
+
CEILING
+
UPPER SIDE FIELD

as one perceived spatial volume.

Galaxy:

- huge;
- cropped;
- slow;
- partially off-screen;
- layered in depth;
- not centered like a poster.


---

# 20. Galaxy Layering

FAR_LAYER =
deep star background

GALAXY_LAYER =
huge Milky Way / spiral structure

MID_LAYER =
dust and distant objects

NAV_LAYER =
trajectory / scale guide

NEAR_LAYER =
subtle particles reacting to child

Use independent parallax.


---

# 21. Galaxy Scale Communication

Allow one restrained fact.

Example:

MILKY WAY
~100,000 LIGHT-YEARS

or a scale bar.

Rule:

MAX_EDUCATIONAL_ELEMENTS =
1 label
+
1 scale value

No paragraphs.

Experience first.

Knowledge second.


---

# 22. Scale Shock Rule

WOW depends on scale contrast.

Use:

SMALL =
navigation node

MEDIUM =
small moon / satellite / destination marker

HUGE =
Earth
galaxy
nebula

Do not make everything similarly sized.

IF Galaxy fails to feel immense
THEN
    enlarge/crop galaxy;
    reduce competing celestial objects;
    slow galaxy movement;
    increase layer separation.


---

# 23. Child Interaction

Website:

DESKTOP =
pointer movement + click/touch zones

MOBILE =
touch + optional device orientation

Physical prototype later:

depth / spatial sensing

Interaction principle:

The universe notices the child.

The child does NOT control the universe like a game object.


---

# 24. Galaxy Interaction

At Galaxy state:

pointer / hand approaches near field
↓
local stars bend slightly
↓
dust reacts
↓
trajectory shifts
↓
one navigation marker wakes

The Galaxy itself:

- does not follow pointer;
- does not rotate on drag;
- does not behave like a 3D model viewer.

Goal:

RESPONSE
not CONTROL.


---

# 25. Mobile Parallax Logic

IF device orientation permission is available
AND reduced-motion is false
THEN
    allow very small depth shift.

ELSE
    use touch-drag / pointer parallax.

Maximum movement must remain subtle.

Do not make the room feel like VR nausea simulation.


---

# 26. Orbit Mission Role

Orbit must participate.

CABIN_IDLE:

physical Orbit docked

WAKE:

eyes / status activate

MISSION:

Digital Orbit appears as small navigation assistant.

GALAXY:

Orbit may indicate scale marker / destination.

RETURN:

Digital Orbit guides home route.

SLEEP:

Orbit returns to dock / powers down.

Do not make Orbit a cartoon host.

Do not add speech unless needed later.


---

# 27. Audio Architecture

Use sound intentionally.

CABIN_IDLE =
near silence + subtle system hum

WAKE =
one soft confirmation tone

LAUNCH =
low spatial rise

EARTH =
quiet deep ambient

WARP =
brief controlled low-frequency swell

DEEP_SPACE =
wide quiet field

GALAXY =
very slow low ambient tone

INTERACTION =
small local response

RETURN =
sound narrows toward Pod

SLEEP =
near silence

No:

- heroic movie score;
- battle sound;
- alarm;
- loud spaceship effects.


---

# 28. Spatial Audio Optionality

For web:

use stereo / simple positional audio only.

Do not over-engineer.

For physical prototype later:

document possibility of:

- 2.1;
- 4 speaker spatial setup;
- directional cues.

No purchase yet.


---

# 29. Floor Use

Mission mode may use floor.

Allowed:

- trajectory line;
- moving reflection;
- soft star-light;
- subtle navigation grid.

Forbidden:

- full galaxy texture;
- fast moving floor;
- busy projection;
- bright high-contrast animation.

Floor supports depth.

Floor is not another screen.


---

# 30. Pod Occlusion

Mandatory.

Stars / galaxy must not visibly paint over Pod as a flat overlay.

Use:

MASK_POD

so Pod remains physical foreground.

This creates:

SPACE BEHIND POD

instead of:

VIDEO OVER POD


---

# 31. Physical Anchor Rule

Even at maximum immersion, retain at least:

- Pod silhouette;
- Orbit dock;
- Beacon;
- small amount of architecture.

Goal:

child feels:

> “My spacecraft is inside space.”

not:

> “The whole website became a galaxy video.”


---

# 32. Mission Visual Hierarchy

During Galaxy state:

PRIMARY =
Galaxy / scale

SECONDARY =
Pod

TERTIARY =
navigation

QUATERNARY =
Orbit

Avoid:

- many planets;
- many icons;
- decorative particles everywhere;
- multiple simultaneous events.


---

# 33. High Spectacle vs Visual Chaos

Freeze:

MISSION_ACTIVE =
HIGH SPECTACLE
+
CLEAR HIERARCHY
+
LOW CLUTTER

High spectacle is permitted.

Visual chaos is not.

IF scene feels weak
THEN
    increase scale / coverage / depth.

DO NOT automatically add more objects.

IF scene feels chaotic
THEN
    remove objects.

DO NOT reduce spatial scale first.


---

# 34. Phase 7 — Return Home

Return must be as cinematic as Launch.

Do not fade to Idle.

Sequence:

Galaxy begins shrinking / receding
↓
near particles accelerate backward
↓
deep-space field contracts
↓
Earth reappears
↓
Earth recedes
↓
navigation route narrows
↓
projection collapses toward Pod emitter
↓
wall architecture returns
↓
ceiling returns
↓
window returns
↓
warm cabin light returns
↓
Orbit docks

Target:

5–10 sec web
8–15 sec physical


---

# 35. Return Meaning

The child should understand:

> Mission complete. We came home.

Not:

> Video stopped.


---

# 36. Phase 8 — Sleep

After Return:

Pod lighting:
warm low

Beacon:
low amber

Orbit:
off / docked

Window:
dark / shade closed

Projection:
0–2%

Audio:
near silence

No:

- stars;
- galaxy;
- moving particles;
- cyan mission light.

Space world must know how to disappear.


---

# 37. Sleep Transition Rule

The stimulation curve must always decrease after HOME.

Mission intensity:

100%

Return midpoint:

50%

Cabin:

15%

Sleep:

2%

Do not launch another WOW effect after Return begins.


---

# 38. Daytime Demo vs Bedtime Use

Freeze two profiles.

DEMO_PROFILE:

allows full Mission 001.

BEDTIME_PROFILE:

may allow:
short mission
→
return
→
sleep

But once Rest/Home begins:

FULL_MISSION_RESTART =
DISABLED until explicitly reset.


---

# 39. First Viewport

Keep the v0.2 improvement:

100vh =
ROOM FIRST

Initial:

CABIN_IDLE

No large copy.

No product explanation.

No “Space Room Prototype” dominating viewport.

Controls:

WAKE / EXPLORE / HOME

must remain visually secondary to Pod.


---

# 40. Explore Trigger

Preferred:

child taps a Pod control area.

Website fallback:

EXPLORE control mapped visually to Pod console.

Do not put a giant floating CTA in center of room.


---

# 41. Automatic First Mission

After EXPLORE:

Do not require additional clicks for each stage.

Run:

WAKE
2 sec

LAUNCH
4 sec

EARTH
4–6 sec

WARP
2–3 sec

GALAXY
8–12 sec

Then:

INTERACTION_ENABLED = YES

Child can remain and interact.

HOME remains available.


---

# 42. Reduced Motion

IF prefers-reduced-motion = true
THEN:

- no warp streak acceleration;
- no parallax;
- use slow crossfades;
- keep scale transitions;
- keep Earth and Galaxy;
- keep Return;
- preserve story semantics.

Reduced motion must still be impressive.

Do not degrade it to static text.


---

# 43. Mobile Implementation

Mobile cannot be a cropped desktop Mission.

Create dedicated composition rules.

Keep visible:

- Pod;
- one large environment element;
- enough projection field;
- minimal UI.

At Galaxy state:

prefer:

UPPER =
Galaxy

MIDDLE =
Pod silhouette

LOWER =
controls / minimal floor

Avoid losing Pod entirely behind Galaxy.


---

# 44. Desktop Implementation

Desktop may use broader field.

Use:

main wall
+
ceiling
+
controlled side wall

for strongest immersion.

Pod remains bottom/foreground anchor.


---

# 45. Web Performance

Goal:

Idle must load quickly.

Loading order:

1. Idle room base
2. Pod masks
3. basic controls
4. star field
5. Earth asset
6. Galaxy layers
7. audio

Mission assets may lazy-load after Idle appears.

IF Mission assets are not ready
THEN
    show subtle Pod “readying” state
    do not display broken media.


---

# 46. Static Fallback

IF:

- WebGL unavailable;
- GPU failure;
- reduced capability;
- render initialization error;

THEN:

use v0.2 static state images.

Fallback flow:

Idle image
→
Mission image
→
Return image
→
Sleep image

Do not show error panels to child.


---

# 47. Technical Failure Isolation

IF one optional feature fails:

device orientation
audio
particle interaction

THEN
    continue Mission without it.

Only Mission-render fatal error may trigger full static fallback.


---

# 48. Physical Technology Spike

Create:

docs/mynest/space/
SPACE_ROOM_IMMERSIVE_TECH_STACK_v0.1.md

Compare:

### Option A — 1 projector

coverage
shadowing
cost
brightness
complexity

### Option B — 2 projectors

coverage
edge blend
shadow reduction
cost

### Option C — 3 projectors

wall + ceiling + side field

### Option D — 4 projectors

high-coverage immersive field

Do not select vendor yet.


---

# 49. Physical Technology Classes

Evaluate:

- ultra-short-throw projection;
- projection mapping;
- multi-projector edge blending;
- TouchDesigner;
- Unity;
- WebGL prototype;
- depth camera;
- ToF;
- LiDAR;
- laser interaction sensing;
- local hand/body detection;
- spatial audio.

Evaluation only.

No purchase.


---

# 50. Spatial Interaction Physical Target

Future physical zones:

ZONE_A =
Pod controls

ZONE_B =
standing / interaction area

ZONE_C =
front holo field

ZONE_D =
bed/sleep area

Logic:

IF child enters ZONE_B
THEN
    local navigation acknowledges presence.

IF hand enters ZONE_C
THEN
    nearby stars respond.

IF child returns to Pod
THEN
    cockpit controls become primary.

IF child lies in Pod during HOME
THEN
    allow automatic Sleep handoff.


---

# 51. Privacy Boundary

Current web:

NO_CAMERA =
TRUE

Future physical:

IF no optical/depth sensing
THEN
    retain “No camera.”

ELSE IF depth / RGB sensor is required
THEN
    public wording must become:

“No recording.
Spatial interaction is processed locally.”

Required:

RAW_FRAME_STORAGE =
NO

RAW_FRAME_UPLOAD =
NO

FACE_IDENTIFICATION =
NO

IDENTITY_RECOGNITION =
NO

CLOUD_VIDEO =
NO


---

# 52. Terminology Guard

Do not claim:

“True 5D hologram”

unless technically defined and proven.

Public wording may use:

- immersive space;
- responsive universe;
- interactive mission;
- spatial projection;
- holographic-style mission interface.

Internal shorthand:

5D-style immersive experience

is acceptable.


---

# 53. Consumer Copy

Replace conservative concept:

“The star map grows from the pod—not from every wall.”

with:

> “The mission begins in the pod. Then the room opens into space.”

Keep:

> “No permanent galaxy.”

Possible supporting copy:

> “When the mission ends, the room comes home too.”


---

# 54. No Product Expansion

Do not add new physical objects.

Remain:

1. Sleep Command Pod
2. Orbit Companion
3. Navigation Beacon

Do not add:

- planet lamp;
- rocket toy;
- astronaut plush;
- space rug SKU;
- telescope SKU;
- constellation projector SKU.


---

# 55. No Mission Expansion

Do not build:

Mars Mission
Saturn Mission
Black Hole Mission
Moon Mission
Alien Mission

until Mission 001 passes WOW test.

One unforgettable experience beats five weak modes.


---

# 56. WOW Test

Primary test:

Show Mission to a child without explaining.

Observe:

- immediately watches;
- approaches screen / Pod;
- activates Explore;
- reacts when room opens;
- interacts with Galaxy;
- asks to repeat;
- wants to get into Pod;
- understands Home / Return.

Primary question:

> Would the child want to launch again?


---

# 57. Visual WOW Gate

PASS requires all:

POD_DESIRE =
YES

ROOM_TRANSFORMATION =
OBVIOUS

EARTH_SCALE =
LARGE

GALAXY_SCALE =
IMMENSE

DEPTH =
VISIBLE

INTERACTION =
DISCOVERABLE

RETURN =
UNDERSTANDABLE

SLEEP =
CALM


---

# 58. Failure Diagnosis Logic

IF Mission feels like wallpaper
THEN:
    increase depth layers;
    add parallax;
    improve occlusion;
    improve room light response.

DO NOT:
    add more planets.


IF Mission feels too small
THEN:
    enlarge/crop large celestial objects;
    let content extend beyond room edges.


IF Mission feels too conservative
THEN:
    increase projection coverage;
    darken cabin architecture more during Mission;
    strengthen scale transition.


IF Mission feels chaotic
THEN:
    reduce object count;
    retain coverage and scale.


IF Pod disappears visually
THEN:
    strengthen silhouette;
    preserve local Pod lights;
    improve occlusion.


IF interaction feels like a game UI
THEN:
    reduce direct manipulation;
    make response indirect and environmental.


IF Return feels weak
THEN:
    create reverse-space journey;
    do not use simple fade.


IF Sleep feels exciting
THEN:
    remove cyan;
    remove movement;
    remove active stars.


---

# 59. Implementation Order

SPRINT_01 =
inspect existing Space implementation

SPRINT_02 =
freeze masks + geometry

SPRINT_03 =
implement real-time layered renderer

SPRINT_04 =
implement Pod Wake

SPRINT_05 =
implement Launch

SPRINT_06 =
implement Earth Orbit

SPRINT_07 =
implement Warp

SPRINT_08 =
implement Galaxy Scale

SPRINT_09 =
implement interaction

SPRINT_10 =
implement Orbit mission role

SPRINT_11 =
implement responsive room light

SPRINT_12 =
implement cinematic Return

SPRINT_13 =
implement Sleep handoff

SPRINT_14 =
mobile tuning

SPRINT_15 =
reduced-motion fallback

SPRINT_16 =
static fallback

SPRINT_17 =
physical tech evaluation doc

SPRINT_18 =
production QA


---

# 60. Conditional Execution Rule

For every stage:

IF current implementation already meets target
THEN:
    retain;
    do not rewrite.

ELSE IF authorized front-end fix is sufficient
THEN:
    implement;
    test;
    continue.

ELSE IF backend change appears necessary
THEN:
    STOP that branch;
    mark BACKEND_AUTH_REQUIRED.

ELSE IF privacy scope changes
THEN:
    STOP that branch;
    mark PRIVACY_REVIEW_REQUIRED.

Do not stop unrelated work.


---

# 61. Do Not Touch

Do not modify:

- Ocean Room behavior;
- MyNest Method;
- Results;
- Evidence Registry;
- pilot backend;
- D1 schema;
- Search architecture;
- Question pages;
- current privacy model.

Space v0.3 is isolated front-end / experience work.


---

# 62. Existing Regression Requirements

Must retain:

OCEAN_REGRESSION =
PASS

BACKEND =
22/22 PASS

SEARCH_QA =
PASS

PRIVACY_QA =
PASS

MOBILE =
PASS

DESKTOP =
PASS

CONSOLE_ERRORS =
0


---

# 63. Required New QA States

Capture:

DESKTOP_CABIN
DESKTOP_WAKE
DESKTOP_LAUNCH
DESKTOP_EARTH
DESKTOP_WARP
DESKTOP_GALAXY
DESKTOP_INTERACTION
DESKTOP_RETURN
DESKTOP_SLEEP

MOBILE_CABIN
MOBILE_LAUNCH
MOBILE_EARTH
MOBILE_GALAXY
MOBILE_RETURN
MOBILE_SLEEP


---

# 64. Automated Contract Tests

Add checks for:

MISSION_STATE_MACHINE =
PASS

EXPLORE_TRIGGER =
PASS

LAUNCH_AUTOPLAY =
PASS

HOME_INTERRUPT =
PASS

RETURN_COMPLETES =
PASS

SLEEP_REACHED =
PASS

STATIC_FALLBACK =
PASS

REDUCED_MOTION =
PASS

NO_BACKEND_REQUEST_FOR_RENDER =
PASS


---

# 65. Interaction Tests

Desktop:

- pointer causes near-star response;
- Pod remains visible;
- HOME works during Galaxy;
- Return cannot get stuck.

Mobile:

- touch interaction works;
- optional tilt does not block flow;
- HOME remains reachable;
- orientation permission failure does not break Mission.


---

# 66. Performance Gate

PASS only if:

Idle room appears before heavy Mission assets.

No blank viewport.

No long spinner.

No blocking page load caused by Galaxy assets.

Mission may preload progressively.


---

# 67. Accessibility

Ensure:

EXPLORE
HOME
SOUND

have accessible labels.

Keyboard:

Enter / Space can trigger controls.

Reduced motion:

functional.

Audio:

optional.

No Mission depends exclusively on hearing.


---

# 68. Safety Visual Gate

Prohibit:

- rapid strobe;
- high-frequency flashing;
- extreme camera shake;
- intense flickering stars;
- sudden white-out;
- hard zoom into child.

Mission can be dramatic without unsafe lighting behavior.


---

# 69. Final Product Doctrine

> Idle should feel like a spacecraft.

> Launch should feel like the room is disappearing.

> Earth should feel larger than the room.

> The Galaxy should feel larger than imagination.

> Interaction should make the universe notice the child.

> Home should feel like a journey, not a button.

> Sleep should return the child to a quiet real room.

> The best Space Room is not one covered in space decorations.

> It is a room that can temporarily stop feeling like a room.


---

# 70. Acceptance Matrix

STATIC_MISSION_REPLACED =
PASS/FAIL

REALTIME_RENDERER =
PASS/FAIL

POD_WAKE =
PASS/FAIL

LAUNCH_TRANSFORMATION =
PASS/FAIL

WINDOW_INTEGRATION =
PASS/FAIL

MULTI_SURFACE_IMMERSION =
PASS/FAIL

EARTH_ORBIT =
PASS/FAIL

EARTH_SCALE =
PASS/FAIL

WARP =
PASS/FAIL

DEEP_SPACE_DEPTH =
PASS/FAIL

GALAXY_SCALE =
PASS/FAIL

GALAXY_SCALE_SHOCK =
PASS/FAIL

INTERACTIVE_STAR_FIELD =
PASS/FAIL

ORBIT_MISSION_ROLE =
PASS/FAIL

ROOM_OCCLUSION =
PASS/FAIL

ROOM_LIGHTING_RESPONSE =
PASS/FAIL

POD_PHYSICAL_ANCHOR =
PASS/FAIL

RETURN_HOME =
PASS/FAIL

SLEEP_HANDOFF =
PASS/FAIL

MOBILE_WOW =
PASS/FAIL

DESKTOP_WOW =
PASS/FAIL

REDUCED_MOTION =
PASS/FAIL

STATIC_FALLBACK =
PASS/FAIL

PHYSICAL_TECH_SPEC =
PASS/FAIL

OCEAN_REGRESSION =
PASS/FAIL

BACKEND_CHANGED =
NO


---

# 71. Deployment Gate

Deploy only if:

STATIC_MISSION_REPLACED = PASS
AND
LAUNCH_TRANSFORMATION = PASS
AND
EARTH_SCALE = PASS
AND
GALAXY_SCALE = PASS
AND
RETURN_HOME = PASS
AND
SLEEP_HANDOFF = PASS
AND
MOBILE = PASS
AND
DESKTOP = PASS
AND
OCEAN_REGRESSION = PASS
AND
PRIVACY_REGRESSION = PASS

Otherwise:

DEPLOYMENT =
HOLD


---

# 72. Final Codex Output

PROJECT =
MYNEST_SPACE_IMMERSIVE_MISSION_ENGINE_v0.3

BASELINE_SHA =
d7ac60d02c27c40d7f1ee00d85f7dd2ca9440b39

LIVE_ROUTE =
https://www.springofzen.com/mynest/space-room/

RENDER_STACK =
<actual stack>

STATIC_TO_REALTIME =
PASS/FAIL

CABIN_IDLE =
PASS/FAIL

POD_WAKE =
PASS/FAIL

LAUNCH =
PASS/FAIL

EARTH_ORBIT =
PASS/FAIL

EARTH_SCALE =
PASS/FAIL

WARP =
PASS/FAIL

DEEP_SPACE =
PASS/FAIL

GALAXY_SCALE =
PASS/FAIL

GALAXY_INTERACTION =
PASS/FAIL

MULTI_SURFACE_FIELD =
PASS/FAIL

ROOM_OCCLUSION =
PASS/FAIL

ROOM_LIGHTING_RESPONSE =
PASS/FAIL

ORBIT_MISSION_ROLE =
PASS/FAIL

RETURN_HOME =
PASS/FAIL

SLEEP_HANDOFF =
PASS/FAIL

STATIC_FALLBACK =
PASS/FAIL

REDUCED_MOTION =
PASS/FAIL

DESKTOP =
PASS/FAIL

MOBILE =
PASS/FAIL

PHYSICAL_TECH_SPEC =
PASS/FAIL

PRIVACY_COPY =
UNCHANGED/UPDATED

BACKEND_CHANGED =
NO/YES

OCEAN_REGRESSION =
PASS/FAIL

BACKEND_REGRESSION =
PASS/FAIL

CONSOLE_ERRORS =
<number>

TESTS =
<compact summary>

CHANGED_FILES =
<compact list>

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL/HOLD

READY_FOR_CHILD_WOW_TEST =
YES/NO

READY_FOR_PHYSICAL_TECH_SPIKE =
YES/NO

BLOCKERS =
<exact blockers>

NEXT_GATE =
<one highest-value next action>


---

# 73. Stop Rule

IF v0.3 still looks like:
“a nice space animation inside a bedroom”
THEN:
    DO NOT add another mission.

Fix:
    scale
    depth
    coverage
    interaction
    occlusion
    lighting

until the experience becomes:

> “The spacecraft launched, and the room disappeared.”
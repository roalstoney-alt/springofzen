# MYNEST_SPACE_COMMAND_POD_ROOM_v0.1

## 0. Project

```text
PROJECT =
MYNEST_SPACE_COMMAND_POD_ROOM_v0.1

PARENT_PROJECT =
MYNEST_THREE_WORLDS_IP_AND_MAGIC_ROOM_PILOT_v0.1

WORLD =
SPACE

TARGET =
New Space prototype direction for MyNest

GOAL =
Redesign Space Room from a decorated “space-themed bedroom”
into a believable child spacecraft cabin centered on one Sleep Command Pod.

BACKEND_CHANGED =
NO unless explicitly required later

PRIMARY_OUTPUT =
visual direction + scene logic + room-state logic + object system
```

---

# 1. Frozen Core Concept

```text
SPACE ROOM =
QUIET FUTURE CABIN
+
SLEEP COMMAND POD
+
MINIMAL WALLS
+
HOLOGRAPHIC UNIVERSE ACTIVATED FROM THE POD
```

This is NOT:

```text
space-themed bedroom
astronomy wallpaper room
planet-decor bedroom
starry ceiling bedroom
```

This IS:

> **A child’s own spacecraft cabin.**  
> The room is calm by default.  
> Space appears only when the child activates the pod.

---

# 2. Design Doctrine

```text
DEFAULT ROOM =
real / quiet / minimal / futuristic

MAGIC =
state-based holographic activation

HERO OBJECT =
Sleep Command Pod

COMPANION =
Orbit

SECONDARY LIGHT OBJECT =
Navigation Beacon
```

Important rule:

```text
The universe is not the decoration.
The universe is the activated state.
```

---

# 3. Immediate Direction Change

Codex must correct the previous direction as follows:

## Remove:

```text
permanent ceiling galaxy
painted solar system ceiling
cute wall planets
space wallpaper
decorative astronauts everywhere
excess themed ornaments
moon-lamp-as-main-theme
static “outer space room” look
```

## Keep / strengthen:

```text
one strong command pod
quiet future-cabin walls
minimal integrated lighting
clean ceiling
holographic activation from pod controls
```

---

# 4. Core Product Formula

```text
COMMAND POD
+
ORBIT COMPANION
+
NAVIGATION BEACON
+
HOLOGRAPHIC MISSION STATES
=
MYNEST SPACE ROOM
```

No additional hero objects in v0.1.

---

# 5. Frozen Physical Object Limit

Visible branded / story objects should be limited to:

```text
1. Sleep Command Pod
2. Orbit Companion
3. Navigation Beacon
```

Everything else should feel architectural, not merchandise.

---

# 6. Sleep Command Pod

## Definition

The bed must become:

```text
BED
+
COCKPIT
+
MISSION CONTROL
+
HOLOGRAM SOURCE
+
RETURN-TO-SLEEP STATION
```

## Design rule

It should visually suggest:

```text
sci-fi sleep capsule
```

but functionally remain:

```text
open, child-safe, easy-access bed
```

---

# 7. Pod Safety / Usability Constraint

The pod must NOT be designed as:

```text
sealed cryo chamber
fully enclosed tube
lockable capsule
medical sleep box
hard sci-fi coffin
```

Instead use:

```text
open side access
partial canopy
soft structural frame
no full enclosure
no lock
no sealed transparent lid
```

This must remain a believable child room product direction.

---

# 8. Pod Visual Identity

The pod should feel:

```text
premium
cinematic
futuristic
minimal
operable by a child
```

Material direction:

```text
matte off-white / warm grey shell
soft integrated lighting
subtle cyan/white control glow
rounded edges
built-in side console zones
```

Avoid:

```text
toy spaceship bed
cartoon rocket bed
busy gamer cockpit
military sci-fi overload
```

---

# 9. Pod Control System

Freeze exactly 3 primary interaction controls.

## Control 01 — WAKE

Meaning:

```text
wake the cabin
```

Effect:

```text
pod idle light wakes
room enters ready state
```

---

## Control 02 — EXPLORE

Meaning:

```text
launch / begin mission
```

Effect:

```text
small holographic map appears
↓
expands beyond pod
↓
room becomes mission space
```

---

## Control 03 — HOME

Meaning:

```text
end mission / return home / prepare sleep
```

Effect:

```text
holographic universe contracts
↓
navigation closes
↓
room returns to cabin
↓
sleep mode begins
```

No text-heavy UI in the room itself.

---

# 10. UI Language Rule

First prototype may label logic internally, but public child-facing interaction should be reduced to simple icon logic.

Preferred symbolic direction:

```text
WAKE = ◉
EXPLORE = ✦
HOME = ⌂
```

Do not build menus such as:

```text
Galaxy Mode
Mars Mode
Solar System
Settings
Profile
```

Not needed in v0.1.

---

# 11. Room Logic vs Ocean Logic

Freeze world distinction:

## Ocean

```text
creatures already live in the room
child discovers them
```

## Space

```text
room is a quiet spacecraft cabin
child activates the system
universe appears
```

This distinction must remain visible in both art and interaction design.

---

# 12. Default Room State

Space Room default state should be:

```text
CABIN_IDLE
```

Visual rules:

```text
clean ceiling
clean walls
soft integrated cabin lighting
command pod visible
orbit docked / resting
navigation beacon idle
no star field
no large projection
no planets on surfaces
```

The room should still look beautiful with zero active effects.

---

# 13. Ceiling Rule

The ceiling must be plain and architectural by default.

```text
CEILING =
clean
matte
light neutral
no permanent cosmos art
```

Allow only in activated states:

```text
controlled holographic projection field
```

Do NOT decorate the ceiling as a fixed solar-system mural.

---

# 14. Wall Rule

Walls should become:

```text
smooth integrated panels
subtle seam language
built-in cabinetry if needed
minimal visual clutter
usable projection surface
```

Do NOT add:

```text
rocket wall decals
planet art
astronaut posters
constellation stickers
space-themed shelf clutter
```

---

# 15. Color Doctrine

## CABIN_IDLE

```text
warm off-white
soft grey
pale oak if needed
minimal cyan
```

## MISSION_ACTIVE

```text
cool white
cyan navigation glow
deep-space contrast
controlled holographic brightness
```

## RETURN_HOME

```text
mission field reducing
cool tones collapsing
warmer cabin tones returning
```

## SLEEP

```text
low amber / warm low light
very soft beacon
minimal cabin illumination
no strong cyan
```

---

# 16. Orbit Companion

Freeze companion concept:

```text
NAME = Orbit
ROLE = onboard AI companion
```

Orbit must NOT be:

```text
astronaut plush
humanoid toy robot
battle robot
transformer
```

Orbit should be:

```text
small
rounded
friendly
future-assistant-like
white / soft grey
dark face panel
2 subtle light eyes
```

Target scale:

```text
20–30 cm
```

---

# 17. Orbit Logic

Orbit should exist in two modes:

```text
PHYSICAL ORBIT
DIGITAL ORBIT
```

Room narrative:

```text
child enters pod
↓
Orbit wakes
↓
Orbit assists mission
↓
Orbit returns to dock / sleep
```

This mirrors Milo’s physical/digital unity but with a distinct role.

---

# 18. Navigation Beacon

The third object is:

```text
Navigation Beacon
```

It must NOT be:

```text
decorative moon lamp
novelty planet lamp
cute space prop
```

It should be:

```text
small
orb-like
matte translucent
elegant
neutral enough to live in a real room
```

Behavior:

```text
IDLE = warm low night light
MISSION = cooler navigation glow
SLEEP = low amber / near-off
```

---

# 19. Decorative Density Rule

This room must be visually more restrained than Ocean.

```text
DECORATION_DENSITY = VERY LOW
```

If a prop does not support:

```text
pod
orbit
beacon
hologram field
sleep ritual
```

remove it.

---

# 20. Holographic Field

Space magic should appear as:

```text
HOLOGRAPHIC FIELD
```

not wallpaper.

Primary activity zone:

```text
pod front
main wall
ceiling center
```

Side walls should remain mostly cabin.

This prevents the room becoming an immersive exhibit.

---

# 21. Hologram Composition Layers

Mission visuals should be built from layers:

```text
LAYER 1 = deep star field
LAYER 2 = navigation arcs / lines
LAYER 3 = large-scale celestial object (galaxy / planet / orbit)
LAYER 4 = minimal interface markers
```

Do NOT use:

```text
one giant static galaxy image
```

The field should feel like an activated system.

---

# 22. State Machine

Freeze 4 main public-facing states:

```text
1. CABIN_IDLE
2. MISSION_ACTIVE
3. RETURN_HOME
4. SLEEP
```

Codex must design Space Room around these states.

---

# 23. CABIN_IDLE

Definition:

```text
quiet room
pod at rest
Orbit docked
navigation beacon idle
no holographic universe
```

Visual feeling:

> a beautiful child spacecraft cabin before launch

---

# 24. MISSION_ACTIVE

Definition:

```text
pod activated
holographic star map opens
universe expands into room field
Orbit assists
child feels “I am in my spacecraft”
```

Mission state should be wow-inducing, but still controlled.

---

# 25. RETURN_HOME

Definition:

```text
mission concludes
navigation narrows
cosmic field contracts
room returns from deep space to cabin
```

This state is essential.

Do NOT instantly shut the projection off.

---

# 26. SLEEP

Definition:

```text
mission complete
home state restored
low warm room light
pod enters sleep mode
Orbit quiet
Beacon low
```

This is the bedtime state.

---

# 27. Signature Bedtime Ritual

Freeze the Space ritual as:

# MISSION_RETURN_HOME

Sequence:

```text
deep space
↓
navigation home
↓
home orbit
↓
cabin restored
↓
sleep mode
```

This is the Space counterpart to Ocean’s Milo Return Home.

---

# 28. First Mission Scope

Do NOT build many missions.

Freeze only 3 mission concepts:

## Mission 01 — Leave Home

```text
cabin
→ launch
→ orbit
```

Purpose:

```text
WOW
```

---

## Mission 02 — Find the Blue Planet

```text
navigate
→ discover one target world
```

Purpose:

```text
guided exploration
```

---

## Mission 03 — Return Home

```text
deep space
→ home navigation
→ cabin
→ sleep
```

Purpose:

```text
bedtime closure
```

No additional mission library in v0.1.

---

# 29. Scene Focus Rule

Do not distribute attention across the whole room.

The visual center must remain:

```text
POD FIRST
```

Secondary:

```text
Orbit
Beacon
```

Holographic field expands from the pod, not from nowhere.

---

# 30. Floor / Room Layout

The room should remain simple.

Keep enough floor area for:

```text
entry
approach to pod
child movement
```

Do not crowd room with themed furniture.

---

# 31. Furniture Rule

Only the pod may behave like “sci-fi furniture”.

Do NOT create a full set of:

```text
space desk
space chair
space cabinet
space shelf
space wardrobe
```

Other storage should visually dissolve into the room.

---

# 32. New Visual Asset Requirement

Do NOT continue editing the current starry/static space design.

Generate a new direction from scratch.

Required hero scenes:

```text
A. CABIN_IDLE
B. MISSION_ACTIVE
C. RETURN_HOME
D. SLEEP
```

These should be a coherent set.

---

# 33. Hero Scene A — CABIN_IDLE Brief

Generate a premium photorealistic child spacecraft cabin.

Requirements:

```text
real child room transformed into a quiet future cabin
clean matte ceiling
minimal walls
integrated soft lighting
one large open sleep command pod as the dominant focal point
pod has a partial canopy and child-operable side control zones
small Orbit companion docked nearby
small elegant navigation beacon light
very low decoration density
no permanent galaxy on walls or ceiling
no planets painted on surfaces
no astronaut posters
no toy clutter
no text
no logos
```

Feeling:

```text
calm
premium
believable
cinematic
```

---

# 34. Hero Scene B — MISSION_ACTIVE Brief

Use the same room and geometry.

Requirements:

```text
same exact room
same exact pod
pod activated
a holographic star map opens from the pod
space field expands to front wall and center ceiling
deep star field + navigation arcs + one major celestial body
side walls mostly remain cabin
Orbit active
beacon glows cooler
high wow factor
not cluttered
not fully immersive on all surfaces
```

The room should feel activated, not redecorated.

---

# 35. Hero Scene C — RETURN_HOME Brief

Same room and geometry.

Requirements:

```text
mission field collapsing
holograms contracting back toward pod
deep-space imagery reducing
navigation guidance aiming toward home
cool mission glow fading
warmer cabin tone returning
Orbit transitioning to rest
```

This must visually communicate:

> Mission is ending.

---

# 36. Hero Scene D — SLEEP Brief

Same room and geometry.

Requirements:

```text
room restored to quiet spacecraft cabin
low warm sleep lighting
beacon low amber
Orbit quiet/docked
pod in sleep mode
no active galaxy field
very calm
safe
bedtime-ready
```

This must feel sleep-appropriate.

---

# 37. Mobile and Desktop

Generate each state for:

```text
desktop landscape
mobile portrait
```

Rule:

```text
Do NOT crop desktop into mobile.
Compose mobile intentionally.
```

---

# 38. Website Surface Rule

If Space room is added to site, above-the-fold should follow the same doctrine as Ocean:

```text
show the room first
explain later
```

Do NOT begin with:

```text
long feature explanation
technical storytelling
theme explanation
```

The room / pod must sell the idea visually.

---

# 39. Consumer Explanation

When explained below fold, the public framing should be:

```text
A quiet room that becomes a spacecraft when your child is ready.
```

Not:

```text
space-themed room
interactive galaxy ceiling
projection bedroom
```

---

# 40. Space Product System

Public product system should conceptually be:

```text
Sleep Command Pod
Orbit Companion
Navigation Beacon
Mission Light / Holographic System
```

But do NOT expand into real commerce structure yet.

Commercial facts remain:

```text
NOT_ESTABLISHED
```

---

# 41. What Codex Must Not Do

Do NOT:

```text
reuse permanent solar-system ceiling
build many decorative props
turn space room into a toy store
make all walls full projection surfaces
make pod fully enclosed
add backend complexity
add product pricing
add ecommerce claims
add many missions
create multiple new characters
```

---

# 42. What Codex Should Reuse

Codex may reuse from MyNest system:

```text
state-based scene logic
minimal first viewport philosophy
room-first presentation
day/rest state thinking
physical + digital identity logic
```

But not Ocean-specific visuals or creature logic.

---

# 43. Implementation Scope

This sprint is:

```text
VISUAL DIRECTION
+
ROOM SYSTEM
+
STATE DESIGN
+
OBJECT SYSTEM
```

This sprint is NOT:

```text
final commerce launch
full product engineering
backend expansion
public pilot launch
```

---

# 44. Execution Order

```text
SPRINT 1
Freeze doctrine and object limit

SPRINT 2
Regenerate Space Room idle base from scratch

SPRINT 3
Design Sleep Command Pod

SPRINT 4
Design Orbit companion

SPRINT 5
Design Navigation Beacon

SPRINT 6
Generate Mission Active state

SPRINT 7
Generate Return Home state

SPRINT 8
Generate Sleep state

SPRINT 9
Review desktop/mobile compositions

SPRINT 10
Integrate into prototype page or documentation
```

---

# 45. Acceptance Criteria

```text
STATIC_THEME_BEDROOM_REMOVED = PASS/FAIL
POD_IS_HERO_OBJECT = PASS/FAIL
CEILING_IS_CLEAN_BY_DEFAULT = PASS/FAIL
WALLS_ARE_MINIMAL = PASS/FAIL
NO_PERMANENT_GALAXY_DECOR = PASS/FAIL
ORBIT_DEFINED = PASS/FAIL
NAVIGATION_BEACON_DEFINED = PASS/FAIL
MISSION_ACTIVE_EXPANDS_FROM_POD = PASS/FAIL
RETURN_HOME_STATE_EXISTS = PASS/FAIL
SLEEP_STATE_EXISTS = PASS/FAIL
DECORATION_DENSITY_LOW = PASS/FAIL
DESKTOP_SET_COMPLETE = PASS/FAIL
MOBILE_SET_COMPLETE = PASS/FAIL
BACKEND_CHANGED = NO
```

---

# 46. Final Codex Output

Return exactly:

```text
PROJECT =
MYNEST_SPACE_COMMAND_POD_ROOM_v0.1

SPACE_IDLE_ASSET =
<path or reference>

SPACE_MISSION_ACTIVE_ASSET =
<path or reference>

SPACE_RETURN_HOME_ASSET =
<path or reference>

SPACE_SLEEP_ASSET =
<path or reference>

DESKTOP_SET =
PASS/FAIL

MOBILE_SET =
PASS/FAIL

STATIC_THEME_BEDROOM_REMOVED =
PASS/FAIL

POD_IS_HERO_OBJECT =
PASS/FAIL

CEILING_IS_CLEAN_BY_DEFAULT =
PASS/FAIL

WALLS_ARE_MINIMAL =
PASS/FAIL

ORBIT_DEFINED =
PASS/FAIL

NAVIGATION_BEACON_DEFINED =
PASS/FAIL

MISSION_ACTIVE_EXPANDS_FROM_POD =
PASS/FAIL

RETURN_HOME_STATE_EXISTS =
PASS/FAIL

SLEEP_STATE_EXISTS =
PASS/FAIL

DECORATION_DENSITY_LOW =
PASS/FAIL

BACKEND_CHANGED =
NO/YES

TESTS =
<summary>

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL/NOT_REQUIRED

READY_FOR_VISUAL_REVIEW =
YES/NO

BLOCKERS =
<exact blockers>
```

---

# 47. Frozen Doctrine

> The room is not decorated as space.  
> The room becomes space.

> The command pod is the room’s heart.

> The ceiling must be quiet until activated.

> Orbit is a companion, not a toy astronaut.

> The universe should emerge from the pod, not cover the room by default.

> Bedtime in Space is not “turning off lights.”  
> It is returning home from a mission.

> Fewer objects make the world more believable.

> Space Room succeeds when the child feels:
> **“This is my own spacecraft.”**
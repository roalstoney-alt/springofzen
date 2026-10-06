# MYNEST_OCEAN_REST_NIGHT_LIGHTING_PATCH_v0.3.1

## 0. Purpose

```text
PROJECT =
MYNEST_OCEAN_REST_NIGHT_LIGHTING_PATCH_v0.3.1

PARENT =
MYNEST_OCEAN_REAL_ROOM_001_LIVED_IN_REFRAME_v0.3

TARGET =
https://www.springofzen.com/mynest/magic-room/

BUG =
REST mode quiets creatures,
but the physical room still visually remains in daytime.

SEVERITY =
BLOCKING

CORE_FIX =
REST MUST TRANSITION THE WHOLE ROOM
FROM DAY → DUSK → NIGHT
```

---

# 1. Frozen Rule

`Rest` is not:

```text
fish stop
+
Milo goes home
```

`Rest` is:

```text
DAY ROOM
↓
DUSK
↓
NIGHT ROOM
↓
MILO RETURNS HOME
↓
ROOM SLEEPS
```

The physical environment must change before the bedtime sequence can be considered valid.

---

# 2. Current Failure

The current base artwork contains visible daylight from the window.

Therefore this is invalid:

```text
REST
+
bright outdoor daylight
+
daytime room exposure
```

A child must not see:

> Milo is sleeping while the sun is still pouring through the room.

---

# 3. Required Lighting States

Implement exactly three room-light states:

```text
ROOM_LIGHT_DAY
ROOM_LIGHT_DUSK
ROOM_LIGHT_NIGHT
```

Do not add more states in this patch.

---

# 4. DAY State

Used for:

```text
initial room
Explore
normal idle
```

Characteristics:

```text
natural daylight through window
warm cream room
normal floor brightness
Shell Light off / near-off
normal contrast
```

Use current v0.3 base as DAY reference.

---

# 5. DUSK State

Transitional only.

Duration:

```text
2.5–4 seconds
```

Changes:

```text
window brightness ↓
daylight warmth ↓
room exposure ↓
outside view moves toward blue-grey evening
direct daylight reflection disappears
Shell Light begins to glow
water-light becomes weaker
fish begin leaving
```

DUSK is not a final state.

---

# 6. NIGHT State

Final Rest environment.

Required:

```text
window = dark blue / near-black exterior
NO visible daytime sky
NO sunlight beam
NO warm daylight entering room

room = low ambient blue-grey darkness

bed = still readable

Milo Plush = readable but not spotlighted

Shell Light = primary local warm light

Reef = barely visible

floor = low contrast

digital water effect = almost absent
```

Target visual principle:

```text
NIGHT ROOM 90%
MAGIC 10%
```

---

# 7. Do Not Simulate Night With One Global Black Overlay

Prohibited:

```text
opacity: black overlay;
```

alone.

Reason:

It will leave the window and daylight logic visibly wrong.

The night state must treat separately:

```text
WINDOW
ROOM AMBIENT
SHELL LIGHT
FLOOR
BED
```

---

# 8. Preferred Implementation

Create dedicated paired NIGHT assets:

```text
assets/ocean-room-base-v03-desktop-night.jpg
assets/ocean-room-base-v03-mobile-night.jpg
```

They must preserve exactly:

```text
camera
bed
Milo Plush
Shell
Reef
shelf
curtain
window geometry
floor geometry
```

Only lighting/time-of-day changes.

---

# 9. Night Asset Generation Method

Use the existing DAY artwork as image-edit input.

Do NOT regenerate a new room from a text prompt.

Edit only:

```text
outside-window time
room illumination
daylight reflections
Shell illumination
ambient color temperature
```

Geometry must remain stable.

---

# 10. Desktop Night Edit Brief

Transform the existing desktop DAY base into:

```text
same exact child bedroom
same exact camera
same exact furniture
same exact Milo position
same exact Shell Light
same exact Reef
same exact bed
same exact curtain
same exact window

night outside the window
deep soft blue-grey night sky
no sunlight
no golden daylight entering the room
no daylight shadows

room is dim but still readable
soft cool ambient night light
warm low pearl glow from Shell Light
Milo Plush softly visible
bed softly visible
floor mostly dark
realistic nighttime exposure
quiet
safe
calm

do not move or redesign anything
do not add stars
do not add moon graphics
do not add fish
do not add ocean effect
do not add text
```

---

# 11. Mobile Night Edit Brief

Same rules.

Use:

```text
assets/ocean-room-base-v03-mobile.jpg
```

as source.

Create:

```text
assets/ocean-room-base-v03-mobile-night.jpg
```

Do not derive mobile from desktop.

---

# 12. Geometry Verification

Before use, compare DAY and NIGHT assets.

PASS only if:

```text
bed edges align
window aligns
curtain aligns
Milo anchor aligns
Shell aligns
Reef aligns
shelf aligns
floor/wall boundary aligns
```

If meaningful geometry drift exists:

```text
REJECT NIGHT ASSET
```

and regenerate/edit again.

Do NOT silently adjust interaction masks around bad art.

---

# 13. Transition Implementation

Use layered crossfade:

```text
DAY_BASE
↓
DUSK_BLEND
↓
NIGHT_BASE
```

Recommended:

```text
DAY → DUSK:
1.5–2 sec

DUSK → NIGHT:
2–3 sec
```

Total:

```text
3.5–5 sec
```

No instant switch.

---

# 14. Rest Sequence Order

When user activates `Rest`:

```text
T+0.0
REST requested

T+0.3
fish slow

T+0.8
window begins dimming

T+1.2
room exposure starts dropping

T+1.5
Shell Light begins warming

T+2.0
fish begin hiding

T+3.0
outside is dusk/night

T+3.5
Milo recognizes bedtime

T+4.0+
Milo Return Home begins
```

Critical:

> Milo must NOT go home while the room still looks like daytime.

---

# 15. Milo Return Dependency

Change state dependency to:

```text
MILO_RETURN_HOME
REQUIRES
ROOM_LIGHT_STATE >= DUSK
```

Prefer:

```text
MILO_RETURN_HOME starts when NIGHT transition is substantially complete.
```

---

# 16. Fish Exit

As light changes:

```text
DAY:
1–3 visible

DUSK:
fish stop / hide

NIGHT:
0 visible
```

No fish during final sleep state.

---

# 17. Shell Light Behavior

Shell becomes the primary practical night light.

States:

```text
DAY =
off / minimal

DUSK =
soft warm rise

NIGHT =
low warm pearl glow

SLEEP_FINAL =
even lower stable glow
```

No pulsing after final sleep transition except the already-defined optional two very slow Milo-home pulses.

---

# 18. Window Behavior

Window is the most important visual correction.

DAY:

```text
bright exterior
```

REST transition:

```text
brightness falls
color cools
daylight reflections disappear
```

NIGHT:

```text
dark exterior
no visible sun
no sunlight
no daytime exposure
```

Do not add fantasy ocean scenery outside the window.

It remains a real window.

---

# 19. Curtain

Curtain may become:

```text
slightly darker
slightly cooler
```

but do not animate it.

No automatic curtain-closing animation in this patch.

---

# 20. Room Ambient Grade

DAY:

```text
warm-neutral
```

NIGHT:

```text
cool ambient
+
local warm Shell Light
```

This warm/cool contrast should make bedtime visually legible.

Avoid full blue tint.

Skin/wood/cream tones must remain believable.

---

# 21. Bed Visibility

Night state must not make the bed disappear.

Target:

```text
BED_VISIBILITY =
clear enough for child orientation
but substantially dimmer than DAY
```

The bed remains the safe visual anchor.

---

# 22. Milo Plush Visibility

After Digital Milo enters Plush:

Milo Plush must remain visible from:

```text
Shell Light spill
+
very low ambient room light
```

Do not spotlight Milo unnaturally.

---

# 23. Final Sleep Frame

Target frame:

```text
dark window
dim real room
warm low Shell Light
physical Milo visible
no fish
no digital Milo
no active ocean creatures
almost no water effect
```

This is the required final state.

---

# 24. Rest Exit

If user exits Rest and returns to Explore:

Do not jump instantly to daylight.

Reverse:

```text
NIGHT
↓
DUSK
↓
DAY
```

Duration:

```text
3–4 sec
```

Shell dims gradually.

Fish only reappear after:

```text
ROOM_LIGHT_DAY
```

or near-complete transition.

---

# 25. Story Mode

Story remains primarily DAY / EARLY EVENING.

Do not force full NIGHT unless Story transitions into Rest.

---

# 26. Reduced Motion

For:

```text
prefers-reduced-motion
```

still perform day/night state change.

Use:

```text
slow opacity crossfade
```

No moving light animation required.

Night semantics must remain intact.

---

# 27. Mobile

Mobile must receive the same lighting-state logic.

Do not leave mobile in daylight while desktop switches to night.

Test independently.

---

# 28. No Backend Change

```text
BACKEND_CHANGED =
NO
```

No D1 changes.

No new pilot fields.

No analytics change required.

This is visual-state logic only.

---

# 29. New Visual QA States

Add:

```text
DESKTOP_DAY
DESKTOP_DUSK
DESKTOP_NIGHT
DESKTOP_MILO_HOME_NIGHT

MOBILE_DAY
MOBILE_DUSK
MOBILE_NIGHT
MOBILE_MILO_HOME_NIGHT
```

Capture screenshots.

---

# 30. Blocking Visual Tests

FAIL if any NIGHT screenshot contains:

```text
bright daytime sky
direct sunlight
strong daylight floor reflection
daytime curtain illumination
day exposure on wall
```

---

# 31. Rest Acceptance

PASS only when a first-time observer can tell without text:

```text
the room is going to sleep
```

This is the key test.

---

# 32. Final-State Acceptance

PASS only if:

```text
WINDOW_NIGHT =
PASS

ROOM_DIMMED =
PASS

SHELL_PRIMARY_LIGHT =
PASS

FISH_GONE =
PASS

DIGITAL_MILO_GONE =
PASS

PHYSICAL_MILO_VISIBLE =
PASS

DAYLIGHT_REMOVED =
PASS
```

---

# 33. Do Not Change During This Patch

Do not modify:

```text
room furniture
Milo design
fish design
Reef design
Shell physical shape
homepage content
consumer copy
pilot notebook
SKU logic
```

Fix Rest lighting first.

---

# 34. Deployment Gate

Do not deploy until desktop and mobile both show:

```text
DAY
→ DUSK
→ NIGHT
→ MILO HOME
```

correctly.

---

# 35. Final Codex Report

Return:

```text
PROJECT =
MYNEST_OCEAN_REST_NIGHT_LIGHTING_PATCH_v0.3.1

DESKTOP_NIGHT_BASE =
<path>

MOBILE_NIGHT_BASE =
<path>

DAY_NIGHT_GEOMETRY_MATCH =
PASS/FAIL

WINDOW_DAYLIGHT_REMOVED =
PASS/FAIL

DAY_TO_DUSK =
PASS/FAIL

DUSK_TO_NIGHT =
PASS/FAIL

SHELL_NIGHT_LIGHT =
PASS/FAIL

MILO_RETURN_AFTER_DUSK =
PASS/FAIL

FINAL_SLEEP_LIGHTING =
PASS/FAIL

REST_EXIT_TO_DAY =
PASS/FAIL

DESKTOP =
PASS/FAIL

MOBILE =
PASS/FAIL

REDUCED_MOTION =
PASS/FAIL

BACKEND_CHANGED =
NO

BACKEND_REGRESSION =
PASS/FAIL

TESTS =
<summary>

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL

BLOCKERS =
<none or exact blockers>
```

---

# 36. Frozen Rule

> **Rest is not an animation state. Rest is a time-of-day transition.**

> **The room must fall asleep before Milo can fall asleep.**

> **When Milo goes home, daylight must already be leaving.**

> **The final frame is a real night bedroom, not a daytime room with fewer animations.**
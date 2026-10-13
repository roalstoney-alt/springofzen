PROJECT =
MYNEST_SPACE_COMMAND_POD_ROOM_REFINEMENT_v0.2

BASELINE =
f4090960d2e6786600af04f36656238d1fcf5c66

TARGET =
https://www.springofzen.com/mynest/space-room/

CHANGE_CLASS =
VISUAL PRODUCT REFINEMENT

CORE_GOAL =
Make CABIN_IDLE already communicate:
"This is my spacecraft."

DO NOT ADD =
new missions
new characters
new backend
new commerce
new projection modes

1. Pod must stop looking like a canopy bed
Current Pod:
rounded upholstered frame
+
ordinary mattress
+
three front buttons

reads too strongly as furniture.
Replace visual language with:
LOW CHILD SLEEP SURFACE
+
STRUCTURAL COCKPIT SHELL
+
PARTIAL TRANSPARENT CANOPY
+
INTEGRATED SIDE CONSOLE
+
HEAD-END COMMAND BULKHEAD

Target perception:
BED = physically obvious
SPACECRAFT = visually dominant

Do NOT make it sealed.
Required Pod geometry
FRONT =
low open entry

LEFT / RIGHT =
sculpted shell rails

HEAD =
integrated command bulkhead

UPPER =
partial canopy only over head / upper torso zone

SIDE =
one reachable control console

MATTRESS =
real, soft, clearly usable

Remove the current three oversized front buttons.
They make the Pod look like a children's product mockup.
Move controls into:
RIGHT SIDE CONSOLE

or:
INNER POD RAIL

where a child lying/sitting inside could naturally operate them.
2. Pod control surface
Use three physical interaction zones only:
WAKE
EXPLORE
HOME

But render them as spacecraft controls, not toy buttons.
Example:
WAKE =
small illuminated ring

EXPLORE =
central star/navigation pad

HOME =
recessed home/dock icon

No large labels.
No fake dense sci-fi dashboard.
3. Mission must originate physically from the Pod
Current Mission already expands from the Pod visually. Keep that.
But make the source more believable:
POD HOLO EMITTER

located at:
head console
or
upper side rail

Sequence:
small local holo map
↓
navigation arcs
↓
wall field
↓
ceiling field

Do not let blue lines appear to originate abstractly from the floor.
The child should understand:
I opened this from my cockpit.

4. Reduce domestic-room noise
Remove from the Space Room base:
green plants
decorative hanging plants
dog plush
beanbag
loose toy blocks
ordinary children’s toy clutter
open decorative shelf styling
large domestic rug

These are not unsafe or ugly.
They simply tell the wrong story.
The room should not look sterile, but its softness should come from:
bed textiles
one floor mat
window fabric
Orbit

not decorative objects.
5. Cabin architecture replaces decoration
Use architecture to make the room futuristic:
integrated wall panels
flush storage
subtle panel seams
recessed light lines
one window
one pod
one Orbit dock
one Beacon

The room should visually have perhaps:
80% architecture
15% Pod
5% objects

rather than lots of styled decor.
6. Window treatment
Current large bright garden window makes Idle read strongly as a normal luxury bedroom. Spring of Zen
Do not necessarily remove the window.
Instead redesign it as:
recessed cabin window
+
flush blind / smart shade

Idle
soft daylight allowed

Mission
shade darkens
outside visual recedes

Return
outside gradually becomes visible again

Sleep
shade mostly closed

This makes the same physical room participate in the state machine.
7. Orbit dock
Orbit is conceptually right but currently looks placed inside a lit wall cubby.
Upgrade it to:
ORBIT DOCK

The dock should have:
one shallow wall recess
one charging/contact base
one tiny status light

No decorative shelf.
During Idle:
Orbit physically docked
eyes low/off

Mission:
eyes wake
dock light cyan
digital Orbit may join interface

Return:
Orbit returns

Sleep:
dock warm/off

8. Navigation Beacon redesign
Current tall vertical lamp is too generic.
Replace it with a dedicated but restrained object:
NAVIGATION BEACON

Form:
25–45 cm tall
rounded monolithic form
matte translucent shell
no visible bulb
no obvious floor-lamp language

States:
IDLE =
soft warm white

MISSION =
cool navigation pulse / steady cyan

RETURN =
cyan → warm

SLEEP =
very low amber

Do not make it a moon.
Do not make it a rocket.
9. Floor
Remove the large decorative round rug.
Replace with:
one low-profile neutral mission mat

or even:
mostly clear floor

The Pod should visually sit inside the room like equipment.
Not inside a styled living-room composition.
10. Lighting architecture
Current room relies heavily on warm interior-design lighting.
Change to more structured states.
CABIN_IDLE
neutral warm-white
minimal architectural seam light
Pod internal soft light

MISSION_ACTIVE
ambient room ↓
Pod interface ↑
cyan/navigation light ↑
projection field ↑

RETURN_HOME
projection ↓
cyan ↓
warm cabin light ↑

SLEEP
Pod interior warm low light
Beacon amber low
Orbit dock off
room very calm

Sleep state is already directionally strong; preserve its restraint. Spring of Zen
11. Ceiling
The current active Mission ceiling is acceptable because it exists only during Mission.
Keep:
IDLE =
clean architectural ceiling

MISSION =
temporary projected star/navigation field

RETURN =
field collapses

SLEEP =
clean dark ceiling

Do NOT turn it into permanent astronomical decoration.
12. Mission visual reduction
Current Mission image is visually attractive but a little dense.
Reduce:
number of planets
number of orbit curves
star density
blue haze

Prefer one clear destination:
BLUE PLANET

plus:
navigation route
deep field
few stars

Mission should answer:
Where are we going?

not:
How much space imagery can we show?

13. Mission 01 visual grammar
Freeze first real visual mission around:
FIND THE BLUE PLANET

Sequence:
small holo map
↓
one trajectory
↓
one distant blue planet
↓
approach
↓
arrival

No multiple planets competing for attention.
14. Child role
The child should feel like:
PILOT

not:
viewer

Therefore every major visual event must have an initiating control.
Example:
child taps EXPLORE
↓
Pod recognizes action
↓
local map wakes
↓
room projection expands

Avoid automatic spectacle immediately on page load.
15. First viewport
Current route text includes:
Space Room · Prototype 01
The room stays quiet.
The mission waits.

The philosophy is correct, but the visual product is now strong enough that the page should eventually follow Ocean's rule:
ROOM FIRST
EXPLANATION BELOW

So for consumer-facing first 100vh:
CABIN_IDLE VISUAL
+
minimal state controls

Then below fold:
A quiet room that becomes a spacecraft when your child is ready.

Keep prototype/method copy lower.
16. Idle acceptance test
This is the most important v0.2 test.
Hide all Mission effects.
Show only Idle.
Ask:
What is this room?

PASS if an observer spontaneously says something close to:
spaceship
spacecraft cabin
future sleeping pod
pilot bed

FAIL if:
modern kids room
fancy bed
capsule-style bed
luxury bedroom

17. Pod acceptance
PASS only if:
looks operable
looks sleepable
looks child-accessible
looks unmistakably spacecraft-derived
remains obviously open

FAIL if:
looks sealed
looks medical
looks like furniture with LEDs
looks like a toy rocket

18. Object-count gate
Visible special objects maximum:
1 Command Pod
1 Orbit
1 Navigation Beacon

Everything else:
architecture
bedding
storage
window

No themed prop expansion.
19. Required new assets
Regenerate all four state pairs using one frozen geometry:
space-command-pod-idle-desktop-v02.jpg
space-command-pod-idle-mobile-v02.jpg

space-command-pod-mission-desktop-v02.jpg
space-command-pod-mission-mobile-v02.jpg

space-command-pod-return-desktop-v02.jpg
space-command-pod-return-mobile-v02.jpg

space-command-pod-sleep-desktop-v02.jpg
space-command-pod-sleep-mobile-v02.jpg

All four must preserve:
Pod geometry
Orbit dock position
Beacon position
window geometry
storage geometry
camera position

Only state/light/projection changes.
20. Conditional Codex execution
IF Idle still reads as ordinary bedroom
THEN
  simplify architecture
  strengthen Pod shell geometry
  DO NOT add more space decoration

IF Pod still reads as canopy bed
THEN
  rebuild Pod
  move controls inward
  add partial canopy + command bulkhead
  DO NOT compensate with LEDs

IF Mission feels like wallpaper
THEN
  reduce field size
  make local holo source visible
  emphasize Pod → room expansion

IF room feels sterile
THEN
  add softness through bedding/materials
  NOT through ornaments

IF Orbit looks like a toy
THEN
  simplify shape
  integrate dock relationship

IF Beacon looks like ordinary lamp
THEN
  redesign its physical silhouette

IF Sleep remains visually stimulating
THEN
  remove cyan/projection until only warm sleep state remains

21. Do not change
BACKEND
Ocean Room
pilot
Method
Results
SEO architecture
commerce facts

No new product claims.
22. Acceptance output
PROJECT =
MYNEST_SPACE_COMMAND_POD_ROOM_REFINEMENT_v0.2

IDLE_READS_AS_SPACECRAFT =
PASS/FAIL

POD_READS_AS_COMMAND_POD =
PASS/FAIL

POD_REMAINS_OPEN_AND_SLEEPABLE =
PASS/FAIL

DOMESTIC_DECOR_REDUCED =
PASS/FAIL

WALLS_ARCHITECTURAL =
PASS/FAIL

ORBIT_DOCK =
PASS/FAIL

NAVIGATION_BEACON =
PASS/FAIL

HOLOGRAM_SOURCE_VISIBLE =
PASS/FAIL

MISSION_EXPANDS_FROM_POD =
PASS/FAIL

MISSION_VISUAL_DENSITY =
PASS/FAIL

RETURN_HOME =
PASS/FAIL

SLEEP_RESTRAINT =
PASS/FAIL

FIRST_100VH_ROOM_FIRST =
PASS/FAIL

DESKTOP_SET =
PASS/FAIL

MOBILE_SET =
PASS/FAIL

OCEAN_REGRESSION =
PASS/FAIL

BACKEND_CHANGED =
NO

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL

READY_FOR_CHILD_DESIRE_TEST =
YES/NO

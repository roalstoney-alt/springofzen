# MYKIDSNEST_STANDALONE_THREE_WORLDS_SITE_v0.1

## 0. Project

```text
PROJECT =
MYKIDSNEST_STANDALONE_THREE_WORLDS_SITE_v0.1

DOMAIN =
https://mykidsnest.com/

WWW_DOMAIN =
https://www.mykidsnest.com/

PLATFORM =
CLOUDFLARE WORKER + STATIC ASSETS

WORKER_NAME =
mykidsnest-site

SOURCE_PROJECT =
CURRENT SPRINGOFZEN / MYNEST PRODUCTION REPOSITORY

SOURCE_WORLDS =
1. OCEAN
2. SPACE
3. FOREST

PUBLIC_ROLE =
CONSUMER PRODUCT EXPERIENCE SITE

RESEARCH_ROLE =
NO

BACKEND_EXPANSION =
NO

PII_COLLECTION =
NO

PRIMARY_GOAL =
Create a standalone MyKidsNest consumer site
with a full-screen three-world homepage carousel,
then route users into dedicated Ocean, Space, and Forest pages.

STATUS =
READY_TO_EXECUTE

1. HARD FROZEN TECHNICAL BOUNDARIES
These two boundaries are mandatory.
They override convenience, speed, and implementation shortcuts.
BOUNDARY 01 — MYKIDSNEST MUST BE TRULY STANDALONE
MYKIDSNEST_STANDALONE_RUNTIME =
MANDATORY

mykidsnest.com must NOT be a visual shell around SpringOfZen.
The new site must own and serve its own:
HTML
CSS
JavaScript
images
videos
animation assets
WebGL assets
JSON/config
icons
static data
world runtime

The following runtime dependencies are prohibited:
springofzen.com image hotlinks
springofzen.com JS
springofzen.com CSS
springofzen.com world runtime
springofzen.com /api/mynest/*
iframe embedding of existing world pages
reverse proxying SpringOfZen pages as the new site

Normal outbound links are allowed.
Example:
Research / Method
→ https://www.springofzen.com/mynest/method/

is allowed.
But:
<img src="https://www.springofzen.com/...">
<script src="https://www.springofzen.com/...">
fetch("https://www.springofzen.com/api/mynest/...")

are prohibited.
Enforcement
IF MyKidsNest requires a SpringOfZen runtime resource
THEN
    copy/rebuild that resource locally
    OR remove the dependency.

IF dependency cannot be removed
THEN
    STANDALONE_RUNTIME = FAIL
    DEPLOYMENT = HOLD

BOUNDARY 02 — DO NOT MODIFY OR REDIRECT EXISTING SPRINGOFZEN MYNEST YET
Existing production under:
https://www.springofzen.com/mynest/

must remain unchanged during this migration.
Do NOT:
delete old pages
replace old pages
301 redirect old pages
302 redirect old pages
set cross-domain canonical
set noindex
archive old consumer pages
change existing MyNest routes
remove existing world experiences

during this workflow.
Reason:
SpringOfZen currently contains:
method
pilot
evidence
history
research
existing indexed/public content

MyKidsNest must first become:
LIVE
STABLE
INDEPENDENT
VERIFIED

before migration policy is revisited.
Future rule
Only after MyKidsNest production is validated:
IF user gives separate explicit authorization
THEN
    evaluate:
    cross-domain canonical
    301 migration
    archival strategy
    noindex strategy

ELSE
    leave SpringOfZen unchanged.

2. Brand Architecture
Freeze:
MYKIDSNEST.COM =
consumer product experience

SPRINGOFZEN.COM/MYNEST =
method + research + pilot + evidence

Public product brand remains:
MyNest

Domain:
MyKidsNest.com

Preferred footer relationship:
MyNest by Spring of Zen

Do NOT automatically rename the product to:
My Kids Nest

unless separately authorized.
Preserve:
Milo
Orbit
Ocean
Space
Forest

3. Site Architecture
Create canonical routes:
/
 /ocean/
 /space/
 /forest/

Full URLs:
https://mykidsnest.com/
https://mykidsnest.com/ocean/
https://mykidsnest.com/space/
https://mykidsnest.com/forest/

Optional aliases:
/ocean-room/  → /ocean/
/space-room/  → /space/
/forest-room/ → /forest/

Use permanent redirect only inside the new MyKidsNest domain.
Do not redirect from SpringOfZen.
4. Homepage Core Doctrine
Homepage purpose:
Choose your world.

The homepage is not a traditional startup homepage.
Do not lead with:
headline
long paragraph
feature grid
method
pilot
evidence
technology explanation

First viewport:
100dvh
FULL-SCREEN THREE-WORLD CAROUSEL

Slides:
01 OCEAN
02 SPACE
03 FOREST

5. Homepage Carousel Content
Each slide contains only:
full-screen world visual
world name
one short line
one CTA

Ocean
OCEAN

Meet Milo.

ENTER OCEAN

Space
SPACE

Launch your own spacecraft.

ENTER SPACE

Forest
FOREST

Step into the enchanted meadow.

ENTER FOREST

No explanatory paragraphs.
6. Homepage Visual Selection
Codex must inspect the latest approved world assets before selection.
Do NOT generate new world concepts merely for the homepage.
Preferred hero logic:
OCEAN =
real room + Milo clearly visible

SPACE =
Command Pod + strong mission / galaxy wow

FOREST =
soft meadow floor + princess bed + deer + full-height forest window

Use dedicated mobile hero assets where available.
7. Carousel Behavior
Required:
AUTO_ADVANCE = YES
AUTO_ADVANCE_INTERVAL = 6–8 SEC

TOUCH_SWIPE = YES
DESKTOP_ARROWS = YES
DOT_NAVIGATION = YES
KEYBOARD = YES

Conditional:
IF user manually changes slide
THEN
    pause autoplay temporarily.

IF document is hidden
THEN
    pause autoplay.

IF prefers-reduced-motion = true
THEN
    autoplay = OFF
    manual navigation = ON

8. Carousel Transition
Preferred:
slow crossfade
+
very subtle scale/depth shift

Target:
1.0–1.5 sec

Do NOT use:
3D cube
fast horizontal slide
flash
rapid zoom

9. Slide Navigation
Each world slide must have an explicit accessible CTA.
Examples:
ENTER OCEAN
ENTER SPACE
ENTER FOREST

Entire slide may also be clickable.
Accessibility must not depend on the image itself being clickable.
10. Homepage Loading Strategy
Priority:
1. first carousel hero
2. minimal navigation
3. second slide visual
4. third slide visual
5. optional richer preview assets

Do NOT initialize Ocean + Space + Forest engines on homepage load.
Homepage should be light.
11. Ocean Migration
Source:
CURRENT APPROVED OCEAN PRODUCTION

New route:
/ocean/

Copy locally:
room base assets
Milo
baby fish
Shell Light
Reef Accent
Milo Return Home
day/night/rest logic
mobile assets
reduced-motion implementation
fallback assets
consumer copy

Do NOT copy:
Room Gravity
Pilot Notebook
Day1/3/7/14 UI
Evidence Registry
F01–F06
internal test labels
SKU internal IDs
research controls

12. Ocean First Viewport
First viewport:
ROOM EXPERIENCE ONLY

Allowed:
small brand
sound
Rest
world menu/back

Below fold:
Meet Milo
How the room comes alive
Milo Plush
Shell Light
Reef Accent

No fake commerce.
13. Space Migration
Source:
CURRENT APPROVED SPACE PRODUCTION

New route:
/space/

Copy locally:
Sleep Command Pod
Orbit
Navigation Beacon
Cabin Idle
Explore
Launch
Earth
Galaxy
interaction
Return Home
Sleep
mobile
reduced motion
fallback

Space must preserve its interactive mission engine.
Do NOT regress it into:
static state slideshow

14. Space Page Doctrine
First viewport:
COMMAND POD FIRST

Primary action:
EXPLORE

Below fold:
A quiet room that becomes a spacecraft when your child is ready.

Remove consumer-visible:
Prototype 01
v0.x
render stack
engineering test language
technical QA labels

15. Forest Migration
Source:
CURRENT APPROVED FOREST PRODUCTION

Route:
/forest/

Copy locally:
princess bed
natural tree
full-height forest window
meadow floor
deer
mushroom lamps
fireflies
Play mode
Dream mode
Sleep / lights-off real mode
mobile
reduced motion
fallback

16. Forest Meadow Variant Rule
If Forest currently contains an A/B floor experiment:
IF winner has already been selected
THEN
    use winning variant.

ELSE
    use the current approved public default.

Do NOT expose:
A/B internal controls
variant IDs
developer toggles

on MyKidsNest.
Preferred production doctrine:
soft full-room meadow floor
barefoot-friendly
flowers
mushroom lights
no muddy forest ground

17. Forest Public Controls
Public state labels:
PLAY
DREAM
SLEEP

Internal names may remain:
DAY_PLAY
NIGHT_DREAM
LIGHTS_OFF_REAL

Do not expose engineering state labels.
18. World Cross-Navigation
Each world page must provide a small world switcher:
OCEAN
SPACE
FOREST

Placement:
small corner menu
or
bottom world chooser

Do not overlay large world cards on active room experience.
19. End-of-World Navigation
Below fold:
TRY ANOTHER WORLD

Show only other two worlds.
Example from Ocean:
SPACE
FOREST

This creates:
Ocean → Space → Forest → Ocean

browsing circulation.
20. Standalone Asset Requirement
All MyKidsNest assets must live under the new site.
Preferred structure:
/assets/shared/
/assets/ocean/
/assets/space/
/assets/forest/

Runtime source must resolve from:
mykidsnest.com

not SpringOfZen.
21. Runtime Dependency Audit
After build, search for:
springofzen.com
www.springofzen.com
/api/mynest/
/Volumes/
file://
localhost
127.0.0.1

Logic:
IF occurrence is runtime asset/script/API dependency
THEN
    FAIL
    localize/remove dependency.

IF occurrence is an intentional outbound research/footer link
THEN
    allow.

Final requirement:
STANDALONE_RUNTIME = PASS

22. Backend Rule
Expected:
BACKEND_CHANGED = NO

Inspect copied world JavaScript.
IF a backend call exists only for pilot/research
THEN
    remove it.

IF visual experience can run locally
THEN
    move it fully client-side.

IF visual experience requires a new backend
THEN
    stop that branch
    report BACKEND_AUTH_REQUIRED.

Do NOT copy SpringOfZen research API behavior to the new site.
23. Privacy Rule
Initial MyKidsNest must add no new user data collection.
Freeze:
NO LOGIN
NO EMAIL
NO PHONE
NO CHILD NAME
NO ADDRESS
NO PHOTO
NO VIDEO
NO VOICE
NO FACE DATA
NO FREE TEXT

Unless separately authorized later.
24. Recommended Repository Structure
If no current multi-site convention exists:
sites/
  mykidsnest/
    src/
      worker.js

    public/
      index.html

      ocean/
        index.html

      space/
        index.html

      forest/
        index.html

      assets/
        shared/
        ocean/
        space/
        forest/

      css/
        site.css
        home.css
        worlds.css

      js/
        shared.js
        home-carousel.js
        ocean.js
        space.js
        forest.js

      robots.txt
      sitemap.xml
      404.html

    wrangler.toml
    package.json

25. Repository Placement Logic
IF repository already has a multi-site pattern
THEN
    follow existing convention.

ELSE
    create /sites/mykidsnest/.

DO NOT
    reorganize entire SpringOfZen repository.

26. Asset Manifest
Create:
sites/mykidsnest/ASSET_MANIFEST.md

Fields:
WORLD
SOURCE_PATH
DESTINATION_PATH
TYPE
USED_BY
RUNTIME_LOCAL = YES/NO

Requirement:
RUNTIME_LOCAL = YES

for every runtime asset.
27. Asset Copy Rule
Use repository originals whenever possible.
Do NOT download live production-compressed files if original assets exist locally.
Conditional:
IF source asset exists locally
THEN
    copy from source repo.

ELSE IF only live asset exists
THEN
    retrieve once
    save locally
    document source.

No hotlinking.
28. JavaScript Isolation
Homepage loads:
home-carousel.js
shared.js

Ocean loads:
ocean.js

Space loads:
space.js

Forest loads:
forest.js

Do not load all world engines globally.
29. Shared Runtime
Only truly shared utilities belong in:
shared.js

Examples:
reduced motion
sound preference
simple navigation
common DOM utilities

Do not put world-specific behavior into shared runtime.
30. Cloudflare Worker Authentication
Before mutation:
wrangler whoami

Logic:
IF authenticated
AND account has access to mykidsnest.com
THEN
    continue.

ELSE
    CLOUDFLARE_AUTH = BLOCKED
    complete site locally
    DO NOT claim deployment.

31. Cloudflare Zone Check
Verify:
mykidsnest.com

is active in intended Cloudflare account.
IF zone active
THEN
    continue.

ELSE
    BLOCKER = DOMAIN_ZONE_NOT_ACTIVE

Do not change unrelated DNS records.
32. Dedicated Worker
Create:
WORKER =
mykidsnest-site

Worker responsibilities:
static asset serving
clean route handling
www redirect
404 behavior
security headers
cache headers

No D1 required.
No KV required unless strictly necessary.
No API expected.
33. Worker Static Assets
Use current supported Cloudflare Workers static asset pattern.
Do not copy deprecated configuration from old examples.
Logic:
IF repository contains existing modern Worker static-assets pattern
THEN
    reuse structure.

ELSE
    create minimal compatible Worker/static asset configuration.

34. Route Handling
Worker must resolve:
/          → homepage
/ocean/    → Ocean
/space/    → Space
/forest/   → Forest

Aliases:
/ocean-room/  → 301 /ocean/
/space-room/  → 301 /space/
/forest-room/ → 301 /forest/

Unknown:
404

35. Apex Domain
Canonical domain:
https://mykidsnest.com/

Attach Worker custom domain to apex.
36. WWW Domain
Configure:
https://www.mykidsnest.com/

as redirect only.
Required:
www.mykidsnest.com/*
→ 301/308
→ mykidsnest.com/*

Preserve path and query.
Do NOT serve duplicate content on both.
37. HTTPS
Require:
HTTPS = ON

All canonical URLs use HTTPS.
HTTP must redirect to HTTPS if not already handled at edge.
38. Security Headers
Review and add:
X-Content-Type-Options: nosniff
Referrer-Policy
Permissions-Policy
Content-Security-Policy

CSP must allow:
self-hosted assets
WebGL
audio
canvas
required worker/static features

Do not break Space mission engine with over-restrictive CSP.
39. Caching
Versioned/static assets:
long cache
immutable where filenames are versioned

HTML:
short cache / revalidation

Do not cache HTML permanently.
40. SEO — Homepage
Title:
MyNest — Choose Your World

Description:
Explore Ocean, Space, and Forest rooms designed to turn a child's bedroom into a world of their own.

41. SEO — Ocean
Title:
Ocean Room | MyNest

Description:
Meet Milo in a responsive ocean room where digital life and a real bedroom come together.

42. SEO — Space
Title:
Space Room | MyNest

Description:
Launch a child’s own Command Pod and watch a quiet bedroom open into an interactive universe.

43. SEO — Forest
Title:
Forest Room | MyNest

Description:
Step into an enchanted meadow bedroom that shifts from sunny forest play to a calm starry night.

44. Canonicals
Set self-canonical:
/        → https://mykidsnest.com/
/ocean/  → https://mykidsnest.com/ocean/
/space/  → https://mykidsnest.com/space/
/forest/ → https://mykidsnest.com/forest/

Important:
Do NOT set cross-domain canonical to SpringOfZen in this workflow.
Do NOT modify SpringOfZen canonical behavior.
45. robots.txt
Create:
User-agent: *
Allow: /

Sitemap: https://mykidsnest.com/sitemap.xml

46. sitemap.xml
Initial sitemap:
https://mykidsnest.com/
https://mykidsnest.com/ocean/
https://mykidsnest.com/space/
https://mykidsnest.com/forest/

No asset URLs.
47. Structured Data
Homepage:
WebSite
Organization / Brand where appropriate

World pages:
WebPage

Do NOT add yet:
Product
Offer
InStock
AggregateRating
Review

because commerce facts are not yet established.
48. Consumer Copy Cleanup
Remove visible:
Prototype
v0.x
Room 001
SKU_OCEAN_
Room Gravity
engine state
test build
QA labels
pilot IDs

Keep product language human.
49. No Fake Commerce
Do NOT add:
Buy Now
price
stock
shipping
reviews
rating
sale

yet.
Allowed:
Explore Ocean
Meet Milo
Launch Space
Enter Forest

50. Header
Minimal.
Recommended:
MyNest
Worlds

Optional:
About

Do not build a large navigation bar.
51. Footer
Minimal:
MyNest
Ocean
Space
Forest
Privacy
©

Optional:
MyNest by Spring of Zen

Research link may point externally:
Research
→ SpringOfZen MyNest

52. Homepage Mobile
Use dedicated mobile assets.
Do NOT crop desktop blindly.
Required:
Ocean mobile hero
Space mobile hero
Forest mobile hero

World name + CTA must remain readable without blocking primary imagery.
53. Forest Hero Rule
Preferred hero uses:
soft meadow
princess bed
deer
mushroom lights
full-height forest window

Avoid muddy floor visuals.
54. Space Hero Rule
Prefer:
Command Pod
+
large-scale galaxy / Earth

Pod must remain identifiable.
The hero must communicate:
room → spacecraft

not:
generic galaxy wallpaper

55. Ocean Hero Rule
Use:
real room
+
Milo

Milo must be clearly identifiable.
Do not use generic ocean-only image.
56. Reduced Motion
Homepage:
autoplay OFF
fade only

when prefers-reduced-motion.
World pages must preserve existing reduced-motion behavior.
57. Accessibility
Homepage carousel must support:
keyboard
focus states
aria labels
current slide state
touch

CTA buttons remain accessible.
Decorative animation layers:
aria-hidden

58. Performance
Homepage must not initialize three heavy world engines.
Load order:
first hero
navigation
second hero
third hero

World engine loads only after route navigation.
Heavy Space assets load progressively.
59. Static Fallback
Ocean, Space, Forest should preserve current fallback behavior.
If advanced rendering fails:
show static scene
preserve navigation
avoid broken error UI

60. Browser Back Behavior
From a world route:
Back
→ homepage

Optional:
/?world=space

to restore selected slide.
Do not over-engineer.
61. Search Console
Search Console is non-blocking.
IF authenticated
THEN
    verify mykidsnest.com
    submit sitemap.

ELSE
    SEARCH_CONSOLE = BLOCKED_NO_AUTH

Do not substitute public search as proof of indexing.
62. Analytics
Do NOT add new analytics in v0.1.
If Cloudflare site analytics is automatically available:
document only

Otherwise:
ANALYTICS = HOLD

63. Local Build / Preview
Inspect project tooling.
Use appropriate local preview:
wrangler dev

or repo equivalent.
Verify:
/
 /ocean/
 /space/
 /forest/

before deployment.
64. Production Verification
After deploy:
https://mykidsnest.com/
https://mykidsnest.com/ocean/
https://mykidsnest.com/space/
https://mykidsnest.com/forest/

must return:
HTTP 200

www:
https://www.mykidsnest.com/

must redirect to:
https://mykidsnest.com/

65. Console QA
All core routes:
CONSOLE_ERRORS = 0

Review warnings.
Fatal WebGL errors are blockers for Space.
66. Standalone Runtime Audit
Search built output for:
springofzen.com
www.springofzen.com
/api/mynest/
/Volumes/
file://
localhost
127.0.0.1

Interpretation:
IF runtime dependency
THEN
    FAIL.

IF intentional footer/research link
THEN
    PASS.

67. Ocean QA
Verify:
Milo visible
fish interaction
Shell
Reef
Rest
night transition
Milo Return Home
mobile
reduced motion
fallback

68. Space QA
Verify:
Idle
Explore
Launch
Earth
Galaxy
interaction
Return
Sleep
mobile
reduced motion
fallback

69. Forest QA
Verify:
Play
Dream
Sleep
meadow floor
deer
mushroom lights
fireflies
window state
mobile
reduced motion
fallback

70. SpringOfZen Regression
Because of Frozen Boundary 02:
existing production must remain unchanged.
Smoke test:
https://www.springofzen.com/mynest/
https://www.springofzen.com/mynest/magic-room/
https://www.springofzen.com/mynest/space-room/
https://www.springofzen.com/mynest/forest-room/

Expected:
HTTP 200
functional
no redirect to MyKidsNest

71. Explicit Migration Protection Test
Verify:
SPRINGOFZEN_301_TO_MYKIDSNEST = NO
SPRINGOFZEN_CROSS_DOMAIN_CANONICAL = NO
SPRINGOFZEN_NOINDEX_ADDED = NO
SPRINGOFZEN_ROUTE_REMOVED = NO

Any YES is a workflow violation unless separately authorized.
72. Homepage Acceptance
FULLSCREEN_CAROUSEL = PASS/FAIL

OCEAN_SLIDE = PASS/FAIL
SPACE_SLIDE = PASS/FAIL
FOREST_SLIDE = PASS/FAIL

AUTO_ADVANCE = PASS/FAIL
TOUCH_SWIPE = PASS/FAIL
KEYBOARD = PASS/FAIL
REDUCED_MOTION = PASS/FAIL

OCEAN_ROUTE_FROM_HOME = PASS/FAIL
SPACE_ROUTE_FROM_HOME = PASS/FAIL
FOREST_ROUTE_FROM_HOME = PASS/FAIL

73. Standalone Acceptance
LOCAL_ASSETS = PASS/FAIL
LOCAL_JS = PASS/FAIL
LOCAL_CSS = PASS/FAIL
LOCAL_WORLD_RUNTIME = PASS/FAIL

SPRINGOFZEN_ASSET_HOTLINKS = 0
SPRINGOFZEN_JS_DEPENDENCIES = 0
SPRINGOFZEN_CSS_DEPENDENCIES = 0
SPRINGOFZEN_API_DEPENDENCIES = 0

Required:
STANDALONE_RUNTIME = PASS

74. Worker Acceptance
CLOUDFLARE_AUTH =
PASS/BLOCKED

CLOUDFLARE_ZONE =
PASS/BLOCKED

WORKER_CREATED =
PASS/FAIL/BLOCKED

WORKER_STATIC_ASSETS =
PASS/FAIL

APEX_CUSTOM_DOMAIN =
PASS/FAIL/BLOCKED

WWW_REDIRECT =
PASS/FAIL/BLOCKED

HTTPS =
PASS/FAIL

75. SEO Acceptance
ROBOTS =
PASS/FAIL

SITEMAP =
PASS/FAIL

CANONICALS =
PASS/FAIL

TITLES =
PASS/FAIL

META_DESCRIPTIONS =
PASS/FAIL

PREMATURE_COMMERCE_SCHEMA =
NO

76. Regression Acceptance
MYKIDSNEST_HOME =
PASS/FAIL

OCEAN =
PASS/FAIL

SPACE =
PASS/FAIL

FOREST =
PASS/FAIL

MOBILE =
PASS/FAIL

DESKTOP =
PASS/FAIL

CONSOLE_ERRORS =
0

SPRINGOFZEN_REGRESSION =
PASS/FAIL

77. Conditional Remediation Logic
IF homepage looks like a conventional startup site
THEN
    remove text/UI
    strengthen world-first carousel.

IF homepage is too heavy
THEN
    lazy-load second/third hero
    do not preload world engines.

IF Ocean requires SpringOfZen backend
THEN
    remove research dependency
    preserve consumer-only experience.

IF Space uses old absolute asset URLs
THEN
    rewrite to MyKidsNest-local paths.

IF Forest public page exposes A/B development controls
THEN
    remove them.

IF any SpringOfZen runtime dependency remains
THEN
    STANDALONE_RUNTIME = FAIL
    HOLD deployment.

IF SpringOfZen routes are accidentally redirected/changed
THEN
    revert immediately
    SPRINGOFZEN_REGRESSION = FAIL.

IF Cloudflare auth is unavailable
THEN
    complete local build
    return BLOCKED_CLOUDFLARE_AUTH.

IF Cloudflare zone is unavailable
THEN
    return BLOCKED_DOMAIN_ZONE.

IF one world is broken
THEN
    HOLD full launch.

78. Commit Discipline
Do not mix unrelated changes.
Suggested commits:
feat(mykidsnest): scaffold standalone worker site

feat(mykidsnest): build three-world carousel

feat(mykidsnest): migrate ocean space and forest locally

feat(mykidsnest): configure cloudflare domain and production qa

Squash only if repository convention requires.
79. Documentation
Create:
docs/mykidsnest/
MYKIDSNEST_STANDALONE_THREE_WORLDS_SITE_v0.1.md

docs/mykidsnest/
MYKIDSNEST_DEPLOYMENT_REPORT_v0.1.md

sites/mykidsnest/
ASSET_MANIFEST.md

Deployment report must distinguish:
LOCAL_BUILD =
PASS/FAIL

WORKER_DEPLOY =
PASS/FAIL/BLOCKED

DNS =
PASS/FAIL/BLOCKED

LIVE =
PASS/FAIL/BLOCKED

80. Hard Stop Conditions
Do NOT declare PASS if:
mykidsnest.com unresolved
Worker not attached to apex
www serves duplicate site
world assets hotlink SpringOfZen
SpringOfZen API is required
one world is broken
mobile carousel broken
fatal console errors exist
SpringOfZen routes changed
SpringOfZen redirects were added

81. Deployment Gate
Deploy only if:
STANDALONE_RUNTIME = PASS

HOME = PASS

OCEAN = PASS

SPACE = PASS

FOREST = PASS

MOBILE = PASS

DESKTOP = PASS

SPRINGOFZEN_REGRESSION = PASS

CONSOLE_ERRORS = 0

and:
CLOUDFLARE_AUTH = PASS
CLOUDFLARE_ZONE = PASS

Otherwise:
DEPLOYMENT =
HOLD / BLOCKED

82. Final Codex Output
Return exactly:
PROJECT =
MYKIDSNEST_STANDALONE_THREE_WORLDS_SITE_v0.1

SOURCE_BASELINE_SHA =
<sha>

NEW_SITE_ROOT =
<path>

DOMAIN =
https://mykidsnest.com/

FROZEN_BOUNDARY_01_STANDALONE =
PASS/FAIL

FROZEN_BOUNDARY_02_SPRINGOFZEN_UNCHANGED =
PASS/FAIL

CLOUDFLARE_AUTH =
PASS/BLOCKED

CLOUDFLARE_ZONE =
PASS/BLOCKED

WORKER =
mykidsnest-site

WORKER_DEPLOYMENT =
PASS/FAIL/BLOCKED

APEX_CUSTOM_DOMAIN =
PASS/FAIL/BLOCKED

WWW_REDIRECT =
PASS/FAIL/BLOCKED

HTTPS =
PASS/FAIL

HOME =
PASS/FAIL

FULLSCREEN_CAROUSEL =
PASS/FAIL

OCEAN_ROUTE =
https://mykidsnest.com/ocean/

OCEAN_MIGRATED =
PASS/FAIL

OCEAN_FUNCTIONAL =
PASS/FAIL

SPACE_ROUTE =
https://mykidsnest.com/space/

SPACE_MIGRATED =
PASS/FAIL

SPACE_FUNCTIONAL =
PASS/FAIL

FOREST_ROUTE =
https://mykidsnest.com/forest/

FOREST_MIGRATED =
PASS/FAIL

FOREST_FUNCTIONAL =
PASS/FAIL

STANDALONE_RUNTIME =
PASS/FAIL

SPRINGOFZEN_ASSET_HOTLINKS =
<number>

SPRINGOFZEN_JS_DEPENDENCIES =
<number>

SPRINGOFZEN_CSS_DEPENDENCIES =
<number>

SPRINGOFZEN_API_DEPENDENCIES =
<number>

SPRINGOFZEN_301_TO_MYKIDSNEST =
YES/NO

SPRINGOFZEN_CROSS_DOMAIN_CANONICAL =
YES/NO

SPRINGOFZEN_NOINDEX_ADDED =
YES/NO

SPRINGOFZEN_ROUTE_REMOVED =
YES/NO

SPRINGOFZEN_REGRESSION =
PASS/FAIL

ROBOTS =
PASS/FAIL

SITEMAP =
PASS/FAIL

CANONICALS =
PASS/FAIL

STRUCTURED_DATA =
PASS/FAIL

PREMATURE_COMMERCE_SCHEMA =
NO/YES

MOBILE =
PASS/FAIL

DESKTOP =
PASS/FAIL

REDUCED_MOTION =
PASS/FAIL

CONSOLE_ERRORS =
<number>

BACKEND_CHANGED =
NO/YES

PII_COLLECTION_ADDED =
NO/YES

TESTS =
<compact summary>

CHANGED_FILES =
<compact list>

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL/HOLD/BLOCKED

BLOCKERS =
<exact blockers or NONE>

NEXT_GATE =
<one highest-value next action>

83. FINAL FROZEN DOCTRINE
MyKidsNest must be a real independent product site, not a wrapper around SpringOfZen.

Every runtime asset required to experience Ocean, Space, or Forest must be owned and served by MyKidsNest.

SpringOfZen is not being migrated away in this workflow.

SpringOfZen remains intact until MyKidsNest is live, stable, independently verified, and a later migration decision is explicitly authorized.

The MyKidsNest homepage begins with a choice, not an explanation.

Ocean, Space, and Forest are the three primary products.

The three worlds together are the consumer experience.

Research remains on SpringOfZen.

Product experience moves to MyKidsNest.

Independence first.

Migration later.


这版可以直接作为正式冻结基线。两个关键判定以后只看这两个字段即可：

```text
FROZEN_BOUNDARY_01_STANDALONE = PASS
FROZEN_BOUNDARY_02_SPRINGOFZEN_UNCHANGED = PASS

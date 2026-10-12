# MYNEST_AUTHORITY_AGENT_COMMERCE_CONDITIONAL_EXECUTION_v0.2

## 0. Execution Mode

```text
PROJECT =
MYNEST_AUTHORITY_AGENT_COMMERCE_CONDITIONAL_EXECUTION_v0.2

TARGET =
https://www.springofzen.com/mynest/

MODE =
INSPECT → DECIDE → FIX → VERIFY

OBJECTIVE =
Use conditional execution.
Do not produce long diagnostic prose before fixing authorized issues.

PRINCIPLE =
IF current state is already correct
THEN retain it and move on.

IF an authorized defect is found
THEN fix it immediately and verify production.

IF the required fix exceeds this workflow
THEN report BLOCKED / NEEDS_AUTHORIZATION and continue with other independent checks.
```

---

# 1. Global Decision Logic

For every check:

```text
IF =
observed current state matches required state

THEN =
mark PASS
make no change
continue

ELSE IF =
defect is covered by this workflow

THEN =
fix immediately
test locally
deploy if needed
verify live production
mark PASS only after verification

ELSE =
mark BLOCKED_OR_OUT_OF_SCOPE
do not invent workaround
continue remaining independent checks
```

Never stop the whole workflow because one non-dependent check is blocked.

---

# 2. Baseline

Run:

```bash
git status --short
git rev-parse HEAD
```

Then:

```text
IF working tree is dirty
THEN
  inspect changes
  do not overwrite unrelated work
  preserve existing modifications
  record WORKTREE_DIRTY=YES
ELSE
  WORKTREE_DIRTY=NO
```

Freeze:

```text
BASELINE_SHA = <current HEAD>
```

---

# 3. Discover MyNest Sources

Locate:

```text
/mynest/
/mynest/magic-room/
/mynest/method/
/mynest/results/
/mynest/questions/
/mynest/room-check/
robots.txt
sitemap
JSON-LD generation
pilot-state code
```

Conditional:

```text
IF source location is known
THEN use it directly

ELSE
search repository once
record authoritative source paths
do not repeatedly rediscover them
```

---

# 4. Public URL Inventory

Build one canonical list from:

```text
repository routes
+
sitemap
+
internal links
```

For every URL record:

```text
HTTP
canonical
robots
sitemap
JSON-LD
title
description
```

Conditional:

```text
IF URL is intentionally public
THEN continue indexability checks

ELSE IF URL is internal/private/API
THEN exclude from public-authority audit

ELSE
flag UNKNOWN_INTENT
do not change until route purpose is established
```

---

# 5. HTTP

For each intended public canonical URL:

```text
IF final response = 200
THEN PASS

ELSE IF unnecessary redirect chain exists
THEN simplify redirect if safely authorized

ELSE IF 404/5xx
THEN repair route/deployment immediately

ELSE
record exact response
```

After repair:

```text
VERIFY LIVE
```

---

# 6. HTML Robots

Check:

```text
<meta name="robots">
```

Logic:

```text
IF authority page contains noindex/nofollow unintentionally
THEN remove restriction
deploy
verify raw production HTML

ELSE IF restriction is explicitly intentional
THEN retain and document reason

ELSE
PASS
```

Authority pages include:

```text
/mynest/
/mynest/method/
/mynest/results/
approved question pages
```

---

# 7. X-Robots-Tag

Check HTTP headers.

```text
IF X-Robots-Tag:noindex exists on intended public page
THEN remove at origin/Worker/header config
deploy
verify

ELSE
PASS
```

Do not assume HTML meta check covers headers.

---

# 8. robots.txt

```text
IF robots.txt blocks intended MyNest authority pages
THEN remove only the conflicting rule
retain API/private protections
verify live robots.txt

ELSE
PASS
```

Do not broadly open:

```text
/api/
admin
private data
```

---

# 9. Sitemap

```text
IF intended canonical authority URL is missing
THEN add it to sitemap
deploy
verify live sitemap

IF sitemap contains dead/noncanonical URLs
THEN remove or replace with canonical URL

IF URL is intentionally non-indexable
THEN do not add merely for completeness

ELSE
PASS
```

---

# 10. Canonical

For each indexable page:

```text
IF canonical is missing
THEN add self-referencing canonical

ELSE IF canonical points to wrong page
THEN correct it

ELSE IF several unique question pages canonicalize to one parent
THEN fix each to self-canonical

ELSE
PASS
```

Then verify live source.

---

# 11. Title / Description

```text
IF title is missing
THEN create topic-specific title

IF description is missing
THEN add concise page-specific description

IF multiple authority pages have effectively duplicate titles/descriptions
THEN differentiate according to actual question/method/result intent

ELSE
retain current text
```

Do not rewrite already adequate metadata for stylistic reasons.

---

# 12. Raw-HTML Authority Content

Fetch without browser JS.

```text
IF Method / Results / Question core text exists in raw HTML
THEN PASS

ELSE IF core content is JS-only
THEN render critical authority text statically / server-side / prebuilt

ELSE
PASS
```

Magic Room exception:

```text
IF interactive scene requires JS
THEN allowed

BUT
IF Magic Room is intended as authority/search page
THEN below-fold explanatory content must still exist in raw HTML
```

---

# 13. QAPage

Search all JSON-LD.

```text
IF QAPage exists
AND users cannot submit alternative answers
THEN
  remove QAPage
  replace only with schema semantically supported by actual content
  likely:
    WebPage
    Article if article semantics are real
    BreadcrumbList
    Organization

ELSE IF QAPage supports genuine multi-answer user submissions
THEN retain

ELSE
PASS
```

Do not replace `QAPage` mechanically with `FAQPage`.

---

# 14. FAQPage

```text
IF FAQPage exists
AND page genuinely contains a question/answer collection
THEN retain if semantically correct

ELSE
remove inappropriate FAQ schema
retain visible content
```

Do not optimize only for rich-result eligibility.

---

# 15. Product / Offer Schema

Current state:

```text
PRODUCT_COMMERCIAL_STATUS =
PROTOTYPE
```

Therefore:

```text
IF Product schema only describes prototype identity without false commerce facts
THEN inspect semantic accuracy

IF Offer / InStock / price / shipping / aggregateRating exists
AND those facts are not real
THEN remove them immediately

IF product is not purchasable
THEN do not generate Offer
```

Future:

```text
IF real commerce later becomes available
THEN Product + Offer may be added from verified facts
```

---

# 16. Brand Entity

Preferred relationship:

```text
PRODUCT_METHOD =
MyNest

PUBLISHER =
Spring of Zen

PUBLIC_RELATION =
MyNest by Spring of Zen
```

Logic:

```text
IF JSON-LD / metadata / headings create conflicting entity identities
THEN normalize them to the above relation

ELSE
retain

IF renaming would break historical URLs
THEN keep URLs and fix entity declarations only
```

---

# 17. Method Canonical Definition

Inspect `/mynest/method/`.

Required:

```text
definition
age range
who it is for
who it is not for
steps
F01–F06
one-change rule
child-choice rule
14-day observation
evidence status
limitations
version
last material update
```

Logic:

```text
IF all are explicit and clear
THEN PASS

ELSE
add only missing sections
do not rewrite the whole Method page
```

Opening definition should answer:

```text
What is MyNest?
```

within first meaningful paragraph.

---

# 18. Results → Evidence Registry

Inspect `/mynest/results/`.

Required state:

```text
cohort status
protocol version
families enrolled
families completed
public cases
observation checkpoints
current evidence limitation
last updated
```

Logic:

```text
IF value is zero
THEN display 0

IF value is unknown
THEN display NOT_ESTABLISHED where appropriate

IF field is absent
THEN add it

IF pilot evidence remains insufficient
THEN preserve that statement prominently

NEVER
hide zero
invent data
convert test records into evidence
```

---

# 19. Outcome Definitions

Canonicalize:

```text
OWN_ROOM_ATTEMPT
FULL_OWN_ROOM_NIGHT
PARTIAL_OWN_ROOM_NIGHT
VOLUNTARY_ROOM_ENTRY
RETURN_DESIRE
ROOM_GRAVITY
```

Logic:

```text
IF same term has multiple definitions
THEN
  identify current production behavior
  choose one canonical definition based on existing frozen method
  update inconsistent copies
  document change

ELSE
PASS
```

Do not silently alter historical evidence.

---

# 20. Attempts vs Full Nights

```text
IF UI can show:
  "0 own-room nights"
while also showing:
  "part of the night"

THEN
replace summary with separate counters:
  Full nights
  Attempts
  Partial nights where appropriate

ELSE
PASS
```

Example:

```text
Full own-room nights: 0
Own-room attempts: 2
Partial nights: 1
```

Do not count partial night as full night.

---

# 21. Local Storage Warning

Determine actual persistence.

```text
IF pilot progress exists only on current browser/device
THEN show clearly:

"Progress is stored on this device. Clearing browser data or switching devices may remove it."

AND
make progress-copy/export visible

ELSE IF backend persistence exists
THEN describe actual behavior accurately
```

Do not claim sync unless sync exists.

---

# 22. Start New Experiment

```text
IF starting a new experiment destroys/replaces current state
THEN require confirmation:

"This will replace your current plan on this device."

Offer:
  Copy summary
  Start new
  Cancel

ELSE
PASS
```

If old history already exists:

```text
THEN do not add unnecessary confirmation that misrepresents behavior
```

---

# 23. Progress Export

```text
IF Copy progress summary exists and works desktop + mobile
THEN PASS

ELSE IF function exists but is visually buried
THEN increase visibility near destructive/new-plan actions

ELSE
implement simple copy/export using existing local state
```

No PII may be added.

---

# 24. Calendar Reminder

```text
IF .ics reminder already exists
THEN verify Day1/3/7/14 dates and downloads

ELSE
generate local .ics events for:
  Day 1
  Day 3
  Day 7
  Day 14
```

Rules:

```text
NO account
NO email capture
NO backend change
NO contact data
```

If pilot start date is unknown:

```text
THEN generate after start date becomes known
```

---

# 25. Optional Night Log

```text
IF optional quick-night log already exists
THEN retain

ELSE
add only if implementation can reuse current privacy-safe structured state
```

Choices:

```text
Own room all night
Part of the night
Entered but slept elsewhere
Parents' room
No attempt
```

Rule:

```text
OPTIONAL = YES
```

Do not turn it into mandatory daily compliance.

---

# 26. Pilot Signal

```text
IF current Pilot Signal is static regardless of answers
THEN make it data-dependent

IF Day1 only
THEN acknowledge attempt only

IF more voluntary entry but no full-night change
THEN say:
"Room entry is becoming easier, but full-night sleep has not clearly changed."

IF no clear change by Day7
THEN say:
"We have not seen a clear change yet."

IF Day14 complete
THEN say:
"This observation period is complete enough to review."

IF worse
THEN surface safety / not-right-fit guidance
```

Never say:

```text
on track
likely to succeed
predicts success
```

without evidence.

---

# 27. Safety Escalation

At Day7/14:

```text
IF outcome = NO_PROGRESS or WORSE
THEN show visible boundary box

IF user-reported structured data contains relevant warning condition
THEN prioritize professional-care guidance

ELSE
keep normal low-key safety link
```

Do not diagnose.

Do not add new health data collection merely for this feature.

---

# 28. Not-the-Right-Fit

```text
IF a complete canonical section/page already exists
THEN link it clearly from Method and no-progress states

ELSE
create /mynest/not-the-right-fit/
```

Cover only bounded categories:

```text
breathing concerns
significant pain
severe distress
persistent disruptive nightmares/night terrors
strong daytime fear
major developmental/medical concerns
unsafe room conditions
```

Use calm referral language.

---

# 29. Day-14 Demand Capture

```text
IF Day14 already captures structured "what next?" demand
THEN retain

ELSE
add:
"What would help next?"
```

Options:

```text
Softer light
Story or sound
Room friend
More interactive room
Nothing — we're fine
Not sure
```

Rule:

```text
IF user chooses an option
THEN store only through existing privacy-approved structured mechanism

IF backend/schema change would be required
THEN do NOT change backend in this workflow
store locally or mark BLOCKED_BACKEND_AUTH_REQUIRED
```

---

# 30. Question Pages

For every published question page:

```text
IF first 2–4 sentences answer the question directly
THEN PASS

ELSE
move/create concise direct answer at top
```

Then check:

```text
IF Method link missing
THEN add

IF Results/Evidence link missing
THEN add

IF relevant safety boundary missing
THEN add short boundary

IF content is unsupported filler
THEN remove rather than expand
```

---

# 31. New Question Pages

Do NOT mass-publish.

```text
IF a new question is supported by:
  Reddit demand
  pilot demand
  search evidence
THEN candidate for publication

ELSE
do not create
```

Priority only when supported:

```text
What age should a child move to their own room?
What if nothing changes after 7–14 days?
What if the family recently moved?
What if there is a new baby?
What if siblings share a room?
When is a night light useful?
```

---

# 32. Internal Links

```text
IF authority page is orphaned
THEN add one or more natural inbound links

IF Question page lacks Method/Results path
THEN add

IF Magic Room is linked from every informational page without relevance
THEN reduce unnecessary promotional links
```

Do not create artificial link density.

---

# 33. Broken Links

```text
IF internal link returns 404
THEN fix/remove

IF local path appears publicly:
/Volumes/
/Users/
localhost
127.0.0.1
file://
THEN remove immediately

ELSE
PASS
```

---

# 34. Privacy

Run existing 22/22 suite.

```text
IF regression count > 0
THEN STOP DEPLOYMENT
fix privacy regression first

IF new feature requests:
  name
  email
  phone
  face
  photo
  video
  voice
  free text
  exact address
THEN reject implementation unless separately authorized

ELSE
PASS
```

---

# 35. Production Evidence Contamination

Inspect `mynest_magic_room_events` and related pilot data.

```text
IF synthetic/test records are absent
THEN PASS

IF synthetic/test records exist but are clearly flagged and excluded
THEN document

IF synthetic/test records contaminate public evidence counts
THEN exclude them from public evidence immediately
```

Do not delete data without authorization if deletion is unnecessary.

---

# 36. Expert Reviewer

```text
IF named qualified reviewer already exists
THEN verify:
  name
  credentials
  scope
  date
  compensation/conflict disclosure

ELSE
mark:
NAMED_EXPERT_REVIEWER = NO
```

Do NOT fabricate reviewer.

Do NOT perform external outreach in this workflow unless separately authorized.

---

# 37. Product Substitutability

Evaluate:

```text
Milo Plush
Shell Light
Reef Accent
Ocean Room Set
```

For each:

```text
IF generic replacement preserves full experience
THEN SUBSTITUTABILITY = HIGH

IF generic replacement loses only branding
THEN SUBSTITUTABILITY = MEDIUM_HIGH

IF generic replacement loses digital interaction / identity / ritual
THEN SUBSTITUTABILITY = LOW
```

Recommended action:

```text
IF Milo Plush is highly substitutable
THEN strengthen digital identity + return-home relationship

IF Shell Light is commodity
THEN accept commodity role unless integration creates meaningful system value

IF Reef Accent is commodity
THEN keep as optional interaction anchor, not moat

IF Ocean Room Set combines proprietary software + Milo + ritual + mapping
THEN treat system as primary commercial product
```

Do NOT create new SKU in this workflow.

---

# 38. Consumer/Internal Vocabulary

```text
IF public consumer page contains:
  SKU_OCEAN_
  P0/P1
  L0/L1
  ROOM_GRAVITY
  engine-state jargon

THEN replace with consumer language
unless located inside Method / Testing disclosure
```

Examples:

```text
Milo Plush
Shell Light
Reef Accent
Does the child want to come back?
```

---

# 39. Prototype Commerce

```text
IF product cannot currently be purchased
THEN public status must not imply:
  in stock
  available now
  shipping now
  customer reviews
  price certainty

IF page needs status
THEN use:
  Prototype
  Pilot
  Not yet for sale
```

---

# 40. Search Console

```text
IF authenticated Search Console access is available
THEN inspect:
  sitemap
  indexed/not-indexed
  Google-selected canonical
  URL Inspection
  last crawl

ELSE
SEARCH_CONSOLE = BLOCKED_NO_AUTH
```

Important:

```text
IF BLOCKED_NO_AUTH
THEN continue all repository/public-HTTP checks
DO NOT substitute site: search as proof of indexing
```

---

# 41. Public Search Reality Check

Supplementary only.

```text
IF pages appear in public search
THEN SEARCH_DISCOVERY = OBSERVED

ELSE
SEARCH_DISCOVERY = NOT_OBSERVED
```

This does not equal:

```text
INDEXED = NO
```

unless Search Console confirms.

---

# 42. AI Citation Readiness

Score Method, Results and core Question pages.

For each page:

```text
IF raw HTML clearly contains:
  definition
  audience
  method
  limitations
  evidence status
  publisher
  date/version
THEN score 3

IF most exists but some is ambiguous
THEN score 2

IF difficult to extract
THEN score 1

IF absent
THEN score 0
```

Targets:

```text
Method >= 3
Results >= 3
Core questions >= 2
```

---

# 43. Product Fact Matrix

Create files now, but never invent values.

Fields:

```text
dimensions
weight
materials
age guidance
safety testing
certifications
care
origin
compatibility
digital dependency
price
availability
shipping
returns
warranty
```

Logic:

```text
IF verified value exists
THEN record it

ELSE
record NOT_ESTABLISHED
```

Do not publish incomplete matrix as final product specifications.

---

# 44. Product Feed / API / MCP

```text
IF:
  real product exists
  verified price exists
  availability exists
  purchase path exists

THEN later prepare:
  Product schema
  Offer
  Merchant feed
  public catalog API

ELSE
DO NOT BUILD
```

Current expected:

```text
AGENT_COMMERCE_READY = NO
```

This is not a failure.

---

# 45. Performance

Run current performance checks.

```text
IF severe LCP/CLS/JS regression exists
THEN fix regression

ELSE
do not redesign Magic Room merely to optimize benchmark score
```

Authority pages should remain fast and text-accessible.

Magic Room may prioritize experience within reasonable limits.

---

# 46. Accessibility

```text
IF heading hierarchy invalid
THEN fix

IF meaningful image lacks alt
THEN add accurate alt

IF image is purely decorative
THEN mark decorative

IF button has no accessible label
THEN fix

IF keyboard cannot access required control
THEN fix

IF reduced-motion breaks core experience
THEN fix
```

---

# 47. Freshness

For Method / Results / Question pages:

```text
IF truthful material modification date exists
THEN expose dateModified

IF original publication date known
THEN expose datePublished

IF build merely changed assets/minification
THEN do NOT artificially bump editorial date
```

---

# 48. Changelog

```text
IF method versioning already exists
THEN ensure material changes are logged

ELSE
create a small changelog only from verifiable Git history
```

Never invent historical versions.

---

# 49. Fix Order

Execute strictly:

```text
P0-1 privacy/safety
P0-2 broken routes/index blocking
P0-3 canonical/robots/sitemap
P0-4 structured-data semantic errors
P0-5 unsupported claims / premature commerce
P0-6 production evidence contamination

THEN

P1-1 canonical Method definition
P1-2 Evidence Registry
P1-3 metric definitions
P1-4 attempts vs full nights
P1-5 progress-loss protection
P1-6 ICS reminders
P1-7 dynamic pilot signal
P1-8 safety escalation
P1-9 Day14 structured demand

THEN

P2 report only unless trivial:
expert reviewer
external citations
future catalog/API
additional answer pages
```

---

# 50. Deployment Logic

```text
IF no files changed
THEN
  DEPLOYMENT = NOT_REQUIRED

IF files changed only in docs not published
THEN
  deploy only if repository workflow requires it

IF production files changed
THEN
  run full tests
  deploy
  verify live

IF privacy/backend/search regression fails
THEN
  DO NOT declare deployment PASS
```

---

# 51. Verification Logic

After every implemented batch:

```text
IF local test passes
BUT live production not verified
THEN status = NOT_VERIFIED

IF live production matches intended state
THEN PASS

IF live differs
THEN investigate deployment/cache/source mismatch
```

---

# 52. Stop Conditions

Stop only the affected branch, not unrelated checks.

```text
IF Search Console auth unavailable
THEN block Search Console branch only

IF expert unavailable
THEN block reviewer branch only

IF product facts not yet established
THEN mark NOT_ESTABLISHED and do not invent

IF backend schema change becomes necessary
THEN stop that feature and report:
BACKEND_AUTH_REQUIRED

IF new PII collection becomes necessary
THEN stop feature
```

---

# 53. Token-Efficiency Rule

Codex must NOT narrate every inspection step.

During execution:

```text
DO:
inspect
decide
fix
verify
```

Final report contains only:

```text
what was wrong
what changed
what remained blocked
test result
commit
deployment
next gate
```

Do not output long prose for PASS items.

---

# 54. Final Report Format

```text
PROJECT =
MYNEST_AUTHORITY_AGENT_COMMERCE_CONDITIONAL_EXECUTION_v0.2

BASELINE_SHA =
<sha>

P0_FOUND =
<number>

P0_FIXED =
<number>

P0_BLOCKED =
<number>

P1_FOUND =
<number>

P1_FIXED =
<number>

INDEXABILITY =
PASS/FAIL/BLOCKED

ROBOTS =
PASS/FAIL

SITEMAP =
PASS/FAIL

CANONICALS =
PASS/FAIL

QAPAGE_MISUSE =
YES/NO

QAPAGE_ACTION =
NONE/REMOVED/CORRECTED

PREMATURE_COMMERCE_SCHEMA =
YES/NO

METHOD_CANONICAL =
PASS/FAIL

EVIDENCE_REGISTRY =
PASS/PARTIAL/FAIL

OUTCOME_DEFINITIONS =
PASS/FAIL

ATTEMPTS_VS_FULL_NIGHTS =
PASS/FAIL

PROGRESS_LOSS_WARNING =
PASS/FAIL

NEW_EXPERIMENT_GUARD =
PASS/FAIL

ICS_REMINDERS =
PASS/FAIL

PILOT_SIGNAL =
STATIC/DYNAMIC

SAFETY_ESCALATION =
PASS/PARTIAL/FAIL

DAY14_DEMAND_CAPTURE =
PASS/FAIL/BLOCKED_BACKEND_AUTH_REQUIRED

SEARCH_CONSOLE =
PASS/FAIL/BLOCKED_NO_AUTH

AI_CITATION_READINESS =
<Method>/<Results>/<Questions>

NAMED_EXPERT_REVIEWER =
YES/NO

REAL_COMPLETED_FAMILIES =
<number>

PUBLIC_REAL_CASES =
<number>

SYNTHETIC_CONTAMINATION =
YES/NO

PRODUCT_SUBSTITUTABILITY =
MILO=<HIGH/MEDIUM/LOW>
SHELL=<HIGH/MEDIUM/LOW>
REEF=<HIGH/MEDIUM/LOW>
OCEAN_ROOM_SET=<HIGH/MEDIUM/LOW>

AGENT_COMMERCE_READY =
NO/YES

BACKEND_CHANGED =
NO/YES

PRIVACY_REGRESSION =
PASS/FAIL

NEW_REGRESSION_COUNT =
<number>

CHANGED_FILES =
<compact list>

TESTS =
<compact summary>

COMMIT =
<sha or NONE>

DEPLOYMENT =
PASS/FAIL/NOT_REQUIRED

BLOCKERS =
<compact list>

NEXT_GATE =
<one single highest-value next action>
```

---

# 55. Final Rule

```text
IF there is a verified problem
THEN fix it.

IF there is no verified problem
THEN do not touch it.

IF evidence is missing
THEN say NOT_ESTABLISHED.

IF access is missing
THEN say BLOCKED.

IF the product does not yet exist
THEN do not simulate commerce readiness.

IF a feature requires new privacy or backend scope
THEN stop that branch and request authorization.

IF P0 is clean
THEN move immediately to P1.

IF P1 is complete
THEN next gate = REAL PILOT EVIDENCE.
```
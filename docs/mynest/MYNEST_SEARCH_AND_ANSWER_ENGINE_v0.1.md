# MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1

## 0. Project

```text
PROJECT =
MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1

PARENT_PROJECT =
MYNEST_ROOM_TRANSITION_PILOT_v0.1

PARENT_BRAND =
SPRING OF ZEN

PUBLIC_ENTRY =
https://www.springofzen.com/mynest/

CORE_CATEGORY =
OWN-ROOM TRANSITION

PRIMARY_AGE =
2.5–6 YEARS

PRIMARY_CONVERSION =
ROOM CHECK → CHILD CHOICE → PILOT

OPERATING_PRINCIPLE =
REAL QUESTION → USEFUL ANSWER → IMMEDIATE CHOICE → OBSERVED OUTCOME
```

---

# 1. Strategic Objective

The goal is not to make SpringOfZen rank for generic:

```text
kids room
children furniture
night light
toys
```

The goal is to establish MyNest / SpringOfZen as a durable internet anchor for:

> **Why won't my child sleep in their own room, and what should I try first?**

The system must progressively own the complete path:

```text
REAL PARENT QUESTION
        ↓
SEARCHABLE ANSWER
        ↓
ROOM TRANSITION CHECK
        ↓
ONE CHILD CHOICE
        ↓
14-DAY PILOT
        ↓
OBSERVED RESULT
        ↓
PUBLIC EVIDENCE
        ↓
STRONGER ANSWER
```

This is an **Answer Engine**, not a blog farm.

---

# 2. Current Production Baseline

Existing live MyNest page already implements:

```text
Step 1 — Parent Check-in
Step 2 — Child Choice
Step 3 — Tailored Plan
Step 4 — First Night
Step 5 — Day 1 / 3 / 7 / 14
```

Do not duplicate this flow.

Search pages must route visitors into this existing conversion engine.

Current live Child Choice must be revised before scale.

REMOVE as the primary choice model:

```text
SPACE
FOREST
OCEAN
```

REPLACE WITH:

```text
LIGHT
STORY_OR_SOUND
ROOM_FRIEND
```

Optional theme may remain as a later visual preference, but must not be the primary pilot variable.

---

# 3. Frozen Child Choice Model

## CHOICE_01 — LIGHT

User-facing label:

```text
Choose a light
```

Examples:

```text
soft moon light
star light
warm wall light
low bedside glow
```

Child chooses style.

Parent/system controls:

```text
brightness
placement
color temperature
flashing
electrical safety
usage period
```

---

## CHOICE_02 — STORY_OR_SOUND

User-facing label:

```text
Choose what you want to hear
```

Examples:

```text
bedtime story
parent-recorded story
soft music
rain
ocean
silence
```

Do not claim therapeutic effect.

---

## CHOICE_03 — ROOM_FRIEND

User-facing label:

```text
Choose who stays in your room
```

Examples:

```text
bear
rabbit
whale
astronaut
dinosaur
```

This is technically a toy / comfort object category.

Public language should use:

```text
ROOM FRIEND
```

instead of:

```text
TOY
```

because the behavioral role is companionship / ownership, not retail toy shopping.

---

# 4. First Principle of Search

Agent must search for **problems**, not products.

Allowed search universe:

```text
child won't sleep alone
child refuses own room
toddler refuses own bedroom
child afraid to sleep alone
child afraid of dark bedtime
child keeps coming to parents bed
parent must stay until child sleeps
co-sleeping to own room
child has own room but won't sleep there
child sleeps alone elsewhere but not at home
```

Chinese:

```text
孩子不肯分房睡
孩子不肯自己睡
孩子晚上跑回父母房
孩子怕黑不敢自己睡
4岁还要陪睡
5岁还跟妈妈睡
有儿童房但孩子不睡
孩子一定要父母陪着睡
分床分房怎么过渡
儿童房装修好了还是不肯睡
```

Do not begin with:

```text
best night light
best plush toy
kids bedroom products
```

Those are intervention searches and come later.

---

# 5. Demand Radar Agent

Create:

```text
MYNEST_DEMAND_RADAR
```

Run daily.

Target:

```text
20 NEW QUALIFIED PUBLIC PROBLEM EXPRESSIONS / DAY
```

Search platforms:

```text
Google
Reddit
Quora
YouTube
TikTok public content
Xiaohongshu public content where accessible
parenting forums
public Facebook discussions where accessible
```

Do not scrape private groups or private profiles.

---

# 6. Problem Record

Every discovered question becomes one structured record.

```yaml
problem_id:
source:
source_url:
published_at:
language:
country_if_known:
child_age_if_known:
raw_question:
normalized_question:
primary_problem_code:
secondary_problem_code:
transition_intent:
urgency:
commercial_intent:
existing_solution:
failed_solution:
answer_page_candidate:
```

Do not collect:

```text
real parent name
email
phone
private account ID
child name
address
```

---

# 7. Problem Classification

Use current frozen taxonomy:

```text
F01 DARKNESS_FEAR
F02 SEPARATION_DEPENDENCY
F03 LOW_ROOM_OWNERSHIP
F04 ENVIRONMENT_FRICTION
F05 TRANSITION_ROUTINE
F06 UNCLEAR_OR_NON_ROOM_CAUSE
```

Every problem must have:

```text
PRIMARY_CLASS
```

Optional:

```text
SECONDARY_CLASS
```

If unclear:

```text
F06
```

Do not force a room explanation when none is supported.

---

# 8. Question Canonicalization

Many parents ask the same underlying question differently.

Example:

```text
My 4 year old won't sleep alone
My daughter refuses her own bed
Why does my child keep coming back to us?
My son has his own room but won't use it
```

Agent must cluster them into canonical questions.

Example:

```text
CANONICAL_QUESTION =
Why won't my child sleep in their own room?
```

Keep raw wording as demand evidence.

Do not create one page per wording variant.

---

# 9. Topic Map v0.1

Create:

```text
/mynest/questions/
```

or equivalent site structure.

Initial 20 canonical pages:

```text
01 child-wont-sleep-alone
02 child-refuses-own-room
03 toddler-refuses-own-room
04 child-afraid-to-sleep-alone
05 child-afraid-of-dark-at-bedtime
06 child-keeps-coming-to-parents-bed
07 parent-must-stay-until-child-sleeps
08 transition-from-cosleeping-to-own-room
09 child-has-own-room-but-wont-sleep-there
10 child-sleeps-alone-elsewhere-but-not-home
11 three-year-old-wont-sleep-alone
12 four-year-old-wont-sleep-alone
13 five-year-old-still-sleeps-with-parents
14 how-to-make-child-like-own-room
15 first-night-in-own-room
16 should-child-choose-bedroom-items
17 night-light-for-child-afraid-of-dark
18 bedtime-story-for-sleeping-alone
19 comfort-object-for-sleeping-alone
20 how-long-does-own-room-transition-take
```

Do not publish all 20 automatically.

Publish in priority order based on actual demand evidence.

---

# 10. Answer Page Template

Every answer page must answer one real question.

Structure:

## A. Question

Exact natural-language question.

Example:

```text
Why won't my 4-year-old sleep in their own room?
```

---

## B. Short Answer

50–120 words.

Must answer immediately.

Example structure:

```text
A child may resist their own room because of darkness,
separation, lack of ownership, room discomfort, or an
unpredictable bedtime transition.

The first useful step is not redesigning the room.
Identify when resistance begins.
```

No keyword stuffing.

---

## C. What To Check First

Use 3–5 observable questions.

Example:

```text
Does resistance start before entering?
Only when lights go out?
Only when the parent leaves?
Only after waking later?
Does the child actively dislike something in the room?
```

---

## D. Possible Barriers

Map to:

```text
F01–F06
```

Use public-readable language.

Do not expose unnecessary internal system jargon.

---

## E. What Not To Change Yet

Examples:

```text
Do not redesign the entire room.
Do not buy several products at once.
Do not change bed, lighting, routine, and toys simultaneously.
```

---

## F. One First Experiment

Offer ONE next move.

Examples:

```text
LIGHT
STORY_OR_SOUND
ROOM_FRIEND
ROUTINE_ONLY
NO_ROOM_INTERVENTION
```

---

## G. Immediate Choice

CTA:

```text
Find the biggest barrier
```

→ MyNest Room Check

or:

```text
Let your child choose one thing
```

→ Child Choice flow

---

## H. What MyNest Has Observed

Initially:

```text
Pilot data not yet sufficient.
```

Later replace with aggregated results.

Never fabricate sample results.

---

## I. When Room Changes May Not Be Enough

Include scope boundary.

Examples:

```text
pain
breathing problems
persistent nightmares
major life change
severe distress
safety concern
```

Refer to appropriate qualified professional.

---

## J. Last Updated

Real date only when materially updated.

Do not artificially change dates for SEO.

---

# 11. People-First Rule

Google currently explicitly recommends people-first content and warns against mass-producing automated pages merely to gain search traffic. It values original information, first-hand experience, usefulness, and clear site purpose.

Therefore:

```text
NO:
1000 auto-generated pages
rewritten competitor articles
generic AI summaries
keyword stuffing
fake author personas
fake expert quotes
```

Allowed:

```text
Agent discovers
Agent clusters
Agent drafts
Human/system validates
Pilot evidence improves
Page updates
```

Every published page must contribute at least one of:

```text
original problem taxonomy
interactive Room Check
original choice architecture
pilot outcome data
original decision logic
clearer stop point
```

---

# 12. Answer Engine Publishing Gate

A candidate page can be published only if:

```yaml
real_demand_examples: ">=3"
canonical_question_defined: true
duplicate_page: false
F01_F06_mapping_complete: true
first_experiment_defined: true
scope_boundary_present: true
CTA_exists: true
```

If not:

```text
STATUS = HOLD
```

---

# 13. Priority Score

Assign each canonical question:

```text
PRIORITY_SCORE =
DEMAND_FREQUENCY
× TRANSITION_INTENT
× PILOT_RELEVANCE
× ANSWERABILITY
```

Use simple 1–5 values.

Example:

```yaml
question: child refuses own room
demand_frequency: 5
transition_intent: 5
pilot_relevance: 5
answerability: 5
score: 625
```

Publish highest-priority questions first.

This is not a Google ranking score.

It is internal publishing priority.

---

# 14. Page-to-Conversion Mapping

Every page must route to exactly one primary CTA.

Examples:

### Fear/darkness query

```text
Question
↓
F01 explanation
↓
Room Check
↓
LIGHT
```

### Separation query

```text
Question
↓
F02 explanation
↓
Room Check
↓
STORY_OR_SOUND or non-room transition plan
```

### Ownership query

```text
Question
↓
F03 explanation
↓
Room Check
↓
ROOM_FRIEND / approved child choice
```

Do not show all products on every page.

---

# 15. SEO Architecture

Recommended structure:

```text
/mynest/
    /questions/
    /method/
    /results/
    /pilot/
```

Examples:

```text
/mynest/questions/child-wont-sleep-alone/
/mynest/questions/child-afraid-of-dark/
/mynest/questions/cosleeping-to-own-room/
```

Do not create multiple URL variants for the same question.

---

# 16. Canonical URLs

Every question page must have:

```html
<link rel="canonical" href="...">
```

Use one canonical URL per topic.

Avoid duplicate versions caused by:

```text
.html
trailing slash variants
UTM parameters
language aliases
```

Google treats canonical URLs as signals for which duplicate or near-duplicate page should be treated as primary.

---

# 17. Titles

Pattern:

```text
<Parent question> | MyNest by Spring of Zen
```

Examples:

```text
Why Won't My Child Sleep Alone? | MyNest by Spring of Zen
```

```text
孩子为什么不肯自己睡？| MyNest
```

No clickbait.

No:

```text
7 SHOCKING REASONS
```

---

# 18. Meta Description

Describe:

```text
problem
first decision
interactive solution
```

Example:

```text
Your child may be resisting darkness, separation,
the room itself, or the transition routine.
Use the 2-minute MyNest Room Check before changing
the whole bedroom.
```

---

# 19. Internal Linking

Every answer page links to:

```text
Room Check
related question 1
related question 2
Method
Results
```

The main MyNest page links back to the strongest question pages.

Structure:

```text
QUESTION HUB
   ↕
QUESTION PAGE
   ↕
ROOM CHECK
   ↕
RESULT / PILOT
```

---

# 20. Structured Data

Use structured data only where it accurately represents visible content.

For article-like answer pages:

```text
Article / BlogPosting
```

For genuine single-question pages with actual displayed answers, evaluate:

```text
QAPage
```

Google supports QAPage structured data for pages centered on one question and its answers, but markup must reflect actual visible content.

Do not mark ordinary editorial content as fake community Q&A.

Use:

```text
Organization
Article
BreadcrumbList
```

where appropriate.

---

# 21. Author / Method Transparency

Because this touches child well-being, trust matters.

Every informational page should clearly show:

```text
Published by:
MyNest / Spring of Zen

Method:
Room-transition decision framework

Scope:
Environmental and behavioral transition planning,
not medical treatment.
```

Where external factual claims are made:

```text
cite primary / reputable sources
```

Do not invent experts.

Google explicitly recommends clarity around who created content, how it was created, and why it exists.

---

# 22. Sitemap

Create/update:

```text
/sitemap.xml
```

Include only canonical public pages.

Include:

```text
/mynest/
/mynest/questions/...
/mynest/method/
/mynest/results/
```

Exclude:

```text
temporary test pages
session URLs
pilot IDs
private result URLs
UTM URLs
```

---

# 23. Search Console

Required:

```text
verify springofzen.com
submit sitemap
inspect /mynest/
inspect first 5 question pages
monitor indexing
monitor queries
monitor CTR
monitor coverage
```

Do not judge success from ranking after a few days.

Record indexing separately from traffic.

---

# 24. AEO / AI Answer Readiness

Every answer page should contain a compact machine-readable conceptual structure:

```yaml
question:
short_answer:
age_range:
possible_barriers:
what_to_check_first:
first_experiment:
what_not_to_change:
when_room_change_may_not_help:
pilot_evidence_status:
last_updated:
```

This structure should be reflected in visible HTML, not hidden spam fields.

Goal:

```text
Google understands it
AI systems can cite it
humans can act on it
```

---

# 25. Results Library

Create:

```text
/mynest/results/
```

This will become the strongest long-term asset.

Each completed public case:

```yaml
case_id:
age_band:
baseline:
primary_barrier:
child_choice:
intervention:
day_1:
day_3:
day_7:
day_14:
outcome:
limitations:
```

Never expose child identity.

---

# 26. Public Case Format

Example:

```text
MYNEST-CASE-003

Age:
4–5

Baseline:
0 own-room nights / previous 7

Primary barrier:
LOW ROOM OWNERSHIP

Child choice:
ROOM FRIEND

Intervention:
one selected comfort object

Day 7:
3 own-room nights

Day 14:
6 own-room nights

Result:
OWN_ROOM_SUCCESS

Limitations:
single household
parent-reported
not evidence of general effectiveness
```

This is more valuable than generic advice content.

---

# 27. Outcome-to-Answer Loop

When new Pilot data arrives:

```text
PILOT ANALYST
↓
find relevant question pages
↓
append observed result
↓
update evidence status
↓
update modified date
↓
re-submit sitemap if necessary
```

Never rewrite the article merely to appear fresh.

---

# 28. Platform Strategy

## A. Reddit

Purpose:

```text
DEMAND DISCOVERY
LANGUAGE DISCOVERY
ANSWER TESTING
```

Priority communities:

```text
r/Parenting
r/toddlers
r/sleeptrain
r/ScienceBasedParenting
```

Agent:

```text
search
classify
draft useful reply
```

Human:

```text
review
post where rules allow
```

Do not mass-post MyNest links.

---

# 29. Xiaohongshu

Purpose:

```text
CHINESE DEMAND GENERATION
PILOT RECRUITMENT
```

Content pattern:

```text
真实问题
↓
反直觉判断
↓
只做一个改变
↓
Room Check
```

Examples:

```text
儿童房已经装修好了，为什么孩子还是不肯自己睡？

孩子怕黑，不一定意味着要把灯开得更亮。

分房第一步，不一定是把父母赶出去。
```

CTA:

```text
MyNest 2分钟 Room Check
```

---

# 30. TikTok / Reels

Purpose:

```text
PROBLEM AWARENESS
```

15–30 seconds.

Template:

```text
HOOK
↓
ONE INSIGHT
↓
ONE QUESTION
↓
ROOM CHECK
```

Example:

```text
Your child may not hate sleeping alone.

They may hate what happens when you leave.

Before changing the whole room,
find where the resistance begins.
```

---

# 31. YouTube

Purpose:

```text
LONG-TAIL SEARCH
TRUST
EMBEDDABLE EXPLANATION
```

Initial videos:

```text
Why won't my child sleep in their own room?
How to move from co-sleeping to own room
Does letting children choose part of their room help?
Night light or bedtime story: what should you change first?
```

Link each video to one canonical question page.

---

# 32. Quora

Purpose:

```text
ENGLISH LONG-TAIL ANSWERS
```

Agent drafts complete answer.

Human publishes.

Do not begin answer with brand promotion.

End naturally:

```text
If you want to identify the likely barrier before changing the room,
MyNest has a short Room Transition Check.
```

---

# 33. Facebook Parenting Groups

Purpose:

```text
PILOT RECRUITMENT
```

Not SEO.

Use recruitment posts and useful answers.

Do not automate group posting.

---

# 34. Google Ads / Meta / ChatGPT Ads

Paid acquisition is separate from organic answer ownership.

Ads should send high-intent parents into:

```text
/mynest/
```

or a matching canonical problem page.

Use UTM:

```text
utm_source
utm_medium
utm_campaign
utm_content
```

Track:

```text
CLICK
ROOM_CHECK_START
ROOM_CHECK_COMPLETE
PILOT_ELIGIBLE
PILOT_START
PILOT_COMPLETE
```

---

# 35. Content Repurposing Engine

One verified question can create:

```text
1 canonical answer page
1 Xiaohongshu post
1 TikTok/Reels script
1 YouTube outline
1 Quora draft
1 Reddit reply draft
```

But the canonical website answer remains the source of truth.

Do not create six independent contradictory versions.

---

# 36. Daily Agent Workflow

Every day:

## STEP 1

Discover:

```text
>=20 raw parent questions
```

## STEP 2

Deduplicate.

## STEP 3

Map F01–F06.

## STEP 4

Update demand counts.

## STEP 5

Identify:

```text
NEW QUESTION
or
EXISTING QUESTION
```

## STEP 6

If existing:

```text
add demand evidence
improve answer if necessary
```

## STEP 7

If new and publishable:

```text
create candidate answer draft
```

## STEP 8

Generate:

```text
1 social content package
```

## STEP 9

Check Pilot outcomes relevant to current pages.

## STEP 10

Produce daily report.

---

# 37. Daily Output

```yaml
date:
new_raw_questions:
deduplicated_questions:
F01:
F02:
F03:
F04:
F05:
F06:
new_canonical_questions:
pages_updated:
page_candidates:
published_pages:
social_drafts:
pilot_evidence_updates:
indexing_issues:
conversion_issues:
```

---

# 38. Weekly Topic Map Review

Every 7 days produce:

```text
TOP 10 REAL QUESTIONS
TOP 5 FASTEST-GROWING QUESTIONS
TOP 5 QUESTIONS WITH HIGHEST PILOT INTENT
TOP 5 PAGES WITH HIGHEST ROOM-CHECK CONVERSION
TOP 5 QUESTIONS WITH NO GOOD ANSWER YET
```

Do not rank purely by page views.

---

# 39. Metrics

## Search Layer

```text
INDEXED_QUESTION_PAGES
NON_BRANDED_SEARCH_IMPRESSIONS
NON_BRANDED_CLICKS
QUESTION_PAGE_VISITS
```

## Answer Layer

```text
ANSWER_TO_CHECK_CTR
ROOM_CHECK_START_RATE
ROOM_CHECK_COMPLETION_RATE
```

## Choice Layer

```text
CHILD_CHOICE_START
LIGHT_SELECTION
STORY_SOUND_SELECTION
ROOM_FRIEND_SELECTION
```

## Pilot Layer

```text
PILOT_ELIGIBLE
PILOT_START
PILOT_COMPLETE
OWN_ROOM_SUCCESS
```

---

# 40. North-Star Metric

Do not use:

```text
PAGE VIEWS
```

Primary network metric:

```text
QUALIFIED QUESTION → ROOM CHECK COMPLETION
```

Primary evidence metric:

```text
QUESTION → VERIFIED OUTCOME CONNECTION
```

Long-term moat:

```text
HOW MANY REAL PARENT QUESTIONS
HAVE A MYNEST ANSWER
BACKED BY OBSERVED OUTCOME DATA?
```

---

# 41. 30-Day Target

```yaml
raw_parent_questions: ">=500"
canonical_questions: ">=50"
published_answer_pages: ">=20"
indexed_answer_pages: ">=15"
completed_room_checks: ">=50"
pilot_starts: ">=10"
pilot_completes: ">=8"
public_verified_cases: ">=3"
```

These are execution targets, not guaranteed outcomes.

---

# 42. Anti-Content-Farm Guard

Stop publishing if:

```text
pages are mostly paraphrases
question overlap becomes high
no unique decision value exists
no human/pilot evidence is added
bounce rises while Room Check conversion falls
```

The engine must become better by learning.

Not bigger by volume.

---

# 43. Phase 0 Codex Correction Before Search Scaling

Before activating this workflow at full scale:

1. inspect live `/mynest/`;
2. replace `SPACE / FOREST / OCEAN` as primary Pilot choices;
3. implement:

```text
LIGHT
STORY_OR_SOUND
ROOM_FRIEND
```

4. retain themes only as optional later presentation;
5. ensure optional child-entered text remains local-only or remove it;
6. ensure optional first-night notes remain local-only;
7. do not transmit any new free text;
8. preserve current Worker/D1 privacy regression tests;
9. production smoke test;
10. commit separately before SEO expansion.

---

# 44. Required New Files

Create:

```text
docs/mynest/MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1.md
docs/mynest/MYNEST_TOPIC_MAP_v0.1.md
docs/mynest/MYNEST_ANSWER_PAGE_STANDARD_v0.1.md
data/mynest/problem-corpus.jsonl
data/mynest/question-map.json
data/mynest/platform-content-queue.json
```

Recommended site structure:

```text
mynest/questions/
mynest/results/
```

---

# 45. Execution Order

```text
SPRINT 1
Correct Child Choice

SPRINT 2
Create Problem Corpus schema

SPRINT 3
Collect first 100 real questions

SPRINT 4
Build canonical Topic Map

SPRINT 5
Publish first 5 answer pages

SPRINT 6
Submit sitemap / Search Console

SPRINT 7
Start platform distribution

SPRINT 8
Connect Pilot results back into pages

SPRINT 9
Expand to 20 pages only when demand supports it
```

---

# 46. Acceptance Criteria

```text
CHILD_CHOICE_NARROWED =
PASS

PROBLEM_CORPUS_CREATED =
PASS

REAL_QUESTIONS_COLLECTED >=
100

CANONICAL_TOPIC_MAP >=
20

PUBLISHED_ANSWER_PAGES >=
5

SITEMAP_UPDATED =
PASS

CANONICAL_TAGS =
PASS

ROOM_CHECK_CTA =
PASS

SOCIAL_CONTENT_PIPELINE =
PASS

PILOT_RESULT_LINKAGE =
PASS

FREE_TEXT_PRIVACY_REGRESSION =
PASS
```

---

# 47. Final Codex Output

Return:

```text
PROJECT =
MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1

LIVE_ENTRY =
https://www.springofzen.com/mynest/

CHILD_CHOICE =
LIGHT / STORY_OR_SOUND / ROOM_FRIEND

RAW_PROBLEM_RECORDS =
<number>

CANONICAL_QUESTIONS =
<number>

PUBLISHED_ANSWER_PAGES =
<number>

INDEXABLE_ANSWER_PAGES =
<number>

SITEMAP =
PASS/FAIL

CANONICALS =
PASS/FAIL

STRUCTURED_DATA =
PASS/FAIL

ROOM_CHECK_LINKAGE =
PASS/FAIL

PILOT_RESULT_LINKAGE =
PASS/FAIL

PRIVACY_REGRESSION =
PASS/FAIL

TESTS =
<summary>

COMMIT =
<sha>

DEPLOYMENT =
PASS/FAIL

SEARCH_ENGINE_READY =
YES/NO

BLOCKERS =
<none or exact blockers>
```

---

# 48. Frozen Doctrine

```text
DO NOT OWN KEYWORDS.

OWN THE QUESTION.

DO NOT PUBLISH ANSWERS THAT END IN READING.

END IN A DECISION.

DO NOT SELL THREE THINGS.

LET THE CHILD CHOOSE ONE.

DO NOT CLAIM SUCCESS.

RECORD WHAT HAPPENED.

DO NOT BUILD A CONTENT FARM.

BUILD AN ANSWER SYSTEM.
```

The MyNest loop is:

```text
SEARCH
↓
QUESTION
↓
ANSWER
↓
ROOM CHECK
↓
CHOICE
↓
PILOT
↓
OUTCOME
↓
BETTER ANSWER
↓
MORE SEARCH
```
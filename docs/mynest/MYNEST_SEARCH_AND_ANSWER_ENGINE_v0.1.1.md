# MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1.1

## Status

```text
SUPERSEDES:
MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1

CHANGE_TYPE:
NARROWING PATCH

PRIMARY_CHANGE:
Replace broad automated web demand scanning with Reddit-first manual demand research.

RECRUITMENT_CHANGE:
Use paid acquisition + MyNest-owned landing flow as the primary pilot recruitment path.

REDDIT_ROLE:
REALITY SENSOR, NOT LEAD DATABASE
```

---

# 1. Core Decision

MyNest will not use Codex or an autonomous agent to crawl the whole web for parent demand.

The demand-research layer is narrowed to:

```text
PRIMARY_MANUAL_SOURCE = REDDIT
SECONDARY_SOURCE = MyNest own incoming search / ad / pilot data
```

The objective is not maximum coverage.

The objective is:

> high-quality real parental language, repeated pain patterns, failed attempts, and transition intent.

---

# 2. Operating Model

```text
REDDIT
↓
REAL PARENT LANGUAGE
↓
MANUAL REVIEW
↓
ANONYMOUS STRUCTURED INSIGHT
↓
F01–F06 CLASSIFICATION
↓
QUESTION CLUSTER
↓
ANSWER PAGE / AD COPY / ROOM CHECK IMPROVEMENT
↓
MYNEST LANDING PAGE
↓
PILOT
↓
OUTCOME
```

Recruitment runs separately:

```text
CHATGPT ADS / META / GOOGLE
↓
MYNEST RECRUIT PAGE
↓
SCREENER
↓
CONSENT
↓
PILOT
```

Do not mix the two systems.

---

# 3. Reddit Role

Reddit is used for:

```text
DEMAND DISCOVERY
LANGUAGE DISCOVERY
FAILED-SOLUTION DISCOVERY
URGENCY DISCOVERY
QUESTION CLUSTERING
ANSWER TESTING
```

Reddit is not used as:

```text
SCRAPED LEAD DATABASE
MASS DM SOURCE
AUTOMATED OUTREACH LIST
CONTACT HARVESTING SOURCE
```

---

# 4. Daily Manual Research Target

Daily target:

```text
20–30 relevant Reddit posts/comments
```

Recommended communities:

```text
r/Parenting
r/toddlers
r/sleeptrain
r/ScienceBasedParenting
```

Only use publicly accessible content.

Do not enter private groups or collect private profile data.

---

# 5. Search Query Set

Use manual Reddit search and/or Google site search.

English queries:

```text
site:reddit.com child won't sleep alone
site:reddit.com child refuses own room
site:reddit.com toddler refuses bedroom
site:reddit.com child keeps coming to parents bed
site:reddit.com parent must stay until child sleeps
site:reddit.com co sleeping transition own room
site:reddit.com child afraid to sleep alone
site:reddit.com child has own room but won't sleep there
```

Also search natively on Reddit for shorter natural phrases.

Do not expand into generic parenting topics.

---

# 6. Inclusion Rule

A post qualifies only if it contains at least one of:

```text
actual own-room transition problem
co-sleeping transition problem
parent-presence dependency
fear of own room / darkness
repeated return to parents' bed
child actively refuses designated sleeping space
```

Exclude:

```text
general newborn sleep
medical sleep disorders
adult sleep problems
pure product shopping
school-age issues unrelated to room transition
```

unless directly relevant to the MyNest category.

---

# 7. Anonymous Insight Record

Each accepted item becomes one record.

```yaml
insight_id:
source: reddit
subreddit:
published_period:
age_band:
current_sleep_setup:
raw_problem_wording:
normalized_problem:
failed_solution:
parent_action_already_tried:
primary_barrier:
secondary_barrier:
transition_intent:
urgency:
purchase_or_action_intent:
question_cluster:
answer_gap:
pilot_fit:
```

Do not store:

```text
reddit username
real name
email
phone
profile URL
child name
exact address
exact birthday
```

Source URL may be retained internally for verification if needed, but it must not be treated as a contact lead.

---

# 8. F01–F06 Classification

Keep the frozen taxonomy:

```text
F01 DARKNESS_FEAR
F02 SEPARATION_DEPENDENCY
F03 LOW_ROOM_OWNERSHIP
F04 ENVIRONMENT_FRICTION
F05 TRANSITION_ROUTINE
F06 UNCLEAR_OR_NON_ROOM_CAUSE
```

Manual reviewer assigns:

```text
PRIMARY_BARRIER
OPTIONAL_SECONDARY_BARRIER
```

If uncertain:

```text
F06
```

Do not force-fit ambiguous cases.

---

# 9. Transition Intent

Classify:

```text
LOW
MEDIUM
HIGH
```

## LOW

Parent is mostly venting or asking generally.

## MEDIUM

Parent is actively trying changes.

## HIGH

Parent is actively attempting own-room transition now and asking what to do next.

This field is for demand understanding only.

It is not permission to contact the parent.

---

# 10. Failed Solution Taxonomy

Track what parents have already tried.

Examples:

```text
new bed
new bedding
night light
reward chart
parent staying beside child
gradual withdrawal
sleep training
white noise
room redesign
door open
music
story
toy / comfort object
```

This becomes one of the most valuable MyNest assets.

Weekly output should identify:

> what parents repeatedly try before finding MyNest.

---

# 11. Contact Policy

Default:

```text
NO DIRECT CONTACT
```

Contact may be considered only when all are true:

```text
community rules allow it
parent explicitly invites suggestions / tools / participation
human reviewer approves
message is individual, contextual, and non-deceptive
```

Never:

```text
mass DM
copy-paste solicitation
automated DM
scraped-email lookup
profile enrichment
off-platform contact discovery
```

---

# 12. Preferred Reddit Interaction

When rules permit:

```text
ANSWER FIRST
LINK SECOND
```

A useful answer can be posted without any MyNest link.

Only include a link when:

```text
directly relevant
allowed by subreddit rules
the answer stands on its own without the link
```

MyNest must not depend on Reddit for recruitment volume.

---

# 13. Answer Testing

Reddit is useful for testing whether MyNest's language makes sense.

For selected public questions, prepare a reply with:

```text
1. likely barrier
2. one thing to check first
3. one thing not to change yet
4. one small experiment
```

Do not use internal jargon like:

```text
F03 LOW_ROOM_OWNERSHIP
```

Public language should be natural.

Example:

> If your child sleeps when you stay but immediately resists when you leave, the room itself may not be the main issue. I would test the separation step before redesigning the bedroom.

Track whether people:

```text
reply
ask follow-up
disagree
clarify
describe a failed solution
```

These responses improve the Answer Engine.

---

# 14. Weekly Reddit Insight Review

Every 7 days produce:

```text
TOP 10 REAL PARENT PHRASES
TOP 10 MOST COMMON PROBLEMS
TOP 5 FAILED SOLUTIONS
TOP 5 HIGH-URGENCY SCENARIOS
TOP 5 NEW QUESTION CLUSTERS
TOP 5 ANSWERS THAT NEED IMPROVEMENT
TOP 5 AD ANGLES
TOP 5 ROOM CHECK WORDING CHANGES
```

This is the main manual research output.

---

# 15. Search & Answer Engine Integration

Reddit findings feed four systems:

## A. SEO

```text
real wording
↓
canonical question page
```

## B. Ads

```text
high-intent wording
↓
ad headline / body
```

## C. Diagnosis

```text
recurring ambiguity
↓
improved Room Check question
```

## D. Child Choice

```text
repeated successful/failed parent action
↓
LIGHT / STORY_OR_SOUND / ROOM_FRIEND hypothesis
```

---

# 16. Recruitment Policy

Pilot recruitment priority:

```text
1. META ADS
2. GOOGLE SEARCH ADS
3. CHATGPT ADS
4. OWN ORGANIC SEO
5. APPROVED PARENTING COMMUNITIES
```

Reddit recruitment is opportunistic only.

Do not set Reddit recruitment quotas.

---

# 17. Paid Funnel

All paid traffic goes to:

```text
https://www.springofzen.com/mynest/
```

or one matching question page.

Required funnel:

```text
AD
↓
QUESTION / PROBLEM
↓
ROOM CHECK
↓
ELIGIBILITY
↓
CONSENT
↓
CHILD CHOICE
↓
PILOT
```

Use:

```text
utm_source
utm_medium
utm_campaign
utm_content
```

---

# 18. 14-Day Completion Incentive

Freeze:

```text
COHORT_001_REWARD =
US$39 equivalent voucher

CONDITION =
complete required Day 0 / 1 / 3 / 7 / 14 check-ins

NOT_CONDITIONAL_ON =
successful own-room transition
```

Do not pay for:

```text
positive review
successful outcome
public testimonial
```

---

# 19. Child Choice Model

Remain frozen:

```text
LIGHT
STORY_OR_SOUND
ROOM_FRIEND
```

Do not re-expand into:

```text
full room themes
whole-room redesign
large product bundles
```

during Cohort 001.

---

# 20. Manual Research Daily Workflow

Each day:

### STEP 1

Search Reddit using 5–8 narrow queries.

### STEP 2

Open 20–30 relevant posts/comments.

### STEP 3

Reject irrelevant cases.

### STEP 4

Record anonymous structured insights.

### STEP 5

Map F01–F06.

### STEP 6

Cluster repeated language.

### STEP 7

Identify:

```text
NEW_QUESTION
EXISTING_QUESTION
NEW_FAILED_SOLUTION
NEW_AD_ANGLE
```

### STEP 8

Update problem corpus.

### STEP 9

Draft at most:

```text
1 SEO improvement
1 ad angle
1 Reddit answer draft
```

per daily run.

Quality over volume.

---

# 21. Codex Role

Codex should no longer perform broad autonomous online demand research.

Codex may:

```text
normalize manually collected records
deduplicate
cluster
classify
calculate frequencies
update question map
generate drafts
update site pages after approval
```

Codex should not:

```text
autonomously crawl whole web
mass-search personal profiles
auto-contact parents
auto-post Reddit comments
auto-DM users
```

---

# 22. Manual Input Format

Human researcher gives Codex a batch:

```json
[
  {
    "source": "reddit",
    "raw_problem_wording": "...",
    "age_band": "4-5",
    "current_sleep_setup": "parent_stays",
    "failed_solution": "night_light"
  }
]
```

Codex enriches only with:

```text
normalized_problem
F01-F06
transition_intent
urgency
question_cluster
answer_gap
```

No identity enrichment.

---

# 23. Problem Corpus Update Rule

New records append.

Do not overwrite raw wording.

Maintain:

```text
RAW
NORMALIZED
CLASSIFIED
CLUSTERED
```

as separate fields.

Raw parent language is evidence.

---

# 24. Question Page Update Rule

An SEO page is updated only when new Reddit evidence provides:

```text
new wording pattern
new common failed solution
new decision branch
new observed pilot result
```

Do not update solely for freshness.

---

# 25. Ad Copy Rule

Ads should use recurring parent language.

Example:

Instead of:

> Own-room transition support for children.

Use:

> Your child has their own room—but still comes back to your bed every night?

Then:

> Find the biggest barrier first.

This preserves the real demand language.

---

# 26. Human Review Gate

Required before:

```text
external Reddit reply
direct contact
new ad campaign
new public answer page
major diagnosis wording change
```

No human review required for:

```text
deduplication
clustering
frequency counts
internal reports
```

---

# 27. Weekly Decision Report

Return:

```text
WEEK =
YYYY-WW

REDDIT_RECORDS_REVIEWED =
<number>

QUALIFIED_INSIGHTS =
<number>

TOP_BARRIER =
F0X

TOP_FAILED_SOLUTION =
<value>

TOP_HIGH_INTENT_QUESTION =
<question>

NEW_CANONICAL_QUESTIONS =
<number>

SEO_PAGES_UPDATED =
<number>

AD_ANGLES_CREATED =
<number>

ROOM_CHECK_CHANGES_PROPOSED =
<number>

PILOT_CANDIDATES_DIRECTLY_CONTACTED =
<number>

POLICY_EXCEPTIONS =
<number>

MAIN_FINDING =
<one concise finding>
```

---

# 28. Success Metrics

Research quality:

```text
QUALIFIED_INSIGHTS / POSTS_REVIEWED
```

Question quality:

```text
REPEATED_REAL_WORDING_PER_CANONICAL_QUESTION
```

Business value:

```text
QUESTION_PAGE → ROOM_CHECK_COMPLETE
```

Recruitment value:

```text
AD → PILOT_COMPLETE
```

Evidence value:

```text
QUESTION → PILOT_OUTCOME LINKAGE
```

Do not use Reddit follower counts or karma as KPIs.

---

# 29. 30-Day Research Target

```text
REDDIT_POSTS_REVIEWED >= 500

QUALIFIED_INSIGHTS >= 250

CANONICAL_QUESTIONS >= 30

FAILED_SOLUTION_PATTERNS >= 10

HIGH_INTENT_SCENARIOS >= 10

SEO_PAGES_WITH_REAL_LANGUAGE_UPDATES >= 10

NEW_AD_ANGLES >= 10
```

This target is intentionally smaller than broad-web crawling.

Higher evidence density is preferred.

---

# 30. Stop Conditions

Pause direct Reddit participation if:

```text
community moderators object
posts are removed repeatedly
users perceive replies as solicitation
brand reputation risk appears
```

Continue passive manual research if permitted.

---

# 31. Frozen Doctrine

```text
REDDIT IS WHERE WE LISTEN.

MYNEST IS WHERE WE CONVERT.

ADS ARE WHERE WE SCALE RECRUITMENT.

PILOTS ARE WHERE WE LEARN WHAT HAPPENED.
```

And:

```text
DO NOT SCRAPE PEOPLE.

COLLECT PROBLEMS.

DO NOT HUNT LEADS.

UNDERSTAND LANGUAGE.

DO NOT PUSH THE BRAND INTO COMMUNITIES.

BUILD THE BEST ANSWER OUTSIDE THEM.
```

---

# 32. Final Baseline

```text
PROJECT =
MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1.1

PRIMARY_MANUAL_DEMAND_SOURCE =
REDDIT

BROAD_AUTONOMOUS_WEB_CRAWL =
DISABLED

REDDIT_ROLE =
REALITY_SENSOR

PRIMARY_RECRUITMENT =
PAID_ACQUISITION

PAID_CHANNELS =
META / GOOGLE / CHATGPT ADS

DIRECT_REDDIT_CONTACT =
EXCEPTION_ONLY

MASS_DM =
PROHIBITED

IDENTITY_SCRAPING =
PROHIBITED

CHILD_CHOICE =
LIGHT / STORY_OR_SOUND / ROOM_FRIEND

CONVERSION_ENTRY =
https://www.springofzen.com/mynest/

STATUS =
READY_TO_EXECUTE
```
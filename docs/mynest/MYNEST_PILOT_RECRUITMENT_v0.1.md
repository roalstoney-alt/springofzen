# MYNEST_PILOT_RECRUITMENT_v0.1

## 0. Project Status

**Project:** MYNEST_ROOM_TRANSITION_PILOT_v0.1
**Recruitment Protocol:** MYNEST_PILOT_RECRUITMENT_v0.1
**Portal:** `https://www.springofzen.com/mynest/`
**Backend:** Cloudflare Worker + D1
**Production Baseline:** READY_FOR_PILOT_FAMILIES
**Primary Age Cohort:** 2.5–6 years
**Pilot Target:** 10 households
**Pilot Window per Household:** 14 days
**Primary Outcome:** OWN_ROOM_SUCCESS
**Operating Principle:** Demand First → Product Second

---

# 1. Pilot Purpose

The purpose of the first MyNest pilot is **not** to prove that MyNest improves children's sleep in general.

The pilot tests a narrower operational claim:

> Can a structured room-transition process—Diagnosis → Child Choice → limited environmental intervention → 14-day follow-up—help families move a child toward willingly using and sleeping in their own room?

The pilot must distinguish:

1. willingness to enter the room;
2. willingness to attempt sleep there;
3. actual own-room nights;
4. environmental problems from non-room problems;
5. child-choice effects from product/intervention effects.

MyNest is not positioned as treatment for insomnia, anxiety, ADHD, developmental disorders, or medical sleep disorders.

The prior design principle remains frozen: children may choose within an approved decorative layer, while safety, light level, sound level, fixing method, and other environmental constraints remain adult-controlled.

---

# 2. Pilot Success Definition

## Primary Metric

### OWN_ROOM_SUCCESS

A household qualifies as a pilot success when:

```yaml
observation_window: 14_days
own_room_nights: ">=5"
forced_physical_confinement: false
```

The result does **not** mean the child has permanently transitioned to independent sleep.

It means:

> Within the 14-day observation window, the child completed at least five nights sleeping in the designated own-room sleeping space.

---

## Supporting Metrics

### ROOM_ENTRY_WILLINGNESS

Did the child willingly enter and remain in the own-room environment at bedtime?

Values:

```text
YES
WITH_RESISTANCE
NO
```

### OWN_ROOM_ATTEMPT

Did the child attempt to fall asleep in the own-room sleeping space?

```text
YES
NO
```

### OWN_ROOM_NIGHT

Did the child complete the defined night period in that room?

```text
YES
NO
PARTIAL
```

### Additional descriptive fields

```text
parent_presence
night_exit_count
returned_to_parent_room
intervention_used
child_choice_completed
```

---

# 3. Cohort Definition

## INCLUDE

A family is eligible when all conditions below are true:

```yaml
child_age:
  minimum: 2.5_years
  maximum: 6_years

current_problem:
  one_or_more:
    - co_sleeping
    - parent_stays_until_sleep
    - child_refuses_own_room
    - child_returns_to_parent_room
    - fear_of_dark
    - child_dislikes_own_room
    - failed_room_transition

physical_environment:
  required:
    - own_room_or_defined_child_sleeping_space_exists
    - sleeping_space_is_currently_usable

parent_intent:
  required:
    - parent_actively_wants_to_attempt_transition

participation:
  required:
    - parent_can_complete_Day_0_1_3_7_14
```

---

# 4. Exclusion / Rescope Rules

Do not recruit a family into the intervention pilot when:

- there is no usable child sleeping space;
- both parents/caregivers fundamentally disagree about attempting the transition;
- the parent is seeking treatment for a diagnosed medical or psychiatric condition;
- the child has a known serious sleep-related medical condition requiring professional care;
- the parent wants MyNest to diagnose developmental or behavioral disorders;
- the parent requests forced isolation, locking doors, punishment, or coercive confinement;
- the room has obvious unresolved physical safety hazards;
- the family cannot complete follow-up.

These cases may still use public educational content, but they do not enter **PILOT_ACTIVE**.

If the primary issue does not appear to be environmental, classify:

```text
F06 = UNCLEAR_OR_NON_ROOM_CAUSE
```

and do not manufacture a product recommendation.

The existing MyNest principle remains:

> If a room intervention does not appear to be the first thing to change, say so; do not sell a second intervention merely because the first one failed.

---

# 5. Recruitment Target

Initial cohort:

```yaml
TOTAL_TARGET: 10
RESERVE_LIST: 5
MAX_ACTIVE_AT_ONE_TIME: 10
```

Do not scale beyond 10 until the first cohort reaches Day 14.

The first objective is clean observation, not volume.

---

# 6. Pilot Groups

The first cohort will be allocated descriptively into three groups.

This is **not** presented as a randomized clinical trial.

## GROUP A — Diagnosis Only

Target:

```text
N = 3
```

Receives:

- Room Transition Check
- primary barrier
- secondary barrier if applicable
- first-action recommendation

Does not receive structured Child Choice during the first observation period.

Purpose:

> Establish whether diagnosis/parent framing alone changes behavior.

---

## GROUP B — Diagnosis + Child Choice

Target:

```text
N = 3
```

Receives:

- Diagnosis
- Child Choice experience
- child-selected approved theme/elements
- transition instructions

No purchased product is required.

Purpose:

> Test whether psychological ownership and participation affect room-entry willingness or own-room attempts.

---

## GROUP C — Diagnosis + Child Choice + Intervention

Target:

```text
N = 4
```

Receives:

- Diagnosis
- Child Choice
- one primary approved room intervention
- optional secondary intervention only when justified
- 14-day transition process

Purpose:

> Observe the complete MyNest operating loop.

---

# 7. Group Assignment Rules

Do not manually cherry-pick families based on expected success.

Preferred assignment method:

```text
eligible_household_sequence:
1 -> A
2 -> B
3 -> C
4 -> C
5 -> A
6 -> B
7 -> C
8 -> A
9 -> B
10 -> C
```

If a family requires an intervention for practical reasons before participating, document:

```text
ASSIGNMENT_OVERRIDE = YES
REASON = <structured reason>
```

Do not silently alter assignment.

---

# 8. Recruitment Funnel

The full recruitment path is:

```text
PUBLIC PROBLEM
      ↓
RECRUITMENT MESSAGE
      ↓
LANDING PAGE
      ↓
PARENT SCREENER
      ↓
ELIGIBLE / NOT ELIGIBLE
      ↓
PARENT CONSENT
      ↓
ANONYMOUS PILOT ID
      ↓
GROUP ASSIGNMENT
      ↓
DAY 0
      ↓
DIAGNOSIS
      ↓
CHILD CHOICE / INTERVENTION
      ↓
DAY 1
      ↓
DAY 3
      ↓
DAY 7
      ↓
DAY 14
      ↓
OUTCOME FREEZE
```

---

# 9. Recruitment Channels — Priority Order

## Tier 1 — Existing Personal Network

Use first.

Why:

- higher trust;
- easier follow-up;
- better Day 14 completion;
- lower acquisition cost.

Target:

```text
3–4 households
```

Do not recruit direct employees where power imbalance could make participation feel mandatory.

---

## Tier 2 — Parenting Communities

Target:

```text
3–4 households
```

Priority:

- Facebook parenting groups
- local mother/father groups
- WhatsApp parenting communities
- WeChat parenting groups where appropriate
- Xiaohongshu parenting audience

Post as a pilot/research-style invitation, not a product advertisement.

---

## Tier 3 — Public Organic Content

Target:

```text
2–3 households
```

Platforms:

- Xiaohongshu
- TikTok
- Instagram Reels
- Facebook
- Reddit only where community rules permit

Content should begin with the parental problem, not MyNest branding.

Examples:

```text
“4岁了还是不愿自己睡，问题一定在孩子吗？”

“儿童房已经装修好了，为什么孩子还是不肯进去睡？”

“Before redesigning your child's room, find out what they're actually resisting.”
```

CTA:

> Take the 2-minute MyNest Room Check.

---

# 10. Do Not Spam Communities

Agent may discover conversations and classify demand.

Agent must **not** autonomously mass-reply promotional links into parenting communities.

Permitted:

```text
discover
classify
draft
queue_for_human_review
```

Not permitted:

```text
auto-post
auto-DM
mass-comment
impersonate-parent
fabricate-success-story
```

Human approval remains required for community outreach.

---

# 11. Parent Screener

The screener should be short enough to complete in under three minutes.

## S1

How old is your child?

```text
Under 2.5
2.5–3
3–4
4–5
5–6
Over 6
```

## S2

Where does your child usually fall asleep?

```text
Parent's bed
Separate bed in parent's room
Own room with parent present
Own room but returns to parent
Own room independently
Other
```

## S3

What are you trying to change?

```text
Move from co-sleeping to own room
Reduce parent staying in room
Reduce returning to parent's room
Help child feel comfortable in own room
Not sure
```

## S4

Does the child already have a safe, usable sleeping space?

```text
YES
NO
```

## S5

Are you actively planning to attempt an own-room transition in the next 14 days?

```text
YES
NO
```

## S6

Can you complete five short check-ins?

```text
Day 0
Day 1
Day 3
Day 7
Day 14
```

```text
YES
NO
```

## S7

Are you seeking help for a diagnosed medical, developmental, or psychiatric condition?

```text
YES
NO
```

A YES does not stigmatize or reject the family broadly.

It means:

```text
NOT_ELIGIBLE_FOR_ROOM_INTERVENTION_PILOT
```

unless the specific issue is clearly unrelated and safe to proceed.

---

# 12. Eligibility Logic

```text
IF age < 2.5
→ NOT_CURRENT_COHORT

IF age > 6
→ OUTSIDE_V0.1

IF safe_space = NO
→ HOLD

IF transition_next_14_days = NO
→ WAITLIST

IF follow_up = NO
→ CONTENT_ONLY

IF medical/developmental_treatment_request = YES
→ OUT_OF_SCOPE

ELSE
→ PILOT_ELIGIBLE
```

---

# 13. Parent Consent

Consent should be readable, not legalistic.

Parent must understand:

- MyNest is an experimental room-transition service;
- it is not medical treatment;
- participation is voluntary;
- the parent may stop at any time;
- MyNest does not require the child's name;
- MyNest does not require photographs;
- MyNest does not require exact date of birth;
- the pilot stores structured anonymous event data;
- no free-text child information is required;
- anonymized aggregated results may later be used to improve MyNest or describe pilot outcomes;
- individual identifiable stories are not published without separate explicit permission.

Consent event:

```yaml
pilot_consent: true
consent_version: MYNEST_CONSENT_v0.1
consent_timestamp: server_generated
```

---

# 14. Pilot Identity

Generate:

```text
HOUSEHOLD_ID = H-XXXX
CHILD_ID = C-XXXX
PILOT_ID = P-XXXX
```

Never derive the ID from:

- child name;
- email;
- telephone;
- address;
- birthday.

---

# 15. Day 0 Baseline

Before Diagnosis or Child Choice, record the previous seven nights.

Required fields:

```yaml
own_room_nights_last_7:
parent_room_nights_last_7:
parent_present_until_sleep:
night_returns_to_parent:
room_entry_resistance:
current_night_light:
current_sound:
previous_transition_attempt:
```

Use structured values.

No open notes.

---

# 16. Diagnosis

Run the existing 8-question Room Transition Check.

Primary classes:

```text
F01 DARKNESS_FEAR
F02 SEPARATION_DEPENDENCY
F03 LOW_ROOM_OWNERSHIP
F04 ENVIRONMENT_FRICTION
F05 TRANSITION_ROUTINE
F06 UNCLEAR_OR_NON_ROOM_CAUSE
```

Store:

```yaml
primary_barrier:
secondary_barrier:
confidence_band:
```

Do not store AI chain-of-thought.

---

# 17. Child Choice Session

Groups B and C only.

Child receives approved choices.

First cohort:

```text
SPACE
FOREST
OCEAN
```

Choice architecture:

```text
Theme
↓
Night Friend
↓
Visual Element
↓
Optional Sound
```

Do not send child-entered text to the server.

The purpose is not interior design preference research.

The test is:

> Does participation increase ownership and willingness to use the room?

---

# 18. Intervention Rule

Group C receives:

```text
ONE PRIMARY INTERVENTION
```

Only add a secondary intervention when:

```text
primary_barrier + environment
```

clearly justify it.

Do not redesign the entire room.

Examples:

### F01

Possible intervention:

```text
low-level approved night light
```

### F03

Possible intervention:

```text
child-selected visible room element
```

### F04

Possible intervention:

```text
light/noise/environment correction
```

### F05

Possible intervention:

```text
structured bedtime transition routine
```

### F06

Possible intervention:

```text
NONE
```

---

# 19. Day 1

Collect:

```yaml
room_entry:
own_room_attempt:
own_room_night:
parent_presence:
returned_to_parent:
```

No outcome interpretation yet.

---

# 20. Day 3

Collect:

```yaml
room_entry_willingness:
own_room_attempts_total:
own_room_nights_total:
night_exit_count:
returned_to_parent_count:
intervention_still_active:
```

---

# 21. Day 7

Repeat structured measures.

Also calculate:

```text
CHANGE_FROM_BASELINE
```

Do not ask:

> “Do you think MyNest worked?”

before the behavioral measures.

---

# 22. Day 14

Final structured outcome.

Calculate:

```yaml
own_room_nights_14d:
own_room_attempts_14d:
room_entry_willingness_final:
parent_presence_change:
night_exit_change:
returned_to_parent_change:
```

Assign:

```text
SUCCESS
PARTIAL
NO_CHANGE
WORSE
INCOMPLETE
```

---

# 23. Parent Experience Question

Only after structured outcome collection:

> Would you recommend this process to another parent preparing a child for their own room?

```text
YES
MAYBE
NO
```

Optional structured reason:

```text
easy_to_follow
child_enjoyed_choice
reduced_parent_conflict
room_felt_more_acceptable
too_much_effort
no_visible_change
not_relevant
other_structured
```

No free-text in v0.1.

---

# 24. Incentive

For the first ten households:

Recommended:

```text
Diagnosis = free
Pilot participation = free
Digital plan = free
```

For Group C:

Option A:

```text
MyNest covers one low-cost intervention component
```

or

Option B:

```text
family pays product cost only
service fee = zero
```

Do not pay families based on positive outcome.

Compensation must never depend on SUCCESS.

---

# 25. Recruitment Messaging

## Public English

> Is your child ready for their own room—but still refuses to sleep there?
>
> MyNest is running a small 14-day pilot for families with children aged 2.5–6 who are actively trying to move from co-sleeping or parent-assisted sleep into their own room.
>
> We first identify the biggest barrier. Some children then get to choose part of their own room experience. We change only what appears necessary and follow the result for 14 days.
>
> This is not sleep therapy or medical treatment.
>
> The first pilot is limited to 10 families.

CTA:

> Start the 2-minute Room Check.

---

## Public Chinese

> **孩子已经有自己的房间，却还是不愿意自己睡？**
>
> MyNest 正在招募首批 10 个家庭，测试一套为 2.5–6 岁儿童设计的「分房过渡」方法。
>
> 我们不会一开始就建议重新装修儿童房，而是先判断孩子真正抗拒的是什么：怕黑、离不开父母、对自己的房间没有归属感、环境不舒服，还是问题根本不在房间。
>
> 符合条件的家庭会参加一个为期 14 天的小型 Pilot，包括问题诊断、部分儿童自主选择，以及必要时的一项最小环境调整。
>
> 这不是医疗或睡眠治疗项目。
>
> 首批仅限 10 个家庭。

CTA:

> 完成 2 分钟 MyNest Room Check

---

# 26. Direct Outreach Message

For a known parent:

> We're testing a small project called MyNest for families preparing a 2.5–6-year-old child to sleep in their own room.
>
> The idea is not to redesign the whole room. We first identify what the child is actually resisting, let some children choose part of the room themselves, then follow the result for 14 days.
>
> We're looking for 10 pilot families. If this is something your family is already planning to try, I can send you the 2-minute screening link.
>
> No pressure at all if the timing isn't right.

---

# 27. Agent Recruitment Tasks

Create:

```text
MYNEST_RECRUITMENT_AGENT
```

Daily tasks:

## Task A — Demand Discovery

Find:

```text
20 new public parent problem expressions/day
```

Search concepts:

```text
孩子不肯分房
孩子不肯自己睡
孩子怕黑
半夜跑父母房间
4岁陪睡
5岁跟妈妈睡
有儿童房也不睡

toddler won't sleep alone
child refuses own room
child keeps coming to parents bed
co-sleeping transition
afraid to sleep alone
```

---

## Task B — Candidate Signal

Classify each item:

```yaml
age_known:
transition_intent:
problem_class:
urgency:
purchase_intent:
pilot_fit:
```

Agent does **not** collect or scrape private personal contact information.

---

## Task C — Recruitment Content

From repeated problems generate:

```text
1 short post/day
1 problem page/day
3 outreach drafts/day
```

Human reviews external outreach.

---

## Task D — Funnel Report

Daily:

```yaml
visitors:
screeners_started:
screeners_completed:
eligible:
consented:
day_0_started:
active_pilots:
dropouts:
```

---

# 28. Recruitment Statuses

Every candidate must have exactly one state:

```text
DISCOVERED
INVITED
SCREEN_STARTED
SCREEN_COMPLETE
NOT_ELIGIBLE
WAITLIST
ELIGIBLE
CONSENTED
DAY_0_COMPLETE
PILOT_ACTIVE
PILOT_COMPLETE
WITHDRAWN
LOST_FOLLOWUP
```

No ambiguous status such as:

```text
interested
maybe
contacted?
```

---

# 29. Funnel Targets

For the first cohort, working assumptions:

```yaml
landing_visitors: 100
screener_started: 35
screener_completed: 25
eligible: 15
consented: 10
pilot_started: 10
pilot_completed: ">=8"
```

These are operational targets, not validated conversion benchmarks.

---

# 30. Recruitment KPI

Primary recruitment KPI:

```text
10 QUALIFIED PILOT STARTS
```

Not:

```text
followers
likes
impressions
```

Secondary:

```text
SCREEN_COMPLETION_RATE
ELIGIBILITY_RATE
CONSENT_RATE
DAY_14_COMPLETION_RATE
```

---

# 31. Pilot Quality Gates

Do not declare the cohort valid unless:

```yaml
pilot_started: 10
day14_completed: ">=8"
groups_present:
  A: ">=2"
  B: ">=2"
  C: ">=3"
```

If completion is below 8:

```text
RECRUITMENT_VALIDATION = INCOMPLETE
```

Do not fill missing outcomes with assumptions.

---

# 32. Early Stop Rules

Pause recruitment/intervention if:

- production backend records incorrectly;
- consent state cannot be verified;
- private child information is accidentally transmitted;
- a product or intervention produces a credible safety issue;
- multiple parents interpret MyNest as medical treatment;
- pilot instructions cause parents to use coercive isolation;
- intervention logic behaves differently from frozen F01–F06 rules.

Status:

```text
PILOT_HOLD
```

Fix before continuing.

---

# 33. No Marketing Claims Before Evidence

Before first cohort completion, prohibited claims include:

```text
MyNest makes children sleep independently
MyNest improves sleep
scientifically proven
clinically proven
X% success rate
reduces anxiety
```

Allowed:

```text
MyNest helps families structure the transition to a child's own room.

MyNest identifies likely room-transition barriers before recommending changes.

MyNest is testing whether child choice and limited room interventions can support own-room transition.
```

---

# 34. First Public Cases

After Day 14, only publish a case when:

```yaml
consent_for_case_use: true
outcome_data_complete: true
identity_removed: true
claim_supported_by_record: true
```

Case format:

```text
AGE BAND
BASELINE
PRIMARY BARRIER
INTERVENTION
DAY 1
DAY 3
DAY 7
DAY 14
RESULT
LIMITATIONS
```

Do not write emotional success stories first and retrofit evidence later.

---

# 35. First 7-Day Execution Schedule

## DAY 1

- publish recruitment page;
- enable screener;
- verify consent event;
- send 10 warm-network invitations;
- publish first Chinese problem post;
- publish first English problem post.

Target:

```text
SCREEN_COMPLETED >= 5
```

---

## DAY 2

- Demand Agent collects first 20 problem records;
- human reviews repeated wording;
- contact second recruitment channel;
- publish problem page #1.

Target cumulative:

```text
PROBLEM_RECORDS >= 20
SCREEN_COMPLETED >= 8
```

---

## DAY 3

- continue warm outreach;
- publish second problem post;
- create candidate waitlist;
- start first eligible Day 0 households.

Target:

```text
CONSENTED >= 3
```

---

## DAY 4

- start Group A/B/C allocation;
- run first Child Choice sessions;
- verify production data.

Target:

```text
PILOT_ACTIVE >= 3
```

---

## DAY 5

- add second parenting-community channel;
- Demand Agent reaches 60 records;
- Answer Engine publishes page #2–#4.

Target:

```text
CONSENTED >= 6
```

---

## DAY 6

- review recruitment bottlenecks;
- do not change eligibility criteria merely to fill quota;
- publish one real parent problem answer.

Target:

```text
PILOT_ACTIVE >= 6
```

---

## DAY 7

Target:

```yaml
REAL_PROBLEM_RECORDS: ">=100"
SCREEN_COMPLETED: ">=20"
ELIGIBLE: ">=12"
CONSENTED: ">=10"
PILOT_ACTIVE: ">=10"
```

If 10 qualified households are reached:

```text
RECRUITMENT_STATUS = CLOSED_FOR_COHORT_1
```

Additional suitable families enter:

```text
WAITLIST_COHORT_2
```

---

# 36. 14-Day Pilot Reporting

Agent produces a daily operational report:

```yaml
date:
recruitment_status:
screen_started:
screen_completed:
eligible:
consented:
active:
completed:
withdrawn:
group_a:
group_b:
group_c:
room_entry_yes:
own_room_attempt_yes:
own_room_success_current:
data_errors:
safety_flags:
```

No names.

---

# 37. Cohort Freeze

When the tenth participant completes Day 0:

Freeze:

```text
MYNEST_COHORT_001
```

Record:

```yaml
cohort_size: 10
recruitment_start:
recruitment_close:
group_assignment:
protocol_version:
diagnosis_version:
choice_version:
backend_baseline:
```

Do not change the protocol for existing cohort members.

Improvements discovered after freeze become:

```text
MYNEST_PILOT_RECRUITMENT_v0.2
```

or:

```text
MYNEST_COHORT_002
```

---

# 38. Day-14 Decision Gate

After all available participants reach Day 14:

## GO

If:

```yaml
completed: ">=8"
verified_success: ">=3"
child_choice_completion: ">50%"
major_safety_issue: 0
parent_recommend_yes_or_maybe: majority
```

Proceed to:

```text
MYNEST_PILOT_COHORT_002
```

with targeted acquisition.

---

## HOLD

If:

```text
parents engage
but own-room behavioral outcomes remain weak
```

Review:

```text
Diagnosis
Group assignment
Intervention matching
Child Choice mechanism
```

Do not solve weak outcomes by adding more products.

---

## RESCOPE

If:

```text
parents discuss the problem
but consistently refuse even a free structured pilot
```

investigate whether:

- problem urgency is too weak;
- transition timing is wrong;
- parent disagreement is dominant;
- room transition is not a purchasing category;
- MyNest should sell a different entry product.

---

# 39. Core Recruitment Doctrine

MyNest does not recruit parents by promising:

> “We can make your child sleep alone.”

It recruits them around:

> “Before changing the whole room, let's identify what your child is actually resisting.”

The parent receives structure.

The child receives limited agency.

MyNest changes only what the evidence suggests should be changed.

The pilot records what actually happened.

---

# 40. Frozen Execution Baseline

```text
PROJECT =
MYNEST_PILOT_RECRUITMENT_v0.1

COHORT =
MYNEST_COHORT_001

TARGET =
10 HOUSEHOLDS

AGE =
2.5–6 YEARS

WINDOW =
14 DAYS

GROUP_A =
DIAGNOSIS_ONLY

GROUP_B =
DIAGNOSIS_PLUS_CHILD_CHOICE

GROUP_C =
DIAGNOSIS_PLUS_CHILD_CHOICE_PLUS_INTERVENTION

PRIMARY_OUTCOME =
OWN_ROOM_SUCCESS

SUCCESS_THRESHOLD =
>=5 OWN-ROOM NIGHTS WITHIN 14 DAYS

PRIMARY_RECRUITMENT_GOAL =
10 QUALIFIED PILOT STARTS

MINIMUM_COMPLETE_COHORT =
8

FIRST_EVIDENCE_GATE =
>=3 VERIFIED SUCCESS CASES

AGENT_AUTONOMY =
DISCOVER_CLASSIFY_DRAFT_REPORT

EXTERNAL_OUTREACH =
HUMAN_REVIEW_REQUIRED

PII =
PROHIBITED

FREE_TEXT =
PROHIBITED

MEDICAL_CLAIMS =
PROHIBITED

CORE_PRINCIPLE =
DEMAND FIRST → PRODUCT SECOND

STATUS =
READY_TO_EXECUTE
```

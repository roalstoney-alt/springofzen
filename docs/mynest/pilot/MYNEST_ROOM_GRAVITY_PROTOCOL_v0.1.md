# MyNest Room Gravity Protocol v0.1

Status: frozen pilot protocol

Project: `MYNEST_THREE_WORLDS_IP_AND_MAGIC_ROOM_PILOT_v0.1`

Population: 3–5 households with a child aged 3–6

Duration: baseline through Day 14

## 1. Purpose

The pilot tests one question before sleep outcomes: does a child voluntarily enter, remain in, identify with, and ask to return to a room-sized MyNest world after first-exposure novelty fades?

The primary outcome is **Room Gravity**, represented by raw structured observations. It is not collapsed into an opaque composite score. The secondary outcome is **Return Desire**. Bedtime and own-room changes are exploratory observations only; this protocol does not establish causality or make a medical claim.

## 2. Frozen scope

- One projector and browser-based L0 world; no child tracking.
- Ocean / Lumisea is the hero experience. Forest / Mosswood and Space / NovaNest are shared-engine proofs.
- Shared state sequence: `ENTRY → AWAKEN → DISCOVER → INTERACT → STORY → WIND_DOWN → SLEEP → RETURN`.
- No rapid flashing, surprise high-intensity effects, camera, microphone, face/voice capture, or recording.
- Participation never requires a review, testimonial, photo, video, quote, or public post.
- Pilot consent and UGC publication consent are separate. This pilot interface collects pilot consent only.

## 3. Household eligibility

Include a household only when:

1. the participating child is 3–6 years old;
2. the caregiver can supervise every session and complete structured check-ins;
3. the physical room can support a securely placed projector and secured cables;
4. the caregiver understands this is an experimental room experience, not therapy or medical treatment; and
5. explicit pilot consent is recorded before any structured observation is sent.

Do not enroll or pause participation when the setup creates an electrical, trip, heat, visual-sensitivity, or supervision risk. Families should stop if the child shows distress. Persistent or severe sleep, breathing, pain, developmental, or safety concerns belong with an appropriately qualified professional.

## 4. Safety and setup gate

The operator confirms before every first exposure:

- projector and mount are stable and out of reach;
- cables are secured outside the walking path;
- ventilation is unobstructed;
- brightness is at the lowest comfortable level and light is not directed into eyes;
- motion is slow, predictable, and contains no rapid flashing;
- sound is low and can be disabled immediately;
- the parent/caregiver remains present and can end the experience at once; and
- no camera, microphone, tracking, or recording is active.

A failed safety check means **PILOT_HOLD** for that household until corrected.

## 5. Observation schedule

### Baseline — before exposure

Record:

- age band: 3–4, 4–5, or 5–6;
- voluntary room entry: never, sometimes, often;
- typical time in room: under 10, 10–30, over 30 minutes;
- child requests the room: never, sometimes, often;
- whether the child shows the room to others; and
- bedtime acceptance: low, mixed, high, or not observed.

### First exposure — Day 0

Record only directly observable behavior:

- entered without prompt;
- approached projection;
- pointed to a character;
- spoke to a character;
- requested a repeat;
- asked a question;
- requested another world;
- stayed after the caregiver moved away; and
- session duration band.

The first exposure is a novelty observation, not evidence of durable demand.

### Day 3

Record voluntary return, world request, character request, request for the next event, and session duration. This early checkpoint distinguishes immediate novelty from emerging recurrence.

### Day 7

Record raw counts for voluntary entries, world requests, and character requests; average session duration; whether the child asked for the next event; whether the child showed the world to another person; and preferred world and character.

### Day 14

Record:

- return desire;
- novelty-decay classification;
- voluntary Day 14 return;
- self-initiated room use;
- preferred world and character; and
- caregiver-observed change in bedtime acceptance and own-room attempts.

The last two fields remain secondary, non-causal observations.

## 6. Metric definitions

**Room Gravity** is reported as a vector, not a single score:

1. voluntary entries;
2. child-initiated requests for the world;
3. child-initiated requests for a character;
4. time in the room;
5. showing the room to another person; and
6. asking for the next event.

**Return Desire** is classified as:

- `none` — no request to return;
- `prompted` — returns only after adult prompting;
- `spontaneous_once` — one unprompted request; or
- `spontaneous_repeated` — repeated unprompted requests.

**Novelty Decay** is classified at Day 14 as:

- `high_persistence` — strong voluntary behavior persists;
- `moderate_persistence` — recurring interest persists at a lower level;
- `low_persistence` — occasional weak interest remains; or
- `novelty_only` — first-exposure interest does not recur.

No weighting formula may be introduced during this frozen pilot.

## 7. Data handling

- The browser creates an anonymous `MR-XXXXXX` pilot code.
- Observations remain on the device unless explicit pilot consent is checked.
- The sync allowlist accepts structured fields only.
- Do not collect names, exact birth dates, contact details, addresses, school, profiles, faces, voices, photos, videos, or free-text notes.
- Server records use the consent version `MYNEST_MAGIC_ROOM_CONSENT_v0.1`.
- Row-level pilot data is restricted to authorized operators; reporting is aggregate or count-only.
- Local JSON export contains the anonymous code and structured observations only.

## 8. Evaluation and decision gate

A complete household has baseline, first-exposure, Day 3, Day 7, and Day 14 observations. A meaningful repeat signal requires unprompted return behavior after the first exposure; first-day excitement alone does not qualify.

After 3–5 complete households, choose exactly one decision:

- **GO** — recurring Room Gravity appears across enough complete households to justify a larger pilot and a measured L1 technical spike;
- **RESCOPE** — attraction is specific to one world, character, event, or setup and needs a narrower next test; or
- **PILOT_HOLD** — safety, consent, privacy, reliability, or evidence quality is inadequate, or interest is novelty-only.

No numerical commercial threshold is invented mid-pilot. The final report must show household completion counts, the raw observation dimensions, missingness, and the decision rationale.

## 9. Early-stop rules

Recommend `PILOT_HOLD` immediately when any of these occurs:

- projector, cable, brightness, heat, or room-layout safety cannot be corrected;
- rapid flashing or unexpectedly intense sensory behavior appears;
- a child shows sustained distress or asks to stop;
- the system records or transmits outside the frozen structured allowlist;
- pilot consent cannot be verified or is confused with publication consent;
- backend events are lost, duplicated incorrectly, exposed, or associated with identifying data; or
- an operator is asked to claim sleep improvement or therapeutic benefit from this pilot.

## 10. Change control

This protocol is frozen for v0.1. World content can be repaired for safety or reliability, but changes to the metric definitions, checkpoints, consent model, or inclusion criteria require a new version and must not be mixed into the same cohort.

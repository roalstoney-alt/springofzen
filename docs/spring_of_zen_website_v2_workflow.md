# Spring of Zen Website v2 — Consciousness Interface Workflow

## 0. Core Direction

The website must not behave like a normal music gallery.

It must behave like a **Consciousness Interface**:

```text
User arrives
↓
Website asks: "What state do you want to enter?"
↓
User selects or describes a target state
↓
System recommends a Session / Product
↓
System records the intent + click + feedback
↓
Data feeds back into DNA / product decisions
```

The first-principle goal is:

```text
Help users enter an inner state.
```

Not:

```text
Let users browse music.
```

---

# 1. Brand Architecture

## Main Brand

```text
Spring of Zen
```

Role:

- Public-facing brand
- YouTube channel identity
- Website domain
- Trust layer
- Consciousness portal

Domain:

```text
springofzen.com
```

## Sub-brand

```text
Memory Air
```

Role:

- Premium session/product line
- Etsy product family
- Subscription identity
- Emotional atmosphere category

## Internal System

```text
Consciousness Audio Lab
```

Role:

- DNA research system
- Mutation engine
- Experimental structure archive
- GitHub research notes

---

# 2. Website Positioning

## Old positioning

```text
AI music website
```

## New positioning

```text
Consciousness Session Portal
```

Users should feel:

```text
This website helps me enter sleep, reflection, sacred stillness, emotional reset, or floating memory.
```

---

# 3. Technical Stack

The current website is based on GitHub Pages.

Keep the frontend static and lightweight.

Recommended stack:

```text
GitHub Pages
HTML
CSS / Tailwind-style utility classes
Vanilla JavaScript
Supabase optional backend
```

Why:

- GitHub Pages can host static websites and supports custom domains.
- Supabase can provide auth, database, and JavaScript client integration.
- The first version does not need a complex server.

---

# 4. Website v2 File Structure

Codex should upgrade the current repository into this structure:

```text
/
index.html
sessions.html
session.html
products.html
lab.html
about.html

/assets/
  /css/
    style.css
  /js/
    app.js
    sessions.js
    recommender.js
    tracking.js
    supabase-client.js
  /data/
    sessions.json
    products.json
    dna.json
    recommendation_rules.json
  /img/
    covers/
  /audio/
    previews/

/docs/
  spring_of_zen_website_v2_workflow.md
```

If current files already exist, preserve existing functions and upgrade in place.

---

# 5. Homepage First Screen

## Hero Goal

Immediately communicate:

```text
This is not music browsing.
This is state entry.
```

## Hero Copy

Use this headline:

```text
What state do you want to enter tonight?
```

Subtitle:

```text
Consciousness Sessions for sleep, floating memory, sacred stillness, and emotional reset.
```

Primary CTA:

```text
Find My Session
```

Secondary CTA:

```text
Explore Memory Air
```

---

# 6. State Selector UI

On homepage, create five large state cards:

```json
[
  {
    "state": "Deep Sleep",
    "session": "Lotus Sleep",
    "intent_tags": ["sleep", "tired", "calm", "nervous system"],
    "description": "Slow, safe, low-tension sound environment for falling asleep."
  },
  {
    "state": "Floating Reflection",
    "session": "Memory Air",
    "intent_tags": ["lonely", "reflection", "memory", "night"],
    "description": "Soft memory atmosphere for late-night reflection and emotional floating."
  },
  {
    "state": "Sacred Stillness",
    "session": "Sacred Water",
    "intent_tags": ["meditation", "stillness", "sacred"],
    "description": "Human voice air, water blur, and spacious stillness."
  },
  {
    "state": "Emotional Reset",
    "session": "Night Water",
    "intent_tags": ["overthinking", "reset", "stress", "anxious"],
    "description": "Quiet water-like atmosphere for emotional cooling."
  },
  {
    "state": "Calm Focus",
    "session": "Underwater Pulse",
    "intent_tags": ["focus", "work", "write", "study"],
    "description": "Low distraction pulse and soft atmosphere for steady attention."
  }
]
```

Each state card should link to the relevant session page and fire a tracking event.

---

# 7. User Intent Input

Add an input block under the state cards:

```text
Describe how you feel, or what state you want to enter.
```

Placeholder examples:

```text
anxious but tired
lonely but safe
can't sleep
need floating calm
overthinking at night
need calm focus
```

Button:

```text
Recommend a Session
```

The input does not need advanced AI in v1.

Use rule-based matching first.

---

# 8. Recommendation Engine v1

Create:

```text
/assets/js/recommender.js
/assets/data/recommendation_rules.json
```

## recommendation_rules.json

```json
{
  "sleep": {
    "keywords": ["sleep", "tired", "insomnia", "can't sleep", "bed", "rest"],
    "session_id": "lotus_sleep",
    "product_id": "lotus_sleep_pack"
  },
  "memory_air": {
    "keywords": ["lonely", "memory", "nostalgia", "reflection", "night", "safe"],
    "session_id": "memory_air",
    "product_id": "memory_air_pack"
  },
  "sacred_water": {
    "keywords": ["meditation", "zen", "pray", "sacred", "stillness", "spiritual"],
    "session_id": "sacred_water",
    "product_id": "sacred_water_pack"
  },
  "night_water": {
    "keywords": ["anxious", "stress", "overthinking", "reset", "sad", "heavy"],
    "session_id": "night_water",
    "product_id": "night_water_pack"
  },
  "underwater_pulse": {
    "keywords": ["focus", "work", "write", "study", "deep work", "concentrate"],
    "session_id": "underwater_pulse",
    "product_id": "underwater_pulse_pack"
  }
}
```

## Logic

If user input matches keywords:

```text
show recommended session card
show reason
show preview button
show Etsy product link
show email signup
```

Example output:

```text
Recommended: Memory Air Session

Why:
You described a reflective or lonely night state.
Memory Air is designed for floating memory, soft safety, and low-tension emotional drift.
```

If no keyword matches:

```text
show Memory Air as default
ask user to choose a state card
record unmatched input
```

---

# 9. Sessions Data Model

Create:

```text
/assets/data/sessions.json
```

Each session:

```json
{
  "id": "memory_air",
  "title": "Memory Air Session",
  "state": "Floating Reflection",
  "dna": "lotus.secret_garden.memory_air.v0.3",
  "description": "A quiet consciousness environment for floating memory and safe loneliness.",
  "consciousness_signature": {
    "safety": 8.5,
    "float": 9,
    "memory_residue": 9,
    "sacredness": 7,
    "tension": 2.5,
    "loopability": 8,
    "dream_blur": 8,
    "human_presence": 7,
    "emotional_micro_disturbance": 4
  },
  "layers": [
    "memory_fragments",
    "human_air",
    "water_blur",
    "underwater_pulse",
    "consciousness_drift"
  ],
  "preview_audio": "assets/audio/previews/memory_air_preview.mp3",
  "cover": "assets/img/covers/memory_air.jpg",
  "youtube_url": "",
  "etsy_url": "",
  "recommended_for": [
    "late night reflection",
    "soft loneliness",
    "journaling",
    "emotional floating"
  ]
}
```

---

# 10. Product Data Model

Create:

```text
/assets/data/products.json
```

Each product:

```json
{
  "id": "memory_air_pack",
  "title": "Memory Air Pack",
  "platform": "Etsy",
  "price_range": "$9-$19",
  "description": "A downloadable consciousness session pack for floating memory and night reflection.",
  "includes": [
    "MP3 version",
    "WAV version",
    "Loop version",
    "Session artwork",
    "Listening guide",
    "DNA description"
  ],
  "etsy_url": "",
  "related_session_id": "memory_air"
}
```

---

# 11. Session Page Layout

Each session page must show:

```text
Title
State
Short description
Preview player
Consciousness signature
Layer explanation
Recommended use
Product CTA
Feedback CTA
```

## Example Page Copy

```text
Memory Air Session

For floating reflection, safe loneliness, and night-water memory.

This session is built from five consciousness layers:
memory fragments, human air, water blur, underwater pulse, and consciousness drift.

Best for:
- late-night journaling
- emotional reset
- quiet reflection
- soft background listening
```

CTA:

```text
Get the Full Session Pack
```

Secondary CTA:

```text
Tell us how this made you feel
```

---

# 12. Feedback Loop

Add a feedback form after each preview:

```text
How did this session affect you?
```

Fields:

```text
session_id
user_intent
effect_rating 1-5
selected_effects:
  - calmer
  - sleepy
  - floating
  - emotional
  - focused
  - no effect
free_text_feedback
email optional
timestamp
```

Purpose:

```text
Build Structure → Consciousness Mapping
```

---

# 13. Backend Options

## Phase 1: No backend fallback

If Supabase is not ready, save user intent and feedback to:

```text
localStorage
```

and show:

```text
Thanks. Your response helps shape future sessions.
```

Also provide optional mailto or form placeholder.

## Phase 2: Supabase

Use Supabase for:

```text
auth
user profiles
intent logs
recommendation events
feedback events
email list
```

Recommended tables:

```sql
create table user_intents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_id uuid null,
  raw_input text,
  matched_state text,
  recommended_session_id text,
  recommended_product_id text,
  source text
);

create table session_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_id uuid null,
  session_id text,
  user_intent text,
  effect_rating int,
  selected_effects text[],
  free_text_feedback text,
  email text
);

create table email_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text unique,
  preferred_state text,
  source text
);
```

---

# 14. Login Strategy

Do not force login first.

Use this order:

```text
1. User selects state or enters intent
2. User gets recommendation
3. User listens to preview
4. Then ask:
   "Save your session history?"
5. Email / magic link signup
```

Login copy:

```text
Save your Memory Air path.
Get new sessions based on your state history.
```

Avoid:

```text
Create account to continue.
```

That creates friction.

---

# 15. Tracking Events

Create:

```text
/assets/js/tracking.js
```

Track events:

```json
[
  "state_card_clicked",
  "intent_submitted",
  "session_recommended",
  "preview_played",
  "product_cta_clicked",
  "feedback_submitted",
  "email_signup"
]
```

Event object:

```json
{
  "event": "intent_submitted",
  "raw_input": "anxious but tired",
  "matched_state": "night_water",
  "recommended_session_id": "night_water",
  "timestamp": ""
}
```

If Supabase is not configured, log to console and localStorage.

---

# 16. Visual Direction

Use:

```text
dark premium
moonlight water
soft glow
floating particles
sacred minimalism
slow breathing transitions
```

Avoid:

```text
startup dashboard
bright SaaS colors
dense tables
AI chatbot look
generic music player
```

Suggested palette:

```text
background: #05070A
surface: #0E151A
text: #E8EFEF
muted: #8FA3A3
accent: #B7D9D0
gold-soft: #D8C79A
```

UI feel:

```text
slow
quiet
spacious
breathing
premium
```

---

# 17. Homepage Content Blocks

## Block 1 — Hero

```text
What state do you want to enter tonight?
```

## Block 2 — State Selector

Five states.

## Block 3 — Intent Input

Free text recommendation.

## Block 4 — Featured Session

Start with:

```text
Memory Air Session
```

## Block 5 — Why This Exists

Copy:

```text
Spring of Zen creates consciousness sessions: sound environments designed for sleep, reflection, sacred stillness, emotional reset, and floating memory.

We do not publish music as content volume.
We study how layers of sound help people enter different inner states.
```

## Block 6 — Memory Air

Copy:

```text
Memory Air is our first premium session line:
soft human voice air, water blur, distant lotus bells, and low-tension emotional drift.
```

## Block 7 — Email Signup

```text
Join the Memory Air Sessions.
Receive new consciousness environments and listening notes.
```

---

# 18. Copyright / Ownership Workflow

Every published session must have a manifest:

```json
{
  "brand": "Spring of Zen",
  "sub_brand": "Memory Air",
  "session_id": "",
  "dna": "",
  "source_seed": "",
  "mutation_tool": "Suno",
  "human_arrangement": true,
  "arrangement_notes": [
    "intro edited",
    "bell spacing adjusted",
    "pulse reduced",
    "voice air softened",
    "outro extended"
  ],
  "final_mix_file": "",
  "release_date": "",
  "youtube_url": "",
  "etsy_url": ""
}
```

Do not publish raw AI output as final brand asset.

Every final published file should include:

```text
Human Arrangement Layer
```

---

# 19. Product Recommendation Logic

On each recommendation result, show:

```text
Free Preview
Full Session Pack
Join Email List
```

Example:

```text
Recommended: Memory Air Session

Free:
Listen to the 3-minute preview.

Full Pack:
Download the 30-minute loop, WAV master, artwork, and listening guide.

Subscribe:
Get new Memory Air experiments.
```

---

# 20. Codex Execution Plan

Codex should perform these steps:

## Step 1

Inspect existing repository structure.

## Step 2

Preserve current working audio/player code.

## Step 3

Add or update:

```text
index.html
sessions.html
session.html
products.html
lab.html
assets/js/recommender.js
assets/js/tracking.js
assets/data/sessions.json
assets/data/products.json
assets/data/recommendation_rules.json
```

## Step 4

Implement state selector and intent input.

## Step 5

Implement rule-based recommendations.

## Step 6

Implement localStorage tracking fallback.

## Step 7

Prepare Supabase optional config but do not require it to run.

## Step 8

Add product CTA placeholders for Etsy.

## Step 9

Add email signup placeholder.

## Step 10

Test locally with:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

# 21. Acceptance Criteria

The website upgrade is successful if:

1. Homepage asks what state the user wants to enter.
2. User can select a state.
3. User can type a goal.
4. System recommends a session.
5. Recommendation includes why.
6. Recommendation links to preview / product.
7. Feedback can be submitted.
8. Events are stored in localStorage if backend is absent.
9. Site still works as static GitHub Pages.
10. Design feels premium, quiet, and not like generic AI music.

---

# 22. Most Important Product Principle

Do not ask:

```text
What music do you want to hear?
```

Ask:

```text
What state do you want to enter?
```

That is the entire brand difference.

---

# 23. Long-Term Evolution

Phase 1:

```text
Rule-based recommendations
```

Phase 2:

```text
Supabase user history
```

Phase 3:

```text
AI-assisted consciousness recommender
```

Phase 4:

```text
Adaptive Memory Air subscriptions
```

Phase 5:

```text
Personalized consciousness sessions
```

---

# 24. Final Direction

Spring of Zen is not a music archive.

It is:

```text
a gateway into inner states.
```

Memory Air is not a product category.

It is:

```text
a language for floating memory, safe loneliness, and night-water reflection.
```

The website must make this obvious in the first 10 seconds.

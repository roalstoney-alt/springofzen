# MyNest Magic Room Technical Spike v0.1

Status: software prototype implemented; physical-room validation pending

Target layer: L0 projection world

Route: `/mynest/magic-room/`

## 1. Decision

Use the browser as the lowest-stack L0 implementation for the first controlled room test. It already supports the shared world-state engine, three world skins, slow room-scale motion, generated ambience, manual calibration, a repeatable 10-second share moment, and privacy-preserving observations without a tracking stack.

This is a software readiness decision, not a physical-projector acceptance. `STATIC_ROOM_TRANSFORMATION` remains pending until the experience is tested in an actual room with target projector hardware.

## 2. Implemented architecture

| Layer | v0.1 implementation | Purpose |
|---|---|---|
| World configuration | `worlds.js` frozen configuration | Keeps the 8 shared states and world-specific characters, palettes, events, return triggers, and bedtime phrases separate |
| Renderer | HTML, CSS, and inline SVG | Runs without a game engine or downloaded visual assets |
| Interaction | Large pointer controls and state console | Tests simple child-directed agency without sensing or tracking |
| Sound | Web Audio oscillators | Low-volume generated ambience; no microphone or stored media |
| Room fit | Manual horizontal, vertical, and brightness controls | Provides a basic operator calibration layer |
| Persistence | Browser local storage | Keeps anonymous state and observations on the device by default |
| Pilot sync | Strict allowlist client and Worker endpoint | Sends structured observations only after explicit consent |
| Storage | D1 `mynest_magic_room_events` | Stores checkpoint rows under anonymous pilot codes |

No camera, microphone, face recognition, pose tracking, child profile, image upload, video upload, or free-text observation is part of v0.1.

## 3. Current capability

### Ocean / Lumisea — hero, approximately 80%

- all eight engine states;
- Milo lead character and supporting character canon;
- five daily-event concepts;
- recurring return trigger and bedtime phrase;
- slow cross-room share moment;
- manual room-fit controls; and
- first-exposure through Day 14 structured observation flow.

The remaining 20% is physical room mapping, projector/color tuning, finalized audio/visual assets, timed story direction, and observed child-use refinement.

### Forest / Mosswood and Space / NovaNest — architecture proofs, approximately 40%

Both worlds have the full state skeleton, palette, lead character, event concepts, return trigger, bedtime phrase, and share-moment concept. They intentionally do not have hero-world content depth in this sprint.

## 4. Engine evaluation

| Option | L0 speed | Room mapping | Content iteration | Tracking path | Pilot recommendation |
|---|---:|---:|---:|---:|---|
| Browser / WebGL-capable web stack | High | Basic now; extensible | High | Possible later | **Use for Spike A** |
| TouchDesigner | Medium | Strong | Medium | Strong | Compare in Spike B if real-room mapping blocks the browser |
| Unity | Low–medium | Strong with engineering | Medium | Strong | Defer until L1 evidence |
| Unreal | Low | Strong but heavy | Lower for this team stage | Strong | Not justified for L0 |

The browser keeps the experiment fast, inspectable, deployable, and hardware-light. TouchDesigner is the first comparison candidate only if projector warping, multi-surface mapping, or operator cueing cannot meet the physical acceptance criteria.

## 5. Physical test setup

Minimum target setup:

- one securely mounted or inaccessible projector;
- laptop or small computer running a modern browser;
- optional low-volume speaker;
- blackout control sufficient to see the image without excessive brightness;
- secured power and signal cables outside walking paths; and
- an adult operator with immediate access to stop, sound, and brightness controls.

Before a child session, run a 20-minute heat and stability check, inspect the full walking path, set the lowest comfortable brightness, confirm no beam points into eyes, test sound-off behavior, confirm reduced-motion behavior, and verify that no camera or microphone permission is active.

## 6. Acceptance matrix

| Gate | Status | Evidence required |
|---|---|---|
| `SOFTWARE_WORLD_ENGINE` | PASS | Three configurations and all eight states render and can be selected |
| `PRIVACY_BY_DEFAULT` | PASS | Local-only by default; explicit pilot consent; strict field allowlist |
| `NO_TRACKING_L0` | PASS | No camera, microphone, recording, or sensing code |
| `OCEAN_SOFTWARE_PREVIEW` | PASS | Ocean sequence, character, ambience, event, wind-down, sleep, and share moment run in browser |
| `STATIC_ROOM_TRANSFORMATION` | PENDING_REAL_ROOM | Wall/ceiling/bed-area composition is recognizable and stable on target hardware |
| `PHYSICAL_SAFETY` | PENDING_REAL_ROOM | Projector, heat, cable, brightness, sound, and supervision checklist passes |
| `OCEAN_PILOT_READY` | PENDING | Both pending real-room gates pass and observation sync is verified against production storage |

The project must not report `OCEAN_PILOT_READY = PASS` from browser screenshots alone.

## 7. Real-room test script

1. Open `/mynest/magic-room/` on the target computer.
2. Confirm no browser camera or microphone permission is granted.
3. Enter full screen and use the calibration grid to fit the safe projection area.
4. Lower brightness until comfortable, then inspect all seating and bed positions for direct eye exposure.
5. Run the eight states in order with sound off, then at the intended low volume.
6. Run the 10-second share moment and verify there is no flashing, sharp luminance jump, or fast motion.
7. Confirm controls remain usable after 30 minutes and that the device/projector remains stable and ventilated.
8. With a consented adult test record, submit one checkpoint and verify only allowlisted structured fields reach D1.
9. Record the physical pass/fail result in a new dated test record; do not overwrite this frozen plan.

## 8. Next technical gates

Proceed in this order:

1. real-room static projection validation;
2. Ocean timing and luminance tuning;
3. production observation storage verification;
4. 3–5 household L0 pilot;
5. evidence review for Room Gravity and novelty decay; and
6. only then decide whether L1 sensing, TouchDesigner comparison, or additional world content is justified.

L2 commercialization, custom hardware, paid acquisition, and sleep-outcome claims are outside this technical spike.

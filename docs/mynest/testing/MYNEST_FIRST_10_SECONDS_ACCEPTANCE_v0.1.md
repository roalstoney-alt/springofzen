# MyNest First 10 Seconds Acceptance v0.1

Status: executable QA protocol

## Test conditions

- first visit with local storage cleared;
- sound off;
- no parent explanation;
- desktop and mobile viewport runs;
- normal motion and `prefers-reduced-motion` runs;
- record the 10-second Magic Moment at least once.

## Automated evidence

At each timepoint capture the visible state and confirm:

| Time | Required evidence |
|---:|---|
| 0 seconds | a real child’s room dominates the viewport |
| 2 seconds | first water ripple is visible |
| 5 seconds | wall/ceiling transformation and small life are visible |
| 8–10 seconds | Milo is visible within room geometry |
| ready state | bed, lamp, shelf, and Milo interactions work without modal text |
| Rest + 10 seconds | fish are absent, movement is reduced, and Moon Ocean is visible |

## Acceptance gates

- `REAL_ROOM_FIRST_SCREEN`: room is recognizable before magic.
- `OCEAN_WAKE`: transformation progresses from a local ripple instead of a full-screen cut.
- `GEOMETRY_OCCLUSION`: curtain, shelf, and bed masks visibly cover animated elements.
- `MILO_ROOM_INTERACTION`: Milo entrance and four responses complete.
- `CHILD_DISCOVERABLE_INTERACTION`: at least one room object produces immediate visual feedback.
- `MOON_OCEAN_TRANSITION`: Rest becomes clearly calmer than Explore.
- `MAGIC_MOMENT`: 10-second replay has no UI overlay and explains the room-to-ocean change visually.
- `MOBILE`: portrait room asset and interactions remain active with no horizontal overflow.
- `DESKTOP`: room uses the full viewport and preserves geometry.
- `REDUCED_MOTION`: experience works with continuous movement disabled.
- `BACKEND_REGRESSION`: existing Worker and privacy tests pass with no backend diff.

## Human gates

Before a public household pilot:

1. Run a no-explanation test with 1–2 children and a supervising parent.
2. Observe first look, first touch, Milo recognition, object exploration, and replay request.
3. Record the projected display with a normal phone.
4. Confirm the room still looks real, Milo is visible, and the transformation is understandable without narration.

Human results must be recorded separately. Browser QA cannot fabricate child response, physical projector safety, or a real phone-recording result.

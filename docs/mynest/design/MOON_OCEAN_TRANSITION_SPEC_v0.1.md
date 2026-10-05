# Moon Ocean Transition Specification v0.1

Status: implemented for browser L0.5

## Intent

Rest mode must make the same room visibly calmer without explaining that it is a bedtime mode.

## Transition

Over approximately 9–13 seconds:

1. background fish and pointer-following fish fade;
2. caustic contrast reduces;
3. the room shifts toward dark blue;
4. Milo glides toward the bed, becomes smaller, and rests farther away;
5. Moon Ray crosses the room slowly;
6. a moon reflection settles on the upper wall/ceiling;
7. movement approaches a near-still loop; and
8. one phrase appears: “The ocean is quiet now.”

## Safety

- no flashes or hard cuts;
- no sudden character entrance;
- no high-contrast pulse;
- no automatic audio;
- sound remains optional and quiet;
- `prefers-reduced-motion` removes continuous/parallax animation and uses fades.

## State comparison

Explore has the highest—but still gentle—motion and interaction density. Story reduces background movement to emphasize three room-bound moon shells. Rest is the darkest, slowest, and least interactive state.

## Acceptance

The transition passes when a parent can see, without explanatory copy, that the playful room has become quiet. Physical projection brightness and real-room comfort remain a separate supervised test.

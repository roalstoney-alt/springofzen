# Baby Fish Behavior v0.1

## Population and appearance

Three realistic juvenile reef fish are visible by default. Two inactive DOM slots preserve a hard technical maximum of five. The family uses silver-blue pearl tones, slight warm accents, natural translucency, and transparent backgrounds. No cartoon faces or neon color are allowed.

## State model

`MOVE → SLOW/OBSERVE → HIDE → WAIT → RETURN`

- MOVE: one finite low-zone pass lasting about seven seconds.
- SLOW/OBSERVE: fish stop and orient briefly.
- HIDE: fish retreat toward the Reef or furniture edge.
- WAIT: absence is allowed and desirable.
- RETURN: fish re-enter softly before resuming autonomous timing.

The cycle is time-driven and finite; movement does not loop continuously. Fish stay in the floor/lower-wall band and vary scale with implied depth.

## Child response

Pointer movement alone does not attract fish. A first low-zone touch causes a short observation response. A second touch can produce a brief follow response; afterward fish hide or return to autonomous movement. Response delay is 150–800 ms where applicable. A child never gains permanent steering.

Reduced-motion mode replaces broad motion with short fades and stable resting positions.

# MyNest Forest Meadow Floor A/B Test v0.1 — Execution Report

## Outcome

- A remains the exact deployed Forest Room control asset set.
- B adds six floor-only meadow variants: Day, Night, and Lights-Off for desktop and mobile.
- Comparison is explicit and review-only: `?floor=a` and `?floor=b`.
- The clean public route defaults to A. No random assignment, persistence, analytics, PII, or backend work was added.

## Single-variable lock

The B assets were edited from each matching A asset with built-in ImageGen. A protected-region composite then restored the original non-floor pixels around the bed, canopy, tree, window, deer, furniture, mushroom lamps, room edges, and foreground objects. The same floor mask is used for all three modes in each aspect ratio.

Only the open floor treatment changes materially: the stone/soil-heavy path becomes short, soft, dry meadow grass with restrained small flower accents and visible open stepping space. Existing lamp positions and each mode's lighting remain tied to the A source.

## Review routes

- Control A: `https://www.springofzen.com/mynest/forest-room/?floor=a`
- Meadow B: `https://www.springofzen.com/mynest/forest-room/?floor=b`

The query accepts only the literal value `b`; missing or invalid values resolve to A.

## ImageGen prompt set

Mode: built-in ImageGen, `precise-object-edit`.

Each prompt used the matching deployed A asset as the edit target. The normalized instruction was: change only the visible indoor floor into 85–95% short, plush, dry, clean grassy textile/turf; retain 5–10% small white, pink, and lavender flower accents; keep at least 55% visually open stepping area; preserve every non-floor object, camera, geometry, outdoor view, and mode-specific light; add no objects, animals, furniture, lamps, mud, soil, wet moss, roots, stones, text, logos, or watermarks.

## Verification contract

- All six A files are SHA-256 locked and unchanged.
- All six B files are separate lossless WebP assets.
- Protected non-floor pixels: maximum A/B channel delta `0` for all six pairs.
- Static fallback remains A.
- Day/Night/Lights-Off controls and copy are unchanged.
- Firefly, meadow-response, reduced-motion, and Lights-Off stop behavior are unchanged.
- No backend or telemetry calls were added.

## QA result

- Forest Meadow A/B QA: PASS
- Forest Room regression: PASS
- Desktop A/B visual QA: PASS
- Mobile A/B visual QA at 390 × 844: PASS
- Horizontal overflow: none
- Night runtime: four visible fireflies
- Lights-Off runtime: fireflies `0`, stars `0`, meadow response disabled
- Browser console errors/warnings: `0`
- Ocean current-version regressions: PASS
- Space current-version regressions: PASS
- Search/privacy regressions: PASS
- Backend tests: 22/22 PASS

## Human review question

Does B make a parent and a 3–7 year old child want to step onto the floor barefoot while still feeling like the same enchanted Forest Room?

# Ocean Room 001 — Night Lighting v0.3.1

Status: implemented for browser review; physical projector calibration remains pending.

## Paired assets

- Desktop DAY: `assets/ocean-room-base-v03-desktop.jpg`
- Desktop NIGHT: `assets/ocean-room-base-v03-desktop-night.jpg`
- Mobile DAY: `assets/ocean-room-base-v03-mobile.jpg`
- Mobile NIGHT: `assets/ocean-room-base-v03-mobile-night.jpg`

The NIGHT images are lighting edits of their matching DAY masters. They were not regenerated as new rooms. Camera, crop, furniture, physical Milo, Shell Light, Reef Accent, shelf, curtain, window, floorboards, and wall/floor boundary remain fixed.

## Geometry verification

SIFT feature matching with RANSAC partial-affine estimation produced:

| Composition | Inlier matches | Scale | Rotation | Translation |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 48 | 1.001123 | 0.023039° | −0.415px, −1.682px |
| Mobile | 39 | 1.000122 | −0.002411° | 0.038px, −0.376px |

These deviations are below two pixels and do not require interaction-mask changes.

## Runtime contract

The only room-light states are `day`, `dusk`, and `night`, exposed as `data-room-light` on the document body.

- Rest request: fish slow after 0.3 seconds.
- DAY → DUSK: begins after 0.8 seconds.
- Shell warming: begins after 1.5 seconds through the paired-art blend.
- Fish exit: begins after 2 seconds.
- DUSK → NIGHT: begins after 3 seconds.
- Milo recognizes bedtime after 4.5 seconds.
- Milo travels home after 5.2 seconds, when the NIGHT blend is substantially complete.
- Final sleep: the physical room remains visible under the Shell Light; digital fish and digital Milo are absent.

Leaving Rest reverses NIGHT → DUSK → DAY over 3.7 seconds. Fish do not return until DAY is restored. Reduced-motion mode keeps the same time-of-day semantics and uses opacity crossfades rather than moving light.

## Image-edit prompt summary

Built-in ImageGen `lighting-weather` edit mode changed only the exterior time, room exposure, daylight reflections, Shell illumination, ambient color temperature, and physically consistent shadows. The edit explicitly prohibited object movement, geometry drift, stars, moon graphics, fish, ocean effects, fantasy scenery, text, UI, added objects, removed objects, and a flat black-overlay appearance.

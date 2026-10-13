# Space Room Immersive Technology Stack v0.1

## Purpose

This spike compares technology classes for a future physical MyNest Space Room. It does not authorize a purchase, vendor selection, sensor deployment, or privacy-scope change. The web Mission 001 prototype remains camera-free and uses Canvas 2D layered compositing.

## Experience target

- Wall and ceiling should read as one spatial field rather than separate screens.
- The Sleep Command Pod, Orbit Dock, Navigation Beacon, and a small amount of architecture remain physical anchors.
- Projection begins at the Pod emitter, expands to room scale, and reverses into the emitter before Sleep.
- Interaction is environmental acknowledgement, not direct game-style control.

## Projection layouts

### Option A — one projector

Coverage: one primary wall, with limited ceiling spill when mounted and mapped carefully.

Advantages: lowest calibration and maintenance burden; simplest content output; best first physical proof of scale.

Constraints: one child or Pod may cast a strong shadow; ceiling and side-wall continuity are limited; a single ultra-short-throw unit may require careful mounting to avoid the bed structure.

Best use: validate Earth scale, Galaxy scale, and the Return ritual before expanding surface coverage.

### Option B — two projectors

Coverage: main wall plus ceiling, or two overlapping wall fields.

Advantages: materially better spatial continuity; a second angle can reduce a dominant shadow; supports an architectural cabin-to-space transition.

Constraints: edge blending, color matching, geometry calibration, and thermal/noise management become necessary.

Best use: controlled pilot room after the one-projector WOW gate passes.

### Option C — three projectors

Coverage: main wall, ceiling, and one side field.

Advantages: strong peripheral immersion while retaining a visible physical exit and Pod anchor; better support for wide Galaxy layers and navigation depth.

Constraints: increased shadow paths, calibration time, render outputs, brightness matching, and installation cost.

Best use: a dedicated demonstration room with repeatable geometry and trained setup.

### Option D — four projectors

Coverage: main wall, ceiling, and both side fields with the largest practical continuous volume.

Advantages: highest coverage and strongest scale illusion; multiple angles can distribute shadows.

Constraints: highest edge-blend and synchronization complexity; more heat, noise, service points, and failure modes; demands a robust local render and calibration system.

Best use: only after child testing proves that added peripheral coverage improves desire and return rather than merely increasing spectacle.

## Technology classes

| Class | Role | Strength | Main risk / question |
| --- | --- | --- | --- |
| Ultra-short-throw projection | Large imagery close to a wall | Reduced throw distance and fewer walk-through shadows | Bed geometry, wall flatness, brightness, and safe mounting |
| Projection mapping | Align content to room architecture | Preserves panels, Pod emitter, window, and physical anchors | Calibration drift and content authoring overhead |
| Multi-projector edge blending | Create a continuous field | Wall-to-ceiling and side-field continuity | Color/brightness matching and seam stability |
| TouchDesigner | Rapid spatial-media prototyping | Strong mapping, sensor routing, and iteration tools | Runtime licensing, operator knowledge, and deployment repeatability |
| Unity | Structured real-time 3D application | Mature interaction, scene, audio, and hardware ecosystem | Build complexity and a heavier maintenance stack |
| WebGL / browser runtime | Portable mission engine | Fast iteration and alignment with the web prototype | Hardware/browser variability and kiosk hardening |
| Depth camera | Body/hand position without wearables | Natural spatial interaction | Privacy wording changes and occlusion behavior |
| Time-of-flight sensor | Coarse local depth zones | Can support presence/hand zones with less imagery than RGB | Range, field of view, reflective surfaces, and sensor placement |
| LiDAR | Accurate spatial distance and mapping | Stable zone detection and geometry calibration | Cost, safety review, and unnecessary precision for early tests |
| Laser interaction sensing | Detect touch/gesture near a surface | Precise front-holo interaction zone | Alignment, eye-safety classification, and false positives |
| Local hand/body detection | Convert sensor input into zones | Enables acknowledgement without identity | Must remain local, ephemeral, and non-identifying |
| Spatial audio | Directional launch/return cues | Extends depth without visual clutter | Speaker placement, bedtime volume, and room acoustics |

## Interaction zones

- Zone A — Pod controls: Wake, Explore, Home.
- Zone B — standing area: nearby navigation acknowledges presence.
- Zone C — front holo field: nearby stars respond to a hand without making the Galaxy draggable.
- Zone D — sleep area: returning to the Pod can support the Home-to-Sleep handoff.

## Privacy boundary

The current web prototype uses no camera, microphone capture, account identity, or backend rendering request.

If a future physical prototype introduces depth or RGB sensing, public wording must change to: “No recording. Spatial interaction is processed locally.” The following remain prohibited:

- raw frame storage;
- raw frame upload;
- face identification;
- identity recognition;
- cloud video.

## Recommended evaluation order

1. Validate Mission 001 on the camera-free web prototype.
2. Test one-projector scale and Return with no sensing.
3. Compare one versus two projectors for shadowing and ceiling continuity.
4. Add only coarse local interaction after a separate privacy review.
5. Consider three or four projectors only if increased coverage improves child desire and repeat-launch behavior.

No vendor or product is selected by this document.

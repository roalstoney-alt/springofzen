# MyNest Space Immersive Mission Engine v0.3 — Deployment Report

## Render stack

- Existing static HTML/CSS page retained.
- Dependency-free Canvas 2D layered compositor added for the primary Mission 001 experience.
- Independent procedural layers: room light, far stars, deep-space nebula, oversized Earth limb, Galaxy field, route, near interaction stars, Orbit cue, floor reflection, and local Pod hologram.
- Independent desktop and mobile transparent foreground extractions preserve the frozen Pod, Orbit, and Beacon silhouettes over the real-time field without allowing stars to paint across the physical products.

## Mission state machine

- Explore automatically runs Pod Wake, Launch, Earth Orbit, Warp, Deep Space, and Galaxy Scale.
- Pointer, touch, and optional device orientation affect only nearby depth layers; the Galaxy is not directly draggable.
- Home interrupts any active stage and runs a seven-second reverse journey into Sleep.
- A completed Home-to-Sleep sequence locks Mission restart until Wake explicitly resets the cabin.

## Safety, accessibility, and fallback

- No strobe, white-out, aggressive camera motion, or high-frequency flashing.
- Wake, Explore, Home, and optional Sound controls remain keyboard-accessible and labelled.
- Sound is off by default and synthesized locally through Web Audio when explicitly enabled.
- Reduced-motion mode keeps Earth, Galaxy, scale, Return, and story semantics while removing streak and parallax acceleration.
- Canvas initialization failure falls back silently to the retained v0.2 Idle, Mission, Return, and Sleep images.

## Privacy and backend

- No camera or microphone capture.
- No render, interaction, analytics, or audio request is sent to a backend.
- Existing public “No camera” wording is unchanged.
- Worker, D1 schema, pilot data, Search architecture, Ocean Room, Method, Results, and commerce facts are unchanged.

# Ocean Real Room Scene Specification v0.2

Status: implementation baseline

## Objective

The first frame must read as a credible child’s bedroom before any ocean effect appears. The ocean is rendered in separate code-driven layers so the base room remains legible throughout the transformation.

## Base assets

- Desktop: `mynest/magic-room/assets/ocean-room-base-v02.jpg`, 1672 × 941.
- Mobile: `mynest/magic-room/assets/ocean-room-base-mobile-v02.jpg`, 941 × 1672.
- Both source scenes are generated project assets with no people, text, logos, projected effects, or embedded ocean animation.

Required anchors are visible in both compositions: ceiling, main wall, window, curtain, low bookshelf, single bed, bedside table, lamp, and whale room-friend.

## Layer order

1. real-room image;
2. dusk and ocean wash;
3. caustic light and ceiling surface;
4. environmental fish;
5. Milo and interactive responses;
6. foreground geometry occlusion;
7. room hit zones;
8. minimal experience UI.

## Geometry masks

The scene applies responsive CSS clipping masks to virtual elements. Milo’s lower-right silhouette is clipped as he moves behind the headboard; his full silhouette returns when he turns toward the child. Fish disappear at the shelf boundary, the window has a bounded depth layer, and the ceiling ocean is clipped to the photographed ceiling plane. This creates visual occlusion without computer vision or obvious repeated-photo rectangles.

Desktop geometry regions:

- curtain: left 8–20%, top 0–85%;
- bookshelf: left 20–47%, top 46–86%;
- bed: foreground polygon beginning near x 29%, y 59%.

Mobile geometry regions:

- curtain: left 0–26%, top 8–69%;
- bookshelf: left 22–51%, top 47–68%;
- bed: foreground polygon beginning near x 9%, y 61%.

The geometry coordinates must be checked whenever either base composition changes.

## Wake timing

- 0–1.2 seconds: still real room;
- 1.2–2.7 seconds: first bedside ripple;
- 2.7–4.4 seconds: water light climbs wall and ceiling;
- 4.4–6.2 seconds: small fish emerge near room boundaries;
- 6.2–10.1 seconds: Milo enters from the curtain/window side and crosses behind foreground geometry;
- after 10.1 seconds: Explore, Story, and Rest controls become available.

No stage uses strobe, rapid flashing, hard luminance cuts, aggressive zoom, or surprise audio.

## Responsive behavior

The desktop and mobile assets are independent compositions of the same room concept, not a landscape crop presented as a mobile slideshow. Code-driven layers and all four interactions remain active on both layouts.

## Change boundary

This document governs the visual front end only. It does not change the Worker, D1 schema, consent contract, or pilot event fields.

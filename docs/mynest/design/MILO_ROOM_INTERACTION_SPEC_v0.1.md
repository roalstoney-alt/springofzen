# Milo Room Interaction Specification v0.1

Status: implemented for browser L0.5

## Character identity

Milo is a large moon-blue whale with a pale belly, dark blue shoulder marking, recognizable eye, small smile, broad tail, and slow signature glide. The silhouette must remain recognizable at wall scale and thumbnail size.

## Entrance

1. A soft shadow appears near the window/curtain boundary.
2. Milo’s tail and body emerge from the left.
3. Milo crosses the main wall slowly.
4. The repeated-room mask places the curtain, bookshelf, and bed foreground above Milo.
5. Milo settles near the bed and looks toward the viewer.

The entrance takes approximately six seconds and is never fast or startling.

## Interactions

### Bed

Milo changes course toward the bed, scales slightly smaller to imply depth, and releases a gentle bubble cluster. The bed mask remains above Milo.

### Lamp

The lamp interaction warms the room-light layer and introduces a Nini-like glow near the physical lamp. It demonstrates a virtual response tied to a visible room object.

### Bookshelf

Nearby fish vanish toward the shelf boundary and Pip appears from behind the shelf mask. Pip remains a discovery detail; Milo stays the hero.

### Milo

Milo slows, makes one small circle, approaches slightly, releases bubbles, and—when audio has been enabled—plays one soft synthesized whale tone.

## Pointer and touch

A three-fish school follows pointer or touch movement with delayed easing. No camera, microphone, body tracking, face tracking, or simulated computer-vision claim is used.

## Local QA events

The page exposes an in-memory-only `window.MYNEST_LOCAL_QA_EVENTS` array containing `ROOM_LOADED`, `OCEAN_WOKE`, `MILO_SEEN`, room-object interactions, `REST_STARTED`, and `MAGIC_MOMENT_PLAYED`. These events are not persisted or sent to the production backend.

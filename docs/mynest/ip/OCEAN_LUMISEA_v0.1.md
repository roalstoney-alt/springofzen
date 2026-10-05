# Ocean / Lumisea v0.1

Status: hero-world IP ready for L0 prototype. `Lumisea` and all character names
are working names pending IP review.

## World premise

Lumisea is a moonlit sea that wakes across the room when the child enters. It
feels large but not loud: the reef sits low on the wall, open water moves across
the main surface, and moon current rises toward the ceiling. Familiar
characters cross those zones so the room—not a rectangular screen—feels alive.

## Visual identity and geography

- Deep navy distance, teal water, pale aqua caustics, moon-pearl highlights.
- Reef: low wall anchor and Pip's discovery zone.
- Open water: Milo's crossing path.
- Moon current: ceiling and wind-down path.
- Bed cove: the final calm position, never a high-action zone.

Day state uses more visible reef detail and Pip movement. Night state removes
small fish, lowers contrast, introduces Nini and Moon Ray, and leaves Milo near
the bed cove.

## Characters

### MILO

```yaml
character_id: OCEAN_MILO
name: Milo
species_or_type: young whale
role: main companion and returning character
personality: curious, patient, quietly brave
visual_signature: round teal body, pale moon-current edge, small dark eye
movement_style: slow room-scale arcs with long pauses
sound_signature: two low warm notes
relationship_to_child: co-explorer, never instructor or judge
relationship_to_other_characters: protects Pip, follows Nini, listens to Moon Ray
play_behavior: crosses the room and responds to one bounded direction
bedtime_behavior: settles near the bed cove and reduces movement
repeat_phrase: I saved one ocean question for tomorrow.
```

### NINI

```yaml
character_id: OCEAN_NINI
name: Nini
species_or_type: glowing jellyfish
role: light and nighttime transition guide
personality: gentle, precise, unhurried
visual_signature: pearl-aqua glow with three slow trailing lines
movement_style: vertical drift; never fast or flashing
sound_signature: one soft glass-like tone
relationship_to_child: shows safe paths through darkness
relationship_to_other_characters: reveals Moon Ray's route
play_behavior: appears around discoveries
bedtime_behavior: dims in place during Wind Down
repeat_phrase: The quiet path is still here.
```

### PIP

```yaml
character_id: OCEAN_PIP
name: Pip
species_or_type: small sea turtle
role: discovery companion
personality: energetic within calm limits, observant, persistent
visual_signature: small amber-green shell
movement_style: short low-wall journeys and pauses near hidden objects
sound_signature: soft three-note pluck
relationship_to_child: accepts help finding one route
relationship_to_other_characters: learns from Milo and follows reef markers
play_behavior: leads one search or directional interaction
bedtime_behavior: returns to the reef before Wind Down ends
repeat_phrase: One small path at a time.
```

### MOON RAY

```yaml
character_id: OCEAN_MOON_RAY
name: Moon Ray
species_or_type: quiet manta-like nighttime guide
role: signals transition from story to rest
personality: calm, steady, sparse
visual_signature: broad silver-blue silhouette
movement_style: one slow ceiling pass
sound_signature: low filtered breath tone
relationship_to_child: marks the end of activity without issuing commands
relationship_to_other_characters: leads Milo and Nini into Moon Sea
play_behavior: none
bedtime_behavior: completes one pass, then becomes nearly still
repeat_phrase: The moon sea knows the way home.
```

## State implementation

| State | Ocean behavior |
|---|---|
| Entry | Near-static dark water; no character demand |
| Awaken | Caustics appear; Milo crosses into the room |
| Discover | One hidden shell glows near the reef |
| Interact | Parent-approved left/right controls guide Pip or Milo |
| Story | Short "Milo and the Moon Current" sequence |
| Wind Down | Small life leaves; Nini and Moon Ray appear; movement slows |
| Sleep | Near-static Moon Sea, low ambience or silence |
| Return | One silver-shell question remains for tomorrow |

## First five events

1. Meet Milo.
2. Find the Hidden Shell.
3. Help Pip Cross the Reef.
4. Moon Jellyfish Night.
5. Whale Song.

Only Day 1 is implemented in the first L0 software build; later events remain
canonically defined but locked until the physical-room spike is reviewed.

## Story v0.1: Milo and the Moon Current

Milo notices a silver shell pointing away from the reef. Pip finds one trail,
Nini lights another, and the child chooses which safe path to look at first.
Moon Ray reveals that both trails meet at the moon current. The characters
return the shell to the reef, reduce their movement, and leave its origin as
tomorrow's question. No outcome depends on the child choosing a correct path.

## Audio and sleep transition

Ocean play uses two low harmonic notes and optional gentle water ambience.
Wind Down lowers gain and removes upper detail. Sleep uses a single low steady
tone or silence. The frozen bedtime phrase is:

> The moon sea is quiet. Milo is nearby. The reef can rest now.

## MyNest Moment

Milo crosses the main wall, rises through the ceiling current, and settles near
the bed cove over ten seconds. The movement is slow, obvious, character-led, and
requires no editing. It contains no flash or hard cut.

## Forbidden Ocean patterns

No shark chase, threat narrative, storm during Wind Down, flashing jellyfish,
underwater jump scare, frantic fish school, autoplay through sleep, or generic
ocean footage that bypasses the character canon.

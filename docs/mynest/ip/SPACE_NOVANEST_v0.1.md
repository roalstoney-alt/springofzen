# Space / NovaNest v0.1

Status: 40% engine-reuse skeleton. Working names require IP review.

## Premise and identity

NovaNest is a quiet room-scale mission above a familiar blue planet. It uses a
fixed moon base, ceiling galaxy, orbit path, and three recognizable
constellations. The palette is midnight indigo, orbital blue, soft violet, and
moon gold. Space should feel expansive without becoming fast or noisy.

## Characters

```yaml
character_id: SPACE_ORBIT
name: Orbit
species_or_type: small robot
role: persistent lead companion
personality: helpful, earnest, gently curious
visual_signature: rounded silver body and indigo face panel
movement_style: floating steps and measured turns
sound_signature: warm two-tone electronic motif
relationship_to_child: mission partner, never commander
relationship_to_other_characters: reads Nova's map and follows Luna home
play_behavior: opens one destination or asks for one direction
bedtime_behavior: docks, dims panel, and ends mission
repeat_phrase: I saved the next coordinate for tomorrow.
```

```yaml
character_id: SPACE_NOVA
name: Nova
species_or_type: star guide
role: world navigator
personality: clear, confident, kind
visual_signature: four-point gold star with violet halo
movement_style: slow path between fixed constellations
sound_signature: one sustained high-soft tone
relationship_to_child: reveals options without testing knowledge
relationship_to_other_characters: provides Orbit's route
play_behavior: marks one planet
bedtime_behavior: becomes a fixed ceiling point
repeat_phrase: Every mission can pause safely.
```

```yaml
character_id: SPACE_COMET
name: Comet
species_or_type: playful motion character
role: bounded play event
personality: lively but predictable
visual_signature: pale blue body and long soft trail
movement_style: one room crossing per interaction
sound_signature: gentle filtered sweep
relationship_to_child: follows one large directional choice
relationship_to_other_characters: delivers parts to Orbit
play_behavior: crosses once, then rests
bedtime_behavior: absent after Wind Down begins
repeat_phrase: One crossing, then home.
```

```yaml
character_id: SPACE_LUNA
name: Luna
species_or_type: moon companion
role: bedtime guide
personality: quiet, protective, unhurried
visual_signature: crescent form and low cream glow
movement_style: slow descent toward moon base
sound_signature: low steady tone
relationship_to_child: marks mission completion without reward pressure
relationship_to_other_characters: guides Orbit back to dock
play_behavior: none
bedtime_behavior: holds near-static horizon glow
repeat_phrase: Mission complete. Time to rest.
```

## Engine proof

Entry holds stars still; Awaken brings Orbit online; Discover reveals one
planet; Interact guides one comet; Story follows a missing star map; Wind Down
returns to moon base; Sleep holds a near-static galaxy; Return queues one sealed
destination.

First five canonical events: Meet Orbit; Catch a Comet; Visit Mars; Repair
Orbit; Moon Mission.

The MyNest Moment is a ten-second slow launch trail that opens the ceiling
galaxy. No battle, explosion, alarm, strobe, countdown pressure, or continuous
rocket motion is permitted during Wind Down or Sleep.

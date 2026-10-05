# Forest / Mosswood v0.1

Status: 40% engine-reuse skeleton. Working names require IP review.

## Premise and identity

Mosswood is a room-scale forest that responds by becoming calmer as the room
becomes calmer. Its fixed geography is the Grand Tree, a low moss path, a
firefly clearing, and Oru's moon branch. The palette is deep green, moss, warm
firefly gold, and muted moon cream.

## Characters

```yaml
character_id: FOREST_MOMO
name: Momo
species_or_type: rabbit
role: approachable lead companion
personality: warm, observant, lightly playful
visual_signature: rounded ears and moss-brown silhouette
movement_style: short hops followed by long listening pauses
sound_signature: soft wooden two-note motif
relationship_to_child: invites noticing rather than speed
relationship_to_other_characters: follows Kiko and listens to Oru
play_behavior: reveals one path or plant
bedtime_behavior: rests at the Grand Tree roots
repeat_phrase: The forest heard you come back.
```

```yaml
character_id: FOREST_KIKO
name: Kiko
species_or_type: firefly
role: light and interaction guide
personality: curious and clear
visual_signature: one warm non-flashing glow
movement_style: slow arcs that follow large gestures
sound_signature: one soft bell tone
relationship_to_child: marks discoveries
relationship_to_other_characters: guides Momo toward the Grand Tree
play_behavior: gathers other fireflies
bedtime_behavior: dims and holds position
repeat_phrase: One light is enough to find the path.
```

```yaml
character_id: FOREST_ORU
name: Oru
species_or_type: owl
role: nighttime guide
personality: quiet, steady, economical
visual_signature: broad moon-shaped eyes
movement_style: one glide, then stillness
sound_signature: low two-note call
relationship_to_child: models quiet without demanding it
relationship_to_other_characters: watches Momo and Kiko return home
play_behavior: appears only late in story
bedtime_behavior: closes eyes as motion decreases
repeat_phrase: Mosswood can rest now.
```

```yaml
character_id: FOREST_GRAND_TREE
name: Grand Tree
species_or_type: living environmental landmark
role: persistent world anchor
personality: protective and slow
visual_signature: wide trunk and three recognizable branch paths
movement_style: growth measured in small changes, never sudden expansion
sound_signature: low wood resonance
relationship_to_child: remembers return through daily changes
relationship_to_other_characters: home landmark for all forest characters
play_behavior: reveals one leaf, door, or branch
bedtime_behavior: stops moving and holds warm root light
repeat_phrase: Tomorrow grows from here.
```

## Engine proof

Entry waits at the Grand Tree; Awaken moves leaves; Discover places three
fireflies; Interact wakes one plant; Story follows a moon leaf; Wind Down
introduces Oru; Sleep closes Oru's eyes; Return leaves one firefly at the tree.

First five canonical events: Meet Momo; Find Three Fireflies; Wake the Grand
Tree; Rainy Forest; Oru's Moon Night.

The MyNest Moment is a ten-second gathering of slow fireflies around the Grand
Tree. No flashing, rapid pursuit, loud animal call, threatening forest, or
growth animation continues through sleep.

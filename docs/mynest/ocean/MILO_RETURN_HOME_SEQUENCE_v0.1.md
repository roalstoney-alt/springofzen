# Milo Return Home Sequence v0.1

Sequence ID: `MILO_RETURN_HOME_v0.1`

Target duration: 12.4 seconds in normal motion; 2.5 seconds in reduced-motion mode.

## Sequence

1. **World quieting — 0–2.8 s.** Fish hide, touch responses stop, water light and ambience reduce.
2. **Milo notices bedtime — 2.8–5.2 s.** Milo turns toward the bed and pauses.
3. **Milo swims home — 5.2–9.2 s.** Milo travels through the transit zone and is clipped behind the headboard.
4. **Digital-to-physical transfer — 9.2–12.4 s.** Milo converges on the plush anchor, reduces scale and opacity, and disappears without a portal effect.
5. **Plush sleep — after 12.4 s.** One soft breathing-light cycle plays. The physical plush remains visible while all active creatures are absent.

Final copy: “Milo is sleeping.”

## State mapping

`MILO_IDLE → MILO_RETURN_HOME → MILO_SLEEP`

Explore or Story cancels the return sequence and restores the room resident safely. Re-entering Rest restarts the sequence from world quieting.

## Acceptance

- Room geometry remains visible throughout.
- Milo crosses behind the bed boundary before transfer.
- The digital Milo and plush occupy a converging location.
- Final state contains no active fish or looping character animation.
- Reduced motion communicates the same state change without travel animation.

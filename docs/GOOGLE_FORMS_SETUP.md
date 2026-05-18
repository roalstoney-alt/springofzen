# Google Forms Setup

Use one form for all tracks during v0.1.

## Title

```text
Consciousness Audio Lab — Track Feedback
```

## Subtitle

```text
You are participating in an experimental study exploring how sound structures interact with attention, emotion, memory, and inner state.

Please listen first, then answer the feedback questions below.
```

## Section 1 — Basic Listening

1. Track ID
   - Type: Short answer
   - Description: Example: DNA_20260518_v01
   - Required
2. Did you listen to most of the track?
   - Type: Multiple choice
   - Options: Yes, Partially, No
   - Required

## Section 2 — Core Feedback

3. Can you listen to the full track comfortably?
   - Type: Linear scale 1 to 5
   - Labels: 1 = difficult, 5 = very easy
4. Would you replay this track?
   - Type: Linear scale 1 to 5
   - Labels: 1 = no replay, 5 = definitely replay
5. Did this track create a noticeable inner state?
   - Type: Linear scale 1 to 5
   - Labels: 1 = none, 5 = very strong
6. Emotional resonance
   - Type: Linear scale 1 to 5
   - Labels: 1 = disconnected, 5 = deeply resonant
7. Would you share this track with someone?
   - Type: Linear scale 1 to 5
   - Labels: 1 = no, 5 = definitely

## Section 3 — Open Feedback

8. What did you feel while listening?
   - Type: Paragraph
   - Help text: Describe freely using words, emotions, images, memories, or physical sensations.
9. Which words best describe this track?
   - Type: Checkboxes
   - Options: Floating, Deep, Calm, Dreamlike, Emotional, Dark, Warm, Lonely, Expansive, Meditative, Hypnotic, Focused, Energetic, Repetitive, Uncomfortable, Other
10. Optional listener name / handle
   - Type: Short answer
   - Optional

## Settings

- Turn off Collect email addresses.
- Turn off Limit to 1 response.
- Turn on Show progress bar.

## Confirmation Message

```text
Your feedback becomes part of the evolving sound-consciousness experiment.

The next generation of music DNA will mutate from listener responses like yours.
```

## Connect To Google Sheets

Open Responses → Link to Sheets.

## Embed In Site

Send → Embed HTML → copy the iframe `src` URL.

Paste it in `assets/js/tracks.js`:

```js
window.CONSCIOUSNESS_AUDIO_LAB = {
  googleFormEmbedUrl: "YOUR_EMBED_URL"
};
```

The current MVP is already configured with:

```text
https://docs.google.com/forms/d/e/1FAIpQLScGQcQnAPPXwIsYb0YKTLAhNV_zDMLD3TUSaAa8UFjja5r5dQ/viewform?embedded=true
```

For v0.1, the listener manually enters Track ID. Later, use prefilled URLs per track.

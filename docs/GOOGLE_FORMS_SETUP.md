# Google Forms Setup

Use one form for all tracks during v0.1.

## Form Fields

1. Track ID — Short answer
2. Can listen to end — Linear scale 1 to 5
3. Want replay — Linear scale 1 to 5
4. Emotional resonance — Linear scale 1 to 5
5. Entered a state — Linear scale 1 to 5
6. Would share — Linear scale 1 to 5
7. One sentence feeling — Paragraph
8. Optional contact / listener name — Short answer

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

For v0.1, the listener manually enters Track ID. Later, use prefilled URLs per track.

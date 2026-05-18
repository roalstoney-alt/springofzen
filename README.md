# Consciousness Audio Lab

Static GitHub Pages MVP for an experimental sound-consciousness feedback lab.

This site publishes daily generated music DNA tracks, collects simple feedback through Google Forms, and prepares data for weekly analysis in Google Sheets.

## Local Structure

```text
index.html
tracks.html
track.html
about.html
deep-listener.html
assets/css/style.css
assets/js/app.js
assets/js/tracks.js
assets/data/tracks.json
assets/audio/YYYY-MM-DD/*.wav
assets/covers/YYYY-MM-DD/*.jpg
```

## Deploy To GitHub Pages

```bash
git init
git add .
git commit -m "Launch Consciousness Audio Lab MVP"
git branch -M main
git remote add origin https://github.com/<github-username>/consciousness-audio-lab.git
git push -u origin main
```

Then enable GitHub Pages:

Settings → Pages → Deploy from branch → main → root → Save.

Expected URL:

```text
https://<github-username>.github.io/consciousness-audio-lab/
```

## Google Form

Create one Google Form named:

```text
Consciousness Audio Lab — Track Feedback
```

Questions:

- Track ID / Short answer
- Can listen to end / Linear scale 1-5
- Want replay / Linear scale 1-5
- Emotional resonance / Linear scale 1-5
- Entered a state / Linear scale 1-5
- Would share / Linear scale 1-5
- One sentence feeling / Paragraph
- Optional contact / listener name / Short answer

Connect the form to Google Sheets. Copy the embed URL and paste it into:

```text
assets/js/tracks.js
```

Replace `PASTE_GOOGLE_FORM_EMBED_URL_HERE`.

## Daily Update Checklist

1. Generate 5 tracks.
2. Export WAV files.
3. Create 5 covers.
4. Add audio files to `assets/audio/YYYY-MM-DD/`.
5. Add covers to `assets/covers/YYYY-MM-DD/`.
6. Update `assets/data/tracks.json`.
7. Commit and push.

## Positioning Rule

Avoid medical claims. Use language like experimental, exploratory, listener feedback, state mapping, and music structure research.

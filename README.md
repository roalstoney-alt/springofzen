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
```

GitHub Pages stores only lightweight frontend files and metadata. Daily audio,
cover, and preview assets live in Cloudflare R2 and are referenced by public CDN
URLs in `assets/data/tracks.json`.

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

Subtitle:

```text
You are participating in an experimental study exploring how sound structures interact with attention, emotion, memory, and inner state.

Please listen first, then answer the feedback questions below.
```

Questions:

- Section 1 — Basic Listening
- Track ID / Short answer / Required / Example: DNA_20260518_v01
- Did you listen to most of the track? / Multiple choice / Yes, Partially, No / Required
- Section 2 — Core Feedback
- Can you listen to the full track comfortably? / Linear scale 1-5 / 1 = difficult, 5 = very easy
- Would you replay this track? / Linear scale 1-5 / 1 = no replay, 5 = definitely replay
- Did this track create a noticeable inner state? / Linear scale 1-5 / 1 = none, 5 = very strong
- Emotional resonance / Linear scale 1-5 / 1 = disconnected, 5 = deeply resonant
- Would you share this track with someone? / Linear scale 1-5 / 1 = no, 5 = definitely
- Section 3 — Open Feedback
- What did you feel while listening? / Paragraph / Describe freely using words, emotions, images, memories, or physical sensations.
- Which words best describe this track? / Checkboxes / Floating, Deep, Calm, Dreamlike, Emotional, Dark, Warm, Lonely, Expansive, Meditative, Hypnotic, Focused, Energetic, Repetitive, Uncomfortable, Other
- Optional listener name / handle / Short answer / Optional

Settings:

- Turn off Collect email addresses.
- Turn off Limit to 1 response.
- Turn on Show progress bar.

Confirmation message:

```text
Your feedback becomes part of the evolving sound-consciousness experiment.

The next generation of music DNA will mutate from listener responses like yours.
```

Connect the form to Google Sheets. Copy the embed URL and paste it into:

```text
assets/js/tracks.js
```

The current MVP already points to the provided form embed URL in `assets/js/tracks.js`.

## Cloudflare R2 Media Storage

Store generated media outside the GitHub repository:

```text
audio/YYYY-MM-DD/DNA_YYYYMMDD_v01.mp3
audio/YYYY-MM-DD/DNA_YYYYMMDD_v01.wav
previews/YYYY-MM-DD/DNA_YYYYMMDD_v01_preview.mp3
covers/YYYY-MM-DD/DNA_YYYYMMDD_v01.jpg
```

Set these environment variables before running the upload helper:

```bash
export R2_ACCOUNT_ID="<cloudflare-account-id>"
export R2_BUCKET="<bucket-name>"
export R2_ACCESS_KEY_ID="<r2-access-key-id>"
export R2_SECRET_ACCESS_KEY="<r2-secret-access-key>"
export R2_PUBLIC_BASE_URL="https://<cdn-domain>"
```

Then prepare and upload a daily batch:

```bash
python3 consciousness-lab/scripts/upload_daily_media_to_r2.py 2026-05-18
R2_PUBLIC_BASE_URL="https://<cdn-domain>" python3 consciousness-lab/scripts/build_github_pages_mvp.py
```

`tracks.json` should contain external media URLs only:

```json
{
  "track_id": "DNA_20260518_v01",
  "title": "Deep Space Bloom",
  "audio_url": "https://<cdn-domain>/audio/2026-05-18/DNA_20260518_v01.mp3",
  "wav_url": "https://<cdn-domain>/audio/2026-05-18/DNA_20260518_v01.wav",
  "cover_url": "https://<cdn-domain>/covers/2026-05-18/DNA_20260518_v01.jpg",
  "feedback_form_url": "https://docs.google.com/forms/d/e/.../viewform?embedded=true"
}
```

## Daily Update Checklist

1. Generate 5 tracks.
2. Export WAV files.
3. Convert WAV to MP3.
4. Create 5 covers.
5. Upload MP3, WAV, preview clips, and covers to Cloudflare R2.
6. Rebuild `assets/data/tracks.json` with R2 public URLs.
7. Commit and push only frontend files and metadata to GitHub Pages.

## Positioning Rule

Avoid medical claims. Use language like experimental, exploratory, listener feedback, state mapping, and music structure research.

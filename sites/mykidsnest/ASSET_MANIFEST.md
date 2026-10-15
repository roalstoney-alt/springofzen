# MyKidsNest standalone asset manifest

All production assets are stored under `sites/mykidsnest/public/`. The standalone site makes no runtime request to SpringOfZen and has no remote font, image, script, stylesheet, iframe, API, D1, KV, or analytics dependency.

## Shared

| Asset | Purpose | Provenance |
| --- | --- | --- |
| `assets/shared/site.css` | Shared wordmark, world switcher, and cross-world cards | New, built for the standalone site |
| `assets/shared/home.css` | Full-screen three-world carousel presentation | New, built for the standalone site |
| `assets/shared/home.js` | Autoplay, keyboard, dots, arrows, visibility, reduced-motion, and swipe behavior | New, built for the standalone site |

## Ocean

| Assets | Purpose | Provenance |
| --- | --- | --- |
| `ocean-room-base-v03-{desktop,mobile}.jpg` | Day room experience | Approved local MyNest Ocean v0.3 scene |
| `ocean-room-base-v03-{desktop,mobile}-night.jpg` | Practical night/rest room | Approved local MyNest Ocean night patch v0.3.1 |
| `ocean-room-base-v02.jpg`, `ocean-room-base-mobile-v02.jpg` | Compatibility fallback retained by the approved Ocean occlusion styles | Approved local MyNest Ocean real-room scene |
| `ocean-room-child-eye-{desktop,mobile}-v03.jpg` | Homepage Ocean hero and room depth layer | Approved local MyNest Ocean v0.3 scene |
| `milo-living-cutout-v02.webp` | Milo character overlay | Approved local MyNest Ocean living scene |
| `baby-fish-family-v01.webp` | Small interactive fish family | Approved local MyNest Ocean living scene |
| `ocean.css`, `ocean.js` | Consumer room runtime | Local runtime rebuilt without pilot forms, local observation storage, or backend sync |

## Space

| Assets | Purpose | Provenance |
| --- | --- | --- |
| `space-command-pod-{idle,mission,return,sleep}-{desktop,mobile}-v02.jpg` | Four visual fallback and mission states | Approved local MyNest Space refinement v0.2 |
| `space-command-pod-foreground-{desktop,mobile}-v03.png` | Physical pod foreground preserved over the canvas mission | Approved local MyNest immersive mission engine v0.3 |
| `space.css`, `space.js` | Responsive canvas mission and static fallback runtime | Approved local MyNest immersive mission engine v0.3, with consumer-facing copy |

## Forest

| Assets | Purpose | Provenance |
| --- | --- | --- |
| `forest-room-{day,night,rest}-{desktop,mobile}-b-practical-v02.webp` | PLAY, DREAM, and SLEEP scenes | Latest approved practical MyNest Forest room refinement; variant identity is not exposed publicly |
| `forest.css`, `forest.js` | Three-mode scene transitions, gentle meadow response, and fireflies | Approved local MyNest Forest runtime, rebuilt as one public default without A/B controls |

The source repository owns these project assets. No third-party CDN asset or remotely licensed stock file is introduced by this standalone build.

# MYKIDSNEST Deployment Report v0.1

## Scope

- Standalone Cloudflare Worker: `mykidsnest-site`
- Canonical origin: `https://mykidsnest.com/`
- Canonical routes: `/`, `/ocean/`, `/space/`, `/forest/`
- Same-domain legacy aliases: `/ocean-room/`, `/space-room/`, `/forest-room/`
- SpringOfZen production routes are outside the Worker route table and are not modified.

## Architecture

The site is a static bundle served through a Worker-first handler. The Worker performs only host canonicalization, same-domain route redirects, static asset delivery, a branded 404, method filtering, security headers, and cache policy. It has no D1, KV, R2, service binding, backend API, form submission, account, child profile, analytics, or cross-origin dependency.

## Privacy and data

No personal information is requested or stored. Ocean pilot forms and backend synchronization were explicitly removed. The remaining local QA event array is ephemeral in-memory interaction state used only by the page runtime and is never transmitted or persisted.

## Cloudflare release

- Account: `f2e22e5cefa40fa25e8a461a149ae12c`
- Zone: `mykidsnest.com` (`active`, full setup)
- Worker version: `87e64dd7-d876-4104-ac16-c9ab139ea239`
- Worker preview: `https://mykidsnest-site.roalstoney.workers.dev`
- Custom domains: `mykidsnest.com`, `www.mykidsnest.com`
- Deployed: 2026-10-15

## Production verification

- Apex DNS resolves through Cloudflare on IPv4 and IPv6.
- `https://mykidsnest.com/`, `/ocean/`, `/space/`, and `/forest/` return HTTPS 200.
- `/ocean-room/`, `/space-room/`, and `/forest-room/` issue same-domain 301 redirects to the canonical world routes and preserve query strings.
- `www.mykidsnest.com` issues an HTTPS 308 redirect to the apex host while preserving path and query.
- Unknown paths return the branded page with HTTP 404.
- Security and cache headers are present on production responses.
- `robots.txt`, `sitemap.xml`, apex canonicals, and WebSite/Brand/WebPage JSON-LD are included; Product and Offer schema are absent.

## Experience verification

- Desktop visual checks passed for the full-screen carousel and all three worlds.
- 390 × 844 mobile checks passed with no horizontal overflow.
- Carousel arrows, dots, keyboard state, manual autoplay pause, and world links passed.
- Ocean wake, Milo interaction, and Rest transition passed.
- Space used the real Canvas 2D mission engine rather than its static fallback.
- Forest PLAY, DREAM, and SLEEP passed; night fireflies were present and the public build contained no variant selector.
- Reduced-motion handling is present in the carousel and every world runtime.
- Browser console checks returned zero errors and zero warnings across the local production-equivalent bundle.

## Independence and regression

- Static audit: 43 public files, 5 HTML documents, 26 local raster images plus one SVG favicon, 0 missing references.
- SpringOfZen hotlinks: 0 image, 0 JavaScript, 0 CSS, 0 API.
- Backend and PII collection: unchanged / none added.
- Existing SpringOfZen routes `/mynest/`, `/mynest/magic-room/`, `/mynest/space-room/`, and `/mynest/forest-room/` each returned HTTP 200 after deployment.
- SpringOfZen redirects, canonicals, robots directives, and route files were not changed by this release.

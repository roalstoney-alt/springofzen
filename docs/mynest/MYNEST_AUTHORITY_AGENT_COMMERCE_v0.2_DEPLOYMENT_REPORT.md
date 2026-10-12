# MyNest Authority and Conditional Commerce v0.2 Deployment Report

Date: 2026-10-13
Baseline: `67bf9c530751f1595590b15c1c763f5166c69b89`

## Corrected

- Replaced premature public pilot-signal language with observation-dependent, non-predictive copy.
- Expanded the canonical Method page with audience, exclusions, F01–F06, one-change and child-choice rules, 14-day observation, outcome definitions, evidence limits, version, and change record.
- Converted Results into an explicit Evidence Registry with verified zero values: 0 enrolled families, 0 completed families, and 0 public real cases.
- Separated full nights, attempts, and partial nights in the progress interface.
- Added the device-storage loss warning, summary copy fallback, replacement guard, and Day 1/3/7/14 calendar download.
- Added a data-dependent Pilot Signal, Day 7/14 safety escalation, and a canonical Not-the-Right-Fit page.
- Added the optional Day 14 “What would help next?” structured choice. It stays in existing local state and is not sent to the backend.
- Corrected truncated descriptions on five approved question pages.
- Added self-supported Organization, WebPage, Article, and Breadcrumb structured data only. No QAPage, FAQPage, Product, Offer, price, stock, shipping, or rating markup was added.
- Added `/api/` to the robots crawl exclusion while leaving public authority pages open, and added the new safety page to the sitemap.
- Created an internal product fact matrix using `NOT_ESTABLISHED` for unverified facts. Commerce readiness remains `NO`.

## Evidence and privacy

A production count-only D1 query returned:

- enrollments: 0;
- completed families: 0;
- pilot events: 4;
- Day 14 pilot checkpoint rows: 0;
- Magic Room events: 0.

The four incomplete anonymous room-check events are not used as completed evidence or public cases. No row-level records were exposed or changed. The backend schema and Worker were not changed.

## Verification

- Public pre-deployment route/header audit: 11/11 existing routes returned HTTP 200; no unintended `X-Robots-Tag` was present.
- Metadata/canonical/JSON-LD/sitemap/internal-link audit: 11/11 indexable routes passed.
- Worker, consent, and privacy tests: 22/22 passed.
- Ocean Room regression QA: passed.
- JavaScript syntax and `git diff --check`: passed.
- Browser QA: mobile counter layout, Day 14 local demand choice, calendar download, replacement guard, Method, Evidence Registry, and safety route passed.

## Blocked or intentionally retained

- Search Console: `BLOCKED_NO_AUTH`; public search discovery was not observed and is not treated as proof of non-indexing.
- Named qualified expert reviewer: none established; no reviewer was fabricated and no outreach was performed.
- Magic Room remains intentionally `noindex,nofollow` as an interactive prototype rather than a public authority page.
- Product dimensions, materials, safety testing, certifications, price, shipping, returns, warranty, and final availability remain `NOT_ESTABLISHED`.

## Next gate

Complete the first real, consented 14-day family record before making evidence or commerce claims.

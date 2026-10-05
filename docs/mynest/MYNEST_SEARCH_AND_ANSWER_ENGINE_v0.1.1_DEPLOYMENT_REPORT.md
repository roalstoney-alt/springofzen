# MyNest Search and Answer Engine v0.1.1 Deployment Report

Date: 2026-10-05

## Policy baseline

- Primary manual demand source: Reddit
- Secondary source: anonymous MyNest first-party search, ad, and pilot data
- Broad autonomous web crawl: disabled
- Reddit role: reality sensor, not a lead database
- Primary recruitment: paid acquisition
- Paid channels prepared for human review: Meta, Google, ChatGPT Ads
- Mass DM, identity scraping, profile enrichment, automatic posting: prohibited
- Child Choice: LIGHT / STORY_OR_SOUND / ROOM_FRIEND

The prior scheduled `MYNEST_DEMAND_RADAR` broad-crawl automation was deleted.
No Reddit reply, direct message, community post, or paid campaign was launched.

## Implemented

- Preserved the 111-record v0.1 corpus as historical evidence.
- Added an append-only manual Reddit insight store, strict anonymous schema,
  example inbox, and a processor that validates, redacts by rejection,
  deduplicates, classifies F01–F06, clusters, and reports counts.
- Narrowed the review queue to one Reddit answer, one SEO improvement, and one
  paid-acquisition angle, all requiring human approval.
- Added first-touch bounded UTM attribution across MyNest landing, answer,
  method, results, and recruitment pages.
- Added transparent US$39-equivalent voucher terms. Eligibility depends only on
  completing Day 0, 1, 3, 7, and 14—not outcome, purchase, review, or
  testimonial.
- Linked progress to enrollment using the matching anonymous pilot, household,
  and child IDs. Four distinct post-Day-0 checkpoints move the enrollment to
  `PILOT_COMPLETE` and set `voucher_eligible = 1`.

## Production backend

- D1 migration: `0003_add_acquisition_and_completion.sql`
- Worker version: `edd7f88e-a848-4c91-bd5b-1932495bb68d`
- Worker route: `www.springofzen.com/api/mynest/*`

Production verification confirmed all new D1 columns. The live Worker rejected
an unapproved acquisition source with `INVALID_ACQUISITION` and rejected a
checkpoint missing enrollment linkage with `INVALID_RECRUITMENT_HOUSEHOLD_ID`.
Both checks were non-mutating.

## Verification

- Worker and browser sync tests: 16/16 pass
- Existing search-engine QA: pass (111 records, 20 canonical questions, five
  published answer pages)
- v0.1.1 policy/privacy QA: pass
- Manual Reddit processor dry run: pass
- JavaScript syntax and Git whitespace checks: pass
- Local D1 migration: pass
- Local screen → consent → Day 0 → Day 1/3/7/14 completion: pass
- Local result: `PILOT_COMPLETE`, `voucher_eligible = 1`, four linked
  checkpoints, and bounded Google/CPC attribution stored

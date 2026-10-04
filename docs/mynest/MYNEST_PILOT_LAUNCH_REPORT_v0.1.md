# MyNest Pilot Launch Report v0.1

Date: 2026-10-05

## Protocol

- Project: `MYNEST_PILOT_RECRUITMENT_v0.1`
- Cohort: `MYNEST_COHORT_001`
- Target: 10 eligible households
- Age cohort: 2.5–6 years
- Window: 14 days
- External outreach: human review required
- PII and free text: prohibited

## Production entry points

- Recruitment page: `https://www.springofzen.com/mynest/recruit/`
- Room-transition portal: `https://www.springofzen.com/mynest/`
- Recruitment API: `https://www.springofzen.com/api/mynest/pilot-recruitment`
- Progress API: `https://www.springofzen.com/api/mynest/pilot-events`

## Implemented funnel

The recruitment page provides a structured, under-three-minute parent screener,
server-evaluated eligibility, readable explicit consent, anonymous `H-XXXX`,
`C-XXXX`, and `P-XXXX` identifiers, automatic cohort group allocation, and a
structured Day 0 baseline. It never asks for a name, contact detail, photo,
address, exact birth date, or free-text child information.

The server assigns eligible consented households in the frozen sequence:

```text
A, B, C, C, A, B, C, A, B, C
```

The eleventh eligible household is waitlisted. Group A skips Child Choice in
the portal during the first observation period. Groups B and C continue into
the existing Child Choice flow; the protocol governs whether an intervention is
added for Group C.

## Backend baseline

- D1 database: `mynest-pilot`
- D1 binding: `MYNEST_DB`
- Migration: `0002_create_mynest_pilot_enrollments.sql`
- Worker route: `www.springofzen.com/api/mynest/*`
- Worker version: `c1dfa779-6dfb-4a01-a862-1d525eff0096`

The migration and Worker deployment completed successfully. A synthetic
production flow reached `ELIGIBLE`, then `CONSENTED` with Group A, then
`PILOT_ACTIVE`; D1 confirmed the consent and Day 0 timestamps. A request with a
synthetic `notes` field returned HTTP 400 `PROHIBITED_FIELD`. The exact
synthetic enrollment was deleted after verification.

## Verification

- Automated tests: 13/13 pass
- JavaScript syntax: pass
- Local D1 screen → consent → Day 0 flow: pass
- Production D1 screen → consent → Day 0 flow: pass
- Production free-text rejection: pass
- Synthetic data cleanup: pass

## Human-reviewed launch actions

The public page is ready to share. No community post, direct message, or warm
network invitation was sent automatically. The frozen English, Chinese, and
known-parent drafts in `MYNEST_PILOT_RECRUITMENT_v0.1.md` should be reviewed by
the human operator before each external post or message.

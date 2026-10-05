# MyNest Reddit Manual Research Standard v0.1

Effective: 2026-10-05
Parent protocol: `MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1.1`

## Purpose

Reddit is a manual reality sensor for parent language, failed solutions, urgency,
question clustering, and answer testing. It is not a lead database. Broad
autonomous web crawling is disabled.

## Human collection procedure

1. A human reviewer manually reads 20–30 relevant public posts or comments per
   research day in `r/Parenting`, `r/toddlers`, `r/sleeptrain`, and
   `r/ScienceBasedParenting`.
2. The reviewer copies only the bounded problem information in
   `data/mynest/manual-research-inbox.example.json`.
3. The reviewer must not copy usernames, names, email addresses, phone numbers,
   profile URLs, child names, addresses, or exact birthdays.
4. A public source URL may be retained as `internal_source_url` only for
   verification. It must never be used as a contact lead.
5. Run `node scripts/process-mynest-reddit-batch.mjs path/to/batch.json`.
6. Review the generated weekly counts and drafts. Public replies, public page
   changes, and paid ads always require human approval.

## Processing boundary

The processor may normalize the problem, classify F01–F06, estimate transition
intent and urgency, assign a question cluster, describe the answer gap, dedupe,
and append anonymous records. It must not search Reddit, open profiles, enrich
identities, send messages, publish replies, or overwrite prior raw wording.

## Answer-first interaction

The default is no direct contact. When a human chooses to reply publicly, the
reply should answer the question first. A MyNest link may be added second only
when it is relevant and permitted by community rules. Mass direct messages and
automated outreach are prohibited.

## Weekly report

Report counts only:

- records reviewed and accepted;
- duplicates skipped;
- F01–F06 frequency;
- question-cluster frequency;
- urgency, intent, and pilot-fit distribution;
- repeated parent language and failed solutions;
- one proposed Reddit answer, one SEO improvement, and one paid-ad angle for
  human review.

Never include a username, profile, contact detail, child identity, or row-level
pilot record in the report.

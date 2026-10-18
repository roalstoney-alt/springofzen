# Forest Starter release-readiness review

Review date: 2026-10-18  
Branch: `codex/mykidsnest-etsy-forest-starter-v01`  
Draft PR: `https://github.com/roalstoney-alt/springofzen/pull/2`  
Reviewed pre-audit HEAD: `1810d9195056c4c5bd3dc708ced195719135fd3e`  
Scope: audit only; completed artifacts were not rebuilt or overwritten.

`READY_TO_UPDATE_ETSY = NO`

The blocking evidence is (1) the three synthetic concept images do not change the room visualization in response to customer inputs, (2) live Etsy listing fields are not verified, and (3) the operating policies, source/AI history, and release action still require human approval.

## Gate summary

| Gate | Status | Evidence / required action |
|---|---|---|
| Original records and completed files preserved | PASS | No existing artifact was edited, deleted, or rebuilt during this audit. This document is the only release-review addition. |
| Synthetic-order file completeness and geometry | PASS | Bundled-Python Forest Starter QA passed all required-tree, image, PDF, synthetic-order, cost-record, and privacy checks. |
| Meaningful visual personalization | FAIL | Across all three pairwise comparisons, the 1,821,600-pixel room-scene region has zero changed pixels. Only the test title, direction copy, and four palette swatches change. |
| Listing claim matches demonstrated output | FAIL | The draft promises a personalized concept image, while the synthetic evidence demonstrates an annotated static room image. Replace the example/output with an input-responsive room visualization, or narrow the offer language to the actual annotated-board output, before updating Etsy. |
| Unsupported future package claims removed from the publishable set | PASS | Image 09 is excluded from the proposed publishable manifest below. The original file remains preserved for audit history. |
| Human review simulation completed | PASS | One complex synthetic order was inspected end to end; observed wall-clock review was 11 minutes 23 seconds. This is a review-only measurement, not full fulfillment labor. |
| End-to-end labor/capacity | UNKNOWN | No real order has measured intake, design, customer communication, revision, Etsy handling, or delivery labor. Estimates are stated separately and are not cost facts. |
| Processing, revision, cancellation/refund, and AI wording | HUMAN_APPROVAL_REQUIRED | Proposed text is below. Seller/legal review and an owner decision are required before publication. |
| Exact live Etsy listing ID | UNKNOWN | `NOT_VERIFIED`; no authorized Seller Dashboard view was available. |
| Exact current live price | UNKNOWN | `NOT_VERIFIED`; `$11.52` is an artifact/pilot assumption, not a verified live price. |
| Exact live product type | UNKNOWN | `NOT_VERIFIED`; the intended type is a made-to-order digital listing, but the live setting was not visible. |
| Exact live delivery settings | UNKNOWN | `NOT_VERIFIED`; no Seller Dashboard delivery/order-completion settings were visible. |
| Forest production regression | PASS | `scripts/qa-mynest-forest-room.mjs` passed every check and ended with `MYNEST_FOREST_ROOM_QA=PASS`. |
| Legacy meadow A/B sharp regression | UNKNOWN | The legacy script could not start because `sharp` is undeclared/uninstalled in this checkout. This is reported separately and was not silenced by changing dependencies. |
| Seller rights and AI creation history | UNKNOWN | Existing provenance records do not establish the owner's full rights/creation history or whether generative AI was used. Owner confirmation is required. |
| Production, Cloudflare, Etsy, and customer state unchanged | PASS | No deployment, merge, listing edit, publication, customer contact, or real order action occurred. |

## 1. Pixel-level personalization audit

Compared files:

- `pilot/test-a/concept.png`
- `pilot/test-b/concept.png`
- `pilot/test-c/concept.png`

Each image is 2000 x 2000 RGB (4,000,000 pixels). Coordinates below use Pillow half-open bounds `(left, top, right, bottom)`.

| Pair | Total changed pixels | Share of canvas | Changed elements |
|---|---:|---:|---|
| A vs B | 74,974 | 1.87435% | title 18,054; direction copy 13,448; palette 43,472 |
| A vs C | 89,521 | 2.23803% | title 20,584; direction copy 25,465; palette 43,472 |
| B vs C | 90,845 | 2.27113% | title 20,117; direction copy 27,256; palette 43,472 |

Exact changing pixel regions:

- Test/order title: pair-dependent changed bounds from `(97,247,912,304)` through `(102,247,969,319)`.
- Personalized-direction text: pair-dependent changed bounds from `(150,1612,1130,1647)` through `(150,1612,1130,1749)`.
- Four suggested-palette swatches: changed bounds `(1350,1550,1831,1656)`; 43,472 pixels differ in every pair.
- Room scene: fixed bounds `(100,430,1900,1442)`; **0 of 1,821,600 pixels differ** for A-B, A-C, or B-C.
- The categorized changing regions sum exactly to each image's total changed pixels. No other visual pixels changed.

Therefore the bed, furniture, layout, room geometry, lighting, window, deer, floor, tree, canopy, accessories, perspective, and composition are identical across A, B, and C. Customer input changes text and palette swatches, but not the depicted room. This is not sufficient evidence for meaningful visual personalization.

## 2. Publishable listing-image manifest

Proposed publishable set after this audit:

1. `01-hero.png`
2. `02-environment.png`
3. `03-details.png`
4. `04-personalized-concept.png` — **hold until the personalization claim is corrected or a meaningfully personalized example replaces it**
5. `05-included.png`
6. `06-personalization.png`
7. `07-process.png`
8. `08-digital-deliverables.png`
9. `10-get-started.png`

Excluded from publication:

- `09-future-upgrades.png` — contains unsupported `$49` and `$129` package prices, additional-view/layout promises, an extended-package promise, and future-credit language. The original is preserved unchanged; exclusion is by manifest, not deletion.

Because image 04 and the offer language still overstate the demonstrated personalization, the remaining nine-image manifest is not yet approved for upload.

## 3. Manual review simulation and fulfillment estimate

Observed simulation window: `2026-10-18T13:49:40Z` to `2026-10-18T14:01:03Z` (11 minutes 23 seconds wall clock).

The simulation reviewed synthetic order C's intake, concept PNG, both PDF pages, QA report, cost record, constraints, scope statements, palette consistency, clipping/legibility, and manual-review trigger. It found the static-room personalization failure. It did not create or revise a visual, communicate with a buyer, use Etsy order controls, or deliver files. Tool latency is included, so this is not a pure human-labor measurement.

Estimated active human time per clean order, pending real measurement:

| Activity | Estimate | Measurement status |
|---|---:|---|
| Intake/privacy/completeness review | 5-10 min | ESTIMATE |
| Select and compare approved source direction | 5-10 min | ESTIMATE |
| Create a meaningfully input-responsive room visual | 30-60 min | ESTIMATE |
| Personalize and proof the PDF | 10-15 min | ESTIMATE |
| Visual QA, scope check, packaging | 15-25 min | ESTIMATE |
| Etsy order administration and delivery | 5-10 min | ESTIMATE |
| **Clean-order active total** | **70-130 min** | **ESTIMATE** |
| Complex/irregular-room contingency | **+20-45 min** | **ESTIMATE** |

Customer clarification, revisions, rework rate, labor rate, labor cost, Etsy fees, payment fees, taxes, AI/API cost for any future visual workflow, and other variable costs remain `UNKNOWN` / `NOT_MEASURED`. The recorded synthetic compute API cost of `$0.00` applies only to the existing deterministic static composition and does not establish future fulfillment cost.

## 4. Policies proposed for human approval

Everything in this section is a proposal, not a verified shop policy or legal conclusion.

### Proposed processing commitment

> Made-to-order digital item; no physical item ships. We propose delivering the concept PNG and short PDF within **5 calendar days of purchase**. If required personalization details are missing, we will request them through Etsy Messages. If the order cannot be completed accurately within Etsy's applicable deadline, the seller will review cancellation/refund rather than mark an incomplete order as complete.

Rationale: the 5-calendar-day proposal gives a two-day buffer against Etsy's current made-to-order download case timing, which allows a case after seven days if the file has not been made available. Etsy also states that digital listings do not use physical-item processing profiles. Confirm the actual Seller Dashboard controls before adoption.

### Proposed revision policy

> One consolidated minor revision round is included when requested within 7 calendar days after delivery. Minor revisions cover palette adjustments, wording corrections, or one styling emphasis within the approved brief. A new room/photo, changed constraints, layout redesign, additional perspective, sourcing plan, construction drawing, or additional revision round is outside the starter scope and requires separate written agreement. Proposed revised-file target: 3 calendar days after receiving one consolidated request.

### Proposed cancellation/refund policy

> A buyer may request cancellation before meaningful personalized work begins. After work begins or a first concept is prepared, cancellation/refund requests will be reviewed case by case, subject to Etsy policy and applicable law. If files are not delivered, are corrupted/unusable, or materially do not match the listing, the seller will correct/redeliver them or provide the remedy required by Etsy or applicable law. The seller will respond to Etsy Help with Order messages within 48 hours. Nothing in this proposal limits mandatory consumer rights or Etsy case outcomes.

Etsy currently does not let sellers set return/exchange policies on digital listings, although a seller may resolve digital-order issues directly. EU/UK and other local rules may require additional disclosures or remedies. Obtain appropriate legal review for the seller's location and target markets.

### Proposed AI disclosure

Use the following only if the owner verifies that it is accurate:

> This made-to-order digital Forest Room concept is created by MyKidsNest using seller-directed digital design tools. Some source imagery and/or personalized visual elements may be generated or modified with generative AI under our direction, then selected, edited, assembled, and quality-checked by a human. No physical item is supplied.

If the owner verifies that no generative AI was used, do not publish the AI-use statement. Record the verified creation method instead. Etsy's Creativity Standards require listing-description disclosure when an item is created with seller-prompted AI.

## 5. Live Etsy verification

The available browser inventory contained public `Mykidsnest` shop pages, not an authorized Seller Dashboard listing page. Two read-only attempts to bind the public shop page timed out. No login, edit, or navigation into seller controls was attempted.

| Field | Result |
|---|---|
| Listing ID | `NOT_VERIFIED` |
| Current price | `NOT_VERIFIED` |
| Product type | `NOT_VERIFIED` |
| Delivery settings | `NOT_VERIFIED` |

These values must be copied from the exact listing in Seller Dashboard by an authorized human before release.

## 6. QA rerun

### Forest Starter artifact QA

- First attempt with the system Python: blocked by missing `pypdf`.
- Rerun with the workspace's pre-provisioned bundled Python: **PASS**, ending `FOREST STARTER QA: PASS`.
- No dependency was installed, removed, or changed.

### Forest production regression

- Command: bundled Node running `scripts/qa-mynest-forest-room.mjs`.
- Result: **PASS**, ending `MYNEST_FOREST_ROOM_QA=PASS`.
- Checks covered all six production images, route wiring, three modes, fireflies, meadow response, crossfade, reduced motion, safety/privacy boundaries, world links, no indexing, and no commerce claims.

### Legacy meadow A/B sharp regression — separate result

- Command: bundled Node running `scripts/qa-mynest-forest-meadow-ab.mjs`.
- Result: **NOT RUN / UNKNOWN** because startup failed with `Error: Cannot find module 'sharp'`.
- Exit code: 1.
- No production dependency was added or modified to silence this error.
- This is not evidence that the new Forest Starter artifacts failed; it is unresolved legacy-test coverage and must remain visible.

## 7. Human approvals required before any Etsy update

1. Decide whether to implement true room-level visual personalization or narrow the offer to an annotated static concept board.
2. Approve or revise the proposed processing, revision, and cancellation/refund policies.
3. Confirm creation rights and the exact AI history, then approve the accurate disclosure.
4. Verify listing ID, live price, made-to-order digital product type, and delivery/order-completion controls in Seller Dashboard.
5. Approve the nine-image manifest with image 09 excluded; do not approve image 04 while it overstates the demonstrated visual personalization.

## Current Etsy references used for proposals

- [Etsy Creativity Standards](https://www.etsy.com/legal/creativity/)
- [How to Manage Your Digital Listings](https://help.etsy.com/hc/en-us/articles/115015628347-How-to-Manage-Your-Digital-Listings)
- [How to Set Return Policies on My Listings](https://help.etsy.com/hc/en-us/articles/7869401615255-How-do-I-Set-Return-Policies-on-My-Listings)
- [Cases Policy](https://www.etsy.com/legal/policy/cases-policy/243306189901)
- [How to Open a Case](https://help.etsy.com/hc/en-gb/articles/5745586898199-How-to-Open-a-Case)
- [Selling to EU and UK Buyers](https://www.etsy.com/legal/policy/selling-to-eu-and-uk-buyers/239965962014)


# Test results

Execution date: 2026-10-18

| Check | Result | Notes |
|---|---|---|
| `python3 scripts/qa_forest_starter_v01.py` | PASS | Required tree, 10 images, 4 PDFs, 3 synthetic orders, privacy fields, cost records, and ZIP validated. |
| `node --test workers/mynest-api/test/*.test.js` | PASS | 22 tests passed, 0 failed. |
| `node scripts/qa-mynest-forest-room.mjs` | PASS | Existing Forest Room regression suite passed. |
| `node scripts/qa-mynest-forest-meadow-ab.mjs` | NOT RUN | Script could not start because `sharp` is neither declared nor installed in this repository checkout. Production dependencies were not changed for this offline artifact task. |
| PDF parse validation | PASS | Starter template and tests A/B/C each contain two readable pages. |
| PDF rendered visual review | PASS | All eight rendered pages checked for clipping, overlap, broken glyphs, spacing, and legibility. |
| Listing image visual review | PASS | Contact sheet and ten 2000 x 2000 images reviewed. |

The missing optional `sharp` dependency does not affect the deterministic Python compositor, PDF generation, artifact QA, current Forest route, or API tests. It remains documented rather than treated as a successful test.

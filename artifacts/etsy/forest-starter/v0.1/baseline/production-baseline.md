# Production baseline

Captured: 2026-10-18

Project: MYKIDSNEST-ETSY-FOREST-001

## Repository

- Repository: `https://github.com/roalstoney-alt/springofzen.git`
- Remote `main` baseline SHA: `6020cb44978b9ffd5bcc347243880d29b12a1689`
- Feature branch: `codex/mykidsnest-etsy-forest-starter-v01`
- Canonical site: `https://mykidsnest.com/`
- Forest route: `https://mykidsnest.com/forest/`
- Local production checkout had unrelated untracked files; work was isolated in a separate clone and those files were not copied or changed.

## Etsy baseline

| Field | Baseline |
|---|---|
| Shop URL | `https://www.etsy.com/shop/Mykidsnest` (provided by execution order) |
| Current listing URL | `NOT_VERIFIED` |
| Listing ID | `NOT_VERIFIED` |
| Live title | `NOT_VERIFIED` |
| Live description | `NOT_VERIFIED` |
| Live images | `NOT_VERIFIED` |
| Live tags | `NOT_VERIFIED` |
| Dashboard price | `NOT_VERIFIED`; execution-order assumption is USD 11.52 |
| Personalization settings | `NOT_VERIFIED` |
| Delivery settings | `NOT_VERIFIED` |

Public shop/listing retrieval was not reliable in the execution environment. Per the order, unverified seller fields are preserved and no online change is attempted.

## Prior Codex assets

The prior `MYKIDSNEST_FOREST_ROOM_ETSY_ASSET_RECOVERY_v0.1` review package was inspected as design context. This package is rebuilt from the repository's current six `practical-v02` production assets and does not depend on a user-specific external file path.

## Protected source count

Six current production image files were recovered and hash-matched to their earlier MyNest source copies. See `asset-provenance.json` for exact paths, dimensions, hashes, usage, and rights status.

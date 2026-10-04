# MyNest D1 Test Report v0.1

Date: 2026-10-04

## Passed

- Node test suite: 10/10 tests passed.
- CORS `OPTIONS`: 204 for the production origin.
- Unsupported `GET`: 405.
- Invalid JSON, media type, origin, and oversized body: rejected.
- Unknown fields: rejected.
- Every explicit sensitive/free-text field: rejected at both boundaries.
- Valid synthetic event: accepted by the Worker unit/integration harness.
- Duplicate `client_event_id`: HTTP 200 with one stored row in the harness.
- Local Wrangler D1 migration: applied successfully.
- Local Worker with local D1: valid event accepted; duplicate returned the
  same server event ID; count remained one.
- Queue delivery: success removes, permanent 4xx discards, and network/5xx/
  408/429 retains for retry.
- Client normalization strips synthetic notes and child-selected text.
- Remote Wrangler D1 migration: applied successfully.
- Remote count-only query: table reachable in APAC, count zero at test time.
- Worker dry-run and deployment: successful.

## Pending/failed production checks

- The same-origin production endpoint currently returns GitHub Pages 404
  because the `www` DNS record is not proxied through Cloudflare.
- Therefore a valid production event insert, production duplicate check, live
  queue clearing, and final unrelated-page smoke test cannot yet pass.
- A remote-binding development attempt reached the Worker but Cloudflare's
  preview bridge returned an internal D1 transport error; it did not insert a
  row. The remote database remains empty.

No real pilot payloads were used during testing.

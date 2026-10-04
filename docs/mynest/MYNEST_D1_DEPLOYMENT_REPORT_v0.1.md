# MyNest D1 Deployment Report v0.1

Date: 2026-10-05

## Provisioned resources

- D1 database: `mynest-pilot`
- D1 database ID: `9c148b18-98e5-472a-b393-e31432ccda1d`
- D1 location: APAC
- Worker: `mynest-api`
- Worker version: `28f4a55f-b194-4561-b5b5-a0c29bd8410b`
- Worker development URL: `https://mynest-api.roalstoney.workers.dev`
- Intended production endpoint:
  `https://www.springofzen.com/api/mynest/pilot-events`

The local and remote Wrangler migrations applied successfully. A count-only
remote D1 query confirmed that the table exists in APAC; it contained zero
rows at verification time. No pilot row contents were read or logged.

## Production routing and verification

The existing `www` CNAME remains targeted at `roalstoney-alt.github.io` and is
now proxied through Cloudflare. The Worker intercepts only
`www.springofzen.com/api/mynest/*`; GitHub Pages remains the origin for every
other path.

The homepage, MyNest page, CSS, JavaScript, and representative image returned
HTTP 200 through the Cloudflare edge. `GET /api/mynest/pilot-events` returned
the Worker's JSON 405
response. One synthetic event was accepted into remote D1, and submitting the
same `client_event_id` again returned the same server event ID while a
count-only query remained one. Separate `email`, `name`, `child_name`, `notes`,
`free_text`, and `message` requests returned HTTP 400 `PROHIBITED_FIELD`; an
unknown-field request returned HTTP 400 `UNKNOWN_FIELD`; a count-only query
confirmed that none of those rejected test IDs created rows.

The production queue/replay path was verified after frontend commit `7e84974`
was live on GitHub Pages. A synthetic opted-in event received a controlled HTTP
503 and remained pending with no D1 row. After the normal Worker was restored,
the exact same event returned HTTP 200 and a count-only query found exactly one
matching row. This verifies retention on retryable failure and single-row
delivery after recovery. The normal Worker version listed above is the final
deployed version; no queue-test branch remains deployed.

The original production insert and queue/replay rows were deleted only by their
exact synthetic `client_event_id` values. A final count-only query across both
IDs returned zero. No unrelated production rows were read, changed, or deleted.

Automated Worker and browser-sync tests passed 10/10, JavaScript syntax checks
passed, and `git diff --check` passed before the feature commit. The production
baseline feature commit is `7e84974` (`feat(mynest): activate production Worker
D1 event ingestion`).

## Rollback

Remove the Worker route and return `www` to DNS-only if necessary. Revert the
frontend change so events remain queued locally. Preserve the D1 database and
migration history; rollback does not require deleting pilot data.

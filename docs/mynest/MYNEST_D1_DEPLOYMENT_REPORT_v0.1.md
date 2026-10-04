# MyNest D1 Deployment Report v0.1

Date: 2026-10-04

## Provisioned resources

- D1 database: `mynest-pilot`
- D1 database ID: `9c148b18-98e5-472a-b393-e31432ccda1d`
- D1 location: APAC
- Worker: `mynest-api`
- Worker version: `4aa9e4e1-5446-49cb-afbd-7c8bf9c16ccb`
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

The homepage, MyNest page, CSS, and JavaScript returned HTTP 200 through the
Cloudflare edge. `GET /api/mynest/pilot-events` returned the Worker's JSON 405
response. One synthetic event was accepted into remote D1, and submitting the
same `client_event_id` again returned the same server event ID while a
count-only query remained one. Separate `email`, `name`, `child_name`, `notes`,
`free_text`, and `message` requests returned HTTP 400 `PROHIBITED_FIELD`; an
unknown-field request returned HTTP 400 `UNKNOWN_FIELD`; a count-only query
confirmed that none of those rejected test IDs created rows.

The browser queue replay check is performed after the frontend files are live
on GitHub Pages. Synthetic production rows are removed by exact
`client_event_id` after verification.

## Rollback

Remove the Worker route and return `www` to DNS-only if necessary. Revert the
frontend change so events remain queued locally. Preserve the D1 database and
migration history; rollback does not require deleting pilot data.

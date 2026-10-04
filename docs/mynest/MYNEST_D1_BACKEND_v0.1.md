# MyNest D1 Backend v0.1

Date: 2026-10-04

## Architecture

Opted-in browser events are posted to the same-origin endpoint
`POST /api/mynest/pilot-events`. A standalone Cloudflare Worker validates the
event and inserts typed values into D1 through the `MYNEST_DB` binding. The
browser has no database identifier, credentials, or direct database access.

The deployed Worker is `mynest-api`. Its narrow production route is
`www.springofzen.com/api/mynest/*`; all unrelated SpringOfZen paths remain on
the existing GitHub Pages origin.

## D1 schema

Database: `mynest-pilot`

Binding: `MYNEST_DB`

Migration: `migrations/mynest/0001_create_mynest_pilot_events.sql`

Each row has a random server `id`, unique browser `client_event_id`, anonymous
`household_id`, event type, step, client/server timestamps, and typed event
fields. D1 stores booleans as constrained integers. There is no arbitrary JSON
column and no profile, contact, child-name, exact-birthdate, note, message, or
free-text column.

## Request and response

The Worker accepts JSON `POST` and preflight `OPTIONS` only at the configured
path. It enforces a 4 KiB body limit, exact origin allowlist, explicit schema,
bounded enums and integers, and an in-memory per-isolate request guard that
does not persist IP addresses.

Successful requests return only:

```json
{"ok":true,"event_id":"<server UUID>"}
```

Prepared statements are used for all inserts. A repeated `client_event_id`
returns the original server ID with HTTP 200 and creates no second row.

## Queue behavior

The browser queue remains in `localStorage`. Replay runs oldest first on page
load, when the browser returns online, and whenever a new opted-in event is
created. A 2xx response removes the event. Network failures, HTTP 408/429, and
5xx responses remain queued. Other 4xx validation failures are discarded so
they cannot loop forever. Legacy queued `event_id` values are normalized to
`client_event_id` before transmission.

## Operations

Install with `pnpm install`, then use:

```sh
pnpm test
pnpm exec wrangler d1 migrations apply mynest-pilot --local --config workers/mynest-api/wrangler.jsonc
pnpm exec wrangler d1 migrations list mynest-pilot --remote --config workers/mynest-api/wrangler.jsonc
pnpm exec wrangler d1 migrations apply mynest-pilot --remote --config workers/mynest-api/wrangler.jsonc
pnpm run mynest:deploy
```

After families complete steps, authorized operators can retrieve the anonymous
structured records with a read-only Wrangler query:

```sh
pnpm exec wrangler d1 execute mynest-pilot --remote \
  --config workers/mynest-api/wrangler.jsonc \
  --command="SELECT household_id, event_type, step, own_room_nights, verified_transition, client_created_at FROM mynest_pilot_events ORDER BY created_at DESC LIMIT 100;"
```

## Rollback

Remove the narrow Worker route or deploy the previous Worker version, then
revert the frontend commit. The local queue will continue retaining opted-in
events while the API is unavailable. Do not drop the D1 table or database;
retain it for recovery and audit.

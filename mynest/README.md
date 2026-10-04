# MyNest pilot

MyNest is a parent-led own-room transition pilot for children ages 2.5–6.
The static portal works without a backend and keeps the full family plan in
the browser. Families can explicitly choose anonymous pilot sharing.

## Backend

Anonymous events are sent to the same-origin Cloudflare Worker endpoint at
`POST /api/mynest/pilot-events`. The Worker validates and allowlists every
field before inserting into the `mynest-pilot` D1 database. No database
credentials are exposed to the browser.

The portal sends structured fields only:
pilot code, age band, problem class, theme, room-entry signal, sleep result,
checkpoint day, success count, and verified-transition signal. Optional notes
and child-selected item text never leave the browser.

Events are queued locally when offline and retried on the next visit. The
`client_event_id` unique key and Worker conflict handling make retries
idempotent. Network failures and HTTP 5xx responses remain queued; permanent
HTTP 4xx validation failures are removed so they cannot retry forever.

## Useful pilot query

```sql
SELECT
  household_id,
  MAX(own_room_nights) AS own_room_nights,
  MAX(verified_transition) AS verified_transition,
  MAX(client_created_at) AS last_check_in
FROM mynest_pilot_events
GROUP BY household_id
ORDER BY last_check_in DESC;
```

Run a read-only query against production D1 with Wrangler:

```sh
pnpm exec wrangler d1 execute mynest-pilot --remote \
  --config workers/mynest-api/wrangler.jsonc \
  --command="SELECT household_id, event_type, step, own_room_nights, verified_transition, client_created_at FROM mynest_pilot_events ORDER BY created_at DESC LIMIT 100;"
```

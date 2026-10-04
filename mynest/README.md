# MyNest pilot

MyNest is a parent-led own-room transition pilot for children ages 2.5–6.
The static portal works without a backend and keeps the full family plan in
the browser. Families can explicitly choose anonymous pilot sharing.

## Backend activation

1. Create or select a Supabase project.
2. Run `supabase/migrations/20261004_create_mynest_pilot_events.sql` in its SQL editor.
3. Put the public project URL and **anon** key in `mynest/backend-config.js`.
4. Never put a Supabase service-role key in this repository.
5. Verify a test row appears in `public.mynest_pilot_events` before inviting families.

The browser has insert-only access. Row-level security prevents anonymous
clients from reading pilot records. The portal sends structured fields only:
pilot code, age band, problem class, theme, room-entry signal, sleep result,
checkpoint day, success count, and verified-transition signal. Optional notes
and child-selected item text never leave the browser.

Events are queued locally when offline and retried on the next visit. The
`event_id` primary key and PostgREST conflict handling make retries idempotent.

## Useful pilot query

```sql
select
  household_id,
  max((payload ->> 'own_room_nights')::int) as own_room_nights,
  bool_or(coalesce((payload ->> 'verified_transition')::boolean, false)) as verified_transition,
  max(client_created_at) as last_check_in
from public.mynest_pilot_events
group by household_id
order by last_check_in desc;
```

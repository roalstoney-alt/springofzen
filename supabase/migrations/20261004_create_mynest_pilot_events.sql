-- MyNest room-transition pilot: anonymous, append-only event collection.
-- Run this migration in the Supabase SQL editor before adding the public
-- project URL and anon key to mynest/backend-config.js.

create table if not exists public.mynest_pilot_events (
  event_id uuid primary key,
  household_id text not null check (household_id ~ '^NEST-[A-Z0-9]{4}$'),
  event_type text not null check (
    event_type in (
      'diagnosis_saved',
      'theme_chosen',
      'plan_prepared',
      'first_night_saved',
      'checkpoint_saved'
    )
  ),
  step smallint not null check (step between 1 and 5),
  client_created_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb check (octet_length(payload::text) <= 8192),
  created_at timestamptz not null default now()
);

create index if not exists mynest_pilot_events_household_idx
  on public.mynest_pilot_events (household_id, client_created_at);

create index if not exists mynest_pilot_events_type_idx
  on public.mynest_pilot_events (event_type, created_at);

alter table public.mynest_pilot_events enable row level security;

revoke all on table public.mynest_pilot_events from anon, authenticated;
grant insert on table public.mynest_pilot_events to anon, authenticated;

drop policy if exists "allow anonymous pilot inserts" on public.mynest_pilot_events;
create policy "allow anonymous pilot inserts"
  on public.mynest_pilot_events
  for insert
  to anon, authenticated
  with check (
    household_id ~ '^NEST-[A-Z0-9]{4}$'
    and event_type in (
      'diagnosis_saved',
      'theme_chosen',
      'plan_prepared',
      'first_night_saved',
      'checkpoint_saved'
    )
    and step between 1 and 5
    and octet_length(payload::text) <= 8192
  );

comment on table public.mynest_pilot_events is
  'Anonymous, append-only structured progress events for the MyNest 10-family pilot. Public clients may insert but cannot read.';

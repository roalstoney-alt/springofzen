CREATE TABLE IF NOT EXISTS mynest_pilot_events (
  id TEXT PRIMARY KEY NOT NULL,
  client_event_id TEXT NOT NULL UNIQUE,
  household_id TEXT NOT NULL
    CHECK (household_id GLOB 'NEST-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]'),
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'diagnosis_saved',
      'theme_chosen',
      'plan_prepared',
      'first_night_saved',
      'checkpoint_saved'
    )),
  step INTEGER NOT NULL CHECK (step BETWEEN 1 AND 5),
  client_created_at TEXT NOT NULL,
  age_band TEXT CHECK (age_band IS NULL OR age_band IN ('2.5–3', '4', '5', '6')),
  problem_code TEXT CHECK (problem_code IS NULL OR problem_code IN ('F01', 'F02', 'F03', 'F04', 'F05', 'F06')),
  theme TEXT CHECK (theme IS NULL OR theme IN ('space', 'forest', 'ocean')),
  room_entry_willingness TEXT
    CHECK (room_entry_willingness IS NULL OR room_entry_willingness IN ('easy', 'support', 'no')),
  own_room_result TEXT
    CHECK (own_room_result IS NULL OR own_room_result IN ('full', 'part', 'attempt', 'none')),
  own_room_nights INTEGER NOT NULL CHECK (own_room_nights BETWEEN 0 AND 5),
  verified_transition INTEGER NOT NULL CHECK (verified_transition IN (0, 1)),
  readiness_confirmed INTEGER
    CHECK (readiness_confirmed IS NULL OR readiness_confirmed IN (0, 1)),
  checkpoint_day INTEGER
    CHECK (checkpoint_day IS NULL OR checkpoint_day IN (1, 3, 7, 14)),
  checkpoint_willingness TEXT
    CHECK (checkpoint_willingness IS NULL OR checkpoint_willingness IN ('easy', 'support', 'no')),
  checkpoint_result TEXT
    CHECK (checkpoint_result IS NULL OR checkpoint_result IN ('full', 'part', 'attempt', 'none')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS mynest_pilot_events_created_at_idx
  ON mynest_pilot_events (created_at);

CREATE INDEX IF NOT EXISTS mynest_pilot_events_household_idx
  ON mynest_pilot_events (household_id, client_created_at);

CREATE INDEX IF NOT EXISTS mynest_pilot_events_type_idx
  ON mynest_pilot_events (event_type, created_at);

CREATE INDEX IF NOT EXISTS mynest_pilot_events_checkpoint_day_idx
  ON mynest_pilot_events (checkpoint_day)
  WHERE checkpoint_day IS NOT NULL;

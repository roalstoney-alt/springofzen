CREATE TABLE IF NOT EXISTS mynest_magic_room_events (
  id TEXT PRIMARY KEY NOT NULL,
  client_event_id TEXT NOT NULL UNIQUE,
  magic_pilot_id TEXT NOT NULL CHECK (length(magic_pilot_id) = 9 AND substr(magic_pilot_id, 1, 3) = 'MR-'),
  action TEXT NOT NULL CHECK (action IN ('baseline', 'first_exposure', 'day3', 'day7', 'day14')),
  consent_version TEXT NOT NULL,

  age_band TEXT CHECK (age_band IS NULL OR age_band IN ('3-4', '4-5', '5-6')),
  world TEXT NOT NULL CHECK (world IN ('ocean', 'forest', 'space')),
  character TEXT NOT NULL,

  baseline_voluntary_entry TEXT,
  baseline_time_in_room TEXT,
  baseline_child_requests_room TEXT,
  baseline_shows_room INTEGER CHECK (baseline_shows_room IS NULL OR baseline_shows_room IN (0, 1)),
  baseline_bedtime_acceptance TEXT,

  entered_without_prompt INTEGER CHECK (entered_without_prompt IS NULL OR entered_without_prompt IN (0, 1)),
  approached_projection INTEGER CHECK (approached_projection IS NULL OR approached_projection IN (0, 1)),
  pointed_to_character INTEGER CHECK (pointed_to_character IS NULL OR pointed_to_character IN (0, 1)),
  spoke_to_character INTEGER CHECK (spoke_to_character IS NULL OR spoke_to_character IN (0, 1)),
  requested_repeat INTEGER CHECK (requested_repeat IS NULL OR requested_repeat IN (0, 1)),
  asked_question INTEGER CHECK (asked_question IS NULL OR asked_question IN (0, 1)),
  requested_other_world INTEGER CHECK (requested_other_world IS NULL OR requested_other_world IN (0, 1)),
  stayed_after_parent_moved_away INTEGER CHECK (stayed_after_parent_moved_away IS NULL OR stayed_after_parent_moved_away IN (0, 1)),
  first_exposure_duration TEXT,

  day_3_return INTEGER CHECK (day_3_return IS NULL OR day_3_return IN (0, 1)),
  requested_world INTEGER CHECK (requested_world IS NULL OR requested_world IN (0, 1)),
  requested_character INTEGER CHECK (requested_character IS NULL OR requested_character IN (0, 1)),
  day_3_session_duration TEXT,

  voluntary_entries INTEGER CHECK (voluntary_entries IS NULL OR voluntary_entries BETWEEN 0 AND 50),
  world_requests INTEGER CHECK (world_requests IS NULL OR world_requests BETWEEN 0 AND 50),
  character_requests INTEGER CHECK (character_requests IS NULL OR character_requests BETWEEN 0 AND 50),
  average_session_duration TEXT,
  asked_for_next_event INTEGER CHECK (asked_for_next_event IS NULL OR asked_for_next_event IN (0, 1)),
  showed_to_other_person INTEGER CHECK (showed_to_other_person IS NULL OR showed_to_other_person IN (0, 1)),
  preferred_world TEXT,
  preferred_character TEXT,

  return_desire TEXT,
  novelty_decay TEXT,
  day_14_return INTEGER CHECK (day_14_return IS NULL OR day_14_return IN (0, 1)),
  self_initiated_room_use INTEGER CHECK (self_initiated_room_use IS NULL OR self_initiated_room_use IN (0, 1)),
  bedtime_acceptance_change TEXT,
  own_room_attempt_change TEXT,

  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS mynest_magic_room_events_pilot_idx
  ON mynest_magic_room_events (magic_pilot_id, action, created_at);

CREATE INDEX IF NOT EXISTS mynest_magic_room_events_world_idx
  ON mynest_magic_room_events (world, character, action);

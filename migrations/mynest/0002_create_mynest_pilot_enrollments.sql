CREATE TABLE IF NOT EXISTS mynest_pilot_enrollments (
  pilot_id TEXT PRIMARY KEY NOT NULL
    CHECK (pilot_id GLOB 'P-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]'),
  household_id TEXT NOT NULL UNIQUE
    CHECK (household_id GLOB 'H-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]'),
  child_id TEXT NOT NULL UNIQUE
    CHECK (child_id GLOB 'C-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]'),
  cohort_id TEXT,
  status TEXT NOT NULL
    CHECK (status IN (
      'NOT_CURRENT_COHORT', 'OUTSIDE_V0.1', 'HOLD', 'WAITLIST',
      'CONTENT_ONLY', 'OUT_OF_SCOPE', 'ELIGIBLE', 'CONSENTED',
      'DAY_0_COMPLETE', 'PILOT_ACTIVE', 'PILOT_COMPLETE', 'WITHDRAWN',
      'LOST_FOLLOWUP'
    )),
  group_assignment TEXT CHECK (group_assignment IS NULL OR group_assignment IN ('A', 'B', 'C')),

  screen_event_id TEXT NOT NULL UNIQUE,
  consent_event_id TEXT UNIQUE,
  day0_event_id TEXT UNIQUE,

  age_band TEXT NOT NULL
    CHECK (age_band IN ('under-2.5', '2.5-3', '3-4', '4-5', '5-6', 'over-6')),
  sleep_location TEXT NOT NULL
    CHECK (sleep_location IN (
      'parent_bed', 'parent_room_separate_bed', 'own_room_parent_present',
      'own_room_returns', 'own_room_independent', 'other'
    )),
  transition_goal TEXT NOT NULL
    CHECK (transition_goal IN (
      'co_sleeping_to_own_room', 'reduce_parent_presence', 'reduce_returns',
      'room_comfort', 'not_sure'
    )),
  safe_space INTEGER NOT NULL CHECK (safe_space IN (0, 1)),
  transition_next_14_days INTEGER NOT NULL CHECK (transition_next_14_days IN (0, 1)),
  follow_up_available INTEGER NOT NULL CHECK (follow_up_available IN (0, 1)),
  medical_scope_request INTEGER NOT NULL CHECK (medical_scope_request IN (0, 1)),

  consent_version TEXT,
  consent_timestamp TEXT,
  day0_timestamp TEXT,

  own_room_nights_last_7 INTEGER CHECK (own_room_nights_last_7 BETWEEN 0 AND 7),
  parent_room_nights_last_7 INTEGER CHECK (parent_room_nights_last_7 BETWEEN 0 AND 7),
  parent_present_until_sleep TEXT
    CHECK (parent_present_until_sleep IS NULL OR parent_present_until_sleep IN ('always', 'sometimes', 'no')),
  night_returns_to_parent TEXT
    CHECK (night_returns_to_parent IS NULL OR night_returns_to_parent IN ('never', 'once', 'multiple')),
  room_entry_resistance TEXT
    CHECK (room_entry_resistance IS NULL OR room_entry_resistance IN ('yes', 'with_resistance', 'no')),
  current_night_light TEXT
    CHECK (current_night_light IS NULL OR current_night_light IN ('none', 'dim', 'bright')),
  current_sound TEXT
    CHECK (current_sound IS NULL OR current_sound IN ('quiet', 'steady', 'variable')),
  previous_transition_attempt TEXT
    CHECK (previous_transition_attempt IS NULL OR previous_transition_attempt IN ('none', 'once', 'multiple')),

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS mynest_pilot_enrollments_status_idx
  ON mynest_pilot_enrollments (status, updated_at);

CREATE INDEX IF NOT EXISTS mynest_pilot_enrollments_cohort_idx
  ON mynest_pilot_enrollments (cohort_id, group_assignment, status);

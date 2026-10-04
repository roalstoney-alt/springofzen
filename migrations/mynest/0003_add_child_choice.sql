ALTER TABLE mynest_pilot_events
  ADD COLUMN child_choice TEXT
  CHECK (child_choice IS NULL OR child_choice IN ('light', 'story_sound', 'room_friend'));

CREATE INDEX IF NOT EXISTS mynest_pilot_events_child_choice_idx
  ON mynest_pilot_events (child_choice, created_at)
  WHERE child_choice IS NOT NULL;

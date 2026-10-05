ALTER TABLE mynest_pilot_enrollments ADD COLUMN acquisition_source TEXT;
ALTER TABLE mynest_pilot_enrollments ADD COLUMN acquisition_medium TEXT;
ALTER TABLE mynest_pilot_enrollments ADD COLUMN campaign_key TEXT;
ALTER TABLE mynest_pilot_enrollments ADD COLUMN content_key TEXT;
ALTER TABLE mynest_pilot_enrollments ADD COLUMN voucher_eligible INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mynest_pilot_enrollments ADD COLUMN completed_at TEXT;

ALTER TABLE mynest_pilot_events ADD COLUMN pilot_id TEXT;
ALTER TABLE mynest_pilot_events ADD COLUMN recruitment_household_id TEXT;
ALTER TABLE mynest_pilot_events ADD COLUMN recruitment_child_id TEXT;

CREATE INDEX IF NOT EXISTS mynest_pilot_enrollments_acquisition_idx
  ON mynest_pilot_enrollments (acquisition_source, acquisition_medium, campaign_key);

CREATE INDEX IF NOT EXISTS mynest_pilot_events_pilot_checkpoint_idx
  ON mynest_pilot_events (pilot_id, recruitment_household_id, recruitment_child_id, event_type, checkpoint_day);

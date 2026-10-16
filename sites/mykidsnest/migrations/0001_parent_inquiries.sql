CREATE TABLE IF NOT EXISTS inquiries (
 id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, dedupe_key TEXT NOT NULL UNIQUE,
 payload_hash TEXT NOT NULL, parent_name TEXT NOT NULL, email TEXT NOT NULL,
 world TEXT NOT NULL CHECK(world IN ('ocean','space','forest','undecided')),
 inquiry_type TEXT NOT NULL CHECK(inquiry_type IN ('premade','custom','question','privacy')),
 room_width REAL, room_length REAL, unit TEXT NOT NULL CHECK(unit IN ('cm','in')),
 preference TEXT NOT NULL, consent_version TEXT NOT NULL,
 consent_recorded_at INTEGER NOT NULL, source TEXT NOT NULL,
 campaign TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiries_expiry ON inquiries(expires_at);
CREATE TABLE IF NOT EXISTS inquiry_limits (key TEXT PRIMARY KEY,hits INTEGER NOT NULL,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS inquiry_limits_expiry ON inquiry_limits(expires_at);

const API_PATH = "/api/mynest/pilot-events";
const RECRUITMENT_PATH = "/api/mynest/pilot-recruitment";
const MAX_BODY_BYTES = 4096;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_ISOLATE = 120;

export const ALLOWED_ORIGINS = new Set([
  "https://springofzen.com",
  "https://www.springofzen.com"
]);

export const ALLOWED_EVENT_TYPES = new Set([
  "diagnosis_saved",
  "theme_chosen",
  "plan_prepared",
  "first_night_saved",
  "checkpoint_saved"
]);

export const PROHIBITED_FIELDS = new Set([
  "name",
  "child_name",
  "email",
  "phone",
  "address",
  "notes",
  "note",
  "comment",
  "message",
  "free_text",
  "text",
  "exact_birthdate",
  "date_of_birth",
  "birthdate",
  "dob",
  "child_selected_text",
  "tinyChoice"
]);

const TOP_LEVEL_FIELDS = new Set([
  "client_event_id",
  "household_id",
  "event_type",
  "step",
  "client_created_at",
  "payload"
]);

export const PAYLOAD_FIELDS = new Set([
  "age_band",
  "problem_code",
  "theme",
  "room_entry_willingness",
  "own_room_result",
  "own_room_nights",
  "verified_transition",
  "readiness_confirmed",
  "checkpoint_day",
  "checkpoint_willingness",
  "checkpoint_result"
]);

const AGE_BANDS = new Set(["2.5–3", "4", "5", "6"]);
const PROBLEM_CODES = new Set(["F01", "F02", "F03", "F04", "F05", "F06"]);
const THEMES = new Set(["space", "forest", "ocean"]);
const WILLINGNESS = new Set(["easy", "support", "no"]);
const RESULTS = new Set(["full", "part", "attempt", "none"]);
const CHECKPOINT_DAYS = new Set([1, 3, 7, 14]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HOUSEHOLD_PATTERN = /^NEST-[A-Z0-9]{4}$/;
const RECRUITMENT_ID_PATTERNS = {
  household_id: /^H-[A-Z0-9]{4}$/,
  child_id: /^C-[A-Z0-9]{4}$/,
  pilot_id: /^P-[A-Z0-9]{4}$/
};

const RECRUITMENT_ACTIONS = new Set(["screen", "consent", "day0"]);
const RECRUITMENT_TOP_LEVEL_FIELDS = new Set([
  "client_event_id",
  "action",
  "household_id",
  "child_id",
  "pilot_id",
  "payload"
]);
const SCREEN_FIELDS = new Set([
  "age_band",
  "sleep_location",
  "transition_goal",
  "safe_space",
  "transition_next_14_days",
  "follow_up_available",
  "medical_scope_request"
]);
const CONSENT_FIELDS = new Set(["pilot_consent", "consent_version"]);
const DAY0_FIELDS = new Set([
  "own_room_nights_last_7",
  "parent_room_nights_last_7",
  "parent_present_until_sleep",
  "night_returns_to_parent",
  "room_entry_resistance",
  "current_night_light",
  "current_sound",
  "previous_transition_attempt"
]);

const SCREEN_AGE_BANDS = new Set(["under-2.5", "2.5-3", "3-4", "4-5", "5-6", "over-6"]);
const SLEEP_LOCATIONS = new Set(["parent_bed", "parent_room_separate_bed", "own_room_parent_present", "own_room_returns", "own_room_independent", "other"]);
const TRANSITION_GOALS = new Set(["co_sleeping_to_own_room", "reduce_parent_presence", "reduce_returns", "room_comfort", "not_sure"]);
const PARENT_PRESENCE = new Set(["always", "sometimes", "no"]);
const NIGHT_RETURNS = new Set(["never", "once", "multiple"]);
const ROOM_RESISTANCE = new Set(["yes", "with_resistance", "no"]);
const NIGHT_LIGHT = new Set(["none", "dim", "bright"]);
const CURRENT_SOUND = new Set(["quiet", "steady", "variable"]);
const PREVIOUS_ATTEMPT = new Set(["none", "once", "multiple"]);
const GROUP_SEQUENCE = ["A", "B", "C", "C", "A", "B", "C", "A", "B", "C"];

let rateWindowStart = 0;
let rateWindowCount = 0;

function corsHeaders(origin) {
  if (!ALLOWED_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function json(body, status, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin)
    }
  });
}

function reject(code, message, status, origin) {
  return json({ ok: false, error: code, message }, status, origin);
}

function rateAllowed(now = Date.now()) {
  if (now - rateWindowStart >= RATE_WINDOW_MS) {
    rateWindowStart = now;
    rateWindowCount = 0;
  }
  rateWindowCount += 1;
  return rateWindowCount <= RATE_LIMIT_PER_ISOLATE;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function firstUnexpectedField(object, allowed) {
  return Object.keys(object).find((key) => !allowed.has(key));
}

function firstProhibitedField(object) {
  return Object.keys(object).find((key) => PROHIBITED_FIELDS.has(key));
}

function optionalEnum(value, allowed) {
  return value === null || allowed.has(value);
}

export function validateEvent(input) {
  if (!isPlainObject(input)) return { ok: false, code: "INVALID_BODY", message: "Body must be a JSON object." };

  const prohibitedTopLevel = firstProhibitedField(input);
  if (prohibitedTopLevel) return { ok: false, code: "PROHIBITED_FIELD", message: `Field is not permitted: ${prohibitedTopLevel}` };
  const unexpectedTopLevel = firstUnexpectedField(input, TOP_LEVEL_FIELDS);
  if (unexpectedTopLevel) return { ok: false, code: "UNKNOWN_FIELD", message: `Unknown field: ${unexpectedTopLevel}` };

  if (!UUID_PATTERN.test(input.client_event_id || "")) return { ok: false, code: "INVALID_CLIENT_EVENT_ID", message: "client_event_id must be a UUID v4." };
  if (!HOUSEHOLD_PATTERN.test(input.household_id || "")) return { ok: false, code: "INVALID_HOUSEHOLD_ID", message: "household_id is invalid." };
  if (!ALLOWED_EVENT_TYPES.has(input.event_type)) return { ok: false, code: "INVALID_EVENT_TYPE", message: "event_type is invalid." };
  if (!Number.isInteger(input.step) || input.step < 1 || input.step > 5) return { ok: false, code: "INVALID_STEP", message: "step must be an integer from 1 to 5." };
  if (typeof input.client_created_at !== "string" || input.client_created_at.length > 40 || Number.isNaN(Date.parse(input.client_created_at))) {
    return { ok: false, code: "INVALID_TIMESTAMP", message: "client_created_at must be a bounded ISO timestamp." };
  }
  if (!isPlainObject(input.payload)) return { ok: false, code: "INVALID_PAYLOAD", message: "payload must be an object." };

  const prohibitedPayload = firstProhibitedField(input.payload);
  if (prohibitedPayload) return { ok: false, code: "PROHIBITED_FIELD", message: `Field is not permitted: ${prohibitedPayload}` };
  const unexpectedPayload = firstUnexpectedField(input.payload, PAYLOAD_FIELDS);
  if (unexpectedPayload) return { ok: false, code: "UNKNOWN_FIELD", message: `Unknown payload field: ${unexpectedPayload}` };

  const payload = {
    age_band: input.payload.age_band ?? null,
    problem_code: input.payload.problem_code ?? null,
    theme: input.payload.theme ?? null,
    room_entry_willingness: input.payload.room_entry_willingness ?? null,
    own_room_result: input.payload.own_room_result ?? null,
    own_room_nights: input.payload.own_room_nights,
    verified_transition: input.payload.verified_transition,
    readiness_confirmed: input.payload.readiness_confirmed ?? null,
    checkpoint_day: input.payload.checkpoint_day ?? null,
    checkpoint_willingness: input.payload.checkpoint_willingness ?? null,
    checkpoint_result: input.payload.checkpoint_result ?? null
  };

  if (!optionalEnum(payload.age_band, AGE_BANDS)) return { ok: false, code: "INVALID_AGE_BAND", message: "age_band is invalid." };
  if (!optionalEnum(payload.problem_code, PROBLEM_CODES)) return { ok: false, code: "INVALID_PROBLEM_CODE", message: "problem_code is invalid." };
  if (!optionalEnum(payload.theme, THEMES)) return { ok: false, code: "INVALID_THEME", message: "theme is invalid." };
  if (!optionalEnum(payload.room_entry_willingness, WILLINGNESS)) return { ok: false, code: "INVALID_WILLINGNESS", message: "room_entry_willingness is invalid." };
  if (!optionalEnum(payload.own_room_result, RESULTS)) return { ok: false, code: "INVALID_RESULT", message: "own_room_result is invalid." };
  if (!Number.isInteger(payload.own_room_nights) || payload.own_room_nights < 0 || payload.own_room_nights > 5) return { ok: false, code: "INVALID_NIGHT_COUNT", message: "own_room_nights must be an integer from 0 to 5." };
  if (typeof payload.verified_transition !== "boolean") return { ok: false, code: "INVALID_VERIFIED_TRANSITION", message: "verified_transition must be boolean." };
  if (payload.readiness_confirmed !== null && typeof payload.readiness_confirmed !== "boolean") return { ok: false, code: "INVALID_READINESS", message: "readiness_confirmed must be boolean or null." };
  if (payload.checkpoint_day !== null && !CHECKPOINT_DAYS.has(payload.checkpoint_day)) return { ok: false, code: "INVALID_CHECKPOINT_DAY", message: "checkpoint_day must be 1, 3, 7, 14, or null." };
  if (!optionalEnum(payload.checkpoint_willingness, WILLINGNESS)) return { ok: false, code: "INVALID_CHECKPOINT_WILLINGNESS", message: "checkpoint_willingness is invalid." };
  if (!optionalEnum(payload.checkpoint_result, RESULTS)) return { ok: false, code: "INVALID_CHECKPOINT_RESULT", message: "checkpoint_result is invalid." };

  if (input.event_type === "diagnosis_saved" && (!payload.age_band || !payload.problem_code)) return { ok: false, code: "INCOMPLETE_DIAGNOSIS", message: "Diagnosis event requires age_band and problem_code." };
  if (input.event_type === "theme_chosen" && !payload.theme) return { ok: false, code: "INCOMPLETE_THEME", message: "Theme event requires theme." };
  if (input.event_type === "plan_prepared" && payload.readiness_confirmed !== true) return { ok: false, code: "INCOMPLETE_READINESS", message: "Prepared event requires readiness confirmation." };
  if (input.event_type === "first_night_saved" && (!payload.room_entry_willingness || !payload.own_room_result)) return { ok: false, code: "INCOMPLETE_FIRST_NIGHT", message: "First-night event requires room entry and result." };
  if (input.event_type === "checkpoint_saved" && (!payload.checkpoint_day || !payload.checkpoint_willingness || !payload.checkpoint_result)) return { ok: false, code: "INCOMPLETE_CHECKPOINT", message: "Checkpoint event is incomplete." };

  return { ok: true, value: { ...input, payload } };
}

function requiredBoolean(value) {
  return typeof value === "boolean";
}

export function eligibilityForScreen(payload) {
  if (payload.age_band === "under-2.5") return "NOT_CURRENT_COHORT";
  if (payload.age_band === "over-6") return "OUTSIDE_V0.1";
  if (!payload.safe_space) return "HOLD";
  if (!payload.transition_next_14_days) return "WAITLIST";
  if (!payload.follow_up_available) return "CONTENT_ONLY";
  if (payload.medical_scope_request) return "OUT_OF_SCOPE";
  return "ELIGIBLE";
}

export function validateRecruitment(input) {
  if (!isPlainObject(input)) return { ok: false, code: "INVALID_BODY", message: "Body must be a JSON object." };

  const prohibitedTopLevel = firstProhibitedField(input);
  if (prohibitedTopLevel) return { ok: false, code: "PROHIBITED_FIELD", message: `Field is not permitted: ${prohibitedTopLevel}` };
  const unexpectedTopLevel = firstUnexpectedField(input, RECRUITMENT_TOP_LEVEL_FIELDS);
  if (unexpectedTopLevel) return { ok: false, code: "UNKNOWN_FIELD", message: `Unknown field: ${unexpectedTopLevel}` };

  if (!UUID_PATTERN.test(input.client_event_id || "")) return { ok: false, code: "INVALID_CLIENT_EVENT_ID", message: "client_event_id must be a UUID v4." };
  if (!RECRUITMENT_ACTIONS.has(input.action)) return { ok: false, code: "INVALID_ACTION", message: "action is invalid." };
  for (const [field, pattern] of Object.entries(RECRUITMENT_ID_PATTERNS)) {
    if (!pattern.test(input[field] || "")) return { ok: false, code: "INVALID_ANONYMOUS_ID", message: `${field} is invalid.` };
  }
  if (!isPlainObject(input.payload)) return { ok: false, code: "INVALID_PAYLOAD", message: "payload must be an object." };

  const prohibitedPayload = firstProhibitedField(input.payload);
  if (prohibitedPayload) return { ok: false, code: "PROHIBITED_FIELD", message: `Field is not permitted: ${prohibitedPayload}` };

  const allowedFields = input.action === "screen" ? SCREEN_FIELDS : input.action === "consent" ? CONSENT_FIELDS : DAY0_FIELDS;
  const unexpectedPayload = firstUnexpectedField(input.payload, allowedFields);
  if (unexpectedPayload) return { ok: false, code: "UNKNOWN_FIELD", message: `Unknown payload field: ${unexpectedPayload}` };

  const payload = input.payload;
  if (input.action === "screen") {
    if (!SCREEN_AGE_BANDS.has(payload.age_band)) return { ok: false, code: "INVALID_AGE_BAND", message: "age_band is invalid." };
    if (!SLEEP_LOCATIONS.has(payload.sleep_location)) return { ok: false, code: "INVALID_SLEEP_LOCATION", message: "sleep_location is invalid." };
    if (!TRANSITION_GOALS.has(payload.transition_goal)) return { ok: false, code: "INVALID_TRANSITION_GOAL", message: "transition_goal is invalid." };
    for (const field of ["safe_space", "transition_next_14_days", "follow_up_available", "medical_scope_request"]) {
      if (!requiredBoolean(payload[field])) return { ok: false, code: "INVALID_SCREEN", message: `${field} must be boolean.` };
    }
  } else if (input.action === "consent") {
    if (payload.pilot_consent !== true) return { ok: false, code: "CONSENT_REQUIRED", message: "Explicit pilot consent is required." };
    if (payload.consent_version !== "MYNEST_CONSENT_v0.1") return { ok: false, code: "INVALID_CONSENT_VERSION", message: "consent_version is invalid." };
  } else {
    for (const field of ["own_room_nights_last_7", "parent_room_nights_last_7"]) {
      if (!Number.isInteger(payload[field]) || payload[field] < 0 || payload[field] > 7) return { ok: false, code: "INVALID_BASELINE_COUNT", message: `${field} must be an integer from 0 to 7.` };
    }
    if (!PARENT_PRESENCE.has(payload.parent_present_until_sleep)) return { ok: false, code: "INVALID_BASELINE", message: "parent_present_until_sleep is invalid." };
    if (!NIGHT_RETURNS.has(payload.night_returns_to_parent)) return { ok: false, code: "INVALID_BASELINE", message: "night_returns_to_parent is invalid." };
    if (!ROOM_RESISTANCE.has(payload.room_entry_resistance)) return { ok: false, code: "INVALID_BASELINE", message: "room_entry_resistance is invalid." };
    if (!NIGHT_LIGHT.has(payload.current_night_light)) return { ok: false, code: "INVALID_BASELINE", message: "current_night_light is invalid." };
    if (!CURRENT_SOUND.has(payload.current_sound)) return { ok: false, code: "INVALID_BASELINE", message: "current_sound is invalid." };
    if (!PREVIOUS_ATTEMPT.has(payload.previous_transition_attempt)) return { ok: false, code: "INVALID_BASELINE", message: "previous_transition_attempt is invalid." };
  }

  return { ok: true, value: input };
}

async function insertEvent(env, event) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const payload = event.payload;
  const statement = env.MYNEST_DB.prepare(`
    INSERT INTO mynest_pilot_events (
      id, client_event_id, household_id, event_type, step, client_created_at,
      age_band, problem_code, theme, room_entry_willingness, own_room_result,
      own_room_nights, verified_transition, readiness_confirmed, checkpoint_day,
      checkpoint_willingness, checkpoint_result, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(client_event_id) DO UPDATE SET client_event_id = excluded.client_event_id
    RETURNING id
  `).bind(
    id,
    event.client_event_id,
    event.household_id,
    event.event_type,
    event.step,
    event.client_created_at,
    payload.age_band,
    payload.problem_code,
    payload.theme,
    payload.room_entry_willingness,
    payload.own_room_result,
    payload.own_room_nights,
    payload.verified_transition ? 1 : 0,
    payload.readiness_confirmed === null ? null : (payload.readiness_confirmed ? 1 : 0),
    payload.checkpoint_day,
    payload.checkpoint_willingness,
    payload.checkpoint_result,
    createdAt
  );
  const row = await statement.first();
  return row?.id || id;
}

async function getEnrollment(env, pilotId) {
  return env.MYNEST_DB.prepare(`
    SELECT household_id, child_id, status, group_assignment,
           screen_event_id, consent_event_id, day0_event_id
    FROM mynest_pilot_enrollments
    WHERE pilot_id = ?
  `).bind(pilotId).first();
}

async function saveScreen(env, event) {
  const payload = event.payload;
  const status = eligibilityForScreen(payload);
  const now = new Date().toISOString();
  await env.MYNEST_DB.prepare(`
    INSERT OR IGNORE INTO mynest_pilot_enrollments (
      pilot_id, household_id, child_id, status, screen_event_id,
      age_band, sleep_location, transition_goal, safe_space,
      transition_next_14_days, follow_up_available, medical_scope_request,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    event.pilot_id,
    event.household_id,
    event.child_id,
    status,
    event.client_event_id,
    payload.age_band,
    payload.sleep_location,
    payload.transition_goal,
    payload.safe_space ? 1 : 0,
    payload.transition_next_14_days ? 1 : 0,
    payload.follow_up_available ? 1 : 0,
    payload.medical_scope_request ? 1 : 0,
    now,
    now
  ).run();
  const enrollment = await getEnrollment(env, event.pilot_id);
  if (!enrollment || enrollment.household_id !== event.household_id || enrollment.child_id !== event.child_id) {
    return { error: "ANONYMOUS_ID_COLLISION", message: "Please generate a new anonymous pilot identity.", statusCode: 409 };
  }
  return { status: enrollment?.status || status, group: enrollment?.group_assignment || null };
}

async function saveConsent(env, event) {
  const enrollment = await getEnrollment(env, event.pilot_id);
  if (!enrollment) return { error: "SCREEN_REQUIRED", message: "Complete the screener first.", statusCode: 409 };
  if (enrollment.household_id !== event.household_id || enrollment.child_id !== event.child_id) {
    return { error: "ANONYMOUS_ID_MISMATCH", message: "Anonymous pilot IDs do not match.", statusCode: 409 };
  }
  if (enrollment.status === "CONSENTED" || enrollment.status === "PILOT_ACTIVE") {
    return { status: enrollment.status, group: enrollment.group_assignment };
  }
  if (enrollment.status !== "ELIGIBLE") {
    return { error: "NOT_ELIGIBLE", message: "This pilot ID is not eligible for consent.", statusCode: 409 };
  }

  const cohort = await env.MYNEST_DB.prepare(`
    SELECT COUNT(*) AS count
    FROM mynest_pilot_enrollments
    WHERE consent_timestamp IS NOT NULL
      AND status IN ('CONSENTED', 'DAY_0_COMPLETE', 'PILOT_ACTIVE', 'PILOT_COMPLETE')
  `).first();
  const sequence = Number(cohort?.count || 0);
  if (sequence >= GROUP_SEQUENCE.length) {
    await env.MYNEST_DB.prepare(`
      UPDATE mynest_pilot_enrollments
      SET status = 'WAITLIST', updated_at = ?
      WHERE pilot_id = ? AND status = 'ELIGIBLE'
    `).bind(new Date().toISOString(), event.pilot_id).run();
    return { status: "WAITLIST", group: null };
  }

  const group = GROUP_SEQUENCE[sequence];
  const now = new Date().toISOString();
  const row = await env.MYNEST_DB.prepare(`
    UPDATE mynest_pilot_enrollments
    SET status = 'CONSENTED', consent_event_id = ?, consent_version = ?,
        consent_timestamp = ?, group_assignment = ?, cohort_id = 'MYNEST_COHORT_001',
        updated_at = ?
    WHERE pilot_id = ? AND status = 'ELIGIBLE'
    RETURNING status, group_assignment
  `).bind(event.client_event_id, event.payload.consent_version, now, group, now, event.pilot_id).first();
  if (!row) {
    const latest = await getEnrollment(env, event.pilot_id);
    return { status: latest?.status || "WAITLIST", group: latest?.group_assignment || null };
  }
  return { status: row.status, group: row.group_assignment };
}

async function saveDay0(env, event) {
  const enrollment = await getEnrollment(env, event.pilot_id);
  if (!enrollment) return { error: "SCREEN_REQUIRED", message: "Complete the screener first.", statusCode: 409 };
  if (enrollment.household_id !== event.household_id || enrollment.child_id !== event.child_id) {
    return { error: "ANONYMOUS_ID_MISMATCH", message: "Anonymous pilot IDs do not match.", statusCode: 409 };
  }
  if (enrollment.status === "PILOT_ACTIVE") return { status: enrollment.status, group: enrollment.group_assignment };
  if (enrollment.status !== "CONSENTED" && enrollment.status !== "DAY_0_COMPLETE") {
    return { error: "CONSENT_REQUIRED", message: "Pilot consent is required before Day 0.", statusCode: 409 };
  }

  const payload = event.payload;
  const now = new Date().toISOString();
  const row = await env.MYNEST_DB.prepare(`
    UPDATE mynest_pilot_enrollments
    SET status = 'PILOT_ACTIVE', day0_event_id = ?, day0_timestamp = ?,
        own_room_nights_last_7 = ?, parent_room_nights_last_7 = ?,
        parent_present_until_sleep = ?, night_returns_to_parent = ?,
        room_entry_resistance = ?, current_night_light = ?, current_sound = ?,
        previous_transition_attempt = ?, updated_at = ?
    WHERE pilot_id = ? AND status IN ('CONSENTED', 'DAY_0_COMPLETE')
    RETURNING status, group_assignment
  `).bind(
    event.client_event_id,
    now,
    payload.own_room_nights_last_7,
    payload.parent_room_nights_last_7,
    payload.parent_present_until_sleep,
    payload.night_returns_to_parent,
    payload.room_entry_resistance,
    payload.current_night_light,
    payload.current_sound,
    payload.previous_transition_attempt,
    now,
    event.pilot_id
  ).first();
  if (!row) return { error: "DAY0_CONFLICT", message: "Unable to activate this pilot.", statusCode: 409 };
  return { status: row.status, group: row.group_assignment };
}

async function handleRecruitment(env, event) {
  if (event.action === "screen") return saveScreen(env, event);
  if (event.action === "consent") return saveConsent(env, event);
  return saveDay0(env, event);
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  if (url.pathname !== API_PATH && url.pathname !== RECRUITMENT_PATH) return reject("NOT_FOUND", "Not found.", 404, origin);
  if (!ALLOWED_ORIGINS.has(origin)) return reject("ORIGIN_NOT_ALLOWED", "Origin is not allowed.", 403, origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "METHOD_NOT_ALLOWED", message: "Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", Allow: "POST, OPTIONS", ...corsHeaders(origin) }
    });
  }
  if (!rateAllowed()) return reject("RATE_LIMITED", "Please retry later.", 429, origin);

  const contentType = request.headers.get("Content-Type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) return reject("UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.", 415, origin);
  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return reject("BODY_TOO_LARGE", "Request body is too large.", 413, origin);

  let text;
  try {
    text = await request.text();
  } catch {
    return reject("INVALID_BODY", "Unable to read request body.", 400, origin);
  }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return reject("BODY_TOO_LARGE", "Request body is too large.", 413, origin);

  let input;
  try {
    input = JSON.parse(text);
  } catch {
    return reject("INVALID_JSON", "Body must contain valid JSON.", 400, origin);
  }

  const isRecruitment = url.pathname === RECRUITMENT_PATH;
  const validated = isRecruitment ? validateRecruitment(input) : validateEvent(input);
  if (!validated.ok) return reject(validated.code, validated.message, 400, origin);
  if (!env.MYNEST_DB) return reject("DATABASE_UNAVAILABLE", "Database is unavailable.", 503, origin);

  try {
    if (isRecruitment) {
      const result = await handleRecruitment(env, validated.value);
      if (result.error) return reject(result.error, result.message, result.statusCode, origin);
      return json({ ok: true, status: result.status, group: result.group }, 200, origin);
    }
    const eventId = await insertEvent(env, validated.value);
    return json({ ok: true, event_id: eventId }, 200, origin);
  } catch (error) {
    console.error("MyNest D1 insert failed", error?.message || "unknown");
    return reject("DATABASE_ERROR", "Unable to store event.", 503, origin);
  }
}

export function resetRateLimitForTests() {
  rateWindowStart = 0;
  rateWindowCount = 0;
}

export default { fetch: handleRequest };

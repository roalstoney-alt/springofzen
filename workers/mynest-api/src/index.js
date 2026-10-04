const API_PATH = "/api/mynest/pilot-events";
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

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  if (url.pathname !== API_PATH) return reject("NOT_FOUND", "Not found.", 404, origin);
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

  const validated = validateEvent(input);
  if (!validated.ok) return reject(validated.code, validated.message, 400, origin);
  if (!env.MYNEST_DB) return reject("DATABASE_UNAVAILABLE", "Database is unavailable.", 503, origin);

  try {
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

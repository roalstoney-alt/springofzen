import test from "node:test";
import assert from "node:assert/strict";
import worker, {
  PROHIBITED_FIELDS,
  eligibilityForScreen,
  markPilotCompleteIfReady,
  resetRateLimitForTests,
  validateRecruitment,
  validateMagicRoomEvent
} from "../src/index.js";

const ORIGIN = "https://www.springofzen.com";
const ENDPOINT = `${ORIGIN}/api/mynest/pilot-events`;
const MAGIC_ENDPOINT = `${ORIGIN}/api/mynest/magic-room-events`;

function validEvent(overrides = {}) {
  return {
    client_event_id: "177b8738-a546-4c31-9ca8-5a4fe7c2dd18",
    household_id: "NEST-A1B2",
    event_type: "first_night_saved",
    step: 4,
    client_created_at: "2026-10-04T12:00:00.000Z",
    payload: {
      age_band: "4",
      problem_code: "F03",
      theme: "space",
      child_choice: null,
      room_entry_willingness: "easy",
      own_room_result: "full",
      own_room_nights: 1,
      verified_transition: false,
      readiness_confirmed: true,
      checkpoint_day: null,
      checkpoint_willingness: null,
      checkpoint_result: null
    },
    ...overrides
  };
}

class FakeD1 {
  constructor() { this.byClientId = new Map(); }
  prepare() {
    return {
      bind: (...values) => ({
        first: async () => {
          const serverId = values[0];
          const clientId = values[1];
          if (!this.byClientId.has(clientId)) this.byClientId.set(clientId, { id: serverId, values });
          return { id: this.byClientId.get(clientId).id };
        }
      })
    };
  }
}

function request(body, init = {}) {
  const { headers = {}, ...rest } = init;
  return new Request(ENDPOINT, {
    method: "POST",
    ...rest,
    headers: { Origin: ORIGIN, "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function validRecruitment(action = "screen", payload = {}) {
  const defaults = action === "screen" ? {
    age_band: "4-5",
    sleep_location: "parent_bed",
    transition_goal: "co_sleeping_to_own_room",
    safe_space: true,
    transition_next_14_days: true,
    follow_up_available: true,
    medical_scope_request: false,
    acquisition_source: "google",
    acquisition_medium: "cpc",
    campaign_key: "mynest_cohort_001",
    content_key: "barrier_first"
  } : action === "consent" ? {
    pilot_consent: true,
    consent_version: "MYNEST_CONSENT_v0.1"
  } : {
    own_room_nights_last_7: 0,
    parent_room_nights_last_7: 7,
    parent_present_until_sleep: "always",
    night_returns_to_parent: "multiple",
    room_entry_resistance: "with_resistance",
    current_night_light: "dim",
    current_sound: "quiet",
    previous_transition_attempt: "once"
  };
  return {
    client_event_id: "8cf2ea61-57d3-4cd6-a023-b9b16cb4bdc8",
    action,
    household_id: "H-A1B2",
    child_id: "C-C3D4",
    pilot_id: "P-E5F6",
    payload: { ...defaults, ...payload }
  };
}

function validMagicRoom(action = "baseline", payload = {}) {
  const defaults = action === "baseline" ? {
    world: "ocean", character: "milo", age_band: "4-5",
    baseline_voluntary_entry: "sometimes", baseline_time_in_room: "10_30",
    baseline_child_requests_room: "never", baseline_shows_room: false,
    baseline_bedtime_acceptance: "mixed"
  } : action === "first_exposure" ? {
    world: "ocean", character: "milo", entered_without_prompt: true,
    approached_projection: true, pointed_to_character: true, spoke_to_character: false,
    requested_repeat: true, asked_question: true, requested_other_world: false,
    stayed_after_parent_moved_away: true, first_exposure_duration: "15_30"
  } : action === "day3" ? {
    world: "ocean", character: "milo", day_3_return: true, requested_world: true,
    requested_character: true, asked_for_next_event: true, day_3_session_duration: "15_30"
  } : action === "day7" ? {
    world: "ocean", character: "milo", voluntary_entries: 5, world_requests: 4,
    character_requests: 3, average_session_duration: "15_30", asked_for_next_event: true,
    showed_to_other_person: false, preferred_world: "ocean", preferred_character: "milo"
  } : {
    world: "ocean", character: "milo", return_desire: "spontaneous_repeated",
    novelty_decay: "high_persistence", day_14_return: true, self_initiated_room_use: true,
    preferred_world: "ocean", preferred_character: "milo",
    bedtime_acceptance_change: "not_observed", own_room_attempt_change: "not_observed"
  };
  return {
    client_event_id: "9cf2ea61-57d3-4cd6-a023-b9b16cb4bdc8",
    action,
    magic_pilot_id: "MR-A1B2C3",
    pilot_consent: true,
    consent_version: "MYNEST_MAGIC_ROOM_CONSENT_v0.1",
    payload: { ...defaults, ...payload }
  };
}

function magicRequest(body) {
  return new Request(MAGIC_ENDPOINT, {
    method: "POST",
    headers: { Origin: ORIGIN, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test.beforeEach(() => resetRateLimitForTests());

test("OPTIONS returns CORS response", async () => {
  const response = await worker.fetch(new Request(ENDPOINT, { method: "OPTIONS", headers: { Origin: ORIGIN } }), {});
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("GET is rejected", async () => {
  const response = await worker.fetch(new Request(ENDPOINT, { method: "GET", headers: { Origin: ORIGIN } }), {});
  assert.equal(response.status, 405);
});

test("valid event inserts and returns minimal response", async () => {
  const db = new FakeD1();
  const response = await worker.fetch(request(validEvent()), { MYNEST_DB: db });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(body).sort(), ["event_id", "ok"]);
  assert.equal(body.ok, true);
  assert.match(body.event_id, /^[0-9a-f-]{36}$/);
  assert.equal(db.byClientId.size, 1);
});

test("duplicate client_event_id creates one row", async () => {
  const db = new FakeD1();
  const first = await worker.fetch(request(validEvent()), { MYNEST_DB: db });
  const second = await worker.fetch(request(validEvent()), { MYNEST_DB: db });
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(db.byClientId.size, 1);
  assert.equal((await first.json()).event_id, (await second.json()).event_id);
});

test("unknown fields are rejected", async () => {
  const response = await worker.fetch(request(validEvent({ surprise: true })), { MYNEST_DB: new FakeD1() });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "UNKNOWN_FIELD");
});

test("frozen Child Choice values are accepted and arbitrary choices are rejected", () => {
  const choiceEvent = validEvent({
    event_type: "theme_chosen",
    step: 2,
    payload: { ...validEvent().payload, theme: null, child_choice: "light" }
  });
  assert.equal(validateRecruitment(validRecruitment("screen")).ok, true);
  return Promise.all([
    worker.fetch(request(choiceEvent), { MYNEST_DB: new FakeD1() }).then((response) => assert.equal(response.status, 200)),
    worker.fetch(request({ ...choiceEvent, payload: { ...choiceEvent.payload, child_choice: "spaceship" } }), { MYNEST_DB: new FakeD1() })
      .then(async (response) => {
        assert.equal(response.status, 400);
        assert.equal((await response.json()).error, "INVALID_CHILD_CHOICE");
      })
  ]);
});

test("all prohibited fields are rejected at both privacy boundaries", async () => {
  for (const field of PROHIBITED_FIELDS) {
    const topLevel = await worker.fetch(request(validEvent({ [field]: "synthetic" })), { MYNEST_DB: new FakeD1() });
    assert.equal(topLevel.status, 400, `top-level ${field}`);
    assert.equal((await topLevel.json()).error, "PROHIBITED_FIELD", `top-level ${field}`);

    const event = validEvent();
    event.payload[field] = "synthetic";
    const nested = await worker.fetch(request(event), { MYNEST_DB: new FakeD1() });
    assert.equal(nested.status, 400, `payload ${field}`);
    assert.equal((await nested.json()).error, "PROHIBITED_FIELD", `payload ${field}`);
  }
});

test("invalid JSON, content type, origin, and oversized body are rejected", async () => {
  assert.equal((await worker.fetch(request("{"), { MYNEST_DB: new FakeD1() })).status, 400);
  assert.equal((await worker.fetch(request(validEvent(), { headers: { "Content-Type": "text/plain" } }), { MYNEST_DB: new FakeD1() })).status, 415);
  const badOrigin = request(validEvent(), { headers: { Origin: "https://example.com" } });
  assert.equal((await worker.fetch(badOrigin, { MYNEST_DB: new FakeD1() })).status, 403);
  const tooLarge = request(JSON.stringify({ padding: "x".repeat(5000) }));
  assert.equal((await worker.fetch(tooLarge, { MYNEST_DB: new FakeD1() })).status, 413);
});

test("recruitment validation accepts structured screen, consent, and Day 0 payloads", () => {
  assert.equal(validateRecruitment(validRecruitment("screen")).ok, true);
  assert.equal(validateRecruitment(validRecruitment("consent")).ok, true);
  assert.equal(validateRecruitment(validRecruitment("day0")).ok, true);
});

test("pilot progress accepts a bounded recruitment pilot ID", async () => {
  const linked = validEvent({ pilot_id: "P-E5F6", recruitment_household_id: "H-A1B2", recruitment_child_id: "C-C3D4" });
  assert.equal((await worker.fetch(request(linked), { MYNEST_DB: new FakeD1() })).status, 200);
  const invalid = validEvent({ pilot_id: "not-a-pilot", recruitment_household_id: "H-A1B2", recruitment_child_id: "C-C3D4" });
  const response = await worker.fetch(request(invalid), { MYNEST_DB: new FakeD1() });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "INVALID_PILOT_ID");
  const incomplete = await worker.fetch(request(validEvent({ pilot_id: "P-E5F6" })), { MYNEST_DB: new FakeD1() });
  assert.equal(incomplete.status, 400);
  assert.equal((await incomplete.json()).error, "INVALID_RECRUITMENT_HOUSEHOLD_ID");
});

test("voucher eligibility requires all four post-Day-0 checkpoints", async () => {
  const event = { event_type: "checkpoint_saved", pilot_id: "P-E5F6", recruitment_household_id: "H-A1B2", recruitment_child_id: "C-C3D4" };
  const database = (count) => ({
    prepare(sql) {
      return {
        bind: () => ({
          first: async () => sql.includes("COUNT(DISTINCT checkpoint_day)") ? { count } : { pilot_id: "P-E5F6" }
        })
      };
    }
  });
  assert.equal(await markPilotCompleteIfReady({ MYNEST_DB: database(3) }, event), false);
  assert.equal(await markPilotCompleteIfReady({ MYNEST_DB: database(4) }, event), true);
  assert.equal(await markPilotCompleteIfReady({ MYNEST_DB: database(4) }, { ...event, pilot_id: null }), false);
});

test("recruitment eligibility follows the frozen decision order", () => {
  const base = validRecruitment("screen").payload;
  assert.equal(eligibilityForScreen(base), "ELIGIBLE");
  assert.equal(eligibilityForScreen({ ...base, age_band: "under-2.5" }), "NOT_CURRENT_COHORT");
  assert.equal(eligibilityForScreen({ ...base, age_band: "over-6" }), "OUTSIDE_V0.1");
  assert.equal(eligibilityForScreen({ ...base, safe_space: false }), "HOLD");
  assert.equal(eligibilityForScreen({ ...base, transition_next_14_days: false }), "WAITLIST");
  assert.equal(eligibilityForScreen({ ...base, follow_up_available: false }), "CONTENT_ONLY");
  assert.equal(eligibilityForScreen({ ...base, medical_scope_request: true }), "OUT_OF_SCOPE");
});

test("recruitment rejects free text, unknown fields, bad consent, and invalid counts", () => {
  const withNotes = validRecruitment("screen");
  withNotes.payload.notes = "synthetic";
  assert.equal(validateRecruitment(withNotes).code, "PROHIBITED_FIELD");

  const unknown = validRecruitment("screen");
  unknown.payload.surprise = true;
  assert.equal(validateRecruitment(unknown).code, "UNKNOWN_FIELD");

  assert.equal(validateRecruitment(validRecruitment("consent", { pilot_consent: false })).code, "CONSENT_REQUIRED");
  assert.equal(validateRecruitment(validRecruitment("day0", { own_room_nights_last_7: 8 })).code, "INVALID_BASELINE_COUNT");
  assert.equal(validateRecruitment(validRecruitment("screen", { campaign_key: "bad campaign!" })).code, "INVALID_ACQUISITION");
  assert.equal(validateRecruitment(validRecruitment("screen", { acquisition_source: "profile-scrape" })).code, "INVALID_ACQUISITION");
});

test("Magic Room validation accepts all five structured checkpoints", () => {
  for (const action of ["baseline", "first_exposure", "day3", "day7", "day14"]) {
    assert.equal(validateMagicRoomEvent(validMagicRoom(action)).ok, true, action);
  }
});

test("Magic Room validation rejects missing consent, identity fields, free text, and bad enums", () => {
  assert.equal(validateMagicRoomEvent({ ...validMagicRoom(), pilot_consent: false }).code, "CONSENT_REQUIRED");
  assert.equal(validateMagicRoomEvent(validMagicRoom("baseline", { child_name: "Synthetic" })).code, "PROHIBITED_FIELD");
  assert.equal(validateMagicRoomEvent(validMagicRoom("day7", { note: "Synthetic" })).code, "PROHIBITED_FIELD");
  assert.equal(validateMagicRoomEvent(validMagicRoom("day14", { novelty_decay: "viral" })).code, "INVALID_DAY14");
  assert.equal(validateMagicRoomEvent(validMagicRoom("baseline", { world: "dinosaur" })).code, "INVALID_WORLD");
});

test("Magic Room endpoint stores a consented structured observation", async () => {
  const db = new FakeD1();
  const response = await worker.fetch(magicRequest(validMagicRoom("first_exposure")), { MYNEST_DB: db });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.checkpoint, "first_exposure");
  assert.match(body.event_id, /^[0-9a-f-]{36}$/);
});

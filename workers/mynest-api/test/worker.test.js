import test from "node:test";
import assert from "node:assert/strict";
import worker, { PROHIBITED_FIELDS, resetRateLimitForTests } from "../src/index.js";

const ORIGIN = "https://www.springofzen.com";
const ENDPOINT = `${ORIGIN}/api/mynest/pilot-events`;

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

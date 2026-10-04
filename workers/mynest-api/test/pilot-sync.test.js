import test from "node:test";
import assert from "node:assert/strict";
import "../../../mynest/pilot-sync.js";

const sync = globalThis.MyNestPilotSync;

function eventFixture() {
  return {
    event_id: "177b8738-a546-4c31-9ca8-5a4fe7c2dd18",
    household_id: "NEST-A1B2",
    event_type: "theme_chosen",
    step: 2,
    client_created_at: "2026-10-04T12:00:00.000Z",
    payload: {
      age_band: "4",
      problem_code: "F03",
      theme: "space",
      own_room_nights: 0,
      verified_transition: false,
      notes: "must not leave browser",
      child_selected_text: "must not leave browser"
    },
    notes: "must not leave browser"
  };
}

test("normalization upgrades legacy event_id and strips free text", () => {
  const normalized = sync.normalizeEvent(eventFixture());
  assert.equal(normalized.client_event_id, eventFixture().event_id);
  assert.equal("event_id" in normalized, false);
  assert.equal("notes" in normalized, false);
  assert.equal("notes" in normalized.payload, false);
  assert.equal("child_selected_text" in normalized.payload, false);
});

test("queue delivery semantics distinguish success, permanent rejection, and retry", () => {
  assert.equal(sync.deliveryAction(200), "remove");
  assert.equal(sync.deliveryAction(409), "discard");
  assert.equal(sync.deliveryAction(422), "discard");
  assert.equal(sync.deliveryAction(408), "retry");
  assert.equal(sync.deliveryAction(429), "retry");
  assert.equal(sync.deliveryAction(500), "retry");
});

test("send removes success, discards invalid, and retains network failures", async () => {
  let transmitted;
  const success = await sync.send(eventFixture(), { fetchImpl: async (_url, init) => { transmitted = JSON.parse(init.body); return { status: 200 }; } });
  assert.equal(success.action, "remove");
  assert.equal("notes" in transmitted.payload, false);

  const invalid = await sync.send(eventFixture(), { fetchImpl: async () => ({ status: 400 }) });
  assert.equal(invalid.action, "discard");

  const failed = await sync.send(eventFixture(), { fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal(failed.action, "retry");
});

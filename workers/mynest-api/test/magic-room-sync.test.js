import test from "node:test";
import assert from "node:assert/strict";
import "../../../mynest/magic-room/magic-room-sync.js";

const sync = globalThis.MyNestMagicRoomSync;

function fixture() {
  return {
    client_event_id: "9cf2ea61-57d3-4cd6-a023-b9b16cb4bdc8",
    action: "first_exposure",
    magic_pilot_id: "MR-A1B2C3",
    pilot_consent: true,
    payload: {
      world: "ocean",
      character: "milo",
      entered_without_prompt: true,
      approached_projection: true,
      pointed_to_character: true,
      spoke_to_character: false,
      requested_repeat: true,
      asked_question: true,
      requested_other_world: false,
      stayed_after_parent_moved_away: true,
      first_exposure_duration: "15_30",
      note: "must not leave the browser",
      child_name: "must not leave the browser"
    }
  };
}

test("Magic Room sync strips all non-allowlisted fields", () => {
  const normalized = sync.normalize(fixture());
  assert.equal(normalized.consent_version, "MYNEST_MAGIC_ROOM_CONSENT_v0.1");
  assert.equal(normalized.payload.world, "ocean");
  assert.equal("note" in normalized.payload, false);
  assert.equal("child_name" in normalized.payload, false);
});

test("Magic Room sync rejects unknown actions", () => {
  assert.throws(() => sync.normalize({ ...fixture(), action: "ugc_upload" }), /Unsupported observation checkpoint/);
});

test("Magic Room sync reports success and offline retention", async () => {
  let transmitted;
  const success = await sync.send(fixture(), { fetchImpl: async (_url, init) => { transmitted = JSON.parse(init.body); return { ok: true, status: 200, json: async () => ({ ok: true }) }; } });
  assert.equal(success.ok, true);
  assert.equal("note" in transmitted.payload, false);
  const offline = await sync.send(fixture(), { fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal(offline.ok, false);
  assert.match(offline.body.message, /remains on this device/i);
});

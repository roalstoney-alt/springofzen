(() => {
  "use strict";

  const ENDPOINT = "/api/mynest/magic-room-events";
  const ACTIONS = new Set(["baseline", "first_exposure", "day3", "day7", "day14"]);
  const COMMON = ["world", "character"];
  const FIELDS = {
    baseline: ["age_band", "baseline_voluntary_entry", "baseline_time_in_room", "baseline_child_requests_room", "baseline_shows_room", "baseline_bedtime_acceptance"],
    first_exposure: ["entered_without_prompt", "approached_projection", "pointed_to_character", "spoke_to_character", "requested_repeat", "asked_question", "requested_other_world", "stayed_after_parent_moved_away", "first_exposure_duration"],
    day3: ["day_3_return", "requested_world", "requested_character", "asked_for_next_event", "day_3_session_duration"],
    day7: ["voluntary_entries", "world_requests", "character_requests", "average_session_duration", "asked_for_next_event", "showed_to_other_person", "preferred_world", "preferred_character"],
    day14: ["return_desire", "novelty_decay", "day_14_return", "self_initiated_room_use", "preferred_world", "preferred_character", "bedtime_acceptance_change", "own_room_attempt_change"]
  };

  function normalize(input) {
    if (!ACTIONS.has(input.action)) throw new Error("Unsupported observation checkpoint.");
    const payload = {};
    for (const field of [...COMMON, ...FIELDS[input.action]]) {
      if (Object.prototype.hasOwnProperty.call(input.payload || {}, field)) payload[field] = input.payload[field];
    }
    return {
      client_event_id: input.client_event_id,
      action: input.action,
      magic_pilot_id: input.magic_pilot_id,
      pilot_consent: input.pilot_consent === true,
      consent_version: "MYNEST_MAGIC_ROOM_CONSENT_v0.1",
      payload
    };
  }

  async function send(input, options = {}) {
    const fetchImpl = options.fetchImpl || fetch;
    const endpoint = options.endpoint || ENDPOINT;
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalize(input))
      });
      const body = await response.json().catch(() => ({}));
      return { ok: response.ok, status: response.status, body };
    } catch {
      return { ok: false, status: 0, body: { message: "Offline. The observation remains on this device." } };
    }
  }

  const root = typeof window === "undefined" ? globalThis : window;
  root.MyNestMagicRoomSync = Object.freeze({ normalize, send });
})();

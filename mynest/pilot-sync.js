(() => {
  "use strict";

  const PAYLOAD_FIELDS = [
    "age_band",
    "problem_code",
    "theme",
    "child_choice",
    "room_entry_willingness",
    "own_room_result",
    "own_room_nights",
    "verified_transition",
    "readiness_confirmed",
    "checkpoint_day",
    "checkpoint_willingness",
    "checkpoint_result"
  ];

  function normalizeEvent(event) {
    const cleanPayload = {};
    PAYLOAD_FIELDS.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(event.payload || {}, field)) cleanPayload[field] = event.payload[field];
    });
    return {
      client_event_id: event.client_event_id || event.event_id,
      household_id: event.household_id,
      event_type: event.event_type,
      step: event.step,
      client_created_at: event.client_created_at,
      payload: cleanPayload
    };
  }

  function deliveryAction(status) {
    if (status >= 200 && status < 300) return "remove";
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) return "discard";
    return "retry";
  }

  async function send(event, options = {}) {
    const endpoint = options.endpoint || "/api/mynest/pilot-events";
    const fetchImpl = options.fetchImpl || fetch;
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeEvent(event))
      });
      return { action: deliveryAction(response.status), status: response.status };
    } catch {
      return { action: "retry", status: 0 };
    }
  }

  const root = typeof window === "undefined" ? globalThis : window;
  root.MyNestPilotSync = Object.freeze({ normalizeEvent, deliveryAction, send });
})();

(() => {
  "use strict";

  const STORE_KEY = "mynest_recruitment_v01";
  const ENDPOINT = "/api/mynest/pilot-recruitment";
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const screenSection = document.querySelector("[data-screen-section]");
  const consentSection = document.querySelector("[data-consent-section]");
  const day0Section = document.querySelector("[data-day0-section]");
  const resultSection = document.querySelector("[data-result-section]");
  const ineligibleSection = document.querySelector("[data-ineligible-section]");

  function randomCode() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => ALPHABET[value % ALPHABET.length]).join("");
  }

  function initialState() {
    return {
      household_id: `H-${randomCode()}`,
      child_id: `C-${randomCode()}`,
      pilot_id: `P-${randomCode()}`,
      status: "DISCOVERED",
      group: null
    };
  }

  function readState() {
    try {
      return { ...initialState(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
    } catch {
      return initialState();
    }
  }

  let state = readState();
  const saveState = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));

  function eventEnvelope(action, payload) {
    return {
      client_event_id: crypto.randomUUID(),
      action,
      household_id: state.household_id,
      child_id: state.child_id,
      pilot_id: state.pilot_id,
      payload
    };
  }

  async function send(action, payload) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventEnvelope(action, payload))
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.message || "The pilot service is temporarily unavailable.");
      error.code = body.error || "REQUEST_FAILED";
      throw error;
    }
    return body;
  }

  function formObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function setBusy(form, busy) {
    const button = form.querySelector("button[type='submit']");
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
  }

  function setStatus(name, message, success = false) {
    const node = document.querySelector(`[data-${name}-status]`);
    node.textContent = message;
    node.classList.toggle("success", success);
  }

  const ineligibleMessages = {
    "NOT_CURRENT_COHORT": ["Not in the current age cohort", "This first cohort begins at age 2.5. You can still use the public room-transition guide and return for a later cohort."],
    "OUTSIDE_V0.1": ["Outside the v0.1 age cohort", "This first protocol ends at age 6. The public guide remains available, but this cohort will not collect your data."],
    "HOLD": ["Pilot on hold", "A safe, usable sleeping space is required before a room-transition pilot. Resolve the physical space first."],
    "WAITLIST": ["Added to the waitlist", "The timing or current cohort capacity does not fit today. No intervention should begin until the household is ready."],
    "CONTENT_ONLY": ["Public guidance is the right fit", "The pilot requires five short check-ins. You can use the public guide without joining the intervention cohort."],
    "OUT_OF_SCOPE": ["This request is outside the room-intervention pilot", "MyNest is not medical, developmental, psychiatric, or sleep treatment. Please use an appropriate qualified professional for that concern."]
  };

  function showIneligible(status) {
    const [title, copy] = ineligibleMessages[status] || ["This cohort is not the right next step", "Use the public guide without entering the intervention pilot."];
    document.querySelector("[data-ineligible-title]").textContent = title;
    document.querySelector("[data-ineligible-copy]").textContent = copy;
    screenSection.hidden = true;
    consentSection.hidden = true;
    day0Section.hidden = true;
    resultSection.hidden = true;
    ineligibleSection.hidden = false;
    ineligibleSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showConsent() {
    screenSection.hidden = true;
    ineligibleSection.hidden = true;
    consentSection.hidden = false;
    consentSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showDay0() {
    screenSection.hidden = true;
    consentSection.hidden = true;
    ineligibleSection.hidden = true;
    day0Section.hidden = false;
    day0Section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showResult() {
    const groupCopy = {
      A: "Group A begins with diagnosis and parent framing only. Child Choice is intentionally skipped during the first observation period.",
      B: "Group B continues with diagnosis and the structured Child Choice experience. No purchased product is required.",
      C: "Group C continues with diagnosis, Child Choice, and one justified primary room intervention."
    };
    document.querySelector("[data-result-copy]").textContent = groupCopy[state.group] || "Your structured Day 0 baseline is saved.";
    document.querySelector("[data-pilot-id]").textContent = state.pilot_id;
    document.querySelector("[data-group]").textContent = state.group ? `GROUP ${state.group}` : "WAITLIST";
    const link = document.querySelector("[data-continue-link]");
    link.href = `../?pilot=${encodeURIComponent(state.pilot_id)}&group=${encodeURIComponent(state.group || "")}`;
    link.textContent = state.group === "A" ? "Continue to diagnosis →" : "Continue to MyNest →";
    screenSection.hidden = true;
    consentSection.hidden = true;
    day0Section.hidden = true;
    ineligibleSection.hidden = true;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelector("[data-screen-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = formObject(form);
    const payload = {
      age_band: values.age_band,
      sleep_location: values.sleep_location,
      transition_goal: values.transition_goal,
      safe_space: values.safe_space === "true",
      transition_next_14_days: values.transition_next_14_days === "true",
      follow_up_available: values.follow_up_available === "true",
      medical_scope_request: values.medical_scope_request === "true"
    };
    setBusy(form, true);
    setStatus("screen", "Checking eligibility…");
    try {
      const result = await send("screen", payload);
      state.status = result.status;
      state.group = result.group;
      saveState();
      if (result.status === "ELIGIBLE") showConsent();
      else showIneligible(result.status);
    } catch (error) {
      if (error.code === "ANONYMOUS_ID_COLLISION") {
        state = initialState();
        saveState();
        setStatus("screen", "New anonymous IDs were created safely. Submit once more to continue.");
        return;
      }
      setStatus("screen", `${error.message} Your answers remain on this page; please retry.`);
    } finally {
      setBusy(form, false);
    }
  });

  document.querySelector("[data-consent-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setBusy(form, true);
    setStatus("consent", "Recording consent…");
    try {
      const result = await send("consent", { pilot_consent: true, consent_version: "MYNEST_CONSENT_v0.1" });
      state.status = result.status;
      state.group = result.group;
      saveState();
      if (result.status === "CONSENTED" || result.status === "PILOT_ACTIVE") showDay0();
      else showIneligible(result.status);
    } catch (error) {
      setStatus("consent", error.message);
    } finally {
      setBusy(form, false);
    }
  });

  document.querySelector("[data-day0-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = formObject(form);
    const payload = {
      own_room_nights_last_7: Number(values.own_room_nights_last_7),
      parent_room_nights_last_7: Number(values.parent_room_nights_last_7),
      parent_present_until_sleep: values.parent_present_until_sleep,
      night_returns_to_parent: values.night_returns_to_parent,
      room_entry_resistance: values.room_entry_resistance,
      current_night_light: values.current_night_light,
      current_sound: values.current_sound,
      previous_transition_attempt: values.previous_transition_attempt
    };
    setBusy(form, true);
    setStatus("day0", "Starting the pilot…");
    try {
      const result = await send("day0", payload);
      state.status = result.status;
      state.group = result.group;
      saveState();
      showResult();
    } catch (error) {
      setStatus("day0", error.message);
    } finally {
      setBusy(form, false);
    }
  });

  if (state.status === "ELIGIBLE") showConsent();
  else if (state.status === "CONSENTED" || state.status === "DAY_0_COMPLETE") showDay0();
  else if (state.status === "PILOT_ACTIVE") showResult();
  else if (ineligibleMessages[state.status]) showIneligible(state.status);
})();

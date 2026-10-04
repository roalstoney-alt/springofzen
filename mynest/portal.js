(() => {
  "use strict";

  const STORE_KEY = "mynest_room_transition_v01";
  const CHECKPOINTS = [1, 3, 7, 14];
  const ALLOWED_EVENT_TYPES = new Set(["diagnosis_saved", "theme_chosen", "plan_prepared", "first_night_saved", "checkpoint_saved"]);

  const problemPlans = {
    F01: {
      intro: "Make the room easy to understand in low light, then let your child control one safe source of glow.",
      cards: [
        ["1", "Meet the shadows", "Visit before bedtime. Name what each shadow comes from, then keep the room arrangement unchanged tonight."],
        ["2", "Choose the glow", "Let your child choose one dim, warm night light and where it will stay. Keep cords and lamps safely out of reach."],
        ["3", "Do one brave check", "Together, check the room once. After that, use the same short reassurance instead of starting a new search."],
      ],
      script: "We checked the room together. Your light is where you chose it, and I will come back after our song. You are safe, and I am nearby."
    },
    F02: {
      intro: "Replace an open-ended goodbye with a small, dependable connection ritual and a return they can predict.",
      cards: [
        ["1", "Leave a connection", "Choose one comfort item that represents closeness—a scarf, photo card, or familiar soft toy."],
        ["2", "Make time visible", "Promise one realistic check-back: after one song, or when a small timer changes. Always keep that promise."],
        ["3", "Use the same goodbye", "Keep it warm and short: one hug, one phrase, one exit. Repetition makes separation easier to predict."],
      ],
      script: "Our hug stays with you. I will check back after one song. Your job is to rest here; my job is to come back when I said I would."
    },
    F03: {
      intro: "Give your child visible authorship. A few real choices can turn an assigned room into their place.",
      cards: [
        ["1", "Place their choice", "Put their chosen item where they can see or reach it safely from bed."],
        ["2", "Name the room", "Let them give the room or tonight’s mission a name. Use it during the bedtime routine."],
        ["3", "Give one small job", "Ask them to tuck in a toy, switch on the safe light, or choose the final book."],
      ],
      script: "You helped make this room yours. You chose the world, the special thing, and tonight’s last job. I can’t wait to hear what your room felt like in the morning."
    },
    F04: {
      intro: "Remove one source of physical friction before asking for a bigger behavior change.",
      cards: [
        ["1", "Do a room scan", "At child height, notice light, temperature, sounds, scratchy textures, clutter, and anything that moves unexpectedly."],
        ["2", "Fix one thing", "Choose the most likely irritation and change only that tonight, so you can learn whether it helped."],
        ["3", "Keep the rest steady", "Use familiar bedding, comfort items, and routine. Avoid a complete room makeover on the first night."],
      ],
      script: "We changed the one thing that felt uncomfortable. Everything else is familiar. If something feels wrong, you can tell me when I check back."
    },
    F05: {
      intro: "A short sequence that repeats in the same order can carry the transition when motivation changes.",
      cards: [
        ["1", "Choose three steps", "Use a tiny sequence: wash, one book, one song. Keep the order and ending the same."],
        ["2", "Mark the ending", "Use one phrase that always means the routine is finished and resting begins."],
        ["3", "Plan one return", "Set one predictable check-back instead of renegotiating the whole bedtime after lights-out."],
      ],
      script: "We did our three bedtime steps. Now the routine is finished and your room can hold the quiet. I will check back when we agreed."
    },
    F06: {
      intro: "Treat tonight as observation. Lower the pressure, keep the room familiar, and learn what happens before changing more.",
      cards: [
        ["1", "Ask one small question", "Try: ‘What does your body want me to know about this room?’ Accept imaginative answers without correcting them."],
        ["2", "Choose the easiest step", "The goal can simply be entering the room, reading there, or lying down for two minutes."],
        ["3", "Write down the clue", "Notice when resistance begins and what reduces it. Patterns across several nights matter more than one answer."],
      ],
      script: "We are only learning tonight. You do not have to prove anything. We will try one small step in your room, and I will listen to what your body tells us."
    }
  };

  const themeNames = { space: "Space", forest: "Forest", ocean: "Ocean" };
  const resultLabels = { full: "all night", part: "part of the night", attempt: "room entry", none: "no attempt" };
  const willingnessLabels = { easy: "easy entry", support: "entry with support", no: "not willing yet" };

  const initialState = () => ({
    version: "0.1",
    householdId: `NEST-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    step: 1,
    maxStep: 1,
    startedAt: new Date().toISOString(),
    diagnosis: {},
    choice: {},
    ready: [],
    firstNight: {},
    checkpoints: {},
    pendingEvents: []
  });

  const safeParse = (value) => {
    try { return JSON.parse(value); } catch { return null; }
  };
  const readState = () => ({ ...initialState(), ...(safeParse(localStorage.getItem(STORE_KEY)) || {}) });
  let state = readState();
  const saveState = () => {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  };

  function backendConfig() {
    const config = window.MYNEST_BACKEND || {};
    const url = String(config.supabaseUrl || "").replace(/\/$/, "");
    const anonKey = String(config.supabaseAnonKey || "");
    return { url, anonKey, configured: /^https:\/\/.+\.supabase\.co$/.test(url) && anonKey.length > 40 };
  }

  function structuredSnapshot(extra = {}) {
    return {
      age_band: state.diagnosis?.age || null,
      problem_code: state.diagnosis?.problem || null,
      theme: state.choice?.theme || null,
      room_entry_willingness: state.firstNight?.willingness || null,
      own_room_result: state.firstNight?.result || null,
      own_room_nights: completedNights(),
      verified_transition: hasVerifiedTransition(),
      ...extra
    };
  }

  function syncStatus(message) {
    const node = document.querySelector("[data-sync-status]");
    if (node) node.textContent = message;
  }

  function createEventId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function queuePilotEvent(eventType, extra = {}) {
    if (state.diagnosis?.sharing !== "pilot" || !ALLOWED_EVENT_TYPES.has(eventType)) return;
    state.pendingEvents ||= [];
    state.pendingEvents.push({
      event_id: createEventId(),
      household_id: state.householdId,
      event_type: eventType,
      step: state.step,
      client_created_at: new Date().toISOString(),
      payload: structuredSnapshot(extra)
    });
    state.pendingEvents = state.pendingEvents.slice(-30);
    saveState();
    flushPilotEvents();
  }

  async function postPilotEvent(event) {
    const config = backendConfig();
    if (!config.configured) return false;
    try {
      const response = await fetch(`${config.url}/rest/v1/mynest_pilot_events?on_conflict=event_id`, {
        method: "POST",
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=minimal"
        },
        body: JSON.stringify(event)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  let flushing = false;
  async function flushPilotEvents() {
    if (flushing || state.diagnosis?.sharing !== "pilot") return;
    const config = backendConfig();
    if (!config.configured) {
      syncStatus("Anonymous pilot sharing selected · central connection pending");
      return;
    }
    flushing = true;
    syncStatus("Syncing anonymous pilot progress…");
    const pending = [...(state.pendingEvents || [])];
    for (const event of pending) {
      const sent = await postPilotEvent(event);
      if (!sent) {
        syncStatus("Saved on this device · secure sync will retry");
        flushing = false;
        return;
      }
      state.pendingEvents = (state.pendingEvents || []).filter((item) => item.event_id !== event.event_id);
      saveState();
    }
    syncStatus("Anonymous pilot progress securely synced");
    flushing = false;
  }

  const intro = document.querySelector("[data-intro]");
  const journey = document.querySelector("[data-journey]");
  const headerReset = document.querySelector(".site-header [data-reset]");

  function hydrateForm(form, values = {}) {
    if (!form) return;
    Object.entries(values).forEach(([name, value]) => {
      const controls = [...form.elements].filter((control) => control.name === name);
      controls.forEach((control) => {
        if (control.type === "radio" || control.type === "checkbox") {
          control.checked = Array.isArray(value) ? value.includes(control.value) : control.value === value;
        } else {
          control.value = value ?? "";
        }
      });
    });
  }

  function formObject(form) {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  function showError(name, text) {
    const node = document.querySelector(`[data-error="${name}"]`);
    if (node) node.textContent = text;
  }

  function openJourney() {
    intro.hidden = true;
    journey.hidden = false;
    headerReset.hidden = false;
    renderStep(state.step || 1, false);
  }

  function renderStep(step, scroll = true) {
    const targetStep = Math.max(1, Math.min(5, Number(step) || 1));
    state.step = targetStep;
    state.maxStep = Math.max(state.maxStep || 1, targetStep);
    saveState();

    document.querySelectorAll("[data-step]").forEach((panel) => {
      const active = Number(panel.dataset.step) === targetStep;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-step-nav]").forEach((button) => {
      const number = Number(button.dataset.stepNav);
      button.disabled = number > state.maxStep;
      button.classList.toggle("is-complete", number < targetStep && number <= state.maxStep);
      if (number === targetStep) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    if (targetStep === 3) renderPlan();
    if (targetStep === 5) renderFollowup();
    if (scroll) journey.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPlan() {
    const plan = problemPlans[state.diagnosis.problem] || problemPlans.F06;
    const theme = themeNames[state.choice.theme] || "Chosen room";
    document.querySelector("[data-theme-name]").textContent = theme;
    document.querySelector("[data-plan-badge]").textContent = theme;
    document.querySelector("[data-plan-intro]").textContent = plan.intro;
    document.querySelector("[data-plan-cards]").innerHTML = plan.cards.map(([number, title, copy]) => `
      <article class="plan-card"><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>
    `).join("");
    const tiny = String(state.choice.tinyChoice || "").trim();
    document.querySelector("[data-parent-script]").textContent = tiny ? `${plan.script} We made a place for ${tiny}, just like you chose.` : plan.script;
  }

  function completedNights() {
    const results = [state.firstNight?.result, ...CHECKPOINTS.map((day) => state.checkpoints?.[day]?.result)];
    return results.filter((value) => value === "full").length;
  }

  function hasVerifiedTransition() {
    return [7, 14].some((day) => state.checkpoints?.[day]?.result === "full") && completedNights() >= 2;
  }

  function checkpointStateText(entry) {
    if (!entry?.result) return "Not checked in";
    return `${resultLabels[entry.result]} · ${willingnessLabels[entry.willingness]}`;
  }

  function renderCheckpoints() {
    const list = document.querySelector("[data-checkpoint-list]");
    const template = document.getElementById("checkpointTemplate");
    list.innerHTML = "";
    CHECKPOINTS.forEach((day) => {
      const fragment = template.content.cloneNode(true);
      const article = fragment.querySelector(".checkpoint");
      const button = fragment.querySelector(".checkpoint-head");
      const form = fragment.querySelector("form");
      const entry = state.checkpoints?.[day] || {};
      fragment.querySelector(".checkpoint-day").textContent = `Day ${day}`;
      fragment.querySelector(".checkpoint-state").textContent = checkpointStateText(entry);
      article.classList.toggle("is-complete", Boolean(entry.result));
      hydrateForm(form, entry);

      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        form.hidden = open;
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        state.checkpoints ||= {};
        state.checkpoints[day] = { ...formObject(form), savedAt: new Date().toISOString() };
        saveState();
        queuePilotEvent("checkpoint_saved", {
          checkpoint_day: day,
          checkpoint_willingness: state.checkpoints[day].willingness,
          checkpoint_result: state.checkpoints[day].result
        });
        renderFollowup();
      });
      list.append(fragment);
    });
  }

  function renderFollowup() {
    const total = completedNights();
    const verified = hasVerifiedTransition();
    const theme = themeNames[state.choice.theme] || "room";
    document.querySelector("[data-success-count]").textContent = total;
    document.querySelector("[data-summary-strip]").innerHTML = `
      <span>${theme} theme</span>
      <span>Age ${state.diagnosis.age || "—"}</span>
      <span>First night: ${resultLabels[state.firstNight?.result] || "not logged"}</span>
      <span>${Object.keys(state.checkpoints || {}).length}/4 checkpoints</span>
    `;
    renderCheckpoints();

    const title = document.querySelector("[data-outcome-title]");
    const copy = document.querySelector("[data-outcome-copy]");
    const card = document.querySelector("[data-outcome-card]");
    card.classList.toggle("is-verified", verified);
    if (verified) {
      title.textContent = "A verified transition signal.";
      copy.textContent = "At least two own-room nights, including Day 7 or Day 14, are logged. Keep the ritual steady before changing it.";
    } else if (total > 0) {
      title.textContent = "An own-room success is on the board.";
      copy.textContent = "Celebrate quietly, then repeat what worked. Day 7 and Day 14 will show whether the shift is holding.";
    } else if (state.firstNight?.result === "part" || state.firstNight?.result === "attempt") {
      title.textContent = "The first attempt counts.";
      copy.textContent = "Room entry and part-night sleep are meaningful leading signals. Keep the next step small and predictable.";
    } else {
      title.textContent = "The experiment is underway.";
      copy.textContent = "Keep the room predictable and celebrate each willing entry. Pausing one night does not reset the process.";
    }
  }

  function progressSummary() {
    const lines = [
      `MyNest pilot ${state.householdId}`,
      `Age band: ${state.diagnosis.age || "not set"}`,
      `Theme: ${themeNames[state.choice.theme] || "not set"}`,
      `First night: ${resultLabels[state.firstNight?.result] || "not logged"} / ${willingnessLabels[state.firstNight?.willingness] || "entry not logged"}`,
      ...CHECKPOINTS.map((day) => `Day ${day}: ${checkpointStateText(state.checkpoints?.[day])}`),
      `Own-room nights logged: ${completedNights()}`,
      `Verified transition signal: ${hasVerifiedTransition() ? "yes" : "not yet"}`
    ];
    return lines.join("\n");
  }

  async function copySummary() {
    const status = document.querySelector("[data-copy-status]");
    try {
      await navigator.clipboard.writeText(progressSummary());
      status.textContent = "Progress summary copied—no child name or contact details included.";
    } catch {
      status.textContent = "Copy was blocked by this browser. Select your progress manually from the page.";
    }
  }

  function resetPilot() {
    const okay = window.confirm("Start a new room experiment? This removes the current plan and check-ins from this browser.");
    if (!okay) return;
    localStorage.removeItem(STORE_KEY);
    state = initialState();
    window.location.reload();
  }

  document.querySelector("[data-start]").addEventListener("click", () => {
    state.startedAt ||= new Date().toISOString();
    saveState();
    openJourney();
  });

  document.querySelectorAll("[data-step-nav]").forEach((button) => button.addEventListener("click", () => {
    if (!button.disabled) renderStep(Number(button.dataset.stepNav));
  }));
  document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => renderStep(Number(button.dataset.back))));
  document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", resetPilot));
  document.querySelector("[data-copy-summary]").addEventListener("click", copySummary);

  document.querySelector("[data-diagnosis-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      showError("diagnosis", "Choose an age, the closest bedtime barrier, and how progress should be saved.");
      return;
    }
    showError("diagnosis", "");
    state.diagnosis = formObject(event.currentTarget);
    queuePilotEvent("diagnosis_saved");
    renderStep(2);
  });

  document.querySelector("[data-theme-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      showError("theme", "Invite your child to choose one room world.");
      return;
    }
    showError("theme", "");
    state.choice = formObject(event.currentTarget);
    queuePilotEvent("theme_chosen");
    renderStep(3);
  });

  document.querySelector("[data-prepare-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const ready = new FormData(event.currentTarget).getAll("ready");
    if (ready.length < 3) {
      showError("prepare", "Confirm all three parts before the first night.");
      return;
    }
    showError("prepare", "");
    state.ready = ready;
    state.preparedAt = new Date().toISOString();
    queuePilotEvent("plan_prepared", { readiness_confirmed: true });
    renderStep(4);
  });

  document.querySelector("[data-first-night-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      showError("firstNight", "Add the room-entry and sleep result.");
      return;
    }
    showError("firstNight", "");
    state.firstNight = { ...formObject(event.currentTarget), savedAt: new Date().toISOString() };
    queuePilotEvent("first_night_saved");
    renderStep(5);
  });

  document.querySelector("[data-household-id]").textContent = state.householdId;
  hydrateForm(document.querySelector("[data-diagnosis-form]"), state.diagnosis);
  hydrateForm(document.querySelector("[data-theme-form]"), state.choice);
  hydrateForm(document.querySelector("[data-prepare-form]"), { ready: state.ready });
  hydrateForm(document.querySelector("[data-first-night-form]"), state.firstNight);

  if (state.diagnosis?.sharing === "pilot") flushPilotEvents();
  else syncStatus("Progress saved on this device");

  if (localStorage.getItem(STORE_KEY)) openJourney();
})();

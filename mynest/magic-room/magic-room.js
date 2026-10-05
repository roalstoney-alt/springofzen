(() => {
  "use strict";

  const STORE_KEY = "mynest_magic_room_v01";
  const worlds = window.MYNEST_WORLDS;
  const body = document.body;
  const stage = document.querySelector("[data-projection-stage]");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const allowedStates = new Set(worlds.ocean.state_order);
  let audioEngine = null;
  let shareTimer = null;

  function randomCode(length = 6) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
  }

  function initialState() {
    return {
      version: "0.1",
      magic_pilot_id: `MR-${randomCode()}`,
      world: "ocean",
      engine_state: "entry",
      calibration: { x: 100, y: 100, brightness: 82 },
      character_x: 50,
      observations: {}
    };
  }

  function readState() {
    try { return { ...initialState(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; }
    catch { return initialState(); }
  }

  let state = readState();
  function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  function setParticles() {
    const field = document.querySelector("[data-particles]");
    field.innerHTML = "";
    for (let index = 0; index < 24; index += 1) {
      const particle = document.createElement("i");
      particle.className = "particle";
      particle.style.left = `${(index * 37) % 101}%`;
      particle.style.setProperty("--size", `${6 + (index % 5) * 5}px`);
      particle.style.setProperty("--alpha", String(.14 + (index % 4) * .08));
      particle.style.setProperty("--duration", `${12 + (index % 7) * 2}s`);
      particle.style.setProperty("--delay", `${-(index % 11)}s`);
      field.append(particle);
    }
  }

  function currentWorld() { return worlds[state.world] || worlds.ocean; }

  function renderWorld() {
    const world = currentWorld();
    body.dataset.world = state.world;
    document.documentElement.style.setProperty("--world-0", world.palette[0]);
    document.documentElement.style.setProperty("--world-1", world.palette[1]);
    document.documentElement.style.setProperty("--world-2", world.palette[2]);
    document.documentElement.style.setProperty("--world-3", world.palette[3]);
    document.querySelector("[data-world-label]").textContent = `${world.label} · ${world.name}`;
    document.querySelector("[data-daily-event]").textContent = world.daily_events[0];
    document.querySelector("[data-return-trigger]").textContent = world.return_trigger;
    document.querySelector("[data-moment-name]").textContent = world.share_moment.name;
    document.querySelector("[data-moment-copy]").textContent = world.share_moment.prompt;
    document.querySelectorAll("[data-world-button]").forEach((button) => {
      const active = button.dataset.worldButton === state.world;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderEngineState();
    setParticles();
    saveState();
  }

  function renderEngineState() {
    const world = currentWorld();
    const [title, copy] = world.states[state.engine_state] || world.states.entry;
    body.dataset.state = state.engine_state;
    document.querySelector("[data-state-title]").textContent = title;
    document.querySelector("[data-state-copy]").textContent = copy;
    const phrase = document.querySelector("[data-bedtime-phrase]");
    phrase.hidden = !["wind_down", "sleep"].includes(state.engine_state);
    phrase.textContent = world.bedtime_phrase;
    document.querySelector("[data-awaken]").hidden = state.engine_state !== "entry";
    document.querySelector("[data-interaction-controls]").hidden = state.engine_state !== "interact";
    document.querySelectorAll("[data-state-button]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.stateButton === state.engine_state)));
    stage.style.setProperty("--character-x", `${state.character_x}%`);
    if (audioEngine) audioEngine.setMode(state.world, state.engine_state);
    saveState();
  }

  function setWorld(worldKey) {
    if (!worlds[worldKey]) return;
    state.world = worldKey;
    state.engine_state = "entry";
    state.character_x = 50;
    renderWorld();
  }

  function setEngineState(nextState) {
    if (!allowedStates.has(nextState)) return;
    state.engine_state = nextState;
    renderEngineState();
  }

  function createAudioEngine() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = .035;
    master.connect(context.destination);

    const low = context.createOscillator();
    const high = context.createOscillator();
    const lowGain = context.createGain();
    const highGain = context.createGain();
    const filter = context.createBiquadFilter();
    low.type = "sine";
    high.type = "sine";
    low.frequency.value = 82;
    high.frequency.value = 164;
    lowGain.gain.value = .55;
    highGain.gain.value = .12;
    filter.type = "lowpass";
    filter.frequency.value = 420;
    low.connect(lowGain).connect(filter);
    high.connect(highGain).connect(filter);
    filter.connect(master);
    low.start();
    high.start();

    return {
      context,
      master,
      low,
      high,
      setMode(worldKey, engineState) {
        const bases = { ocean: [82, 164], forest: [98, 196], space: [55, 110] }[worldKey];
        const calm = engineState === "sleep" ? .012 : engineState === "wind_down" ? .022 : .035;
        const now = context.currentTime;
        low.frequency.setTargetAtTime(bases[0], now, .8);
        high.frequency.setTargetAtTime(bases[1], now, .8);
        master.gain.setTargetAtTime(calm, now, 1.2);
      },
      stop() {
        const now = context.currentTime;
        master.gain.setTargetAtTime(0, now, .25);
        window.setTimeout(() => context.close(), 700);
      }
    };
  }

  async function toggleAudio() {
    const button = document.querySelector("[data-audio]");
    if (audioEngine) {
      audioEngine.stop();
      audioEngine = null;
      button.textContent = "Sound off";
      button.setAttribute("aria-pressed", "false");
      return;
    }
    audioEngine = createAudioEngine();
    if (!audioEngine) return;
    await audioEngine.context.resume();
    audioEngine.setMode(state.world, state.engine_state);
    button.textContent = "Sound on";
    button.setAttribute("aria-pressed", "true");
  }

  function applyCalibration() {
    const calibration = state.calibration || initialState().calibration;
    document.documentElement.style.setProperty("--fit-x", calibration.x / 100);
    document.documentElement.style.setProperty("--fit-y", calibration.y / 100);
    document.documentElement.style.setProperty("--brightness", calibration.brightness / 100);
    document.querySelectorAll("[data-calibration]").forEach((input) => { input.value = calibration[input.dataset.calibration]; });
  }

  function runShareMoment() {
    if (shareTimer) return;
    const countdown = document.querySelector("[data-share-countdown]");
    const number = countdown.querySelector("strong");
    let remaining = currentWorld().share_moment.duration_seconds;
    countdown.hidden = false;
    number.textContent = String(remaining);
    body.classList.add("is-share-moment");
    shareTimer = window.setInterval(() => {
      remaining -= 1;
      number.textContent = String(Math.max(remaining, 0));
      if (remaining <= 0) {
        window.clearInterval(shareTimer);
        shareTimer = null;
        countdown.hidden = true;
        body.classList.remove("is-share-moment");
        renderEngineState();
      }
    }, 1000);
  }

  function formPayload(form) {
    const payload = {};
    for (const element of form.elements) {
      if (!element.name) continue;
      if (element.type === "checkbox") payload[element.name] = element.checked;
      else if (element.type === "number") payload[element.name] = Number(element.value);
      else if (element.value === "true" || element.value === "false") payload[element.name] = element.value === "true";
      else payload[element.name] = element.value;
    }
    payload.world = state.world;
    payload.character = currentWorld().lead.toLowerCase().replace(/\s+/g, "_");
    return payload;
  }

  function hydrateObservationForms() {
    for (const [action, values] of Object.entries(state.observations || {})) {
      const form = document.querySelector(`[data-observation-form="${action}"]`);
      if (!form) continue;
      for (const [name, value] of Object.entries(values)) {
        const element = form.elements.namedItem(name);
        if (!element) continue;
        if (element.type === "checkbox") element.checked = Boolean(value);
        else element.value = String(value);
      }
    }
  }

  function setObserverStatus(message, error = false) {
    const node = document.querySelector("[data-observer-status]");
    node.textContent = message;
    node.style.color = error ? "#ffad99" : "var(--world-3)";
  }

  async function saveObservation(action, form) {
    const payload = formPayload(form);
    state.observations[action] = payload;
    saveState();
    const consent = document.querySelector("[data-pilot-consent]").checked;
    if (!consent) {
      setObserverStatus(`${action.replace("_", " ")} saved on this device. Nothing was sent.`);
      return;
    }
    const result = await window.MyNestMagicRoomSync.send({
      client_event_id: crypto.randomUUID(),
      action,
      magic_pilot_id: state.magic_pilot_id,
      pilot_consent: true,
      payload
    });
    if (result.ok) setObserverStatus(`${action.replace("_", " ")} saved and anonymously synced.`);
    else setObserverStatus(result.body?.message || "Unable to sync. The observation remains on this device.", true);
  }

  function showObservationTab(action) {
    document.querySelectorAll("[data-observation-form]").forEach((form) => { form.hidden = form.dataset.observationForm !== action; });
    document.querySelectorAll("[data-observation-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.observationTab === action)));
  }

  function populateCharacters() {
    const names = ["none", ...new Set(Object.values(worlds).flatMap((world) => [world.lead, ...world.support]).map((name) => name.toLowerCase().replace(/\s+/g, "_")))];
    document.querySelectorAll("[data-character-select]").forEach((select) => {
      select.innerHTML = names.map((name) => `<option value="${name}">${name === "none" ? "No preference" : name.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}</option>`).join("");
    });
  }

  document.querySelectorAll("[data-world-button]").forEach((button) => button.addEventListener("click", () => setWorld(button.dataset.worldButton)));
  document.querySelectorAll("[data-state-button]").forEach((button) => button.addEventListener("click", () => setEngineState(button.dataset.stateButton)));
  document.querySelector("[data-awaken]").addEventListener("click", () => setEngineState("awaken"));
  document.querySelector("[data-audio]").addEventListener("click", toggleAudio);
  document.querySelector("[data-fullscreen]").addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  });
  document.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => {
    state.character_x = Math.max(22, Math.min(78, state.character_x + (button.dataset.move === "left" ? -12 : 12)));
    renderEngineState();
  }));
  document.querySelectorAll("[data-calibration]").forEach((input) => input.addEventListener("input", () => {
    state.calibration[input.dataset.calibration] = Number(input.value);
    applyCalibration();
    saveState();
  }));
  document.querySelector("[data-calibration-toggle]").addEventListener("click", (event) => {
    const grid = document.querySelector("[data-calibration-grid]");
    grid.hidden = !grid.hidden;
    event.currentTarget.textContent = grid.hidden ? "Show grid" : "Hide grid";
  });
  document.querySelector("[data-share-moment]").addEventListener("click", runShareMoment);
  document.querySelector("[data-observer-open]").addEventListener("click", () => { document.querySelector("[data-observer-panel]").hidden = false; });
  document.querySelector("[data-observer-close]").addEventListener("click", () => { document.querySelector("[data-observer-panel]").hidden = true; });
  document.querySelectorAll("[data-observation-tab]").forEach((button) => button.addEventListener("click", () => showObservationTab(button.dataset.observationTab)));
  document.querySelectorAll("[data-observation-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    await saveObservation(form.dataset.observationForm, form);
    button.disabled = false;
  }));
  document.querySelector("[data-export]").addEventListener("click", async () => {
    const exportData = { project: "MYNEST_MAGIC_ROOM_PILOT_v0.1", magic_pilot_id: state.magic_pilot_id, observations: state.observations };
    try { await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)); setObserverStatus("Anonymous observation JSON copied."); }
    catch { setObserverStatus("Clipboard access was blocked. Use your browser's local storage export instead.", true); }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !document.fullscreenElement) document.querySelector("[data-observer-panel]").hidden = true;
  });

  populateCharacters();
  hydrateObservationForms();
  document.querySelector("[data-magic-pilot-id]").textContent = state.magic_pilot_id;
  applyCalibration();
  renderWorld();
})();

(() => {
  "use strict";

  const STORE_KEY = "mynest_magic_room_v01";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const body = document.body;
  const stage = document.querySelector("[data-room-stage]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qaEvents = [];
  const wakeTimers = [];
  let audioEngine = null;
  let wakeStarted = false;
  let restTimer = null;
  let feedbackTimer = null;
  let shellsFound = new Set();

  window.MYNEST_LOCAL_QA_EVENTS = qaEvents;

  function logLocal(type) {
    qaEvents.push(Object.freeze({ type, at: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent("mynest:local-qa", { detail: { type } }));
  }

  function randomCode(length = 6) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
  }

  function initialState() {
    return { version: "0.2", magic_pilot_id: `MR-${randomCode()}`, world: "ocean", observations: {} };
  }

  function readState() {
    try { return { ...initialState(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; }
    catch { return initialState(); }
  }

  let state = readState();
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { /* Local persistence is optional; the experience remains usable. */ }
  }

  function queueWake(delay, callback) {
    wakeTimers.push(window.setTimeout(callback, delay));
  }

  function clearWakeTimers() {
    while (wakeTimers.length) window.clearTimeout(wakeTimers.pop());
  }

  function wakeRoom(immediate = false) {
    if (wakeStarted && !immediate) return;
    clearWakeTimers();
    wakeStarted = true;
    const times = reducedMotion ? [0, 600, 1300, 2100, 2800] : immediate ? [0, 600, 1500, 2600, 5200] : [0, 1500, 3200, 5000, 8900];
    queueWake(times[0], () => { body.classList.add("wake-ripple"); logLocal("OCEAN_WOKE"); });
    queueWake(times[1], () => body.classList.add("wake-water"));
    queueWake(times[2], () => body.classList.add("wake-life"));
    queueWake(times[3], () => { body.classList.add("milo-entered"); logLocal("MILO_SEEN"); });
    queueWake(times[4], () => {
      body.classList.add("ocean-ready");
      document.querySelector("[data-touch-hint]").textContent = "Touch the bed, lamp, shelf, or Milo.";
    });
  }

  function pulseTone(frequency = 118, duration = 1.15) {
    if (!audioEngine) return;
    const { context, master } = audioEngine;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .74, context.currentTime + duration);
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(.09, context.currentTime + .16);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  function createAudioEngine() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = .16;
    master.connect(context.destination);
    const low = context.createOscillator();
    const high = context.createOscillator();
    const lowGain = context.createGain();
    const highGain = context.createGain();
    const filter = context.createBiquadFilter();
    low.type = "sine"; high.type = "sine";
    low.frequency.value = 72; high.frequency.value = 145;
    lowGain.gain.value = .12; highGain.gain.value = .025;
    filter.type = "lowpass"; filter.frequency.value = 360;
    low.connect(lowGain).connect(filter); high.connect(highGain).connect(filter); filter.connect(master);
    low.start(); high.start();
    return { context, master, low, high, setRest(resting) {
      const now = context.currentTime;
      low.frequency.setTargetAtTime(resting ? 55 : 72, now, 1.3);
      high.frequency.setTargetAtTime(resting ? 110 : 145, now, 1.3);
      master.gain.setTargetAtTime(resting ? .08 : .16, now, 1.5);
    }, stop() {
      master.gain.setTargetAtTime(.001, context.currentTime, .25);
      window.setTimeout(() => context.close(), 700);
    } };
  }

  async function toggleAudio() {
    const button = document.querySelector("[data-audio]");
    if (audioEngine) {
      audioEngine.stop(); audioEngine = null;
      button.querySelector("b").textContent = "Sound off";
      button.setAttribute("aria-pressed", "false");
      return;
    }
    audioEngine = createAudioEngine();
    if (!audioEngine) return;
    await audioEngine.context.resume();
    audioEngine.setRest(body.dataset.mode === "rest");
    button.querySelector("b").textContent = "Sound on";
    button.setAttribute("aria-pressed", "true");
    pulseTone(132, .8);
  }

  function clearResponseClasses() {
    body.classList.remove("bed-response", "lamp-response", "shelf-response", "milo-response");
  }

  function triggerResponse(type) {
    if (!body.classList.contains("ocean-ready")) wakeRoom(true);
    clearResponseClasses();
    window.clearTimeout(feedbackTimer);
    body.classList.add(`${type}-response`);
    const eventNames = { bed: "BED_CLICKED", lamp: "LAMP_CLICKED", shelf: "SHELF_CLICKED", milo: "MILO_CLICKED" };
    logLocal(eventNames[type]);
    if (type === "milo") pulseTone(126, 1.25);
    if (type === "lamp") pulseTone(220, .7);
    feedbackTimer = window.setTimeout(clearResponseClasses, type === "shelf" ? 7000 : 5600);
  }

  function setMode(mode) {
    if (!["explore", "story", "rest"].includes(mode)) return;
    body.dataset.mode = mode;
    body.classList.remove("rest-complete");
    window.clearTimeout(restTimer);
    document.querySelectorAll(".mode-controls [data-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
    if (mode === "story") {
      shellsFound = new Set(); body.classList.remove("story-complete");
      document.querySelectorAll("[data-shell]").forEach((shell) => shell.classList.remove("is-found"));
      document.querySelector("[data-story-count]").textContent = "Find three moon shells";
    }
    if (mode === "rest") {
      logLocal("REST_STARTED");
      restTimer = window.setTimeout(() => body.classList.add("rest-complete"), reducedMotion ? 1800 : 9000);
    }
    if (audioEngine) audioEngine.setRest(mode === "rest");
  }

  function findShell(button) {
    if (body.dataset.mode !== "story" || shellsFound.has(button.dataset.shell)) return;
    shellsFound.add(button.dataset.shell);
    button.classList.add("is-found");
    pulseTone(240 + shellsFound.size * 42, .5);
    const remaining = 3 - shellsFound.size;
    document.querySelector("[data-story-count]").textContent = remaining ? `${remaining} moon shell${remaining === 1 ? "" : "s"} left` : "All three moon shells found";
    if (!remaining) body.classList.add("story-complete");
  }

  function playMagicMoment() {
    if (body.classList.contains("magic-moment")) return;
    logLocal("MAGIC_MOMENT_PLAYED");
    setMode("explore");
    clearResponseClasses();
    document.querySelector("[data-ocean-experience]").scrollIntoView({ behavior: "auto" });
    body.classList.remove("wake-ripple", "wake-water", "wake-life", "milo-entered", "ocean-ready");
    void body.offsetWidth;
    body.classList.add("magic-moment");
    window.setTimeout(() => {
      body.classList.remove("magic-moment");
      body.classList.add("wake-water", "wake-life", "milo-entered", "ocean-ready");
    }, reducedMotion ? 3600 : 10400);
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
    payload.world = "ocean"; payload.character = "milo";
    return payload;
  }

  function hydrateObservationForms() {
    for (const [action, values] of Object.entries(state.observations || {})) {
      const form = document.querySelector(`[data-observation-form="${action}"]`);
      if (!form) continue;
      for (const [name, value] of Object.entries(values)) {
        const element = form.elements.namedItem(name);
        if (!element) continue;
        if (element.type === "checkbox") element.checked = Boolean(value); else element.value = String(value);
      }
    }
  }

  function setObserverStatus(message, error = false) {
    const node = document.querySelector("[data-observer-status]");
    node.textContent = message; node.style.color = error ? "#ffad99" : "#9fe2d7";
  }

  async function saveObservation(action, form) {
    const payload = formPayload(form);
    state.observations[action] = payload; saveState();
    if (!document.querySelector("[data-pilot-consent]").checked) {
      setObserverStatus(`${action.replace("_", " ")} saved on this device. Nothing was sent.`); return;
    }
    const result = await window.MyNestMagicRoomSync.send({ client_event_id: crypto.randomUUID(), action, magic_pilot_id: state.magic_pilot_id, pilot_consent: true, payload });
    if (result.ok) setObserverStatus(`${action.replace("_", " ")} saved and anonymously synced.`);
    else setObserverStatus(result.body?.message || "Unable to sync. The observation remains on this device.", true);
  }

  function showObservationTab(action) {
    document.querySelectorAll("[data-observation-form]").forEach((form) => { form.hidden = form.dataset.observationForm !== action; });
    document.querySelectorAll("[data-observation-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.observationTab === action)));
  }

  function populateCharacters() {
    const worlds = window.MYNEST_WORLDS || {};
    const names = ["none", ...new Set(Object.values(worlds).flatMap((world) => [world.lead, ...(world.support || [])]).filter(Boolean).map((name) => name.toLowerCase().replace(/\s+/g, "_")))];
    document.querySelectorAll("[data-character-select]").forEach((select) => {
      select.innerHTML = names.map((name) => `<option value="${name}">${name === "none" ? "No preference" : name.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}</option>`).join("");
    });
  }

  stage.addEventListener("pointermove", (event) => {
    if (!body.classList.contains("ocean-ready") || body.dataset.mode === "rest") return;
    const bounds = stage.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(18, Math.min(78, ((event.clientY - bounds.top) / bounds.height) * 100));
    stage.style.setProperty("--pointer-x", `${x}%`); stage.style.setProperty("--pointer-y", `${y}%`);
  });
  document.querySelector("[data-wake]").addEventListener("click", () => wakeRoom(true));
  document.querySelector("[data-audio]").addEventListener("click", toggleAudio);
  document.querySelector("[data-milo]").addEventListener("click", () => triggerResponse("milo"));
  document.querySelectorAll("[data-room-zone]").forEach((button) => button.addEventListener("click", () => triggerResponse(button.dataset.roomZone)));
  document.querySelectorAll(".mode-controls [data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  document.querySelectorAll("[data-shell]").forEach((button) => button.addEventListener("click", () => findShell(button)));
  document.querySelector("[data-magic-moment]").addEventListener("click", playMagicMoment);
  document.querySelector("[data-observer-open]").addEventListener("click", () => { document.querySelector("[data-observer-panel]").hidden = false; });
  document.querySelector("[data-observer-close]").addEventListener("click", () => { document.querySelector("[data-observer-panel]").hidden = true; });
  document.querySelectorAll("[data-observation-tab]").forEach((button) => button.addEventListener("click", () => showObservationTab(button.dataset.observationTab)));
  document.querySelectorAll("[data-observation-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const button = form.querySelector("button[type='submit']"); button.disabled = true;
    await saveObservation(form.dataset.observationForm, form); button.disabled = false;
  }));
  document.querySelector("[data-export]").addEventListener("click", async () => {
    const exportData = { project: "MYNEST_OCEAN_REAL_ROOM_REDIRECT_v0.2", magic_pilot_id: state.magic_pilot_id, observations: state.observations };
    try { await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)); setObserverStatus("Anonymous observation JSON copied."); }
    catch { setObserverStatus("Clipboard access was blocked. Observations remain on this device.", true); }
  });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelector("[data-observer-panel]").hidden = true; });

  populateCharacters(); hydrateObservationForms();
  document.querySelector("[data-magic-pilot-id]").textContent = state.magic_pilot_id;
  saveState(); logLocal("ROOM_LOADED");
  queueWake(reducedMotion ? 300 : 1200, () => wakeRoom());
})();

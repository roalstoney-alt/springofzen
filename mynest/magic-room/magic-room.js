(() => {
  "use strict";

  const STORE_KEY = "mynest_magic_room_v01";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const body = document.body;
  const stage = document.querySelector("[data-room-stage]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qaEvents = [];
  const wakeTimers = [];
  const returnTimers = [];
  const residentTimers = [];
  let audioEngine = null;
  let wakeStarted = false;
  let feedbackTimer = null;
  let fishTimer = null;
  let followTimer = null;
  let fishTouchReset = null;
  let controlsTimer = null;
  let activeInteraction = null;
  let fishTouches = 0;
  let miloTouches = 0;

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

  function clearTimers(collection) {
    while (collection.length) window.clearTimeout(collection.pop());
  }

  function queueTimer(collection, delay, callback) {
    collection.push(window.setTimeout(callback, delay));
  }

  function setMiloState(next) {
    const allowed = ["idle", "notice_child", "approach", "play", "return_home", "sleep"];
    if (!allowed.includes(next)) return;
    body.dataset.miloState = next;
  }

  function setFishState(next) {
    body.dataset.fishState = next;
  }

  function stopFishCycle() {
    window.clearTimeout(fishTimer);
    fishTimer = null;
  }

  function scheduleFishCycle() {
    stopFishCycle();
    if (!body.classList.contains("ocean-ready") || body.dataset.mode === "rest" || body.classList.contains("magic-moment")) return;
    const cycle = ["move", "observe", "hide", "return"];
    const current = body.dataset.fishState || "move";
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    const delays = reducedMotion ? { move: 3000, observe: 2200, hide: 1800, return: 1800 } : { move: 6500, observe: 3200, hide: 4200, return: 2800 };
    fishTimer = window.setTimeout(() => {
      setFishState(next);
      scheduleFishCycle();
    }, delays[current] || 3600);
  }

  function stopResidentLoop() {
    clearTimers(residentTimers);
  }

  function scheduleResidentLoop() {
    stopResidentLoop();
    if (body.dataset.mode === "rest" || body.classList.contains("magic-moment")) return;
    const visiblePause = reducedMotion ? 7000 : 14000 + Math.round(Math.random() * 4000);
    queueTimer(residentTimers, visiblePause, () => {
      if (body.dataset.mode === "rest") return;
      body.classList.add("milo-away");
      setMiloState("idle");
      const absentPause = reducedMotion ? 4500 : 11000 + Math.round(Math.random() * 4000);
      queueTimer(residentTimers, absentPause, () => {
        if (body.dataset.mode === "rest") return;
        body.classList.remove("milo-away");
        body.classList.add("milo-returning");
        queueTimer(residentTimers, reducedMotion ? 1200 : 3600, () => {
          body.classList.remove("milo-returning");
          scheduleResidentLoop();
        });
      });
    });
  }

  function wakeRoom(immediate = false) {
    if (wakeStarted && !immediate) return;
    clearTimers(wakeTimers);
    wakeStarted = true;
    const times = reducedMotion ? [800, 1300, 1800, 2400, 3200, 4200] : immediate ? [0, 500, 1100, 1900, 3000, 4300] : [3000, 4500, 6000, 8000, 10500, 13500];
    queueTimer(wakeTimers, times[0], () => { body.classList.add("wake-ripple", "fish-peek", "discovery-one"); logLocal("OCEAN_WOKE"); });
    queueTimer(wakeTimers, times[1], () => setFishState("observe"));
    queueTimer(wakeTimers, times[2], () => { body.classList.add("wake-water", "wake-life", "discovery-two"); setFishState("observe"); });
    queueTimer(wakeTimers, times[3], () => { body.classList.add("discovery-three"); setFishState("move"); });
    queueTimer(wakeTimers, times[4], () => {
      body.classList.add("milo-entered", "milo-arriving");
      setFishState("hide"); setMiloState("idle"); logLocal("MILO_SEEN");
    });
    queueTimer(wakeTimers, times[5], () => {
      body.classList.remove("milo-arriving");
      body.classList.add("ocean-ready");
      setFishState("return");
      scheduleFishCycle();
      scheduleResidentLoop();
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
    gain.gain.linearRampToValueAtTime(.07, context.currentTime + .16);
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
    master.gain.value = .045;
    master.connect(context.destination);
    const low = context.createOscillator();
    const high = context.createOscillator();
    const lowGain = context.createGain();
    const highGain = context.createGain();
    const filter = context.createBiquadFilter();
    low.type = "sine"; high.type = "sine";
    low.frequency.value = 68; high.frequency.value = 132;
    lowGain.gain.value = .045; highGain.gain.value = .006;
    filter.type = "lowpass"; filter.frequency.value = 320;
    low.connect(lowGain).connect(filter); high.connect(highGain).connect(filter); filter.connect(master);
    low.start(); high.start();
    return { context, master, low, high, setRest(resting) {
      const now = context.currentTime;
      low.frequency.setTargetAtTime(resting ? 52 : 68, now, 1.4);
      high.frequency.setTargetAtTime(resting ? 96 : 132, now, 1.4);
      master.gain.setTargetAtTime(resting ? .018 : .045, now, 1.8);
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
    pulseTone(126, .8);
  }

  function clearResponseClasses() {
    body.classList.remove("shell-response", "reef-response", "plush-response", "milo-response");
  }

  function triggerResponse(type) {
    if (!body.classList.contains("ocean-ready")) wakeRoom(true);
    if (body.dataset.mode === "rest" || activeInteraction) return;
    activeInteraction = type;
    stopFishCycle();
    stopResidentLoop();
    clearResponseClasses();
    window.clearTimeout(feedbackTimer);
    const delay = reducedMotion ? 60 : type === "reef" ? 550 + Math.random() * 400 : 150 + Math.random() * 450;
    feedbackTimer = window.setTimeout(() => {
      body.classList.remove("milo-away");
      body.classList.add(`${type}-response`);
      const eventNames = { shell: "SHELL_CLICKED", reef: "REEF_CLICKED", plush: "PLUSH_CLICKED", milo: "MILO_CLICKED" };
      logLocal(eventNames[type]);
      if (type === "milo") {
        miloTouches = Math.min(3, miloTouches + 1);
        setMiloState(miloTouches === 1 ? "notice_child" : miloTouches === 2 ? "approach" : "play");
        pulseTone(112, 1.05);
      }
      if (type === "plush") { setMiloState("approach"); pulseTone(96, 1.15); }
      if (type === "shell") { setMiloState("notice_child"); setFishState("observe"); pulseTone(196, .7); }
      if (type === "reef") { setFishState("hide"); pulseTone(152, .5); }
      feedbackTimer = window.setTimeout(() => {
        clearResponseClasses();
        activeInteraction = null;
        setMiloState("idle");
        setFishState("return");
        scheduleFishCycle();
        scheduleResidentLoop();
      }, reducedMotion ? 1900 : type === "milo" ? 6200 : 5000);
    }, delay);
  }

  function resetReturnHome() {
    clearTimers(returnTimers);
    body.classList.remove("return-quiet", "return-turn", "return-travel", "return-transfer", "return-sleep", "rest-complete");
    document.querySelector("[data-rest-phrase]").textContent = "";
  }

  function startReturnHome() {
    resetReturnHome();
    stopFishCycle();
    stopResidentLoop();
    window.clearTimeout(feedbackTimer);
    feedbackTimer = null;
    clearResponseClasses(); activeInteraction = null;
    body.classList.remove("milo-away", "milo-returning");
    setMiloState("return_home");
    logLocal("MILO_RETURN_HOME_STARTED");
    const times = reducedMotion ? [0, 450, 1000, 1750, 2500] : [0, 2800, 5200, 9200, 12400];
    queueTimer(returnTimers, times[0], () => { body.classList.add("return-quiet"); setFishState("hide"); });
    queueTimer(returnTimers, times[1], () => body.classList.add("return-turn"));
    queueTimer(returnTimers, times[2], () => body.classList.add("return-travel"));
    queueTimer(returnTimers, times[3], () => body.classList.add("return-transfer"));
    queueTimer(returnTimers, times[4], () => {
      body.classList.add("return-sleep", "rest-complete");
      setMiloState("sleep");
      document.querySelector("[data-rest-phrase]").textContent = "Milo is sleeping.";
      logLocal("MILO_RETURNED_HOME");
    });
  }

  function setMode(mode) {
    if (!["explore", "story", "rest"].includes(mode)) return;
    body.dataset.mode = mode;
    document.querySelector("[data-rest-toggle]")?.setAttribute("aria-pressed", String(mode === "rest"));
    if (mode === "rest") {
      logLocal("REST_STARTED");
      startReturnHome();
    } else {
      resetReturnHome();
      body.classList.remove("milo-away");
      setMiloState("idle");
      setFishState("return");
      scheduleFishCycle();
      scheduleResidentLoop();
    }
    if (audioEngine) audioEngine.setRest(mode === "rest");
  }

  function playMagicMoment() {
    if (body.classList.contains("magic-moment")) return;
    logLocal("MAGIC_MOMENT_PLAYED");
    setMode("explore");
    stopFishCycle();
    stopResidentLoop();
    clearResponseClasses();
    document.querySelector("[data-ocean-experience]").scrollIntoView({ behavior: "auto" });
    body.classList.remove("wake-ripple", "wake-water", "wake-life", "discovery-one", "discovery-two", "discovery-three", "milo-entered", "ocean-ready");
    setFishState("hide");
    void body.offsetWidth;
    body.classList.add("magic-moment");
    window.setTimeout(() => {
      body.classList.remove("magic-moment");
      body.classList.add("wake-water", "wake-life", "discovery-one", "discovery-two", "discovery-three", "milo-entered", "ocean-ready");
      setFishState("observe");
      setMiloState("idle");
      scheduleFishCycle();
      scheduleResidentLoop();
    }, reducedMotion ? 3200 : 10400);
  }

  function restartScene() {
    clearTimers(wakeTimers); clearTimers(returnTimers); stopResidentLoop(); stopFishCycle();
    window.clearTimeout(feedbackTimer); window.clearTimeout(followTimer); window.clearTimeout(fishTouchReset);
    window.clearTimeout(controlsTimer);
    activeInteraction = null; fishTouches = 0; miloTouches = 0; wakeStarted = false;
    body.dataset.mode = "explore"; body.dataset.miloState = "idle"; setFishState("hide");
    body.className = "";
    document.querySelector("[data-rest-toggle]")?.setAttribute("aria-pressed", "false");
    document.querySelector("[data-rest-phrase]").textContent = "";
    controlsTimer = window.setTimeout(() => body.classList.add("controls-ready"), reducedMotion ? 250 : 1500);
    queueTimer(wakeTimers, reducedMotion ? 200 : 700, () => wakeRoom());
    logLocal("SCENE_RESTARTED");
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
    const y = Math.max(58, Math.min(84, ((event.clientY - bounds.top) / bounds.height) * 100));
    stage.style.setProperty("--pointer-x", `${x}%`);
    stage.style.setProperty("--pointer-y", `${y}%`);
  });

  stage.addEventListener("pointerdown", (event) => {
    if (!body.classList.contains("ocean-ready") || body.dataset.mode === "rest" || activeInteraction) return;
    if (event.target.closest("button, a, input, select, label")) return;
    const bounds = stage.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(58, Math.min(84, ((event.clientY - bounds.top) / bounds.height) * 100));
    if (y < 58) return;
    stage.style.setProperty("--pointer-x", `${x}%`);
    stage.style.setProperty("--pointer-y", `${y}%`);
    fishTouches += 1;
    activeInteraction = "fish";
    stopFishCycle();
    window.clearTimeout(followTimer);
    window.clearTimeout(fishTouchReset);

    if (fishTouches === 1) {
      setFishState("observe");
      logLocal("FISH_NOTICED_CHILD");
    } else if (fishTouches === 2) {
      body.classList.add("fish-follow");
      setFishState("observe");
      logLocal("FISH_FOLLOWED_BRIEFLY");
      window.setTimeout(() => {
        body.classList.remove("milo-away");
        setMiloState("notice_child");
      }, reducedMotion ? 80 : 700);
    } else {
      setFishState("hide");
      logLocal("FISH_CHOSE_TO_HIDE");
    }

    followTimer = window.setTimeout(() => {
      body.classList.remove("fish-follow");
      setFishState(fishTouches > 1 ? "hide" : "return");
      setMiloState("idle");
      activeInteraction = null;
      scheduleFishCycle();
      scheduleResidentLoop();
    }, reducedMotion ? 900 : fishTouches === 2 ? 2600 : 1900);
    fishTouchReset = window.setTimeout(() => { fishTouches = 0; }, reducedMotion ? 2600 : 8500);
  });

  document.querySelector("[data-wake]")?.addEventListener("click", () => wakeRoom(true));
  document.querySelector("[data-audio]").addEventListener("click", toggleAudio);
  document.querySelector("[data-milo]").addEventListener("click", () => triggerResponse("milo"));
  document.querySelectorAll("[data-room-zone]").forEach((button) => button.addEventListener("click", () => triggerResponse(button.dataset.roomZone)));
  document.querySelectorAll(".mode-controls [data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  document.querySelector("[data-restart]")?.addEventListener("click", restartScene);
  document.querySelector("[data-rest-toggle]").addEventListener("click", () => setMode(body.dataset.mode === "rest" ? "explore" : "rest"));
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
    const exportData = { project: "MYNEST_OCEAN_REAL_ROOM_001_LIVED_IN_REFRAME_v0.3", magic_pilot_id: state.magic_pilot_id, observations: state.observations };
    try { await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)); setObserverStatus("Anonymous observation JSON copied."); }
    catch { setObserverStatus("Clipboard access was blocked. Observations remain on this device.", true); }
  });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelector("[data-observer-panel]").hidden = true; });

  populateCharacters(); hydrateObservationForms();
  document.querySelector("[data-magic-pilot-id]").textContent = state.magic_pilot_id;
  saveState(); setFishState("hide"); logLocal("ROOM_LOADED");
  wakeRoom();
  controlsTimer = window.setTimeout(() => body.classList.add("controls-ready"), reducedMotion ? 250 : 1500);
})();

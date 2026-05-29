(function () {
  const VARIANT_KEY = "soz_home_variant";
  const NOTE_KEY = "soz_harbor_notes";
  let audioContext = null;
  let oscillator = null;
  let gain = null;

  function getVariant() {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get("variant");
    if (explicit === "room" || explicit === "dock") return explicit;
    if (explicit === "a") return "room";
    if (explicit === "b") return "dock";
    try {
      const saved = window.localStorage.getItem(VARIANT_KEY);
      if (saved === "room" || saved === "dock") return saved;
      const chosen = Math.random() > 0.5 ? "dock" : "room";
      window.localStorage.setItem(VARIANT_KEY, chosen);
      return chosen;
    } catch (error) {
      return "room";
    }
  }

  function applyVariant() {
    const variant = getVariant();
    document.body.dataset.homeVariant = variant;
    document.querySelectorAll("[data-variant-room]").forEach((node) => {
      node.textContent = node.dataset[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`];
    });
    window.SpringOfZenTracking?.track("home_variant_seen", { variant });
    window.SpringOfZenI18n?.apply();
  }

  async function toggleSound(button) {
    const active = button.getAttribute("aria-pressed") === "true";
    if (active) {
      gain?.gain.setTargetAtTime(0, audioContext.currentTime, 0.5);
      button.setAttribute("aria-pressed", "false");
      button.textContent = window.SpringOfZenI18n?.t("Sound") || "Sound";
      return;
    }

    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    oscillator = oscillator || audioContext.createOscillator();
    gain = gain || audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 74;
    gain.gain.value = 0;
    oscillator.connect(gain).connect(audioContext.destination);
    if (!oscillator.started) {
      oscillator.start();
      oscillator.started = true;
    }
    gain.gain.setTargetAtTime(0.018, audioContext.currentTime, 1.8);
    button.setAttribute("aria-pressed", "true");
    button.textContent = window.SpringOfZenI18n?.t("Listen") || "Listen";
    window.SpringOfZenTracking?.track("home_sound_enabled", { source: "home" });
  }

  function bindSound() {
    const button = document.querySelector("[data-sound-toggle]");
    if (!button) return;
    button.addEventListener("click", () => toggleSound(button));
  }

  function readNotes() {
    try {
      return JSON.parse(window.localStorage.getItem(NOTE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeNotes(notes) {
    try {
      window.localStorage.setItem(NOTE_KEY, JSON.stringify(notes.slice(-50)));
    } catch (error) {
      console.warn("[SpringOfZen note fallback]", error);
    }
  }

  function bindNote() {
    const form = document.querySelector("[data-harbor-note]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = {
        version: `homepage_v5_${document.body.dataset.homeVariant || "room"}`,
        first_impression: data.get("first_impression") || "",
        one_word: data.get("one_word") || "",
        would_return: data.get("would_return") || "",
        what_should_change: data.get("what_should_change") || "",
        timestamp: new Date().toISOString()
      };
      const notes = readNotes();
      notes.push(payload);
      writeNotes(notes);
      await window.SpringOfZenTracking?.track("harbor_note_left", payload);
      form.querySelector(".form-status").textContent = "Your note stays with the Harbor.";
      window.SpringOfZenI18n?.apply();
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyVariant();
    bindSound();
    bindNote();
  });
})();

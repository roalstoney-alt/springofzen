(function () {
  const VARIANT_KEY = "soz_home_variant";
  const NOTE_KEY = "soz_harbor_notes";
  const AUDIO_SRC = "assets/audio/harbor-roomtone.mp3";
  let roomAudio = null;
  let fadeTimer = null;

  function getVariant() {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get("variant");
    if (explicit === "room" || explicit === "dock") return explicit;
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
      const key = `variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;
      node.textContent = node.dataset[key] || node.textContent;
    });
    window.SpringOfZenTracking?.track("home_variant_seen", { variant });
    window.SpringOfZenI18n?.apply();
  }

  function fadeAudio(toVolume, after) {
    if (!roomAudio) return;
    window.clearInterval(fadeTimer);
    const start = roomAudio.volume;
    const steps = 30;
    let tick = 0;
    fadeTimer = window.setInterval(() => {
      tick += 1;
      roomAudio.volume = Math.max(0, Math.min(1, start + ((toVolume - start) * tick / steps)));
      if (tick >= steps) {
        window.clearInterval(fadeTimer);
        roomAudio.volume = toVolume;
        after?.();
      }
    }, 100);
  }

  async function toggleSound(button) {
    const active = button.getAttribute("aria-pressed") === "true";
    roomAudio = roomAudio || new Audio(AUDIO_SRC);
    roomAudio.loop = true;
    roomAudio.preload = "auto";

    if (active) {
      fadeAudio(0, () => roomAudio.pause());
      button.setAttribute("aria-pressed", "false");
      button.textContent = window.SpringOfZenI18n?.t("Listen") || "Listen";
      return;
    }

    try {
      roomAudio.volume = 0;
      await roomAudio.play();
      fadeAudio(0.22);
      button.setAttribute("aria-pressed", "true");
      button.textContent = window.SpringOfZenI18n?.t("Mute") || "Mute";
      window.SpringOfZenTracking?.track("home_sound_enabled", { source: "home" });
    } catch (error) {
      button.setAttribute("aria-pressed", "false");
      button.textContent = window.SpringOfZenI18n?.t("Listen") || "Listen";
    }
  }

  function bindSound() {
    const button = document.querySelector("#soundBtn");
    if (!button) return;
    button.addEventListener("click", () => toggleSound(button));
  }

  function bindAdvance() {
    const button = document.querySelector("[data-advance-harbor]");
    if (!button) return;
    button.addEventListener("click", () => {
      document.querySelector("#tonight")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
        version: `homepage_v55_${document.body.dataset.homeVariant || "room"}`,
        first_impression: data.get("first_impression") || "",
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
    bindAdvance();
    bindNote();
  });
})();

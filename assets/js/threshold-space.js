(function () {
  const NOTE_KEY = "soz_harbor_notes";
  const AUDIO_SRC = "assets/audio/threshold-roomtone.mp3";
  const DOOR_POSITIONS = {
    sound: ["18%", "50%"],
    market: ["34%", "34%"],
    landscape: ["52%", "56%"],
    ai: ["68%", "35%"],
    skill: ["79%", "62%"],
    sentence: ["41%", "74%"]
  };
  let roomAudio = null;
  let fadeTimer = null;

  function fallbackDoors() {
    return [
      { id: "sound", label: "For those who came to listen", short: "Sound", href: "sessions.html" },
      { id: "market", label: "For those watching hidden motion", short: "Motion", href: "observatory.html#market" },
      { id: "landscape", label: "For those who followed a light", short: "View", href: "harbor.html" },
      { id: "ai", label: "For those studying the age of agents", short: "Agents", href: "journal.html#agent-era" },
      { id: "skill", label: "For those building quietly", short: "Craft", href: "skills.html" },
      { id: "sentence", label: "For those who only need one sentence", short: "One sentence", href: "today.html" }
    ];
  }

  async function loadDoors() {
    try {
      const response = await fetch("assets/data/doors.json");
      if (!response.ok) throw new Error("doors");
      return response.json();
    } catch (error) {
      return fallbackDoors();
    }
  }

  function renderDoors(doors) {
    const container = document.querySelector("[data-threshold-doors]");
    if (!container) return;
    container.innerHTML = doors.map((door, index) => {
      const [x, y] = DOOR_POSITIONS[door.id] || ["50%", "50%"];
      const delay = 2400 + (index * 130);
      return `<a class="threshold-door" data-door="${door.id}" href="${door.href}" style="--door-x:${x};--door-y:${y};--door-delay:${delay}ms">
        <strong>${door.short}</strong>
        <span>${door.label}</span>
      </a>`;
    }).join("");
    window.SpringOfZenI18n?.apply(container);
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
      button.textContent = window.SpringOfZenI18n?.t("Listen to the room") || "Listen to the room";
      return;
    }

    try {
      roomAudio.volume = 0;
      await roomAudio.play();
      fadeAudio(0.22);
      button.setAttribute("aria-pressed", "true");
      button.textContent = window.SpringOfZenI18n?.t("Let the room fall quiet") || "Let the room fall quiet";
      window.SpringOfZenTracking?.track("threshold_roomtone_enabled", { source: "threshold" });
    } catch (error) {
      button.setAttribute("aria-pressed", "false");
      button.textContent = window.SpringOfZenI18n?.t("Listen to the room") || "Listen to the room";
    }
  }

  function bindSound() {
    const button = document.querySelector("#soundBtn");
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
        version: "homepage_v6_threshold",
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
      window.SpringOfZenI18n?.apply(form);
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    renderDoors(await loadDoors());
    bindSound();
    bindNote();
  });
})();

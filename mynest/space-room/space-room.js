(() => {
  "use strict";

  const body = document.body;
  const controls = [...document.querySelectorAll("[data-command]")];
  const kicker = document.querySelector("[data-state-kicker]");
  const title = document.querySelector("[data-state-title]");
  const copy = document.querySelector("[data-state-copy]");
  const roomAlt = document.querySelector("[data-room-alt]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const missions = ["Leave Home", "Find Blue Planet", "Return Home"];
  let missionIndex = 0;
  let sleepTimer = null;

  const states = {
    idle: {
      kicker: "Cabin idle",
      title: "Ready when you are",
      copy: "The room is simply a room.",
      alt: "A quiet real child's room with an open-sided Sleep Command Pod, Orbit docked nearby, and an idle Navigation Beacon."
    },
    mission: {
      kicker: "Mission active",
      title: missions[0],
      copy: "The universe opens from the pod.",
      alt: "A gentle blue star map projects from the open Sleep Command Pod onto the front wall and center ceiling while the rest of the room stays familiar."
    },
    return: {
      kicker: "Return home",
      title: "Cabin light returning",
      copy: "The map folds back into the pod.",
      alt: "The blue star map contracts toward the Sleep Command Pod as warm room light returns and the Navigation Beacon turns amber."
    },
    sleep: {
      kicker: "Sleep",
      title: "Mission complete",
      copy: "Orbit is docked. The room is quiet.",
      alt: "The clean room rests in low amber light with Orbit docked, the Navigation Beacon dim, and no galaxy visible."
    }
  };

  function setState(next, command = next) {
    window.clearTimeout(sleepTimer);
    body.dataset.roomState = next;
    const state = states[next];
    kicker.textContent = state.kicker;
    title.textContent = next === "mission" ? missions[missionIndex] : state.title;
    copy.textContent = state.copy;
    roomAlt.textContent = state.alt;
    controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.command === command)));
  }

  function startMission() {
    if (body.dataset.roomState === "mission") missionIndex = (missionIndex + 1) % missions.length;
    else missionIndex = 0;
    setState("mission", "explore");
  }

  function returnHome() {
    setState("return", "home");
    sleepTimer = window.setTimeout(() => setState("sleep", "home"), reduceMotion ? 900 : 4200);
  }

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.dataset.command;
      if (command === "wake") setState("idle", "wake");
      if (command === "explore") startMission();
      if (command === "home") returnHome();
    });
  });
})();

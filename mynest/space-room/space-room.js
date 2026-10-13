(() => {
  "use strict";

  const body = document.body;
  const controls = [...document.querySelectorAll("[data-command]")];
  const kicker = document.querySelector("[data-state-kicker]");
  const title = document.querySelector("[data-state-title]");
  const copy = document.querySelector("[data-state-copy]");
  const roomAlt = document.querySelector("[data-room-alt]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sleepTimer = null;

  const states = {
    idle: {
      kicker: "Cabin idle",
      title: "Your spacecraft is ready",
      copy: "The cockpit is quiet until the pilot chooses to begin.",
      alt: "A future spacecraft cabin with an open, sleepable Command Pod, reachable inner console, Orbit charging in a wall dock, and a warm Navigation Beacon."
    },
    mission: {
      kicker: "Mission active",
      title: "Find the Blue Planet",
      copy: "The emitter opens one route from the cockpit.",
      alt: "One route to a blue planet expands from a local hologram at the Command Pod emitter onto the front wall and center ceiling."
    },
    return: {
      kicker: "Return home",
      title: "Cabin light returning",
      copy: "The map folds back into the pod.",
      alt: "The route contracts into the Command Pod emitter as the window shade lifts, warm cabin light returns, and the Navigation Beacon turns amber."
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
    title.textContent = state.title;
    copy.textContent = state.copy;
    roomAlt.textContent = state.alt;
    controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.command === command)));
  }

  function startMission() {
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

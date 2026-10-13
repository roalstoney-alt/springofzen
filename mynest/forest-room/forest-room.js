(() => {
  const body = document.body;
  const stage = document.querySelector("[data-forest-stage]");
  const controls = [...document.querySelectorAll("[data-mode]")];
  const live = document.querySelector("[data-state-live]");
  const kicker = document.querySelector("[data-state-kicker]");
  const phrase = document.querySelector("[data-state-phrase]");
  const fireflyField = document.querySelector("[data-fireflies]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loaded = new Map([["day", Promise.resolve()]]);
  let desiredMode = "day";
  let transitionTimer = 0;
  let meadowTimer = 0;

  const COPY = {
    day: { kicker: "Day play", phrase: "The room is awake.", live: "Day Play mode. The room is sunlit and gently alive." },
    night: { kicker: "Night dream", phrase: "The forest is slowing down.", live: "Night Dream mode. The moon is outside, the lamps are warmer, and the room is becoming still." },
    rest: { kicker: "Lights-off real", phrase: "Magic can rest too.", live: "Lights-Off Real mode. All active magic has stopped and only calm practical light remains." }
  };

  function loadPicture(mode) {
    if (loaded.has(mode)) return loaded.get(mode);
    const picture = document.querySelector(`[data-picture="${mode}"]`);
    if (!picture) return Promise.resolve();
    const source = picture.querySelector("source[data-srcset]");
    const image = picture.querySelector("img[data-src]");
    if (source) { source.srcset = source.dataset.srcset; source.removeAttribute("data-srcset"); }
    if (image) { image.src = image.dataset.src; image.removeAttribute("data-src"); }
    const ready = !image || image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
    loaded.set(mode, ready);
    return ready;
  }

  async function setMode(mode, announce = true) {
    if (!COPY[mode]) return;
    desiredMode = mode;
    await loadPicture(mode);
    if (desiredMode !== mode) return;
    window.clearTimeout(transitionTimer);
    body.classList.add("is-transitioning");
    body.dataset.forestMode = mode;
    controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
    kicker.textContent = COPY[mode].kicker;
    phrase.textContent = COPY[mode].phrase;
    if (announce) live.textContent = COPY[mode].live;
    transitionTimer = window.setTimeout(() => body.classList.remove("is-transitioning"), reduceMotion ? 700 : 2800);
  }

  function seedFireflies() {
    if (!fireflyField || reduceMotion) return;
    const points = [
      [13,70,7.8,-2.2],[22,61,8.7,-5.1],[31,76,9.4,-1.1],[39,67,10.2,-7.4],
      [46,79,8.2,-3.4],[55,71,11.5,-6.3],[62,81,9.8,-2.8],[69,66,12.1,-8.2],
      [77,75,8.9,-4.7],[84,63,10.7,-1.6],[91,78,9.6,-6.9],[34,55,12.4,-3.8]
    ];
    const fragment = document.createDocumentFragment();
    points.forEach(([x,y,d,delay]) => {
      const dot = document.createElement("i");
      dot.className = "firefly";
      dot.style.setProperty("--x", `${x}%`);
      dot.style.setProperty("--y", `${y}%`);
      dot.style.setProperty("--duration", `${d}s`);
      dot.style.setProperty("--delay", `${delay}s`);
      fragment.append(dot);
    });
    fireflyField.append(fragment);
  }

  function setMeadowPoint(event) {
    if (!stage || body.dataset.forestMode === "rest" || reduceMotion) return;
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (y < 46) return;
    stage.style.setProperty("--meadow-x", `${x}%`);
    stage.style.setProperty("--meadow-y", `${y}%`);
    stage.classList.add("is-meadow-active");
    window.clearTimeout(meadowTimer);
    meadowTimer = window.setTimeout(() => stage.classList.remove("is-meadow-active"), 850);
  }

  function createRipple(event) {
    if (!stage || body.dataset.forestMode === "rest" || reduceMotion || event.target.closest("button, a")) return;
    const rect = stage.getBoundingClientRect();
    if (event.clientY - rect.top < rect.height * .46) return;
    const ripple = document.createElement("i");
    ripple.className = "meadow-ripple";
    ripple.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    ripple.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
    stage.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  controls.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  stage?.addEventListener("pointermove", setMeadowPoint, { passive: true });
  stage?.addEventListener("pointerdown", createRipple, { passive: true });
  seedFireflies();
  body.classList.add("is-enhanced");

  const idleLoad = () => {
    loadPicture("night");
    window.setTimeout(() => loadPicture("rest"), 1200);
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(idleLoad, { timeout: 2200 });
  else window.setTimeout(idleLoad, 900);
})();

(function () {
  const STORAGE_KEY = "soz_selected_gate";
  const VALID_GATES = ["mountain", "cyber", "garden", "ocean", "recovery", "manifesto"];
  const DEBUG_REF_MAP = {
    youtube: "https://www.youtube.com/watch?v=night-harbor",
    tiktok: "https://www.tiktok.com/@springofzen",
    instagram: "https://www.instagram.com/springofzen",
    xiaohongshu: "https://www.xiaohongshu.com/explore/springofzen",
    google: "https://www.google.com/search?q=calm+sleep+focus",
    bing: "https://www.bing.com/search?q=recovery+focus",
    duckduckgo: "https://duckduckgo.com/?q=human+harbor",
    x: "https://x.com/springofzen",
    medium: "https://medium.com/@springofzen",
    substack: "https://springofzen.substack.com/",
    github: "https://github.com/roalstoney-alt/springofzen"
  };
  const REFERRER_GATE_MAP = [
    { pattern: /youtube\.com|youtu\.be/i, gate: "mountain" },
    { pattern: /tiktok\.com/i, gate: "cyber" },
    { pattern: /instagram\.com/i, gate: "garden" },
    { pattern: /xiaohongshu\.com|xhslink/i, gate: "garden" },
    { pattern: /google\.|bing\.com|duckduckgo\.com/i, gate: "recovery" },
    { pattern: /twitter\.com|x\.com/i, gate: "manifesto" },
    { pattern: /medium\.com|substack\.com/i, gate: "manifesto" },
    { pattern: /github\.com/i, gate: "manifesto" }
  ];

  let gates = {};
  let today = {};
  let activeGate = "mountain";

  function t(value) {
    return window.SpringOfZenI18n?.t(value) || value;
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return response.json();
  }

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getGateFromUrl() {
    const gate = getParams().get("gate");
    return VALID_GATES.includes(gate) ? gate : null;
  }

  function getGateFromStorage() {
    try {
      const gate = window.localStorage.getItem(STORAGE_KEY);
      return VALID_GATES.includes(gate) ? gate : null;
    } catch (error) {
      const cookieGate = document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${STORAGE_KEY}=`))
        ?.split("=")[1];
      return VALID_GATES.includes(cookieGate) ? cookieGate : null;
    }
  }

  function getDebugReferrer() {
    const debugRef = getParams().get("debugRef");
    return DEBUG_REF_MAP[debugRef] || null;
  }

  function getGateFromReferrer() {
    const ref = getDebugReferrer() || document.referrer || "";
    const match = REFERRER_GATE_MAP.find((item) => item.pattern.test(ref));
    return match ? match.gate : null;
  }

  function resolveGate() {
    if (getParams().get("resetGate") === "1") clearGate();
    const fromUrl = getGateFromUrl();
    if (fromUrl) return { gate: fromUrl, source: "url" };
    const fromStorage = getGateFromStorage();
    if (fromStorage) return { gate: fromStorage, source: "localStorage" };
    const fromReferrer = getGateFromReferrer();
    if (fromReferrer) return { gate: fromReferrer, source: getDebugReferrer() ? "debugRef" : "referrer" };
    return { gate: "mountain", source: "default" };
  }

  function saveGate(gate) {
    try {
      window.localStorage.setItem(STORAGE_KEY, gate);
    } catch (error) {
      document.cookie = `${STORAGE_KEY}=${gate}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  function clearGate() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function setHref(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.href = value;
  }

  function renderGate(gate, source = "manual") {
    const data = gates[gate] || gates.mountain;
    activeGate = gate;
    document.body.dataset.gate = gate;
    document.body.dataset.gateTheme = data.theme;
    document.documentElement.style.setProperty("--gate-image", "none");

    setText("[data-gate-name]", t(data.name));
    setText("[data-gate-kicker]", t(data.kicker));
    setText("[data-gate-headline]", t(data.headline));
    setText("[data-gate-subcopy]", t(data.subcopy));
    setText("[data-gate-primary]", t(data.primaryCta));
    setText("[data-gate-secondary]", t(data.secondaryCta));
    setHref("[data-gate-primary]", data.primaryHref);
    setHref("[data-gate-secondary]", data.secondaryHref);

    document.querySelectorAll("[data-gate-option]").forEach((button) => {
      const isActive = button.dataset.gateOption === gate;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.trackSozEvent?.(source === "manual" ? "gate_switched" : "gate_resolved", {
      gate,
      source,
      theme: data.theme
    });
  }

  function renderGateSwitcher() {
    const switcher = document.querySelector("[data-gate-switcher]");
    if (!switcher) return;
    switcher.innerHTML = VALID_GATES.map((gate) => {
      const label = gates[gate]?.name?.replace(" Harbor", "") || gate;
      return `<button type="button" data-gate-option="${gate}" aria-pressed="false">${t(label)}</button>`;
    }).join("");
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gate-option]");
      if (!button) return;
      const gate = button.dataset.gateOption;
      if (!VALID_GATES.includes(gate)) return;
      saveGate(gate);
      renderGate(gate, "manual");
    });
  }

  function renderToday() {
    setText("[data-today-date]", t(today.date || ""));
    setText("[data-today-title]", t(today.title || ""));
    setText("[data-today-body]", t(today.body || ""));
    setText("[data-today-cta]", t(today.cta || "Read More"));
    setText("[data-night-title]", t(today.nightHarbor?.title || ""));
    setText("[data-night-time]", t(today.nightHarbor?.time || ""));
    setText("[data-night-description]", t(today.nightHarbor?.description || ""));
    const audio = document.querySelector("[data-night-audio]");
    if (audio && today.nightHarbor?.audio) {
      audio.src = today.nightHarbor.audio;
    }
  }

  function bindTracking() {
    document.querySelectorAll("[data-track-event]").forEach((element) => {
      element.addEventListener("click", () => {
        window.trackSozEvent?.(element.dataset.trackEvent, {
          gate: activeGate,
          label: element.textContent.trim(),
          href: element.getAttribute("href") || null,
          state: element.dataset.state || null
        });
      });
    });

    const audio = document.querySelector("[data-night-audio]");
    if (audio) {
      audio.addEventListener("play", () => {
        window.trackSozEvent?.("session_started", {
          gate: activeGate,
          title: today.nightHarbor?.title || "Night Harbor"
        });
      });
    }
  }

  async function init() {
    try {
      [gates, today] = await Promise.all([
        loadJson("assets/data/gates.json"),
        loadJson("assets/data/today.json")
      ]);
      renderGateSwitcher();
      renderToday();
      const resolved = resolveGate();
      if (resolved.source === "url") saveGate(resolved.gate);
      renderGate(resolved.gate, resolved.source);
      bindTracking();
      window.SpringOfZenI18n?.apply();
    } catch (error) {
      console.error("[SpringOfZen gateway]", error);
    }
  }

  window.addEventListener("springofzen:languagechange", () => {
    renderGate(activeGate, "language");
    renderGateSwitcher();
    renderGate(activeGate, "language");
    renderToday();
  });

  document.addEventListener("DOMContentLoaded", init);
})();

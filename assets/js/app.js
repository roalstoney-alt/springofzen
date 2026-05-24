async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function metricPills(signature = {}) {
  return Object.entries(signature)
    .map(([key, value]) => `<span class="metric"><strong>${escapeHtml(key.replaceAll("_", " "))}</strong>${escapeHtml(value)}</span>`)
    .join("");
}

function sessionCard(session) {
  return `<article class="session-card">
    <img src="${session.cover}" alt="${escapeHtml(session.title)} cover">
    <div class="session-card-body">
      <p class="eyebrow">${escapeHtml(session.state)}</p>
      <h2>${escapeHtml(session.title)}</h2>
      <p>${escapeHtml(session.description)}</p>
      <div class="meta-row">${session.recommended_for.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <a class="button primary" href="session.html?id=${encodeURIComponent(session.id)}">Enter Session</a>
    </div>
  </article>`;
}

function productCta(product) {
  if (!product) return "";
  const href = product.etsy_url || `products.html#${product.id}`;
  return `<a class="button" data-product-cta="${product.id}" href="${href}">Full Session Pack</a>`;
}

async function loadTracks() {
  return loadJson("assets/data/tracks.json");
}

async function loadDailyTheme() {
  return loadJson("assets/data/daily_theme.json");
}

function trackCard(track) {
  return `<article class="session-card" data-family="${escapeHtml(track.dna_family)}">
    <img src="${track.cover_url}" alt="${escapeHtml(track.title)} cover">
    <div class="session-card-body">
      <div class="meta-row">
        <span class="tag">${escapeHtml(track.track_id)}</span>
        <span class="tag">${escapeHtml(track.mutation_role || track.dna_family)}</span>
        <span class="tag">${escapeHtml(track.duration)}</span>
      </div>
      <h2>${escapeHtml(track.title)}</h2>
      <p>${escapeHtml(track.description)}</p>
      <a class="button primary" href="track.html?id=${encodeURIComponent(track.track_id)}">Listen</a>
    </div>
  </article>`;
}

function parameterList(parameters = {}) {
  return Object.entries(parameters)
    .map(([key, value]) => `<span class="metric"><strong>${escapeHtml(key)}</strong>${escapeHtml(value)}</span>`)
    .join("");
}

function archiveLinks(track) {
  const links = [`<a class="tag" href="${track.audio_url}">MP3 playback</a>`];
  if (track.wav_url) links.push(`<a class="tag" href="${track.wav_url}">WAV archive</a>`);
  if (track.midi_url) links.push(`<a class="tag" href="${track.midi_url}">MIDI archive</a>`);
  return links.join("");
}

function formUrl(track) {
  const configured = window.CONSCIOUSNESS_AUDIO_LAB?.googleFormEmbedUrl || "";
  if (track.feedback_form_url && !track.feedback_form_url.includes("PASTE_GOOGLE")) return track.feedback_form_url;
  return configured;
}

function recommendationMarkup(result) {
  const session = result.session;
  const product = result.product;
  return `<article class="recommendation-card">
    <div>
      <p class="eyebrow">Recommended</p>
      <h3>${escapeHtml(session.title)}</h3>
      <p>${escapeHtml(result.reason)}</p>
      ${result.unmatched ? `<p class="muted">You can also choose one of the state cards above to make the intent more specific.</p>` : ""}
      <div class="actions">
        <a class="button primary" href="session.html?id=${encodeURIComponent(session.id)}">Free Preview</a>
        ${productCta(product)}
        <a class="button" href="#emailSignup" data-scroll-email>Join Email List</a>
      </div>
    </div>
    <div class="signature-panel compact">${metricPills(session.consciousness_signature)}</div>
  </article>`;
}

async function renderStateCards() {
  const container = document.querySelector("#stateCards");
  if (!container || !window.SpringOfZenRecommender) return;
  container.innerHTML = window.SpringOfZenRecommender.stateCards.map((item) => {
    return `<a class="state-card" href="session.html?id=${encodeURIComponent(item.session_id)}" data-state-card="${item.state}" data-session-id="${item.session_id}" data-product-id="${item.product_id}">
      <span>${escapeHtml(item.state)}</span>
      <strong>${escapeHtml(item.session)}</strong>
      <p>${escapeHtml(item.description)}</p>
      <small>${item.intent_tags.map(escapeHtml).join(" / ")}</small>
    </a>`;
  }).join("");

  container.querySelectorAll("[data-state-card]").forEach((card) => {
    card.addEventListener("click", () => {
      window.SpringOfZenTracking?.track("state_card_clicked", {
        selected_state: card.dataset.stateCard,
        recommended_session_id: card.dataset.sessionId,
        recommended_product_id: card.dataset.productId,
        source: "homepage_state_selector"
      });
    });
  });
}

async function bindIntentForm() {
  const form = document.querySelector("#intentForm");
  const resultContainer = document.querySelector("#recommendationResult");
  if (!form || !resultContainer || !window.SpringOfZenRecommender) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = form.querySelector("#intentInput");
    const rawInput = input.value.trim();
    if (!rawInput) return;
    const result = await window.SpringOfZenRecommender.recommend(rawInput);
    resultContainer.innerHTML = recommendationMarkup(result);
    await window.SpringOfZenTracking?.track("intent_submitted", {
      raw_input: rawInput,
      matched_state: result.matched_state,
      recommended_session_id: result.session.id,
      recommended_product_id: result.product?.id || "",
      source: "homepage_intent_input"
    });
    await window.SpringOfZenTracking?.track("session_recommended", {
      raw_input: rawInput,
      matched_state: result.matched_state,
      recommended_session_id: result.session.id,
      recommended_product_id: result.product?.id || "",
      source: "homepage_intent_input"
    });
  });
}

async function renderFeaturedSignature() {
  const container = document.querySelector("#featuredSignature");
  if (!container) return;
  const sessions = await loadJson("assets/data/sessions.json");
  const memoryAir = sessions.find((item) => item.id === "memory_air") || sessions[0];
  container.innerHTML = `<p class="eyebrow">Consciousness Signature</p>${metricPills(memoryAir.consciousness_signature)}`;
}

async function renderLegacyHomeTracks() {
  const container = document.querySelector("#todayTracks");
  const themeContainer = document.querySelector("#dailyTheme");
  if (!container) return;
  const [tracks, daily] = await Promise.all([loadTracks(), loadDailyTheme()]);
  if (themeContainer && daily.theme) {
    themeContainer.innerHTML = `<p class="eyebrow">Latest DNA Theme</p>
      <h2>${escapeHtml(daily.theme.name || "Daily DNA")}</h2>
      <p>${escapeHtml(daily.theme.description || "")}</p>`;
  }
  container.innerHTML = tracks.slice(0, 5).map(trackCard).join("");
}

async function renderTracks() {
  const container = document.querySelector("#trackList");
  if (!container) return;
  const [tracks, daily] = await Promise.all([loadTracks(), loadDailyTheme()]);
  const intro = document.querySelector("#tracksIntro");
  if (intro && daily.theme) {
    intro.textContent = `Latest theme: ${daily.theme.name}. ${daily.theme.description}`;
  }
  const draw = (filter) => {
    const visible = filter === "all" ? tracks : tracks.filter((track) => track.dna_family === filter);
    container.innerHTML = visible.map(trackCard).join("");
  };
  draw("all");
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      draw(button.dataset.filter);
    });
  });
}

async function renderTrackDetail() {
  const container = document.querySelector("#trackDetail");
  if (!container) return;
  const tracks = await loadTracks();
  const id = new URLSearchParams(window.location.search).get("id") || tracks[0].track_id;
  const track = tracks.find((item) => item.track_id === id) || tracks[0];
  const feedbackUrl = formUrl(track);
  const feedbackBlock = feedbackUrl
    ? `<iframe class="feedback-frame" src="${feedbackUrl}" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>`
    : `<p class="muted">Feedback form is not configured yet.</p>`;
  container.innerHTML = `<section class="session-detail">
    <div class="session-media">
      <img src="${track.cover_url}" alt="${escapeHtml(track.title)} cover">
      <audio controls preload="metadata" src="${track.audio_url}" data-preview-session="${escapeHtml(track.track_id)}"></audio>
      <div class="meta-row">${archiveLinks(track)}</div>
    </div>
    <div class="session-copy">
      <p class="eyebrow">${escapeHtml(track.track_id)} / ${escapeHtml(track.dna_family)}</p>
      <h1>${escapeHtml(track.title)}</h1>
      <p class="subtitle">${escapeHtml(track.description)}</p>
      <p class="muted">${escapeHtml(track.daily_theme || "")}</p>
      <h2>Structure Parameters</h2>
      <div class="signature-panel compact">${parameterList(track.parameters)}</div>
      <div class="meta-row">${(track.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <h2>Feedback</h2>
      ${feedbackBlock}
    </div>
  </section>`;
}

async function renderSessionsList() {
  const container = document.querySelector("#sessionsList");
  if (!container) return;
  const sessions = await loadJson("assets/data/sessions.json");
  container.innerHTML = sessions.map(sessionCard).join("");
}

async function renderSessionDetail() {
  const container = document.querySelector("#sessionDetail");
  if (!container) return;
  const [sessions, products] = await Promise.all([
    loadJson("assets/data/sessions.json"),
    loadJson("assets/data/products.json")
  ]);
  const id = new URLSearchParams(window.location.search).get("id") || "memory_air";
  const session = sessions.find((item) => item.id === id) || sessions.find((item) => item.id === "memory_air") || sessions[0];
  const product = products.find((item) => item.related_session_id === session.id);
  document.title = `${session.title} — Spring of Zen`;

  container.innerHTML = `<section class="session-detail">
    <div class="session-media">
      <img src="${session.cover}" alt="${escapeHtml(session.title)} cover">
      <audio controls preload="metadata" src="${session.preview_audio}" data-preview-session="${session.id}"></audio>
      <div class="actions">
        ${productCta(product)}
        <a class="button" href="#feedback">Tell us how this made you feel</a>
      </div>
    </div>
    <div class="session-copy">
      <p class="eyebrow">${escapeHtml(session.state)}</p>
      <h1>${escapeHtml(session.title)}</h1>
      <p class="subtitle">${escapeHtml(session.description)}</p>
      <p>This session is built from five consciousness layers: ${session.layers.map(escapeHtml).join(", ")}.</p>
      <h2>Best for</h2>
      <div class="meta-row">${session.recommended_for.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
      <h2>Consciousness Signature</h2>
      <div class="signature-panel compact">${metricPills(session.consciousness_signature)}</div>
    </div>
  </section>
  <section id="feedback" class="feedback-panel">
    <div>
      <p class="eyebrow">Feedback Loop</p>
      <h2>How did this session affect you?</h2>
      <p>Your response helps build Structure to Consciousness Mapping.</p>
    </div>
    <form class="feedback-form" data-feedback-form data-session-id="${session.id}">
      <input name="user_intent" placeholder="What state were you trying to enter?">
      <label>Effect rating
        <select name="effect_rating">
          <option value="5">5 — strong effect</option>
          <option value="4">4 — clear effect</option>
          <option value="3">3 — subtle effect</option>
          <option value="2">2 — little effect</option>
          <option value="1">1 — no useful effect</option>
        </select>
      </label>
      <div class="effect-options">
        ${["calmer", "sleepy", "floating", "emotional", "focused", "no effect"].map((effect) => `<label><input type="checkbox" name="selected_effects" value="${effect}"> ${effect}</label>`).join("")}
      </div>
      <textarea name="free_text_feedback" placeholder="What changed in your body, attention, or emotion?"></textarea>
      <input name="email" type="email" placeholder="email optional">
      <button class="button primary" type="submit">Submit Feedback</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
  </section>`;

  container.querySelectorAll("[data-preview-session]").forEach((audio) => {
    audio.addEventListener("play", () => {
      window.SpringOfZenTracking?.track("preview_played", {
        session_id: audio.dataset.previewSession,
        source: "session_page"
      });
    }, { once: true });
  });
}

async function renderProductsList() {
  const container = document.querySelector("#productsList");
  if (!container) return;
  const [products, sessions] = await Promise.all([
    loadJson("assets/data/products.json"),
    loadJson("assets/data/sessions.json")
  ]);
  container.innerHTML = products.map((product) => {
    const session = sessions.find((item) => item.id === product.related_session_id);
    const href = product.etsy_url || `session.html?id=${encodeURIComponent(product.related_session_id)}`;
    return `<article id="${product.id}" class="product-card">
      <p class="eyebrow">${escapeHtml(product.platform)} / ${escapeHtml(product.price_range)}</p>
      <h2>${escapeHtml(product.title)}</h2>
      <p>${escapeHtml(product.description)}</p>
      <p class="muted">Related state: ${escapeHtml(session?.state || "Consciousness Session")}</p>
      <ul>${product.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <a class="button primary" data-product-cta="${product.id}" href="${href}">Get the Full Session Pack</a>
    </article>`;
  }).join("");
}

async function renderLab() {
  const container = document.querySelector("#dnaList");
  if (!container) return;
  const dna = await loadJson("assets/data/dna.json");
  container.innerHTML = dna.map((item) => `<article class="lab-card">
    <p class="eyebrow">${escapeHtml(item.sub_brand)} / ${escapeHtml(item.role)}</p>
    <h2>${escapeHtml(item.name)}</h2>
    <div class="mapping-list">${Object.entries(item.mapping).map(([key, value]) => `<span><strong>${escapeHtml(key)}</strong>${escapeHtml(value)}</span>`).join("")}</div>
  </article>`).join("");
}

function bindFeedbackForms() {
  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("[data-feedback-form]");
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    const payload = {
      session_id: form.dataset.sessionId,
      user_intent: data.get("user_intent") || "",
      effect_rating: Number(data.get("effect_rating") || 0),
      selected_effects: data.getAll("selected_effects"),
      free_text_feedback: data.get("free_text_feedback") || "",
      email: data.get("email") || ""
    };
    await window.SpringOfZenTracking?.saveFeedback(payload);
    form.querySelector(".form-status").textContent = "Thanks. Your response helps shape future sessions.";
    form.reset();
  });
}

function bindEmailForms() {
  document.querySelectorAll("[data-email-form]").forEach((form) => {
    form.id = form.id || "emailSignup";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      await window.SpringOfZenTracking?.saveEmail({
        email: data.get("email"),
        preferred_state: "memory_air",
        source: document.body.dataset.page || "site"
      });
      form.innerHTML = `<p class="form-status">Thanks. Your Memory Air path has been saved locally.</p>`;
    });
  });
}

function bindProductTracking() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-product-cta]");
    if (!link) return;
    window.SpringOfZenTracking?.track("product_cta_clicked", {
      product_id: link.dataset.productCta,
      href: link.href,
      source: document.body.dataset.page || "site"
    });
  });
}

async function init() {
  await Promise.allSettled([
    renderStateCards(),
    bindIntentForm(),
    renderFeaturedSignature(),
    renderLegacyHomeTracks(),
    renderTracks(),
    renderTrackDetail(),
    renderSessionsList(),
    renderSessionDetail(),
    renderProductsList(),
    renderLab()
  ]);
  bindFeedbackForms();
  bindEmailForms();
  bindProductTracking();
}

init();

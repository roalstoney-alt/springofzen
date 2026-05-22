async function loadTracks() {
  const response = await fetch("assets/data/tracks.json");
  return response.json();
}

function card(track) {
  return `<article class="track-card" data-family="${track.dna_family}">
    <img src="${track.cover_url}" alt="${track.title} cover">
    <div class="meta-row">
      <span class="tag">${track.track_id}</span>
      <span class="tag">${track.mutation_role || track.dna_family}</span>
      <span class="tag">${track.duration}</span>
    </div>
    <h3>${track.title}</h3>
    <p>${track.description}</p>
    <a class="button primary" href="track.html?id=${encodeURIComponent(track.track_id)}">Listen</a>
  </article>`;
}

async function loadDailyTheme() {
  const response = await fetch("assets/data/daily_theme.json");
  return response.json();
}

function parameterList(parameters) {
  return Object.entries(parameters)
    .map(([key, value]) => `<div class="metric"><strong>${key}</strong><br>${value}</div>`)
    .join("");
}

function formUrl(track) {
  const configured = window.CONSCIOUSNESS_AUDIO_LAB.googleFormEmbedUrl;
  if (track.feedback_form_url && !track.feedback_form_url.includes("PASTE_GOOGLE")) {
    return track.feedback_form_url;
  }
  return configured;
}

function archiveLinks(track) {
  const links = [`<a class="tag" href="${track.audio_url}">MP3 playback</a>`];
  if (track.wav_url) {
    links.push(`<a class="tag" href="${track.wav_url}">WAV archive</a>`);
  }
  if (track.midi_url) {
    links.push(`<a class="tag" href="${track.midi_url}">MIDI archive</a>`);
  }
  return links.join("");
}

async function renderHome() {
  const container = document.querySelector("#todayTracks");
  const themeContainer = document.querySelector("#dailyTheme");
  if (!container) return;
  const tracks = await loadTracks();
  const daily = await loadDailyTheme();
  if (themeContainer && daily.theme) {
    themeContainer.innerHTML = `<p class="eyebrow">Today's DNA Theme</p>
      <h2>${daily.theme.name || "Daily DNA"}</h2>
      <p>${daily.theme.description || ""}</p>`;
  }
  container.innerHTML = tracks.slice(0, 5).map(card).join("");
}

async function renderTracks() {
  const container = document.querySelector("#trackList");
  if (!container) return;
  const tracks = await loadTracks();
  const daily = await loadDailyTheme();
  const intro = document.querySelector("#tracksIntro");
  if (intro && daily.theme) {
    intro.textContent = `Today's theme: ${daily.theme.name}. ${daily.theme.description}`;
  }
  const draw = (filter) => {
    const visible = filter === "all" ? tracks : tracks.filter((track) => track.dna_family === filter);
    container.innerHTML = visible.map(card).join("");
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
  const feedbackBlock = feedbackUrl.includes("PASTE_GOOGLE")
    ? `<div class="detail-panel">
        <h2>Give feedback</h2>
        <p class="muted">Paste your Google Form embed URL in <code>assets/js/tracks.js</code>, then this area will show the feedback form.</p>
        <p class="muted">Track ID for manual form entry: <strong>${track.track_id}</strong></p>
      </div>`
    : `<iframe class="feedback-frame" src="${feedbackUrl}" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
  container.innerHTML = `<section class="detail-layout">
    <div class="detail-panel">
      <img src="${track.cover_url}" alt="${track.title} cover">
      <audio controls preload="metadata" src="${track.audio_url}"></audio>
      <div class="meta-row">
        ${archiveLinks(track)}
      </div>
      <div class="meta-row">
        ${track.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
    <div class="detail-panel">
      <p class="eyebrow">${track.track_id} / ${track.dna_family}</p>
      <h1>${track.title}</h1>
      <p class="subtitle">${track.description}</p>
      <div class="theme-note">
        <strong>Today's theme</strong><br>${track.daily_theme}<br><br>
        <strong>Mutation role</strong><br>${track.mutation_role}
      </div>
      <h2>Structure Parameters</h2>
      <div class="params">${parameterList(track.parameters)}</div>
      <p class="muted">After listening, please give 5 simple ratings. Your feedback helps mutate the next generation of music DNA.</p>
      ${feedbackBlock}
    </div>
  </section>`;
}

renderHome();
renderTracks();
renderTrackDetail();

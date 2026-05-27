(function () {
  const state = {
    schedule: [],
    playlists: {},
    slot: null,
    playlist: [],
    trackIndex: 0,
    audio: null,
    initialized: false
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function rootPath(path) {
    return document.body.dataset.page === "night-harbor" ? `../${path}` : path;
  }

  async function loadNightHarborData() {
    const [scheduleResponse, playlistResponse] = await Promise.all([
      fetch(rootPath("data/night-harbor-schedule.json")),
      fetch(rootPath("data/night-harbor-playlists.json"))
    ]);
    if (!scheduleResponse.ok) throw new Error("Unable to load Night Harbor schedule");
    if (!playlistResponse.ok) throw new Error("Unable to load Night Harbor playlists");
    state.schedule = await scheduleResponse.json();
    state.playlists = await playlistResponse.json();
    return { schedule: state.schedule, playlists: state.playlists };
  }

  function parseTimeToMinutes(timeString) {
    const [hours, minutes] = String(timeString || "00:00").split(":").map(Number);
    return (hours * 60) + minutes;
  }

  function getCurrentTimeMinutes() {
    const override = new URLSearchParams(window.location.search).get("nh_time");
    if (override) return parseTimeToMinutes(override);
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
  }

  function isNowInWindow(start, end) {
    const now = getCurrentTimeMinutes();
    const startMinutes = parseTimeToMinutes(start);
    const endMinutes = parseTimeToMinutes(end);
    if (startMinutes <= endMinutes) {
      return now >= startMinutes && now <= endMinutes;
    }
    return now >= startMinutes || now <= endMinutes;
  }

  function getCurrentLiveSlot(schedule) {
    return schedule.find((slot) => isNowInWindow(slot.start, slot.end)) || null;
  }

  function setRootState(name) {
    const root = $("#night-harbor-root");
    if (!root) return;
    root.classList.toggle("is-quiet", name === "quiet");
    root.classList.toggle("is-live", name === "live");
    root.classList.toggle("is-playing", name === "playing");
    document.body.classList.toggle("night-audio-playing", name === "playing");
  }

  function setButtonText(text) {
    $$("#listen-button, #hero-listen-button, [data-audio-action='play']").forEach((button) => {
      button.textContent = text;
    });
  }

  function setQuietState() {
    state.slot = null;
    loadPlaylist("quiet-playlist");
    setRootState("quiet");
    $("#live-badge") && ($("#live-badge").textContent = "Quiet");
    $("#live-title") && ($("#live-title").textContent = "Night Harbor");
    $("#live-status") && ($("#live-status").textContent = "The light is still on. Stay for a while.");
    $(".player-prompt") && ($(".player-prompt").textContent = "The harbor is quiet. Click when you are ready to listen.");
    setButtonText("Play Ambient Session");
    updateScheduleUI(null);
    updatePlayerUI(state.playlist[0]);
  }

  function setLiveState(slot) {
    state.slot = slot;
    loadPlaylist(slot.playlistId);
    setRootState("live");
    $("#live-badge") && ($("#live-badge").textContent = "LIVE NOW");
    $("#live-title") && ($("#live-title").textContent = slot.title);
    $("#live-status") && ($("#live-status").textContent = `${slot.statusText} ${slot.cta}.`);
    $(".player-prompt") && ($(".player-prompt").textContent = `${slot.title} is on air. ${slot.cta}.`);
    setButtonText(slot.cta || "Click to Listen");
    updateScheduleUI(slot);
    updatePlayerUI(state.playlist[0]);
  }

  function loadPlaylist(playlistId) {
    state.playlist = state.playlists[playlistId] || state.playlists["quiet-playlist"] || [];
    state.trackIndex = 0;
    return state.playlist;
  }

  async function startPlayback() {
    if (!state.audio || state.playlist.length === 0) return;
    const track = state.playlist[state.trackIndex];
    if (state.audio.src !== new URL(track.src, window.location.href).href) {
      state.audio.src = track.src;
    }
    try {
      await state.audio.play();
      setPlayingState();
      await window.SpringOfZenTracking?.track("night_harbor_audio_played", {
        source: "night_harbor_live",
        slot_id: state.slot?.id || "quiet",
        track_title: track.title
      });
    } catch (error) {
      showAudioBlockedMessage();
    }
  }

  function setPlayingState() {
    const track = state.playlist[state.trackIndex];
    setRootState("playing");
    $("#live-badge") && ($("#live-badge").textContent = state.slot ? "LIVE NOW" : "PLAYING");
    $(".player-prompt") && ($(".player-prompt").textContent = "Now Playing");
    setButtonText("Playing");
    updatePlayerUI(track);
  }

  function pausePlayback() {
    if (!state.audio) return;
    state.audio.pause();
    state.slot ? setLiveState(state.slot) : setQuietState();
  }

  function stopPlayback() {
    if (!state.audio) return;
    state.audio.pause();
    state.audio.currentTime = 0;
    state.slot ? setLiveState(state.slot) : setQuietState();
  }

  function playNextTrack() {
    if (!state.playlist.length) return;
    state.trackIndex = (state.trackIndex + 1) % state.playlist.length;
    const track = state.playlist[state.trackIndex];
    state.audio.src = track.src;
    updatePlayerUI(track);
    startPlayback();
  }

  function updatePlayerUI(track) {
    if (!track) return;
    $("#track-title") && ($("#track-title").textContent = track.title);
    $("#track-artist") && ($("#track-artist").textContent = track.artist);
    const cover = $("#track-cover");
    if (cover) {
      cover.src = track.cover || "";
      cover.alt = track.cover ? `${track.title} cover` : "";
    }
    const miniTitle = $(".bottom-radio strong");
    const miniStatus = $(".bottom-radio span");
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniStatus) miniStatus.textContent = state.slot ? `${state.slot.title} / Live from Night Harbor` : "Ambient session / Night Harbor";
  }

  function showAudioBlockedMessage() {
    $(".player-prompt") && ($(".player-prompt").textContent = "Tap again to enable sound.");
    setButtonText("Tap Again");
  }

  function updateProgress() {
    if (!state.audio) return;
    const current = state.audio.currentTime || 0;
    const duration = Number.isFinite(state.audio.duration) ? state.audio.duration : 0;
    $$("[data-audio-current]").forEach((label) => { label.textContent = window.formatTime ? window.formatTime(current) : formatFallback(current); });
    $$("[data-audio-duration]").forEach((label) => { label.textContent = window.formatTime ? window.formatTime(duration) : formatFallback(duration); });
    if (duration > 0) {
      $$("[data-audio-progress]").forEach((input) => { input.value = String((current / duration) * 100); });
    }
  }

  function formatFallback(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const rounded = Math.floor(seconds);
    return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`;
  }

  function updateScheduleUI(activeSlot) {
    $$(".schedule-list span").forEach((item) => {
      const time = item.querySelector("strong")?.textContent || "";
      const slot = state.schedule.find((entry) => entry.start === time);
      item.classList.toggle("active-live-slot", Boolean(activeSlot && slot?.id === activeSlot.id));
    });
    $$("[data-live-window-badge]").forEach((badge) => {
      badge.classList.toggle("on-air-glow", Boolean(activeSlot));
      badge.textContent = activeSlot ? "Live Now" : "Next Broadcast";
    });
  }

  function bindControls() {
    $$("#listen-button, #hero-listen-button, [data-audio-action='play']").forEach((button) => {
      button.addEventListener("click", startPlayback);
    });
    $$("#pause-button, [data-audio-action='pause']").forEach((button) => {
      button.addEventListener("click", pausePlayback);
    });
    $$("#stop-button, [data-audio-action='stop']").forEach((button) => {
      button.addEventListener("click", stopPlayback);
    });
    $$("#next-button, [data-audio-action='next'], [data-audio-action='previous']").forEach((button) => {
      button.addEventListener("click", playNextTrack);
    });
    $$("[data-audio-volume]").forEach((input) => {
      input.addEventListener("input", () => {
        const volume = Number(input.value);
        if (state.audio) state.audio.volume = volume;
        $$("[data-audio-volume]").forEach((other) => { if (other !== input) other.value = input.value; });
      });
    });
    $$("[data-audio-progress]").forEach((input) => {
      input.addEventListener("input", () => {
        if (!state.audio || !Number.isFinite(state.audio.duration)) return;
        state.audio.currentTime = (Number(input.value) / 100) * state.audio.duration;
      });
    });
  }

  function refresh() {
    const slot = getCurrentLiveSlot(state.schedule);
    slot ? setLiveState(slot) : setQuietState();
  }

  async function init() {
    if (state.initialized || document.body.dataset.page !== "night-harbor") return;
    state.initialized = true;
    state.audio = $("#night-harbor-audio");
    if (!state.audio) return;
    state.audio.volume = Number($("[data-audio-volume]")?.value || 0.25);
    state.audio.addEventListener("ended", playNextTrack);
    state.audio.addEventListener("timeupdate", updateProgress);
    state.audio.addEventListener("loadedmetadata", updateProgress);
    bindControls();
    await loadNightHarborData();
    refresh();
    window.setInterval(refresh, 30000);
  }

  window.NightHarborLive = {
    loadNightHarborData,
    getCurrentTimeMinutes,
    parseTimeToMinutes,
    isNowInWindow,
    getCurrentLiveSlot,
    setQuietState,
    setLiveState,
    loadPlaylist,
    startPlayback,
    pausePlayback,
    stopPlayback,
    playNextTrack,
    updatePlayerUI,
    refresh
  };

  init().catch(() => {
    $(".player-prompt") && ($(".player-prompt").textContent = "The room is quiet. Tap play to let the music in.");
  });
}());

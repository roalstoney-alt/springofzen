(function () {
  const STORAGE_KEY = "spring_of_zen_events";
  const EMAIL_KEY = "spring_of_zen_email_subscribers";
  const FEEDBACK_KEY = "spring_of_zen_feedback";
  const memoryStore = {};

  function storageAvailable() {
    return typeof window.localStorage !== "undefined";
  }

  function read(key) {
    if (!storageAvailable()) return memoryStore[key] || [];
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function write(key, value) {
    memoryStore[key] = value;
    if (!storageAvailable()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("[Spring of Zen localStorage fallback]", error);
    }
  }

  async function sendToSupabase(table, payload) {
    if (!window.SpringOfZenSupabase || !window.SpringOfZenSupabase.insert) return false;
    return window.SpringOfZenSupabase.insert(table, payload);
  }

  async function track(event, payload = {}) {
    const entry = {
      event,
      ...payload,
      timestamp: new Date().toISOString()
    };
    const events = read(STORAGE_KEY);
    events.push(entry);
    write(STORAGE_KEY, events.slice(-250));
    console.info("[Spring of Zen tracking]", entry);
    const table = event === "feedback_submitted"
      ? "session_feedback"
      : event === "email_signup"
        ? "email_subscribers"
        : "user_intents";
    await sendToSupabase(table, entry);
    return entry;
  }

  function saveFeedback(payload) {
    const items = read(FEEDBACK_KEY);
    items.push({ ...payload, timestamp: new Date().toISOString() });
    write(FEEDBACK_KEY, items.slice(-100));
    return track("feedback_submitted", payload);
  }

  function saveEmail(payload) {
    const items = read(EMAIL_KEY);
    items.push({ ...payload, timestamp: new Date().toISOString() });
    write(EMAIL_KEY, items.slice(-100));
    return track("email_signup", payload);
  }

  window.SpringOfZenTracking = {
    track,
    saveFeedback,
    saveEmail,
    readEvents: () => read(STORAGE_KEY)
  };
})();

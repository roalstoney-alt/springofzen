(() => {
  "use strict";

  const STORE_KEY = "mynest_acquisition_v011";
  const sourceMap = { meta: "meta", facebook: "meta", instagram: "meta", google: "google", chatgpt: "chatgpt", reddit: "reddit", mynest: "mynest" };
  const mediumMap = { paid_social: "paid_social", cpc: "cpc", paid_search: "cpc", paid_assistant: "paid_assistant", organic: "organic", referral: "referral" };

  function key(value) {
    if (!value) return null;
    const normalized = value.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
    return normalized || null;
  }

  function direct() {
    return { acquisition_source: "direct", acquisition_medium: "direct", campaign_key: null, content_key: null };
  }

  function readStored() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch {
      return null;
    }
  }

  function capture() {
    const params = new URLSearchParams(window.location.search);
    const rawSource = (params.get("utm_source") || "").toLowerCase();
    const rawMedium = (params.get("utm_medium") || "").toLowerCase();
    if (!rawSource && !rawMedium && !params.has("utm_campaign") && !params.has("utm_content")) return readStored() || direct();
    const value = {
      acquisition_source: rawSource ? (sourceMap[rawSource] || "other") : "other",
      acquisition_medium: rawMedium ? (mediumMap[rawMedium] || "other") : "other",
      campaign_key: key(params.get("utm_campaign")),
      content_key: key(params.get("utm_content"))
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); } catch { /* storage may be unavailable */ }
    return value;
  }

  const attribution = Object.freeze(capture());
  window.MyNestAcquisition = Object.freeze({ get: () => attribution });
})();

(function () {
  const config = window.SPRING_OF_ZEN_SUPABASE || {
    url: "",
    anonKey: ""
  };

  async function insert(table, payload) {
    if (!config.url || !config.anonKey) return false;
    try {
      const response = await fetch(`${config.url}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (error) {
      console.warn("[Spring of Zen Supabase fallback]", error);
      return false;
    }
  }

  window.SpringOfZenSupabase = { insert };
})();

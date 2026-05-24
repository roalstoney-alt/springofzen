(function () {
  const stateCards = [
    {
      state: "Deep Sleep",
      session: "Lotus Sleep",
      session_id: "lotus_sleep",
      product_id: "lotus_sleep_pack",
      intent_tags: ["sleep", "tired", "calm", "nervous system"],
      description: "Slow, safe, low-tension sound environment for falling asleep."
    },
    {
      state: "Floating Reflection",
      session: "Memory Air",
      session_id: "memory_air",
      product_id: "memory_air_pack",
      intent_tags: ["lonely", "reflection", "memory", "night"],
      description: "Soft memory atmosphere for late-night reflection and emotional floating."
    },
    {
      state: "Sacred Stillness",
      session: "Sacred Water",
      session_id: "sacred_water",
      product_id: "sacred_water_pack",
      intent_tags: ["meditation", "stillness", "sacred"],
      description: "Human voice air, water blur, and spacious stillness."
    },
    {
      state: "Emotional Reset",
      session: "Night Water",
      session_id: "night_water",
      product_id: "night_water_pack",
      intent_tags: ["overthinking", "reset", "stress", "anxious"],
      description: "Quiet water-like atmosphere for emotional cooling."
    },
    {
      state: "Calm Focus",
      session: "Underwater Pulse",
      session_id: "underwater_pulse",
      product_id: "underwater_pulse_pack",
      intent_tags: ["focus", "work", "write", "study"],
      description: "Low distraction pulse and soft atmosphere for steady attention."
    }
  ];

  async function getJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  }

  function normalize(input) {
    return input.trim().toLowerCase();
  }

  async function recommend(rawInput) {
    const [rules, sessions, products] = await Promise.all([
      getJson("assets/data/recommendation_rules.json"),
      getJson("assets/data/sessions.json"),
      getJson("assets/data/products.json")
    ]);
    const input = normalize(rawInput);
    let matchKey = "memory_air";
    let matchedKeyword = "";
    let bestScore = 0;

    Object.entries(rules).forEach(([key, rule]) => {
      const matches = rule.keywords.filter((item) => input.includes(item));
      if (!matches.length) return;
      const score = matches.reduce((total, item) => total + item.length, 0) + matches.length * 8;
      if (score > bestScore) {
        bestScore = score;
        matchKey = key;
        matchedKeyword = matches[0];
      }
    });

    const rule = rules[matchKey];
    const session = sessions.find((item) => item.id === rule.session_id) || sessions.find((item) => item.id === "memory_air");
    const product = products.find((item) => item.id === rule.product_id);
    const unmatched = !matchedKeyword && input.length > 0;
    return {
      raw_input: rawInput,
      matched_state: matchKey,
      matched_keyword: matchedKeyword,
      unmatched,
      reason: unmatched ? "No exact keyword matched, so Memory Air is used as the default floating reflection path." : rule.reason,
      session,
      product
    };
  }

  window.SpringOfZenRecommender = {
    stateCards,
    recommend
  };
})();

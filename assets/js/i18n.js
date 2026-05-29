(function () {
  const STORAGE_KEY = "spring_of_zen_language";
  const zh = {
    "Today": "今日",
    "Night Harbor": "夜港",
    "Human Harbor": "人類港灣",
    "A Human Harbor for the Agent Era": "智能代理時代的人類港灣",
    "Where should human attention go?": "人類的注意力應該流向哪裡？",
    "SpringOfZen is a quiet operating base for pause, recovery, reflection, creation, and state navigation in a world increasingly optimized by machines.": "SpringOfZen 是一個安靜的基地，在越來越被機器優化的世界裡，幫助人暫停、恢復、反思、創造，並導航自己的狀態。",
    "Enter Today's Harbor": "進入今日港灣",
    "Open Night Harbor": "打開夜港",
    "Read the Manifesto": "閱讀宣言",
    "Daily Harbor": "每日港灣",
    "One return point, every day.": "每天，一個可以回來的地方。",
    "The heart of SpringOfZen is a daily Harbor page: one observation, one reflection prompt, one state session, and one simple question that helps the system learn what actually restores people.": "SpringOfZen 的核心是一個每日港灣頁：一則觀察、一個反思提示、一個狀態場景，以及一個簡單問題，幫助系統學習什麼真正能讓人恢復。",
    "Today's State": "今日狀態",
    "Clear Water Attention": "清水般的注意力",
    "For people who feel mentally crowded and need a soft place to put their attention back down.": "給那些心智擁擠、需要一個柔軟地方重新放下注意力的人。",
    "Begin": "開始",
    "State Navigation": "狀態導航",
    "Start from the human state, not the content format.": "從人的狀態開始，而不是從內容格式開始。",
    "Pause": "暫停",
    "Create a small interruption in the feed, the rush, and the automatic reaction.": "在資訊流、匆忙和自動反應中，創造一個小小的中斷。",
    "Recover": "恢復",
    "Offer sessions and rituals that help tired attention become usable again.": "提供場景與儀式，幫助疲憊的注意力重新變得可用。",
    "Reflect": "反思",
    "Turn daily observations into questions people can actually carry into their lives.": "把每日觀察變成人們真正能帶進生活裡的問題。",
    "Create": "創造",
    "Use AI agents as collaborators while protecting the human center of meaning.": "把 AI 代理作為協作者，同時守住意義的人類中心。",
    "A nightly room for return.": "一個夜晚可以回來的房間。",
    "Night Harbor remains the after-dark ritual: music, reflection, anonymous letters, and soft emotional reset. It becomes the first recurring Harbor experience inside the larger SpringOfZen system.": "夜港仍然是入夜後的儀式：音樂、反思、匿名信，以及柔和的情緒重置。它成為 SpringOfZen 系統中第一個可反覆回來的港灣體驗。",
    "Enter Night Harbor": "進入夜港",
    "Browse Sessions": "瀏覽場景",
    "Research Engine": "研究引擎",
    "Human State Lab": "人類狀態實驗室",
    "The former Consciousness Audio Lab becomes the research engine for SpringOfZen. It studies attention, recovery, emotional regulation, state change, and human-agent collaboration.": "原本的 Consciousness Audio Lab 成為 SpringOfZen 的研究引擎，研究注意力、恢復、情緒調節、狀態改變與人類-代理協作。",
    "Open the lab": "打開實驗室",
    "Session Pathway": "場景路徑",
    "Audio remains a doorway.": "聲音仍然是一道入口。",
    "Memory Air and other listening sessions stay inside the project as state navigation tools: creative listening environments for sleep, reflection, sacred stillness, and emotional reset.": "Memory Air 與其他聆聽場景會留在專案中，作為狀態導航工具：為睡眠、反思、神聖靜定與情緒重置而設計的創造性聆聽環境。",
    "Explore sessions": "探索場景",
    "First 100 Returning People": "最初 100 位反覆回來的人",
    "We are looking for people who come back, not people who scroll past.": "我們尋找的是會回來的人，而不是滑過去的人。",
    "Join the Harbor": "加入港灣",
    "Today's Harbor · May 29, 2026": "今日港灣 · 2026 年 5 月 29 日",
    "Before asking what you should do, ask what state you are in.": "在問自己該做什麼之前，先問自己處於什麼狀態。",
    "The Agent Era returns time to humans, but returned time can still become noise. Today's Harbor is a small place to notice your state before the world assigns you one.": "智能代理時代把時間還給人類，但被歸還的時間仍可能變成噪音。今日港灣是一個小地方，讓你在世界替你命名之前，先看見自己的狀態。",
    "Observation": "觀察",
    "Abundance does not automatically create direction.": "豐富不會自動帶來方向。",
    "When tools become faster, the human nervous system does not automatically become clearer. A person can receive more options, more answers, more generated plans, and still feel strangely lost.": "當工具變得更快，人類的神經系統不會自動變得更清晰。一個人可以得到更多選項、更多答案、更多生成出來的計畫，卻仍然奇怪地感到迷失。",
    "This is why the first practice of SpringOfZen is not productivity. It is state recognition. Before we ask agents to help us move, we ask what kind of human is about to move.": "這就是為什麼 SpringOfZen 的第一個練習不是生產力，而是狀態辨認。在請代理幫助我們行動之前，我們先問：即將行動的是一個什麼狀態的人？",
    "Today, pause long enough to name the weather inside your attention. Crowded, tender, numb, bright, restless, open, tired, ready. The name is not a diagnosis. It is a doorway.": "今天，停留久一點，為你注意力裡的天氣命名。擁擠、柔軟、麻木、明亮、躁動、開放、疲憊、準備好了。這個名字不是診斷，而是一道入口。",
    "Harbor Session": "港灣場景",
    "Theme": "主題",
    "Agent Era": "智能代理時代",
    "State": "狀態",
    "Mental crowding to quiet direction": "從心智擁擠到安靜方向",
    "Length": "時長",
    "8-12 minutes": "8-12 分鐘",
    "Soft water room, sparse bell distance, slow breath-space, and one spoken question: what deserves your attention now?": "柔和水室、稀疏遠鈴、緩慢呼吸空間，以及一個被說出的問題：此刻什麼值得你的注意力？",
    "Choose a Session": "選擇一個場景",
    "Reflection Prompt": "反思提示",
    "What state are you bringing into the next hour?": "你正把什麼狀態帶進下一個小時？",
    "Write one honest sentence. No performance required.": "寫下一句誠實的話。不需要表現。",
    "Hold This Reflection": "保存這次反思",
    "Poster Prompt": "海報提示",
    "Minimal atmospheric harbor at dawn, still water, one warm window, human-scale silence, SpringOfZen branding, 1080x1350.": "極簡氛圍的黎明港灣、靜止水面、一扇溫暖窗戶、人的尺度的安靜、SpringOfZen 品牌，1080x1350。",
    "Short Video Script": "短影片腳本",
    "Question: What state are you in before you ask AI for help? Tension: more answers can still leave you lost. Observation: direction begins with state recognition. CTA: enter Today's Harbor.": "問題：在請 AI 幫忙之前，你處於什麼狀態？張力：更多答案仍可能讓你迷失。觀察：方向始於狀態辨認。CTA：進入今日港灣。",
    "Feedback Question": "回饋問題",
    "After today's pause, do you feel more clear, more rested, more connected, or unchanged?": "經過今天的暫停後，你感到更清晰、更休息、更連結，還是沒有改變？",
    "Sessions": "意識場景",
    "Products": "產品",
    "Lab": "實驗室",
    "About": "關於",
    "Archive": "檔案庫",
    "Consciousness Session Portal": "意識場景入口",
    "What state do you want to enter tonight?": "今晚，你想進入哪一種內在狀態？",
    "Consciousness Sessions for sleep, floating memory, sacred stillness, and emotional reset.": "為睡眠、漂浮記憶、神聖靜定與情緒重置而設計的意識聲音場景。",
    "Find My Session": "尋找我的場景",
    "Explore Memory Air": "探索 Memory Air",
    "Choose an inner state": "選擇一種內在狀態",
    "Start from how you want to feel.": "從你想進入的感受開始。",
    "Deep Sleep": "深度睡眠",
    "Lotus Sleep": "蓮花睡眠",
    "Slow, safe, low-tension sound environment for falling asleep.": "緩慢、安全、低張力的聲音環境，為入睡而設計。",
    "Floating Reflection": "漂浮反思",
    "Memory Air": "記憶之氣",
    "Soft memory atmosphere for late-night reflection and emotional floating.": "適合深夜反思與情緒漂浮的柔和記憶氛圍。",
    "Sacred Stillness": "神聖靜定",
    "Sacred Water": "神聖之水",
    "Human voice air, water blur, and spacious stillness.": "人聲空氣、水面模糊與寬闊靜定。",
    "Emotional Reset": "情緒重置",
    "Night Water": "夜水",
    "Quiet water-like atmosphere for emotional cooling.": "如夜水般安靜的氛圍，用於情緒降溫。",
    "Calm Focus": "安定專注",
    "Underwater Pulse": "水下脈衝",
    "Low distraction pulse and soft atmosphere for steady attention.": "低干擾脈衝與柔和空氣感，支撐穩定注意力。",
    "Intent input": "意圖輸入",
    "Describe how you feel, or what state you want to enter.": "描述你的感受，或你想進入的狀態。",
    "Recommend a Session": "推薦一個場景",
    "Recommended": "推薦",
    "Free Preview": "免費試聽",
    "Full Session Pack": "完整場景包",
    "Join Email List": "加入電子郵件列表",
    "Featured Session": "精選場景",
    "Memory Air Session": "記憶之氣場景",
    "Lotus Sleep Session": "蓮花睡眠場景",
    "Sacred Water Session": "神聖之水場景",
    "Night Water Session": "夜水場景",
    "Underwater Pulse Session": "水下脈衝場景",
    "A quiet consciousness environment for floating memory and safe loneliness.": "為漂浮記憶與安全孤獨感而設計的安靜意識環境。",
    "Human voice air, water blur, and spacious stillness for meditation-like presence.": "以人聲空氣、水面模糊與寬闊靜定，支撐近似冥想的臨在感。",
    "Quiet water-like atmosphere for emotional cooling and overthinking reset.": "如安靜夜水般的氛圍，用於情緒降溫與過度思考重置。",
    "Low distraction pulse and soft atmosphere for steady attention.": "低干擾脈衝與柔和氛圍，用於穩定注意力。",
    "Soft human voice air, water blur, distant lotus bells, and low-tension emotional drift for floating memory and safe night reflection.": "柔和人聲空氣、水面模糊、遠方蓮鈴與低張力情緒漂移，為漂浮記憶與安全的夜間反思而設計。",
    "Open Session": "打開場景",
    "Consciousness Signature": "意識特徵",
    "Why This Exists": "它為何存在",
    "Sound as state entry.": "聲音作為狀態入口。",
    "Spring of Zen creates consciousness sessions: sound environments designed for sleep, reflection, sacred stillness, emotional reset, and floating memory.": "Spring of Zen 創造意識場景：為睡眠、反思、神聖靜定、情緒重置與漂浮記憶而設計的聲音環境。",
    "We do not publish music as content volume. We study how layers of sound help people enter different inner states.": "我們不以大量發布音樂為目標。我們研究聲音層次如何幫助人進入不同的內在狀態。",
    "A language for floating memory.": "一種漂浮記憶的語言。",
    "Memory Air is our first premium session line: soft human voice air, water blur, distant lotus bells, and low-tension emotional drift.": "Memory Air 是我們第一條高級場景產品線：柔和人聲空氣、水面模糊、遠方蓮鈴與低張力情緒漂移。",
    "It is built for night reflection, safe loneliness, journaling, and emotional floating.": "它為夜間反思、安全的孤獨感、書寫與情緒漂浮而設計。",
    "Join the Memory Air Sessions": "加入 Memory Air 場景",
    "Receive new consciousness environments and listening notes.": "接收新的意識聲音環境與聆聽筆記。",
    "Join": "加入",
    "Choose by state, not by genre.": "按狀態選擇，而不是按曲風。",
    "Each session is designed around a target inner state and a measurable consciousness signature.": "每個場景都圍繞一個目標內在狀態與可觀察的意識特徵而設計。",
    "Enter Session": "進入場景",
    "Downloadable environments for repeat listening.": "可下載、可重複聆聽的聲音環境。",
    "Each pack is prepared as a human-arranged final asset, not raw AI output.": "每個產品包都會經過人類編排與整理，不直接發布原始 AI 輸出。",
    "Get the Full Session Pack": "取得完整場景包",
    "Lotus Sleep Pack": "蓮花睡眠包",
    "Memory Air Pack": "記憶之氣包",
    "Sacred Water Pack": "神聖之水包",
    "Night Water Pack": "夜水包",
    "Underwater Pulse Pack": "水下脈衝包",
    "A downloadable consciousness session pack for sleep, low tension, and bedtime safety.": "可下載的意識場景包，適合睡眠、低張力與睡前安全感。",
    "A downloadable consciousness session pack for floating memory and night reflection.": "可下載的意識場景包，適合漂浮記憶與夜間反思。",
    "A spacious session pack for sacred stillness, human voice air, and water-like quiet.": "寬闊的場景包，適合神聖靜定、人聲空氣與水般安靜。",
    "A cooling sound environment for overthinking, stress, and emotional reset.": "用於過度思考、壓力與情緒重置的冷卻型聲音環境。",
    "A steady attention pack with low-distraction pulse and soft ambient focus.": "以低干擾脈衝與柔和氛圍支撐穩定注意力的場景包。",
    "MP3 version": "MP3 版本",
    "WAV version": "WAV 版本",
    "Loop version": "循環版本",
    "Session artwork": "場景封面圖",
    "Listening guide": "聆聽指南",
    "DNA description": "DNA 描述",
    "Related state:": "相關狀態：",
    "Structure to consciousness mapping.": "聲音結構到意識狀態的映射。",
    "The lab studies how sound layers, breath-space, voice air, bell distance, and pulse density shape reported inner states.": "實驗室研究聲音層次、呼吸空間、人聲空氣、鈴聲距離與脈衝密度如何影響使用者回報的內在狀態。",
    "Research Direction": "研究方向",
    "Publishing Rule": "發布規則",
    "Spring of Zen is a gateway into inner states.": "Spring of Zen 是進入內在狀態的入口。",
    "Spring of Zen creates consciousness sessions: sound environments designed for sleep, reflection, sacred stillness, emotional reset, and floating memory.": "Spring of Zen 創造意識場景：為睡眠、反思、神聖靜定、情緒重置與漂浮記憶而設計的聲音環境。",
    "Memory Air is our first premium session line, built around safe loneliness, floating memory, human voice air, water blur, distant bells, and low-tension drift.": "Memory Air 是我們第一條高級場景產品線，圍繞安全的孤獨、漂浮記憶、人聲空氣、水面模糊、遠方鈴聲與低張力漂移而建立。",
    "Consciousness Audio Lab is the internal research system that studies Structure to Consciousness Mapping. It guides which sessions become products and which DNA families continue mutating.": "Consciousness Audio Lab 是內部研究系統，用來研究「結構到意識」的映射。它幫助判斷哪些場景值得產品化，哪些 DNA 家族應繼續突變。",
    "We do not make medical claims. These sessions are creative listening environments, not treatment or diagnosis.": "我們不做醫療宣稱。這些場景是創造性的聆聽環境，不是治療或診斷。",
    "Published Tracks": "已發布曲目",
    "Filter the legacy DNA catalog and enter individual feedback pages.": "篩選既有 DNA 檔案庫，並進入單曲回饋頁。",
    "Listen": "聆聽",
    "Structure Parameters": "結構參數",
    "Feedback": "回饋",
    "How did this session affect you?": "這個場景如何影響了你？",
    "Feedback Loop": "回饋循環",
    "Your response helps build Structure to Consciousness Mapping.": "你的回應會幫助建立「聲音結構 → 意識狀態」的映射。",
    "Tell us how this made you feel": "告訴我們它讓你有什麼感受",
    "Best for": "適合",
    "falling asleep": "入睡",
    "tired nervous system": "疲憊的神經系統",
    "bedtime decompression": "睡前減壓",
    "low-tension looping": "低張力循環聆聽",
    "late night reflection": "深夜反思",
    "soft loneliness": "柔和孤獨感",
    "journaling": "書寫",
    "emotional floating": "情緒漂浮",
    "meditation": "冥想",
    "sacred stillness": "神聖靜定",
    "quiet prayer": "安靜祈禱",
    "slow breathing": "慢呼吸",
    "overthinking at night": "夜間過度思考",
    "stress cooldown": "壓力降溫",
    "sad heaviness": "悲傷沉重",
    "emotional reset": "情緒重置",
    "writing": "寫作",
    "study": "學習",
    "deep work": "深度工作",
    "calm focus": "安定專注",
    "memory_fragments": "記憶碎片",
    "human_air": "人聲空氣",
    "water_blur": "水面模糊",
    "underwater_pulse": "水下脈衝",
    "consciousness_drift": "意識漂移",
    "warm_low_air": "溫暖低頻空氣",
    "slow_breath_pad": "慢呼吸 Pad",
    "soft_bass_floor": "柔和低音地面",
    "distant_lotus_bells": "遠方蓮鈴",
    "sleep_drift": "睡眠漂移",
    "voice_air": "人聲空氣",
    "temple_water": "寺院之水",
    "slow_xiao": "慢簫聲",
    "low_drone": "低頻 Drone",
    "distant_light": "遠方光感",
    "cool_water_pad": "冷水 Pad",
    "soft_rain_pluck": "柔雨撥弦",
    "low_body_floor": "低頻身體地面",
    "slow_air": "慢空氣",
    "release_tail": "釋放尾音",
    "low_pulse": "低脈衝",
    "soft_focus_air": "柔和專注空氣",
    "minimal_bell_marker": "極簡鈴聲標記",
    "stable_floor": "穩定地面",
    "attention_drift": "注意力漂移",
    "calmer": "更平靜",
    "sleepy": "想睡",
    "floating": "漂浮",
    "emotional": "情緒被觸動",
    "focused": "更專注",
    "no effect": "沒有感覺",
    "This session is built from five consciousness layers:": "這個場景由五層意識聲音結構組成：",
    "Effect rating": "效果評分",
    "5 — strong effect": "5 — 效果很強",
    "4 — clear effect": "4 — 效果清楚",
    "3 — subtle effect": "3 — 效果細微",
    "2 — little effect": "2 — 效果很少",
    "1 — no useful effect": "1 — 沒有明顯效果",
    "Submit Feedback": "提交回饋",
    "Thanks. Your response helps shape future sessions.": "謝謝。你的回應會幫助塑造未來的場景。",
    "Thanks. Your Memory Air path has been saved locally.": "謝謝。你的 Memory Air 路徑已保存在本機。",
    "You can also choose one of the state cards above to make the intent more specific.": "你也可以選擇上方的狀態卡，讓意圖更明確。",
    "No exact keyword matched, so Memory Air is used as the default floating reflection path.": "沒有找到精確關鍵詞，因此預設推薦 Memory Air 作為漂浮反思路徑。",
    "You described a tired or sleep-seeking state. Lotus Sleep is designed for low tension, soft safety, and nervous-system downshift.": "你描述的是疲憊或想入睡的狀態。蓮花睡眠為低張力、柔和安全感與神經系統降速而設計。",
    "You described a reflective or lonely night state. Memory Air is designed for floating memory, soft safety, and low-tension emotional drift.": "你描述的是反思或孤獨的夜間狀態。Memory Air 為漂浮記憶、柔和安全感與低張力情緒漂移而設計。",
    "You described a still or sacred state. Sacred Water uses human voice air, water blur, and spacious stillness.": "你描述的是靜定或神聖狀態。神聖之水使用人聲空氣、水面模糊與寬闊靜定。",
    "You described stress, heaviness, or overthinking. Night Water is designed for emotional cooling and quiet reset.": "你描述的是壓力、沉重或過度思考。夜水為情緒降溫與安靜重置而設計。",
    "You described a steady attention state. Underwater Pulse keeps the pulse low-distraction and the atmosphere soft.": "你描述的是穩定注意力狀態。水下脈衝保持低干擾節奏與柔和氛圍。",
    "Safety": "安全感",
    "Float": "漂浮感",
    "Memory Residue": "記憶殘留",
    "Sacredness": "神聖感",
    "Tension": "張力",
    "Loopability": "循環性",
    "Dream Blur": "夢境模糊",
    "Human Presence": "人性存在感",
    "Emotional Micro Disturbance": "情緒微擾",
    "sleep / tired / calm / nervous system": "睡眠 / 疲憊 / 平靜 / 神經系統",
    "lonely / reflection / memory / night": "孤獨 / 反思 / 記憶 / 夜晚",
    "meditation / stillness / sacred": "冥想 / 靜定 / 神聖",
    "overthinking / reset / stress / anxious": "過度思考 / 重置 / 壓力 / 焦慮",
    "focus / work / write / study": "專注 / 工作 / 寫作 / 學習",
    "anxious but tired / lonely but safe / can't sleep / need floating calm": "焦慮但疲憊 / 孤單但想安全 / 睡不著 / 需要漂浮的平靜",
    "What state were you trying to enter?": "你原本想進入哪一種狀態？",
    "What changed in your body, attention, or emotion?": "你的身體、注意力或情緒發生了什麼變化？",
    "email optional": "電子郵件（選填）",
    "you@example.com": "you@example.com"
  };

  const reverse = {};
  Object.entries(zh).forEach(([en, translated]) => {
    if (!reverse[translated]) reverse[translated] = en;
  });
  const memory = {};
  function readLanguage() {
    try {
      return window.localStorage?.getItem(STORAGE_KEY) || memory[STORAGE_KEY] || "en";
    } catch (error) {
      return memory[STORAGE_KEY] || "en";
    }
  }
  function writeLanguage(value) {
    memory[STORAGE_KEY] = value;
    try {
      window.localStorage?.setItem(STORAGE_KEY, value);
    } catch (error) {
      console.warn("[Spring of Zen language fallback]", error);
    }
  }
  let current = readLanguage();

  function setHtmlLang() {
    document.documentElement.lang = current === "zh-Hant" ? "zh-Hant" : "en";
  }

  function translateValue(value) {
    if (!value) return value;
    const trimmed = value.trim();
    return current === "zh-Hant" ? (zh[trimmed] || value) : (reverse[trimmed] || value);
  }

  function translateTextNode(node) {
    const original = node.nodeValue;
    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];
    const translated = translateValue(original);
    if (translated !== original) node.nodeValue = `${leading}${translated.trim()}${trailing}`;
  }

  function apply(root = document.body) {
    setHtmlLang();
    document.querySelectorAll("[placeholder]").forEach((item) => {
      item.placeholder = translateValue(item.placeholder);
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && ["SCRIPT", "STYLE", "TEXTAREA"].includes(node.parentElement.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === current);
    });
  }

  function setLanguage(lang) {
    current = lang === "zh-Hant" ? "zh-Hant" : "en";
    writeLanguage(current);
    apply();
    window.dispatchEvent(new CustomEvent("springofzen:languagechange", { detail: { language: current } }));
  }

  function installSwitcher() {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector(".language-switcher")) return;
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="zh-Hant">繁中</button>`;
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang]");
      if (button) setLanguage(button.dataset.lang);
    });
    header.appendChild(switcher);
  }

  document.addEventListener("DOMContentLoaded", () => {
    installSwitcher();
    apply();
  });

  window.SpringOfZenI18n = {
    apply,
    setLanguage,
    getLanguage: () => current,
    t: (value) => translateValue(value)
  };
})();

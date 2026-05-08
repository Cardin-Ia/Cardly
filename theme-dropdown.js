// theme-dropdown.js
// Replace your existing theme randomizer button logic.
// Add <script src="theme-dropdown.js"></script> AFTER app.js in index.html
// AND remove or comment out the themeRandomizer logic in app.js (the randomTheme click listener)

(function () {
  // ── Theme definitions ──────────────────────────────────────────────────────
  const THEMES = [
    {
      id: "blue",
      label: "Ocean",
      bg: "#0b1c32",
      bgDot: "#0b1c32",
      accents: [
        { label: "Sky", accent: "#6bb3ff", titleColor: "#ffffff", card: "#132b4a", cardHover: "#18365b", text: "#ffffff", muted: "#9cb4d6", border: "#27466e" },
        { label: "Cyan", accent: "#22d3ee", titleColor: "#a5f3fc", card: "#132b4a", cardHover: "#18365b", text: "#ffffff", muted: "#9cb4d6", border: "#27466e" },
        { label: "Violet", accent: "#a78bfa", titleColor: "#ddd6fe", card: "#132b4a", cardHover: "#18365b", text: "#ffffff", muted: "#9cb4d6", border: "#27466e" },
      ],
    },
    {
      id: "green",
      label: "Forest",
      bg: "#0b1e14",
      bgDot: "#0b1e14",
      accents: [
        { label: "Lime", accent: "#86efac", titleColor: "#ffffff", card: "#122b1c", cardHover: "#173524", text: "#ffffff", muted: "#86b899", border: "#1e4a2c" },
        { label: "Teal", accent: "#2dd4bf", titleColor: "#ccfbf1", card: "#122b1c", cardHover: "#173524", text: "#ffffff", muted: "#86b899", border: "#1e4a2c" },
        { label: "Gold", accent: "#fbbf24", titleColor: "#fef3c7", card: "#122b1c", cardHover: "#173524", text: "#ffffff", muted: "#86b899", border: "#1e4a2c" },
      ],
    },
    {
      id: "purple",
      label: "Dusk",
      bg: "#12082a",
      bgDot: "#12082a",
      accents: [
        { label: "Lavender", accent: "#c084fc", titleColor: "#f3e8ff", card: "#1c0f3a", cardHover: "#251447", text: "#ffffff", muted: "#a98bc9", border: "#3b1f6e" },
        { label: "Pink", accent: "#f472b6", titleColor: "#fce7f3", card: "#1c0f3a", cardHover: "#251447", text: "#ffffff", muted: "#a98bc9", border: "#3b1f6e" },
        { label: "Sky", accent: "#7dd3fc", titleColor: "#e0f2fe", card: "#1c0f3a", cardHover: "#251447", text: "#ffffff", muted: "#a98bc9", border: "#3b1f6e" },
      ],
    },
    {
      id: "red",
      label: "Ember",
      bg: "#1c0a0a",
      bgDot: "#1c0a0a",
      accents: [
        { label: "Rose", accent: "#fb7185", titleColor: "#ffe4e6", card: "#2b1212", cardHover: "#361818", text: "#ffffff", muted: "#c9898a", border: "#5c2222" },
        { label: "Amber", accent: "#fbbf24", titleColor: "#fef3c7", card: "#2b1212", cardHover: "#361818", text: "#ffffff", muted: "#c9898a", border: "#5c2222" },
        { label: "Coral", accent: "#f97316", titleColor: "#fed7aa", card: "#2b1212", cardHover: "#361818", text: "#ffffff", muted: "#c9898a", border: "#5c2222" },
      ],
    },
    {
      id: "slate",
      label: "Ash",
      bg: "#0f1117",
      bgDot: "#0f1117",
      accents: [
        { label: "Silver", accent: "#94a3b8", titleColor: "#e2e8f0", card: "#1a1d27", cardHover: "#22263a", text: "#ffffff", muted: "#64748b", border: "#2d3348" },
        { label: "Indigo", accent: "#818cf8", titleColor: "#e0e7ff", card: "#1a1d27", cardHover: "#22263a", text: "#ffffff", muted: "#64748b", border: "#2d3348" },
        { label: "Emerald", accent: "#34d399", titleColor: "#d1fae5", card: "#1a1d27", cardHover: "#22263a", text: "#ffffff", muted: "#64748b", border: "#2d3348" },
      ],
    },
    {
      id: "gold",
      label: "Dune",
      bg: "#1a1200",
      bgDot: "#1a1200",
      accents: [
        { label: "Amber", accent: "#fbbf24", titleColor: "#fef3c7", card: "#261b00", cardHover: "#302200", text: "#ffffff", muted: "#b8973a", border: "#4a3800" },
        { label: "Orange", accent: "#fb923c", titleColor: "#fed7aa", card: "#261b00", cardHover: "#302200", text: "#ffffff", muted: "#b8973a", border: "#4a3800" },
        { label: "Rose", accent: "#fb7185", titleColor: "#ffe4e6", card: "#261b00", cardHover: "#302200", text: "#ffffff", muted: "#b8973a", border: "#4a3800" },
      ],
    },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let selectedThemeId = "blue";
  let selectedAccentIdx = 0;

  // ── Apply theme to CSS vars ────────────────────────────────────────────────
  function applyFullTheme(themeId, accentIdx) {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    const accent = theme.accents[accentIdx] || theme.accents[0];
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--card", accent.card);
    root.style.setProperty("--card-hover", accent.cardHover);
    root.style.setProperty("--text", accent.text);
    root.style.setProperty("--muted", accent.muted);
    root.style.setProperty("--accent", accent.accent);
    root.style.setProperty("--title-color", accent.titleColor);
    root.style.setProperty("--border", accent.border);
  }

  // ── Inject styles ──────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #theme-randomizer { display: none !important; }

    #td-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 10000;
      background: #000;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      transition: transform 0.15s ease, opacity 0.15s ease;
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: inherit;
      letter-spacing: 0.3px;
    }
    #td-btn:hover { transform: translateY(-1px); opacity: 0.9; }
    #td-btn-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.3);
      flex-shrink: 0;
      transition: background 0.2s;
    }

    #td-panel {
      position: fixed;
      top: 52px;
      right: 16px;
      z-index: 9999;
      width: 230px;
      background: var(--card, #132b4a);
      border: 1px solid var(--border, #27466e);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.55);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    #td-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .td-section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--muted, #9cb4d6);
      margin-bottom: 2px;
    }

    .td-bg-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .td-bg-swatch {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      flex: 1;
      min-width: 52px;
    }
    .td-bg-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid transparent;
      transition: border-color 0.15s, transform 0.15s;
    }
    .td-bg-swatch:hover .td-bg-circle { transform: scale(1.1); }
    .td-bg-swatch.active .td-bg-circle {
      border-color: var(--accent, #6bb3ff);
      box-shadow: 0 0 0 2px rgba(107,179,255,0.3);
    }
    .td-bg-name {
      font-size: 10px;
      color: var(--muted, #9cb4d6);
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }
    .td-bg-swatch.active .td-bg-name { color: var(--accent, #6bb3ff); }

    .td-accent-row {
      display: flex;
      gap: 8px;
    }
    .td-accent-swatch {
      flex: 1;
      padding: 7px 4px;
      border-radius: 10px;
      border: 1.5px solid transparent;
      background: var(--bg, #0b1c32);
      cursor: pointer;
      text-align: center;
      transition: border-color 0.15s, background 0.15s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .td-accent-swatch:hover { background: var(--card-hover, #18365b); }
    .td-accent-swatch.active { border-color: var(--accent, #6bb3ff); }
    .td-accent-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .td-accent-name {
      font-size: 10px;
      font-weight: 600;
      color: var(--muted, #9cb4d6);
      white-space: nowrap;
    }
    .td-accent-swatch.active .td-accent-name { color: var(--accent, #6bb3ff); }

    #td-divider {
      height: 1px;
      background: var(--border, #27466e);
      margin: 0 -14px;
    }

    #td-random-btn {
      width: 100%;
      padding: 9px;
      border-radius: 10px;
      background: var(--accent, #6bb3ff);
      color: #0b1c32;
      border: none;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      letter-spacing: 0.4px;
      transition: opacity 0.15s, transform 0.15s;
      font-family: inherit;
    }
    #td-random-btn:hover { opacity: 0.88; transform: scale(1.02); }
  `;
  document.head.appendChild(style);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const btn = document.createElement("button");
  btn.id = "td-btn";
  btn.innerHTML = `<span id="td-btn-dot"></span> Theme`;

  const panel = document.createElement("div");
  panel.id = "td-panel";

  function buildPanel() {
    panel.innerHTML = "";

    // ── BG section ────────────────────────────────────────────────────────
    const bgLabel = document.createElement("div");
    bgLabel.className = "td-section-label";
    bgLabel.textContent = "Background";
    panel.appendChild(bgLabel);

    const bgRow = document.createElement("div");
    bgRow.className = "td-bg-row";

    THEMES.forEach((t) => {
      const swatch = document.createElement("div");
      swatch.className = "td-bg-swatch" + (t.id === selectedThemeId ? " active" : "");

      const circle = document.createElement("div");
      circle.className = "td-bg-circle";
      circle.style.background = t.bgDot;

      const name = document.createElement("div");
      name.className = "td-bg-name";
      name.textContent = t.label;

      swatch.appendChild(circle);
      swatch.appendChild(name);

      swatch.addEventListener("click", () => {
        selectedThemeId = t.id;
        selectedAccentIdx = 0;
        applyFullTheme(selectedThemeId, selectedAccentIdx);
        updateBtnDot();
        buildPanel();
      });

      bgRow.appendChild(swatch);
    });

    panel.appendChild(bgRow);

    // ── Accent section ────────────────────────────────────────────────────
    const accentLabel = document.createElement("div");
    accentLabel.className = "td-section-label";
    accentLabel.textContent = "Accent & Text";
    panel.appendChild(accentLabel);

    const accentRow = document.createElement("div");
    accentRow.className = "td-accent-row";

    const currentTheme = THEMES.find((t) => t.id === selectedThemeId);
    currentTheme.accents.forEach((a, i) => {
      const swatch = document.createElement("div");
      swatch.className = "td-accent-swatch" + (i === selectedAccentIdx ? " active" : "");

      const dot = document.createElement("div");
      dot.className = "td-accent-dot";
      dot.style.background = a.accent;

      const name = document.createElement("div");
      name.className = "td-accent-name";
      name.textContent = a.label;

      swatch.appendChild(dot);
      swatch.appendChild(name);

      swatch.addEventListener("click", () => {
        selectedAccentIdx = i;
        applyFullTheme(selectedThemeId, selectedAccentIdx);
        updateBtnDot();
        buildPanel();
      });

      accentRow.appendChild(swatch);
    });

    panel.appendChild(accentRow);

    // ── Divider ───────────────────────────────────────────────────────────
    const divider = document.createElement("div");
    divider.id = "td-divider";
    panel.appendChild(divider);

    // ── Randomize btn ─────────────────────────────────────────────────────
    const randBtn = document.createElement("button");
    randBtn.id = "td-random-btn";
    randBtn.textContent = "✦ Randomize";
    randBtn.addEventListener("click", () => {
      selectedThemeId = THEMES[Math.floor(Math.random() * THEMES.length)].id;
      const theme = THEMES.find((t) => t.id === selectedThemeId);
      selectedAccentIdx = Math.floor(Math.random() * theme.accents.length);
      applyFullTheme(selectedThemeId, selectedAccentIdx);
      updateBtnDot();
      buildPanel();
    });
    panel.appendChild(randBtn);
  }

  function updateBtnDot() {
    const theme = THEMES.find((t) => t.id === selectedThemeId);
    const dot = document.getElementById("td-btn-dot");
    if (dot && theme) dot.style.background = theme.bgDot;
  }

  // ── Toggle ─────────────────────────────────────────────────────────────────
  let open = false;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    open = !open;
    if (open) buildPanel();
    panel.classList.toggle("open", open);
  });

  document.addEventListener("click", (e) => {
    if (open && !panel.contains(e.target) && e.target !== btn) {
      open = false;
      panel.classList.remove("open");
    }
  });

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── Init ───────────────────────────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", () => {
    updateBtnDot();
  });
})();

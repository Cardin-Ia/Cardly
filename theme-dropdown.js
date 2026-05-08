(function () {

  // ── Background themes ──────────────────────────────────────────────────────
  const BG_THEMES = [
    { id: "black",    label: "Black",   bg: "#080808", card: "#111111", cardHover: "#1a1a1a", muted: "#555555", border: "#222222" },
    { id: "white",    label: "White",   bg: "#f0f0f0", card: "#ffffff", cardHover: "#e4e4e4", muted: "#888888", border: "#cccccc" },
    { id: "red",      label: "Red",     bg: "#1c0505", card: "#2b0c0c", cardHover: "#381212", muted: "#c07070", border: "#5a1818" },
    { id: "green",    label: "Green",   bg: "#061a0a", card: "#0d2712", cardHover: "#12321a", muted: "#60a870", border: "#164520" },
    { id: "yellow",   label: "Yellow",  bg: "#1a1500", card: "#272000", cardHover: "#322800", muted: "#b8a030", border: "#483800" },
    { id: "blue",     label: "Blue",    bg: "#060e1f", card: "#0e1c35", cardHover: "#142544", muted: "#7090c0", border: "#1c3255" },
    { id: "brown",    label: "Brown",   bg: "#150a02", card: "#211208", cardHover: "#2a180e", muted: "#9a6840", border: "#3a2010" },
    { id: "orange",   label: "Orange",  bg: "#1a0c00", card: "#281500", cardHover: "#321c00", muted: "#c07830", border: "#4a2800" },
    { id: "pink",     label: "Pink",    bg: "#1f0815", card: "#2e1020", cardHover: "#3a1528", muted: "#c070a0", border: "#5a1838" },
    { id: "purple",   label: "Purple",  bg: "#100820", card: "#1a1030", cardHover: "#22143c", muted: "#9070c0", border: "#341a60" },
    { id: "gray",     label: "Gray",    bg: "#0e1117", card: "#181d26", cardHover: "#202832", muted: "#6a7890", border: "#283040" },
    { id: "ocean",    label: "Ocean",   bg: "#0b1c32", card: "#132b4a", cardHover: "#18365b", muted: "#9cb4d6", border: "#27466e" },
    { id: "teal",     label: "Teal",    bg: "#041818", card: "#082828", cardHover: "#0d3535", muted: "#409898", border: "#104040" },
    { id: "indigo",   label: "Indigo",  bg: "#080c28", card: "#101838", cardHover: "#162048", muted: "#6878c8", border: "#1e2e58" },
    { id: "rose",     label: "Rose",    bg: "#1f060f", card: "#300e1a", cardHover: "#3c1222", muted: "#c05878", border: "#581830" },
    { id: "lime",     label: "Lime",    bg: "#0c1a04", card: "#162808", cardHover: "#1e340c", muted: "#78b840", border: "#284800" },
    { id: "amber",    label: "Amber",   bg: "#1a0e00", card: "#281800", cardHover: "#342000", muted: "#c09040", border: "#4a2c00" },
    { id: "cyan",     label: "Cyan",    bg: "#041820", card: "#082530", cardHover: "#0d303e", muted: "#30a0b8", border: "#0e3a4a" },
    { id: "dusk",     label: "Dusk",    bg: "#12082a", card: "#1c0f3a", cardHover: "#251447", muted: "#a98bc9", border: "#3b1f6e" },
    { id: "coffee",   label: "Coffee",  bg: "#120a04", card: "#1e1008", cardHover: "#28160e", muted: "#906848", border: "#342015" },
    { id: "navy",     label: "Navy",    bg: "#050d1f", card: "#0a1830", cardHover: "#0f223f", muted: "#7a9abf", border: "#1a3050" },
    { id: "forest",   label: "Forest",  bg: "#071a0f", card: "#0d2718", cardHover: "#123220", muted: "#6a9e7a", border: "#1a4528" },
    { id: "plum",     label: "Plum",    bg: "#1a0820", card: "#280e30", cardHover: "#32123c", muted: "#b07abd", border: "#4a1a60" },
    { id: "rust",     label: "Rust",    bg: "#1f0e00", card: "#2e1600", cardHover: "#3a1c00", muted: "#c08040", border: "#4a2800" },
    { id: "slate",    label: "Slate",   bg: "#0d1520", card: "#162030", cardHover: "#1e2c40", muted: "#7090a8", border: "#253848" },
    { id: "midnight", label: "Night",   bg: "#030308", card: "#08080f", cardHover: "#0e0e18", muted: "#404060", border: "#141425" },
  ];

  // ── Accent colors (shared for every background) ────────────────────────────
  const ACCENT_COLORS = [
    { id: "white",    label: "White",   color: "#ffffff", title: "#ffffff" },
    { id: "black",    label: "Black",   color: "#1a1a1a", title: "#333333" },
    { id: "sky",      label: "Sky",     color: "#6bb3ff", title: "#bde0ff" },
    { id: "cyan",     label: "Cyan",    color: "#22d3ee", title: "#a5f3fc" },
    { id: "teal",     label: "Teal",    color: "#2dd4bf", title: "#ccfbf1" },
    { id: "green",    label: "Green",   color: "#4ade80", title: "#bbf7d0" },
    { id: "lime",     label: "Lime",    color: "#a3e635", title: "#ecfccb" },
    { id: "yellow",   label: "Yellow",  color: "#facc15", title: "#fef9c3" },
    { id: "amber",    label: "Amber",   color: "#fbbf24", title: "#fef3c7" },
    { id: "orange",   label: "Orange",  color: "#fb923c", title: "#fed7aa" },
    { id: "coral",    label: "Coral",   color: "#f97316", title: "#ffedd5" },
    { id: "red",      label: "Red",     color: "#f87171", title: "#fecaca" },
    { id: "rose",     label: "Rose",    color: "#fb7185", title: "#ffe4e6" },
    { id: "pink",     label: "Pink",    color: "#f472b6", title: "#fce7f3" },
    { id: "fuchsia",  label: "Fuchsia", color: "#e879f9", title: "#fae8ff" },
    { id: "purple",   label: "Purple",  color: "#c084fc", title: "#f3e8ff" },
    { id: "violet",   label: "Violet",  color: "#a78bfa", title: "#ede9fe" },
    { id: "indigo",   label: "Indigo",  color: "#818cf8", title: "#e0e7ff" },
    { id: "lavender", label: "Lav",     color: "#c7d2fe", title: "#eef2ff" },
    { id: "silver",   label: "Silver",  color: "#94a3b8", title: "#e2e8f0" },
    { id: "gray",     label: "Gray",    color: "#6b7280", title: "#d1d5db" },
    { id: "brown",    label: "Brown",   color: "#d97706", title: "#fef3c7" },
    { id: "gold",     label: "Gold",    color: "#eab308", title: "#fefce8" },
    { id: "emerald",  label: "Emerald", color: "#34d399", title: "#d1fae5" },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let selectedBgId     = "blue";
  let selectedAccentId = "sky";
  let isRandom         = false;
  let randomVars       = {};

  // ── HSL helpers ────────────────────────────────────────────────────────────
  function ri(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function cl(v, a, b)  { return Math.min(b, Math.max(a, v)); }

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if      (h < 60)  { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else              { r = c; b = x; }
    const hex = n => Math.round((n + m) * 255).toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  function generateRandomVars() {
    const hue       = ri(0, 359);
    const accentHue = (hue + ri(120, 220)) % 360;
    const titleHue  = (accentHue + ri(-35, 35) + 360) % 360;
    const bgL       = ri(5, 14);
    const cardL     = cl(bgL + ri(7, 11), 14, 28);
    const hoverL    = cl(cardL + ri(4, 7), 20, 36);
    const borderL   = cl(cardL + ri(8, 14), 24, 44);
    const sat       = ri(35, 70);
    return {
      "--bg":          hslToHex(hue, sat, bgL),
      "--card":        hslToHex(hue, sat, cardL),
      "--card-hover":  hslToHex(hue, sat, hoverL),
      "--text":        hslToHex(hue, 30, 96),
      "--muted":       hslToHex(hue, 20, 68),
      "--accent":      hslToHex(accentHue, ri(70, 95), ri(58, 72)),
      "--title-color": hslToHex(titleHue, ri(75, 100), ri(56, 72)),
      "--border":      hslToHex(hue, Math.max(20, sat - 10), borderL),
    };
  }

  // ── Apply theme ────────────────────────────────────────────────────────────
  function applyFromSelections() {
    isRandom = false;
    const bg     = BG_THEMES.find(t => t.id === selectedBgId);
    const accent = ACCENT_COLORS.find(a => a.id === selectedAccentId);
    if (!bg || !accent) return;
    const r = document.documentElement;
    r.style.setProperty("--bg",          bg.bg);
    r.style.setProperty("--card",        bg.card);
    r.style.setProperty("--card-hover",  bg.cardHover);
    r.style.setProperty("--text",        bg.id === "white" ? "#111111" : "#ffffff");
    r.style.setProperty("--muted",       bg.muted);
    r.style.setProperty("--accent",      accent.color);
    r.style.setProperty("--title-color", accent.title);
    r.style.setProperty("--border",      bg.border);
    updateDot(bg.bg);
    buildPanel();
  }

  function applyRandom(vars) {
    const r = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => r.style.setProperty(k, v));
    updateDot(vars["--bg"]);
  }

  function updateDot(color) {
    const d = document.getElementById("td-btn-dot");
    if (d) d.style.background = color;
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #theme-randomizer { display: none !important; }

    #td-btn {
      position: fixed; top: 16px; right: 16px; z-index: 10000;
      background: #000; color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px; padding: 8px 14px;
      font-size: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      transition: transform 0.15s, opacity 0.15s;
      display: flex; align-items: center; gap: 7px; font-family: inherit;
    }
    #td-btn:hover { transform: translateY(-1px); opacity: 0.9; }
    #td-btn-dot {
      width: 10px; height: 10px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.3);
      flex-shrink: 0; transition: background 0.2s;
    }

    #td-panel {
      position: fixed; top: 52px; right: 16px; z-index: 9999;
      width: 280px;
      background: var(--card, #132b4a);
      border: 1px solid var(--border, #27466e);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      padding: 14px; display: flex; flex-direction: column; gap: 10px;
      opacity: 0; transform: translateY(-8px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.18s, transform 0.18s;
      max-height: 82vh; overflow-y: auto;
    }
    #td-panel::-webkit-scrollbar { width: 4px; }
    #td-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    #td-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    .td-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; color: var(--muted, #9cb4d6);
    }

    .td-swatch-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }
    .td-swatch {
      display: flex; flex-direction: column;
      align-items: center; gap: 4px; cursor: pointer;
    }
    .td-circle {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2px solid transparent;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
      transition: border-color 0.15s, transform 0.15s;
    }
    .td-swatch:hover .td-circle { transform: scale(1.14); }
    .td-swatch.active .td-circle {
      border-color: var(--accent, #6bb3ff);
      box-shadow: 0 0 0 2px rgba(107,179,255,0.4);
    }
    .td-name {
      font-size: 9px; font-weight: 600;
      color: var(--muted, #9cb4d6);
      text-align: center;
      overflow: hidden; text-overflow: ellipsis;
      white-space: nowrap; max-width: 100%;
    }
    .td-swatch.active .td-name { color: var(--accent, #6bb3ff); }

    #td-random-preview {
      display: none; flex-direction: column; gap: 5px;
      padding: 8px 10px; border-radius: 10px;
      background: var(--bg, #0b1c32);
      border: 1px solid var(--border, #27466e);
    }
    #td-random-preview.visible { display: flex; }
    .td-prev-row { display: flex; align-items: center; gap: 7px; }
    .td-prev-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .td-prev-key { font-size: 9px; color: var(--muted); width: 50px; }
    .td-prev-val { font-size: 10px; font-family: monospace; color: var(--text); }

    .td-divider { height: 1px; background: var(--border, #27466e); margin: 2px -14px; }

    #td-random-btn {
      width: 100%; padding: 9px; border-radius: 10px;
      background: var(--accent, #6bb3ff); color: #000;
      border: none; font-weight: 800; font-size: 12px;
      cursor: pointer; letter-spacing: 0.4px;
      transition: opacity 0.15s, transform 0.15s; font-family: inherit;
    }
    #td-random-btn:hover { opacity: 0.88; transform: scale(1.02); }
  `;
  document.head.appendChild(style);

  // ── Build panel ────────────────────────────────────────────────────────────
  const btn   = document.createElement("button");
  btn.id      = "td-btn";
  btn.innerHTML = `<span id="td-btn-dot"></span> Theme`;

  const panel = document.createElement("div");
  panel.id    = "td-panel";

  function buildPanel() {
    panel.innerHTML = "";

    // BG label
    const bgLbl = document.createElement("div");
    bgLbl.className = "td-label";
    bgLbl.textContent = "Background";
    panel.appendChild(bgLbl);

    // BG grid
    const bgGrid = document.createElement("div");
    bgGrid.className = "td-swatch-grid";
    BG_THEMES.forEach(t => {
      const sw = document.createElement("div");
      sw.className = "td-swatch" + (!isRandom && t.id === selectedBgId ? " active" : "");
      sw.innerHTML = `<div class="td-circle" style="background:${t.bg}"></div><div class="td-name">${t.label}</div>`;
      sw.addEventListener("click", () => { selectedBgId = t.id; applyFromSelections(); });
      bgGrid.appendChild(sw);
    });
    panel.appendChild(bgGrid);

    // Accent label
    const acLbl = document.createElement("div");
    acLbl.className = "td-label";
    acLbl.textContent = "Accent & Text";
    panel.appendChild(acLbl);

    // Accent grid
    const acGrid = document.createElement("div");
    acGrid.className = "td-swatch-grid";
    ACCENT_COLORS.forEach(a => {
      const sw = document.createElement("div");
      sw.className = "td-swatch" + (!isRandom && a.id === selectedAccentId ? " active" : "");
      sw.innerHTML = `<div class="td-circle" style="background:${a.color}"></div><div class="td-name">${a.label}</div>`;
      sw.addEventListener("click", () => { selectedAccentId = a.id; applyFromSelections(); });
      acGrid.appendChild(sw);
    });
    panel.appendChild(acGrid);

    // Random preview (only shown after randomize)
    const preview = document.createElement("div");
    preview.id = "td-random-preview";
    if (isRandom) {
      preview.className = "visible";
      [
        { key: "--bg",          label: "Background" },
        { key: "--accent",      label: "Accent" },
        { key: "--title-color", label: "Text" },
      ].forEach(({ key, label }) => {
        const val = randomVars[key] || "";
        const row = document.createElement("div");
        row.className = "td-prev-row";
        row.innerHTML = `
          <div class="td-prev-dot" style="background:${val}"></div>
          <span class="td-prev-key">${label}</span>
          <span class="td-prev-val">${val}</span>
        `;
        preview.appendChild(row);
      });
    }
    panel.appendChild(preview);

    // Divider
    const div = document.createElement("div");
    div.className = "td-divider";
    panel.appendChild(div);

    // Randomize button
    const randBtn = document.createElement("button");
    randBtn.id = "td-random-btn";
    randBtn.textContent = "✦ Randomize";
    randBtn.addEventListener("click", () => {
      randomVars = generateRandomVars();
      isRandom   = true;
      applyRandom(randomVars);
      buildPanel();
    });
    panel.appendChild(randBtn);
  }

  // ── Toggle ─────────────────────────────────────────────────────────────────
  let open = false;
  btn.addEventListener("click", e => {
    e.stopPropagation();
    open = !open;
    if (open) buildPanel();
    panel.classList.toggle("open", open);
  });
  document.addEventListener("click", e => {
    if (open && !panel.contains(e.target) && e.target !== btn) {
      open = false;
      panel.classList.remove("open");
    }
  });

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  window.addEventListener("DOMContentLoaded", () => { applyFromSelections(); });

})();

const home = document.getElementById("view-home");
const subjectView = document.getElementById("view-subject");
const iosGuide = document.getElementById("ios-guide");

const modal = document.getElementById("quizlet-modal");
const iframe = document.getElementById("quizlet-frame");
const closeBtn = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const themeRandomizer = document.getElementById("theme-randomizer");

const THEMES = [
  {
    bg: "#0b1c32",
    card: "#132b4a",
    cardHover: "#18365b",
    text: "#ffffff",
    muted: "#9cb4d6",
    accent: "#6bb3ff",
    border: "#27466e"
  },
  {
    bg: "#1a1026",
    card: "#2a183d",
    cardHover: "#382052",
    text: "#fff7ff",
    muted: "#cdb6dd",
    accent: "#ff7ad9",
    border: "#53306e"
  },
  {
    bg: "#0d1f17",
    card: "#163327",
    cardHover: "#1d4433",
    text: "#f4fff8",
    muted: "#a8cdb8",
    accent: "#5ee0a0",
    border: "#2d5f49"
  },
  {
    bg: "#21140d",
    card: "#382117",
    cardHover: "#4b2b1d",
    text: "#fff8f3",
    muted: "#d9b9a3",
    accent: "#ff9b5e",
    border: "#6b3f2b"
  },
  {
    bg: "#111827",
    card: "#1f2937",
    cardHover: "#2d3748",
    text: "#f9fafb",
    muted: "#b6c2d1",
    accent: "#60a5fa",
    border: "#3f4c61"
  },
  {
    bg: "#1b1020",
    card: "#31193a",
    cardHover: "#43214f",
    text: "#fffaff",
    muted: "#d1b6d9",
    accent: "#c084fc",
    border: "#5d3570"
  }
];

function show(viewEl) {
  [home, subjectView].forEach(v => (v.hidden = true));
  viewEl.hidden = false;

  if (iosGuide) iosGuide.hidden = (viewEl !== home);
}

function escapeAttr(str = "") {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--card", theme.card);
  root.style.setProperty("--card-hover", theme.cardHover);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--border", theme.border);
  localStorage.setItem("cardly-theme", JSON.stringify(theme));
}

function randomTheme() {
  let currentTheme = null;

  try {
    const current = localStorage.getItem("cardly-theme");
    currentTheme = current ? JSON.parse(current) : null;
  } catch {
    currentTheme = null;
  }

  let choices = THEMES;

  if (currentTheme) {
    choices = THEMES.filter(
      (t) =>
        t.bg !== currentTheme.bg ||
        t.card !== currentTheme.card ||
        t.accent !== currentTheme.accent
    );
  }

  const next = choices[Math.floor(Math.random() * choices.length)];
  applyTheme(next);
}

function loadSavedTheme() {
  try {
    const saved = localStorage.getItem("cardly-theme");
    if (saved) applyTheme(JSON.parse(saved));
  } catch {
    // ignore bad saved data
  }
}

function openModal(embedUrl, title = "Flashcards") {
  modalTitle.textContent = title;
  iframe.src = embedUrl;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  iframe.src = "";
  document.body.style.overflow = "";
}

window.openModal = openModal;

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

if (themeRandomizer) {
  themeRandomizer.addEventListener("click", randomTheme);
}

function renderHome() {
  const tiles = SUBJECTS.map((s) => {
    const count = s.units.length;
    return `
      <a class="card" href="#/subject/${s.id}">
        ${s.name}
        <div style="font-size:14px;color:var(--muted);margin-top:4px;">
          ${count} Unit${count === 1 ? "" : "s"}
        </div>
      </a>
    `;
  }).join("");

  home.innerHTML = `
    <h2 style="margin-top:40px;font-weight:700;">Select a Subject</h2>
    <div class="grid">${tiles}</div>
  `;

  show(home);
}

function renderSubject(id) {
  const subject = SUBJECTS.find((s) => s.id === id);
  if (!subject) {
    location.hash = "#/";
    return;
  }

  const unitsHTML = subject.units.length
    ? subject.units.map((u, i) => {
        const url = u.embed;
        const title = u.title ?? `Unit ${i + 1}`;
        return `
          <div class="unit" onclick="openModal('${escapeAttr(url)}','${escapeAttr(title)}')">
            <div class="unit-title">${title}</div>
            <p style="color:var(--muted);font-size:14px;margin:6px 0 0;">Click to open flashcards</p>
          </div>
        `;
      }).join("")
    : `<p style="color:var(--muted);font-size:16px;text-align:center;">No units yet for ${subject.name}.</p>`;

  subjectView.innerHTML = `
    <div class="toolbar">
      <a href="#/" class="btn">← Back</a>
      <h2 style="margin:0;">${subject.name}</h2>
    </div>
    <div class="units">${unitsHTML}</div>
  `;

  show(subjectView);
}

function route() {
  const hash = location.hash.slice(1);

  if (!hash || hash === "/") {
    renderHome();
    return;
  }

  const parts = hash.split("/").filter(Boolean);

  if (parts[0] === "subject" && parts[1]) {
    renderSubject(parts[1]);
    return;
  }

  renderHome();
}

window.addEventListener("DOMContentLoaded", () => {
  modal.style.display = "none";
  loadSavedTheme();
  route();
});

window.addEventListener("hashchange", route);

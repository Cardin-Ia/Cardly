const home = document.getElementById("view-home");
const subjectView = document.getElementById("view-subject");
const iosGuide = document.getElementById("ios-guide");

const modal = document.getElementById("quizlet-modal");
const iframe = document.getElementById("quizlet-frame");
const closeBtn = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const themeRandomizer = document.getElementById("theme-randomizer");

function show(viewEl) {
  [home, subjectView].forEach((v) => (v.hidden = true));
  viewEl.hidden = false;

  if (iosGuide) iosGuide.hidden = viewEl !== home;
}

function escapeAttr(str = "") {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateTheme() {
  const hue = randomInt(0, 359);
  const accentHue = (hue + randomInt(120, 220)) % 360;

  const bgLightness = randomInt(9, 16);
  const cardLightness = clamp(bgLightness + randomInt(7, 11), 18, 30);
  const hoverLightness = clamp(cardLightness + randomInt(4, 7), 24, 38);
  const borderLightness = clamp(cardLightness + randomInt(8, 14), 28, 46);

  const saturation = randomInt(35, 70);
  const accentSaturation = randomInt(70, 95);

  return {
    bg: hslToHex(hue, saturation, bgLightness),
    card: hslToHex(hue, saturation, cardLightness),
    cardHover: hslToHex(hue, saturation, hoverLightness),
    text: hslToHex(hue, 35, 96),
    muted: hslToHex(hue, 22, 74),
    accent: hslToHex(accentHue, accentSaturation, randomInt(60, 72)),
    border: hslToHex(hue, Math.max(25, saturation - 10), borderLightness),
  };
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
}

function resetTheme() {
  const root = document.documentElement;
  root.style.removeProperty("--bg");
  root.style.removeProperty("--card");
  root.style.removeProperty("--card-hover");
  root.style.removeProperty("--text");
  root.style.removeProperty("--muted");
  root.style.removeProperty("--accent");
  root.style.removeProperty("--border");
}

function randomTheme() {
  applyTheme(generateTheme());
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

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

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
    <h2 style="margin-top:40px;font-weight:800;color:var(--accent);">Select a Subject</h2>
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
    ? subject.units
        .map((u, i) => {
          const url = u.embed;
          const title = u.title ?? `Unit ${i + 1}`;
          return `
          <div class="unit" onclick="openModal('${escapeAttr(url)}','${escapeAttr(title)}')">
            <div class="unit-title">${title}</div>
            <p style="color:var(--muted);font-size:14px;margin:6px 0 0;">Click to open flashcards</p>
          </div>
        `;
        })
        .join("")
    : `<p style="color:var(--muted);font-size:16px;text-align:center;">No units yet for ${subject.name}.</p>`;

  subjectView.innerHTML = `
    <div class="toolbar">
      <a href="#/" class="btn">← Back</a>
      <h2 style="margin:0;color:var(--accent);font-weight:800;">${subject.name}</h2>
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
  if (modal) modal.style.display = "none";
  resetTheme();
  route();
});

window.addEventListener("hashchange", route);

const home = document.getElementById("view-home");
const subjectView = document.getElementById("view-subject");


const iosGuide = document.getElementById("ios-guide");

const modal = document.getElementById("quizlet-modal");
const iframe = document.getElementById("quizlet-frame");
const closeBtn = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");

function show(viewEl) {
  [home, subjectView].forEach(v => (v.hidden = true));
  viewEl.hidden = false;


  if (iosGuide) iosGuide.hidden = (viewEl !== home);
}

function escapeAttr(str = "") {
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
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

function renderHome() {
  const tiles = SUBJECTS.map((s) => {
    const count = s.units.length;
    return `
      <a class="card" href="#/subject/${s.id}">
        ${s.name}
        <div style="font-size:14px;color:#9cb4d6;margin-top:4px;">
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
            <p style="color:#9cb4d6;font-size:14px;margin:6px 0 0;">Click to open flashcards</p>
          </div>
        `;
      }).join("")
    : `<p style="color:#9cb4d6;font-size:16px;text-align:center;">No units yet for ${subject.name}.</p>`;

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
  route();
});

window.addEventListener("hashchange", route);

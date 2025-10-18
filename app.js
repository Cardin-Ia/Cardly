const home = document.getElementById("view-home");
const subjectView = document.getElementById("view-subject");
const modal = document.getElementById("quizlet-modal");
const iframe = document.getElementById("quizlet-frame");
const closeBtn = document.getElementById("close-modal");

function show(v) {
  [home, subjectView].forEach(x => x.hidden = true);
  v.hidden = false;
}

function openModal(embedUrl) {
  iframe.src = embedUrl;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  iframe.src = "";
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

function renderHome() {
  const tiles = SUBJECTS.map(s => `
    <a class="card" href="#/subject/${s.id}">
      ${s.name}
      <div style="font-size:14px;color:#9cb4d6;margin-top:4px;">${s.units.length} Unit${s.units.length !== 1 ? "s" : ""}</div>
    </a>
  `).join("");

  home.innerHTML = `
    <h2 style="margin-top:40px;font-weight:700;">Select a Subject</h2>
    <div class="grid">${tiles}</div>
  `;
  show(home);
}

function renderSubject(id) {
  const subject = SUBJECTS.find(s => s.id === id);
  if (!subject) { location.hash = "#/"; return; }

  const content = subject.units.length
    ? subject.units.map(u => `
        <div class="unit" onclick="openModal('${u.embed}')">
          <div class="unit-title">${u.title}</div>
          <p style="color:#9cb4d6;font-size:14px;">Click to open flashcards</p>
        </div>
      `).join("")
    : `<p style="color:#9cb4d6;font-size:16px;">No units yet for ${subject.name}.</p>`;

  subjectView.innerHTML = `
    <div class="toolbar">
      <a href="#/" class="btn">← Back</a>
      <h2>${subject.name}</h2>
    </div>
    <div class="units">${content}</div>
  `;
  show(subjectView);
}

function route() {
  const hash = location.hash.slice(1);
  if (!hash || hash === "/") { renderHome(); return; }
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "subject" && parts[1]) { renderSubject(parts[1]); return; }
  renderHome();
}

window.addEventListener("hashchange", route);
route();

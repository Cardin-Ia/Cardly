const $ = (s) => document.querySelector(s);
const home = $("#view-home"), sub = $("#view-subject"), modal = $("#quizlet-modal"),
  frame = $("#quizlet-frame"), search = $("#search"), pop = $("#theme-pop");

let S = { done: {}, last: null, theme: null };
try { S = { ...S, ...JSON.parse(localStorage.getItem("cardly:v2") || "{}") }; } catch (e) {}
const save = () => { try { localStorage.setItem("cardly:v2", JSON.stringify(S)); } catch (e) {} };

const key = (s, i) => s.id + ":" + i;
const hue = (i) => (i * 47 + 205) % 360;
const title = (u, i) => (u.title || "Unit " + (i + 1)).trim();
const split = (n) => {
  const m = n.match(/^(.*?)\s*(\p{Extended_Pictographic}.*)$/u);
  return m ? { name: m[1], emoji: m[2] } : { name: n, emoji: "📚" };
};
const doneIn = (s) => s.units.filter((_, i) => S.done[key(s, i)]).length;
const ALL = SUBJECTS.flatMap((s, si) => s.units.map((u, i) => ({ s, si, u, i, t: title(u, i) })));
const find = (k) => ALL.find((a) => key(a.s, a.i) === k);

/* ---------- themes ---------- */
const THEMES = {
  Midnight: ["#070f1f", "#0f2140", "#15315c", "#6bb3ff", "#a78bfa", "#22406b"],
  Aurora: ["#08140f", "#0f2a22", "#163a2f", "#5eead4", "#a3e635", "#1f4a3c"],
  Ember: ["#150a0a", "#2a1414", "#3a1c1c", "#fb923c", "#f43f5e", "#4f2626"],
  Orchid: ["#120a1f", "#231238", "#301a4d", "#e879f9", "#818cf8", "#412a66"],
  Slate: ["#0e1116", "#181d26", "#212835", "#93c5fd", "#fbbf24", "#2c3544"],
  Paper: ["#eef2f9", "#ffffff", "#e4ebf7", "#2563eb", "#7c3aed", "#cfd9ea", "#0f1b33", "#5a6b8c"],
};
function applyTheme(a) {
  const r = document.documentElement;
  ["--bg", "--card", "--card-hover", "--accent", "--accent2", "--border"].forEach((k, i) => r.style.setProperty(k, a[i]));
  r.style.setProperty("--text", a[6] || "#f2f6ff");
  r.style.setProperty("--muted", a[7] || "#8fa8cf");
  r.toggleAttribute("data-light", !!a[6]);
  S.theme = a; save();
}
function shuffleTheme() {
  const h = (Math.random() * 360) | 0;
  applyTheme([`hsl(${h} 55% 7%)`, `hsl(${h} 50% 14%)`, `hsl(${h} 50% 20%)`, `hsl(${(h + 150) % 360} 90% 68%)`, `hsl(${(h + 60) % 360} 85% 70%)`, `hsl(${h} 40% 27%)`]);
}
pop.innerHTML = Object.entries(THEMES).map(([n, a]) =>
  `<button class="sw" title="${n}" aria-label="${n} theme" data-t="${n}" style="background:linear-gradient(135deg,${a[3]},${a[4]})"></button>`).join("") +
  `<button class="sw" id="shuffle" title="Shuffle" aria-label="Random theme">🎲</button>`;
if (S.theme) applyTheme(S.theme);

/* ---------- views ---------- */
const row = (x) => `<div class="unit${S.done[key(x.s, x.i)] ? " done" : ""}" style="--h:${hue(x.si)}" tabindex="0" role="button" data-open="${key(x.s, x.i)}"><span class="n"><span>${x.i + 1}</span></span><span class="t">${x.t}<small>${split(x.s.name).name}</small></span><span class="go">›</span></div>`;
const bar = (d, n) => `<span class="bar"><i style="width:${n ? (d / n) * 100 : 0}%"></i></span>`;

function renderHome() {
  const q = search.value.trim().toLowerCase();
  if (q) {
    const r = ALL.filter((x) => (x.t + " " + split(x.s.name).name).toLowerCase().includes(q));
    home.innerHTML = `<h2 class="h2">${r.length} deck${r.length === 1 ? "" : "s"} found</h2><div class="units">${r.map(row).join("") || `<p class="muted">Nothing matches that search yet.</p>`}</div>`;
    return;
  }
  const last = S.last && find(S.last), done = Object.keys(S.done).length;
  home.innerHTML = `<div class="hero"><h1>Flashcards for AP exams</h1>
    <p class="muted">${SUBJECTS.length} subjects · ${ALL.length} decks · ${done} studied</p>
    <div class="cta">${last ? `<button class="btn pri" data-open="${S.last}">Continue: ${last.t}</button>` : ""}<button class="btn" id="surprise">Surprise me</button></div></div>
    <div class="grid">${SUBJECTS.map((s, i) => {
      const { name, emoji } = split(s.name), n = s.units.length, d = doneIn(s);
      return `<a class="card" style="--h:${hue(i)}" href="#/subject/${s.id}"><span class="emoji">${emoji}</span><b>${name}</b><small>${n} deck${n === 1 ? "" : "s"} · ${d} studied</small>${bar(d, n)}</a>`;
    }).join("")}</div>`;
}

function renderSubject(s) {
  const si = SUBJECTS.indexOf(s), { name, emoji } = split(s.name), n = s.units.length, d = doneIn(s);
  sub.innerHTML = `<a class="btn" href="#/">← All subjects</a>
    <div class="shead" style="--h:${hue(si)}"><span class="emoji">${emoji}</span><div><h2 class="h2">${name}</h2><small>${d} of ${n} studied</small>${bar(d, n)}</div></div>
    <div class="units" style="--h:${hue(si)}">${s.units.map((u, i) => row({ s, si, u, i, t: title(u, i) })).join("") || `<p class="muted">No decks yet.</p>`}</div>`;
}

function view() {
  const p = location.hash.split("/"), s = p[1] === "subject" && SUBJECTS.find((x) => x.id === p[2]);
  home.hidden = !!s; sub.hidden = !s; $("#ios").hidden = !!s;
  s ? renderSubject(s) : renderHome();
}
const render = () => { view(); scrollTo(0, 0); };

/* ---------- study modal ---------- */
let cur = null;
function open(k) {
  const x = find(k); if (!x) return;
  cur = x; S.last = k; save();
  $("#modal-title").textContent = x.s.name + " · " + x.t;
  $("#mark").textContent = S.done[k] ? "✓ Studied" : "Mark studied";
  frame.src = x.u.embed;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}
function close() {
  if (!modal.classList.contains("show")) return;
  modal.classList.remove("show"); frame.src = ""; document.body.style.overflow = ""; view();
}
function step(d) {
  const n = ALL[ALL.indexOf(cur) + d];
  if (n && n.s === cur.s) open(key(n.s, n.i));
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]"), t = e.target.closest("[data-t]");
  if (o) open(o.dataset.open);
  else if (t) applyTheme(THEMES[t.dataset.t]);
  else if (e.target.closest("#shuffle")) shuffleTheme();
  else if (e.target.closest("#surprise")) { const r = ALL[(Math.random() * ALL.length) | 0]; open(key(r.s, r.i)); }
  else if (e.target === modal) close();
  if (!e.target.closest("#theme-btn, #theme-pop")) pop.classList.remove("open");
});
$("#theme-btn").addEventListener("click", () => pop.classList.toggle("open"));
$("#close-modal").addEventListener("click", close);
$("#prev").addEventListener("click", () => step(-1));
$("#next").addEventListener("click", () => step(1));
$("#mark").addEventListener("click", () => {
  const k = key(cur.s, cur.i);
  S.done[k] ? delete S.done[k] : (S.done[k] = 1);
  save(); $("#mark").textContent = S.done[k] ? "✓ Studied" : "Mark studied";
});
search.addEventListener("input", () => (home.hidden ? (location.hash = "#/") : renderHome()));
search.addEventListener("keydown", (e) => { if (e.key === "Enter") { const f = $("#view-home .unit"); if (f) open(f.dataset.open); } });
document.addEventListener("keydown", (e) => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if (e.key === "Escape") { close(); pop.classList.remove("open"); }
  else if (modal.classList.contains("show")) { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); }
  else if (e.key === "/" && !typing) { e.preventDefault(); search.focus(); }
  else if (e.key === "Enter" && e.target.dataset.open) open(e.target.dataset.open);
});
addEventListener("hashchange", render);
render();

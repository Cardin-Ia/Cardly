const home=document.getElementById("view-home");
const subjectView=document.getElementById("view-subject");

function show(v){ [home,subjectView].forEach(x=>x.hidden=true); v.hidden=false; }

function renderHome(){
  const tiles=SUBJECTS.map(s=>`
    <a class="tile" href="#/subject/${s.id}">
      <span>${s.name}</span>
      <span class="count">${s.units.length} unit${s.units.length===1?"":"s"}</span>
    </a>
  `).join("");
  home.innerHTML=`
    <div class="toolbar"><span style="color:var(--muted)">Select a subject</span></div>
    <div class="grid">${tiles}</div>
  `;
  show(home);
}

function renderSubject(id){
  const subject=SUBJECTS.find(s=>s.id===id);
  if(!subject){ location.hash="#/"; return; }

  const units = subject.units.length
    ? subject.units.map((u,i)=>`
        <div class="unit">
          <div class="head"><div>${u.title}</div><div class="meta">Unit ${i+1}</div></div>
          <div class="frame-wrap">
            <iframe src="${u.embed}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      `).join("")
    : `<div class="tile" style="justify-content:center">No units yet for ${subject.name}.</div>`;

  subjectView.innerHTML=`
    <div class="toolbar">
      <a class="linkbtn" href="#/">← Home</a>
      <strong>${subject.name}</strong>
    </div>
    <div class="units">${units}</div>
  `;
  show(subjectView);
}

function route(){
  const h=location.hash.slice(1);
  if(!h||h==="/"){ renderHome(); return; }
  const p=h.split("/").filter(Boolean);
  if(p[0]==="subject"&&p[1]){ renderSubject(p[1]); return; }
  renderHome();
}

window.addEventListener("hashchange",route);
route();

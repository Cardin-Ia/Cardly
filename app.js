const home=document.getElementById("view-home");
const subjectView=document.getElementById("view-subject");

function show(view){
  [home,subjectView].forEach(v=>v.hidden=true);
  view.hidden=false;
}

function renderHome(){
  const cards=SUBJECTS.map(s=>`
    <a class="card" href="#/subject/${s.id}">
      <div class="title">${s.name}</div>
      <div class="sub">${s.units.length} unit${s.units.length===1?"": "s"}</div>
    </a>
  `).join("");
  home.innerHTML=`
    <div class="toolbar">
      <span style="color:#6d7b8a;">Choose a subject</span>
    </div>
    <div class="grid">${cards}</div>
  `;
  show(home);
}

function renderSubject(id){
  const subject=SUBJECTS.find(s=>s.id===id);
  if(!subject){ location.hash="#/"; return; }

  const unitCards = subject.units.length
    ? subject.units.map(u=>`
        <div class="unit">
          <div class="unit-head">${u.title}</div>
          <iframe src="${u.embed}" loading="lazy" allowfullscreen></iframe>
        </div>
      `).join("")
    : `<div class="card" style="text-align:center;">No units yet for ${subject.name}.</div>`;

  subjectView.innerHTML=`
    <div class="toolbar">
      <a class="linkbtn" href="#/">← Home</a>
      <strong>${subject.name}</strong>
    </div>
    <div class="units">${unitCards}</div>
  `;
  show(subjectView);
}

function route(){
  const h=location.hash.slice(1);
  if(!h || h==="/"){ renderHome(); return; }
  const p=h.split("/").filter(Boolean);
  if(p[0]==="subject" && p[1]){ renderSubject(p[1]); return; }
  renderHome();
}

window.addEventListener("hashchange",route);
route();

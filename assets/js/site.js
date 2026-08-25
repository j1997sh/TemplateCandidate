
(function(){
const AREAS=window.CANDIDATE_AREAS||{},HUBS=window.CANDIDATE_HUBS||{},LINKS=window.CANDIDATE_LINKS||{};
const postcodeMap=Object.keys(AREAS).flatMap(key=>(AREAS[key].postcodePrefixes||[]).map(prefix=>[new RegExp("^"+prefix,"i"),key]));
function resolveArea(v){if(!v)return"";v=v.trim();if(AREAS[v])return v;for(const [rx,key] of postcodeMap){if(rx.test(v))return key}const l=v.toLowerCase();for(const k of Object.keys(AREAS)){if(l.includes(AREAS[k].name.toLowerCase()))return k}return""}
function getArea(){const q=new URLSearchParams(location.search).get("area");if(q&&AREAS[q])return q;try{return localStorage.getItem("candidateArea")||""}catch(e){return""}}
function setArea(k){if(!AREAS[k])return;try{localStorage.setItem("candidateArea",k)}catch(e){}applyArea(k)}
function clearArea(){try{localStorage.removeItem("candidateArea")}catch(e){}const u=new URL(location.href);u.searchParams.delete("area");history.replaceState({},"",u);location.reload()}
function captureSource(){const p=new URLSearchParams(location.search),keys=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","issue","source","qr"];let s={};try{s=JSON.parse(sessionStorage.getItem("candidateSource")||"{}")}catch(e){}keys.forEach(k=>{if(p.get(k))s[k]=p.get(k)});try{sessionStorage.setItem("candidateSource",JSON.stringify(s))}catch(e){}}
function source(){try{return JSON.parse(sessionStorage.getItem("candidateSource")||"{}")}catch(e){return{}}}
function buildUrl(raw,area){try{const u=new URL(raw,location.href);if(area&&!u.searchParams.has("area"))u.searchParams.set("area",area);const s=source();Object.keys(s).forEach(k=>{if(s[k]&&!u.searchParams.has(k))u.searchParams.set(k,s[k])});return raw.split("?")[0].split("#")[0]+u.search+u.hash}catch(e){return raw}}
function decorate(area){document.querySelectorAll("a[href]").forEach(a=>{const raw=a.getAttribute("href");if(!raw||raw.startsWith("#")||raw.startsWith("mailto:")||raw.startsWith("tel:")||/^https?:/i.test(raw))return;if(!/(plan|news|events|tell-joe|area|campaigns|volunteer|preferences|thanks)/.test(raw))return;a.setAttribute("href",buildUrl(raw,area))})}
function initMobile(){const b=document.getElementById("menuButton"),n=document.getElementById("mobileNav");if(!b||!n)return;b.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o?"true":"false")})}
function areaCard(image,title,copy,href,button){return `<article class="card"><div class="card-image" style="background-image:url('${image}')"></div><div class="card-body"><h3>${title}</h3><p>${copy}</p><a class="btn navy" href="${href}">${button}</a></div></article>`}
function renderHome(k){const b=document.getElementById("homeLocalBlock");if(!b||!HUBS[k])return;const h=HUBS[k],a=AREAS[k],l=LINKS[k];b.classList.add("visible");document.querySelectorAll("[data-area-name]").forEach(el=>el.textContent=a.name);const s=h.news[0],c=h.campaigns[0],e=h.events[0];[["localStoryTitle",s[0]],["localStoryText",s[1]],["localCampaignTitle",c[0]],["localCampaignText",c[1]],["localEventTitle",e[0]],["localEventText",`${e[1]} · ${e[2]}`]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});[["localStoryImage",s[2]],["localCampaignImage",c[3]],["localEventImage",e[4]]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.style.backgroundImage=`url("${v}")`});[["localStoryLink",l.news[0]],["localCampaignLink",l.campaigns[0]],["localEventLink",l.events[0]]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.href=v+`?area=${k}`});const pmap={health:["Better local healthcare","What Joe would fight for on healthcare locally","https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=88","plan-healthcare.html"],safety:["Safer streets","What safer streets would mean locally","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=88","plan-safer-streets.html"],roads:["Fixing our roads","Joe’s priorities for roads and transport locally","https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1600&q=88","plan-roads.html"],business:["Backing local business","Joe’s plan for employers and the high street","https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=88","plan-business.html"]};const pd=pmap[c[2]]||pmap.roads;[["localPolicyTitle",pd[0]],["localPolicyText",pd[1]]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});const pi=document.getElementById("localPolicyImage");if(pi)pi.style.backgroundImage=`url("${pd[2]}")`;const pl=document.getElementById("localPolicyLink");if(pl)pl.href=pd[3]+`?area=${k}`;const hub=document.getElementById("homeAreaHubLink");if(hub)hub.href=`area.html?area=${k}`}
function renderHub(k){const a=AREAS[k],h=HUBS[k],l=LINKS[k];if(!a||!h)return;const g=document.getElementById("areaGeneric"),c=document.getElementById("areaChooser"),hub=document.getElementById("areaHub");if(g)g.style.display="none";if(c)c.style.display="none";if(hub)hub.style.display="block";document.querySelectorAll("[data-area-name]").forEach(el=>el.textContent=a.name);const t=document.getElementById("areaHubTitle");if(t)t.textContent="Joe in "+a.name;const i=document.getElementById("areaHubIntro");if(i)i.textContent=a.heroSupport;const f=document.getElementById("areaHubFocus");if(f)f.textContent="Local focus: "+a.localFocus;const ng=document.getElementById("areaNewsGrid");if(ng)ng.innerHTML=h.news.map((n,i)=>areaCard(n[2],n[0],n[1],l.news[i]+`?area=${k}`,"Read story")).join("");const cg=document.getElementById("areaCampaignGrid");if(cg)cg.innerHTML=h.campaigns.map((c,i)=>areaCard(c[3],c[0],c[1],l.campaigns[i]+`?area=${k}`,"View campaign")).join("");const pg=document.getElementById("areaPolicyGrid");if(pg){const ps=[["Better local healthcare","Fight for easier access to GPs, dentists and NHS services.","plan-healthcare.html","https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=88"],["Safer streets","Back neighbourhood policing and practical action on antisocial behaviour.","plan-safer-streets.html","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=88"],["Fixing our roads","Push for better roads and more reliable transport.","plan-roads.html","https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1600&q=88"],["Backing local business","Support high streets and local employers.","plan-business.html","https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=88"]];pg.innerHTML=ps.map(p=>`<article class="policy-local-card"><div class="policy-local-image" style="background-image:url('${p[3]}')"></div><div><h3>${p[0]}</h3><p>${p[1]}</p><a href="${p[2]}?area=${k}">Read the plan</a></div></article>`).join("")}const eg=document.getElementById("areaEventGrid");if(eg)eg.innerHTML=h.events.map((e,i)=>areaCard(e[4],e[0],`${e[1]} · ${e[2]} · ${e[3]}`,l.events[i]+`?area=${k}`,"View event")).join("")}
function localFirst(k){const a=AREAS[k];if(!a)return;[["newsAllGrid","newsLocalGrid","newsRestGrid","newsLocalSection","newsLocalTitle","Latest from "],["eventsAllGrid","eventsLocalGrid","eventsRestGrid","eventsLocalSection","eventsLocalTitle","Events in "]].forEach(([s,l,r,sec,t,prefix])=>{const src=document.getElementById(s),local=document.getElementById(l),rest=document.getElementById(r),section=document.getElementById(sec);if(!src||!local||!rest||!section)return;local.innerHTML="";rest.innerHTML="";Array.from(src.children).forEach(card=>{const clone=card.cloneNode(true);if(card.dataset.area===k){const body=clone.querySelector(".card-body");if(body){const b=document.createElement("div");b.className="area-card-badge";b.textContent="In "+a.name;body.insertBefore(b,body.firstChild)}local.appendChild(clone)}else rest.appendChild(clone)});src.style.display="none";section.style.display="";const h=document.getElementById(t);if(h)h.textContent=prefix+a.name});const nr=document.getElementById("newsRestTitle");if(nr)nr.textContent="More from across Bloggs Town";const er=document.getElementById("eventsRestTitle");if(er)er.textContent="More events across Bloggs Town"}
function applyArea(k){const a=AREAS[k];if(!a)return;const s=document.getElementById("localStatus"),n=document.getElementById("localStatusName");if(s&&n){n.textContent=a.name;s.classList.add("visible")}renderHome(k);renderHub(k);localFirst(k);decorate(k)}
function initAreas(){document.querySelectorAll("[data-area-form]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();const k=resolveArea(f.querySelector("input")?.value||"");if(!k)return;setArea(k);const u=new URL(location.href);u.searchParams.set("area",k);history.replaceState({},"",u)}));document.querySelectorAll("[data-area-choice]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.areaChoice;if(!AREAS[k])return;setArea(k);const u=new URL(location.href);u.searchParams.set("area",k);history.replaceState({},"",u)}));const c=document.getElementById("clearArea");if(c)c.addEventListener("click",clearArea)}
function initForms(){document.querySelectorAll("form[data-demo-form]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();const fields={};new FormData(f).forEach((v,k)=>fields[k]=v);try{sessionStorage.setItem("candidateAction",JSON.stringify({type:f.dataset.demoForm,area:getArea(),source:source(),fields}))}catch(err){}location.href=buildUrl(f.dataset.thanks||"sign-up-thanks.html",getArea())}))}
function initPreferences(){const f=document.getElementById("preferencesForm");if(!f)return;const a=getArea();if(a&&AREAS[a]){const t=document.getElementById("prefAreaTitle");if(t)t.textContent="Updates from "+AREAS[a].name}f.addEventListener("submit",e=>{e.preventDefault();const p={};new FormData(f).forEach((v,k)=>p[k]=true);try{localStorage.setItem("candidatePreferences",JSON.stringify(p))}catch(err){}const s=document.getElementById("prefSaved");if(s)s.style.display="inline"})}
function initThanks(){const c=document.body.dataset.thanksContext;if(!c)return;let a={};try{a=JSON.parse(sessionStorage.getItem("candidateAction")||"{}")}catch(e){}const area=a.area||getArea();if(area&&AREAS[area]){const t=document.getElementById("thanksLocalTitle"),x=document.getElementById("thanksLocalText"),l=document.getElementById("thanksLocalLink");if(t)t.textContent="What’s happening in "+AREAS[area].name;if(x)x.textContent="See local news, campaigns and events.";if(l)l.href="area.html?area="+area}const nt=document.getElementById("thanksNextTitle"),nx=document.getElementById("thanksNextText"),nl=document.getElementById("thanksNextLink");if(c==="campaign"){if(nt)nt.textContent="Help Joe campaign locally";if(nx)nx.textContent="Turn your support into visible local action.";if(nl)nl.href=area?"volunteer.html?area="+area:"volunteer.html"}if(c==="survey"){if(nt)nt.textContent="See the local campaign";if(nx)nx.textContent="Find the campaigns Joe is running near you.";if(nl)nl.href=area?"area.html?area="+area:"campaigns.html"}if(c==="event"){if(nt)nt.textContent="Help elect Joe";if(nx)nx.textContent="See how you could help the local campaign.";if(nl)nl.href=area?"volunteer.html?area="+area:"volunteer.html"}if(c==="signup"){if(nt)nt.textContent="Choose your updates";if(nx)nx.textContent="Fine-tune what you receive from Joe.";if(nl)nl.href="preferences.html"}if(c==="donation"){if(nt)nt.textContent="Stay involved";if(nx)nx.textContent="See another way to help Joe win.";if(nl)nl.href="volunteer.html"}}

function initQuickPolls(){
  document.querySelectorAll("[data-quick-poll]").forEach(function(poll){
    poll.querySelectorAll("button").forEach(function(button){
      button.addEventListener("click",function(){
        poll.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
        button.classList.add("selected");
        try{
          const votes=JSON.parse(localStorage.getItem("candidatePolls")||"{}");
          votes.home_priority=button.dataset.value||button.textContent.trim();
          localStorage.setItem("candidatePolls",JSON.stringify(votes));
        }catch(e){}
        const result=poll.parentElement.querySelector("[data-quick-poll-result]");
        if(result)result.classList.add("visible");
      });
    });
  });
}
function initCampaignBuilder(){
  const options=document.querySelector("[data-builder-options]");
  if(!options)return;
  const details=document.getElementById("volunteerDetails");
  const field=document.getElementById("helpType");
  options.querySelectorAll("[data-help]").forEach(function(button){
    button.addEventListener("click",function(){
      options.querySelectorAll("[data-help]").forEach(b=>b.classList.remove("selected"));
      button.classList.add("selected");
      if(field)field.value=button.dataset.help||button.textContent.trim();
      if(details){
        details.classList.add("visible");
        details.scrollIntoView({behavior:"smooth",block:"start"});
      }
    });
  });
}

function initPinboard(){
  const board=document.getElementById("localPinboard");
  const form=document.getElementById("pinboardForm");
  if(!board||!form)return;
  const seeded={
    "town-centre":[
      ["Bring empty shops back into use","The high street needs more reasons to visit after 5pm.","Sarah"],
      ["Sort out parking","Short visits should be easier for shoppers and local businesses.","David"],
      ["Make the centre feel safer","More visible action on antisocial behaviour in the evening.","Maya"]
    ],
    "north-bloggs":[
      ["More visible neighbourhood policing","People want to know who is responsible for recurring problems.","Tom"],
      ["Protect the local bus","It is a lifeline for older residents and people without cars.","June"],
      ["Fix the worst potholes","Some roads have been patched repeatedly without lasting repair.","Kieran"]
    ],
    "little-bloggs":[
      ["Keep the village bus running","Losing it would make getting to work and appointments much harder.","Helen"],
      ["Protect the GP service","Getting an appointment locally matters to everyone.","Aisha"],
      ["Slow traffic through the centre","The main road feels unsafe at busy times.","Mark"]
    ],
    "east-bloggs":[
      ["More apprenticeships","Young people need clearer routes into good local jobs.","Ben"],
      ["Better road links","Congestion is making the commute harder every year.","Rachel"],
      ["Support independent businesses","Small employers need a stronger voice.","Imran"]
    ],
    "the-villages":[
      ["Keep rural bus links","People should not be forced to own a car to access basic services.","Sue"],
      ["Protect village amenities","Losing shops and community spaces changes the character of a place.","John"],
      ["Fix rural roads properly","Repeated patching is not enough.","Anna"]
    ]
  };
  const area=getArea()||"town-centre";
  function getPins(){
    let stored=[];
    try{stored=JSON.parse(localStorage.getItem("candidatePins:"+area)||"[]")}catch(e){}
    return [...(seeded[area]||[]),...stored];
  }
  function render(){
    board.innerHTML=getPins().slice(0,6).map((p,i)=>`<article class="pin ${i>=3?"pin-new":""}"><h3>${p[0]}</h3><p>${p[1]||"A local idea submitted to the campaign."}</p><small>${p[2]||"Local resident"} · ${AREAS[area]?.name||"Bloggs Town"}</small></article>`).join("");
  }
  render();
  form.addEventListener("submit",function(e){
    e.preventDefault();
    const fd=new FormData(form);
    const change=(fd.get("change")||"").toString().trim();
    const name=(fd.get("name")||"Local resident").toString().trim()||"Local resident";
    if(!change)return;
    let stored=[];
    try{stored=JSON.parse(localStorage.getItem("candidatePins:"+area)||"[]")}catch(err){}
    stored.unshift([change,"Submitted for moderation.",name]);
    try{localStorage.setItem("candidatePins:"+area,JSON.stringify(stored.slice(0,10)))}catch(err){}
    form.reset();
    render();
  });
}
captureSource();initMobile();initAreas();initForms();initPreferences();initThanks();initQuickPolls();initCampaignBuilder();initPinboard();const area=getArea();if(area&&AREAS[area])applyArea(area);
})();

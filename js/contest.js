(()=>{
"use strict";
const q=id=>document.getElementById(id),main=document.querySelector("main");
const LS="ct-db",SS="ct-sess",QK="ct-queue",MS=150,NP=20,CAT={text:"Matn",code:"Kod"};
const DBU=String((window.CT_CONFIG||{}).dbUrl||"").trim().replace(/\/+$/,""),ON=!!DBU;
const E=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const enc=k=>[...k].map(c=>/[a-z0-9_-]/.test(c)?c:"~"+c.codePointAt(0).toString(16)+"~").join(""),dec=k=>k.replace(/~([0-9a-f]+)~/g,(_,h)=>String.fromCodePoint(parseInt(h,16)));
const dc=n=>{let x=(n*2654435761)>>>0,s="";for(let i=0;i<8;i++){x=(Math.imul(x,1664525)+1013904223)>>>0;s+=(x>>>16)%10}return s[0]==="0"?"7"+s.slice(1):s};
const DCS=Array.from({length:NP},(_,i)=>dc(i+1));
const hs=async s=>{try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("ct|"+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){let h=5381;for(const c of"ct|"+s)h=(h*33^c.charCodeAt(0))>>>0;return"f"+h}};
const nm=v=>v.trim().replace(/\s+/g," ");

/* ---------- ma'lumot qatlami: server (Firebase REST) yoki lokal ---------- */
const db=ON?{
 async req(m,p,b){const r=await fetch(DBU+"/ct/"+p+".json",{method:m,body:b===undefined?undefined:JSON.stringify(b)});if(!r.ok)throw new Error("http "+r.status);return r.json()},
 get(p){return this.req("GET",p)},set(p,v){return this.req("PUT",p,v)},del(p){return this.req("DELETE",p)}
}:(()=>{
 const rd=()=>{try{return JSON.parse(localStorage.getItem(LS))||{}}catch(e){return{}}},wr=t=>localStorage.setItem(LS,JSON.stringify(t));
 const walk=(t,p,mk)=>{const a=p.split("/");let o=t;for(let i=0;i<a.length-1;i++){if(o[a[i]]===undefined||o[a[i]]===null||typeof o[a[i]]!=="object"){if(!mk)return[null];o[a[i]]={}}o=o[a[i]]}return[o,a[a.length-1]]};
 return{async get(p){const[o,k]=walk(rd(),p,0);return o&&o[k]!==undefined?o[k]:null},
  async set(p,v){const t=rd(),[o,k]=walk(t,p,1);o[k]=v;wr(t)},
  async del(p){const t=rd(),[o,k]=walk(t,p,0);if(o){delete o[k];wr(t)}}};
})();

/* ---------- panel ma'lumoti ---------- */
const dflt=n=>({name:"Panel "+n,pw:"",code:dc(n),st:{},race:null,rp:{},asg:{},on:{}});
let Q=[];try{Q=JSON.parse(localStorage.getItem(QK))||[]}catch(e){}
const pq=()=>{try{localStorage.setItem(QK,JSON.stringify(Q))}catch(e){}};
const C={},snap=n=>C[n]||dflt(n);
const addSum=(m,r)=>{const c=r.m==="code"?"c":"t";m["b"+c]=Math.max(m["b"+c]||0,r.s);m["w"+c]=Math.max(m["w"+c]||0,r.w);m["t"+c]=(m["t"+c]||0)+1;return m};
const sumOf=res=>{const m={};res.forEach(r=>addSum(m,r));return m};
function norm(raw,n){
 const p=dflt(n),m=raw&&raw.meta||{},rs=raw&&raw.res||{},sm=raw&&raw.sum||{},st=raw&&raw.st||{};
 if(m.name)p.name=m.name;p.pw=m.pw||"";if(m.code)p.code=m.code;
 new Set([...Object.keys(st),...Object.keys(sm)]).forEach(ek=>{
  const nme=(st[ek]&&st[ek].n)||(sm[ek]&&sm[ek].n);if(!nme)return;
  const res=Object.values(rs[ek]||{}).filter(r=>r&&r.w!=null).sort((a,b)=>a.t-b.t).slice(-60);
  p.st[dec(ek)]={n:nme,c:(st[ek]&&st[ek].c)||0,res,sum:sm[ek]?{...sm[ek]}:sumOf(res)}});
 p.race=raw&&raw.race||null;p.rp=raw&&raw.rp||{};p.asg=raw&&raw.asg||{};p.on=raw&&raw.on||{};return p}
async function load(n,full){
 let raw;
 if(full)raw=await db.get("p/"+n);
 else{const me=ses&&ses.p===n?enc(ses.k):"_";
  const[nm_,sum,race,rp,mine,asg]=await Promise.all(["meta/name","sum","race","rp","st/"+me,"asg/"+me].map(x=>db.get("p/"+n+"/"+x)));
  raw={meta:{name:nm_},sum,race,rp,st:mine?{[me]:mine}:{},asg:asg?{[me]:asg}:{}}}
 const p=norm(raw,n);
 Q.forEach(it=>{if(it.n===n&&it.sum&&p.st[it.k])p.st[it.k].sum={...it.sum}});
 C[n]=p;return p}
async function resolve(c){
 const n=await db.get("codes/"+c);
 if(n&&+n>=1&&+n<=NP&&await db.get("p/"+n+"/meta/code")===c)return+n;
 const i=DCS.indexOf(c)+1;
 if(i){const m=await db.get("p/"+i+"/meta/code");if(m==null||m===c)return i}
 return 0}
const saveMeta=n=>{const p=snap(n);return db.set("p/"+n+"/meta",{name:p.name,pw:p.pw,code:p.code})};

/* ---------- natijani yuborish navbati (yo'qolmaydi) ---------- */
let net=1,flushing=0;
function status(){const e=q("cst");if(!e)return;e.textContent=!ON?"💾 lokal":Q.length?"⏳ "+Q.length+" yuborilmoqda":net?"✓ saqlandi":"⚠ aloqa yo‘q"}
async function flush(){
 if(flushing||!Q.length)return;flushing=1;
 try{while(Q.length){await db.set(Q[0].path,Q[0].v);Q.shift();pq()}net=1}catch(e){net=0}
 flushing=0;status()}
function sendRes(n,k,e,sum){
 const id=e.t.toString(36)+Math.random().toString(36).slice(2,6),s=snap(n).st[k];
 Q.push({n,k,path:"p/"+n+"/res/"+enc(k)+"/"+id,v:e});
 Q.push({n,k,path:"p/"+n+"/sum/"+enc(k),v:{n:s?s.n:k,...sum},sum:{...sum}});pq();status();flush()}

/* ---------- sessiya / holat ---------- */
let ses=null,adm=0,pend=0,tn=0,lcat="all";
try{ses=JSON.parse(localStorage.getItem(SS))}catch(e){}
const ps=()=>{try{ses?localStorage.setItem(SS,JSON.stringify(ses)):localStorage.removeItem(SS)}catch(e){}};
if(ses&&!(ses.p>0&&ses.p<=NP&&ses.k))ses=null;
let rtl=60,racing=0,rjoined="",rtxt="",rgo=0,rstart=0,rmsg="",cdT=0,lastSent="";

const ov=document.createElement("div");ov.id="ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");document.body.appendChild(ov);
const open=h=>{ov.innerHTML=h;ov.classList.add("on");document.body.classList.add("gate");main.inert=true;ov.scrollTop=0;const i=ov.querySelector("input");if(i)i.focus()};
const close=()=>{ov.classList.remove("on");document.body.classList.remove("gate");main.inert=!!cdT;ov.innerHTML="";const b=q("box");if(b)b.focus()};
const er=m=>{const e=q("er");if(e)e.textContent=m};
const BK='<button data-a="h">Orqaga</button>';
const home=()=>open(`<div class="gw hm"><h1>Code<b>Type</b></h1><p class="sb">Mashq va musobaqa uchun kirish usulini tanlang</p><div class="rc"><button data-a="s"><span>🎓</span><b>O‘quvchi bo‘lib kirish</b><small>8 xonali panel kodi bilan</small></button><button data-a="t"><span>🧑‍🏫</span><b>O‘qituvchi bo‘lib kirish</b><small>Panel paroli bilan</small></button><button data-a="l"><span>🎹</span><b>Klaviatura darslari</b><small>Yangi boshlovchilar uchun, kirishsiz</small></button><button data-a="g"><span>🎮</span><b>O‘yinlar</b><small>Poyga va sharlar, kirishsiz</small></button><button data-a="p"><span>✏️</span><b>Oddiy mashq</b><small>Kodsiz, kirishsiz: matn yoki kod yozing</small></button><button data-a="ab"><span>ℹ️</span><b>Sayt haqida</b><small>Imkoniyatlar va muallif</small></button></div></div>`);

/* ---------- reyting ---------- */
function rows(n,cat){return Object.values(snap(n).st).map(s=>{const m=s.sum||{},bt=m.bt||0,bc=m.bc||0,tt=m.tt||0,tc=m.tc||0;
 return{n:s.n,k:s.n.toLowerCase(),sc:cat==="text"?bt:cat==="code"?bc:bt+bc,w:Math.max(cat==="code"?0:m.wt||0,cat==="text"?0:m.wc||0),t:cat==="text"?tt:cat==="code"?tc:tt+tc}}).filter(r=>r.t).sort((a,b)=>b.sc-a.sc||b.w-a.w)}
function lb(n,cat){
 const L=rows(n,cat),top=L.length?L[0].sc||1:1;
 return`<div class="tb">${[["all","Umumiy"],["text","Matn"],["code","Kod"]].map(([k,t])=>`<button data-a="lc" data-c="${k}" data-n="${n}" class="${k===cat?"on":""}">${t}</button>`).join("")}</div>`+(L.length?`<div>${L.slice(0,8).map((r,i)=>`<div class="ln"><span>${i+1}. ${E(r.n)}</span><div><i style="width:${Math.max(8,r.sc/top*100)}%"><b>${i?"🚗":"🏎️"}</b></i></div><em>${r.sc}</em></div>`).join("")}</div><table class="tt"><tr><th>#</th><th>Ism</th><th>Ball</th><th>wpm</th><th>Test</th></tr>${L.map((r,i)=>`<tr class="${ses&&r.k===ses.k&&n===ses.p?"me":""}"><td>${i+1}</td><td>${E(r.n)}</td><td>${r.sc}</td><td>${r.w}</td><td>${r.t}</td></tr>`).join("")}</table>`:'<p class="sb">Hali natija yo‘q. Birinchi bo‘ling!</p>');
}

/* ---------- poyga ---------- */
let skew=0;const nowS=()=>Date.now()+skew;
async function sync(){if(!ON)return;try{const a=Date.now(),r=await fetch(DBU+"/healthz",{cache:"no-store"}),b=Date.now(),j=await r.json();if(j&&j.now)skew=j.now+(b-a)/2-b}catch(e){}}
const MEDAL=["🥇","🥈","🥉"];
function standings(p){
 const r=p.race;if(!r)return[];
 return Object.entries(p.rp||{}).filter(([,x])=>x&&x.rid===r.id).map(([k,x])=>({k,...x,f:x.f?1:0}))
  .sort((a,b)=>b.f-a.f||(b.f?(b.w-a.w||(b.a||0)-(a.a||0)||(a.ft||0)-(b.ft||0)):(b.pr-a.pr||b.w-a.w)))}
function ptable(p){
 const r=p.race,L=standings(p);if(!r||!L.length||(!L.some(x=>x.f)&&r.state!=="done"))return"";
 const me=ses?enc(ses.k):"",done=r.state==="done";
 return`<div class="pt"><table class="tt"><tr><th>O‘rin</th><th>Ism</th><th>wpm</th><th>Aniqlik</th><th>Vaqt</th></tr>${L.map((x,i)=>`<tr class="${x.k===me?"me":""}"><td>${x.f||done?(MEDAL[i]||i+1):"…"}</td><td>${E(x.n)}${x.k===me?" (siz)":""}</td><td>${x.w}</td><td>${x.f?(x.a||0)+"%":"—"}</td><td>${x.f?(x.ft||0)+" s":x.pr>=0?Math.round(x.pr*100)+"%":""}</td></tr>`).join("")}</table></div>`}
function lanes(p,all){
 const r=p.race;if(!r)return"";const me=ses?enc(ses.k):"";
 const L=Object.entries(p.rp||{}).filter(([,x])=>x&&x.rid===r.id).map(([k,x])=>({k,...x})).sort((a,b)=>b.pr-a.pr||(a.ft||1e9)-(b.ft||1e9)||b.w-a.w);
 if(!L.length)return'<p class="sb">Hali qatnashchi yo‘q.</p>';
 let V=all?L:L.slice(0,8);if(!all&&me&&!V.some(x=>x.k===me)){const m=L.find(x=>x.k===me);if(m)V=V.concat(m)}
 return V.map(x=>{const i=L.indexOf(x);return`<div class="ln"><span>${i+1}. ${E(x.n)}${x.k===me?" (siz)":""}</span><div><i style="width:${Math.max(4,x.pr*100)}%"><b>${i?"🚗":"🏎️"}</b></i></div><em>${x.f?"🏁 ":""}${x.w}</em></div>`}).join("")}
function renderRbar(){
 const d=q("rbar");if(!d||!ses)return;applyLock();const p=snap(ses.p),r=p.race;let h="";
 if(r&&r.state==="wait"&&!racing&&rjoined!==r.id)h=`<div class="card show"><strong>🏁 Poyga ochildi!</strong> <span class="sb">${CAT[r.m]}${r.m==="code"?" · "+E(r.lang):""}</span><br><button class="cta" data-a="jr">Qo‘shilish</button></div>`;
 else if(r&&(racing||rjoined===r.id)){
  const L=standings(p),i=L.findIndex(x=>x.k===enc(ses.k)),mine=i>=0&&L[i].f?`<p class="ok">🏁 ${r.state==="done"?"Yakuniy o‘rningiz":"Siz tugatdingiz, hozircha"}: <b>${i+1}</b>-o‘rin${r.state==="done"?"":". Boshqalar tugatishini kuting…"}</p>`:r.state==="done"&&i>=0?`<p class="ok">Poyga tugadi. Yakuniy o‘rningiz: <b>${i+1}</b></p>`:"";
  h=`<div class="card show"><strong>🏁 Poyga</strong>${r.state==="done"?' <span class="sb">tugadi</span>':""} ${rmsg?`<b class="ok"> ${E(rmsg)}</b>`:racing&&r.state==="wait"?'<span class="sb"> O‘qituvchi boshlashini kuting…</span>':""}${mine}${r.state==="done"?"":lanes(p)}${ptable(p)}</div>`}
 if(d.dataset.h!==h){d.innerHTML=h;d.dataset.h=h}}
const SRC={en:"English",uz:"O‘zbek",tech:"Dasturlash"};
function lockWant(){
 if(!ses)return null;const p=snap(ses.p),r=p.race;
 if(r&&r.state!=="done"&&(racing||rjoined===r.id))return{k:"r",m:r.m,tl:r.tl,lang:r.lang};
 const a=p.asg[enc(ses.k)];return a?{k:"a",...a}:null}
function applyLock(){
 const b=document.body,w=lockWant();
 b.classList.toggle("locked",!!w);b.classList.toggle("rlock",!!w&&w.k==="r");
 const e=q("lkb");
 if(e){const h=w?`🔒 ${w.k==="r"?"Poyga bo‘limi":"O‘qituvchi belgilagan bo‘lim"}: <b>${CAT[w.m]}</b>${w.m==="code"?" · "+E(w.lang||""):w.src?" · "+E(SRC[w.src]||""):""}${w.m==="text"&&w.tl?" · "+w.tl+" soniya":""}<small>Rejim va vaqtni o‘zgartirib bo‘lmaydi.</small>`:"";if(e.dataset.h!==h){e.innerHTML=h;e.dataset.h=h}}
 if(w&&w.k==="a"){
  const ok=S.m===w.m&&(w.m==="code"?(!w.lang||S.lang===w.lang):(S.tl===(w.tl||60)&&(!w.src||S.src===w.src)));
  if(!ok){S.m=w.m;if(w.m==="text"){S.tl=w.tl||60;if(w.src)S.src=w.src}else if(w.lang)S.lang=w.lang;build();init()}}}
function setMsg(m){rmsg=m;renderRbar()}
function countdown(gt){
 if(cdT)return;main.inert=true;
 const t=()=>{const ms=gt-nowS();if(ms>0){setMsg(String(Math.ceil(ms/1000)));return}
  clearInterval(cdT);cdT=0;rstart=1;main.inert=document.body.classList.contains("gate");setMsg("Boshlang!");box_focus();setTimeout(()=>setMsg(""),1500)};
 cdT=setInterval(t,100);t()}
function box_focus(){const b=q("box");if(b){b.focus();b.click()}}
function stopRace(){racing=0;rgo=0;rstart=0;RL=0;if(cdT){clearInterval(cdT);cdT=0;main.inert=document.body.classList.contains("gate")}rmsg="";renderRbar()}
function sendProg(final,r){
 if(!ses||!(racing||final))return;const s=snap(ses.p).st[ses.k];if(!s)return;
 const x=stats(),len=Math.max(1,rtxt.length),v={rid:rjoined,n:s.n,pr:+Math.min(1,pos/len).toFixed(3),w:final?r.w:x.w,a:final?r.a:x.a,f:final?1:0,ft:final?r.s:0},sig=JSON.stringify(v);
 if(!final&&sig===lastSent)return;lastSent=sig;
 snap(ses.p).rp[enc(ses.k)]=v;
 db.set("p/"+ses.p+"/rp/"+enc(ses.k),v).catch(()=>{});renderRbar()}
function joinRace(){
 const r=snap(ses.p).race;if(!r||r.state!=="wait")return;
 S.m=r.m;if(r.m==="text")S.tl=r.tl||60;else S.lang=r.lang||S.lang;
 build();T=r.text;init(false);rjoined=r.id;rtxt=r.text;RL=r.text.length;racing=1;rgo=0;rstart=0;lastSent="";
 sendProg(0);renderRbar()}
function rctl(p){
 const r=p.race,L=standings(p),n=L.length;let h="";
 const names=L.map(x=>`<span class="chip">${E(x.n)}</span>`).join("");
 if(!r||r.state==="done")h=`${r?`<p class="ok">Poyga tugadi. Natijalar pastda.</p><button class="cta" data-a="rr">↻ Qayta boshlash (${CAT[r.m]}${r.m==="code"?" · "+E(r.lang):" · "+(r.tl||rtl)+" soniya"}, yangi matn)</button><p class="sb">Yoki boshqa poyga tanlang:</p>`:""}<p class="sb">Yangi poyga: hamma bir xil matnni yozadi, natijasi (wpm) baland chiqqan g‘olib. Boshlangach o‘quvchilar qulflangan poyga bo‘limiga o‘tadi va rejim hamda vaqtni o‘zgartira olmaydi.</p><p class="sb">Matn poygasi vaqti (soniya):</p><div class="tb">${[15,30,60,120].map(v=>`<button data-a="rt" data-v="${v}" class="${v===rtl?"on":""}">${v}</button>`).join("")}</div><p class="sb">Turini tanlang va poygani oching:</p><button data-a="rn" data-m="text" data-s="en">Matn (English)</button><button data-a="rn" data-m="text" data-s="uz">Matn (O‘zbek)</button><button data-a="rn" data-m="code">Kod</button>`;
 else if(r.state==="wait")h=`<p class="ok">1-qadam: poyga ochiq (${CAT[r.m]}${r.m==="code"?" · "+E(r.lang):" · "+r.tl+" soniya"}). O‘quvchilar “Qo‘shilish” ni bosadi.</p><p class="sb">Qo‘shilganlar: <b>${n}</b></p><div>${names}</div><button class="cta" data-a="rg" ${n?"":"disabled"}>▶ Boshlash (5 soniyadan keyin)</button><button data-a="re">Bekor qilish</button>`;
 else h=`<p class="ok">Poyga ketmoqda… ${L.filter(x=>x.f).length}/${n} tugatdi</p><button data-a="re">■ Hozir tugatish</button>`;
 return h+(r&&r.state!=="done"&&n?'<div style="margin-top:10px">'+lanes(p,1)+"</div>":"")+ptable(p)}

/* ---------- panellar ---------- */
function bar(){
 let b=q("cbar");if(!ses){if(b)b.remove();["rbar","lkb"].forEach(i=>{const r=q(i);if(r)r.remove()});document.body.classList.remove("locked","rlock");return}
 if(!b){b=document.createElement("div");b.id="cbar";main.prepend(b)}
 if(!q("rbar")){const d=document.createElement("div");d.id="rbar";b.after(d)}
 if(!q("lkb")){const l=document.createElement("div");l.id="lkb";b.after(l)}
 const p=snap(ses.p),s=p.st[ses.k];
 b.innerHTML=`<span>👤 <b>${E(s?s.n:ses.k)}</b> · ${E(p.name)}<small id="cst"></small></span><span><button data-a="lbo">🏆 Reyting</button><button data-a="out">Chiqish</button></span>`;
 status();renderRbar()}
const OPTS=()=>[["","Erkin (qulfsiz)"],["t:en","Matn · English"],["t:uz","Matn · O‘zbek"],["t:tech","Matn · Dasturlash"],...Object.keys(SN).map(l=>["c:"+l,"Kod · "+l]),["c:Tasodifiy","Kod · Tasodifiy"]];
const sel=(id,cur)=>`<select class="ci" id="${id}">${OPTS().map(([v,t])=>`<option value="${E(v)}"${v===cur?" selected":""}>${E(t)}</option>`).join("")}</select>`;
const tsel=(id,cur)=>`<select class="ci" id="${id}">${[15,30,60,120].map(v=>`<option value="${v}"${v===cur?" selected":""}>${v} s</option>`).join("")}</select>`;
const alab=a=>a?"🔒 "+(a.m==="code"?"Kod · "+E(a.lang):"Matn · "+E(SRC[a.src]||a.src)+" · "+a.tl+" s"):"Erkin";
const acur=a=>a?(a.m==="code"?"c:"+a.lang:"t:"+a.src):"";
const asig=p=>Object.entries(p.st).map(([k,s])=>k+JSON.stringify(p.asg[enc(k)]||0)).join("|");
function asl(p){
 const L=Object.entries(p.st).sort((a,b)=>a[1].n.localeCompare(b[1].n));
 return`<div class="ar"><b class="an">Hamma o‘quvchiga</b>${sel("gsel","")}${tsel("gtime",60)}<button class="cta" data-a="ab">Hammasiga belgilash</button></div>`+(L.map(([k,s],i)=>{const a=p.asg[enc(k)];return`<div class="ar"><span class="an">${E(s.n)} <small>${alab(a)}</small></span>${sel("sv"+i,acur(a))}${tsel("tv"+i,a&&a.tl||60)}<button data-a="ao" data-k="${E(k)}" data-i="${i}">Belgilash</button></div>`}).join("")||'<p class="sb">Hali o‘quvchi yo‘q.</p>')}
const parseA=(v,t)=>{if(!v)return null;const[x,y]=v.split(":");return x==="t"?{m:"text",src:y,tl:+t,t:Date.now()}:{m:"code",lang:y,tl:0,t:Date.now()}};
function refreshAsl(p){const e=q("asl");if(!e)return;const sg=asig(p);if(e.dataset.sig===sg)return;e.innerHTML=asl(p);e.dataset.sig=sg}
const stl=p=>{const L=Object.entries(p.st).sort((a,b)=>a[1].n.localeCompare(b[1].n));
 return L.map(([k,s])=>{const w=s.res.map(r=>r.w),av=s.res.length?Math.round(s.res.reduce((a,r)=>a+r.a,0)/s.res.length):0;return`<details class="sd" data-k="${E(k)}"><summary><b><span class="od${isOn(p,k)?" on":""}"></span>${E(s.n)}</b><span>${s.res.length} test · ${Math.max(0,...w)} wpm · ${av}%</span></summary>${s.res.slice(-10).reverse().map(r=>`<p>${new Date(r.t).toLocaleString()} · ${CAT[r.m]||""}${r.l?" ("+E(r.l)+")":""} · ${r.w} wpm · ${r.a}% · ball ${r.s}</p>`).join("")||"<p>Natija yo‘q</p>"}<button data-a="ds" data-k="${E(k)}">O‘chirish</button></details>`}).join("")||'<p class="sb">Hali o‘quvchi yo‘q.</p>'};
/* ---------- onlayn / oflayn ---------- */
const ONL=35000;
const isOn=(p,k)=>{const t=p.on&&p.on[enc(k)];return!!t&&nowS()-t<ONL}
const ago=ms=>{const m=Math.floor(ms/60000);return m<1?"hozirgina":m<60?m+" daqiqa oldin":m<1440?Math.floor(m/60)+" soat oldin":Math.floor(m/1440)+" kun oldin"};
function onl(p){
 const L=Object.entries(p.st).map(([k,s])=>{const t=p.on&&p.on[enc(k)];return{n:s.n,on:isOn(p,k),t:t||0}}).sort((a,b)=>b.on-a.on||b.t-a.t||a.n.localeCompare(b.n));
 const c=L.filter(x=>x.on).length;
 return`<p class="onh"><span class="od on"></span> Onlayn: <b>${c}</b> <span class="od"></span> Oflayn: <b>${L.length-c}</b></p>`+(L.length?`<div class="onl">${L.map(x=>`<div class="or ${x.on?"on":""}"><span class="od ${x.on?"on":""}"></span><span class="on_n">${E(x.n)}</span><small>${x.on?"onlayn":x.t?ago(nowS()-x.t):"oflayn"}</small></div>`).join("")}</div>`:'<p class="sb">Hali o‘quvchi yo‘q.</p>')}
function refreshOnl(p){const e=q("onl");if(!e)return;const sg=Object.keys(p.st).map(k=>k+(isOn(p,k)?1:0)+(p.on[enc(k)]?Math.floor(nowS()/60000)-Math.floor(p.on[enc(k)]/60000):"")).join("|");if(e.dataset.sig===sg)return;e.innerHTML=onl(p);e.dataset.sig=sg;
 Object.entries(p.st).forEach(([k,s])=>{const d=document.querySelector('#stl details[data-k="'+(window.CSS&&CSS.escape?CSS.escape(k):k)+'"] .od');if(d)d.classList.toggle("on",isOn(p,k))})}
function refreshStl(p){
 const e=q("stl");if(!e)return;
 const sig=Object.values(p.st).map(s=>s.n+":"+s.res.length).join("|");if(e.dataset.sig===sig)return;
 const op=[...e.querySelectorAll("details[open]")].map(d=>d.dataset.k);
 e.innerHTML=stl(p);e.dataset.sig=sig;e.querySelectorAll("details").forEach(d=>{if(op.includes(d.dataset.k))d.open=true});
 const c=q("stc");if(c)c.textContent=`O‘quvchilar (${Object.keys(p.st).length}/${MS})`}
function dash(n,warn,msg){
 const p=snap(n);
 open(`<div class="gw wide"><div class="hd"><h2>${E(p.name)}</h2><span><button data-a="dr">Yangilash</button> <button data-a="out">Chiqish</button></span></div>${warn?`<p class="wn">Standart parol ishlatilmoqda. Pastda yangi parol o‘rnating.</p>`:""}${ON?"":`<p class="wn">Server ulanmagan: natijalar faqat shu brauzerda saqlanadi. <b>js/config.js</b> ga Firebase manzilini yozing.</p>`}${msg?`<p class="ok">${E(msg)}</p>`:""}
<div class="g2"><section class="card show"><strong>Panel kodi</strong><div class="code">${p.code}</div><p class="sb">O‘quvchilar shu 8 xonali kod bilan kiradi.</p><button data-a="nc">Yangi kod yaratish</button></section>
<section class="card show"><strong>Sozlamalar</strong><label>Panel nomi</label><input id="pnm" class="ci" maxlength="30" value="${E(p.name)}"><label>Yangi parol (ixtiyoriy)</label><input id="npw" type="password" class="ci" placeholder="kamida 4 belgi" autocomplete="new-password"><button class="cta" data-a="ss">Saqlash</button><div class="er" id="er" role="alert"></div></section></div>
<section class="card show"><strong>👥 O‘quvchilar holati</strong><div id="onl">${onl(p)}</div></section>
<section class="card show"><strong>🏁 Poyga</strong><div id="rcn">${rctl(p)}</div></section>
<section class="card show"><strong>🔒 O‘quvchi bo‘limlari</strong><p class="sb">Har bir o‘quvchiga alohida bo‘lim (matn yoki kod) va vaqt belgilang. Belgilangach o‘quvchi uni o‘zgartira olmaydi. “Erkin” qulfni ochadi.</p><div id="asl" data-sig="${E(asig(p))}">${asl(p)}</div></section>
<section class="card show"><strong>Reyting</strong><div id="lbb">${lb(n,lcat)}</div></section>
<section class="card show"><strong id="stc">O‘quvchilar (${Object.keys(p.st).length}/${MS})</strong><div class="ad"><input id="an" class="ci" maxlength="30" placeholder="Ism familiya"><button data-a="as">Qo‘shish</button></div>
<div id="stl">${stl(p)}</div>
<p><button data-a="ex">CSV yuklab olish</button> <button data-a="rs">Natijalarni tozalash</button></p></section></div>`);
 const e=q("stl");if(e)e.dataset.sig=Object.values(p.st).map(s=>s.n+":"+s.res.length).join("|")}

/* poyga yaratish: rn (yangi) va rr (qayta boshlash) umumiy */
async function newRace(m,src,lang0,tl){
 const ls=Object.keys(SN),ol=S.lang,os=S.src;let text,lang="";
 if(m==="text"){S.src=src||"en";text=gen(Math.max(20,Math.round(tl*1.2)));S.src=os}
 else{lang=ls.includes(lang0)?lang0:ls.includes(S.lang)?S.lang:ls[Math.random()*ls.length|0];S.lang=lang;text=pickCode();S.lang=ol}
 const r={id:Date.now().toString(36),state:"wait",m,lang,src:m==="text"?(src||"en"):"",tl:m==="text"?tl:0,text,c:Date.now()};
 await db.del("p/"+adm+"/rp");await db.set("p/"+adm+"/race",r);const p=snap(adm);p.race=r;p.rp={};q("rcn").innerHTML=rctl(p)}

const act={
 h:home,x:close,
 s:()=>open(`<div class="gw"><h2>Panel kodi</h2><p class="sb">O‘qituvchingiz bergan 8 xonali kodni kiriting</p><input id="cd" class="ci big" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="········"><div class="er" id="er" role="alert"></div><button class="cta" data-a="sc">Davom etish</button>${BK}</div>`),
 sc:async()=>{const c=q("cd").value;if(c.length!==8)return er("Kod noto‘g‘ri. 8 ta raqamni tekshiring.");er("Tekshirilmoqda…");const n=await resolve(c);if(!n)return er("Kod noto‘g‘ri. 8 ta raqamni tekshiring.");
  pend=n;await load(n);open(`<div class="gw"><h2>${E(snap(n).name)}</h2><p class="sb">Reytingda ko‘rinadigan ismingizni yozing</p><input id="sn" class="ci" maxlength="30" autocomplete="off" placeholder="Ism familiya"><div class="er" id="er" role="alert"></div><button class="cta" data-a="sn">Musobaqaga kirish</button><button data-a="s">Orqaga</button></div>`)},
 sn:async()=>{const n=nm(q("sn").value),k=n.toLowerCase();if(n.length<2)return er("Ism kamida 2 ta harf bo‘lsin.");
  const p=await load(pend),all=await db.get("p/"+pend+"/st")||{};
  if(!all[enc(k)]){if(Object.keys(all).length>=MS)return er("Bu panel to‘lgan ("+MS+" ta o‘quvchi).");const v={n,c:Date.now()};await db.set("p/"+pend+"/st/"+enc(k),v);p.st[k]={...v,res:[],sum:{}}}
  ses={role:"s",p:pend,k};ps();close();bar();poll();beat()},
 t:async()=>{open(`<div class="gw wide"><h2>Panelni tanlang</h2><p class="sb">20 ta panel. Har birining nomi, kodi va paroli alohida.</p><div class="pg">${Array.from({length:NP},(_,i)=>`<button data-a="tp" data-n="${i+1}"><b id="pn${i+1}">${E(snap(i+1).name)}</b><small>Panel ${i+1}</small></button>`).join("")}</div>${BK}</div>`);
  const nn=await Promise.all(Array.from({length:NP},(_,i)=>db.get("p/"+(i+1)+"/meta/name").catch(()=>null)));
  nn.forEach((v,i)=>{const e=q("pn"+(i+1));if(e&&v)e.textContent=v})},
 tp:d=>{tn=+d.n;open(`<div class="gw"><h2>${E(snap(tn).name)}</h2><p class="sb">Panel parolini kiriting. Birinchi marta: <b>admin${tn}</b></p><input id="pw" type="password" class="ci" autocomplete="current-password" placeholder="Parol"><div class="er" id="er" role="alert"></div><button class="cta" data-a="tl">Kirish</button><button data-a="t">Orqaga</button></div>`)},
 tl:async()=>{const v=q("pw").value,p=await load(tn,1),h=await hs(v);if(!(p.pw?h===p.pw:v==="admin"+tn))return er("Parol noto‘g‘ri.");adm=tn;dash(tn,!p.pw)},
 dr:async()=>{await load(adm,1);dash(adm)},
 lc:d=>{lcat=d.c;q("lbb").innerHTML=lb(+d.n,lcat)},
 lbo:async()=>{try{await load(ses.p)}catch(e){}open(`<div class="gw wide"><div class="hd"><h2>🏆 ${E(snap(ses.p).name)}</h2><button data-a="x">Yopish</button></div><div id="lbb">${lb(ses.p,lcat)}</div></div>`)},
 nc:async()=>{const p=snap(adm);let c,t=0;do{c=String(1e7+Math.random()*9e7|0);t++}while((DCS.includes(c)||await db.get("codes/"+c)!=null)&&t<30);
  const old=p.code;p.code=c;await saveMeta(adm);await db.set("codes/"+c,adm);if(old!==c)await db.del("codes/"+old);dash(adm,0,"Yangi kod yaratildi. Eski kod endi ishlamaydi.")},
 ss:async()=>{const p=snap(adm),n=nm(q("pnm").value),w=q("npw").value;if(n.length<2)return er("Panel nomi kamida 2 ta belgi.");if(w&&w.length<4)return er("Parol kamida 4 belgi bo‘lsin.");
  p.name=n;if(w)p.pw=await hs(w);await saveMeta(adm);dash(adm,0,w?"Nom va parol saqlandi.":"Nom saqlandi.")},
 as:async()=>{const n=nm(q("an").value),k=n.toLowerCase(),p=snap(adm);if(n.length<2||p.st[k]||Object.keys(p.st).length>=MS)return;const v={n,c:Date.now()};await db.set("p/"+adm+"/st/"+enc(k),v);p.st[k]={...v,res:[],sum:{}};dash(adm)},
 ao:async d=>{const p=snap(adm),a=parseA(q("sv"+d.i).value,q("tv"+d.i).value),e=enc(d.k);
  if(a){await db.set("p/"+adm+"/asg/"+e,a);p.asg[e]=a}else{await db.del("p/"+adm+"/asg/"+e);delete p.asg[e]}
  const row=q("sv"+d.i).closest(".ar"),sm=row.querySelector("small");sm.innerHTML=alab(a);q("asl").dataset.sig=asig(p)},
 ab:async()=>{const p=snap(adm),a=parseA(q("gsel").value,q("gtime").value);
  if(!a){await db.del("p/"+adm+"/asg");p.asg={}}else{const o={};Object.keys(p.st).forEach(k=>{o[enc(k)]=a});await db.set("p/"+adm+"/asg",o);p.asg=o}
  const c=q("asl");c.innerHTML=asl(p);c.dataset.sig=asig(p)},
 ds:async d=>{if(!confirm("O‘quvchi va uning natijalari o‘chirilsinmi?"))return;const e=enc(d.k);await db.del("p/"+adm+"/st/"+e);await db.del("p/"+adm+"/res/"+e);await db.del("p/"+adm+"/rp/"+e);await db.del("p/"+adm+"/sum/"+e);await db.del("p/"+adm+"/asg/"+e);delete snap(adm).st[d.k];dash(adm)},
 rs:async()=>{if(!confirm("Panelning hamma natijalari tozalansinmi?"))return;await db.del("p/"+adm+"/res");await db.del("p/"+adm+"/sum");Object.values(snap(adm).st).forEach(s=>{s.res=[];s.sum={}});dash(adm,0,"Natijalar tozalandi.")},
 ex:()=>{const p=snap(adm),c=s=>'"'+String(s).replace(/"/g,'""')+'"',L=rows(adm,"all").map((r,i)=>[i+1,c(r.n),r.sc,r.w,r.t].join(","));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff#,Ism,Ball,wpm,Test\n"+L.join("\n")],{type:"text/csv"}));a.download=p.name+".csv";a.click()},
 out:()=>{stopRace();offline();rjoined="";ses=null;adm=0;ps();bar();home()},
 /* poyga: o'qituvchi */
 rt:d=>{rtl=+d.v;q("rcn").innerHTML=rctl(snap(adm))},
 rn:async d=>{await newRace(d.m,d.s||"en",S.lang,rtl)},
 rg:async()=>{await sync();const p=snap(adm);if(!p.race||p.race.state!=="wait")return;const r={...p.race,state:"go",gt:Math.round(nowS())+5000};await db.set("p/"+adm+"/race",r);p.race=r;q("rcn").innerHTML=rctl(p)},
 re:async()=>{await db.set("p/"+adm+"/race/state","done");const p=snap(adm);if(p.race)p.race.state="done";q("rcn").innerHTML=rctl(p)},
 /* poyga: o'quvchi */
 jr:()=>joinRace(),
 /* klaviatura darslari */
 l:()=>{if(window.ctLearn)window.ctLearn.open()},
 g:()=>{if(window.ctGames)window.ctGames.open()},
 p:()=>{close()},
 ab:()=>open(`<div class="gw wide"><h2>Sayt haqida</h2><p class="sb">CodeType: matn va dasturlash kodini tez yozish mashqi va sinf musobaqasi.</p>
<h3>Foydalanuvchi nima qila oladi</h3><ul class="ab">
<li><b>Matn mashqi:</b> English, O‘zbek yoki dasturlash so‘zlari; 15, 30, 60 yoki 120 soniya; belgi va raqamlarni yoqish.</li>
<li><b>Kod mashqi:</b> 15 ta dasturlash tilidan kod yozish, o‘z kodingizni kiritish va kodni saqlab qo‘yish.</li>
<li><b>Oddiy mashq:</b> hech qanday kirishsiz darhol mashq qilish.</li>
<li><b>Klaviatura darslari:</b> 8 bosqich, 38 ta dars, barmoqlar sxemasi va yakuniy imtihon.</li>
<li><b>O‘yinlar:</b> mashinalar poygasi va harflar sharlari.</li>
<li><b>Sinf musobaqasi:</b> o‘qituvchi panel ochadi, o‘quvchilar panel kodi bilan kirib reytingda qatnashadi, poyga o‘tkazadi.</li>
<li><b>Statistika:</b> wpm, aniqlik, combo, bo‘lim bo‘yicha natijalar, unvonlar va kunlik seriya.</li>
<li><b>Sozlamalar:</b> 12 xil mavzu, tovush, shrift o‘lchami.</li></ul>
<h3>Ma‘lumot</h3><p class="sb">Mashq natijalari va saqlangan kodlar shu brauzerda saqlanadi. Sinf musobaqasi natijalari server ulangan bo‘lsa, serverda saqlanadi.</p>
<h3>Muallif</h3><p class="sb">Rustam Rahmatullayev tomonidan yaratilgan.</p>${BK}</div>`),
 /* poygani qayta boshlash */
 rr:async()=>{const p=snap(adm),o=p.race;if(!o)return;await newRace(o.m,o.src||"en",o.lang,o.tl||rtl)}
};
const busyK=new Set();
document.addEventListener("click",async e=>{
 const b=e.target.closest("[data-a]");if(!b||!act[b.dataset.a])return;
 const key=b.dataset.a+"|"+(b.dataset.k||b.dataset.i||b.dataset.n||b.dataset.m||b.dataset.v||"");if(busyK.has(key))return;
 busyK.add(key);try{await act[b.dataset.a](b.dataset)}catch(err){console.error(err);er("Ulanishda xato. Internetni tekshirib, qayta urinib ko‘ring.")}busyK.delete(key)});
ov.addEventListener("input",e=>{if(e.target.id==="cd")e.target.value=e.target.value.replace(/\D/g,"")});
ov.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.tagName==="INPUT"){const c=ov.querySelector(".cta");if(c)c.click()}e.stopPropagation()});
const typLock=()=>cdT||(racing&&!rstart);
window.addEventListener("keydown",e=>{
 const gate=document.body.classList.contains("gate");
 if(document.body.classList.contains("rlock")&&(e.key==="Escape"||e.key==="Tab")&&!ov.contains(e.target)){e.preventDefault();e.stopPropagation();return}
 if(typLock()&&!ov.contains(e.target)){e.preventDefault();e.stopPropagation();return}
 if(gate&&!ov.contains(e.target))e.stopPropagation()},true);
["beforeinput","input","keypress"].forEach(t=>window.addEventListener(t,e=>{if(typLock()&&!ov.contains(e.target)){e.preventDefault();e.stopPropagation()}},true));

/* ---------- natija: app.js finish() dan darrov chaqiriladi ---------- */
window.ctDone=r=>{
 const wasRace=racing;RL=0;
 if(!ses)return;const n=ses.p,k=ses.k,s=snap(n).st[k];if(!s)return;
 const r0=r.w<1;let e=null;
 if(!r0){e={m:r.m,l:r.m==="code"?r.lang:"",w:r.w,a:r.a,s:Math.round(r.w*r.a/100),t:Date.now()};s.res.push(e);if(s.res.length>60)s.res.shift();s.sum=addSum(s.sum||{},e);sendRes(n,k,e,s.sum)}
 if(wasRace){sendProg(1,r);racing=0;rgo=0}
 setTimeout(()=>{const res=q("res");if(!res)return;let c=q("cr");if(!c){c=document.createElement("p");c.id="cr";res.insertBefore(c,q("again"))}
  c.innerHTML=r0?"Natija yozilmadi (0 wpm).":`🏆 Ball: <b>${e.s}</b> · ${E(snap(n).name)} reytingida <b>${rows(n,"all").findIndex(x=>x.k===k)+1}</b>-o‘rin`},0)};

/* ---------- davriy yangilash ---------- */
let polling=0;
async function poll(){
 if(polling)return;polling=1;
 try{flush();const n=ses?ses.p:adm;
  if(n){const p=await load(n,!!adm);net=1;
   if(ses&&!p.st[ses.k]){stopRace();ses=null;ps();bar();home();return}
   const l=q("lbb");if(l)l.innerHTML=lb(n,lcat);
   if(adm){const c=q("rcn");if(c)c.innerHTML=rctl(p);refreshStl(p);refreshAsl(p);refreshOnl(p)}else{bar();applyLock()}}
 }catch(e){net=0}finally{polling=0;status()}}
async function raceTick(){
 const n=ses?ses.p:adm;if(!n)return;
 try{const[r,rp]=await Promise.all([db.get("p/"+n+"/race"),db.get("p/"+n+"/rp")]),p=snap(n);p.race=r||null;p.rp=rp||{};net=1;
  if(adm){
   if(r&&r.state==="go"){const L=standings(p);
    if((L.length&&L.every(x=>x.f))||(r.m==="text"&&r.gt&&nowS()>r.gt+(r.tl||60)*1000+20000)){r.state="done";await db.set("p/"+n+"/race/state","done")}}
   const c=q("rcn");if(c)c.innerHTML=rctl(p);return}
  if(racing){
   if(!r||r.id!==rjoined||r.state==="done"||!T.startsWith(rtxt)){stopRace();return}
   if(r.state==="go"&&!rgo){rgo=1;countdown(r.gt||nowS()+3000)}
  }
  renderRbar()}catch(e){net=0;status()}}
/* ---------- onlayn belgisi: o'quvchi har 15 soniyada yozadi ---------- */
const beatPath=()=>"p/"+ses.p+"/on/"+enc(ses.k);
function beat(){if(!ses||document.hidden)return;db.set(beatPath(),Math.round(nowS())).catch(()=>{})}
function offline(){if(!ses)return;const pth=beatPath();try{if(ON)fetch(DBU+"/ct/"+pth+".json",{method:"DELETE",keepalive:true});else db.del(pth)}catch(e){}}
setInterval(beat,15000);window.addEventListener("pagehide",offline);
sync();setInterval(sync,60000);setInterval(poll,4000);setInterval(raceTick,1500);setInterval(()=>sendProg(0),1000);
window.addEventListener("online",()=>{flush();poll()});
document.addEventListener("visibilitychange",()=>{if(!document.hidden){flush();poll();beat()}else offline()});

flush();
if(ses){bar();poll();beat()}else home();
})();

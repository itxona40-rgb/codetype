/*
 * CodeType · O'yinlar
 *   1) Poyga: siz va 2 ta bot (standart 30 va 50 wpm)
 *   2) Sharlar: tepadan tushayotgan harf/so'zli sharlar, daraja bo'yicha tezlashadi
 * Mustaqil modul. Ochish: window.ctGames.open()
 */
(()=>{
"use strict";
const E=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const pick=a=>a[Math.random()*a.length|0],rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GK="ct-games";

/* ---------- saqlanadigan sozlama va rekordlar ---------- */
const G={snd:1,rl:40,bot:"mid",lang:"en",bl:"en",lives:1,lv:1,rb:{w:0,wins:0,n:0},bb:{s:0,l:0}};
try{Object.assign(G,JSON.parse(localStorage.getItem(GK)||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem(GK,JSON.stringify(G))}catch(e){}};
const BOTS={easy:[20,35],mid:[30,50],hard:[45,70]},BN={easy:"Oson (20 va 35 wpm)",mid:"O‘rta (30 va 50 wpm)",hard:"Qiyin (45 va 70 wpm)"};

/* ---------- so'zlar ---------- */
const EN=("a an as at be by do go he if in is it me my no of on or so to up us we add air all and any arm art ask bad bag bed big bit box boy bus but buy can car cat cup cut day dog dry ear eat egg end eye far fat few fly for fun get god got gun had has her him his hot how ice job key kid law leg let lie lip log lot low man map may mix net new nor not now nut oil old one our out own pay pen pet pig put raw red run sad say sea see set she sit six sky son sun tea ten the tie too top toy try two use van war was way who why win yes yet you able about above after again along among angry apple arrive basket bridge bright button camera candle carpet castle chance change cheese circle cloud coffee copper corner cotton dancer dinner doctor dragon engine famous farmer finger flower forest friend garden golden hammer island jacket jungle kitchen ladder lemon letter magnet market monkey mother orange pencil planet pocket rabbit rocket school silver simple spirit street summer thunder travel window winter wizard yellow").split(" ");
const UZ=("men sen biz siz ular uy yo‘l ona ota aka uka opa dost non osh suv sut tuz gul olma uzum anor nok shahar qishloq maktab kitob daftar qalam stol stul eshik deraza kuch tez sekin katta kichik yangi eski yaxshi yomon issiq sovuq quyosh oy yulduz bulut yomg‘ir shamol tog‘ daryo dengiz o‘rmon bog‘ ko‘cha mashina samolyot poyezd velosiped telefon kompyuter klaviatura dasturlash o‘qituvchi o‘quvchi bilim fikr savol javob natija musobaqa g‘alaba").split(" ").map(w=>w.replace(/[‘’]/g,"'"));
const wordsOf=l=>l==="uz"?UZ.map(w=>w.replace(/[^a-z']/g,"")).filter(w=>w.length>1):EN;

/* ---------- DOM ---------- */
const root=document.createElement("div");root.id="gv";root.hidden=true;root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");document.body.appendChild(root);
const $=id=>document.getElementById(id);
let isOpen=false,view="hub",raf=0,lastT=0,cv=null,cx=null,W=0,H=0,C={};
const theme=()=>{const s=getComputedStyle(document.documentElement),g=n=>s.getPropertyValue(n).trim();C={acc:g("--acc")||"#5db4ff",bg:g("--bg")||"#0f1a22",panel:g("--panel")||"#16252f",ink:g("--ink")||"#e6eef2",bad:g("--bad")||"#ff7088",line:g("--line")||"#243743",dim:g("--dim")||"#4d6574"}};

/* ---------- tovush ---------- */
let ac=null;
function tone(f1,f2,d,v,type,delay){
 if(!G.snd)return;
 try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+(delay||0);o.type=type||"sine";o.frequency.setValueAtTime(f1,t);if(f2!==f1)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const sfx={key:()=>tone(520+Math.random()*80,520,.05,.07),err:()=>tone(150,90,.13,.07,"square"),pop:()=>{tone(700,200,.12,.12,"triangle");tone(1200,400,.06,.05)},
 beep:()=>tone(440,440,.12,.1),go:()=>tone(880,880,.35,.12),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,f,.25,.1,"sine",i*.11)),lose:()=>[392,330,262].forEach((f,i)=>tone(f,f*.9,.28,.1,"triangle",i*.14)),lvl:()=>[660,880].forEach((f,i)=>tone(f,f,.15,.1,"sine",i*.09)),miss:()=>tone(200,60,.3,.12,"sawtooth")};

/* ---------- canvas ---------- */
function fit(h){
 const w=cv.parentElement.clientWidth||600,d=Math.min(2,window.devicePixelRatio||1);
 cv.style.width=w+"px";cv.style.height=h+"px";cv.width=Math.round(w*d);cv.height=Math.round(h*d);
 cx=cv.getContext("2d");cx.setTransform(d,0,0,d,0,0);W=w;H=h}
const rr=(c,x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
const hex=h=>{h=h.replace("#","");if(h.length===3)h=[...h].map(c=>c+c).join("");const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const mix=(h,t,to)=>{const a=hex(h),b=to===undefined?[255,255,255]:to;return"rgb("+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(",")+")"};
const frame=ts=>{raf=requestAnimationFrame(frame);const dt=Math.min(.05,(ts-lastT)/1000||0);lastT=ts;if(view==="race"){raceStep(dt);raceDraw()}else if(view==="bal"){balStep(dt);balDraw()}};
const startLoop=()=>{cancelAnimationFrame(raf);lastT=performance.now();raf=requestAnimationFrame(frame)};
const stopLoop=()=>{cancelAnimationFrame(raf);raf=0};

/* ====================== HUB ====================== */
function hub(){
 view="hub";stopLoop();root.innerHTML=`<div class="gw2">
 <div class="gbar"><button data-g="back">← Orqaga</button><h2>🎮 O‘yinlar</h2><span class="gsp"></span><button data-g="snd" title="Tovush">${G.snd?"🔊":"🔇"}</button></div>
 <p class="gsb">O‘ynab yozish tezligini oshiring. Esc — chiqish. Har o‘yinda rekord saqlanadi.</p>
 <div class="ghub">
 <article class="gcard car"><div class="gart"><span>🏁</span><span>🏎️💨</span></div><h3>Poyga: 3 mashina</h3>
  <p>Siz va ikkita bot bir yo‘lda. Har to‘g‘ri bosilgan harf mashinangizni oldinga suradi. Botlardan oldin marraga yeting!</p>
  <label>Poyga uzunligi<select id="gs_len">${[[25,"Qisqa (25 so‘z)"],[40,"O‘rta (40 so‘z)"],[60,"Uzun (60 so‘z)"]].map(([v,t])=>`<option value="${v}"${G.rl===v?" selected":""}>${t}</option>`).join("")}</select></label>
  <label>Botlar<select id="gs_bot">${Object.keys(BOTS).map(k=>`<option value="${k}"${G.bot===k?" selected":""}>${BN[k]}</option>`).join("")}</select></label>
  <label>Matn<select id="gs_lang"><option value="en"${G.lang==="en"?" selected":""}>English</option><option value="uz"${G.lang==="uz"?" selected":""}>O‘zbek</option></select></label>
  <div class="gbest">🏆 ${G.rb.n?`Eng tez: <b>${G.rb.w}</b> wpm · g‘alabalar: <b>${G.rb.wins}/${G.rb.n}</b>`:"Hali poyga bo‘lmagan"}</div>
  <button class="gcta" data-g="race">▶ Poygani boshlash</button></article>
 <article class="gcard bal"><div class="gart"><span>🎈🎈</span><span>🎈</span></div><h3>Sharlar</h3>
  <p>Sharlar tepadan pastga tushadi. Ustidagi harf yoki so‘zni yozib yoring. Bitta shar pastga yetib yorilsa, yutqazasiz. Daraja oshgan sari tezlashadi.</p>
  <label>Boshlang‘ich daraja<select id="gs_lv">${[1,3,5,8].map(v=>`<option value="${v}"${G.lv===v?" selected":""}>${v}-daraja</option>`).join("")}</select></label>
  <label>Hayot soni<select id="gs_lives"><option value="1"${G.lives===1?" selected":""}>1 (qiyin)</option><option value="3"${G.lives===3?" selected":""}>3 ta</option></select></label>
  <label>So‘zlar<select id="gs_bl"><option value="en"${G.bl==="en"?" selected":""}>English</option><option value="uz"${G.bl==="uz"?" selected":""}>O‘zbek</option></select></label>
  <div class="gbest">🏆 ${G.bb.s?`Rekord: <b>${G.bb.s}</b> ball · <b>${G.bb.l}</b>-daraja`:"Hali o‘ynalmagan"}</div>
  <button class="gcta" data-g="bal">▶ Sharlarni boshlash</button></article>
 </div></div>`;
 root.scrollTop=0}
root.addEventListener("change",e=>{
 const id=e.target.id,v=e.target.value;
 if(id==="gs_len")G.rl=+v;else if(id==="gs_bot")G.bot=v;else if(id==="gs_lang")G.lang=v;
 else if(id==="gs_lv")G.lv=+v;else if(id==="gs_lives")G.lives=+v;else if(id==="gs_bl")G.bl=v;else return;save()});

/* ---------- umumiy o'yin ekrani ---------- */
function shell(title,sub,labels,ch){
 root.innerHTML=`<div class="gw2"><div class="gbar"><button data-g="hub">← O‘yinlar</button><div class="g1"><b>${title}</b><small>${sub}</small></div><span class="gsp"></span><button data-g="snd" title="Tovush">${G.snd?"🔊":"🔇"}</button><button data-g="redo" title="Qayta boshlash">↻</button></div>
 <div class="gcv" id="gcv"><canvas id="gc"></canvas><div id="gov"></div><input id="gin" class="ghid" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Yozish"></div>
 <div class="gst">${labels.map((l,i)=>`<div><b id="h${i+1}">0</b><small>${l}</small></div>`).join("")}</div>
 <div id="gx"></div></div>`;
 cv=$("gc");theme();fit(ch);root.scrollTop=0;cv.addEventListener("pointerdown",()=>$("gin").focus({preventScroll:true}))}
const hud=(i,v)=>{const e=$("h"+i);if(e&&e.textContent!==String(v))e.textContent=v};
function overlay(html){const o=$("gov");if(o)o.innerHTML=html}
const hasOv=()=>{const o=$("gov");return!!(o&&o.firstChild)};

/* ====================== POYGA ====================== */
const R={};
const CARC=["#ef4444","#f59e0b"];
function raceStart(){
 view="race";const bots=BOTS[G.bot];
 shell("🏎️ Poyga",BN[G.bot]+" · "+G.rl+" so‘z",["wpm","% aniqlik","o‘rin","soniya"],Math.min(330,Math.max(250,Math.round(innerWidth*.45))));
 const pool=wordsOf(G.lang),w=[];for(let i=0;i<G.rl;i++){let x;do{x=pick(pool)}while(x===w[i-1]);w.push(x)}
 Object.assign(R,{beep:-1,T:w.join(" "),pos:0,errs:0,total:0,t0:0,state:"count",cd:0,done:0,streak:0,nitro:0,scroll:0,shake:0,smoke:[],speed:0,hudT:0,doneT:0,ans:null,
  cars:[{n:"Siz",me:1,col:C.acc,ch:0,ft:0,ph:0},{n:"Bot "+bots[0],wpm:bots[0],col:CARC[0],ch:0,ft:0,ph:rnd(0,6)},{n:"Bot "+bots[1],wpm:bots[1],col:CARC[1],ch:0,ft:0,ph:rnd(0,6)}]});
 // chiziqlar: tepada 30 wpm, o'rtada siz, pastda 50 wpm
 R.lane=[1,0,2];
 const tx=$("gx");tx.className="gtx";tx.innerHTML="";R.sp=[];
 for(const ch of R.T){const s=document.createElement("span");s.textContent=ch;R.sp.push(s);tx.appendChild(s)}
 tx.insertAdjacentHTML("afterend",'<p class="gsb">Poyga 3 soniyadan keyin boshlanadi. Esc — qayta boshlash.</p>');
 raceMark();startLoop()}
function raceMark(){
 R.sp.forEach((s,i)=>{if(i===R.pos)s.className="cur";else if(i<R.pos)s.className="c"});
 const tx=$("gx"),cur=R.sp[R.pos];if(cur&&tx){const lh=parseFloat(getComputedStyle(tx).lineHeight)||34;tx.scrollTop=Math.max(0,cur.offsetTop-lh)}}
const prog=c=>(c.me?R.pos:c.ch)/R.T.length;
function raceStep(dt){
 if(R.state==="count"){R.cd+=dt;const s=Math.floor(R.cd);if(R.beep!==s&&s<3){R.beep=s;sfx.beep()}if(R.cd>=3){R.state="go";R.t0=performance.now();R.goT=0;sfx.go();const hn=$("gx")&&$("gx").nextElementSibling;if(hn)hn.textContent="Xato bosilsa mashina joyida turadi, to‘g‘ri tugmani bosing. 20 ta xatosiz harfdan keyin nitro yonadi. Esc — qayta boshlash.";$("gin")&&$("gin").focus({preventScroll:true})}}
 else{
  R.goT+=dt;const el=(performance.now()-R.t0)/1000,len=R.T.length;
  R.cars.forEach(c=>{if(c.me||c.ft)return;c.ch+=dt*c.wpm*(1+.09*Math.sin(R.goT*.8+c.ph))*5/60;if(c.ch>=len){c.ch=len;c.ft=el}});
  const me=R.cars[0],w=el>2?R.pos/5/(el/60):0;R.speed+=((R.done?0:Math.min(w,120))-R.speed)*Math.min(1,dt*3);
  R.hudT-=dt;if(R.hudT<=0){R.hudT=.1;
   hud(1,el<3?0:Math.round(R.pos/5/(el/60)));hud(2,R.total?Math.round(R.pos/R.total*100):100);
   hud(3,(R.done?R.rank:[...R.cars].sort((a,b)=>prog(b)-prog(a)).indexOf(me)+1)+"/3");hud(4,Math.floor(R.done?R.myT:el))}
  if(R.done){R.doneT+=dt;if(R.doneT>1.3&&!R.ans)raceResult()}}
 R.shake=Math.max(0,R.shake-dt*6);
 R.scroll+=dt*(40+R.speed*4);
 // tutun
 const geo=raceGeo();
 R.cars.forEach((c,i)=>{const sp=c.me?R.speed:c.wpm,fin=c.me?R.done:c.ft;if(R.state!=="go"||fin||Math.random()>dt*(10+sp*.4))return;
  const p=prog(c),x=geo.x0+p*(geo.x1-geo.x0),y=geo.y(R.lane[i]);R.smoke.push({x:x-34*geo.s,y:y+rnd(-5,5),vx:-rnd(20,50),vy:rnd(-14,14),l:.6,m:.6,r:rnd(3,6)})});
 R.smoke.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.l-=dt});R.smoke=R.smoke.filter(s=>s.l>0)}
function raceGeo(){const top=34,bot=H-34,lh=(bot-top)/3;return{top,bot,lh,s:lh/78,x0:80,x1:W-88,y:l=>top+lh*(l+.5)}}
function raceKey(k){
 if(R.state!=="go"||R.done)return;R.total++;
 if(k===R.T[R.pos]){R.pos++;R.streak++;R.nitro=R.streak>=20;sfx.key();if(R.pos>=R.T.length){raceFinish();return}raceMark()}
 else{R.errs++;R.streak=0;R.nitro=0;R.shake=1;sfx.err();const s=R.sp[R.pos];s.classList.remove("bad");void s.offsetWidth;s.classList.add("bad")}}
function raceFinish(){
 const len=R.T.length,el=(performance.now()-R.t0)/1000;R.done=1;R.myT=el;R.cars[0].ft=el;raceMark();
 const rest=R.cars.slice(1).map(c=>c.ft||el+(len-c.ch)/(c.wpm*5/60));
 R.times=[el,...rest];R.rank=1+rest.filter(t=>t<el).length;sfx[R.rank===1?"win":"lose"]();hud(3,R.rank+"/3")}
function raceResult(){
 const len=R.T.length,acc=R.total?Math.round(R.pos/R.total*100):100,my=R.cars[0];
 const order=R.cars.map((c,i)=>({c,t:R.times[i]})).sort((a,b)=>a.t-b.t),wpm=Math.round(len/5/(R.myT/60));
 G.rb.n++;if(R.rank===1)G.rb.wins++;const nb=wpm>G.rb.w;if(nb)G.rb.w=wpm;save();R.ans=1;
 const MED=["🥇","🥈","🥉"];
 overlay(`<div class="gres"><div class="gc"><h3>${R.rank===1?"🏆 Siz g‘olibsiz!":R.rank===2?"🥈 Ikkinchi o‘rin":"🥉 Uchinchi o‘rin"}</h3>${nb&&G.rb.n>1?'<p class="gok">🎉 Yangi shaxsiy rekord!</p>':""}
 <div class="gpod">${order.map((o,i)=>`<div class="${o.c.me?"me":""}"><span>${MED[i]}</span><b>${E(o.c.n)}</b><em>${o.t.toFixed(1)} s</em><small>${Math.round(len/5/(o.t/60))} wpm</small></div>`).join("")}</div>
 <p class="gsb">Aniqlik: <b>${acc}%</b> · Xatolar: <b>${R.errs}</b> · Tezligingiz: <b>${wpm}</b> wpm</p>
 <div class="gbt"><button class="gcta" data-g="redo">↻ Qayta poyga (Enter)</button><button data-g="hub">O‘yinlar (Esc)</button></div></div></div>`)}
function raceDraw(){
 const c=cx,g=raceGeo();c.clearRect(0,0,W,H);
 // maysa
 const gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,mix("#16a34a",.45,hex(C.bg)));gr.addColorStop(1,mix("#15803d",.45,hex(C.bg)));c.fillStyle=gr;c.fillRect(0,0,W,H);
 // yo'l
 c.fillStyle="#2b3038";c.fillRect(0,g.top,W,g.bot-g.top);
 const rg=c.createLinearGradient(0,g.top,0,g.bot);rg.addColorStop(0,"rgba(255,255,255,.06)");rg.addColorStop(.5,"rgba(0,0,0,0)");rg.addColorStop(1,"rgba(255,255,255,.05)");c.fillStyle=rg;c.fillRect(0,g.top,W,g.bot-g.top);
 // kerb (qizil-oq) siljiydi
 const off=R.scroll%40;for(const y of[g.top-8,g.bot]){for(let x=-40+off;x<W;x+=20){c.fillStyle=((Math.round((x-off)/20)%2)?"#f8fafc":"#dc2626");c.fillRect(x,y,20,8)}}
 // chiziqlar
 c.fillStyle="rgba(255,255,255,.55)";const d=(R.scroll*1.5)%56;
 for(let i=1;i<3;i++){const y=g.top+g.lh*i-2;for(let x=-56+d;x<W;x+=56)c.fillRect(x,y,30,4)}
 // start va marra
 c.fillStyle="rgba(255,255,255,.7)";c.fillRect(g.x0-44,g.top,4,g.bot-g.top);
 const fx=g.x1+34;for(let r=0;r*10<g.bot-g.top;r++)for(let k=0;k<2;k++){c.fillStyle=((r+k)%2)?"#fff":"#111";c.fillRect(fx+k*10,g.top+r*10,10,10)}
 c.fillStyle="#fff";c.font='700 11px "JetBrains Mono",monospace';c.textAlign="center";c.fillText("FINISH",fx+10,g.top-14);c.textAlign="start";
 // tutun
 R.smoke.forEach(s=>{c.fillStyle="rgba(220,220,220,"+(s.l/s.m*.35)+")";c.beginPath();c.arc(s.x,s.y,s.r*(1.6-s.l/s.m*.6),0,7);c.fill()});
 // mashinalar
 const order=R.cars.map((_,i)=>i);
 order.forEach(i=>{const car=R.cars[i],p=Math.min(1,prog(car)),x=g.x0+p*(g.x1-g.x0),y=g.y(R.lane[i]);
  const shake=car.me?Math.sin(performance.now()/22)*R.shake*3:0,fin=car.me?R.done:car.ft;
  drawCar(c,x,y+shake,g.s,car.col,{nitro:car.me&&R.nitro&&!R.done,run:R.state==="go"&&!fin,me:car.me});
  // ism
  const lab=car.n+(fin?" 🏁":"");c.font='600 11px "JetBrains Mono",monospace';const tw=c.measureText(lab).width+14;
  const lx=clamp(x-tw/2,4,W-tw-4),ly=y-g.lh/2+3;c.fillStyle=car.me?C.acc:"rgba(0,0,0,.55)";rr(c,lx,ly,tw,16,8);c.fill();c.fillStyle=car.me?C.bg:"#fff";c.fillText(lab,lx+7,ly+12)});
 // sanash
 if(R.state==="count"||(R.state==="go"&&R.goT<1)){
  const go=R.state==="go",n=go?3:Math.floor(R.cd)+1,pw=150,px=W/2-pw/2,py=g.top+8;
  c.fillStyle="rgba(10,12,16,.85)";rr(c,px,py,pw,46,12);c.fill();
  for(let i=0;i<3;i++){c.beginPath();c.arc(px+30+i*45,py+23,13,0,7);const on=go||i<n;c.fillStyle=go?"#22c55e":on?"#ef4444":"#3b2327";c.shadowColor=go?"#22c55e":"#ef4444";c.shadowBlur=on?16:0;c.fill();c.shadowBlur=0}
  c.fillStyle="#fff";c.textAlign="center";c.font='800 56px Sora,sans-serif';c.globalAlpha=go?clamp(1-R.goT,0,1):1;c.fillText(go?"BOSHLANG!":String(Math.min(3,n)),W/2,H/2+34);c.globalAlpha=1;c.textAlign="start"}}
function drawCar(c,x,y,s,col,o){
 c.save();c.translate(x,y);c.scale(s,s);
 c.fillStyle="rgba(0,0,0,.3)";c.beginPath();c.ellipse(0,19,42,8,0,0,7);c.fill();
 if(o.nitro){const f=14+Math.random()*16,g=c.createLinearGradient(-42,0,-42-f-24,0);g.addColorStop(0,"#fff");g.addColorStop(.3,"#fbbf24");g.addColorStop(1,"rgba(239,68,68,0)");c.fillStyle=g;c.beginPath();c.moveTo(-42,-7);c.lineTo(-42-f-24,0);c.lineTo(-42,7);c.fill()}
 c.fillStyle="#0b0d10";[[-28,-21],[16,-21],[-28,13],[16,13]].forEach(([wx,wy])=>{rr(c,wx,wy,17,8,3);c.fill()});
 const b=c.createLinearGradient(0,-14,0,14);b.addColorStop(0,mix(col,.3));b.addColorStop(.5,col);b.addColorStop(1,mix(col,.35,[0,0,0]));
 c.fillStyle=b;c.beginPath();c.moveTo(-38,-13);c.lineTo(16,-13);c.quadraticCurveTo(40,-12,43,0);c.quadraticCurveTo(40,12,16,13);c.lineTo(-38,13);c.quadraticCurveTo(-43,0,-38,-13);c.closePath();c.fill();
 c.strokeStyle="rgba(0,0,0,.35)";c.lineWidth=1;c.stroke();
 c.fillStyle="rgba(255,255,255,.85)";c.fillRect(-36,-3.5,76,2.5);c.fillRect(-36,1,76,2.5);
 c.fillStyle="rgba(10,20,40,.9)";c.beginPath();c.moveTo(4,-9);c.lineTo(15,-7.5);c.lineTo(15,7.5);c.lineTo(4,9);c.closePath();c.fill();
 c.fillStyle=mix(col,.35,[0,0,0]);rr(c,-17,-8.5,22,17,5);c.fill();
 c.fillStyle="rgba(255,255,255,.18)";rr(c,-15,-7,8,6,3);c.fill();
 c.fillStyle="#111";c.fillRect(-43,-14,5,28);
 c.fillStyle="#fde68a";c.shadowColor="#fde68a";c.shadowBlur=o.run?10:3;[-8,8].forEach(hy=>{c.beginPath();c.ellipse(41,hy,2.6,2,0,0,7);c.fill()});c.shadowBlur=0;
 if(o.me){c.fillStyle="#fff";c.font='800 9px Sora,sans-serif';c.textAlign="center";c.fillText("1",-24,3);c.textAlign="start"}
 c.restore()}

/* ====================== SHARLAR ====================== */
const B={};
const BPAL=["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#a855f7","#ec4899"];
const GH=20;
function wordFor(lv){
 const L=B.lang==="uz"?"asdfjklqwertyuiopzxcvbnm":"asdfjklqwertyuiopzxcvbnm";
 const pool=B.pool;let len;
 if(lv<=1)return pick("asdfjkl".split(""));
 if(lv===2)return pick(L.split(""));
 if(lv<=4)len=[2,3];else if(lv<=6)len=[3,5];else if(lv<=8)len=[4,6];else len=[5,8];
 const f=pool.filter(w=>w.length>=len[0]&&w.length<=len[1]);return pick(f.length?f:pool)}
function balStart(){
 view="bal";
 shell("🎈 Sharlar",(G.lives===1?"1 hayot":G.lives+" hayot")+" · "+(G.bl==="uz"?"O‘zbek":"English"),["ball","daraja","combo","wpm"],clamp(innerHeight-270,340,540));
 Object.assign(B,{list:[],parts:[],fl:[],score:0,lv:G.lv,popped:0,lvp:0,lives:G.lives,maxL:G.lives,combo:0,best:0,lock:0,spawn:.4,t:0,hits:0,total:0,over:0,paused:0,id:0,shake:0,hudT:0,lang:G.bl,pool:wordsOf(G.bl),ban:{t:1.8,s:"DARAJA "+G.lv},stars:Array.from({length:40},()=>({x:Math.random(),y:Math.random(),r:rnd(.6,2),v:rnd(2,8)}))});
 $("gx").innerHTML=`<p class="gsb" id="glv"></p><p class="gsb">Harf yoki so‘zni yozing. Birinchi harf eng pastdagi mos sharni tanlaydi. <kbd>Backspace</kbd> — tanlovni bekor qilish, <kbd>Esc</kbd> — pauza.</p>`;
 hearts();startLoop()}
const hearts=()=>{const e=$("glv");if(e)e.textContent=B.maxL>1?"Hayot: "+"❤️".repeat(B.lives)+"🖤".repeat(B.maxL-B.lives):""};
function spawn(){
 const taken=new Set(B.list.map(b=>b.word[0]));let w,t=0;
 do{w=wordFor(B.lv);t++}while(taken.has(w[0])&&t<25);
 if(taken.has(w[0]))return;
 cx.font='700 20px "JetBrains Mono",monospace';
 const tw=cx.measureText(w).width,bw=Math.max(54,tw+30),rx=bw/2,ry=rx*1.16;
 let x=0,ok=0;for(let i=0;i<14&&!ok;i++){x=rnd(rx+10,W-rx-10);ok=B.list.every(b=>b.y>ry*2+10||Math.abs(b.bx-x)>b.rx+rx+6)}
 const sp=(34+Math.min(B.lv,25)*12)*(H/500)*rnd(.9,1.1);
 B.list.push({id:++B.id,word:w,typed:0,bx:x,x,y:-ry-6,rx,ry,vy:sp,ph:rnd(0,6),sw:rnd(.8,1.6),amp:rnd(4,12),col:pick(BPAL),tw})}
function balStep(dt){
 B.stars.forEach(s=>{s.y+=s.v*dt/H;if(s.y>1){s.y=0;s.x=Math.random()}});
 B.shake=Math.max(0,B.shake-dt*5);B.ban.t=Math.max(0,B.ban.t-dt);
 B.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=520*dt;p.l-=dt});B.parts=B.parts.filter(p=>p.l>0);
 B.fl.forEach(f=>{f.y-=40*dt;f.l-=dt});B.fl=B.fl.filter(f=>f.l>0);
 if(B.over||B.paused)return;
 B.t+=dt;B.spawn-=dt;
 if(B.list.length===0&&B.spawn>.35)B.spawn=.35;
 if(B.spawn<=0){spawn();B.spawn=Math.max(.55,2.1-Math.min(B.lv,12)*.14)*rnd(.85,1.15)}
 for(const b of B.list.slice()){
  b.y+=b.vy*dt;b.ph+=dt*b.sw;b.x=clamp(b.bx+Math.sin(b.ph)*b.amp,b.rx+2,W-b.rx-2);
  if(b.y+b.ry>=H-GH){burst(b.x,H-GH,"#ef4444",22);remove(b);B.combo=0;B.lives--;B.shake=1;sfx.miss();hearts();if(B.lives<=0){balOver();break}}}
 B.hudT-=dt;if(B.hudT<=0){B.hudT=.12;hud(1,B.score);hud(2,B.lv);hud(3,B.combo);hud(4,B.t>4?Math.round(B.hits/5/(B.t/60)):0)}}
function remove(b){B.list=B.list.filter(x=>x!==b);if(B.lock===b.id)B.lock=0}
function burst(x,y,col,n){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(60,260);B.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,l:rnd(.5,1),m:1,r:rnd(2,5),col:i%3?col:pick(BPAL)})}}
function balKey(k){
 if(B.over||B.paused)return;
 B.total++;
 let b=B.lock?B.list.find(x=>x.id===B.lock):null;
 if(!b){const c=B.list.filter(x=>x.word[0]===k).sort((p,q)=>q.y-p.y)[0];if(c){b=c;B.lock=c.id}}
 if(b&&b.word[b.typed]===k){b.typed++;B.hits++;sfx.key();if(b.typed>=b.word.length)pop(b)}
 else{B.combo=0;B.shake=.5;sfx.err();if(b)b.wrong=.25}}
function pop(b){
 const mult=1+Math.floor(B.combo/10)*.5,pts=Math.round(b.word.length*10*B.lv*mult);
 B.combo++;B.best=Math.max(B.best,B.combo);B.score+=pts;B.popped++;B.lvp++;
 burst(b.x,b.y,b.col,26);B.fl.push({x:b.x,y:b.y-b.ry,t:"+"+pts,l:.9});sfx.pop();remove(b);
 const need=8;if(B.lvp>=need&&B.lv<40){B.lv++;B.lvp=0;B.ban={t:1.8,s:"DARAJA "+B.lv};sfx.lvl();if(B.lives<B.maxL){B.lives++;hearts()}}}
function balOver(){
 B.over=1;sfx.lose();const acc=B.total?Math.round(B.hits/B.total*100):100,wpm=B.t>4?Math.round(B.hits/5/(B.t/60)):0;
 const nb=B.score>G.bb.s;if(nb){G.bb.s=B.score;G.bb.l=B.lv}save();
 overlay(`<div class="gres"><div class="gc"><h3>💥 Shar yorildi!</h3><p class="gsb">Siz yutqazdingiz.</p>${nb?'<p class="gok">🎉 Yangi rekord!</p>':""}
 <div class="gpod two"><div><b>${B.score}</b><small>ball</small></div><div><b>${B.lv}</b><small>daraja</small></div><div><b>${B.popped}</b><small>yorilgan shar</small></div><div><b>${wpm}</b><small>wpm</small></div><div><b>${acc}%</b><small>aniqlik</small></div><div><b>${B.best}</b><small>eng uzun combo</small></div></div>
 <p class="gsb">Rekord: <b>${G.bb.s}</b> ball (${G.bb.l}-daraja)</p>
 <div class="gbt"><button class="gcta" data-g="redo">↻ Qayta boshlash (Enter)</button><button data-g="hub">O‘yinlar (Esc)</button></div></div></div>`)}
function togglePause(){
 if(B.over)return;B.paused=!B.paused;
 overlay(B.paused?`<div class="gres"><div class="gc"><h3>⏸ Pauza</h3><div class="gbt"><button class="gcta" data-g="resume">▶ Davom etish (Esc)</button><button data-g="redo">Qayta boshlash</button><button data-g="hub">O‘yinlar</button></div></div></div>`:"")}
function balDraw(){
 const c=cx,sh=B.shake;c.save();c.clearRect(0,0,W,H);if(sh>0)c.translate(rnd(-1,1)*sh*5,rnd(-1,1)*sh*5);
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(C.acc,.82,hex(C.bg)));g.addColorStop(1,C.panel);c.fillStyle=g;c.fillRect(-10,-10,W+20,H+20);
 c.fillStyle=C.ink;B.stars.forEach(s=>{c.globalAlpha=.12+s.r*.06;c.beginPath();c.arc(s.x*W,s.y*H,s.r,0,7);c.fill()});c.globalAlpha=1;
 // yer va xavf chizig'i
 c.fillStyle="#7f1d1d";c.fillRect(-10,H-GH,W+20,GH+10);c.fillStyle="#ef4444";for(let x=0;x<W;x+=18){c.beginPath();c.moveTo(x,H-GH);c.lineTo(x+9,H-GH-9);c.lineTo(x+18,H-GH);c.fill()}
 // sharlar
 B.list.forEach(b=>{
  const x=b.x,y=b.y,rx=b.rx,ry=b.ry,lk=B.lock===b.id;
  c.strokeStyle="rgba(120,130,140,.6)";c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+ry);for(let i=1;i<=6;i++)c.lineTo(x+Math.sin(b.ph*2+i)*4*i/6,y+ry+i*7);c.stroke();
  const gr=c.createRadialGradient(x-rx*.35,y-ry*.4,rx*.1,x,y,ry*1.05);gr.addColorStop(0,mix(b.col,.55));gr.addColorStop(.55,b.col);gr.addColorStop(1,mix(b.col,.35,[0,0,0]));
  if(lk){c.shadowColor="#fff";c.shadowBlur=22}
  c.fillStyle=gr;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();c.shadowBlur=0;
  c.fillStyle=mix(b.col,.3,[0,0,0]);c.beginPath();c.moveTo(x-5,y+ry+5);c.lineTo(x,y+ry-1);c.lineTo(x+5,y+ry+5);c.fill();
  c.fillStyle="rgba(255,255,255,.4)";c.beginPath();c.ellipse(x-rx*.4,y-ry*.45,rx*.17,ry*.27,-.5,0,7);c.fill();
  if(lk){c.strokeStyle="#fff";c.lineWidth=3;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.stroke()}
  if(b.wrong>0){b.wrong-=.016;c.strokeStyle="#111";c.lineWidth=4;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.stroke()}
  c.font='700 20px "JetBrains Mono",monospace';c.textBaseline="middle";c.textAlign="start";
  const t1=b.word.slice(0,b.typed),w1=c.measureText(t1).width,sx=x-b.tw/2;
  c.lineWidth=4;c.strokeStyle="rgba(0,0,0,.4)";c.lineJoin="round";
  c.strokeText(b.word,sx,y);c.fillStyle="#fff";c.fillText(b.word,sx,y);
  if(t1){c.fillStyle="#1e293b";c.fillText(t1,sx,y);c.fillStyle="rgba(255,255,255,.0)"}
  c.textBaseline="alphabetic"});
 // zarralar
 B.parts.forEach(p=>{c.globalAlpha=clamp(p.l/p.m,0,1);c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill()});c.globalAlpha=1;
 c.font='800 18px Sora,sans-serif';c.textAlign="center";B.fl.forEach(f=>{c.globalAlpha=clamp(f.l/.9,0,1);c.fillStyle=C.ink;c.fillText(f.t,f.x,f.y)});c.globalAlpha=1;
 // daraja yozuvi
 if(B.ban.t>0){c.globalAlpha=clamp(B.ban.t,0,1);c.fillStyle=C.ink;c.font='800 '+Math.min(52,W/9)+'px Sora,sans-serif';c.fillText(B.ban.s,W/2,H/2);c.globalAlpha=1}
 c.textAlign="start";c.restore()}

/* ---------- boshqaruv ---------- */
const act={
 back:()=>close(),hub:()=>hub(),
 snd:()=>{G.snd=+!G.snd;save();root.querySelectorAll('[data-g="snd"]').forEach(b=>b.textContent=G.snd?"🔊":"🔇")},
 race:()=>raceStart(),bal:()=>balStart(),
 redo:()=>{if(view==="race")raceStart();else if(view==="bal")balStart()},
 resume:()=>togglePause()
};
root.addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b||!act[b.dataset.g])return;act[b.dataset.g]();if(view!=="hub")b.blur()});
function press(k){if(view==="race")raceKey(k);else if(view==="bal")balKey(k)}
window.addEventListener("keydown",e=>{
 if(!isOpen)return;const k=e.key;
 if(view==="hub"){if(k==="Escape"){e.preventDefault();e.stopPropagation();close()}return}
 e.stopPropagation();
 if(e.ctrlKey||e.metaKey||(e.altKey&&!(e.getModifierState&&e.getModifierState("AltGraph"))))return;
 const res=view==="race"?R.ans:view==="bal"&&B.over;
 if(res){if(k==="Escape"){e.preventDefault();hub()}else if(k==="Enter"){e.preventDefault();act.redo()}return}
 if(view==="bal"&&B.paused){if(k==="Escape"||k==="Enter"){e.preventDefault();togglePause()}return}
 if(k==="Escape"){e.preventDefault();if(view==="race")raceStart();else togglePause();return}
 if(k==="Backspace"&&view==="bal"){e.preventDefault();const b=B.list.find(x=>x.id===B.lock);if(b){b.typed=0;B.lock=0}return}
 if(k==="Tab"||k==="Enter"||k==="Backspace"){e.preventDefault();return}
 if(k.length===1){e.preventDefault();press(k)}},true);
root.addEventListener("input",e=>{if(e.target.id!=="gin")return;const v=e.target.value;e.target.value="";for(const ch of v)press(ch)});
window.addEventListener("resize",()=>{if(!isOpen||!cv||(view!=="race"&&view!=="bal"))return;fit(view==="race"?Math.min(330,Math.max(250,Math.round(innerWidth*.45))):clamp(innerHeight-270,340,540))});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&isOpen&&view==="bal"&&!B.over&&!B.paused)togglePause()});

function open(){isOpen=true;root.hidden=false;document.body.classList.add("gopen");hub()}
function close(){stopLoop();isOpen=false;root.hidden=true;root.innerHTML="";document.body.classList.remove("gopen");view="hub"}
window.ctGames={open,close,_state:()=>({R,B,view})};
})();

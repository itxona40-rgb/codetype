/*
 * CodeType · Klaviatura darslari (boshlovchilar uchun)
 * Mustaqil modul: contest.js va app.js ga tegmaydi.
 * Ochish: window.ctLearn.open()
 */
(()=>{
"use strict";
const E=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const pick=a=>a[Math.random()*a.length|0];
const PK="ct-learn";

/* ---------- saqlanadigan holat ---------- */
const P={done:{},all:0,snd:1,kb:1,hands:1};
try{Object.assign(P,JSON.parse(localStorage.getItem(PK)||"{}"))}catch(e){}
if(!P.done||typeof P.done!=="object")P.done={};
const savep=()=>{try{localStorage.setItem(PK,JSON.stringify(P))}catch(e){}};

/* ---------- klaviatura va barmoqlar ---------- */
const ROWS=[
 ["`~","1!","2@","3#","4$","5%","6^","7&","8*","9(","0)","-_","=+"],
 ["qQ","wW","eE","rR","tT","yY","uU","iI","oO","pP","[{","]}","\\|"],
 ["aA","sS","dD","fF","gG","hH","jJ","kK","lL",";:","'\""],
 ["zZ","xX","cC","vV","bB","nN","mM",",<",".>","/?"]];
// 0-4: chap qo'l (kichik..bosh), 5-9: o'ng qo'l (bosh..kichik)
const FING=[
 [0,0,1,2,3,3,6,6,7,8,9,9,9],
 [0,1,2,3,3,6,6,7,8,9,9,9,9],
 [0,1,2,3,3,6,6,7,8,9,9],
 [0,1,2,3,3,6,6,7,8,9]];
const FN=["Chap kichik barmoq","Chap nomsiz barmoq","Chap o‘rta barmoq","Chap ko‘rsatkich barmoq","Chap bosh barmoq","O‘ng bosh barmoq","O‘ng ko‘rsatkich barmoq","O‘ng o‘rta barmoq","O‘ng nomsiz barmoq","O‘ng kichik barmoq"];
const colorOf=f=>f<=4?f:9-f; // 0 kichik, 1 nomsiz, 2 o'rta, 3 ko'rsatkich, 4 bosh
const KMAP={};
ROWS.forEach((row,r)=>row.forEach((p,c)=>{KMAP[p[0]]={r,c,sh:0,f:FING[r][c]};KMAP[p[1]]={r,c,sh:1,f:FING[r][c]}}));
KMAP[" "]={r:4,c:0,sh:0,f:5};
// harf uchun: barmoq, kerak bo'lsa Shift barmog'i
function info(ch){
 const m=KMAP[ch];if(!m)return null;
 return{f:m.f,sh:m.sh?(m.f<=4?9:0):-1,r:m.r,c:m.c,shift:m.sh}}
const keyName=ch=>ch===" "?"Probel":/[a-z]/.test(ch)?ch.toUpperCase():ch;

/* ---------- so'zlar va gaplar ---------- */
const WORDS=("a ad add ads ask asks alas dad dads dash fad fall falls fast flag flash flask gas gash glad glass had half hall halls has hash jag jam jar lad lads lag lake lamp land last lash lass leaf leaves lid lie life like lip list live look made make man many map mat may me men met mile milk mind mine miss mix model more most move much must my name near need net new next nice night no none nor not note now nut oak odd off oil old on once one only open or orange order other our out over page pair park part past path pay peak pen pet pick pie pig pin pink pit plan plant play plus pool pop port post pot pour price pull pure push put quack quick quiet quit rack rain ran rank rat raw read real red rent rest rice rich ride ring rise road rock roll roof room root rose row rub rule run sad safe said sail salad salt same sand sat save saga saw say seal seat see seed self sell send set shade shake shall shape share she sheep shelf shell ship shirt shoe shop short shot show shut side sign silk sing sink sit size skin sky sleep slash slow small smell smile snow so soft soil some song soon sort sound soup spend spot star start stay step stick still stone stop store storm story such sun sure swim table tail take talk tall tea team tell ten test than thank that the them then there they thin thing think this those three tie time tiny tip tire to today toe told tone too top town toy tree trip true try turn two under unit up upon use user vase very view visit voice wait walk wall want warm was wash watch water wave way we wear week well went were wet what wheel when where which while white who why wide wife wild will win wind wing wise wish with wolf wood word work world would write yard year yes yet you young zero zone zoo").split(" ");
const NAMES="Ali Vali Aziz Anvar Bobur Dilnoza Farhod Gulnora Hasan Jasur Kamola Laylo Madina Nodira Otabek Rustam Sardor Temur Umida Zafar Sevara Zarina Bekzod Malika Javlon Nilufar".split(" ");
const S1=["The quick brown fox jumps over the lazy dog.","Practice makes perfect.","A good typist never looks at the keys.","Every day I learn something new.","Slow and steady wins the race.","Computers help us work faster.","Keep your fingers on the home row.","Accuracy matters more than speed.","Take a deep breath and type calmly.","Reading books makes you smarter.","The sun rises in the east and sets in the west.","Small steps every day lead to big results."];
const S2=["Touch typing is a skill that saves hours of time every week, so it is worth learning well.","A calm and steady rhythm will help you type faster than rushing and making mistakes.","Good posture, relaxed shoulders and light fingers keep your hands from getting tired.","Do not look at the keyboard; trust your fingers and let your memory guide them.","Speed comes by itself when your accuracy is high and your fingers know where to go.","Ten minutes of focused practice every day is better than one long session each week."];
const SU=["Men kompyuterda tez yozishni organyapman.","Bugun havo juda yaxshi.","Maktabda yangi dars boshlandi.","Bilim olish eng yaxshi boylikdir.","Har kuni mashq qilsangiz, natija albatta bo'ladi.","Dasturlash menga juda yoqadi.","Do'stlarim bilan musobaqada qatnashaman."];

/* ---------- dars rejasi ---------- */
const GROUPS=[],LES=[];let seq=0;
const grp=(title,desc,icon)=>{const g={title,desc,icon,lessons:[]};GROUPS.push(g);return g};
const les=(g,o)=>{o.n=++seq;o.id="l"+o.n;o.g=g;g.lessons.push(o);LES.push(o);return o};
const HOME="asdfghjkl;",TOP="qwertyuiop",ALPHA="abcdefghijklmnopqrstuvwxyz";
let al="";const acc=k=>(al+=k);

let g=grp("Asosiy qator","Barmoqlar doim turadigan qator: A S D F  —  J K L ;","🏠");
les(g,{title:"F va J",keys:"fj",allowed:acc("fj"),len:60,wpm:6,acc:90,intro:"Chap ko‘rsatkich barmog‘ingizni F ga, o‘ng ko‘rsatkich barmog‘ingizni J ga qo‘ying. Bu tugmalarda kichik do‘ngcha bor — ko‘rmasdan ham topasiz. Bosh barmoqlar probelda turadi."});
les(g,{title:"D va K",keys:"dk",allowed:acc("dk"),len:60,wpm:6,acc:90});
les(g,{title:"S va L",keys:"sl",allowed:acc("sl"),len:70,wpm:7,acc:90});
les(g,{title:"A va ;",keys:"a;",allowed:acc("a;"),len:80,wpm:7,acc:90});
les(g,{title:"G va H",keys:"gh",allowed:acc("gh"),len:90,wpm:8,acc:90});
les(g,{title:"Asosiy qator takrori",keys:"",allowed:HOME,focus:HOME,len:110,wpm:10,acc:92,intro:"Asosiy qatorni takrorlang. Barmoqlar F va J dan uzoqqa ketmasin, har bosishdan keyin joyiga qaytsin."});

g=grp("Yuqori qator","Qo‘lni qimirlatmasdan, barmoqni yuqoriga cho‘zing: Q W E R T  —  Y U I O P","⬆️");
les(g,{title:"E va I",keys:"ei",allowed:acc("ei"),len:100,wpm:10,acc:90});
les(g,{title:"R va U",keys:"ru",allowed:acc("ru"),len:100,wpm:10,acc:90});
les(g,{title:"T va Y",keys:"ty",allowed:acc("ty"),len:100,wpm:10,acc:90});
les(g,{title:"W va O",keys:"wo",allowed:acc("wo"),len:100,wpm:11,acc:90});
les(g,{title:"Q va P",keys:"qp",allowed:acc("qp"),len:100,wpm:11,acc:90});
les(g,{title:"Yuqori qator takrori",keys:"",allowed:al,focus:TOP,len:130,wpm:12,acc:92});

g=grp("Pastki qator","Barmoqni pastga tushiring: Z X C V B  —  N M , . /","⬇️");
les(g,{title:"V va M",keys:"vm",allowed:acc("vm"),len:110,wpm:12,acc:90});
les(g,{title:"C va ,",keys:"c,",allowed:acc("c,"),len:110,wpm:12,acc:90});
les(g,{title:"B va N",keys:"bn",allowed:acc("bn"),len:110,wpm:12,acc:90});
les(g,{title:"X va .",keys:"x.",allowed:acc("x."),len:110,wpm:13,acc:90});
les(g,{title:"Z va /",keys:"z/",allowed:acc("z/"),len:110,wpm:13,acc:90});
les(g,{title:"Hamma harflar takrori",keys:"",allowed:ALPHA+",.",focus:"zxcvbnm,./",len:150,wpm:15,acc:92,intro:"Endi klaviaturadagi hamma harf qatnashadi. Shoshilmang: avval aniqlik, tezlik o‘zi keladi."});

g=grp("Katta harflar","Shift bilan: qarama-qarshi qo‘lning kichik barmog‘i Shiftni bosib turadi","⇧");
les(g,{title:"Chap qo‘l harflari",keys:"QWERTASDFGZXCVB",allowed:ALPHA+",.",type:"caps",focus:"QWERTASDFGZXCVB",len:120,wpm:13,acc:90,intro:"Chap qo‘l harflarini katta yozish uchun O‘NG Shift ni o‘ng kichik barmoq bilan bosib turing."});
les(g,{title:"O‘ng qo‘l harflari",keys:"YUIOPHJKLNM",allowed:ALPHA+",.",type:"caps",focus:"YUIOPHJKLNM",len:120,wpm:13,acc:90,intro:"O‘ng qo‘l harflarini katta yozish uchun CHAP Shift ni chap kichik barmoq bilan bosib turing."});
les(g,{title:"Ismlar va so‘zlar",keys:"",allowed:ALPHA+",.",type:"caps",focus:ALPHA.toUpperCase(),len:150,wpm:15,acc:92});

let dg="";const dd=k=>(dg+=k);
g=grp("Raqamlar","Yuqori qatordagi raqamlar: 1 2 3 4 5  —  6 7 8 9 0","🔢");
les(g,{title:"1 va 2",keys:"12",allowed:dd("12"),type:"num",len:60,wpm:8,acc:90});
les(g,{title:"3 va 4",keys:"34",allowed:dd("34"),type:"num",len:70,wpm:8,acc:90});
les(g,{title:"5 va 6",keys:"56",allowed:dd("56"),type:"num",len:80,wpm:8,acc:90});
les(g,{title:"7 va 8",keys:"78",allowed:dd("78"),type:"num",len:80,wpm:8,acc:90});
les(g,{title:"9 va 0",keys:"90",allowed:dd("90"),type:"num",len:90,wpm:9,acc:90});
les(g,{title:"Raqamlar takrori",keys:"",allowed:dg,focus:dg,type:"num",len:110,wpm:10,acc:92});
les(g,{title:"4 xonali sonlar",keys:"",allowed:dg,focus:dg,type:"num",gl:[4,4],len:120,wpm:12,acc:92});

g=grp("Belgilar","Tinish belgilari va maxsus belgilar (Shift bilan)","❗");
les(g,{title:". , ! ?",keys:"!?",type:"pool",pool:["yes,","no.","wow!","why?","ok.","hello!","sure,","stop!","fine.","wait,","really?","done.","well,","go!","here."],len:100,wpm:12,acc:90});
les(g,{title:"' \" ; :",keys:"\":",type:"pool",pool:["it's","don't","let's","\"yes\"","\"no\"","note:","a;b","x:y","can't","\"ok\";","I'm","you're","\"hi\"","time:","name;"],len:100,wpm:12,acc:90});
les(g,{title:"( ) - _ =",keys:"()-_=",type:"pool",pool:["(a)","(1+1)","well-known","x_y","a=b","(ok)","my_var","top-down","n=5","(x-y)","two-way","user_name","a-b=c"],len:100,wpm:11,acc:90});
les(g,{title:"@ # $ % & * +",keys:"@#$%&*+",type:"pool",pool:["@ali","#tag","$100","50%","a&b","2*3","1+1","@home","#1","$5","99%","x*y","a+b","R&D","me@site.com"],len:110,wpm:10,acc:90});
les(g,{title:"Belgilar takrori",keys:"",type:"pool",pool:["(a+b)*2","\"yes!\"","50%","user_1","#top","$9.99","x=5;","a/b","[ok]","{id}","e-mail","what's?","@me","1+2=3","c:\\win"],len:130,wpm:12,acc:92});

g=grp("So‘zlar va gaplar","Haqiqiy matnlar bilan tezlik va aniqlikni oshiring","📝");
les(g,{title:"Oddiy so‘zlar",keys:"",allowed:ALPHA,focus:"",type:"words",len:160,wpm:20,acc:92});
les(g,{title:"Gaplar",keys:"",type:"sent",sents:S1,len:200,wpm:22,acc:93});
les(g,{title:"O‘zbekcha gaplar",keys:"",type:"sent",sents:SU,len:200,wpm:22,acc:93,intro:"Lotin yozuvidagi o‘zbekcha gaplar. Apostrof (') tugmasi ; yonida joylashgan."});
les(g,{title:"Uzun gaplar",keys:"",type:"sent",sents:S2,len:300,wpm:25,acc:94});

g=grp("Yakuniy imtihon","Hamma o‘rgangan narsangizni sinab ko‘ring","🏆");
les(g,{title:"Imtihon",keys:"",type:"sent",sents:S1.concat(S2),len:360,wpm:30,acc:95,intro:"Yakuniy imtihon: uzun matn. Tinch va bir maromda yozing. O‘tish uchun aniqlik juda yuqori bo‘lishi kerak."});

/* ---------- matn yaratish ---------- */
function drill(A,F){
 const n=2+(Math.random()*4|0);let s="";
 for(let i=0;i<n;i++){const src=F&&Math.random()<.65?F:A;let c;do{c=pick(src)}while(s.length>1&&c===s[i-1]&&c===s[i-2]);s+=c}
 return s}
function genText(L){
 const out=[];let len=0,last="";
 const A=L.allowed||"",F=L.focus!==undefined?L.focus:(L.keys||"");
 const cap=w=>w[0].toUpperCase()+w.slice(1);
 let wl=[],fw=[],cp=[];
 if(L.type==="caps"){const pool=WORDS.filter(w=>w.length>1).map(cap).concat(NAMES);cp=pool.filter(w=>F.includes(w[0]));if(!cp.length)cp=pool}
 else if(!L.type||L.type==="words"){const set=new Set(A.split(""));wl=WORDS.filter(w=>[...w].every(c=>set.has(c)));fw=F?wl.filter(w=>[...w].some(c=>F.includes(c))):wl}
 if(L.type==="sent"){
  const bag=L.sents.slice();let b=[];
  while(len<L.len){if(!b.length)b=bag.slice().sort(()=>Math.random()-.5);const s=b.pop();out.push(s);len+=s.length+1}
  return out.join(" ")}
 let guard=0;
 while(len<L.len&&guard++<2000){
  let t,x=Math.random();
  if(L.type==="pool")t=pick(L.pool);
  else if(L.type==="num"){const gl=L.gl||[2,4],n=gl[0]+(Math.random()*(gl[1]-gl[0]+1)|0);t="";for(let i=0;i<n;i++){const src=Math.random()<.6?(F||A):A;t+=pick(src)}}
  else if(L.type==="caps")t=pick(cp);
  else if(fw.length&&x<.45)t=pick(fw);
  else if(wl.length&&x<.7)t=pick(wl);
  else t=drill(A,F);
  if(t===last)continue;last=t;
  if(!L.type||L.type==="words"||L.type==="caps"){
   if(t.length>2){if(A.includes(",")&&Math.random()<.18)t+=",";else if(A.includes(".")&&Math.random()<.15)t+="."}}
  out.push(t);len+=t.length+1}
 return out.join(" ")}

/* ---------- DOM ---------- */
const root=document.createElement("div");root.id="lv";root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.hidden=true;document.body.appendChild(root);
let isOpen=false,ph="menu",ls=null,T="",pos=0,t0=0,total=0,errs=0,pk={},timer=0,spans=[],hiEls=[],keyEls={},lastGoal=null,toastT=0;
const $=id=>document.getElementById(id);

function toast(m){let t=$("ltoast");if(!t){t=document.createElement("div");t.id="ltoast";root.appendChild(t)}t.textContent=m;t.className="on";clearTimeout(toastT);toastT=setTimeout(()=>t.className="",2200)}
const unlocked=l=>P.all||l.n===1||(P.done[LES[l.n-2].id]&&P.done[LES[l.n-2].id].p);
const passedN=()=>LES.filter(l=>P.done[l.id]&&P.done[l.id].p).length;
function nextLesson(){return LES.find(l=>unlocked(l)&&!(P.done[l.id]&&P.done[l.id].p))||LES[LES.length-1]}
const rankOf=p=>p>=100?"Klaviatura ustasi 🏆":p>=75?"Usta":p>=50?"Tajribali":p>=25?"O‘rganuvchi":"Yangi boshlovchi";
const stars=n=>"★".repeat(n)+"☆".repeat(3-n);

/* ---------- menyu ---------- */
function menu(){
 ph="menu";stopTimer();root.classList.remove("inl");
 const N=LES.length,pn=passedN(),pc=Math.round(pn/N*100);
 const st=Object.values(P.done).reduce((a,d)=>a+(d.s||0),0),bw=Object.values(P.done).reduce((a,d)=>Math.max(a,d.w||0),0);
 const nx=nextLesson(),touch=matchMedia("(pointer:coarse)").matches&&!matchMedia("(pointer:fine)").matches;
 root.innerHTML=`<div class="lw">
 <div class="lbar"><button data-l="back">← Orqaga</button><h2>🎹 Klaviatura darslari</h2><span class="lsp"></span><button data-l="snd" title="Tovush">${P.snd?"🔊":"🔇"}</button></div>
 ${touch?'<p class="lwn">Bu bo‘lim kompyuter klaviaturasi uchun mo‘ljallangan. Telefonda to‘liq ishlamasligi mumkin.</p>':""}
 <section class="lhero"><div><div class="lrk">${rankOf(pc)}</div><p class="lsb">Siz ${pn} / ${N} ta darsni tugatdingiz.${pn?"":" Boshlash uchun birinchi darsni oching."}</p>
 <div class="lpb"><i style="width:${pc}%"></i></div></div>
 <div class="lst"><div><b>${pc}%</b><small>progress</small></div><div><b>${st}</b><small>⭐ yulduz</small></div><div><b>${bw}</b><small>eng tez wpm</small></div></div>
 <button class="lcta" data-l="start" data-id="${nx.id}">▶ ${pn?"Davom etish":"Boshlash"}: ${nx.n}-dars · ${E(nx.title)}</button></section>
 <details class="ltips"><summary>💡 To‘g‘ri o‘tirish va qo‘l holati</summary><ul><li>Orqangiz tik, yelkalar bo‘sh, tirsaklar tanaga yaqin va taxminan 90° da bo‘lsin.</li><li>Ekran ko‘z darajasida, klaviaturadan 50–70 sm uzoqda turishi kerak.</li><li>Barmoqlar asosiy qatorda: chap qo‘lda <b>A S D F</b>, o‘ng qo‘lda <b>J K L ;</b>. Bosh barmoqlar probelda.</li><li>Klaviaturaga qaramang. Xato qilsangiz to‘xtamang, to‘g‘ri tugmani bosib davom eting.</li><li>Avval aniqlikka e’tibor bering (90% dan yuqori). Tezlik vaqt o‘tishi bilan o‘zi oshadi.</li><li>Har 20–30 daqiqada qisqa tanaffus qiling, qo‘l va ko‘zlarni dam oldiring.</li></ul></details>
 ${GROUPS.map((gr,gi)=>{const gp=gr.lessons.filter(l=>P.done[l.id]&&P.done[l.id].p).length;
  return`<section class="lg"><div class="lgh"><span class="lgi">${gr.icon}</span><div><h3>${gi+1}-bosqich · ${E(gr.title)}</h3><p class="lsb">${E(gr.desc)}</p></div><em>${gp}/${gr.lessons.length}</em></div>
  <div class="lgrid">${gr.lessons.map(l=>{const d=P.done[l.id],ok=unlocked(l),cur=l===nx;
   return`<button class="ltile${ok?"":" lk"}${d&&d.p?" dn":""}${cur?" cur":""}" data-l="${ok?"start":"locked"}" data-id="${l.id}" aria-label="${l.n}-dars ${E(l.title)}"><small>${l.n}</small><b>${E(l.keys&&l.keys.length<=3?l.keys.toUpperCase().split("").join(" "):l.keys?"":"↻")||E(l.title)}</b><span class="lt2">${E(l.title)}</span><i>${ok?stars(d?d.s||0:0):"🔒"}</i></button>`}).join("")}</div></section>`}).join("")}
 <p class="lft"><button data-l="unlock">${P.all?"🔒 Darslarni qayta qulflash":"🔓 Hamma darslarni ochish"}</button> <button data-l="reset">Progressni tozalash</button></p></div>`;
 root.scrollTop=0}

/* ---------- dars ekrani ---------- */
function kbHTML(){
 const U={bs:2,tab:1.5,bsl:1.5,caps:1.75,ent:2.25,shl:2.25,shr:2.75};
 const key=(r,c)=>{const p=ROWS[r][c],f=FING[r][c],L=/[a-z]/.test(p[0]),fl=r===2&&(p[0]==="f"||p[0]==="j");
  const fx=r===1&&c===12?U.bsl:1;
  return`<b class="k${fl?" bump":""}" id="k${r}_${c}" style="--fc:var(--f${colorOf(f)});flex:${fx}">${L?p[1]:`<u>${E(p[1])}</u>${E(p[0])}`}</b>`};
 const sp=(id,t,u,f)=>`<b class="k w" id="${id}" style="--fc:var(--f${colorOf(f)});flex:${u}">${t}</b>`;
 let h="";
 h+="<div class=\"kr\">"+ROWS[0].map((_,c)=>key(0,c)).join("")+sp("kbs","⌫",U.bs,9)+"</div>";
 h+="<div class=\"kr\">"+sp("ktab","Tab",U.tab,0)+ROWS[1].map((_,c)=>key(1,c)).join("")+"</div>";
 h+="<div class=\"kr\">"+sp("kcaps","Caps",U.caps,0)+ROWS[2].map((_,c)=>key(2,c)).join("")+sp("kent","Enter",U.ent,9)+"</div>";
 h+="<div class=\"kr\">"+sp("ksl","Shift",U.shl,0)+ROWS[3].map((_,c)=>key(3,c)).join("")+sp("ksr","Shift",U.shr,9)+"</div>";
 h+="<div class=\"kr\"><b class=\"k w ksp\" id=\"ksp\" style=\"--fc:var(--f4)\">Probel</b></div>";
 return h}
function handsHTML(){
 const fing=[[8,52,64],[48,36,82],[88,26,94],[128,34,84]];
 const hand=cls=>`<g class="${cls}">${fing.map(([x,y,h],i)=>`<rect class="fg" data-c="${i}" x="${x}" y="${y}" width="34" height="${h+34}" rx="17" style="--fc:var(--f${i})"/>`).join("")}<rect class="pm" x="4" y="98" width="162" height="64" rx="28"/><rect class="fg" data-c="4" x="146" y="110" width="34" height="60" rx="17" transform="rotate(-38 163 140)" style="--fc:var(--f4)"/></g>`;
 return`<svg viewBox="0 0 440 175" role="img" aria-label="Qo‘llar va barmoqlar">${hand("L")}<g transform="translate(440,0) scale(-1,1)">${hand("R")}</g></svg>`}

function lessonScreen(){
 ph="lesson";root.classList.remove("inl");
 const l=ls,newK=[...new Set((l.keys||"").split(""))].filter(c=>KMAP[c]);
 const intro=l.intro||(newK.length?"Yangi tugmalar: "+newK.slice(0,8).map(c=>`<b class="lkn">${E(keyName(c))}</b> ${E(FN[info(c).f].toLowerCase())}`).join(" · "):"");
 root.innerHTML=`<div class="lw les">
 <div class="lbar"><button data-l="menu">← Darslar</button><div class="lt1"><b>${l.n}-dars · ${E(l.title)}</b><small>Maqsad: ${l.wpm} wpm · ${l.acc}% aniqlik</small></div><span class="lsp"></span>
  <button data-l="redo" title="Qayta boshlash (Esc)">↻</button><button data-l="snd" title="Tovush">${P.snd?"🔊":"🔇"}</button><button data-l="kb" class="${P.kb?"on":""}" title="Klaviatura">⌨</button><button data-l="hands" class="${P.hands?"on":""}" title="Qo‘llar">🖐</button></div>
 <div class="lstats"><div><b id="lw">0</b><small>wpm</small></div><div><b id="la">100</b><small>% aniqlik</small></div><div><b id="le">0</b><small>xato</small></div><div><b id="lt">0</b><small>soniya</small></div></div>
 <div class="lpb thin"><i id="lpg" style="width:0"></i></div>
 ${intro?`<p class="lintro">${l.n===1?"🖐 ":"💡 "}${intro}</p>`:""}
 <div class="ltext" id="ltx" aria-label="Yoziladigan matn"></div>
 <div class="lcaps" id="lcaps">⚠ Caps Lock yoqilgan. Uni o‘chiring.</div>
 <div class="lnow" id="lnow"></div>
 <div class="lkbw${P.kb?"":" off"}" id="lkw"><div class="kbd">${kbHTML()}</div></div>
 <div class="lhands${P.hands?"":" off"}" id="lhd">${handsHTML()}</div></div>`;
 root.scrollTop=0;
 keyEls={};root.querySelectorAll(".k").forEach(e=>keyEls[e.id]=e);
 begin()}

function begin(){
 stopTimer();T=genText(ls);pos=0;t0=0;total=0;errs=0;pk={};
 const tx=$("ltx");tx.replaceChildren();spans=[];
 for(const ch of T){const s=document.createElement("span");s.textContent=ch;spans.push(s);tx.appendChild(s)}
 tx.scrollTop=0;
 ["lw","la","le","lt"].forEach((id,i)=>$(id).textContent=[0,100,0,0][i]);$("lpg").style.width="0";
 mark();ph="lesson"}
function stopTimer(){if(timer){clearInterval(timer);timer=0}}
const sts=()=>{const sec=t0?(performance.now()-t0)/1000:0,m=sec/60;return{w:m>0?Math.round(pos/5/m):0,a:total?Math.round(pos/total*100):100,s:sec}};
function tick(){const s=sts();$("lw").textContent=s.s<3?0:s.w;$("la").textContent=s.a;$("le").textContent=errs;$("lt").textContent=Math.floor(s.s);$("lpg").style.width=(pos/T.length*100)+"%"}

function mark(){
 spans.forEach((s,i)=>{if(i===pos)s.className="cur";else if(i<pos)s.className="c"});
 const cur=spans[pos],tx=$("ltx");
 if(cur&&tx){const lh=parseFloat(getComputedStyle(tx).lineHeight)||40;tx.scrollTop=Math.max(0,cur.offsetTop-lh)}
 // yo'riqnoma: tugma va barmoq
 hiEls.forEach(e=>e.classList.remove("hi"));hiEls=[];
 root.querySelectorAll(".fg.act").forEach(e=>e.classList.remove("act"));
 const ch=T[pos],i=ch&&info(ch),now=$("lnow");
 if(!i){if(now)now.innerHTML="";return}
 const el=ch===" "?keyEls.ksp:keyEls["k"+i.r+"_"+i.c];
 if(el){el.classList.add("hi");hiEls.push(el)}
 if(i.sh>=0){const sh=keyEls[i.sh===9?"ksr":"ksl"];if(sh){sh.classList.add("hi");hiEls.push(sh)}}
 const act=f=>{const c=f<=4?f:9-f,h=f<=4?".L":".R",e=root.querySelector(h+' .fg[data-c="'+c+'"]');if(e)e.classList.add("act")};
 act(i.f);if(i.sh>=0)act(i.sh);
 if(now)now.innerHTML=`<b class="lkn">${E(keyName(ch))}</b> ${E(FN[i.f])}`+(i.sh>=0?` <span>+ ${i.sh===9?"O‘ng":"Chap"} Shift (${E(FN[i.sh].toLowerCase())})</span>`:"")}

function flash(k,ok){
 const i=KMAP[k];if(!i)return;
 const el=k===" "?keyEls.ksp:keyEls["k"+i.r+"_"+i.c];if(!el)return;
 const c=ok?"pr":"pw";el.classList.remove("pr","pw");void el.offsetWidth;el.classList.add(c);setTimeout(()=>el.classList.remove(c),160)}

let ac=null;
function beep(ok){
 if(!P.snd)return;
 try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
  o.type=ok?"sine":"square";o.frequency.value=ok?520+Math.random()*80:140;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(ok?.1:.07,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+(ok?.06:.14));
  o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.16)}catch(e){}}

function press(k){
 if(pos>=T.length)return;
 if(!t0){t0=performance.now();timer=setInterval(tick,200)}
 total++;const exp=T[pos];
 if(k===exp){flash(k,1);beep(1);pos++;if(pos>=T.length){tick();finish();return}mark();tick()}
 else{errs++;pk[exp]=(pk[exp]||0)+1;flash(k,0);beep(0);const s=spans[pos];s.classList.remove("bad");void s.offsetWidth;s.classList.add("bad");$("le").textContent=errs;$("la").textContent=sts().a}}

/* ---------- natija ---------- */
function finish(){
 stopTimer();ph="result";
 const s=sts(),l=ls,okW=s.w>=l.wpm,okA=s.a>=l.acc,pass=okW&&okA;
 let n=0;if(pass){n=1;if(s.a>=97&&s.w>=l.wpm*1.3)n=2;if(s.a>=98&&s.w>=l.wpm*1.6)n=3}
 const d=P.done[l.id]||{s:0,w:0,a:0,t:0,p:0};
 d.t=(d.t||0)+1;d.w=Math.max(d.w||0,s.w);d.a=Math.max(d.a||0,s.a);
 const first=!d.p&&pass;if(pass){d.p=1;d.s=Math.max(d.s||0,n)}P.done[l.id]=d;savep();
 const weak=Object.entries(pk).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,v])=>`<span class="chip"><b>${E(keyName(c))}</b> ×${v}</span>`).join("");
 const nx=LES[l.n],last=!nx;
 const msg=pass?(n===3?"Ajoyib natija!":n===2?"Juda yaxshi!":"Dars tugadi!"):!okA&&!okW?"Aniqlik ham, tezlik ham yetmadi.":!okA?"Aniqlik yetmadi. Sekinroq, lekin xatosiz yozing.":"Aniqlik yaxshi, tezlikni biroz oshiring.";
 const el=document.createElement("div");el.className="lres";el.id="lres";
 el.innerHTML=`<div class="lc" role="document"><div class="lstar">${[1,2,3].map(i=>`<span class="${i<=n?"on":""}" style="animation-delay:${i*.15}s">★</span>`).join("")}</div>
 <h3>${msg}</h3><p class="lsb">${l.n}-dars · ${E(l.title)}${first&&nx?" · keyingi dars ochildi 🔓":""}${first&&last?" · 🏆 Kursni tugatdingiz!":""}</p>
 <div class="lstats"><div class="${okW?"gd":"bd"}"><b>${s.w}</b><small>wpm / ${l.wpm}</small></div><div class="${okA?"gd":"bd"}"><b>${s.a}%</b><small>aniqlik / ${l.acc}%</small></div><div><b>${errs}</b><small>xato</small></div><div><b>${Math.round(s.s)}</b><small>soniya</small></div></div>
 ${weak?`<p class="lsb">Eng ko‘p adashgan tugmalar:</p><div>${weak}</div>`:'<p class="lsb">Xatosiz! 💯</p>'}
 <div class="lbtn">${pass&&nx?`<button class="lcta" data-l="next">Keyingi dars →</button>`:`<button class="lcta" data-l="redo">${pass?"Yana urinish":"Qayta urinish"}</button>`}${pass&&nx?'<button data-l="redo">Qayta urinish</button>':""}<button data-l="menu">Darslar</button></div>
 <p class="lsb lhint">Enter — ${pass&&nx?"keyingi dars":"qayta"} · Esc — darslar</p></div>`;
 root.appendChild(el);const b=el.querySelector(".lcta");if(b)b.focus({preventScroll:true})}
const closeRes=()=>{const e=$("lres");if(e)e.remove()};

/* ---------- harakatlar ---------- */
function startLesson(id){const l=LES.find(x=>x.id===id);if(!l)return;if(!unlocked(l)){toast("Avval oldingi darsni tugating");return}ls=l;lessonScreen()}
const act={
 back:()=>close(),
 menu:()=>{closeRes();menu()},
 start:d=>startLesson(d.id),
 locked:()=>toast("Avval oldingi darsni tugating 🔒"),
 redo:()=>{closeRes();if(ph==="menu")return;begin()},
 next:()=>{closeRes();const nx=LES[ls.n];if(nx){ls=nx;lessonScreen()}else menu()},
 snd:()=>{P.snd=+!P.snd;savep();root.querySelectorAll('[data-l="snd"]').forEach(b=>b.textContent=P.snd?"🔊":"🔇")},
 kb:()=>{P.kb=+!P.kb;savep();const e=$("lkw");e.classList.toggle("off",!P.kb);root.querySelector('[data-l="kb"]').classList.toggle("on",!!P.kb)},
 hands:()=>{P.hands=+!P.hands;savep();const e=$("lhd");e.classList.toggle("off",!P.hands);root.querySelector('[data-l="hands"]').classList.toggle("on",!!P.hands)},
 unlock:()=>{P.all=+!P.all;savep();menu()},
 reset:()=>{if(confirm("Hamma darslar progressi o‘chirilsinmi?")){P.done={};P.all=0;savep();menu()}}
};
root.addEventListener("click",e=>{const b=e.target.closest("[data-l]");if(!b||!act[b.dataset.l])return;act[b.dataset.l](b.dataset);if(ph==="lesson")b.blur()});

window.addEventListener("keydown",e=>{
 if(!isOpen)return;
 const k=e.key;
 if(ph==="result"){
  if(k==="Escape"){e.preventDefault();e.stopPropagation();act.menu();return}
  if(k==="Enter"){e.preventDefault();e.stopPropagation();const b=$("lres")&&$("lres").querySelector(".lcta");if(b)b.click();return}
  return}
 if(ph==="menu"){if(k==="Escape"){e.preventDefault();e.stopPropagation();close()}return}
 if(ph!=="lesson")return;
 e.stopPropagation();
 if(e.ctrlKey||e.metaKey||(e.altKey&&!(e.getModifierState&&e.getModifierState("AltGraph"))))return;
 if(k==="Escape"){e.preventDefault();begin();return}
 if(k==="Tab"||k==="Backspace"||k==="Enter"){e.preventDefault();return}
 const cw=$("lcaps");if(cw&&e.getModifierState)cw.classList.toggle("on",e.getModifierState("CapsLock"));
 if(k==="Shift"){const el=keyEls[e.location===2?"ksr":"ksl"];if(el){el.classList.add("pr");setTimeout(()=>el.classList.remove("pr"),160)}return}
 if(k.length!==1)return;
 e.preventDefault();press(k)},true);

function open(){
 isOpen=true;root.hidden=false;document.body.classList.add("lopen");menu()}
function close(){
 stopTimer();closeRes();isOpen=false;root.hidden=true;root.innerHTML="";document.body.classList.remove("lopen")}

window.ctLearn={open,close,_lessons:LES,_gen:genText,_info:info};
})();

let RL=0;const DOMAIN="codetype.uz";const EN="the of to and a in is it you that he was for on are with as his they be at one have this from or had by hot word but what some we can out other were all there when up use your how said an each she which do their time if will way about many then them write would like so these her long make thing see him two has look more day could go come did number sound no most people my over know water than call first who may down side been now find".split(" ");
const UZ="men sen u biz siz ular kitob uy maktab dasturlash kompyuter klaviatura tez yozish yaxshi katta kichik ish vaqt kun kecha bugun ertaga suv non osh olma bola ona ota dost shahar yol mashina telefon dars oqish kod xato togri sinov natija daraja bilim fikr yangi eski chiroyli sekin kuchli tinch".split(" ");
const TECH="if else for while return const let var function class import print int void true false null => == != && || {} [] () ; : = + - * / < > i++ i<n arr[0] obj.key 'str' \"text\" #include len(a) self.x x=10 a+b a&&b !ok $id @app _tmp".split(" ");
const SN={
Python:[`def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,`class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        self.items.append(x)\n\n    def pop(self):\n        return self.items.pop()`,`for i in range(5):\n    if i % 2 == 0:\n        print(i)`],
JavaScript:[`const sum = (arr) => {\n  return arr.reduce((a, b) => a + b, 0);\n};\nconsole.log(sum([1, 2, 3]));`,`async function load(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error('xato');\n    return await res.json();\n  } catch (e) {\n    console.error(e.message);\n  }\n}`,`let s = 'abc';\nconsole.log(s.length);`],
"C++":[`int gcd(int a, int b) {\n    while (b != 0) {\n        int t = b;\n        b = a % b;\n        a = t;\n    }\n    return a;\n}`,`#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 0; i < 5; i++) {\n        cout << i << endl;\n    }\n    return 0;\n}`],
Java:[`public class Counter {\n    private int count = 0;\n\n    public void inc() {\n        count++;\n    }\n\n    public int get() {\n        return count;\n    }\n}`,`for (int i = 1; i <= 3; i++) {\n    System.out.println("Salom " + i);\n}`],
HTML:[`<form action="/login" method="post">\n  <label for="u">Login</label>\n  <input id="u" type="text" required>\n  <button type="submit">Kirish</button>\n</form>`,`<ul class="menu">\n  <li><a href="/">Bosh sahifa</a></li>\n  <li><a href="/about">Biz haqimizda</a></li>\n</ul>`],
SQL:[`SELECT u.name, COUNT(o.id) AS total\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE o.status = 'paid'\nGROUP BY u.name\nORDER BY total DESC;`,`INSERT INTO users (name, age)\nVALUES ('Ali', 20);`]
};
SN.Go=[`package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 0; i < 3; i++ {\n        fmt.Println("Salom", i)\n    }\n}`,`func sum(nums []int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}`];SN.Rust=[`fn main() {\n    let mut v = Vec::new();\n    for i in 0..5 {\n        v.push(i * 2);\n    }\n    println!("{:?}", v);\n}`,`struct Point {\n    x: i32,\n    y: i32,\n}\n\nimpl Point {\n    fn sum(&self) -> i32 {\n        self.x + self.y\n    }\n}`];SN.TypeScript=[`interface User {\n  name: string;\n  age: number;\n}\n\nconst greet = (u: User): string => {\n  return "Salom, " + u.name;\n};`,`type Id = number | string;\nlet ids: Id[] = [1, "a", 3];\nids.forEach((x) => console.log(x));`];SN.PHP=[`<?php\n$names = ["Ali", "Vali"];\nforeach ($names as $n) {\n    echo "Salom, " . $n;\n}`,`function add($a, $b) {\n    return $a + $b;\n}\necho add(2, 3);`];SN["C#"]=[`using System;\n\nclass Program {\n    static void Main() {\n        for (int i = 0; i < 3; i++) {\n            Console.WriteLine(i);\n        }\n    }\n}`,`public int Max(int[] a) {\n    int m = a[0];\n    foreach (var x in a) {\n        if (x > m) m = x;\n    }\n    return m;\n}`];SN.Kotlin=[`fun main() {\n    val names = listOf("Ali", "Vali")\n    for (n in names) {\n        println("Salom, " + n)\n    }\n}`,`fun add(a: Int, b: Int): Int {\n    return a + b\n}`];SN.Bash=[`#!/bin/bash\nfor f in *.txt; do\n  echo "Fayl: " $f\ndone`,`if [ -f "data.txt" ]; then\n  cat data.txt | grep "xato"\nfi`];SN.CSS=[`.card {\n  display: flex;\n  padding: 16px;\n  border-radius: 12px;\n  background: #1f7ae0;\n}`,`@media (max-width: 600px) {\n  .menu {\n    display: none;\n  }\n}`];SN.React=[`function Counter() {\n  const [n, setN] = useState(0);\n  return (\n    <button onClick={() => setN(n + 1)}>\n      {n}\n    </button>\n  );\n}`,`useEffect(() => {\n  document.title = "Salom";\n}, []);`];SN.Python.push(`import random\n\nnum = random.randint(1, 10)\nguess = int(input("Son: "))\nif guess == num:\n    print("Topdingiz!")\nelse:\n    print("Xato")`,`squares = [x ** 2 for x in range(10)]\nevens = list(filter(lambda x: x % 2 == 0, squares))\nprint(evens)`);SN.JavaScript.push(`const user = { name: "Ali", age: 20 };\nconst { name, age } = user;\nconsole.log(name + " " + age);`,`document.querySelector("#btn").addEventListener("click", () => {\n  alert("Salom!");\n});`);SN["C++"].push(`#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v = {3, 1, 2};\n    std::sort(v.begin(), v.end());\n    return 0;\n}`);SN.Java.push(`import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>();\n        list.add("Java");\n        System.out.println(list);\n    }\n}`);SN.HTML.push(`<button class="btn" onclick="go()">Bosish</button>\n<script>\n  function go() {\n    alert("Salom");\n  }\n<\/script>`);SN.SQL.push(`UPDATE users\nSET age = age + 1\nWHERE id = 3;`,`CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL\n);`);SN.Python.push(`def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True`,`with open("data.txt", "r") as f:\n    lines = f.readlines()\nprint(len(lines))`);
SN.JavaScript.push(`const debounce = (fn, ms) => {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n};`,`const items = [1, 2, 3].map(x => x * 2).filter(x => x > 2);\nconsole.log(items);`);
SN["C++"].push(`#include <iostream>\n\nint fact(int n) {\n    return n <= 1 ? 1 : n * fact(n - 1);\n}`,`int arr[5] = {1, 2, 3, 4, 5};\nint total = 0;\nfor (int x : arr) total += x;`);
SN.Java.push(`public static int fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,`String s = "salom";\nSystem.out.println(s.toUpperCase());`);
SN.HTML.push(`<img src="logo.png" alt="Logo" width="120">`,`<table>\n  <tr><th>Ism</th><th>Yosh</th></tr>\n  <tr><td>Ali</td><td>20</td></tr>\n</table>`);
SN.SQL.push(`SELECT name FROM users\nWHERE age > 18\nORDER BY name ASC;`,`DELETE FROM orders\nWHERE status = 'cancelled';`);
SN.Go.push(`func max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}`,`ch := make(chan int)\ngo func() { ch <- 42 }()\nfmt.Println(<-ch)`);
SN.Rust.push(`fn square(x: i32) -> i32 {\n    x * x\n}`,`let nums = vec![1, 2, 3];\nlet total: i32 = nums.iter().sum();`);
SN.TypeScript.push(`function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}`,`const cfg: { port: number } = { port: 3000 };`);
SN.PHP.push(`$arr = ["a" => 1, "b" => 2];\nforeach ($arr as $k => $v) {\n    echo "$k: $v\\n";\n}`,`if (isset($_GET["id"])) {\n    echo (int) $_GET["id"];\n}`);
SN["C#"].push(`var list = new List<int> { 1, 2, 3 };\nConsole.WriteLine(list.Count);`,`public bool IsEven(int n) {\n    return n % 2 == 0;\n}`);
SN.Kotlin.push(`fun isEven(n: Int) = n % 2 == 0`,`val map = mapOf("a" to 1, "b" to 2)\nprintln(map["a"])`);
SN.Bash.push(`for i in $(seq 1 5); do\n  echo "Raqam: $i"\ndone`,`mkdir -p backup && cp *.txt backup/`);
SN.CSS.push(`.btn:hover {\n  opacity: 0.8;\n}`,`.grid {\n  display: grid;\n  gap: 8px;\n}`);
SN.React.push(`const [open, setOpen] = useState(false);`,`function List({ items }) {\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n}`);
const TH=[["auto","#888","#888"],["light","#f3f5f7","#1f7ae0"],["dark","#0f1a22","#5db4ff"],["ocean","#06283d","#2fe0c5"],["sunset","#2b1633","#ff9f43"],["matrix","#020b04","#1aff6e"],["rose","#fff0f3","#ff4d8d"],["dracula","#282a36","#bd93f9"],["nord","#2e3440","#88c0d0"],["monokai","#272822","#a6e22e"],["neon","#0a0014","#ff2bd6"],["gruvbox","#282828","#fabd2f"]];
const BOTS=[0,-1,30,50,80,110];
const SP=[["Yumshoq","soft"],["Mexanik","mech"],["Membrana","mem"],["Melodiya","piano"],["Tomchi","drop"]],PN=[261.6,293.7,329.6,392,440,523.3,587.3,659.3],SV=[0,.4,.8,1.35];
const $=id=>document.getElementById(id),code=$("code"),box=$("box"),R=document.documentElement,r=a=>a[Math.random()*a.length|0];
let S={m:"text",lang:"Python",tl:30,src:"en",P:0,N:0,strict:0,snd:0,sp:"soft",vol:2,tape:0,kb:1,bot:0,fs:1.2,th:"auto"};
try{Object.assign(S,JSON.parse(localStorage.getItem("ct-s")||"{}"))}catch(e){}
if(!["text","code"].includes(S.m))S.m="text";if(![...Object.keys(SN),"Tasodifiy","O‘z kodim"].includes(S.lang))S.lang="Python";if(!["en","uz","tech"].includes(S.src))S.src="en";if(![15,30,60,120].includes(S.tl))S.tl=30;if(!BOTS.includes(S.bot))S.bot=0;S.fs=Math.min(2,Math.max(.9,+S.fs||1.2));if(!SP.some(x=>x[1]===S.sp))S.sp="soft";if(![1,2,3].includes(S.vol))S.vol=2;S.tape=+!!S.tape;
let T="",st=[],pos=0,t0=0,keys=0,good=0,errs=0,cb=0,bcb=0,smp=[],em={},hl=[],done=false,timer=null,lastS="",ac=null,last="";
const save=()=>{try{localStorage.setItem("ct-s",JSON.stringify(S))}catch(e){}};
const getH=()=>{try{return JSON.parse(localStorage.getItem("ct-h")||"[]")}catch(e){return[]}};
function theme(){S.th==="auto"?R.removeAttribute("data-theme"):R.setAttribute("data-theme",S.th);R.style.setProperty("--fs",S.fs+"rem")}
let mg=null,nb=null;
function actx(){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();if(!mg){mg=ac.createGain();const cp=ac.createDynamicsCompressor();cp.threshold.value=-10;cp.knee.value=12;cp.ratio.value=4;mg.connect(cp);cp.connect(ac.destination);nb=ac.createBuffer(1,ac.sampleRate*.2|0,ac.sampleRate);const d=nb.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1}mg.gain.value=SV[S.vol]||SV[2];return ac}catch(e){return null}}
function beep(i,ch){
 if(!S.snd)return;const a=actx();if(!a)return;const t0=a.currentTime+.002,j=()=>.92+Math.random()*.16;
 const tone=(ty,f1,f2,d,v,dl)=>{const t=t0+(dl||0),x=a.createOscillator(),g=a.createGain();x.type=ty;x.frequency.setValueAtTime(f1,t);if(f2!==f1)x.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d);x.connect(g);g.connect(mg);x.start(t);x.stop(t+d+.02)};
 const nz=(ty,f,q,d,v)=>{const x=a.createBufferSource(),h=a.createBiquadFilter(),g=a.createGain();x.buffer=nb;h.type=ty;h.frequency.value=f;h.Q.value=q;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);x.connect(h);h.connect(g);g.connect(mg);x.start(t0,Math.random()*.1);x.stop(t0+d+.01)};
 if(i===1){tone("sine",150*j(),85,.16,.3);nz("lowpass",500,.7,.05,.12);return}
 if(i===2){[784,988,1319].forEach((f,k)=>tone("sine",f,f,.3,.1,k*.07));return}
 const sp=i>=3,p=S.sp;
 if(p==="mech"){nz("bandpass",(sp?2000:3400)*j(),1.1,.02,.28);tone("sine",(sp?150:270)*j(),sp?72:130,sp?.11:.065,.3)}
 else if(p==="mem"){nz("bandpass",1900*j(),.8,.04,sp?.7:.55);tone("triangle",(sp?260:420)*j(),sp?150:210,.06,.2)}
 else if(p==="piano"){const f=sp?(i===4?98:131):PN[(ch?ch.charCodeAt(0):0)%PN.length];tone("sine",f,f,sp?.4:.32,sp?.28:.2);tone("triangle",f*2,f*2,.18,.035)}
 else if(p==="drop"){const f=sp?380:600+Math.random()*350;tone("sine",f,f*1.7,.09,.24)}
 else{if(sp){tone("sine",(i===4?120:135)*j(),62,.16,.45);nz("lowpass",700,.7,.05,.2)}else{tone("sine",200*j(),95,.09,.4);nz("lowpass",1400,.7,.03,.18)}}
}
const pv=()=>{beep(0,"a");setTimeout(()=>beep(0,"e"),90);setTimeout(()=>beep(0,"k"),180);setTimeout(()=>beep(3),290)};
function boom(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;for(let i=0;i<40;i++){const s=document.createElement("span");s.className="cf";s.style.cssText="--x:"+((Math.random()-.5)*600|0)+"px;--y:"+((Math.random()*-300+120)|0)+"px;background:"+r(["var(--acc)","var(--bad)","#ffd23f","#3ddc97"]);document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}}
function gen(n=80){const pool=S.src==="uz"?UZ:S.src==="tech"?TECH:EN,o=[];for(let i=0;i<n;i++){let w=r(pool);if(S.src!=="tech"){if(S.P&&Math.random()<.2)w=w[0].toUpperCase()+w.slice(1);if(S.N&&Math.random()<.12)w=""+(10+Math.random()*990|0);if(S.P&&Math.random()<.18)w+=r([",",".","?","!",";"])}o.push(w)}return o.join(" ")}
let curL="";function pickCode(){if(S.lang==="O‘z kodim"){curL="Boshqa";return S.cu||"print('Salom')"}const l=S.lang==="Tasodifiy"?r(Object.keys(SN)):S.lang,a=SN[l];curL=l;let s;do{s=r(a)}while(a.length>1&&s===last);last=s;return s}
const bk=()=>"ct-b-"+S.m+(S.m==="code"?S.lang:S.tl+S.src+S.P+S.N);
function grp(el,lab,items,re){if(lab){const i=document.createElement("i");i.textContent=lab;el.appendChild(i)}items.forEach(([t,on,fn])=>{const b=document.createElement("button");b.textContent=t;if(on)b.className="on";b.onclick=()=>{fn();save();build();if(re!==false)init();box.focus()};el.appendChild(b)})}
function build(){
 theme();
 ["modes","opts","tg","sr","th"].forEach(i=>$(i).replaceChildren());
 grp($("modes"),"",[["Matn",S.m==="text",()=>S.m="text"],["Kod",S.m==="code",()=>S.m="code"]]);
 [...$("modes").children].forEach(b=>b.classList.add("m"));
 if(S.m==="text"){
  grp($("opts"),"vaqt",[15,30,60,120].map(v=>[v,S.tl===v,()=>S.tl=v]));
  grp($("opts"),"so‘zlar",[["English","en"],["O‘zbek","uz"],["Dasturlash","tech"]].map(([t,v])=>[t,S.src===v,()=>S.src=v]));
  if(S.src!=="tech")grp($("opts"),"",[["Belgilar",S.P,()=>S.P=+!S.P],["Raqamlar",S.N,()=>S.N=+!S.N]]);
  grp($("opts"),"ko‘rinish",[["Bloklar",!S.tape,()=>S.tape=0],["Lenta",S.tape,()=>S.tape=1]]);
 }else grp($("opts"),"til",[...Object.keys(SN),"Tasodifiy","O‘z kodim"].map(v=>[v,S.lang===v,()=>S.lang=v]));
 grp($("tg"),"",[["Xatoda to‘xta",S.strict,()=>S.strict=+!S.strict],["Klaviatura",S.kb,()=>S.kb=+!S.kb],["Raqib: "+(S.bot<0?"mening rekordim":S.bot?S.bot+" wpm":"yo‘q"),S.bot,()=>S.bot=BOTS[(BOTS.indexOf(S.bot)+1)%BOTS.length]]]);
 if(S.snd){grp($("sr"),"tovush",SP.map(([t,v])=>[t,S.sp===v,()=>{S.sp=v;pv()}]),false);grp($("sr"),"balandlik",[["past",1],["o‘rta",2],["baland",3]].map(([t,v])=>[t,S.vol===v,()=>{S.vol=v;pv()}]),false)}
 grp($("th"),"",TH.map(([n,a,b])=>[" ",0,()=>{S.th=n;$("thd").open=false}]),false);
 [...$("th").children].forEach((b,i)=>{b.className="dot"+(TH[i][0]===S.th?" on":"");b.title=TH[i][0];b.style.background="linear-gradient(135deg,"+TH[i][1]+" 50%,"+TH[i][2]+" 50%)"});
 if(S.m==="code"){const bs=document.createElement("button");bs.textContent="💾 Kodni saqlash";bs.onclick=()=>{saveCode();box.focus()};const bl=document.createElement("button");bl.textContent="📁 Saqlanganlar ("+SAVED.length+")";bl.onclick=()=>{showSaved();box.focus()};$("tg").append(bs,bl)}
 $("bsn").textContent=S.snd?"🔊":"🔇";
 $("kb").className=S.kb?"on":"";$("cu").className="card"+(S.m==="code"&&S.lang==="O‘z kodim"?" show":"");
 $("hint").innerHTML=S.m==="text"?"Vaqt birinchi harfdan boshlanadi. <kbd>Esc</kbd> — yangi matn, <kbd>Tab</kbd> — qayta. Combo 10 dan boshlanadi, har 25 da effekt!":"Qator oxirida <kbd>Enter</kbd> bosing, indent avtomatik o‘tkaziladi. <kbd>Esc</kbd> — yangi kod, <kbd>Tab</kbd> — qayta.";
 $("race").className=S.bot?"on":"";$("bn").textContent=(S.bot<0?"Rekord (":"Raqib (")+bw()+" wpm)";
}
let SAVED=[];try{SAVED=JSON.parse(localStorage.getItem("ct-codes")||"[]")||[]}catch(e){}
const saveSaved=()=>{try{localStorage.setItem("ct-codes",JSON.stringify(SAVED.slice(0,200)))}catch(e){}};
const secLabel=()=>S.m==="text"?"Matn · "+({en:"English",uz:"O‘zbek",tech:"Dasturlash"}[S.src]||"English")+" · "+S.tl+" soniya":"Kod · "+curL;
const H=s=>String(s).replace(/[&<>"]/g,c=>"&#"+c.charCodeAt(0)+";");
function saveCode(){if(!T.trim())return;if(!SAVED.some(x=>x.c===T)){SAVED.unshift({l:curL||"Kod",c:T,t:Date.now()});saveSaved()}build()}
function renderSaved(){const c=$("sv");c.innerHTML=`<strong>Saqlangan kodlar (${SAVED.length})</strong>`+(SAVED.length?SAVED.map((x,i)=>`<div class="svi"><span>${H(x.l)}</span><code>${H(x.c.split("\n").slice(0,2).join("\n").slice(0,160))}</code><span class="svb"><button data-sv="p" data-i="${i}">▶ Mashq</button><button data-sv="d" data-i="${i}">✕</button></span></div>`).join(""):"<p>Hali kod saqlanmagan. Kod mashqi paytida “💾 Kodni saqlash” ni bosing.</p>")+`<button id="svc">Yopish</button>`;$("svc").onclick=()=>c.classList.remove("show")}
function showSaved(){if($("sv").classList.toggle("show"))renderSaved()}
$("sv").onclick=e=>{const b=e.target.closest("button[data-sv]");if(!b)return;const i=+b.dataset.i,it=SAVED[i];if(!it)return;if(b.dataset.sv==="d"){SAVED.splice(i,1);saveSaved();renderSaved();build();return}S.m="code";S.lang="O‘z kodim";S.cu=it.c;save();$("sv").classList.remove("show");build();init();box.focus()};
function secTable(h){const g={};h.forEach(x=>{const k=x.k||(x.m==="code"?"Kod":"Matn");(g[k]=g[k]||[]).push(x)});return `<table class="sec"><tr><th>Bo‘lim</th><th>Eng yuqori wpm</th><th>O‘rtacha wpm</th><th>Aniqlik</th><th>Testlar</th></tr>${Object.entries(g).map(([k,v])=>{const w=v.map(x=>x.w);return `<tr><td>${k}</td><td>${Math.max(...w)}</td><td>${Math.round(w.reduce((a,b)=>a+b,0)/w.length)}</td><td>${Math.round(v.reduce((a,b)=>a+b.a,0)/v.length)}%</td><td>${v.length}</td></tr>`}).join("")}</table>`}
function init(nt){
 if(nt!==false)T=S.m==="text"?gen():pickCode();
 st=new Array(T.length).fill("");pos=0;t0=0;keys=good=errs=cb=bcb=0;smp=[];em={};hlt();gw=bw();$("wpm").style.color="";document.body.classList.remove("f");done=false;clearInterval(timer);
 $("res").classList.remove("show");$("wpm").textContent=0;$("acc").textContent=100;$("tm").textContent=S.m==="text"?S.tl:0;$("cb").textContent="";$("me").style.width=$("bt").style.width="0";
 box.className=S.m==="text"?(S.tape?"t tape":"t"):"";box.scrollTop=0;code.style.transform="";code.style.transition="none";
 if(S.m==="code")skip();render();
}
const KW=new Set("def class return if else elif for while in import from as try except catch const let var function async await new public private static void int true false null None True False select using namespace include SELECT FROM WHERE JOIN ON AS GROUP BY ORDER DESC INSERT INTO VALUES HAVING".split(" "));"func package defer go range struct type interface map fn mut impl pub use match enum self mod foreach echo string number boolean fun val then fi do done switch case break continue extends this super static final".split(" ").forEach(w=>KW.add(w));function hlt(){hl=[];if(S.m!=="code")return;const n=T.length,sq=/SELECT|INSERT/.test(T);for(let i=0,j,k;i<n;){const c=T[i];k="";j=i+1;if(c==="'"||c==='"'){while(j<n&&T[j]!==c&&T.charCodeAt(j)!==10)j++;j++;k="hs"}else if(c==="#"&&/^#[0-9a-fA-F]{3,8}\b/.test(T.slice(i,i+9))){while(j<n&&/[0-9a-fA-F]/.test(T[j]))j++;k="hn"}else if((c==="#"&&T[i+1]!=="i")||c+T[i+1]==="//"||(sq&&c+T[i+1]==="--")){while(j<n&&T.charCodeAt(j)!==10)j++;k="hc"}else if(/[a-zA-Z_]/.test(c)){while(j<n&&/[a-zA-Z_0-9]/.test(T[j]))j++;if(KW.has(T.slice(i,j)))k="hk";else if(T[j]==="(")k="hf";else if(c>="A"&&c<="Z")k="ht"}else if(c>="0"&&c<="9"){while(j<n&&T[j]>="0"&&T[j]<="9")j++;k="hn"}else if("{}[]()<>;=".includes(c))k="hp";for(let x=i;x<j&&x<n;x++)hl[x]=k;i=j}}function skip(){if(pos===0||T[pos-1]==="\n")while(T[pos]===" "){st[pos]="s";pos++}}
function render(){
 const f=document.createDocumentFragment();
 for(let i=0;i<T.length;i++){const s=document.createElement("span"),ch=T[i];s.textContent=ch==="\n"?"↵\n":ch;let c=st[i]==="s"?"c":st[i];if(st[i]==="c"&&hl[i])c+=" "+hl[i];if(ch==="\n")c+=" nl";if(i===pos&&!done)c+=" cur";s.className=c;f.appendChild(s)}
 code.replaceChildren(f);
 if(S.m==="text"){const c=code.querySelector(".cur");if(c){if(S.tape){code.style.transition=pos?"":"none";code.style.transform="translateX("+Math.round(box.clientWidth*.4-c.offsetLeft)+"px)"}else box.scrollTop=Math.max(0,c.offsetTop-parseFloat(getComputedStyle(code).lineHeight))}}
 document.querySelectorAll("#kb .hi").forEach(e=>e.classList.remove("hi"));kbHi();
}
let gw=0;const bw=()=>{try{return S.bot<0?+localStorage.getItem(bk())||0:S.bot}catch(e){return 0}},botC=el=>Math.min(T.length,el/60*gw*5);
function stats(){const sec=Math.min((Date.now()-t0)/1000,S.m==="text"?S.tl:1e9),m=sec/60;return{w:m>0?Math.round(good/5/m):0,a:keys?Math.round(good/keys*100):100,s:Math.round(sec*10)/10}}
function tick(){
 const s=stats();$("wpm").textContent=s.w;$("acc").textContent=s.a;$("wpm").style.color=s.w>=100?"#ff5d73":s.w>=60?"#ffd23f":"";
 if(Math.floor(s.s)>smp.length)smp.push(s.w);
 if(S.bot){const sc=S.m==="code"?T.length:Math.max(S.tl/60*gw*5*1.3,1);$("me").style.width=Math.min(100,pos/sc*100)+"%";$("bt").style.width=Math.min(100,botC(s.s)/sc*100)+"%"}
 if(S.m==="text"){const left=Math.max(0,Math.ceil(S.tl-s.s));$("tm").textContent=left;if(left<=0)finish()}else $("tm").textContent=Math.floor(s.s);
}
function chart(a){if(a.length<2)return"";const mx=Math.max(...a,10),W=600,H=110,p=a.map((v,i)=>(i/(a.length-1)*W).toFixed(1)+","+(H-v/mx*H*.9-5).toFixed(1)).join(" ");return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="110" role="img" aria-label="Tezlik grafigi"><polyline points="${p}" fill="none" stroke="var(--acc)" stroke-width="3" stroke-linejoin="round"/></svg>`}
const RK=["Yangi boshlovchi","Yozuvchi","Dasturchi","Pro","Hacker","Afsona"],RX=[0,100,400,1000,2500,6000],rank=x=>{let i=0;while(i<5&&x>=RX[i+1])i++;return i};function xpShow(){let x=0;try{x=+localStorage.getItem("ct-x")||0}catch(e){}const i=rank(x),n=RX[i+1];$("xl").textContent="⭐ "+RK[i]+" · "+x+" XP"+(n?" / "+n:"");$("xf").style.width=(n?(x-RX[i])/(n-RX[i])*100:100)+"%"}function addXp(g){try{const x=+localStorage.getItem("ct-x")||0;localStorage.setItem("ct-x",x+g);xpShow();return rank(x+g)>rank(x)?RK[rank(x+g)]:""}catch(e){return""}}function day(w){try{let d=JSON.parse(localStorage.getItem("ct-d")||"{}");const f=x=>{const t=new Date();t.setDate(t.getDate()-x);return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")};if(w&&d.last!==f(0)){d={last:f(0),n:d.last===f(1)?(d.n||0)+1:1};localStorage.setItem("ct-d",JSON.stringify(d))}return d.last===f(0)||d.last===f(1)?d.n||0:0}catch(e){return 0}}function finish(){
 if(done)return;done=true;clearInterval(timer);render();document.body.classList.remove("f");
 const s=stats();let m="";try{window.ctDone&&window.ctDone({m:S.m,lang:S.lang,w:s.w,a:s.a,s:s.s})}catch(e){console.error(e)}
 $("rw").firstChild.nodeValue=s.w;$("ra").firstChild.nodeValue=s.a+"%";$("rt").firstChild.nodeValue=s.s;$("re").firstChild.nodeValue=errs;$("rc").firstChild.nodeValue=bcb;$("rr").firstChild.nodeValue=s.s?Math.round(keys/5/(s.s/60)):0;const q=smp.slice(2),mu=q.reduce((a,b)=>a+b,0)/(q.length||1),sd=Math.sqrt(q.reduce((a,b)=>a+(b-mu)**2,0)/(q.length||1));$("rs").firstChild.nodeValue=q.length>2&&mu?Math.max(0,Math.round(100-sd/mu*100))+"%":"—";
 $("wpm").textContent=s.w;$("acc").textContent=s.a;
 try{const p=+localStorage.getItem(bk())||0;if(s.w>p){localStorage.setItem(bk(),s.w);if(p){m="🎉 Yangi rekord! ";boom();beep(2)}}else if(p)m="Rekordingiz: "+p+" wpm. ";const h=getH();h.push({m:S.m,w:s.w,a:s.a,k:secLabel()});localStorage.setItem("ct-h",JSON.stringify(h.slice(-100)))}catch(e){}
 const up=addXp(Math.round(s.w*s.a/100)+10);if(up){m+="🏅 Yangi unvon: "+up+"! ";boom()}const dn=day(1);if(dn>1)m+="📅 "+dn+" kun ketma-ket! ";if(S.bot)m+=pos>=botC(s.s)?"Raqibni yengdingiz! 🏆":"Raqib yutdi, yana urinib ko‘ring.";
 $("rm").textContent=m||(s.w>=60?"Zo‘r tezlik!":"Natija tayyor");$("ch").innerHTML=chart(smp);$("cp").textContent="Natijani nusxalash";const tk=Object.entries(em).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>(k.trim()?k:"␣")+" ×"+v);$("rk").textContent=tk.length?"Eng ko‘p xato: "+tk.join("   "):"Xatosiz! 💯";$("res").classList.add("show");$("again").focus();
}
function combo(){const e=$("cb");e.textContent=cb>=10?"🔥 "+cb:"";e.style.filter=cb>=50?"drop-shadow(0 0 9px var(--bad))":cb>=25?"drop-shadow(0 0 7px var(--acc))":"";if(cb&&cb%25===0){e.classList.remove("p");void e.offsetWidth;e.classList.add("p");beep(2)}}
function press(k){kbPr(k);
 if(done)return;
 if(k==="Backspace"){if(S.strict&&st[pos]==="w"){st[pos]="";render();return}if(pos===0)return;pos--;while(pos>0&&st[pos]==="s")pos--;st[pos]="";render();return}
 const ch=k==="Enter"?"\n":k;
 if(S.m==="text"&&ch==="\n")return;
 if(!t0){t0=Date.now();timer=setInterval(tick,100);document.body.classList.add("f")}
 keys++;
 if(ch===T[pos]){st[pos]="c";good++;cb++;if(cb>bcb)bcb=cb;beep(ch==="\n"?4:ch===" "?3:0,ch)}
 else{errs++;cb=0;em[T[pos]]=(em[T[pos]]||0)+1;st[pos]="w";beep(1);if(S.strict){combo();render();return}}
 combo();pos++;
 if(S.m==="text"&&T.length-pos<150){const more=" "+gen(60);T+=more;for(let i=0;i<more.length;i++)st.push("")}
 if(pos>=T.length||(RL&&pos>=RL)){finish();return}
 if(ch==="\n")skip();
 render();
}
function showStats(){
 const c=$("st");if(c.classList.toggle("show")===false)return;
 const h=getH(),n=h.length;
 if(!n){c.innerHTML="<strong>Statistika</strong><p>Hozircha natijalar yo‘q. Birinchi testni yozing!</p>";return}
 const w=h.map(x=>x.w),mx=Math.max(...w,1);
 c.innerHTML=`<strong>Statistika</strong><div class="grid"><div>${n}<span>testlar</span></div><div>${Math.round(w.reduce((a,b)=>a+b,0)/n)}<span>o‘rtacha wpm</span></div><div>${mx}<span>eng yuqori wpm</span></div><div>${Math.round(h.reduce((a,b)=>a+b.a,0)/n)}%<span>o‘rtacha aniqlik</span></div><div>${day()}<span>kun ketma-ket</span></div></div><div class="bd">${[["🚀 50 wpm",mx>=50],["⚡ 100 wpm",mx>=100],["🎯 100% aniqlik",h.some(x=>x.a>=100)],["🔥 7 kun seriya",day()>=7],["💪 50 ta test",n>=50],["💻 20 ta kod testi",h.filter(x=>x.m==="code").length>=20]].map(([t,o])=>`<span style="opacity:${o?1:.3}">${t}</span>`).join("")}</div>${secTable(h)}<div class="bars">${h.slice(-20).map(x=>`<i style="height:${Math.round(x.w/mx*100)}%" title="${x.m}: ${x.w} wpm"></i>`).join("")}</div><button id="clr">Tozalash</button>`;
 $("clr").onclick=()=>{try{localStorage.removeItem("ct-h")}catch(e){}c.classList.remove("show")};
}
document.addEventListener("keydown",e=>{
 if(e.target.tagName==="TEXTAREA")return;if((e.target.tagName==="BUTTON"||e.target.tagName==="SUMMARY")&&(e.key==="Enter"||e.key===" "))return;
 if(e.key==="Escape"){e.preventDefault();init();return}
 const ag=e.getModifierState&&e.getModifierState("AltGraph"),mac=/Mac|iPhone|iPad/.test(navigator.platform||"");if(!ag&&(e.ctrlKey||e.metaKey||(e.altKey&&!(mac&&e.key.length===1))))return;
 if(e.key==="Tab"){e.preventDefault();init(false);return}
 if(e.key==="Backspace"||e.key==="Enter"||e.key.length===1){e.preventDefault();press(e.key)}
});
const hid=document.createElement("input");
hid.style.cssText="position:absolute;top:0;left:0;opacity:0;pointer-events:none;height:1px;width:1px";hid.setAttribute("autocomplete","off");
["autocapitalize","autocorrect"].forEach(a=>hid.setAttribute(a,"off"));hid.setAttribute("spellcheck","false");
box.appendChild(hid);box.addEventListener("click",()=>hid.focus({preventScroll:true}));
const SE="\u200b";hid.value=SE;hid.addEventListener("focus",()=>{hid.value=SE});
hid.addEventListener("input",()=>{const v=hid.value;hid.value=SE;if(v.length<SE.length){press("Backspace");return}for(const c of v.replace(SE,""))press(c)});

$("again").onclick=()=>{init();box.focus()};$("retry").onclick=()=>{init(false);box.focus()};const KB=[["`~","1!","2@","3#","4$","5%","6^","7&","8*","9(","0)","-_","=+"],["qQ","wW","eE","rR","tT","yY","uU","iI","oO","pP","[{","]}",String.fromCharCode(92)+"|"],["aA","sS","dD","fF","gG","hH","jJ","kK","lL",";:","'"+String.fromCharCode(34)],["zZ","xX","cC","vV","bB","nN","mM",",<",".>","/?"]],FG=[[0,0,1,2,3,3,4,4,5,6,7,7,7],[0,1,2,3,3,4,4,5,6,7,7,7,7],[0,1,2,3,3,4,4,5,6,7,7],[0,1,2,3,3,4,4,5,6,7]],km={},esc=x=>x==="<"?"&lt;":x===">"?"&gt;":x==="&"?"&amp;":x;let ki=0;$("kb").innerHTML=KB.map((row,ri)=>"<div>"+["",'<b class="w">Tab</b>','<b class="w">Caps</b>','<b class="w s">Shift</b>'][ri]+row.map((p,ci)=>{const i=ki++,L=/[a-z]/.test(p[0]);km[p[0]]=[i,0];km[p[1]]=[i,1];return `<b class="f${FG[ri][ci]}" id="k${i}">${L?"":"<u>"+esc(p[1])+"</u>"}${esc(L?p[1]:p[0])}</b>`}).join("")+['<b class="w">⌫</b>',"",'<b class="w" id="ke">Enter</b>','<b class="w s">Shift</b>'][ri]+"</div>").join("")+'<div><b class="sp" id="ksp">space</b></div>';function kbHi(){const c=T[pos];if(c===undefined)return;let e;if(c===" ")e=$("ksp");else if(c.charCodeAt(0)===10)e=$("ke");else{const m=km[c];if(m){e=$("k"+m[0]);if(m[1])document.querySelectorAll("#kb .s").forEach(x=>x.classList.add("hi"))}}if(e)e.classList.add("hi")}function kbPr(k){const m=km[k],e=k===" "?$("ksp"):m&&$("k"+m[0]);if(e){e.classList.add("pr");setTimeout(()=>e.classList.remove("pr"),130)}}$("cta").value=S.cu||"";$("cgo").onclick=()=>{const v=$("cta").value.split(String.fromCharCode(13)).join("").split(String.fromCharCode(9)).join("    ").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').split("\n").map(l=>l.trimEnd()).join("\n").trimEnd();if(v.length>3){S.cu=v.slice(0,1500);save();init();box.focus()}};
$("cp").onclick=()=>{const tx="CodeType: "+$("rw").firstChild.nodeValue+" wpm, aniqlik "+$("ra").firstChild.nodeValue+" ("+(S.m==="code"?S.lang:"matn")+") "+DOMAIN,ok=()=>{$("cp").textContent="Nusxalandi ✓"},no=()=>{$("cp").textContent="Nusxalab bo‘lmadi"},fb=()=>{const t=document.createElement("textarea");t.value=tx;document.body.appendChild(t);t.select();let k=0;try{k=document.execCommand("copy")}catch(e){}t.remove();k?ok():no()};try{navigator.clipboard?navigator.clipboard.writeText(tx).then(ok,fb):fb()}catch(e){fb()}};
$("ft").textContent="© CodeType · "+DOMAIN;$("bs").onclick=showStats;xpShow();
$("bsn").onclick=()=>{S.snd=+!S.snd;save();build();if(S.snd)pv();box.focus()};
$("fm").onclick=()=>{S.fs=Math.max(.9,+(S.fs-.1).toFixed(1));save();theme()};
$("fp").onclick=()=>{S.fs=Math.min(2,+(S.fs+.1).toFixed(1));save();theme()};
build();init();

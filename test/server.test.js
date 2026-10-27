"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("fs"),os=require("os"),path=require("path");
const{createApp}=require("../server.js");

const tmp=()=>path.join(fs.mkdtempSync(path.join(os.tmpdir(),"ct-")),"db.json");
async function start(file=tmp()){
 const app=createApp({dataFile:file});
 await new Promise(r=>app.server.listen(0,"127.0.0.1",r));
 const base="http://127.0.0.1:"+app.server.address().port;
 const call=(m,p,b)=>fetch(base+"/ct/"+p+".json",{method:m,body:b===undefined?undefined:JSON.stringify(b)});
 return{app,base,file,call,stop:()=>app.close()}}

test("PUT/GET/DELETE va bo‘sh tugunlarni tozalash",async()=>{
 const s=await start();
 assert.equal(await(await s.call("GET","p/1/meta")).json(),null);
 await s.call("PUT","p/1/st/ali",{n:"Ali",c:1});
 assert.deepEqual(await(await s.call("GET","p/1")).json(),{st:{ali:{n:"Ali",c:1}}});
 await s.call("DELETE","p/1/st/ali");
 assert.equal(await(await s.call("GET","p")).json(),null);
 await s.stop()});

test("PATCH birlashtiradi, null o‘chiradi",async()=>{
 const s=await start();
 await s.call("PUT","x",{a:1,b:2});
 await s.call("PATCH","x",{b:null,c:3});
 assert.deepEqual(await(await s.call("GET","x")).json(),{a:1,c:3});
 await s.stop()});

test("noto‘g‘ri kalitlar va yo‘llar rad etiladi",async()=>{
 const s=await start();
 for(const p of["a.b","a%2Fb","__proto__","a$b","a%20b"])assert.equal((await s.call("PUT",p,1)).status,400,p);
 assert.equal((await s.call("PUT","x","{bad")).status,200);
 const r=await fetch(s.base+"/ct/x.json",{method:"PUT",body:"{bad"});assert.equal(r.status,400);
 const r2=await fetch(s.base+"/ct/x.json",{method:"PUT",body:'{"__proto__":{"a":1}}'});assert.equal(r2.status,400);
 await s.stop()});

test("juda katta so‘rov 413 qaytaradi",async()=>{
 const s=await start();
 const r=await fetch(s.base+"/ct/big.json",{method:"PUT",body:JSON.stringify("x".repeat(1100000))}).catch(e=>({status:413}));
 assert.equal(r.status,413);
 await s.stop()});

test("ma‘lumot diskka yoziladi va qayta yuklanadi",async()=>{
 const f=tmp(),a=await start(f);
 await a.call("PUT","p/2/meta",{name:"9-A"});
 await a.stop();
 const b=await start(f);
 assert.deepEqual(await(await b.call("GET","p/2/meta")).json(),{name:"9-A"});
 await b.stop()});

test("buzilgan baza fayli serverni yiqitmaydi",async()=>{
 const f=tmp();fs.writeFileSync(f,"{buzuq");
 const s=await start(f);
 assert.equal(await(await s.call("GET","p")).json(),null);
 assert.ok(fs.readdirSync(path.dirname(f)).some(n=>n.includes("corrupt")));
 await s.stop()});

test("statik fayllar: faqat ruxsat etilganlari",async()=>{
 const s=await start();
 const home=await fetch(s.base+"/");assert.equal(home.status,200);assert.match(await home.text(),/CodeType/);
 for(const p of["/server.js","/package.json","/data/db.json","/test/server.test.js","/js/../server.js","/%2e%2e/server.js"])
  assert.equal((await fetch(s.base+p)).status,404,p);
 const cfg=await(await fetch(s.base+"/js/config.js")).text();
 assert.ok(cfg.includes(JSON.stringify(s.base)),cfg);
 const css=await fetch(s.base+"/css/style.css");assert.equal(css.status,200);
 const again=await fetch(s.base+"/css/style.css",{headers:{"If-None-Match":css.headers.get("etag")}});assert.equal(again.status,304);
 await s.stop()});

test("healthz va CORS",async()=>{
 const s=await start();
 assert.equal((await(await fetch(s.base+"/healthz")).json()).ok,true);
 const o=await fetch(s.base+"/ct/x.json",{method:"OPTIONS"});assert.equal(o.status,204);
 assert.equal(o.headers.get("access-control-allow-origin"),"*");
 await s.stop()});

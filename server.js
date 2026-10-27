#!/usr/bin/env node
"use strict";
/*
 * CodeType server: statik fayllar + umumiy ma'lumot bazasi (JSON fayl).
 * Tashqi kutubxona kerak emas, faqat Node.js 18+.
 *
 *   npm start
 *   node server.js --port 3000 --host 0.0.0.0 --data data/db.json
 */
const http=require("http"),fs=require("fs"),path=require("path"),os=require("os"),zlib=require("zlib");

const ROOT=__dirname;
const MAX_BODY=1024*1024;
const KEY_RE=/^[A-Za-z0-9_~-]{1,200}$/;
const BAD_KEYS=new Set(["__proto__","constructor","prototype"]);
const MIME={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".txt":"text/plain; charset=utf-8"};
const STATIC_OK=p=>p==="/"||p==="/index.html"||/^\/(css|js)\/[\w.-]+$/.test(p);

/* ---------- ma'lumot ombori ---------- */
function createStore(file){
 let tree={},timer=null,dirty=false;
 try{tree=JSON.parse(fs.readFileSync(file,"utf8"))||{}}catch(e){
  if(e.code!=="ENOENT"){try{fs.renameSync(file,file+".corrupt-"+Date.now());console.error("Ogohlantirish: db fayli buzilgan, nusxasi saqlandi, yangi baza boshlandi.")}catch(_){}}
  tree={}}
 const clean=v=>{if(v&&typeof v==="object"){if(Array.isArray(v))v=Object.assign({},v);for(const k of Object.keys(v)){const c=clean(v[k]);if(c===null)delete v[k];else v[k]=c}return Object.keys(v).length?v:null}return v===undefined?null:v};
 const find=(segs,create)=>{let o=tree;for(let i=0;i<segs.length-1;i++){let n=o[segs[i]];if(n===null||typeof n!=="object"){if(!create)return null;n=o[segs[i]]={}}o=n}return o};
 const at=segs=>{let o=tree;for(const k of segs){if(o===null||typeof o!=="object"||!Object.prototype.hasOwnProperty.call(o,k))return undefined;o=o[k]}return o};
 const prune=segs=>{for(let i=segs.length-1;i>=1;i--){const n=at(segs.slice(0,i));if(n&&typeof n==="object"&&!Object.keys(n).length){const par=i>1?at(segs.slice(0,i-1)):tree;delete par[segs[i-1]]}else break}};
 const save=()=>{dirty=false;try{fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+".tmp";fs.writeFileSync(tmp,JSON.stringify(tree));fs.renameSync(tmp,file)}catch(e){console.error("Saqlash xatosi:",e.message);dirty=true}};
 const touch=()=>{dirty=true;if(!timer)timer=setTimeout(()=>{timer=null;save()},300)};
 return{
  get(segs){let o=tree;for(const s of segs){if(o===null||typeof o!=="object"||!Object.prototype.hasOwnProperty.call(o,s))return null;o=o[s]}return o===undefined?null:o},
  set(segs,v){v=clean(v);if(!segs.length){tree=v||{};touch();return}if(v===null){this.del(segs);return}const o=find(segs,true);o[segs[segs.length-1]]=v;touch()},
  del(segs){if(!segs.length){tree={};touch();return}const o=find(segs,false);if(o)delete o[segs[segs.length-1]];prune(segs);touch()},
  patch(segs,obj){for(const k of Object.keys(obj)){if(!KEY_RE.test(k)||BAD_KEYS.has(k))throw new Error("bad key");this.set(segs.concat(k),obj[k])}},
  flush(){if(timer){clearTimeout(timer);timer=null}if(dirty)save()}
 }}

/* ---------- HTTP ---------- */
function createApp({dataFile,root=ROOT,log=false}={}){
 const store=createStore(dataFile),gz=new Map(),started=Date.now();
 const send=(res,code,body,headers={})=>{res.writeHead(code,{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...headers});res.end(body)};
 const json=(res,code,v)=>send(res,code,JSON.stringify(v),{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"});
 const readBody=req=>new Promise((ok,no)=>{let n=0;const a=[];req.on("data",c=>{n+=c.length;if(n>MAX_BODY){no(Object.assign(new Error("too large"),{code:413}));req.destroy();return}a.push(c)});req.on("end",()=>ok(Buffer.concat(a).toString("utf8")));req.on("error",no)});

 async function api(req,res,url){
  const raw=url.pathname.slice(4,-5),segs=raw.split("/").filter(Boolean);
  if(segs.length>8||segs.some(s=>!KEY_RE.test(s)||BAD_KEYS.has(s)))return json(res,400,{error:"Invalid path"});
  if(!segs.length)return json(res,403,{error:"Butun bazaga ruxsat yo‘q"});
  switch(req.method){
   case"GET":return json(res,200,store.get(segs));
   case"DELETE":store.del(segs);return json(res,200,null);
   case"PUT":case"PATCH":{
    const body=await readBody(req);let v;
    try{v=JSON.parse(body)}catch(e){return json(res,400,{error:"Invalid JSON"})}
    if(/"__proto__"/.test(body))return json(res,400,{error:"Invalid key"});
    if(req.method==="PUT")store.set(segs,v);
    else{if(!v||typeof v!=="object"||Array.isArray(v))return json(res,400,{error:"PATCH needs an object"});try{store.patch(segs,v)}catch(e){return json(res,400,{error:"Invalid key"})}}
    return json(res,200,v)}
   default:return json(res,405,{error:"Method not allowed"})}}

 function serveStatic(req,res,url){
  if(req.method!=="GET"&&req.method!=="HEAD")return send(res,405,"Method not allowed");
  let p=url.pathname;if(p==="/")p="/index.html";
  if(p==="/js/config.js"){const proto=req.headers["x-forwarded-proto"]||"http";return send(res,200,`window.CT_CONFIG={dbUrl:${JSON.stringify(proto+"://"+req.headers.host)}};\n`,{"Content-Type":MIME[".js"]})}
  if(!STATIC_OK(url.pathname==="/"?"/":p))return send(res,404,"Not found");
  const file=path.join(root,p);if(!file.startsWith(root+path.sep))return send(res,404,"Not found");
  fs.stat(file,(err,st)=>{
   if(err||!st.isFile())return send(res,404,"Not found");
   const etag='W/"'+st.size.toString(16)+"-"+Math.floor(st.mtimeMs).toString(16)+'"';
   const h={"Content-Type":MIME[path.extname(file)]||"application/octet-stream","Cache-Control":"no-cache",ETag:etag,"Referrer-Policy":"strict-origin-when-cross-origin","X-Content-Type-Options":"nosniff","X-Frame-Options":"SAMEORIGIN"};
   if(req.headers["if-none-match"]===etag){res.writeHead(304,h);return res.end()}
   fs.readFile(file,(e,buf)=>{
    if(e)return send(res,500,"Server error");
    if(/gzip/.test(req.headers["accept-encoding"]||"")&&/^(text|application\/json|image\/svg)/.test(h["Content-Type"])){
     let z=gz.get(etag);if(!z){z=zlib.gzipSync(buf);gz.set(etag,z)}buf=z;h["Content-Encoding"]="gzip";h.Vary="Accept-Encoding"}
    res.writeHead(200,h);res.end(req.method==="HEAD"?undefined:buf)})})}

 const server=http.createServer(async(req,res)=>{
  const t=Date.now();
  try{
   const url=new URL(req.url,"http://x");
   if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,PUT,PATCH,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400"});return res.end()}
   if(url.pathname==="/healthz")return json(res,200,{ok:true,now:Date.now(),uptime:Math.round((Date.now()-started)/1000)});
   if(url.pathname.startsWith("/ct/")&&url.pathname.endsWith(".json"))await api(req,res,url);
   else serveStatic(req,res,url)
  }catch(e){
   if(!res.headersSent){if(e.code===413)json(res,413,{error:"Payload too large"});else{console.error(e);json(res,500,{error:"Server error"})}}
  }
  if(log||res.statusCode>=500)res.on("finish",()=>console.log(new Date().toISOString(),req.method,req.url,res.statusCode,Date.now()-t+"ms"))
 });
 server.requestTimeout=15000;server.headersTimeout=10000;
 return{server,store,close:()=>new Promise(r=>{store.flush();server.close(r)})}}

/* ---------- ishga tushirish ---------- */
function lanUrls(port){const o=[];for(const list of Object.values(os.networkInterfaces()))for(const i of list||[])if(i.family==="IPv4"&&!i.internal)o.push(`http://${i.address}:${port}`);return o}
function main(){
 const a=process.argv.slice(2),arg=(n,d)=>{const i=a.indexOf("--"+n);return i>=0&&a[i+1]?a[i+1]:d};
 if(a.includes("--help")||a.includes("-h")){console.log("CodeType server\n\n  node server.js [--port 3000] [--host 0.0.0.0] [--data data/db.json] [--log]\n\nMuhit o'zgaruvchilari: PORT, HOST, DATA_FILE");return}
 const port=+arg("port",process.env.PORT||3000),host=arg("host",process.env.HOST||"0.0.0.0");
 const dataFile=path.resolve(arg("data",process.env.DATA_FILE||path.join(ROOT,"data","db.json")));
 if(!Number.isInteger(port)||port<0||port>65535){console.error("Port noto‘g‘ri.");process.exit(1)}
 const app=createApp({dataFile,log:a.includes("--log")});
 app.server.on("error",e=>{console.error(e.code==="EADDRINUSE"?`Port ${port} band. Boshqa port tanlang: npm start -- --port ${port+1}`:e.message);process.exit(1)});
 app.server.listen(port,host,()=>{
  console.log("\n  CodeType ishga tushdi\n");
  console.log(`  Shu kompyuterda:  http://localhost:${port}`);
  if(host==="0.0.0.0")lanUrls(port).forEach(u=>console.log(`  Sinf Wi-Fi'ida:   ${u}`));
  console.log(`  Ma'lumot fayli:   ${dataFile}\n\n  To‘xtatish: Ctrl+C\n`)});
 const stop=()=>{console.log("\nSaqlanmoqda va to‘xtatilmoqda…");app.store.flush();app.server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),2000).unref()};
 process.on("SIGINT",stop);process.on("SIGTERM",stop);
}
if(require.main===module)main();
module.exports={createApp,createStore};

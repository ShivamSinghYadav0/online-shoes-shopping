'use strict';
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const {products}=require('./catalog');
const PORT=Number(process.env.PORT||3100),HOST=process.env.HOST||'127.0.0.1',ROOT=path.join(__dirname,'public'),DATA=process.env.DATA_FILE||path.join(__dirname,'data','store.json');
const secureCookie=process.env.COOKIE_SECURE==='true';
fs.mkdirSync(path.dirname(DATA),{recursive:true});let db;
try{db=JSON.parse(fs.readFileSync(DATA,'utf8'))}catch{db={users:[],sessions:[],addresses:[],orders:[]}}
for(const k of ['users','sessions','addresses','orders'])if(!Array.isArray(db[k]))db[k]=[];
function persist(){const temp=DATA+'.tmp';fs.writeFileSync(temp,JSON.stringify(db,null,2),{mode:0o600});fs.renameSync(temp,DATA)}
function json(res,status,obj,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(obj))}
function error(res,status,message){json(res,status,{error:message})}
function cookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').map(s=>s.trim().split('=')).filter(x=>x.length===2))}
function session(req){const raw=cookies(req).sd_session;if(!raw||!/^[a-f0-9]{64}$/.test(raw))return null;const hash=crypto.createHash('sha256').update(raw).digest('hex');const sess=db.sessions.find(s=>s.tokenHash===hash&&s.expires>Date.now());return sess?{sess,user:db.users.find(u=>u.id===sess.userId)}:null}
function auth(req,res){const s=session(req);if(!s?.user){error(res,401,'Log in to continue.');return null}return s.user}
const publicUser=u=>({id:u.id,name:u.name,email:u.email,joinedAt:u.joinedAt});
function cookie(v,maxAge){return `sd_session=${v}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secureCookie?'; Secure':''}`}
function startSession(res,user){const raw=crypto.randomBytes(32).toString('hex');db.sessions.push({userId:user.id,tokenHash:crypto.createHash('sha256').update(raw).digest('hex'),expires:Date.now()+7*864e5});persist();return {'Set-Cookie':cookie(raw,7*86400)}}
function hashPass(pass,salt){return crypto.scryptSync(pass,salt,64).toString('hex')}
function equalPass(p,u){return crypto.timingSafeEqual(Buffer.from(hashPass(p,u.salt),'hex'),Buffer.from(u.passwordHash,'hex'))}
function clean(s,max=120){return typeof s==='string'?s.trim().slice(0,max):''}
function validAddress(a){if(!a||typeof a!=='object')return null;let v={name:clean(a.name,90),phone:clean(a.phone,12),line1:clean(a.line1,180),landmark:clean(a.landmark,100),city:clean(a.city,80),state:clean(a.state,80),pin:clean(a.pin,10)};if(!v.name||!v.line1||!v.city||!v.state||!/^[6-9][0-9]{9}$/.test(v.phone)||!/^[1-9][0-9]{5}$/.test(v.pin))return null;return v}
async function body(req){let chunks=[],bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>32_000)throw new Error('Request body too large');chunks.push(chunk)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}catch{throw new Error('Invalid JSON')}}
function routeAPI(req,res,pathname){const method=req.method;return (async()=>{
 if(pathname==='/api/health'&&method==='GET')return json(res,200,{status:'ok',service:'auvryko',release:'V15',catalogSize:products.length});
 if(pathname==='/api/products'&&method==='GET')return json(res,200,{products});
 if(pathname==='/api/auth/me'&&method==='GET'){const s=session(req);return json(res,200,{user:s?.user?publicUser(s.user):null})}
 if(pathname==='/api/auth/signup'&&method==='POST'){
  const b=await body(req),name=clean(b.name,60),email=clean(b.email,120).toLowerCase(),password=b.password;
  if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||typeof password!=='string'||password.length<8||password.length>128)return error(res,400,'Enter name, valid email and a password of 8–128 characters.');
  if(db.users.some(u=>u.email===email))return error(res,409,'Email already registered.');
  const salt=crypto.randomBytes(16).toString('hex'),user={id:crypto.randomUUID(),name,email,salt,passwordHash:hashPass(password,salt),joinedAt:new Date().toISOString()};db.users.push(user);return json(res,201,{user:publicUser(user)},startSession(res,user));
 }
 if(pathname==='/api/auth/login'&&method==='POST'){
  const b=await body(req),email=clean(b.email,120).toLowerCase(),password=b.password;const user=db.users.find(u=>u.email===email);
  if(!user||typeof password!=='string'||!equalPass(password,user))return error(res,401,'Incorrect email or password.');
  return json(res,200,{user:publicUser(user)},startSession(res,user));
 }
 if(pathname==='/api/auth/logout'&&method==='POST'){
  const raw=cookies(req).sd_session,hash=raw?crypto.createHash('sha256').update(raw).digest('hex'):'';db.sessions=db.sessions.filter(s=>s.tokenHash!==hash);persist();return json(res,200,{ok:true},{'Set-Cookie':cookie('',0)});
 }
 if(pathname==='/api/addresses'&&method==='GET'){const u=auth(req,res);if(!u)return;return json(res,200,{addresses:db.addresses.filter(a=>a.userId===u.id).map(({userId,...a})=>a)})}
 if(pathname==='/api/addresses'&&method==='POST'){
  const u=auth(req,res);if(!u)return;const a=validAddress(await body(req));if(!a)return error(res,400,'Enter a valid address, mobile and PIN.');
  const saved={id:crypto.randomUUID(),userId:u.id,...a};db.addresses.push(saved);persist();const {userId,...returned}=saved;return json(res,201,{address:returned});
 }
 const m=pathname.match(/^\/api\/addresses\/([a-f0-9-]+)$/);
 if(m&&method==='PUT'){const u=auth(req,res);if(!u)return;const a=db.addresses.find(x=>x.id===m[1]&&x.userId===u.id);if(!a)return error(res,404,'Address not found.');const v=validAddress(await body(req));if(!v)return error(res,400,'Enter a valid address.');Object.assign(a,v);persist();const {userId,...returned}=a;return json(res,200,{address:returned})}
 if(m&&method==='DELETE'){const u=auth(req,res);if(!u)return;const n=db.addresses.length;db.addresses=db.addresses.filter(x=>!(x.id===m[1]&&x.userId===u.id));if(n===db.addresses.length)return error(res,404,'Address not found.');persist();return json(res,200,{ok:true})}
 if(pathname==='/api/orders'&&method==='GET'){const u=auth(req,res);if(!u)return;return json(res,200,{orders:db.orders.filter(o=>o.userId===u.id).map(({userId,...o})=>o).reverse()})}
 if(pathname==='/api/orders'&&method==='POST'){
  const u=auth(req,res);if(!u)return;const b=await body(req),a=db.addresses.find(x=>x.id===b.addressId&&x.userId===u.id);if(!a)return error(res,400,'Select a saved delivery address.');
  if(!Array.isArray(b.items)||b.items.length<1||b.items.length>30)return error(res,400,'Your bag is empty or too large.');
  const items=[];for(const x of b.items){const p=products.find(p=>p.id===x.id);if(!p||!Number.isInteger(x.size)||x.size<6||x.size>11||!Number.isInteger(x.qty)||x.qty<1||x.qty>10)return error(res,400,'Invalid shoe, size or quantity.');items.push({id:p.id,name:p.name,img:p.img,price:p.price,size:x.size,qty:x.qty})}
  const subtotal=items.reduce((sum,x)=>sum+x.price*x.qty,0),shipping=subtotal>=3999?0:199;
  const order={id:'AV-'+crypto.randomBytes(5).toString('hex').toUpperCase(),userId:u.id,items,address:{name:a.name,phone:a.phone,line1:a.line1,landmark:a.landmark,city:a.city,state:a.state,pin:a.pin},payment:'Cash on Delivery',status:'Order received',subtotal,shipping,total:subtotal+shipping,createdAt:new Date().toISOString()};db.orders.push(order);persist();const {userId,...returned}=order;return json(res,201,{order:returned});
 }
 return error(res,404,'API endpoint not found.');
 })().catch(e=>error(res,e.message==='Request body too large'?413:400,e.message==='Request body too large'?e.message:'Invalid request.'))}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){
  if(!['GET','HEAD'].includes(req.method)){const origin=req.headers.origin;if(origin){try{if(new URL(origin).host!==req.headers.host)return error(res,403,'Cross-origin request rejected.')}catch{return error(res,403,'Invalid origin.')}}}
  return routeAPI(req,res,url.pathname);
 }
 if(!['GET','HEAD'].includes(req.method))return error(res,405,'Method not allowed.');
 const target=path.resolve(ROOT,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!target.startsWith(ROOT+path.sep))return error(res,403,'Forbidden.');
 fs.readFile(target,(err,buf)=>{if(err)return error(res,404,'Not found.');res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store, max-age=0, must-revalidate','X-AUVRYKO-Release':'V15','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; img-src 'self' https://images.unsplash.com https://upload.wikimedia.org https://thumb.wikimedia.org data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?'':buf)});
});
if(require.main===module)server.listen(PORT,HOST,()=>console.log(`AUVRYKO V15 READY → http://${HOST}:${PORT}`));
module.exports={server};

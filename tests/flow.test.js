const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
process.env.DATA_FILE=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'sole-test-')),'store.json');
const {server}=require('../server');
let base,cookie;
test.before(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port});
test.after(async()=>{await new Promise(resolve=>server.close(resolve))});
async function req(url,method='GET',data,ck=cookie){const r=await fetch(base+url,{method,headers:{...(data?{'content-type':'application/json'}:{}),...(ck?{cookie:ck}:{})},body:data?JSON.stringify(data):undefined});const json=await r.json();return {status:r.status,json,headers:r.headers}}
test('public products, frontend HTML and script',async()=>{let r=await req('/api/products');assert.equal(r.status,200);assert.equal(r.json.products.length,36);assert.equal(r.json.products.filter(p=>p.new).length,22);assert.equal((await req('/api/health')).json.catalogSize,36);const page=await fetch(base+'/');assert.equal(page.status,200);assert.match(await page.text(),/AUVRYKO/);assert.equal((await fetch(base+'/app.js')).status,200);assert.equal((await fetch(base+'/v6.css')).status,200);assert.equal((await fetch(base+'/v10-gallery.css')).status,200);assert.equal((await fetch(base+'/assets/footwear-fallback.svg')).status,200)});
test('auth and account isolation',async()=>{let x=await req('/api/auth/signup','POST',{name:'Runner One',email:'runner@example.com',password:'safePass123'});assert.equal(x.status,201);cookie=x.headers.get('set-cookie').split(';')[0];assert.equal((await req('/api/auth/me')).json.user.name,'Runner One');assert.equal((await fetch(base+'/api/addresses')).status,401);const wrong=await req('/api/auth/login','POST',{email:'runner@example.com',password:'bad'});assert.equal(wrong.status,401)});
test('address CRUD, order totals calculated server side and history',async()=>{let a=await req('/api/addresses','POST',{name:'Runner One',phone:'9876543210',line1:'House 11, Main Street',city:'Delhi',state:'Delhi',pin:'110001'});assert.equal(a.status,201);const id=a.json.address.id;const edit=await req('/api/addresses/'+id,'PUT',{name:'Runner One',phone:'9876543210',line1:'House 12, Main Street',city:'Delhi',state:'Delhi',pin:'110001'});assert.equal(edit.status,200);let order=await req('/api/orders','POST',{addressId:id,items:[{id:1,size:9,qty:2,price:1}]});assert.equal(order.status,201);assert.equal(order.json.order.total,8998);assert.equal(order.json.order.payment,'Cash on Delivery');const hist=await req('/api/orders');assert.equal(hist.json.orders.length,1);assert.equal(hist.json.orders[0].address.line1,'House 12, Main Street');const bad=await req('/api/orders','POST',{addressId:id,items:[{id:200,size:9,qty:1}]});assert.equal(bad.status,400);assert.equal((await req('/api/addresses/'+id,'DELETE')).status,200);assert.equal((await req('/api/orders')).json.orders.length,1)});
test('second account cannot see first orders',async()=>{const x=await req('/api/auth/signup','POST',{name:'New Runner',email:'new@example.com',password:'anotherPass11'});assert.equal(x.status,201);const otherCookie=x.headers.get('set-cookie').split(';')[0];assert.equal((await req('/api/orders','GET',null,otherCookie)).json.orders.length,0);assert.equal((await req('/api/addresses','GET',null,otherCookie)).json.addresses.length,0)});


test('photo credits page is public and CSP permits credited Wikimedia photo host',async()=>{
 const r=await fetch(base+'/photo-credits.html');
 assert.equal(r.status,200);
 assert.match(await r.text(),/Jacek Halicki/);
 const policy=r.headers.get('content-security-policy');
 assert.match(policy,/upload\.wikimedia\.org/);
 assert.match(policy,/images\.unsplash\.com/);
});

const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {products}=require('../catalog');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('V11 featured product exposes three genuine distinct photos',()=>{
 const shoe=products.find(p=>p.id===1);
 assert.equal(shoe.gallery.length,3);
 assert.equal(new Set(shoe.gallery.map(v=>v.src)).size,3);
 assert.equal(shoe.photoVerifiedAngles,true);
});
test('V11 responsive modal is contained in the viewport and has real scrollable zoom',()=>{
 const css=read('public/v11-responsive.css');
 const html=read('public/index.html');
 assert.match(css,/grid-template-rows:auto minmax\(0,1fr\) auto/);
 assert.match(css,/height:min\(740px,calc\(100dvh - 30px\)\)/);
 assert.match(css,/\.photo-pan-viewport\{[^}]*overflow:auto/s);
 assert.match(css,/\.photo-pan-canvas\{[^}]*--gallery-zoom/s);
 assert.match(html,/id="photoPanViewport"/);
 assert.match(html,/v11-responsive\.css/);
});
test('V11 content-first shop, compact footer, responsive animated shoe showcase',()=>{
 const html=read('public/index.html');
 const app=read('public/app.js');
 const css=read('public/v11-responsive.css');
 assert.match(html,/footer-main/);
 assert.doesNotMatch(html,/NEVER<br>STAND STILL/);
 assert.match(app,/shop-header-compact/);
 assert.match(app,/hero-sneaker-panel/);
 assert.match(app,/heroShoeImage/);
 assert.match(app,/shop\(pathNow\(\)\);updateNavigation/);
 for(const breakpoint of ['1170','800','540','370'])assert.ok(css.includes(`max-width:${breakpoint}px`));
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/html\.route-switching\{scroll-behavior:auto!important\}/);
});

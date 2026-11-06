const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {products}=require('../catalog');
const root=path.join(__dirname,'..');

test('complete six-category collection with distinct SKUs',()=>{
 assert.equal(products.length,36);
 assert.equal(new Set(products.map(p=>p.id)).size,36);
 assert.equal(products.filter(p=>p.new).length,22);
 for(const category of ['Running','Training','Basketball','Lifestyle','Outdoor','Walking']){
  assert.equal(products.filter(p=>p.category===category).length,6,category);
 }
});
test('product content and prices remain valid',()=>{
 for(const p of products){
  assert.ok(Number.isInteger(p.id) && p.id>0);
  assert.ok(p.name && p.description && p.tag && /^#[0-9a-f]{6}$/i.test(p.tone));
  assert.ok(Number.isInteger(p.price) && p.price>0);
 }
});
test('GitHub docs and theme assets are included',()=>{
 for(const file of ['README.md','DEPLOYMENT.md','.gitignore','.github/workflows/ci.yml','public/v8.css','public/theme-init.js','public/assets/favicon.svg']){
  assert.ok(fs.existsSync(path.join(root,file)),file);
 }
});


test('real shoe photography uses working gallery metadata and documented sources',()=>{
 const sets=products.filter(p=>p.photoVerifiedAngles);
 assert.equal(sets.length,5,'Five products should have independent camera photographs');
 for(const p of products){
  assert.match(p.img,/^https:\/\/(images\.unsplash\.com|upload\.wikimedia\.org)\//);
  assert.ok(Array.isArray(p.gallery)&&p.gallery.length>0);
  for(const view of p.gallery){
   assert.match(view.src,/^https:\/\//);
   assert.ok(view.label);
  }
  if(p.photoVerifiedAngles){
   assert.ok(p.gallery.length>=2);
   assert.equal(new Set(p.gallery.map(v=>v.src)).size,p.gallery.length,'Multi-angle photographs must be unique');
  } else {
   assert.equal(p.gallery.length,1,'Cannot claim different physical angles from one photo');
  }
 }
 for(const file of ['PHOTO_SOURCES.md','public/photo-credits.html','public/v9-photos.css'])assert.ok(fs.existsSync(path.join(root,file)));
});


test('V11 gallery uses real camera photos and separate zoom controls',()=>{
 const app=fs.readFileSync(path.join(root,'public/app.js'),'utf8');
 const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
 assert.match(app,/galleryImages\(p\)/);
 assert.match(app,/return Array\.isArray\(p\.gallery\)/);
 assert.doesNotMatch(app,/CLOSE-UP \/ SAME PHOTO/);
 assert.doesNotMatch(app,/MATERIAL \/ SAME PHOTO/);
 assert.match(app,/galleryZoom=1; \/\/ Changing views NEVER zooms/);
 assert.match(html,/lightboxZoomPercent/);
 assert.match(html,/data-gallery-zoom="in"/);
 assert.match(html,/data-gallery-zoom="out"/);
 assert.match(html,/data-gallery-zoom="reset"/);
 assert.match(html,/v10-gallery\.css/);
 assert.ok(fs.existsSync(path.join(root,'public/v10-gallery.css')));
});

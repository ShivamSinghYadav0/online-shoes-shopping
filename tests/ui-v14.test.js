'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const {products}=require('../catalog');
test('V14 every storefront category has a populated, distinct product selection',()=>{
 const categories=['Running','Training','Basketball','Lifestyle','Outdoor','Walking'];
 assert.equal(products.length,36);
 for(const category of categories){
  const items=products.filter(p=>p.category===category);
  assert.equal(items.length,6,`${category} should have six shoes`);
  assert.equal(new Set(items.map(p=>p.id)).size,6);
  assert.ok(items.every(p=>p.name&&p.img.startsWith('https://')));
 }
});
test('V14 release CSS applies the same collection layout to every category',()=>{
 const css=read('public/v14-release.css');
 const html=read('public/index.html');
 const js=read('public/app.js');
 assert.match(html,/href="\/v14-release\.css"/);
 assert.match(css,/\.shop-page-v13 \.shop-header-v13/);
 assert.match(css,/\.shop-page-v13 \.product-grid/);
 assert.match(css,/\.shoe-visual:after\{content:none!important\}/);
 assert.match(css,/\.footer\.compact-footer\.v12-footer/);
 for(const route of ['Running','Training','Basketball','Lifestyle','Outdoor','Walking'])assert.ok(js.includes(route));
});
test('V14 design targets phones, tablets and laptops without requiring browser zoom',()=>{
 const css=read('public/v14-release.css');
 for(const width of [1310,1070,980,740,440,340])assert.ok(css.includes(`max-width:${width}px`),`responsive breakpoint ${width}`);
 assert.match(css,/--release-gutter:clamp/);
 assert.match(css,/prefers-reduced-motion/);
});

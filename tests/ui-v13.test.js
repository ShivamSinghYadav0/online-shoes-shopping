'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
test('V13 catalog uses a compact breadcrumb, heading and count instead of a poster header',()=>{
 const js=read('public/app.js'), css=read('public/v13-shop.css');
 assert.match(js,/shop-header-compact shop-header-v13/);
 assert.match(js,/class="shop-breadcrumb"/);
 assert.match(js,/shopCountBadge/);
 assert.match(css,/\.shop-page-v13 \.shop-header-v13::after\{content:none!important/);
 assert.match(css,/html\.is-shop-route \.route-strip\{display:none!important/);
});
test('V13 filters and search remain functional with laptop and mobile breakpoints',()=>{
 const js=read('public/app.js'),css=read('public/v13-shop.css'),html=read('public/index.html');
 assert.match(js,/renderShop\(\)/);
 assert.match(js,/id="searchShoes"/);
 assert.match(js,/id="sortShoes"/);
 assert.match(css,/overflow-x:auto/);
 assert.match(css,/@media\(max-width:1250px\)/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:420px\)/);
 assert.match(html,/href="\/v13-shop\.css"/);
});

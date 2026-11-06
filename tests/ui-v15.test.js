'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('V15 home excludes retired marquee and giant quick-category ticker',()=>{
 const js=read('public/app.js');
 const section=js.slice(js.indexOf('function home(){'),js.indexOf('function initMotionLab(){'));
 assert.doesNotMatch(section,/PICK YOUR MOVEMENT|THE WORLD IS YOUR TRACK|marquee-band|marquee-track/);
 assert.match(section,/v12-category-section/);
 assert.match(section,/v12-editorial/);
});
test('V15 release is identifiable and uses an unambiguous local preview port',()=>{
 const html=read('public/index.html'),server=read('server.js'),css=read('public/v15-final.css');
 assert.match(html,/v15-final\.css/);
 assert.match(html,/PERFORMANCE GOODS · V15/);
 assert.match(html,/Portfolio concept; no real deliveries/);
 assert.match(server,/process\.env\.PORT\|\|3100/);
 assert.match(server,/Cache-Control':'no-store, max-age=0, must-revalidate/);
 assert.match(server,/release:'V15'/);
 for(const term of ['.v12-hero-shell','.v12-category-section','.v12-editorial','.shop-page-v13','.v12-footer'])assert.ok(css.includes(term),`${term} missing`);
});

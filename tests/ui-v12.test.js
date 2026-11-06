const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root,f), 'utf8');

test('V12 grid hero has no absolute-positioned text/buttons and retains functional carousel hooks', () => {
  const js = read('public/app.js');
  const css = read('public/v12-polish.css');
  const html = read('public/index.html');
  assert.match(js, /class="home-hero v12-home-hero"/);
  for (const hook of ['heroShoeImage','heroSlideCount','heroSlideName','heroCollection','heroPrev','heroNext']) {
    assert.ok(js.includes(`id="${hook}"`), `missing ${hook}`);
  }
  assert.match(css, /grid-template-areas:'copy visual' 'controls controls'/);
  assert.match(css, /position:relative!important;inset:auto!important/);
  assert.match(css, /\.v12-hero-title span\{display:block;white-space:nowrap/);
  assert.match(css, /\.home-hero\.v12-home-hero\{[^}]*height:auto!important/s);
  assert.match(html, /href="\/v12-polish\.css"/);
});

test('V12 homepage removes redundant marquee and oversized filler', () => {
  const js = read('public/app.js');
  const section = js.slice(js.indexOf('function home(){'), js.indexOf('function initMotionLab(){'));
  assert.doesNotMatch(section, /marquee-band|class="community"|class="motion-lab"|class="arenas"/);
  assert.equal((section.match(/class="v12-category-card"/g)||[]).length, 4);
  assert.match(section,/v12-editorial-copy/);
  assert.match(section,/v12-service-strip/);
  const html=read('public/index.html');
  const footer=html.slice(html.indexOf('<footer'),html.indexOf('</footer>')+9);
  assert.equal((footer.match(/class="footer-section"/g)||[]).length, 2);
  assert.doesNotMatch(footer,/NEVER STAND STILL|KEEP MOVING/);
});

test('V12 fluid breakpoints support narrow phone through desktop and reduced-motion', () => {
  const css = read('public/v12-polish.css');
  for(const breakpoint of ['1120','760','480','340']) {
    assert.ok(css.includes(`max-width:${breakpoint}px`),`missing ${breakpoint} breakpoint`);
  }
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.v12-footer \.footer-section:last-child\{grid-column:auto!important\}/);
  assert.match(css,/background:var\(--surface-raised,#fff\)/);
});

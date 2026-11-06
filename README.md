# AUVRYKO ✦ — Footwear Studio

**A responsive full-stack footwear storefront concept, designed for normal 100% browser zoom.** Built with HTML, CSS, vanilla JavaScript and Node.js (no runtime npm dependencies).

AUVRYKO is a coined **portfolio name**, not a claim of globally available trademark rights or a real manufacturer. This GitHub project demonstrates ecommerce UX with sample products; it is not connected to actual inventory, payment processing or fulfilment.

## What is inside

| Experience | Features |
|---|---|
| Home | V15 refined, no-overlap animated **shoe-photo showcase**, four real-photography department cards, streamlined new-arrivals panel, short service strip, reduced-motion support |
| Shop | Compact category-specific headings, highlighted active navigation, responsive product grid, live search, sorting, saved shoes and category filters |
| Product gallery | Correctly contained full-screen photo viewer; thumbnails, swipe/left-right arrows for genuine multiple photographs, independent **+ / − / Reset** zoom controls, scroll/drag when zoomed |
| Accounts & orders | Signup/login, address management, local shopping bag, size selection, COD order recording and order history |
| Design | Light/Dark themes, saved preference, mobile menu, simplified two-link-group footer, browser-layout-tested from 320px phones to 1920px desktop |
| Development | `npm test`, `npm run check`, GitHub Actions CI, QA report, deployment notes, photo credits, no external npm runtime dependencies |

### What a camera view means here

- **Left/right** changes the photographic view only when a second **actual photograph of the same shoe reference** exists. No manufactured front/rear/sole views from one photo.
- **+ / − / Reset** changes the magnification, independently of photo navigation. Fullscreen mode fits the **entire photograph at 100%**; zoomed images can be **scrolled, touch-panned, or mouse-dragged**.
- The first shoe now includes a genuine 3-photo example so this functionality is easy to discover. Four other showcase items have multi-photo studies. The remaining demo products have one photograph and correctly hide view arrows.
- These are concept listings using credited external photography, **not** authentic AUVRYKO stock photos. A fully rotatable 360° model requires an actual 3D asset or a licensed full-turn multi-view photo sequence for every SKU.

## V15 release-wide design audit

The site uses a **shared release layout for all six categories**, not a one-off Training fix. V14 removes duplicate category status headings, eliminates the "PHOTO STUDY" watermark, limits page whitespace, standardizes product card proportions, reduces the sticky header and footer, and preserves the existing home hero, product imagery, color themes, and shopping features.

**QA completed:** 16 Chromium viewport sizes (320–1920px) × 11 rendered routes = **176 browser-layout checks**, including Home, all six shoe categories, Shop All, New Arrivals, Saved, and a product page. Tested search, sorting, gallery navigation, independent zoom, cart, theme, and mobile menu interactions at representative phone/laptop widths. The browser used the actual app markup/CSS/JS with a mocked product/account API because direct localhost navigation was blocked by the managed browser; real Node HTTP/API tests ran separately. External photos and font/CDN loading were not verified in the browser QA sandbox. See [docs/QA_REPORT.md](docs/QA_REPORT.md).

## Quick start in VS Code / Windows

1. Extract the ZIP and open the folder containing `package.json`, `server.js` and `public/`.
2. Install **Node.js 20+** if not already installed.
3. In the integrated Terminal run:

   ```powershell
   npm start
   ```

4. Open **http://127.0.0.1:3100/**. There is no need to use VS Code **Go Live**.
5. Stop the server with `Ctrl + C`. To validate source and server tests run:

   ```powershell
   npm test
   npm run check
   ```

`START_WINDOWS.bat` is also included for Windows. **Do not open `public/index.html` directly:** auth and product data come from the Node server.

## GitHub push

Create an empty GitHub repository called `auvryko-footwear-studio` (do not automatically create another README). Then run these from the same folder as `package.json`:

```powershell
git init
git add .
git commit -m "Launch AUVRYKO responsive footwear storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/auvryko-footwear-studio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. For later changes use `git add .`, `git commit -m "..."`, `git push`. See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting considerations.

## Photo rights and deployment limitations

Images are loaded from credited public image hosts and **require an internet connection**. See [PHOTO_SOURCES.md](PHOTO_SOURCES.md) and the site's photo credits page for attribution. Original photographers' image licences do not grant rights to third-party footwear logos or authorization to sell those shoes.

This is a local portfolio demonstration, not a production commerce backend. Accounts and COD order history use local JSON storage; they can be lost on ephemeral hosting. GitHub Pages alone cannot host its Node API. For real customers, replace the local file storage with a durable database, use your own licensed inventory photos, implement security reviews, compliant payments and logistics integrations.

## V13 catalog header improvement

The shop and category pages now use a compact breadcrumb, concise heading, horizontally browseable filters, search and sort controls, and immediate access to products. The oversized watermark and duplicated route-status strip are removed **only for catalog pages**. This layout adapts from narrow phones to wide desktops without requiring browser zoom.

## V15: If you still see “PICK YOUR MOVEMENT” / “THE WORLD IS YOUR TRACK”

Those banners are **not in the V14/V15 homepage source**. That means an old browser tab, extracted older folder or old Node server is still being viewed. V15 deliberately defaults to **port 3100**, so you can verify the new version without accidentally reopening your previous port-3000 app.

1. Stop older Node terminals with `Ctrl + C` (no need to delete your previous files).
2. Extract this ZIP into a NEW folder, e.g. `AUVRYKO-V15`.
3. Open that folder in VS Code; `package.json` must be visible in the opened folder.
4. Run `npm start`, then open **http://127.0.0.1:3100/**, NOT port 3000.
5. Confirm the header says **PERFORMANCE GOODS · V15**. The footer also says **V15**.
6. If port 3100 is occupied, run `$env:PORT=3110; npm start` then open `http://127.0.0.1:3110/`.

The V15 HTTP server sends `Cache-Control: no-store` for its static assets and the `/api/health` response reports `release: V15`. Normal production hosting should configure `PORT` using environment variables.

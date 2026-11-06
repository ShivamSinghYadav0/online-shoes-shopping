# V14 release quality check

Date: **6 November 2026**  
Scope: **AUVRYKO portfolio storefront**. No public deployment or real orders were performed.

## What was checked

1. **Automated Node tests**: product catalog, authentication, address CRUD, COD order recording and prior UI contracts (`npm test`).
2. **JavaScript syntax**: `npm run check`.
3. **HTTP smoke check**: local Node server served the homepage and `/api/health` responded with 36 catalog items.
4. **Chromium-rendered responsive matrix**: at 320, 360, 390, 430, 540, 680, 768, 820, 980, 1024, 1180, 1280, 1366, 1440, 1600 and 1920 pixels; 11 routes per size (Home, 9 shop collections, a product detail). The browser used the actual frontend code and mocked API responses because managed Chromium blocked direct localhost navigation. Measured horizontal overflow, section collisions, displayed category heading, correct product counts, footer/grid separation and product detail arrangement.
5. **Interactions**: representative 390px and 1366px browser tests exercised live search, price sorting, size selection, adding to bag, cart drawer open/close, selected theme, image gallery next/previous and independent zoom. The mobile menu was opened and its accessible expanded state checked.

## Browser limitations

- Browser tests do **not** prove that remote Unsplash/Wikimedia photos are always accessible. Photo references are not bundled; they need internet access and may change or disappear.
- True multi-angle views are present only where multiple photographs of the same reference shoe are available. Other concept products do not pretend to have 3D rotation.
- Direct Chromium navigation to localhost was blocked by this testing environment. The Node server itself ran and was checked with HTTP, while browser rendering was validated using injected responses.
- A local JSON file stores demo users, addresses, and COD orders. The project has **no production inventory, real payment, delivery integrations, DB concurrency control or security audit**. It is an interactive GitHub portfolio project, not a launch-ready ecommerce business.

## How to verify on Windows

From the folder with `package.json`:

```powershell
npm run check
npm test
npm start
```

Then browse **http://localhost:3000** with Chrome zoom at **100%** (`Ctrl+0`). Verify Home and each shop category, desktop resize and device emulator, the product gallery, size selection, cart, light/dark switch, account and demo COD flow. To stop, press `Ctrl+C`.

## GitHub readiness

The ZIP extracts with `package.json` at its root. `data/`, local secrets and log files are excluded by `.gitignore`. `.github/workflows/ci.yml` runs syntax and unit tests for pushes and pull requests.

# Release history

## V14 — Portfolio release / consistent storefront density (6 November 2026)

- Applied one common layout treatment to **all** shop collections: Running, Training, Basketball, Lifestyle, Outdoor and Walking, plus Shop All, New Arrivals and Saved.
- Reduced duplicated page chrome, excessive heading height, card/footer whitespace, and the heavy PHOTO STUDY overlay on product imagery.
- Standardized desktop/tablet/mobile spacing, navigation height, card ratios, typography and price alignment without requiring Chrome zoom adjustments.
- Polished product detail stage proportions, retained real multi-photo gallery, fullscreen controls, separate zoom and pan.
- Retained signup/login, address management, shopping bag, COD order-recording and order-history routes.
- Browser QA: 176 layouts across 16 viewport sizes; interaction checks on phones and laptops. HTTP/API Node tests and syntax checks run separately.
- **Limitations**: concept catalog uses online external photography; local JSON demo orders are not actual delivery or payment processing. See docs/QA_REPORT.md and PHOTO_SOURCES.md.

## Earlier releases

V13 compact category browsing; V12 responsive home rebuild; V11 fullscreen photo containment; V10 gallery view/zoom separation; V9 photographic product cards; V7 theme switch.


## V15 — Old-version confusion + responsive homepage hardening
- Corrected boot banner to identify the actual release; default port **3100** to keep old V11/V14 port-3000 process from masking the new UI.
- Added release marker to header/footer and `release: V15` health response.
- Disabled static asset caching during local preview; this is a deliberate developer-preview choice.
- Added a final responsive CSS layer that constrains home hero text/photo, removes deprecated ticker/quick-category markup if present, and keeps category, product and footer spacing consistent.
- Retained all ecommerce demo functionality.

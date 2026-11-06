# AUVRYKO — GitHub and deployment guide

This guide starts with a local Windows / VS Code checkout and publishes **source code** to GitHub. Hosting the actual shopping app is a separate step because it needs a Node.js backend.

## 1. Run and test on Windows

1. Extract the ZIP file.
2. Open the extracted project folder in VS Code. The folder should contain `package.json` directly (not a parent folder).
3. Open Terminal > New Terminal (PowerShell) and run:

   ```powershell
   node -v
   npm start
   ```

4. Open `http://127.0.0.1:3100`. Stop the server with `Ctrl + C`.
5. Run `npm test` to confirm the package still passes automated checks.

## 2. Push to a new GitHub repository

Create an **empty** repository on https://github.com/new named `auvryko-footwear-studio` (don't initialize it with a README or .gitignore because this ZIP already includes both). In the VS Code PowerShell terminal, from the folder with `package.json`, run:

```powershell
git init
git add .
git commit -m "Initial release: AUVRYKO footwear store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/auvryko-footwear-studio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username. GitHub sign-in may open your browser and ask you to authorize Git Credential Manager.

If Git asks for your name/email first, configure them once:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

For later updates:

```powershell
git add .
git commit -m "Refine storefront design"
git push
```

`git push` uploads your local commits to GitHub. `git pull` gets updates from the remote repository; it is **not** the initial upload command.

## 3. Can I host with GitHub Pages?

**Not as a working full-stack application.** GitHub Pages serves static sites, while this project needs a running Node.js API for signup, order processing and saved addresses. The repository can still be public and visually presented on GitHub with its screenshots.

For a hosted full-stack preview, use a Node-compatible host, such as Render's web-service product, and connect your GitHub repository:

- Build command: no build needed (or `npm run check`).
- Start command: `npm start`.
- Set environment variable `HOST=0.0.0.0`.
- `PORT` is provided by the host in most Node hosting setups.
- On HTTPS, set `COOKIE_SECURE=true`.

**Critical data limitation:** Many free hosts reset local files on restart or redeploy, so the JSON database can lose accounts and orders. You must configure persistent storage or migrate to a managed database **before** accepting any real user data. Never use this concept store for actual sales without payment, security and legal reviews.

## 4. Don't push secrets or customer details

`.gitignore` excludes `data/`, local `.env` files and `node_modules/`. Verify before pushing:

```powershell
git status
git ls-files
```

Do not commit real customer data, tokens or API keys. The repository includes no credentials and uses fictional concept products.

## V12 UI acceptance checklist

- Use Chrome's `Ctrl + 0` at 100% zoom. Check the home hero at 320px, 390px, 768px, 1024px and laptop 1366px wide.
- On the home page, headline, buttons, footwear card and slider must remain in separate tracks, with no clipping.
- Confirm the two-column category links become stacked/2-column responsive cards on mobile.
- Confirm mobile navigation, search, product detail zoom, cart, sign-in and COD test order.
- Verify Dark Mode and ensure all product images load over an Internet connection.
- This is a portfolio prototype; do not present demo products as real stock or deploy unreviewed local JSON storage for customers.

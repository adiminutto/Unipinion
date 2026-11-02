# Unipinion — High-Fidelity Prototype

A clickable, high-fidelity web prototype of **Unipinion**, a campus rating platform
for university students. Built for usability testing — no backend, no build step,
no dependencies. All state (sign-in, ratings, profile, submitted items) is stored
in the browser's `localStorage`, so each participant gets their own clean slate.

## Flows included

- **Dashboard** — centered search bar, category/sub-category filters, recommended
  column (personalised by profile interests), new/trending column, search results
  occupying half the page
- **Item pages** — details, averaged star ratings, reviews with recency/star filters
- **Rate this** — star picker + optional review, confirm, edit, delete
- **Profile** — nickname, DOB, subject/year of study, interests, favourites
- **My Ratings / Reviews** — search your ratings, edit or delete them
- **Submit New Item** — category-specific forms (Food / Events / Clubs / Classes)
  with a simulated approval system
- **Guest vs. verified** — guests see only overall ratings, obfuscated reviewer
  names, and cannot view Classes; "verification" is simulated (any name + ID works)
- **Light / dark theme toggle** (persisted)

## Run locally

Just open `index.html` in a browser — no server required.

## Deploy to GitHub Pages (free, 24/7)

1. Create a **public** repository on GitHub (e.g. `unipinion`).
2. Push this folder to it:
   ```
   git remote add origin https://github.com/<your-username>/unipinion.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: *Deploy from a branch*
   - Branch: `main`, folder `/ (root)` → **Save**
4. After ~1 minute your prototype is live at:
   `https://<your-username>.github.io/unipinion/`

Every future `git push` to `main` redeploys automatically.

## Resetting between usability-test participants

Open the browser dev tools console and run:

```js
Object.keys(localStorage)
  .filter(k => k.startsWith("unipinion_"))
  .forEach(k => localStorage.removeItem(k));
location.reload();
```

Or simply have each participant use a fresh private/incognito window.

# Unipinion — High-Fidelity Prototype

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

## Resetting between usability-test participants

Open the browser dev tools console and run:

```js
Object.keys(localStorage)
  .filter(k => k.startsWith("unipinion_"))
  .forEach(k => localStorage.removeItem(k));
location.reload();
```

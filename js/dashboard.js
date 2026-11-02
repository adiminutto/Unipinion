// ---- Dashboard ----------------------------------------------------------

let activeCategory = "All";
let activeSub = null;

function initDashboard() {
  renderHeader("dashboard");
  renderCategoryFilters();
  renderSubFilters();
  renderResults();
  renderRecommended();
  renderTrending();

  document.getElementById("search-input").addEventListener("input", renderResults);
}

function renderCategoryFilters() {
  const singular = { Food: "Food", Events: "Event", Clubs: "Club", Classes: "Class" };
  const cats = ["All", ...Object.keys(CATEGORIES)];
  document.getElementById("category-filters").innerHTML = cats.map(c =>
    `<button class="filter-btn ${activeCategory === c ? "active" : ""}" onclick="setCategory('${c}')">${c === "All" ? "All" : singular[c]}</button>`
  ).join("");
}

function setCategory(cat) {
  activeCategory = cat;
  activeSub = null;
  renderCategoryFilters();
  renderSubFilters();
  renderResults();
}

function renderSubFilters() {
  const el = document.getElementById("subcategory-filters");
  if (activeCategory === "All" || !CATEGORIES[activeCategory]) { el.innerHTML = ""; return; }
  el.innerHTML = CATEGORIES[activeCategory].map(sub =>
    `<button class="chip ${activeSub === sub ? "active" : ""}" onclick="setSub('${sub}')">${sub}</button>`
  ).join("");
}

function setSub(sub) {
  activeSub = activeSub === sub ? null : sub;
  renderSubFilters();
  renderResults();
}

function matchesSearch(item, q) {
  if (!q) return true;
  const hay = (item.name + " " + item.category + " " + item.subcategory + " " + item.description + " " + (item.location || "")).toLowerCase();
  return q.toLowerCase().split(/\s+/).every(word => hay.includes(word));
}

function renderResults() {
  const q = document.getElementById("search-input").value.trim();
  let items = visibleItems().filter(it => matchesSearch(it, q));
  if (activeCategory !== "All") items = items.filter(it => it.category === activeCategory);
  if (activeSub) items = items.filter(it => it.subcategory === activeSub);

  // sort by average rating, best first
  items.sort((a, b) => avgRating(b).avg - avgRating(a).avg);

  const el = document.getElementById("results-list");
  let note = "";
  if (!isVerified() && activeCategory === "Classes") {
    note = `<div class="empty-note">🔒 Classes are only visible to verified students. <button class="link-btn" onclick="openSignIn()">Sign in</button> to browse them.</div>`;
  }
  el.innerHTML = note + (items.length
    ? items.map(itemCardHTML).join("")
    : (note ? "" : `<div class="empty-note">No results${q ? ` for “${esc(q)}”` : ""}. Try another search or category.</div>`));
}

function renderRecommended() {
  const interests = myProfile().interests || [];
  let items = visibleItems();

  // Recommend by profile interests when set, otherwise top-rated overall
  let picks = interests.length
    ? items.filter(it => interests.includes(it.subcategory) || interests.includes(it.category))
    : items.slice();
  picks.sort((a, b) => avgRating(b).avg - avgRating(a).avg);
  picks = picks.slice(0, 4);

  const el = document.getElementById("recommended-list");
  el.innerHTML = (interests.length
    ? `<div class="empty-note" style="padding:0 0 8px">Based on your interests</div>`
    : `<div class="empty-note" style="padding:0 0 8px">Top rated — <a href="profile.html?tab=profile">set interests</a> to personalise</div>`)
    + picks.map(itemCardHTML).join("");
}

function renderTrending() {
  const items = visibleItems().filter(it => it.trending || it.isNew).slice(0, 5);
  document.getElementById("trending-list").innerHTML = items.map(itemCardHTML).join("");
}

initDashboard();

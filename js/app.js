// ---- Unipinion shared app logic ----------------------------------------
// State lives in localStorage so the prototype behaves consistently
// across pages and visits — no backend needed.

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("unipinion_" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem("unipinion_" + key, JSON.stringify(value));
  }
};

// ---- Theme --------------------------------------------------------------
function applyTheme() {
  const theme = store.get("theme", "dark");
  document.documentElement.dataset.theme = theme;
}
function toggleTheme() {
  const next = store.get("theme", "dark") === "dark" ? "light" : "dark";
  store.set("theme", next);
  applyTheme();
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = next === "dark" ? "☀️" : "🌙";
}
applyTheme();

// ---- Auth (simulated) ---------------------------------------------------
function currentUser() { return store.get("user", null); }
function isVerified() { const u = currentUser(); return !!(u && u.verified); }

function signIn(name, studentId) {
  store.set("user", { name: name || "Student", studentId: studentId || "000000000", verified: true });
}
function signOut() {
  store.set("user", null);
  location.href = relRoot() + "index.html";
}

// Obfuscate names for guests: "Jerome P" -> "J***** P"
function displayName(name) {
  if (isVerified()) return name;
  return name.split(" ").map((part, i) =>
    i === 0 ? part[0] + "*".repeat(Math.max(part.length - 1, 3)) : part
  ).join(" ");
}

// ---- Items: seed data + user-submitted + user ratings -------------------
function allItems() {
  const submitted = store.get("submittedItems", []);
  return SEED_ITEMS.concat(submitted);
}

function visibleItems() {
  // Guests cannot see restricted items (e.g. Classes)
  return allItems().filter(it => isVerified() || !it.restricted);
}

function getItem(id) {
  return allItems().find(it => it.id === id) || null;
}

// User's own ratings, keyed by item id: { rating, text, date }
function myRatings() { return store.get("myRatings", {}); }
function setMyRating(itemId, rating, text) {
  const ratings = myRatings();
  ratings[itemId] = { rating, text: text || "", date: new Date().toISOString().slice(0, 10) };
  store.set("myRatings", ratings);
}
function deleteMyRating(itemId) {
  const ratings = myRatings();
  delete ratings[itemId];
  store.set("myRatings", ratings);
}

// All reviews for an item, including the current user's
function reviewsFor(item) {
  const mine = myRatings()[item.id];
  const base = item.reviews ? item.reviews.slice() : [];
  if (mine && currentUser()) {
    base.unshift({ user: currentUser().name + " (you)", rating: mine.rating, text: mine.text, date: mine.date, mine: true });
  }
  return base;
}

function avgRating(item) {
  const reviews = reviewsFor(item);
  if (!reviews.length) return { avg: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { avg: sum / reviews.length, count: reviews.length };
}

// ---- Profile ------------------------------------------------------------
function myProfile() {
  return store.get("profile", { nickname: "", dob: "", subject: "", year: "", interests: [], favourites: [] });
}
function saveProfile(profile) { store.set("profile", profile); }

// ---- Rendering helpers --------------------------------------------------
function starsHTML(avg, count) {
  const full = Math.round(avg);
  let html = '<span class="stars" aria-label="' + avg.toFixed(1) + ' out of 5 stars">';
  for (let i = 1; i <= 5; i++) html += '<span class="star' + (i <= full ? " filled" : "") + '">★</span>';
  html += "</span>";
  if (count !== undefined) html += '<span class="rating-count">(' + count + ")</span>";
  return html;
}

function itemCardHTML(item) {
  const { avg, count } = avgRating(item);
  const badges =
    (item.pending ? '<span class="badge pending">Pending approval</span>' : "") +
    (item.isNew ? '<span class="badge new">New</span>' : "") +
    (item.trending ? '<span class="badge trending">Trending</span>' : "");
  return `
    <a class="item-card" href="${relRoot()}item.html?id=${encodeURIComponent(item.id)}">
      <div class="item-card-head"><span class="item-name">${esc(item.name)}</span>${badges}</div>
      <div class="item-card-rating">${starsHTML(avg, count)}</div>
      <div class="item-card-sub">${esc(item.subcategory)} · ${esc(item.category)}</div>
    </a>`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Pages live at repo root; helper kept in case of nesting later.
function relRoot() { return ""; }

// ---- Header / user menu -------------------------------------------------
function renderHeader(active) {
  const user = currentUser();
  const theme = store.get("theme", "dark");
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="${relRoot()}index.html">Uni<span>pinion</span></a>
      <nav class="header-nav">
        <a href="${relRoot()}index.html" class="${active === "dashboard" ? "active" : ""}">Dashboard</a>
      </nav>
      <div class="header-right">
        <button id="theme-toggle" class="icon-btn" title="Toggle theme" onclick="toggleTheme()">${theme === "dark" ? "☀️" : "🌙"}</button>
        ${user ? `
          <div class="user-menu">
            <button class="avatar-btn" onclick="toggleUserMenu()" title="${esc(user.name)}">
              <span class="avatar">${esc(user.name[0].toUpperCase())}</span>
              <span class="verified-dot" title="Verified student">✔</span>
            </button>
            <div class="user-dropdown" id="user-dropdown">
              <div class="dropdown-user">${esc(user.name)}<br><small>Verified student</small></div>
              <a href="${relRoot()}profile.html?tab=profile">View Profile</a>
              <a href="${relRoot()}profile.html?tab=ratings">View Ratings / Reviews</a>
              <a href="${relRoot()}profile.html?tab=submit">Submit New Item</a>
              <button onclick="signOut()">Sign out</button>
            </div>
          </div>` : `
          <button class="btn btn-primary" onclick="openSignIn()">Sign in</button>`}
      </div>
    </div>
    ${user ? "" : `<div class="guest-banner">You're browsing as a guest — reviews are hidden, names are obfuscated and some items (like Classes) are not visible. <button class="link-btn" onclick="openSignIn()">Sign in with a verified student account</button> to see everything.</div>`}`;
}

function toggleUserMenu() {
  document.getElementById("user-dropdown").classList.toggle("open");
}
document.addEventListener("click", e => {
  const dd = document.getElementById("user-dropdown");
  if (dd && !e.target.closest(".user-menu")) dd.classList.remove("open");
});

// ---- Sign-in modal (simulated verification) -----------------------------
function openSignIn() {
  closeModal();
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "modal";
  modal.innerHTML = `
    <div class="modal">
      <h2>Sign in</h2>
      <p class="muted">Prototype note: verification is simulated — any name and student ID will work.</p>
      <label>Full name
        <input type="text" id="signin-name" placeholder="e.g. Andrew Diminutto" />
      </label>
      <label>Student ID
        <input type="text" id="signin-id" placeholder="e.g. 400123456" />
      </label>
      <div class="modal-actions">
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitSignIn()">Verify &amp; Sign in</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.getElementById("signin-name").focus();
}

function submitSignIn() {
  const name = document.getElementById("signin-name").value.trim();
  const id = document.getElementById("signin-id").value.trim();
  if (!name || !id) { alert("Please enter a name and student ID."); return; }
  signIn(name, id);
  closeModal();
  location.reload();
}

function closeModal() {
  const m = document.getElementById("modal");
  if (m) m.remove();
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

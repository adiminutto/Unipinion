// ---- Profile page ----------------------------------------------------------
// Tabs: profile (setup/edit) | ratings (view & edit my ratings) | submit (new item)

let activeTab = new URLSearchParams(location.search).get("tab") || "profile";

function initProfilePage() {
  renderHeader();
  const el = document.getElementById("profile-page");

  if (!isVerified()) {
    el.innerHTML = `
      <div class="locked-box">
        <h2>🔒 Sign in required</h2>
        <p>Profiles, ratings and item submission require a verified student account.</p>
        <button class="btn btn-primary" onclick="openSignIn()">Sign in</button>
        <p><a href="index.html">← Back to dashboard</a></p>
      </div>`;
    return;
  }
  renderProfilePage();
}

function renderProfilePage() {
  const el = document.getElementById("profile-page");
  el.innerHTML = `
    <h1>${esc(currentUser().name)}</h1>
    <div class="tabs">
      <button class="tab ${activeTab === "profile" ? "active" : ""}" onclick="setTab('profile')">Profile</button>
      <button class="tab ${activeTab === "ratings" ? "active" : ""}" onclick="setTab('ratings')">My Ratings / Reviews</button>
      <button class="tab ${activeTab === "submit" ? "active" : ""}" onclick="setTab('submit')">Submit New Item</button>
    </div>
    <div id="tab-content"></div>`;

  if (activeTab === "profile") renderProfileTab();
  else if (activeTab === "ratings") renderRatingsTab();
  else renderSubmitTab();
}

function setTab(tab) {
  activeTab = tab;
  history.replaceState(null, "", "profile.html?tab=" + tab);
  renderProfilePage();
}

// ---- Tab 1: profile setup ---------------------------------------------------
function renderProfileTab() {
  const p = myProfile();
  const allSubs = Object.entries(CATEGORIES).flatMap(([cat, subs]) => subs.map(s => ({ cat, sub: s })));

  document.getElementById("tab-content").innerHTML = `
    <section class="panel">
      <h2>Personal information <span class="muted" style="text-transform:none;font-weight:400">(all optional)</span></h2>
      <div class="form-grid">
        <label>Nickname
          <input type="text" id="p-nickname" value="${esc(p.nickname)}" placeholder="What should people call you?" />
        </label>
        <label>Date of birth
          <input type="date" id="p-dob" value="${esc(p.dob)}" />
        </label>
        <label>Subject of study
          <select id="p-subject">
            <option value="">— Select —</option>
            ${SUBJECTS.map(s => `<option ${p.subject === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
        <label>Year of study
          <select id="p-year">
            <option value="">— Select —</option>
            ${["1st year", "2nd year", "3rd year", "4th year", "5th year+", "Graduate"].map(y => `<option ${p.year === y ? "selected" : ""}>${y}</option>`).join("")}
          </select>
        </label>
      </div>

      <h2 style="margin-top:24px">Interests</h2>
      <p class="muted">Used to personalise your Recommended column on the dashboard.</p>
      <div class="interest-grid">
        ${allSubs.map(({ cat, sub }) => {
          const key = sub;
          return `<button class="chip ${p.interests.includes(key) ? "active" : ""}" onclick="toggleInterest('${key}')">${sub} <small>(${cat})</small></button>`;
        }).join("")}
      </div>

      <h2 style="margin-top:24px">Favourites</h2>
      <p class="muted">Search for items to favourite — favourite food spots, clubs you attend, events you're going to.</p>
      <input type="search" id="fav-search" placeholder="Search items to add…" oninput="renderFavSearch()" autocomplete="off" />
      <div id="fav-search-results"></div>
      <div id="fav-list">${renderFavList(p)}</div>

      <div style="margin-top:24px">
        <button class="btn btn-primary" onclick="saveProfileForm()">Save profile</button>
      </div>
    </section>`;
}

// Keep typed-but-unsaved form values when the tab re-renders
function captureFormIntoProfile() {
  const p = myProfile();
  const nick = document.getElementById("p-nickname");
  if (nick) {
    p.nickname = nick.value.trim();
    p.dob = document.getElementById("p-dob").value;
    p.subject = document.getElementById("p-subject").value;
    p.year = document.getElementById("p-year").value;
    saveProfile(p);
  }
  return myProfile();
}

function toggleInterest(sub) {
  const p = captureFormIntoProfile();
  const i = p.interests.indexOf(sub);
  if (i >= 0) p.interests.splice(i, 1); else p.interests.push(sub);
  saveProfile(p);
  renderProfileTab();
}

function renderFavSearch() {
  const q = document.getElementById("fav-search").value.trim().toLowerCase();
  const el = document.getElementById("fav-search-results");
  if (!q) { el.innerHTML = ""; return; }
  const p = myProfile();
  const matches = visibleItems()
    .filter(it => !p.favourites.includes(it.id) && it.name.toLowerCase().includes(q))
    .slice(0, 5);
  el.innerHTML = matches.map(it => `
    <div class="fav-row">
      <span class="grow"><strong>${esc(it.name)}</strong> <small>${esc(it.subcategory)} · ${esc(it.category)}</small></span>
      <button class="btn btn-sm btn-primary" onclick="addFavourite('${it.id}')">+ Add</button>
    </div>`).join("") || `<div class="empty-note">No matches.</div>`;
}

function addFavourite(id) {
  const p = captureFormIntoProfile();
  if (!p.favourites.includes(id)) p.favourites.push(id);
  saveProfile(p);
  renderProfileTab();
}

function removeFavourite(id) {
  const p = captureFormIntoProfile();
  p.favourites = p.favourites.filter(f => f !== id);
  saveProfile(p);
  renderProfileTab();
}

function renderFavList(p) {
  if (!p.favourites.length) return `<div class="empty-note">No favourites yet.</div>`;
  return p.favourites.map(id => {
    const it = getItem(id);
    if (!it) return "";
    return `
      <div class="fav-row">
        <span class="grow"><a href="item.html?id=${encodeURIComponent(it.id)}"><strong>${esc(it.name)}</strong></a> <small>${esc(it.subcategory)} · ${esc(it.category)}</small></span>
        <button class="btn btn-sm btn-danger" onclick="removeFavourite('${it.id}')">Remove</button>
      </div>`;
  }).join("");
}

function saveProfileForm() {
  const p = myProfile();
  p.nickname = document.getElementById("p-nickname").value.trim();
  p.dob = document.getElementById("p-dob").value;
  p.subject = document.getElementById("p-subject").value;
  p.year = document.getElementById("p-year").value;
  saveProfile(p);
  showToast("Profile saved ✔");
}

// ---- Tab 2: my ratings / reviews ---------------------------------------------
function renderRatingsTab() {
  const ratings = myRatings();
  const ids = Object.keys(ratings);
  const q = (document.getElementById("ratings-search")?.value || "").trim().toLowerCase();

  const rows = ids
    .map(id => ({ id, item: getItem(id), r: ratings[id] }))
    .filter(x => x.item && (!q || x.item.name.toLowerCase().includes(q)));

  document.getElementById("tab-content").innerHTML = `
    <section class="panel">
      <h2>My ratings &amp; reviews</h2>
      <input type="search" id="ratings-search" placeholder="Find an item you've rated…" value="${esc(q)}" oninput="renderRatingsTab()" autocomplete="off" />
      <div style="margin-top:14px">
        ${rows.length ? rows.map(({ id, item, r }) => `
          <div class="review mine">
            <div class="review-head">
              <a class="review-user" href="item.html?id=${encodeURIComponent(id)}">${esc(item.name)}</a>
              ${starsHTML(r.rating, undefined)}
              <span class="review-date">${esc(r.date)}</span>
            </div>
            ${r.text ? `<p class="review-text">${esc(r.text)}</p>` : ""}
            <div style="margin-top:8px; display:flex; gap:8px">
              <button class="btn btn-sm" onclick="openEditRating('${id}')">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteRatingRow('${id}')">Delete</button>
            </div>
          </div>`).join("")
        : `<div class="empty-note">${ids.length ? "No matches for that search." : "You haven't rated anything yet. Find an item on the <a href='index.html'>dashboard</a> and click “Rate this”."}</div>`}
      </div>
    </section>`;
  // restore focus after re-render while typing
  if (q) {
    const input = document.getElementById("ratings-search");
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

let editStars = 0;
let editItemId = null;

function openEditRating(id) {
  const item = getItem(id);
  const r = myRatings()[id];
  editItemId = id;
  editStars = r.rating;

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "modal";
  modal.innerHTML = `
    <div class="modal">
      <h2>Edit rating — ${esc(item.name)}</h2>
      <div class="star-input" id="edit-star-input">${editStarPickerHTML()}</div>
      <label>Review <span class="muted" style="font-weight:400">(optional)</span>
        <textarea id="edit-review-text">${esc(r.text)}</textarea>
      </label>
      <div class="modal-actions">
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmEditRating()">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}

function editStarPickerHTML() {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= editStars ? "filled" : ""}" onclick="pickEditStar(${i})" role="button" aria-label="${i} stars">★</span>`;
  }
  return html;
}

function pickEditStar(n) {
  editStars = n;
  document.getElementById("edit-star-input").innerHTML = editStarPickerHTML();
}

function confirmEditRating() {
  const text = document.getElementById("edit-review-text").value.trim();
  setMyRating(editItemId, editStars, text);
  closeModal();
  renderRatingsTab();
  showToast("Rating updated ✔");
}

function deleteRatingRow(id) {
  if (!confirm("Delete this rating?")) return;
  deleteMyRating(id);
  renderRatingsTab();
  showToast("Rating deleted");
}

// ---- Tab 3: submit new item ----------------------------------------------------
function renderSubmitTab() {
  document.getElementById("tab-content").innerHTML = `
    <section class="panel">
      <h2>Submit a new item</h2>
      <p class="muted">Know a spot, event, club or class that's missing? Add it here. New items go through the approval system — flagged items may require manual approval.</p>
      <div class="form-grid">
        <label>Category *
          <select id="s-category" onchange="renderSubmitSubcat()">
            <option value="">— Select —</option>
            ${Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join("")}
          </select>
        </label>
        <label>Sub-category *
          <select id="s-subcategory"><option value="">— Select a category first —</option></select>
        </label>
        <label class="full">Item name *
          <input type="text" id="s-name" placeholder="e.g. Taco Tuesdays" />
        </label>
        <label class="full">Location *
          <input type="text" id="s-location" placeholder="e.g. Student Centre, 2nd Floor" />
        </label>
        <label class="full">Description *
          <textarea id="s-description" placeholder="What is it? Why should students check it out?"></textarea>
        </label>
      </div>
      <div id="s-extra-fields"></div>
      <div style="margin-top:20px">
        <button class="btn btn-primary" onclick="confirmNewItem()">Confirm new item</button>
      </div>
    </section>`;
}

const EXTRA_FIELDS = {
  Food: [
    { id: "menu", label: "Menu items", type: "text", placeholder: "e.g. Tacos, burritos, nachos" },
    { id: "price", label: "Price range", type: "text", placeholder: "e.g. $5 – $12" },
    { id: "applications", label: "Payment accepted", type: "text", placeholder: "e.g. Meal card, debit, credit" }
  ],
  Events: [
    { id: "datetime", label: "Date / time of event", type: "text", placeholder: "e.g. March 10, 2026 · 18:00" },
    { id: "restrictions", label: "Restrictions", type: "select", options: ["No restrictions", "Dress code", "Subject of study"] },
    { id: "sponsors", label: "Sponsors", type: "text", placeholder: "e.g. Student Union" },
    { id: "guests", label: "Special guests / speakers", type: "text", placeholder: "e.g. Alumni panel" }
  ],
  Clubs: [
    { id: "meetings", label: "Date / time of club meetings", type: "text", placeholder: "e.g. Thursdays · 17:00" },
    { id: "cost", label: "Membership cost", type: "text", placeholder: "e.g. $15 / term" },
    { id: "application", label: "Membership application", type: "text", placeholder: "e.g. Open membership / interest form" }
  ],
  Classes: [
    { id: "lecturer", label: "Lecturer", type: "text", placeholder: "e.g. Dr. J. Smith" },
    { id: "subject", label: "Subject of study", type: "select", options: SUBJECTS }
  ]
};

function renderSubmitSubcat() {
  const cat = document.getElementById("s-category").value;
  const subSel = document.getElementById("s-subcategory");
  subSel.innerHTML = cat
    ? `<option value="">— Select —</option>` + CATEGORIES[cat].map(s => `<option>${s}</option>`).join("")
    : `<option value="">— Select a category first —</option>`;

  const extra = document.getElementById("s-extra-fields");
  if (!cat) { extra.innerHTML = ""; return; }
  extra.innerHTML = `
    <h2 style="margin-top:20px">${cat} details</h2>
    <div class="form-grid">
      ${EXTRA_FIELDS[cat].map(f => `
        <label class="${f.type === "text" && f.id === "menu" ? "full" : ""}">${f.label}
          ${f.type === "select"
            ? `<select id="sx-${f.id}">${f.options.map(o => `<option>${o}</option>`).join("")}</select>`
            : `<input type="text" id="sx-${f.id}" placeholder="${f.placeholder || ""}" />`}
        </label>`).join("")}
    </div>`;
}

function confirmNewItem() {
  const cat = document.getElementById("s-category").value;
  const sub = document.getElementById("s-subcategory").value;
  const name = document.getElementById("s-name").value.trim();
  const loc = document.getElementById("s-location").value.trim();
  const desc = document.getElementById("s-description").value.trim();

  if (!cat || !sub || !name || !loc || !desc) {
    alert("Please fill in all required fields (marked *).");
    return;
  }

  const details = {};
  (EXTRA_FIELDS[cat] || []).forEach(f => {
    const v = document.getElementById("sx-" + f.id)?.value.trim();
    if (v) details[f.label] = v;
  });

  const submitted = store.get("submittedItems", []);
  const id = "user-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  submitted.push({
    id, name, category: cat, subcategory: sub, location: loc, description: desc,
    details, reviews: [], isNew: true, trending: false, pending: true,
    restricted: cat === "Classes"
  });
  store.set("submittedItems", submitted);

  document.getElementById("tab-content").innerHTML = `
    <section class="panel" style="text-align:center; padding:40px">
      <h2 style="color:var(--success)">✔ Item submitted</h2>
      <p><strong>${esc(name)}</strong> has been sent to the approval system.</p>
      <p class="muted">Items are reviewed automatically — flagged items may require manual approval. Your item appears on the dashboard with a “Pending approval” badge in the meantime.</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:16px">
        <a class="btn" href="item.html?id=${encodeURIComponent(id)}">View item page</a>
        <button class="btn btn-primary" onclick="renderSubmitTab()">Submit another</button>
      </div>
    </section>`;
}

// ---- Shared toast -----------------------------------------------------------
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

initProfilePage();

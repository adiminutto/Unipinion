// ---- Item page -----------------------------------------------------------

let ratingFilter = null; // null = all, or 1-5

function getItemFromURL() {
  const id = new URLSearchParams(location.search).get("id");
  return id ? getItem(id) : null;
}

function initItemPage() {
  renderHeader();
  renderItemPage();
}

function renderItemPage() {
  const el = document.getElementById("item-page");
  const item = getItemFromURL();

  if (!item) {
    el.innerHTML = `<div class="locked-box"><h2>Item not found</h2><a href="index.html">← Back to dashboard</a></div>`;
    return;
  }
  if (item.restricted && !isVerified()) {
    el.innerHTML = `
      <div class="locked-box">
        <h2>🔒 Verified students only</h2>
        <p>Class pages are restricted to verified student accounts.</p>
        <button class="btn btn-primary" onclick="openSignIn()">Sign in</button>
        <p><a href="index.html">← Back to dashboard</a></p>
      </div>`;
    return;
  }

  const { avg, count } = avgRating(item);
  const mine = myRatings()[item.id];
  document.title = "Unipinion — " + item.name;

  el.innerHTML = `
    <p><a href="index.html">← Back to dashboard</a></p>
    <div class="item-header">
      <h1>${esc(item.name)}</h1>
      ${starsHTML(avg, count)}
      ${item.pending ? '<span class="badge pending">Pending approval</span>' : ""}
      ${item.isNew ? '<span class="badge new">New</span>' : ""}
      ${item.trending ? '<span class="badge trending">Trending</span>' : ""}
    </div>
    <div class="item-meta">${esc(item.subcategory)} · ${esc(item.category)} &nbsp;|&nbsp; 📍 ${esc(item.location || "On campus")}</div>

    <div class="item-grid">
      <section class="panel">
        <h2>Details</h2>
        <p>${esc(item.description)}</p>
        <table class="detail-table">
          ${Object.entries(item.details || {}).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}
        </table>
      </section>

      <section class="panel">
        <h2>Ratings &amp; Reviews</h2>
        ${isVerified()
          ? `<button class="btn btn-primary" onclick="openRateModal()">${mine ? "✏️ Edit your rating" : "⭐ Rate this"}</button>`
          : `<div class="locked-box" style="margin-bottom:12px">Reviews are hidden for guests — only the overall rating is shown.<br><br><button class="btn btn-primary" onclick="openSignIn()">Sign in to read &amp; write reviews</button></div>`}
        ${isVerified() ? renderReviews(item) : ""}
      </section>
    </div>`;
}

function renderReviews(item) {
  const reviews = reviewsFor(item);
  const shown = ratingFilter ? reviews.filter(r => r.rating === ratingFilter) : reviews;

  const filterBtns = `
    <div class="rating-filter" style="margin-top:14px">
      <button class="chip ${ratingFilter === null ? "active" : ""}" onclick="setRatingFilter(null)">Recent</button>
      ${[5, 4, 3, 2, 1].map(n =>
        `<button class="chip ${ratingFilter === n ? "active" : ""}" onclick="setRatingFilter(${n})">${n} ★</button>`).join("")}
    </div>`;

  const list = shown.length
    ? shown.map(r => `
        <div class="review ${r.mine ? "mine" : ""}">
          <div class="review-head">
            <span class="review-user">${esc(displayName(r.user))}</span>
            ${starsHTML(r.rating, undefined)}
            <span class="review-date">${esc(r.date)}</span>
          </div>
          ${r.text ? `<p class="review-text">${esc(r.text)}</p>` : ""}
        </div>`).join("")
    : `<div class="empty-note">No ${ratingFilter ? ratingFilter + "-star " : ""}reviews yet.</div>`;

  return filterBtns + list;
}

function setRatingFilter(n) {
  ratingFilter = n;
  renderItemPage();
}

// ---- Rate / review modal --------------------------------------------------
let pendingStars = 0;

function openRateModal() {
  const item = getItemFromURL();
  const mine = myRatings()[item.id];
  pendingStars = mine ? mine.rating : 0;

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "modal";
  modal.innerHTML = `
    <div class="modal">
      <h2>${mine ? "Edit your rating" : "Rate this"} — ${esc(item.name)}</h2>
      <div class="star-input" id="star-input">${starPickerHTML()}</div>
      <label>Review <span class="muted" style="font-weight:400">(optional)</span>
        <textarea id="review-text" placeholder="Share your experience…">${mine ? esc(mine.text) : ""}</textarea>
      </label>
      <div class="modal-actions">
        ${mine ? '<button class="btn btn-danger" onclick="removeRating()">Delete</button>' : ""}
        <button class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmRating()">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}

function starPickerHTML() {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= pendingStars ? "filled" : ""}" onclick="pickStar(${i})" role="button" aria-label="${i} stars">★</span>`;
  }
  return html;
}

function pickStar(n) {
  pendingStars = n;
  document.getElementById("star-input").innerHTML = starPickerHTML();
}

function confirmRating() {
  if (!pendingStars) { alert("Please select a star rating."); return; }
  const item = getItemFromURL();
  const text = document.getElementById("review-text").value.trim();
  setMyRating(item.id, pendingStars, text);
  closeModal();
  renderItemPage();
  showToast("Rating saved ✔");
}

function removeRating() {
  const item = getItemFromURL();
  deleteMyRating(item.id);
  closeModal();
  renderItemPage();
  showToast("Rating removed");
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

initItemPage();

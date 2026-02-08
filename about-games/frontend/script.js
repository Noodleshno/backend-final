const API = "http://localhost:3000/api";

let token = localStorage.getItem("token");

// Ensure user is authenticated
if (!token) {
  window.location.href = "login.html";
}

// 🔐 Register
async function register() {
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  alert(JSON.stringify(data));
}

// 🔐 Login
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);

  alert("Logged in");
}

// 👤 Profile
async function getProfile() {
  const res = await fetch(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  document.getElementById("profile").textContent =
    JSON.stringify(data, null, 2);
}

// Render a single game card
function renderGameCard(game) {
  const div = document.createElement("div");
  div.className = "card game-card";
  div.innerHTML = `
    ${game.image ? `<img src="${game.image}" alt="${game.name}" class="game-cover">` : ""}
    <h3>${game.name}</h3>
    <p>${game.description || "No description"}</p>
    ${game.releaseDate ? `<small>Release: ${game.releaseDate}</small>` : ""}
  `;
  return div;
}

// Render a news article card (NewsAPI format)
function renderNewsCard(article) {
  const div = document.createElement("div");
  div.className = "card news-card";
  const title = article.title || "";
  const snippet = article.description || article.content || "";
  const img = article.urlToImage || "";
  const source = typeof article.source === "string" ? article.source : article.source?.name || "Unknown";
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "";
  const link = article.url || "#";
  div.innerHTML = `
    ${img ? `<img src="${img}" alt="${title}" class="game-cover" onerror="this.style.display='none'">` : ""}
    <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
    <p>${snippet}</p>
    <div class="meta"><small>${source}${date ? " · " + date : ""}</small></div>
  `;
  return div;
}

// normalize various API response shapes to an array
function normalizeList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.games)) return data.games;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

// normalize various API response shapes to an array (keep existing normalizeList)
function normalizeNewsList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.articles)) return data.articles;
  if (Array.isArray(data.news)) return data.news;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// Load gaming news (NewsAPI endpoint - general gaming news)
async function loadNews() {
  // No longer called on page load
  const container = document.getElementById("gamesGrid");
  container.innerHTML = "";
}

// Search games -> fetch news about the typed game
async function searchGames() {
  const query = document.getElementById("searchInput").value;
  const container = document.getElementById("gamesGrid");
  
  if (!query.trim()) {
    // If input is empty, clear the news grid and show nothing
    container.innerHTML = "";
    return;
  }
  
  container.innerHTML = "Searching...";

  try {
    const res = await fetch(`${API}/news/search?q=${encodeURIComponent(query)}`);
    const articles = await res.json();
    container.innerHTML = "";
    
    // Remove client-side filter, just render what backend returns
    if (!Array.isArray(articles) || !articles.length) {
      container.innerHTML = `<div class='card'>No news found for "${query}"</div>`;
      return;
    }
    articles.forEach(article => container.appendChild(renderNewsCard(article)));
  } catch (err) {
    console.error(err);
    container.innerHTML = "<div class='card'>Search failed</div>";
  }
}

// 📝 Create review
async function createReview() {
  // Check if user is authenticated
  if (!token) {
    alert("Please log in to post a review");
    return;
  }

  const title = document.getElementById("review-title").value;
  const game = document.getElementById("review-game").value;
  const rating = document.getElementById("review-rating").value;
  const content = document.getElementById("review-content").value;

  // Validate inputs
  if (!title.trim() || !game.trim() || !rating || !content.trim()) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, game, rating: parseInt(rating), content })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to post review");
      return;
    }

    const data = await res.json();
    alert("Review posted successfully!");
    
    // Clear form
    document.getElementById("review-title").value = "";
    document.getElementById("review-game").value = "";
    document.getElementById("review-rating").value = "";
    document.getElementById("review-content").value = "";
    
    // Refresh list
    getReviews();
  } catch (err) {
    console.error(err);
    alert("Failed to post review");
  }
}

// Get and render all reviews (from all users)
async function getReviews() {
  const container = document.getElementById("reviewsList");
  container.innerHTML = "Loading reviews...";

  try {
    const res = await fetch(`${API}/reviews/all`);
    const data = await res.json();
    container.innerHTML = "";
    const list = data || [];
    if (!list.length) {
      container.innerHTML = "<div class='card'>No reviews yet</div>";
      return;
    }
    list.forEach(r => {
      const div = document.createElement("div");
      div.className = "card review-card";
      const authorName = r.author?.username || "Anonymous";
      const isOwnReview = r.author?._id === getCurrentUserId();
      
      div.innerHTML = `
        <div class="review-header">
          <div>
            <strong>${r.title}</strong> <em>(${r.game})</em> — ${r.rating}/5
            <p>${r.content}</p>
            <small>by ${authorName}</small>
          </div>
          ${isOwnReview ? `
            <div class="review-actions">
              <button class="btn-small" onclick="editReview('${r._id}')">Edit</button>
              <button class="btn-small btn-danger" onclick="deleteReview('${r._id}')">Delete</button>
            </div>
          ` : ""}
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<div class='card'>Failed to load reviews</div>";
  }
}

// Get current user ID from decoded token
function getCurrentUserId() {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
}

// Edit review
async function editReview(reviewId) {
  try {
    const res = await fetch(`${API}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const review = await res.json();
    
    // Populate form with review data
    document.getElementById("review-title").value = review.title;
    document.getElementById("review-game").value = review.game;
    document.getElementById("review-rating").value = review.rating;
    document.getElementById("review-content").value = review.content;
    
    // Change button text and store reviewId
    const btn = document.querySelector('button[onclick="createReview()"]');
    btn.innerText = "Update Review";
    btn.dataset.reviewId = reviewId;
    
    // Scroll to form
    document.querySelector(".review-form").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Failed to load review");
  }
}

// Update or create review
async function createReview() {
  if (!token) {
    alert("Please log in to post a review");
    return;
  }

  const title = document.getElementById("review-title").value;
  const game = document.getElementById("review-game").value;
  const rating = document.getElementById("review-rating").value;
  const content = document.getElementById("review-content").value;
  const btn = document.querySelector('button[onclick="createReview()"]');
  const reviewId = btn.dataset.reviewId;

  if (!title.trim() || !game.trim() || !rating || !content.trim()) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const method = reviewId ? "PUT" : "POST";
    const url = reviewId ? `${API}/reviews/${reviewId}` : `${API}/reviews`;
    
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, game, rating: parseInt(rating), content })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to save review");
      return;
    }

    alert(reviewId ? "Review updated!" : "Review posted successfully!");
    
    // Clear form and reset button
    document.getElementById("review-title").value = "";
    document.getElementById("review-game").value = "";
    document.getElementById("review-rating").value = "";
    document.getElementById("review-content").value = "";
    btn.innerText = "Post Review";
    delete btn.dataset.reviewId;
    
    getReviews();
  } catch (err) {
    console.error(err);
    alert("Failed to save review");
  }
}

// Delete review
async function deleteReview(reviewId) {
  if (!confirm("Are you sure you want to delete this review?")) {
    return;
  }

  try {
    const res = await fetch(`${API}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete review");
      return;
    }

    alert("Review deleted");
    getReviews();
  } catch (err) {
    console.error(err);
    alert("Failed to delete review");
  }
}

// Tab switching
function showTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => (p.style.display = "none"));
  document.querySelector(`.tab[onclick="showTab('${name}')"]`)?.classList.add("active");
  document.getElementById(name).style.display = "block";

  if (name === "reviews") getReviews();
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Initialize view
document.addEventListener("DOMContentLoaded", () => {
  showTab("news");
  // Do NOT call loadNews() here
});
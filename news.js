// news.js
const API_KEY = "9f8e0a6134b54c13925a0316eadbc357";
let currentCategory = "general", currentQuery = "";

// Helper to get active API key (either from news.js or localStorage)
function getApiKey() {
  const savedKey = localStorage.getItem("newsflow_api_key");
  if (savedKey && savedKey.trim() !== "") {
    return savedKey;
  }
  return API_KEY;
}

// Select DOM elements
const searchInput = document.getElementById("search-input");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const newsGrid = document.getElementById("news-grid");

// Modal DOM elements
const apiModal = document.getElementById("api-modal");
const settingsBtn = document.getElementById("settings-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const saveApiBtn = document.getElementById("save-api-btn");
const clearApiBtn = document.getElementById("clear-api-btn");
const apiKeyInput = document.getElementById("api-key-input");

async function fetchNews(query = "", category = "") {
  // Show #loading-state, hide #news-grid and #error-state.
  loadingState.classList.remove("hidden");
  newsGrid.classList.add("hidden");
  errorState.classList.add("hidden");

  const apiKey = getApiKey();

  // Guard clause for missing API key
  if (!apiKey || apiKey === "YOUR_NEWSAPI_KEY_HERE" || apiKey.trim() === "") {
    loadingState.classList.add("hidden");
    showError("API Key is missing or invalid. Please click the key icon in the header to configure your NewsAPI key.", true);
    return;
  }

  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("country", "us");
  url.searchParams.set("pageSize", "40");

  if (category && category !== "all") {
    url.searchParams.set("category", category);
  }
  if (query) {
    url.searchParams.set("q", query);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw { status: res.status };
    }
    const data = await res.json();

    // Hide #loading-state, show #news-grid
    loadingState.classList.add("hidden");
    newsGrid.classList.remove("hidden");

    if (!data.articles || !data.articles.length) {
      showError("No news found for that search.", false);
    } else {
      renderNews(data.articles);
    }
  } catch (err) {
    loadingState.classList.add("hidden");
    // Show error by status code
    if (err && err.status === 401) {
      showError("Invalid API key. Check your configuration.", true);
    } else if (err && err.status === 429) {
      showError("Rate limit hit (100 req/day on free plan). Wait and retry.", true);
    } else {
      showError("Network error. Check your connection.", true);
    }
  }
}

// Category filter event listeners
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    fetchNews(currentQuery, currentCategory);
  });
});

// Debounce utility
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Search debounce
const debouncedSearch = debounce((q) => {
  currentQuery = q;
  fetchNews(currentQuery, currentCategory);
}, 300);

if (searchInput) {
  searchInput.addEventListener("input", e => debouncedSearch(e.target.value));
}

// Render News Card Grid
function renderNews(articles) {
  newsGrid.innerHTML = "";
  
  // Filter out any articles that do not have a valid urlToImage
  const filteredArticles = articles.filter(article => {
    return article.urlToImage && article.urlToImage !== "null" && article.urlToImage.trim() !== "";
  });

  // Keep exactly 15 articles (equivalent to 5 rows of 3 columns on desktop) to maintain equality
  const finalArticles = filteredArticles.slice(0, 15);

  if (finalArticles.length === 0) {
    showError("No news articles with images found.", false);
    return;
  }

  finalArticles.forEach((article, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = (i * 0.06) + "s";
    card.classList.add("fade-up");
    card.style.padding = "0";

    const sourceName = article.source && article.source.name ? article.source.name : "News";
    const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date().toLocaleDateString();
    const articleTitle = article.title || "No Title Available";
    const articleUrl = article.url || "#";

    card.innerHTML = `
      <img src="${article.urlToImage}" onerror="this.closest('.card').remove();"
      style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;">
      <div style="padding:16px; display: flex; flex-direction: column; flex: 1;">
        <div>
          <span class="badge">${sourceName}</span>
          <h3 style="margin:10px 0 6px;font-size:15px;
          display:-webkit-box;-webkit-line-clamp:2;
          -webkit-box-orient:vertical;overflow:hidden;">${articleTitle}</h3>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">
          ${publishedDate}</p>
        </div>
        <div style="margin-top: auto;">
          <a href="${articleUrl}" target="_blank"
          class="btn-outline" style="font-size:13px; display: block;">Read More</a>
        </div>
      </div>`;
    newsGrid.appendChild(card);
  });
}

// Error State & Rate Limit Handling
function showError(message, showRetry = true) {
  loadingState.classList.add("hidden");
  newsGrid.classList.add("hidden");

  errorState.innerHTML = `
    <div class="card error-card" style="text-align:center;max-width:400px;margin:40px auto;">
      <span class="error-icon" style="font-size:40px;">!</span>
      <p class="error-msg" style="color:var(--text-primary);font-size:16px;margin:12px 0;">
        ${message}
      </p>
      ${showRetry ? '<button class="btn-primary" id="retry-btn">Try Again</button>' : ""}
    </div>`;

  errorState.classList.remove("hidden");

  if (showRetry) {
    const retryBtn = document.getElementById("retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        fetchNews(currentQuery, currentCategory);
      });
    }
  }
}

// Modal Handlers for API Key Setting
if (settingsBtn && apiModal && closeModalBtn && saveApiBtn && clearApiBtn && apiKeyInput) {
  settingsBtn.addEventListener("click", () => {
    const savedKey = localStorage.getItem("newsflow_api_key");
    apiKeyInput.value = savedKey || (API_KEY !== "YOUR_NEWSAPI_KEY_HERE" ? API_KEY : "");
    apiModal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    apiModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === apiModal) {
      apiModal.classList.add("hidden");
    }
  });

  saveApiBtn.addEventListener("click", () => {
    const newKey = apiKeyInput.value.trim();
    if (newKey) {
      localStorage.setItem("newsflow_api_key", newKey);
    } else {
      localStorage.removeItem("newsflow_api_key");
    }
    apiModal.classList.add("hidden");
    fetchNews(currentQuery, currentCategory);
  });

  clearApiBtn.addEventListener("click", () => {
    localStorage.removeItem("newsflow_api_key");
    apiKeyInput.value = "";
    apiModal.classList.add("hidden");
    fetchNews(currentQuery, currentCategory);
  });
}

// Call fetchNews() on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Align currentCategory state with the default active button category
  const activeBtn = document.querySelector(".cat-btn.active");
  if (activeBtn) {
    currentCategory = activeBtn.dataset.category;
  }
  fetchNews(currentQuery, currentCategory);
});

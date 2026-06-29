let userKey = "";

const newsGrid = document.getElementById("news-grid"); // 51
const searchInput = document.getElementById("search-input"); // 20
const loadingState = document.getElementById("loading-state"); // 41
const errorState = document.getElementById("error-state"); // 47

// Fetch News
async function fetchNews(category = "general") {

  loadingState.classList.remove("hidden");
  errorState.classList.add("hidden");
  newsGrid.innerHTML = "";

  if (category === "all") {
    category = "general";
  }
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${userKey}`;

  // try/catch so a failed request shows a message instead of breaking the page
  try {
    const response = await fetch(url);
    const data = await response.json();

    // NewsAPI returns status:"error" for a bad key or hitting the daily limit
    if (data.status === "error") {
      throw new Error(data.message);
    }
    displayNews(data.articles);

  } catch (error) {
    errorState.innerText = "Could not load news. Check your key or try again.";
    errorState.classList.remove("hidden");
  }
  loadingState.classList.add("hidden");
}

// Display News
function displayNews(articles) {

  newsGrid.innerHTML = "";

  articles.forEach(article => {

    const card = document.createElement("div");

    card.className = "card";
    const imgUrl = article.urlToImage
      ? article.urlToImage
      : "https://placehold.co/400x180/1a1a2e/555555?text=No+Image";

    // Format date: "28/06/2026"
    const date = article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString("en-GB")
      : "";

    // Source name: "ASSOCIATED PRESS"
    const source = article.source?.name
      ? article.source.name.toUpperCase()
      : "";

    const sourceColor = getSourceColor(article.source?.name || "");

    card.innerHTML = `
            <img src="${article.urlToImage}" onerror="this.src='https://placehold.co/400x180/1a1a2e/555555?text=No+Image'">
            <span class="source-badge" style="background:${sourceColor}">${source}</span>
            <h3>${article.title}</h3>
            <p class="date">${date}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

    newsGrid.appendChild(card);
  });
}

// Category Buttons
document.querySelectorAll(".cat-btn").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;

    fetchNews(category);

  });

});

// Search
searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  document.querySelectorAll(".card").forEach(card => {

    const title = card.innerText.toLowerCase();

    if (title.includes(value))
      card.style.display = "block";
    else
      card.style.display = "none";

  });

});

// ===== Settings Modal (NEW: the Settings button now actually works) =====
const settingsBtn = document.getElementById("settings-btn"); // 23
const apiModal = document.getElementById("api-modal"); // 59
const closeModalBtn = document.getElementById("close-modal-btn"); //66
const saveApiBtn = document.getElementById("save-api-btn"); //65
const apiKeyInput = document.getElementById("api-key-input"); // 63

// Open the modal
settingsBtn.addEventListener("click", () => {
  apiModal.classList.remove("hidden");
});

// Close the modal
closeModalBtn.addEventListener("click", () => {
  apiModal.classList.add("hidden");
});

// Save: use the typed key (if any), then reload the news
saveApiBtn.addEventListener("click", () => {
  const typedKey = apiKeyInput.value.trim();
  if (typedKey) {
    userKey = typedKey; // replace the default key with the user's key
    fetchNews();        // reload news using the new key
  }
  apiModal.classList.add("hidden");
});

// Assign a unique color per source
function getSourceColor(sourceName) {
  const colors = {
    "associated press": "#c0392b",   // red
    "reuters": "#e67e22",   // orange
    "bbc news": "#c0392b",   // red
    "cnn": "#cc0000",   // dark red
    "the verge": "#e91e8c",   // pink
    "techcrunch": "#0a8f08",   // green
    "politico": "#2980b9",   // blue
    "financial times": "#b8860b",   // gold
    "mma fighting": "#6c3483",   // purple
    "suntimes.com": "#16a085",   // teal
  };

  const key = sourceName.toLowerCase();

  // Check if any key is contained in the source name
  for (const [name, color] of Object.entries(colors)) {
    if (key.includes(name)) return color;
  }

  return "#4f46e5";   // default indigo fallback
}

// toggle
// ADDED — dark mode toggle
const darkToggle = document.getElementById("dark-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  darkToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


// Load Default News
fetchNews();
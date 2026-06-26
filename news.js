const API_KEY = "9f8e0a6134b54c13925a0316eadbc357";
let userKey = API_KEY;

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

    card.innerHTML = `
            <img src="${article.urlToImage}" onerror="this.style.display='none'">
            <h3>${article.title}</h3>
            <p>${article.description || ""}</p>
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

// Load Default News
fetchNews();
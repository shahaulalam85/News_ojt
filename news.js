const API_KEY = "9f8e0a6134b54c13925a0316eadbc357";
const newsGrid = document.getElementById("news-grid"); // 51
const searchInput = document.getElementById("search-input"); // 20

// Fetch News
async function fetchNews(category = "general") {

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  displayNews(data.articles);
}

// Display News
function displayNews(articles) {

  newsGrid.innerHTML = "";

  articles.forEach(article => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
            <img src="${article.urlToImage}">
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

// Load Default News
fetchNews();
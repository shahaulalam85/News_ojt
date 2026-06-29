# 📰 NewsFlow

A clean, responsive news web application built with vanilla HTML, CSS, and JavaScript. Powered by [NewsAPI](https://newsapi.org) via a secure Vercel serverless proxy.

**Live Demo:** [news-ojt-tau.vercel.app](https://news-ojt-tau.vercel.app)

---

## ✨ Features

- 🌙 **Dark / Light mode** toggle with localStorage persistence
- 📂 **Category filtering** — All, Technology, Business, Sports, Health, Science
- 🔍 **Live search** — filters cards instantly as you type
- 🏷️ **Source badges** — color-coded per news outlet
- 📅 **Publication date** displayed on each card
- 🖼️ **Image fallback** — cards without images are automatically removed
- 📱 **Responsive grid** — adapts from 1 to 3 columns
- 🔒 **Secure API proxy** — API key never exposed in frontend code
- ⚙️ **Settings modal** — UI for API key configuration

---

## 🗂️ Project Structure

```
News_ojt/
├── api/
│   └── news.js          # Vercel serverless proxy (calls NewsAPI server-side)
├── index.html           # Main HTML structure
├── style.css            # All styles + dark/light mode CSS variables
├── news.js              # Frontend JavaScript (fetch, display, search, toggle)
├── vercel.json          # Vercel routing config
└── README.md
```

---

## 🚀 Getting Started

### Run Locally

```bash
# Clone the repo
git clone https://github.com/shahaulalam85/News_ojt.git
cd News_ojt

# Install Vercel CLI
npm install -g vercel

# Create local env file
echo "NEWS_API_KEY=your_api_key_here" > .env.local

# Run locally with Vercel dev (runs the proxy too)
vercel dev
```

Open `http://localhost:3000` in your browser.

> ⚠️ Do NOT open `index.html` directly with a file browser — the `/api/news` proxy won't work without a server.

---

## ☁️ Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo `News_ojt`
3. Click **Deploy**

### Step 3 — Add Environment Variable

1. Go to your project → **Settings → Environment Variables**
2. Add:
   - **Key:** `NEWS_API_KEY`
   - **Value:** your NewsAPI key from [newsapi.org](https://newsapi.org)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Click **Save**

### Step 4 — Redeploy

Go to **Deployments** → click `...` on latest → **Redeploy**

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEWS_API_KEY` | Your NewsAPI.org API key | ✅ Yes |

Get a free API key at [newsapi.org/register](https://newsapi.org/register)

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling, CSS variables, dark mode |
| Vanilla JavaScript | Logic, DOM manipulation |
| NewsAPI | News data source |
| Vercel Serverless Functions | Secure API proxy |
| Vercel | Hosting & deployment |

---

## 🔧 How the Proxy Works

NewsAPI blocks browser requests from deployed domains on the free tier (CORS restriction). The serverless function at `api/news.js` acts as a middleman:

```
Browser → /api/news?category=technology
            ↓
       Vercel Function (server-side)
            ↓
       NewsAPI (no CORS block)
            ↓
       JSON response back to browser
```

The API key lives only in Vercel's environment variables — never in your frontend code.

---

## 📁 Key Files Explained

### `api/news.js` — Serverless Proxy
Runs on Vercel's server. Reads `NEWS_API_KEY` from environment, calls NewsAPI, returns JSON.

### `news.js` — Frontend Logic
- `fetchNews(category)` — calls `/api/news?category=...`
- `displayNews(articles)` — builds cards from API response
- `getSourceColor(name)` — maps source names to badge colors
- Dark mode toggle with `localStorage`

### `style.css` — Theming
Uses CSS custom properties (`--bg-card`, `--text-primary`, etc.) defined in `:root` for light mode and overridden in `body.dark` for dark mode. One class toggle flips the entire UI.

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| "Could not load news" on Vercel | `NEWS_API_KEY` not set | Add env variable → Redeploy |
| Works locally, fails on Vercel | Frontend calling NewsAPI directly | Make sure `news.js` uses `/api/news?category=...` |
| `/api/news` returns 404 | `api/news.js` missing from repo | Push the `api/` folder to GitHub |
| `/api/news` returns 500 | API key not configured | Check Vercel → Settings → Environment Variables |
| Cards have no images | NewsAPI returned null for `urlToImage` | Handled automatically — those articles are filtered out |

---

## 👤 Author

**Md Shaha Ul Alam**  
B.Tech CSE — PW Institute of Innovation (Medhavi Skill University), Bangalore  
Batch: BEN01SOTUGBTC25B01
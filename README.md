# NewsFlow — Live News Feed

NewsFlow is a premium, responsive, and high-fidelity single-page web application that displays live top headlines using **NewsAPI**. It features a modern dark-theme design system with custom CSS variables, glassmorphic headers, responsive layouts, horizontal scrollable category navigation, search debouncing, loading spinners, and custom error card boundaries.

## Features

1. **Sticky Header**: Styled with a blurred translucent dark background (`rgba(13, 13, 20, 0.95)`, `backdrop-filter: blur(10px)`) and a flexible search layout.
2. **Category Selection**: Smooth horizontal category bar (Technology, Business, Sports, Health, Science) that hides native scrollbars across browsers.
3. **Debounced Search**: Restricts NewsAPI queries using a custom JavaScript 300ms debouncer.
4. **Staggered Animations**: News cards animate sequentially using staggered CSS `animation-delay` offsets.
5. **Interactive API Configuration**: A visually rich, secure API configuration modal accessible directly via the header settings key icon. Your key is stored in browser `localStorage`.
6. **Error Boundary States**: Dynamic error messaging for HTTP status codes (e.g. 401 Unauthorized, 429 Rate Limits, Network Offline) with custom retry actions.

## Getting Started

Because the application uses an online CORS proxy to bypass browser restrictions, you do not need to install any packages (`node_modules`) or run local dev servers (like Vite).

### 1. Open the Application
Simply double-click the **`index.html`** file in your file explorer to open the application directly in any web browser (using the `file://` protocol).

Alternatively, you can run a simple, zero-dependency local server if you prefer (e.g. using Python: `python -m http.server` and opening `http://localhost:8000`).

### 2. Setup Your NewsAPI Key
1. Go to [newsapi.org](https://newsapi.org) and register for a free Developer API Key.
2. Open the application in your browser.
3. Click the key settings icon in the top right of the header.
4. Paste your API key in the configuration modal and click **Save Configuration**.
5. The application will instantly refresh and fetch live headlines!

export default async function handler(req, res) {
  // Add CORS headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retrieve parameters from query string
  const { query, category, apiKey } = req.query;

  if (!apiKey) {
    return res.status(401).json({ 
      status: "error", 
      code: "apiKeyInvalid", 
      message: "API key is missing." 
    });
  }

  // Construct target NewsAPI endpoint URL
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
    // Perform server-to-server request (allowed by NewsAPI)
    const apiRes = await fetch(url.toString());
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (error) {
    return res.status(500).json({ 
      status: "error", 
      message: "Internal server proxy error." 
    });
  }
}

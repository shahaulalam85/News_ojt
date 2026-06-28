export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, category } = req.query;

  // ✅ Key comes from Vercel env, NEVER from frontend
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      status: "error",
      message: "API key not configured on server."
    });
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
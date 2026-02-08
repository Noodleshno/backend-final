const axios = require("axios");

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const gamingDomains = [
  "ign.com",
  "polygon.com",
  "pcgamer.com",
  "gamespot.com",
  "rockpapershotgun.com",
];

exports.getGamingNews = async (req, res, next) => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: '"video games" OR gaming OR esports',
        language: "en",
        sortBy: "publishedAt",
        pageSize: 50,
        apiKey: NEWS_API_KEY,
        domains: gamingDomains.join(","),
      },
    });

    const keywords = ["video games", "gaming", "esports"];
    const filteredArticles = response.data.articles.filter(
      (article) =>
        article.title &&
        keywords.some((keyword) =>
          article.title.toLowerCase().includes(keyword.toLowerCase())
        ) &&
        gamingDomains.some((domain) =>
          article.url.includes(domain)
        )
    );

    const articles = filteredArticles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
    }));

    res.json(articles);
  } catch (error) {
    console.error("Error fetching gaming news:", error.message);
    res.status(500).json({ message: "Failed to fetch gaming news", error: error.message });
  }
};

exports.getGameNews = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Game name is required" });
    }

    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: q,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 100,
        apiKey: NEWS_API_KEY,
      },
    });

    const gameName = q.toLowerCase();
    
    const filteredArticles = response.data.articles.filter(article =>
      article.title && article.title.toLowerCase().includes(gameName)
    );

    const articles = filteredArticles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
    }));

    res.json(articles);
  } catch (error) {
    console.error("Error fetching game news:", error.message);
    res.status(500).json({ message: "Failed to fetch game news", error: error.message });
  }
};
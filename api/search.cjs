const cheerio = require("cheerio");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const term = req.query.term || "";
  const url = `https://www.traeger.com/search?term=${encodeURIComponent(term)}&type=Recipe`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const recipes = [];

    $('a[href^="/recipes/"]').each((_, el) => {
      const href = "https://www.traeger.com" + $(el).attr("href");
      const title = $(el).text().trim().replace(/\s+/g, " ") || "Untitled";
      recipes.push({ title, href });
    });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Scrape error:", err);
    res.status(500).json({ error: "Scrape failed." });
  }
};

import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const term = req.query.term || "";
  const url = `https://www.traeger.com/search?term=${encodeURIComponent(term)}&type=Recipe`;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for the results container
    await page.waitForSelector("#results");

    // Small scroll to trigger any remaining JS hydration
    await page.evaluate(() => window.scrollBy(0, 300));
    await new Promise((resolve) => setTimeout(resolve, 500));

    const recipes = await page.evaluate(() => {
      const results = [];

      document.querySelectorAll('#results a[href^="/recipes/"]').forEach((el) => {
        const title = el.querySelector("h2")?.textContent.trim() || "Untitled";
        const description = el.querySelector("p")?.textContent.trim() || "";
        const href = "https://www.traeger.com" + el.getAttribute("href");

        results.push({ title, description, href });
      });

      return results;
    });

    await browser.close();
    res.status(200).json(Array.isArray(recipes) ? recipes : []);
  } catch (err) {
    console.error("Puppeteer scrape error:", err);
    res.status(200).json([]); // always return an array
  }
}

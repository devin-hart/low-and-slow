import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.includes("traeger.com/recipes/")) {
    return res.status(400).json({ error: "Invalid or missing recipe URL." });
  }

  try {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();
    page.on("console", (msg) => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`PAGE LOG[${i}]: ${msg.args()[i]}`);
      });
    await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000, // 60 seconds
      });

    const data = await page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.textContent.trim() || "";
      const getList = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.textContent.trim());

      const title = getText("h1.tra-text-web-heading-3");
      const description = getText("p.tw-mb-0.tw-leading-6");
      const yields = document.querySelector("#serving-people > span")?.textContent.trim() || "";
      const ingredients = getList("[itemprop='recipeIngredient']");
      const steps = Array.from(document.querySelectorAll("li[data-test-id*='recipe_step_']")).map((li) => {
        const text = li.querySelector("p.tra-text-web-body-l")?.textContent.trim() || "";
      
        const metadata = Array.from(
          li.querySelectorAll("div.tw-flex.tw-items-center.tw-gap-1")
        ).map((metaBlock) => {
          const label = metaBlock.querySelector("p")?.textContent.trim() || "";
          const svg = metaBlock.querySelector("svg")?.outerHTML || "";
          return { label, svg };
        });
      
        return { text, metadata };
      });

      function findTime(label) {
        const divs = Array.from(document.querySelectorAll("div"));
        for (const div of divs) {
          const p = div.querySelector("p");
          if (p && p.textContent.includes(label)) {
            const h5 = div.querySelector("h5");
            if (h5) return h5.textContent.trim();
          }
        }
        return "";
      }
      
      const prepTime = findTime("Prep Time");
      const cookTime = findTime("Cook Time");
      const pellets = findTime("Pellets");

      return { title, description, yields, ingredients, steps, prepTime, cookTime, pellets };
    });

    await browser.close();
    res.status(200).json(data);
  } catch (err) {
    console.error("Scraping failed:", err);
    res.status(500).json({ error: "Failed to scrape recipe." });
  }
}

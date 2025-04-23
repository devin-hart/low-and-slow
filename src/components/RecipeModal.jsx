import { useEffect, useState } from "react";

export default function RecipeModal({ url, onClose }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function scrapeRecipeFromPage() {
      try {
        const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Scraping failed:", err);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    }
    if (url) scrapeRecipeFromPage();
  }, [url]);

  if (!url) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
  
        {loading ? (
          <p>Loading recipe...</p>
        ) : recipe ? (
          <div className="recipe-modal-content">
            <h2>{recipe.title}</h2>
            <p className="modal-link">
                <a href={url} target="_blank" rel="noopener noreferrer">
                    View on Traeger.com
                </a>
            </p>
            <p className="description">{recipe.description}</p>
            <div className="meta">
              <span><strong>Prep:</strong> {recipe.prepTime}</span>
              <span><strong>Cook:</strong> {recipe.cookTime}</span>
              <span><strong>Pellets:</strong> {recipe.pellets}</span>
              <span><strong>Yields:</strong> {recipe.yields}</span>
            </div>
  
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {(recipe.ingredients || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
  
            <h3>Steps</h3>
            <ol className="steps-list">
                {(recipe.steps || []).map((step, i) => (
                    <li key={i}>
                    <p>{step.text}</p>
                    <div className="step-meta">
                        {(step.metadata || []).map((meta, j) => (
                        <div key={j} className="step-meta-block" dangerouslySetInnerHTML={{ __html: meta.svg + `<span>${meta.label}</span>` }} />
                        ))}
                    </div>
                    </li>
                ))}
            </ol>

          </div>
        ) : (
          <p className="error">Failed to load recipe.</p>
        )}
      </div>
    </div>
  );
}

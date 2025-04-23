import { useState } from "react";
import RecipeCard from "./components/RecipeCard";
import SkeletonCard from "./components/SkeletonCard";
import RecipeModal from "./components/RecipeModal";
import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalUrl, setModalUrl] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setRecipes([]);

    try {
      const res = await fetch(`/api/search?term=${encodeURIComponent(query)}`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Low & Slow Recipe Search</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a pellet grill recipe..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </header>

      <main className="results-wrap">
        <div className="card-grid">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : recipes.map((recipe, i) => (
                <RecipeCard
                  key={i}
                  {...recipe}
                  onClick={() => setModalUrl(recipe.href)}
                />
              ))}
        </div>
      </main>

      {modalUrl && (
        <RecipeModal url={modalUrl} onClose={() => setModalUrl(null)} />
      )}
    </div>
  );
}

export default App;

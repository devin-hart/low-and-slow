import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    const searchTerm = encodeURIComponent(query.trim());
    const response = await fetch(`/api/search?term=${searchTerm}`);
    const data = await response.json();

    console.log(data);
    setRecipes(data);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Low & Slow Recipe Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a pellet grill recipe..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Search
        </button>
      </form>

      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <a
            key={index}
            href={recipe.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            {recipe.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;

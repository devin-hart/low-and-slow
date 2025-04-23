export default function RecipeCard({ title, description, onClick }) {
    return (
      <article className="card" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-description">{description}</p>
        </div>
      </article>
    );
  }
  
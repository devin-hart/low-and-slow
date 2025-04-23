export default function SkeletonCard() {
    return (
      <article className="card skeleton" aria-hidden="true">
        <div className="skeleton-body">
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line long" />
        </div>
      </article>
    );
  }
  
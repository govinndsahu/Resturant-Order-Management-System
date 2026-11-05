import "../css/ProductShimmer.css";

export default function ProductShimmer({ count = 6 }) {
  return (
    <div className="shimmer-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="shimmer-card" key={i}>
          <div className="shimmer-card__image shimmer" />
          <div className="shimmer-card__body">
            <div className="shimmer-card__title shimmer" />
            <div className="shimmer-card__row">
              <div className="shimmer-card__price shimmer" />
              <div className="shimmer-card__btn shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

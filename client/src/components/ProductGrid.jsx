import ProductCard from "./ProductCard";
import Loading from "./Loading";

function ProductGrid({
  products = [],
  loading = false,
  emptyMessage = "No products found",
}) {
  if (loading) {
    return <Loading />;
  }

  if (!products.length) {
    return (
      <div className="products-empty">

        <div className="empty-icon">
          ♡
        </div>

        <h3>
          {emptyMessage}
        </h3>

        <p>
          Try exploring another category
          or search for something else.
        </p>

      </div>
    );
  }

  return (
    <div className="product-grid">

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}

    </div>
  );
}

export default ProductGrid;
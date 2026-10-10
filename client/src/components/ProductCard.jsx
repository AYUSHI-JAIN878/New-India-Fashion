import {
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart, loading: cartLoading } =
    useCart();

  const [wishlisted, setWishlisted] =
    useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [message, setMessage] = useState("");

  const image = product.images?.[0];

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice -
            product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      if (wishlisted) {
        const data =
          await removeFromWishlist(
            product._id
          );

        if (data.success) {
          setWishlisted(false);
          setMessage("Removed");
        }
      } else {
        const data =
          await addToWishlist(
            product._id
          );

        if (data.success) {
          setWishlisted(true);
          setMessage("Saved");
        }
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setWishlistLoading(false);

      setTimeout(() => {
        setMessage("");
      }, 1200);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const result = await addToCart({
      productId: product._id,
      quantity: 1,
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
    });

    if (result.success) {
      setMessage("Added to bag");

      setTimeout(() => {
        setMessage("");
      }, 1500);
    } else {
      setMessage(
        result.message || "Unable to add"
      );
    }
  };

  return (
    <article className="product-card">

      {/* IMAGE */}
      <div className="product-image-wrapper">

        <Link
          to={`/product/${product._id}`}
          className="product-image-link"
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder">
              NEW INDIA
              <span>FASHION</span>
            </div>
          )}
        </Link>

        {/* SALE */}
        {discount > 0 && (
          <span className="product-badge">
            {discount}% OFF
          </span>
        )}

        {/* WISHLIST */}
        <button
          className={`product-wishlist ${
            wishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title="Wishlist"
        >
          <Heart
            size={18}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* QUICK ADD */}
        <button
          className="quick-cart-btn"
          onClick={handleQuickAdd}
          disabled={
            cartLoading ||
            product.stock === 0
          }
        >
          <ShoppingBag size={15} />

          {product.stock === 0
            ? "Out of Stock"
            : cartLoading
            ? "Adding..."
            : "Add to Bag"}
        </button>

        {/* TOAST */}
        {message && (
          <span className="product-card-message">
            {message}
          </span>
        )}

      </div>

      {/* INFO */}
      <div className="product-info">

        <span className="product-category">
          {product.subCategory ||
            product.category}
        </span>

        <Link
          to={`/product/${product._id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        {/* RATING */}
        <div className="product-rating">

          <Star
            size={13}
            fill="currentColor"
          />

          <span>
            {product.rating > 0
              ? product.rating.toFixed(1)
              : "New"}
          </span>

          {product.numReviews > 0 && (
            <span className="review-count">
              ({product.numReviews})
            </span>
          )}

        </div>

        {/* PRICE */}
        <div className="product-price">

          <strong>
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </strong>

          {product.originalPrice >
            product.price && (
            <del>
              ₹
              {product.originalPrice.toLocaleString(
                "en-IN"
              )}
            </del>
          )}

        </div>

        {/* SMALL DETAILS */}
        <div className="product-mini-details">

          {product.fabric && (
            <span>
              {product.fabric}
            </span>
          )}

          {product.colors?.length > 0 && (
            <span>
              {product.colors.length}{" "}
              {product.colors.length === 1
                ? "Color"
                : "Colors"}
            </span>
          )}

        </div>

      </div>

    </article>
  );
}

export default ProductCard;
import {
  Heart,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import Loading from "../components/Loading";

function Wishlist() {
  const { isAuthenticated } =
    useAuth();

  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [removingId, setRemovingId] =
    useState(null);

  /* =========================
     FETCH WISHLIST
  ========================= */

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const data =
        await getWishlist();

      if (data?.success) {
        setProducts(
          data.wishlist?.products || []
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data?.message ||
          error.message
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* =========================
     REMOVE PRODUCT
  ========================= */

  const handleRemove = async (
    productId
  ) => {
    if (!productId || removingId) {
      return;
    }

    try {
      setRemovingId(productId);

      const data =
        await removeFromWishlist(
          productId
        );

      if (data?.success) {
        setProducts(
          data.wishlist?.products || []
        );
      }
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setRemovingId(null);
    }
  };

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!isAuthenticated) {
    return (
      <section className="wishlist-page">

        <div className="wishlist-login-state">

          <Heart
            size={48}
            strokeWidth={1.3}
          />

          <span className="section-eyebrow">
            MY WISHLIST
          </span>

          <h1>
            Your Wishlist
          </h1>

          <p>
            Login to save your favourite
            fashion pieces.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login to Continue
          </button>

        </div>

      </section>
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="wishlist-page">
        <Loading />
      </section>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <section className="wishlist-page">

      <div className="wishlist-container">

        {/* HEADER */}

        <div className="wishlist-header">

          <div>

            <span className="section-eyebrow">
              SAVED FOR LATER
            </span>

            <h1>
              My Wishlist
            </h1>

            <p className="wishlist-header-description">
              Your favourite styles,
              saved in one place.
            </p>

          </div>

          <span className="wishlist-count">
            {products.length}{" "}
            {products.length === 1
              ? "item"
              : "items"}
          </span>

        </div>

        {/* EMPTY WISHLIST */}

        {!products.length ? (

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <Heart
                size={44}
                strokeWidth={1.2}
              />
            </div>

            <span className="section-eyebrow">
              NOTHING SAVED YET
            </span>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save pieces you love and
              find them here anytime.
            </p>

            <Link to="/">
              <ShoppingBag size={17} />
              Explore Fashion
            </Link>

          </div>

        ) : (

          /* WISHLIST PRODUCTS */

          <div className="wishlist-grid">

            {products.map((product) => {

              const price = Number(
                product.price || 0
              );

              const isRemoving =
                removingId ===
                product._id;

              return (
                <article
                  className={`wishlist-card ${
                    isRemoving
                      ? "removing"
                      : ""
                  }`}
                  key={product._id}
                >

                  {/* IMAGE */}

                  <Link
                    to={`/product/${product._id}`}
                    className="wishlist-image"
                  >

                    {product.images?.[0] ? (
                      <img
                        src={
                          product.images[0]
                        }
                        alt={
                          product.name ||
                          "Fashion product"
                        }
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <span>
                          NEW INDIA
                        </span>
                        <strong>
                          FASHION
                        </strong>
                      </div>
                    )}

                  </Link>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() =>
                      handleRemove(
                        product._id
                      )
                    }
                    disabled={isRemoving}
                    title={
                      isRemoving
                        ? "Removing..."
                        : "Remove from wishlist"
                    }
                    aria-label={
                      `Remove ${product.name || "product"} from wishlist`
                    }
                  >

                    <Heart
                      size={18}
                      fill="currentColor"
                    />

                  </button>

                  {/* INFORMATION */}

                  <div className="wishlist-info">

                    <span className="wishlist-category">
                      {product.category ||
                        "Fashion"}
                    </span>

                    <Link
                      to={`/product/${product._id}`}
                      className="wishlist-product-name"
                    >
                      {product.name ||
                        "Fashion Item"}
                    </Link>

                    <div className="wishlist-price">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

    </section>
  );
}

export default Wishlist;
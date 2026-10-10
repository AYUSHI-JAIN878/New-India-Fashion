import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import { getProductById } from "../services/productService";

import Loading from "../components/Loading";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [message, setMessage] = useState("");

  /* =========================
     FETCH PRODUCT
  ========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getProductById(id);

        if (data?.success && data.product) {
          const currentProduct = data.product;

          setProduct(currentProduct);

          setSelectedImage(0);

          setQuantity(1);

          if (currentProduct.sizes?.length > 0) {
            setSelectedSize(
              currentProduct.sizes[0]
            );
          } else {
            setSelectedSize("");
          }

          if (currentProduct.colors?.length > 0) {
            setSelectedColor(
              currentProduct.colors[0]
            );
          } else {
            setSelectedColor("");
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(
          "Product details error:",
          error.response?.data?.message ||
            error.message
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================
     CHECK WISHLIST
  ========================= */

  useEffect(() => {
    const checkWishlist = async () => {
      if (
        !isAuthenticated ||
        !product?._id
      ) {
        setIsWishlisted(false);
        return;
      }

      try {
        const data = await getWishlist();

        if (data?.success) {
          const products =
            data.wishlist?.products || [];

          const exists = products.some(
            (item) =>
              String(item._id) ===
              String(product._id)
          );

          setIsWishlisted(exists);
        }
      } catch (error) {
        console.error(
          "Wishlist check error:",
          error
        );
      }
    };

    checkWishlist();
  }, [isAuthenticated, product]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="product-details-page">
        <Loading />
      </section>
    );
  }

  /* =========================
     PRODUCT NOT FOUND
  ========================= */

  if (!product) {
    return (
      <section className="product-details-page">
        <div className="product-not-found">

          <h2>Product not found</h2>

          <p>
            This fashion piece may no longer
            be available.
          </p>

          <Link
            to="/"
            className="primary-btn"
          >
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  const images = Array.isArray(product.images)
    ? product.images
    : [];

  const currentImage =
    images[selectedImage] || "";

  const price = Number(product.price || 0);

  const originalPrice = Number(
    product.originalPrice || 0
  );

  const stock = Number(product.stock || 0);

  const rating = Number(
    product.rating || 0
  );

  const discount =
    originalPrice > price
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;

  /* =========================
     QUANTITY
  ========================= */

  const increaseQuantity = () => {
    if (stock <= 0) return;

    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (stock <= 0) {
      setMessage("This product is out of stock.");
      return;
    }

    if (
      product.sizes?.length > 0 &&
      !selectedSize
    ) {
      setMessage("Please select a size.");
      return;
    }

    if (
      product.colors?.length > 0 &&
      !selectedColor
    ) {
      setMessage("Please select a color.");
      return;
    }

    try {
      const result = await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      if (result?.success) {
        setMessage(
          "Added to your shopping bag."
        );
      } else {
        setMessage(
          result?.message ||
            "Unable to add product."
        );
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to add product."
      );
    }
  };

  /* =========================
     WISHLIST
  ========================= */

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      setMessage("");

      if (isWishlisted) {
        const data =
          await removeFromWishlist(
            product._id
          );

        if (data?.success) {
          setIsWishlisted(false);
          setMessage(
            "Removed from wishlist."
          );
        } else {
          setMessage(
            data?.message ||
              "Unable to remove from wishlist."
          );
        }
      } else {
        const data =
          await addToWishlist(
            product._id
          );

        if (data?.success) {
          setIsWishlisted(true);
          setMessage(
            "Added to wishlist."
          );
        } else {
          setMessage(
            data?.message ||
              "Unable to add to wishlist."
          );
        }
      }
    } catch (error) {
      console.error(
        "Wishlist update error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Wishlist update failed."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <section className="product-details-page">

      <div className="container">

        {/* BACK */}
        <Link
          to={`/category/${product.category}`}
          className="product-back"
        >
          <ArrowLeft size={16} />
          Back to {product.category}
        </Link>

        <div className="product-details">

          {/* =========================
              IMAGE GALLERY
          ========================= */}

          <div className="product-gallery">

            <div className="thumbnail-list">

              {images.length > 0 ? (
                images.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`thumbnail ${
                        selectedImage === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )
              ) : (
                <div className="thumbnail-placeholder">
                  NIF
                </div>
              )}

            </div>

            <div className="main-product-image">

              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                />
              ) : (
                <div className="product-image-placeholder">
                  NEW INDIA
                  <span>FASHION</span>
                </div>
              )}

              {discount > 0 && (
                <span className="product-badge">
                  {discount}% OFF
                </span>
              )}

            </div>

          </div>

          {/* =========================
              PRODUCT INFO
          ========================= */}

          <div className="product-info-panel">

            <span className="product-category">
              {product.category}

              {product.subCategory
                ? ` • ${product.subCategory}`
                : ""}
            </span>

            <h1>{product.name}</h1>

            {/* RATING */}
            <div className="product-detail-rating">

              <div className="rating-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={15}
                      fill={
                        star <=
                        Math.round(rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )
                )}

              </div>

              <span>
                {rating > 0
                  ? `${rating.toFixed(
                      1
                    )} · ${
                      product.numReviews ||
                      0
                    } reviews`
                  : "New arrival"}
              </span>

            </div>

            {/* PRICE */}
            <div className="product-detail-price">

              <strong>
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {originalPrice > price && (
                <del>
                  ₹
                  {originalPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

              {discount > 0 && (
                <span>
                  {discount}% OFF
                </span>
              )}

            </div>

            <div className="product-divider" />

            {/* DESCRIPTION */}
            {product.description && (
              <p className="product-description">
                {product.description}
              </p>
            )}

            {/* COLOR */}
            {product.colors?.length > 0 && (
              <div className="product-option">

                <div className="product-option-header">
                  <strong>Color</strong>

                  <span>
                    {selectedColor}
                  </span>
                </div>

                <div className="color-options">

                  {product.colors.map(
                    (color) => (
                      <button
                        type="button"
                        key={color}
                        className={`color-option ${
                          selectedColor ===
                          color
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                      >
                        {color}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* SIZE */}
            {product.sizes?.length > 0 && (
              <div className="product-option">

                <div className="product-option-header">
                  <strong>Size</strong>

                  <span>
                    {selectedSize}
                  </span>
                </div>

                <div className="size-options">

                  {product.sizes.map(
                    (size) => (
                      <button
                        type="button"
                        key={size}
                        className={`size-option ${
                          selectedSize ===
                          size
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                      >
                        {size}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* QUANTITY */}
            <div className="product-option">

              <div className="product-option-header">
                <strong>Quantity</strong>
              </div>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    stock <= 0 ||
                    quantity >= stock
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>

              </div>

              {stock > 0 && (
                <span className="stock-text">
                  {stock}{" "}
                  {stock === 1
                    ? "piece"
                    : "pieces"}{" "}
                  available
                </span>
              )}

            </div>

            {/* ACTIONS */}
            <div className="product-actions">

              <button
                type="button"
                className="primary-btn add-to-cart-btn"
                onClick={
                  handleAddToCart
                }
                disabled={
                  cartLoading ||
                  stock <= 0
                }
              >
                <ShoppingBag size={18} />

                {stock <= 0
                  ? "Out of Stock"
                  : cartLoading
                  ? "Adding..."
                  : "Add to Bag"}
              </button>

              <button
                type="button"
                className={`wishlist-detail-btn ${
                  isWishlisted
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleWishlist
                }
                disabled={
                  wishlistLoading
                }
                title={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

            {/* MESSAGE */}
            {message && (
              <div className="product-message">
                <Check size={16} />
                {message}
              </div>
            )}

            {/* DELIVERY */}
            <div className="delivery-box">

              <div className="delivery-row">
                <Truck size={19} />

                <div>
                  <strong>
                    Easy Delivery
                  </strong>

                  <span>
                    Delivery available
                    across India
                  </span>
                </div>
              </div>

              <div className="delivery-row">
                <Check size={19} />

                <div>
                  <strong>
                    Quality Checked
                  </strong>

                  <span>
                    Carefully selected
                    fashion pieces
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =========================
            PRODUCT DETAILS
        ========================= */}

        <div className="product-extra-details">

          <div className="product-extra-heading">
            <span className="section-eyebrow">
              PRODUCT INFORMATION
            </span>

            <h2>
              Details you’ll love
            </h2>
          </div>

          <div className="details-grid">

            {[
              ["Fabric", product.fabric],
              ["Work", product.work],
              ["Fit", product.fit],
              ["Occasion", product.occasion],
              ["Sleeve", product.sleeve],
              ["Neck", product.neck],
              ["Brand", product.brand],
              [
                "Availability",
                stock > 0
                  ? "In Stock"
                  : "Out of Stock",
              ],
            ]
              .filter(
                ([, value]) =>
                  value !== undefined &&
                  value !== null &&
                  value !== ""
              )
              .map(
                ([label, value]) => (
                  <div
                    className="detail-item"
                    key={label}
                  >
                    <span>{label}</span>
                    <strong>
                      {value}
                    </strong>
                  </div>
                )
              )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductDetails;
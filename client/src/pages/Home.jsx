import {
  ArrowRight,
  Clock3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";

import { getProducts } from "../services/productService";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoadingFeatured(true);
        setLoadingNew(true);

        const [featuredData, newData] = await Promise.all([
          getProducts({
            featured: true,
          }),
          getProducts(),
        ]);

        if (featuredData.success) {
          setFeaturedProducts(
            featuredData.products?.slice(0, 8) || []
          );
        }

        if (newData.success) {
          setNewProducts(
            newData.products?.slice(0, 8) || []
          );
        }
      } catch (error) {
        console.error(
          "Home products error:",
          error.response?.data?.message ||
            error.message
        );

        setFeaturedProducts([]);
        setNewProducts([]);
      } finally {
        setLoadingFeatured(false);
        setLoadingNew(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const categories = [
    {
      name: "Ladies Suits",
      path: "/category/Suits",
      short: "Suits",
      className: "category-peach",
    },
    {
      name: "Gowns",
      path: "/category/Gowns",
      short: "Gowns",
      className: "category-pink",
    },
    {
      name: "Crop Tops",
      path: "/category/Tops",
      short: "Tops",
      className: "category-lavender",
    },
    {
      name: "Indo-Western",
      path: "/category/Indo-Western",
      short: "Fusion",
      className: "category-sage",
    },
    {
      name: "Palazzo",
      path: "/category/Bottomwear",
      short: "Palazzo",
      className: "category-cream",
    },
  ];

  return (
    <div className="home-page">

      {/* HERO */}
      <HeroSection />

      {/* CATEGORIES */}
      <section className="home-section category-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              EXPLORE
            </span>

            <h2>Shop by Category</h2>

            <p>
              Find your favourite styles, all in one place.
            </p>
          </div>

          <Link
            to="/search"
            className="section-link"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="category-circles">
          {categories.map((category) => (
            <Link
              to={category.path}
              key={category.name}
              className="home-category-item"
            >
              <div
                className={`home-category-circle ${category.className}`}
              >
                <span>{category.short}</span>
              </div>

              <h3>{category.name}</h3>

              <span className="category-shop-link">
                Shop Now
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              HANDPICKED
            </span>

            <h2>Featured Collection</h2>

            <p>
              Styles we think you'll love.
            </p>
          </div>

          <Link
            to="/search?featured=true"
            className="section-link"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loadingFeatured}
          emptyMessage="No featured products yet"
        />
      </section>

      {/* NEW ARRIVALS BANNER */}
      <section className="home-feature-banner">
        <div className="feature-banner-content">
          <span className="feature-icon">
            <Sparkles size={15} />
            FRESH PICKS
          </span>

          <h2>New Arrivals</h2>

          <p>
            Discover the latest styles added to
            our collection.
          </p>

          <Link
            to="/search?featured=true"
            className="feature-banner-btn"
          >
            Discover New Arrivals
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="feature-banner-side">
          <span>01</span>

          <strong>Fresh</strong>

          <small>
            New styles every season
          </small>
        </div>
      </section>

      {/* TRENDING + LATEST */}
      <section className="home-small-sections">

        <Link
          to="/search?search=trending"
          className="home-mini-card"
        >
          <div className="mini-card-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>STYLE EDIT</span>

            <h3>Trending Now</h3>

            <p>
              What's loved right now
            </p>
          </div>

          <ArrowRight size={17} />
        </Link>

        <Link
          to="/search"
          className="home-mini-card"
        >
          <div className="mini-card-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>JUST IN</span>

            <h3>Latest Collection</h3>

            <p>
              Explore our newest picks
            </p>
          </div>

          <ArrowRight size={17} />
        </Link>

      </section>

      {/* NEW PRODUCTS */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              JUST IN
            </span>

            <h2>Latest Collection</h2>

            <p>
              Explore our newest fashion picks.
            </p>
          </div>

          <Link
            to="/search"
            className="section-link"
          >
            Explore All
            <ArrowRight size={15} />
          </Link>
        </div>

        <ProductGrid
          products={newProducts}
          loading={loadingNew}
          emptyMessage="No products available yet"
        />
      </section>

    </div>
  );
}

export default Home;
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

function Category() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("latest");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("");

  const categoryInfo = {
    Suits: {
      title: "Ladies Suits",
      eyebrow: "ETHNIC ELEGANCE",
      description:
        "Discover elegant suits designed for everyday comfort, festive moments and special occasions.",
      subCategories: [
        "All Suits",
        "Anarkali",
        "Straight Suit",
        "Punjabi Suit",
        "Party Wear",
        "Cotton Suit",
      ],
    },

    Gowns: {
      title: "Gowns",
      eyebrow: "MAKE AN ENTRANCE",
      description:
        "Elegant silhouettes and statement gowns for celebrations, parties and unforgettable evenings.",
      subCategories: [
        "All Gowns",
        "Party Gown",
        "Anarkali Gown",
        "Floor Length",
        "Embroidered Gown",
      ],
    },

    Tops: {
      title: "Crop Tops",
      eyebrow: "TRENDING NOW",
      description:
        "Fresh and stylish crop tops made for effortless everyday and contemporary looks.",
      subCategories: [
        "All Tops",
        "Casual",
        "Party Wear",
        "Printed",
        "Sleeveless",
        "Full Sleeve",
      ],
    },

    "Indo-Western": {
      title: "Indo-Western",
      eyebrow: "TRADITION MEETS MODERN",
      description:
        "The perfect blend of Indian elegance and contemporary fashion.",
      subCategories: [
        "All Indo-Western",
        "Fusion Sets",
        "Dresses",
        "Kurtis",
        "Co-ord Sets",
      ],
    },

    Bottomwear: {
      title: "Palazzo",
      eyebrow: "COMFORT & STYLE",
      description:
        "Relaxed silhouettes and versatile palazzos that pair beautifully with your favourite tops and suits.",
      subCategories: [
        "All Palazzo",
        "Wide Leg",
        "Printed",
        "Solid",
        "Party Wear",
      ],
    },
  };

  const currentCategory =
    categoryInfo[category] || {
      title: category,
      eyebrow: "NEW INDIA FASHION",
      description:
        "Explore our latest fashion collection.",
      subCategories: [],
    };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          category,
        });

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Category products error:",
          error.response?.data?.message ||
            error.message
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (
      selectedSubCategory &&
      !selectedSubCategory.startsWith("All ")
    ) {
      result = result.filter((product) =>
        product.subCategory
          ?.toLowerCase()
          .includes(
            selectedSubCategory.toLowerCase()
          )
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    selectedSubCategory,
    sort,
  ]);

  return (
    <div className="category-page-wrapper">

      <main className="category-page">

        {/* CATEGORY HERO */}
        <section className="category-hero">
          <div className="category-hero-content">

            <Link
              to="/"
              className="category-back"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <span className="section-eyebrow">
              {currentCategory.eyebrow}
            </span>

            <h1>
              {currentCategory.title}
            </h1>

            <p>
              {currentCategory.description}
            </p>

          </div>
        </section>

        {/* SUB CATEGORIES */}
        {currentCategory.subCategories.length >
          0 && (
          <section className="category-subnav">
            <div className="category-subnav-inner">

              {currentCategory.subCategories.map(
                (item) => {
                  const isActive =
                    selectedSubCategory === item ||
                    (!selectedSubCategory &&
                      item.startsWith("All "));

                  return (
                    <button
                      key={item}
                      className={
                        isActive
                          ? "category-subnav-btn active"
                          : "category-subnav-btn"
                      }
                      onClick={() =>
                        setSelectedSubCategory(
                          item.startsWith("All ")
                            ? ""
                            : item
                        )
                      }
                    >
                      {item}
                    </button>
                  );
                }
              )}

            </div>
          </section>
        )}

        {/* PRODUCTS */}
        <section className="section category-products-section">
          <div className="container">

            <div className="category-toolbar">

              <div>
                <span className="category-result-count">
                  {loading
                    ? "Loading collection..."
                    : `${filteredProducts.length} ${
                        filteredProducts.length === 1
                          ? "style"
                          : "styles"
                      }`}
                </span>
              </div>

              <div className="category-toolbar-right">

                <div className="sort-wrapper">
                  <SlidersHorizontal size={16} />

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                  >
                    <option value="latest">
                      Latest
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="name">
                      Name
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                  />
                </div>

              </div>
            </div>

            <ProductGrid
              products={filteredProducts}
              loading={loading}
              emptyMessage={`No ${currentCategory.title.toLowerCase()} found`}
            />

          </div>
        </section>

        {/* BOTTOM DISCOVER */}
        <section className="category-bottom-banner">
          <div className="container">

            <div className="category-bottom-inner">

              <div>
                <span className="section-eyebrow">
                  NEW INDIA FASHION
                </span>

                <h2>
                  Looking for something
                  different?
                </h2>

                <p>
                  Explore our complete collection
                  and discover your next favourite
                  style.
                </p>
              </div>

              <Link
                to="/search"
                className="primary-btn"
              >
                Explore All
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Category;
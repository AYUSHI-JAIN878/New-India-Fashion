import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";

const categories = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Ladies Suits",
    value: "Suits",
  },
  {
    label: "Gowns",
    value: "Gowns",
  },
  {
    label: "Crop Tops",
    value: "Tops",
  },
  {
    label: "Indo-Western",
    value: "Indo-Western",
  },
  {
    label: "Palazzo",
    value: "Bottomwear",
  },
];

const priceRanges = [
  {
    label: "All Prices",
    min: "",
    max: "",
  },
  {
    label: "Under ₹999",
    min: "",
    max: "999",
  },
  {
    label: "₹999 – ₹1,999",
    min: "999",
    max: "1999",
  },
  {
    label: "₹1,999 – ₹2,999",
    min: "1999",
    max: "2999",
  },
  {
    label: "Above ₹2,999",
    min: "2999",
    max: "",
  },
];

function SearchResults() {
  const [searchParams] =
    useSearchParams();

  const searchQuery =
    searchParams.get("search") || "";

  const featured =
    searchParams.get("featured") === "true";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || ""
    );

  const [selectedPrice, setSelectedPrice] =
    useState({
      min:
        searchParams.get("minPrice") || "",
      max:
        searchParams.get("maxPrice") || "",
    });

  const [sortBy, setSortBy] =
    useState("latest");

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /* =========================
     SYNC URL FILTERS
  ========================= */

  useEffect(() => {
    setSelectedCategory(
      searchParams.get("category") || ""
    );

    setSelectedPrice({
      min:
        searchParams.get("minPrice") || "",
      max:
        searchParams.get("maxPrice") || "",
    });
  }, [searchParams]);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {};

        if (searchQuery.trim()) {
          params.search =
            searchQuery.trim();
        }

        if (featured) {
          params.featured = true;
        }

        if (selectedCategory) {
          params.category =
            selectedCategory;
        }

        if (selectedPrice.min) {
          params.minPrice =
            selectedPrice.min;
        }

        if (selectedPrice.max) {
          params.maxPrice =
            selectedPrice.max;
        }

        const data =
          await getProducts(params);

        if (data?.success) {
          setProducts(
            data.products || []
          );
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Search products error:",
          error.response?.data?.message ||
            error.message
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchQuery,
    featured,
    selectedCategory,
    selectedPrice.min,
    selectedPrice.max,
  ]);

  /* =========================
     SORT PRODUCTS
  ========================= */

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );

      case "price-high":
        return sorted.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );

      case "name":
        return sorted.sort(
          (a, b) =>
            (a.name || "").localeCompare(
              b.name || ""
            )
        );

      case "latest":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        );
    }
  }, [products, sortBy]);

  /* =========================
     PRICE LABEL
  ========================= */

  const selectedPriceLabel =
    priceRanges.find(
      (range) =>
        range.min ===
          selectedPrice.min &&
        range.max ===
          selectedPrice.max
    )?.label || "Custom Price";

  /* =========================
     PAGE TEXT
  ========================= */

  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : featured
    ? "New Arrivals"
    : "Explore Fashion";

  const pageDescription = searchQuery
    ? `${products.length} ${
        products.length === 1
          ? "style"
          : "styles"
      } found for your search`
    : featured
    ? "Fresh styles and latest arrivals from New India Fashion"
    : "Find something beautiful for every occasion";

  /* =========================
     FILTER HELPERS
  ========================= */

  const clearFilters = () => {
    setSelectedCategory("");

    setSelectedPrice({
      min: "",
      max: "",
    });

    setSortBy("latest");

    setMobileFiltersOpen(false);
  };

  const selectCategory = (value) => {
    setSelectedCategory(value);
    setMobileFiltersOpen(false);
  };

  const selectPrice = (min, max) => {
    setSelectedPrice({
      min,
      max,
    });

    setMobileFiltersOpen(false);
  };

  const hasFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedPrice.min) ||
    Boolean(selectedPrice.max);

  return (
    <section className="search-results-page">

      <div className="container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="search-results-header">

          <div>

            <div className="search-results-eyebrow">
              <Search size={15} />
              NEW INDIA FASHION
            </div>

            <h1>{pageTitle}</h1>

            <p>{pageDescription}</p>

          </div>

          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() =>
              setMobileFiltersOpen(
                (prev) => !prev
              )
            }
          >
            <SlidersHorizontal
              size={17}
            />
            Filters
          </button>

        </div>

        {/* =========================
            CATEGORY CHIPS
        ========================= */}

        <div className="search-category-row">

          {categories.map(
            (category) => (
              <button
                type="button"
                key={
                  category.value ||
                  "all"
                }
                className={`search-category-chip ${
                  selectedCategory ===
                  category.value
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectCategory(
                    category.value
                  )
                }
              >
                {selectedCategory ===
                  category.value && (
                  <Check size={14} />
                )}

                {category.label}
              </button>
            )
          )}

        </div>

        <div className="search-results-layout">

          {/* =========================
              FILTER SIDEBAR
          ========================= */}

          <aside
            className={`search-filter-sidebar ${
              mobileFiltersOpen
                ? "open"
                : ""
            }`}
          >

            <div className="filter-sidebar-header">

              <div>
                <span>FILTERS</span>

                <h3>
                  Refine your search
                </h3>
              </div>

              <button
                type="button"
                className="mobile-filter-close"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                aria-label="Close filters"
              >
                <X size={19} />
              </button>

            </div>

            <div className="filter-divider" />

            {/* CATEGORY */}
            <div className="filter-group">

              <div className="filter-group-title">
                <span>Category</span>
                <Filter size={15} />
              </div>

              <div className="filter-options">

                {categories
                  .slice(1)
                  .map((category) => {
                    const active =
                      selectedCategory ===
                      category.value;

                    return (
                      <button
                        type="button"
                        key={
                          category.value
                        }
                        className={`filter-option ${
                          active
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectCategory(
                            active
                              ? ""
                              : category.value
                          )
                        }
                      >
                        <span className="filter-checkbox">
                          {active && (
                            <Check
                              size={12}
                            />
                          )}
                        </span>

                        {category.label}
                      </button>
                    );
                  })}

              </div>

            </div>

            <div className="filter-divider" />

            {/* PRICE */}
            <div className="filter-group">

              <div className="filter-group-title">
                <span>Price</span>
              </div>

              <div className="filter-options">

                {priceRanges.map(
                  (range) => {
                    const active =
                      selectedPrice.min ===
                        range.min &&
                      selectedPrice.max ===
                        range.max;

                    return (
                      <button
                        type="button"
                        key={
                          range.label
                        }
                        className={`filter-option ${
                          active
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectPrice(
                            range.min,
                            range.max
                          )
                        }
                      >
                        <span className="filter-checkbox">
                          {active && (
                            <Check
                              size={12}
                            />
                          )}
                        </span>

                        {range.label}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

            <div className="filter-divider" />

            {/* CUSTOM PRICE */}
            <div className="filter-group">

              <div className="filter-group-title">
                <span>
                  Custom Price
                </span>
              </div>

              <div className="custom-price-fields">

                <input
                  type="number"
                  min="0"
                  placeholder="Min ₹"
                  value={
                    selectedPrice.min
                  }
                  onChange={(e) =>
                    setSelectedPrice(
                      (prev) => ({
                        ...prev,
                        min: e.target.value,
                      })
                    )
                  }
                />

                <span>—</span>

                <input
                  type="number"
                  min="0"
                  placeholder="Max ₹"
                  value={
                    selectedPrice.max
                  }
                  onChange={(e) =>
                    setSelectedPrice(
                      (prev) => ({
                        ...prev,
                        max: e.target.value,
                      })
                    )
                  }
                />

              </div>

            </div>

            {/* CLEAR */}
            {hasFilters && (
              <>
                <div className="filter-divider" />

                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={
                    clearFilters
                  }
                >
                  <RotateCcw
                    size={15}
                  />
                  Clear All Filters
                </button>
              </>
            )}

          </aside>

          {/* =========================
              PRODUCTS
          ========================= */}

          <div className="search-products-section">

            <div className="search-toolbar">

              <div className="results-count">
                <strong>
                  {
                    sortedProducts.length
                  }
                </strong>{" "}
                {sortedProducts.length ===
                1
                  ? "product"
                  : "products"}
              </div>

              <div className="sort-wrapper">

                <span>Sort by</span>

                <div className="sort-select-wrapper">

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value
                      )
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
                      Name: A to Z
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                  />

                </div>

              </div>

            </div>

            {/* =========================
                ACTIVE FILTERS
            ========================= */}

            {hasFilters && (
              <div className="active-filters">

                <span className="active-filters-label">
                  Active:
                </span>

                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        ""
                      )
                    }
                  >
                    {
                      categories.find(
                        (category) =>
                          category.value ===
                          selectedCategory
                      )?.label
                    }

                    <X size={13} />
                  </button>
                )}

                {(selectedPrice.min ||
                  selectedPrice.max) && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPrice({
                        min: "",
                        max: "",
                      })
                    }
                  >
                    {selectedPriceLabel}

                    <X size={13} />
                  </button>
                )}

                <button
                  type="button"
                  className="clear-active-filters"
                  onClick={
                    clearFilters
                  }
                >
                  Clear all
                </button>

              </div>
            )}

            {/* PRODUCT GRID */}
            <ProductGrid
              products={sortedProducts}
              loading={loading}
              emptyMessage={
                searchQuery
                  ? `No styles found for "${searchQuery}"`
                  : "No products found"
              }
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default SearchResults;
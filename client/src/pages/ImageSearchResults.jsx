import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Search,
  Sparkles,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

function ImageSearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const image = location.state?.image || null;
  const searchText = location.state?.searchText || "";

  useEffect(() => {
    const fetchMatchingProducts = async () => {
      try {
        setLoading(true);

        const params = {};

        if (searchText.trim()) {
          params.search = searchText.trim();
        }

        const data = await getProducts(params);

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Image search results error:",
          error.response?.data?.message || error.message
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingProducts();
  }, [searchText]);

  const handleNewSearch = () => {
    navigate("/image-search");
  };

  return (
    <section className="image-search-results-page">
      <div className="container">

        {/* HEADER */}
        <div className="image-results-header">
          <div>
            <Link
              to="/image-search"
              className="back-link"
            >
              <ArrowLeft size={16} />
              New Image Search
            </Link>

            <div className="image-results-eyebrow">
              <Sparkles size={15} />
              VISUAL FASHION SEARCH
            </div>

            <h1>
              Styles inspired by
              <br />
              <span>your image.</span>
            </h1>

            <p>
              Explore fashion pieces that match the style
              you're looking for.
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={handleNewSearch}
          >
            <Camera size={16} />
            Search Another Image
          </button>
        </div>

        {/* SEARCHED IMAGE */}
        {image && (
          <div className="searched-image-card">
            <div className="searched-image-preview">
              <img
                src={image}
                alt="Uploaded fashion reference"
              />
            </div>

            <div className="searched-image-info">
              <div className="searched-image-icon">
                <ImageIcon size={18} />
              </div>

              <div>
                <span>REFERENCE IMAGE</span>

                <h2>
                  Your fashion inspiration
                </h2>

                <p>
                  We've searched our collection for
                  styles related to your reference.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS HEADER */}
        <div className="image-results-toolbar">
          <div>
            <span>DISCOVER</span>

            <h2>
              Matching Products
            </h2>
          </div>

          <div className="image-result-count">
            <Search size={15} />
            {products.length}{" "}
            {products.length === 1
              ? "style"
              : "styles"}{" "}
            found
          </div>
        </div>

        {/* PRODUCTS */}
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage="No matching styles found"
        />

        {/* BOTTOM BANNER */}
        {!loading && (
          <div className="image-results-bottom-banner">
            <div className="image-results-banner-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <h3>
                Didn't find your perfect style?
              </h3>

              <p>
                Try uploading another fashion image
                for a fresh search.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={handleNewSearch}
            >
              Upload Another
              <Camera size={16} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default ImageSearchResults;
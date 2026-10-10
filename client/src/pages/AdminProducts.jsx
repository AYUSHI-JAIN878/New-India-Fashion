
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Search,
  Package,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Star,
  Boxes,
} from "lucide-react";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api/products";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(API_URL);
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Products load nahi hue. Backend check karo."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Kya tum "${product.name}" ko permanently delete karna chahte ho?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((current) =>
        current.filter((item) => item._id !== product._id)
      );

      setSuccess("Product successfully delete ho gaya.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Product delete nahi hua. Admin login check karo."
      );
    } finally {
      setDeletingId("");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.subCategory?.toLowerCase().includes(query);

    const matchesFilter =
      filter === "all" ||
      (filter === "featured" && product.featured) ||
      (filter === "out-of-stock" && Number(product.stock) <= 0) ||
      (filter === "in-stock" && Number(product.stock) > 0);

    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "—";

    return Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  return (
    <main className="manage-products-page">
      <header className="manage-products-topbar">
        <Link to="/admin" className="manage-back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <span className="manage-store-label">
          <Package size={16} />
          NEW INDIA FASHION
        </span>
      </header>

      <section className="manage-products-heading">
        <div>
          <p className="manage-eyebrow">STORE MANAGEMENT</p>
          <h1>Manage Products</h1>
          <p className="manage-subtitle">
            Manage your collection, inventory and product listings.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="manage-button manage-button-primary"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </section>

      {error && (
        <div className="manage-alert manage-alert-error">
          <AlertCircle size={19} />
          <span>{error}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="manage-alert manage-alert-success">
          <CheckCircle2 size={19} />
          <span>{success}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setSuccess("")}
          >
            ×
          </button>
        </div>
      )}

      <section className="manage-stats-grid">
        <article className="manage-stat-card">
          <span className="manage-stat-icon">
            <Package size={21} />
          </span>
          <div>
            <p>Total products</p>
            <h2>{products.length}</h2>
          </div>
        </article>

        <article className="manage-stat-card">
          <span className="manage-stat-icon">
            <Boxes size={21} />
          </span>
          <div>
            <p>In stock</p>
            <h2>
              {products.filter((p) => Number(p.stock) > 0).length}
            </h2>
          </div>
        </article>

        <article className="manage-stat-card">
          <span className="manage-stat-icon">
            <Star size={21} />
          </span>
          <div>
            <p>Featured</p>
            <h2>
              {products.filter((p) => p.featured).length}
            </h2>
          </div>
        </article>

        <article className="manage-stat-card">
          <span className="manage-stat-icon">
            <AlertCircle size={21} />
          </span>
          <div>
            <p>Out of stock</p>
            <h2>
              {products.filter((p) => Number(p.stock) <= 0).length}
            </h2>
          </div>
        </article>
      </section>

      <section className="manage-products-panel">
        <div className="manage-panel-heading">
          <div>
            <h2>Product catalogue</h2>
            <p>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

          <button
            type="button"
            className="manage-button manage-button-outline"
            onClick={() => fetchProducts(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "manage-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="manage-toolbar">
          <div className="manage-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search products or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="manage-filter"
            aria-label="Filter products"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All products</option>
            <option value="featured">Featured</option>
            <option value="in-stock">In stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </div>

        {loading ? (
          <div className="manage-loading">
            <span className="manage-spinner" />
            <p>Loading your products...</p>
          </div>
        ) : error && products.length === 0 ? (
          <div className="manage-empty-state">
            <AlertCircle size={34} />
            <h3>Products could not be loaded</h3>
            <p>Backend connection check karke dobara try karo.</p>
            <button
              type="button"
              className="manage-button manage-button-primary"
              onClick={() => fetchProducts()}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="manage-empty-state">
            <span className="manage-empty-icon">
              <ImageIcon size={30} />
            </span>

            <h3>
              {products.length === 0
                ? "Your catalogue is empty"
                : "No matching products"}
            </h3>

            <p>
              {products.length === 0
                ? "Start building your collection by adding your first product."
                : "Try another search term or change the selected filter."}
            </p>

            {products.length === 0 ? (
              <Link
                to="/admin/products/add"
                className="manage-button manage-button-primary"
              >
                <Plus size={17} />
                Add your first product
              </Link>
            ) : (
              <button
                type="button"
                className="manage-button manage-button-outline"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="manage-table-wrap">
            <table className="manage-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const image = product.images?.[0];
                  const outOfStock = Number(product.stock) <= 0;

                  return (
                    <tr key={product._id}>
                      <td>
                        <div className="manage-product-info">
                          <div className="manage-product-image">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name || "Product"}
                                loading="lazy"
                              />
                            ) : (
                              <ImageIcon size={23} />
                            )}
                          </div>

                          <div className="manage-product-copy">
                            <strong>{product.name || "Unnamed product"}</strong>

                            <span>
                              ID: {String(product._id).slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="manage-category-copy">
                          <span>{product.category || "Uncategorised"}</span>
                          {product.subCategory && (
                            <small>{product.subCategory}</small>
                          )}
                        </div>
                      </td>

                      <td>
                        <strong className="manage-price">
                          ₹{formatPrice(product.price)}
                        </strong>

                        {product.originalPrice > product.price && (
                          <small className="manage-original-price">
                            ₹{formatPrice(product.originalPrice)}
                          </small>
                        )}
                      </td>

                      <td>
                        <span
                          className={`manage-stock ${
                            outOfStock
                              ? "manage-stock-low"
                              : "manage-stock-available"
                          }`}
                        >
                          {product.stock ?? 0} units
                        </span>
                      </td>

                      <td>
                        <div className="manage-status-list">
                          <span
                            className={`manage-status ${
                              outOfStock
                                ? "manage-status-out"
                                : "manage-status-active"
                            }`}
                          >
                            {outOfStock ? "Out of stock" : "In stock"}
                          </span>

                          {product.featured && (
                            <span className="manage-featured-tag">
                              <Star size={12} />
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="manage-actions">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="manage-action-button"
                            title="Edit product"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            className="manage-action-button manage-delete-button"
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                            disabled={deletingId === product._id}
                            onClick={() => deleteProduct(product)}
                          >
                            {deletingId === product._id ? (
                              <span className="manage-mini-spinner" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="manage-products-footer">
        <span>New India Fashion</span>
        <span>Product inventory management</span>
      </footer>
    </main>
  );
}

export default AdminProducts;
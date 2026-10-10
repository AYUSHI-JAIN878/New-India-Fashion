
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <span className="brand-mark">N</span>
          <span>
            <strong>NEW INDIA</strong>
            <small>FASHION ADMIN</small>
          </span>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="admin-nav">
          <a href="#overview" className="nav-item active">
            <span>▦</span> Dashboard
          </a>

          <Link to="/admin/products" className="nav-item">
            <span>▤</span> Products
          </Link>

          <Link to="/admin/products/add" className="nav-item">
            <span>＋</span> Add Product
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <div className="store-status">
            <span className="status-dot" />
            <div>
              <strong>Store Panel</strong>
              <small>Management workspace</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" id="overview">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">NEW INDIA FASHION / ADMIN</p>
            <h1>Dashboard</h1>
          </div>

          <Link to="/admin/products/add" className="topbar-button">
            <span>＋</span> Add New Product
          </Link>
        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-tag">YOUR STORE, YOUR STYLE</span>
            <h2>Welcome back, Admin.</h2>
            <p>
              Manage your fashion collection and keep your store
              organized from one place.
            </p>

            <Link to="/admin/products" className="banner-button">
              Explore Products <span>→</span>
            </Link>
          </div>

          <div className="banner-decoration" aria-hidden="true">
            <span className="decoration-circle" />
            <span className="decoration-letter">NIF</span>
            <span className="decoration-caption">
              STYLE · QUALITY · ELEGANCE
            </span>
          </div>
        </section>

        {/* Overview */}
        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Store Overview</h2>
              <p>Your essential management shortcuts</p>
            </div>
            <span className="overview-label">QUICK ACCESS</span>
          </div>

          <div className="dashboard-cards">
            <article className="dashboard-card">
              <div className="card-top">
                <span className="card-icon products-icon">▤</span>
                <span className="card-arrow">↗</span>
              </div>
              <p className="card-label">PRODUCT CATALOG</p>
              <h3>Manage Products</h3>
              <p className="card-description">
                View, edit and organize your collection.
              </p>
              <Link to="/admin/products" className="card-link">
                Open catalog <span>→</span>
              </Link>
            </article>

            <article className="dashboard-card featured-card">
              <div className="card-top">
                <span className="card-icon add-icon">＋</span>
                <span className="card-arrow">↗</span>
              </div>
              <p className="card-label">GROW YOUR COLLECTION</p>
              <h3>Add New Product</h3>
              <p className="card-description">
                Add fashion items to your online store.
              </p>
              <Link to="/admin/products/add" className="card-link">
                Create product <span>→</span>
              </Link>
            </article>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="admin-section quick-section">
          <div className="section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Get things done in fewer clicks</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/products" className="quick-action">
              <span className="quick-action-icon">⌕</span>
              <span>
                <strong>Browse Products</strong>
                <small>Find and manage existing items</small>
              </span>
              <span className="quick-arrow">→</span>
            </Link>

            <Link to="/admin/products/add" className="quick-action">
              <span className="quick-action-icon">＋</span>
              <span>
                <strong>Create a Listing</strong>
                <small>Introduce a new fashion item</small>
              </span>
              <span className="quick-arrow">→</span>
            </Link>
          </div>
        </section>

        <footer className="admin-footer">
          <span>NEW INDIA FASHION</span>
          <span>Admin Workspace</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
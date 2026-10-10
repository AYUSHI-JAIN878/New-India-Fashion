
import {
  Heart,
  Menu,
  ShoppingBag,
  User,
  X,
  Sparkles,
  TrendingUp,
  Home,
  LogIn,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();
  const { items = [] } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin =
    isAuthenticated && user?.role?.toLowerCase() === "admin";

  const cartCount = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <>
      <header className="main-navbar">
        <div className="navbar-container">
          {/* MENU */}
          <button
            type="button"
            className="navbar-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            <span>New India</span>
            <small>Fashion</small>
          </Link>

          {/* SEARCH */}
          <div className="navbar-search">
            <SearchBar />
          </div>

          {/* NAV ACTIONS */}
          <div className="navbar-actions">
            <button
              type="button"
              className="navbar-icon-btn desktop-action"
              onClick={() => navigate("/search?featured=true")}
              title="New Arrivals"
            >
              <Sparkles size={19} />
            </button>

            <button
              type="button"
              className="navbar-icon-btn desktop-action"
              onClick={() => navigate("/search?search=trending")}
              title="Trending"
            >
              <TrendingUp size={19} />
            </button>

            <button
              type="button"
              className="navbar-icon-btn"
              onClick={() => navigate("/wishlist")}
              title="Wishlist"
            >
              <Heart size={19} />
            </button>

            <button
              type="button"
              className="navbar-icon-btn"
              onClick={() => navigate("/cart")}
              title="Cart"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span className="navbar-cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="navbar-account-btn"
              onClick={() =>
                navigate(isAuthenticated ? "/profile" : "/login")
              }
            >
              <User size={18} />
              <span>
                {isAuthenticated ? "My Account" : "Login"}
              </span>
            </button>

            {/* ADMIN PANEL - DESKTOP */}
            {isAdmin && (
              <button
                type="button"
                className="navbar-account-btn"
                onClick={() => navigate("/admin")}
                title="Admin Panel"
              >
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
        />
      )}

      {/* DRAWER */}
      <aside className={`menu-drawer ${menuOpen ? "open" : ""}`}>
        {/* DRAWER HEADER */}
        <div className="menu-drawer-header">
          <Link
            to="/"
            className="drawer-logo"
            onClick={closeMenu}
          >
            <span>New India</span>
            <small>Fashion</small>
          </Link>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* QUICK LINKS */}
        <div className="drawer-section">
          <p className="drawer-title">Discover</p>

          <Link
            to="/"
            className="drawer-link"
            onClick={closeMenu}
          >
            <Home size={17} />
            <span>Home</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/search?featured=true"
            className="drawer-link"
            onClick={closeMenu}
          >
            <Sparkles size={17} />
            <span>New Arrivals</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/search?search=trending"
            className="drawer-link"
            onClick={closeMenu}
          >
            <TrendingUp size={17} />
            <span>Trending</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* CATEGORIES */}
        <div className="drawer-section">
          <p className="drawer-title">Shop Categories</p>

          <Link
            to="/category/Suits"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span>👗</span>
            <span>Ladies Suits</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/category/Gowns"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span>✨</span>
            <span>Gowns</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/category/Tops"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span>👚</span>
            <span>Crop Tops</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/category/Indo-Western"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span>🧥</span>
            <span>Indo-Western</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/category/Bottomwear"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span>👖</span>
            <span>Palazzo</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* ACCOUNT */}
        <div className="drawer-section">
          <p className="drawer-title">My Account</p>

          {/* ADMIN PANEL - MOBILE MENU */}
          {isAdmin && (
            <Link
              to="/admin"
              className="drawer-link"
              onClick={closeMenu}
            >
              <ShieldCheck size={17} />
              <span>Admin Panel</span>
              <ChevronRight size={14} />
            </Link>
          )}

          <Link
            to="/wishlist"
            className="drawer-link"
            onClick={closeMenu}
          >
            <Heart size={17} />
            <span>Wishlist</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to="/cart"
            className="drawer-link"
            onClick={closeMenu}
          >
            <ShoppingBag size={17} />
            <span>Shopping Bag</span>
            <ChevronRight size={14} />
          </Link>

          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="drawer-link"
            onClick={closeMenu}
          >
            <User size={17} />
            <span>
              {isAuthenticated ? "My Profile" : "Login"}
            </span>
            <ChevronRight size={14} />
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              className="drawer-link drawer-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              <span>Logout</span>
              <ChevronRight size={14} />
            </button>
          )}

          {!isAuthenticated && (
            <Link
              to="/signup"
              className="drawer-link"
              onClick={closeMenu}
            >
              <LogIn size={17} />
              <span>Create Account</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* FOOTER */}
        <div className="drawer-bottom">
          <p>New India Fashion</p>
          <span>Style • Elegance • You</span>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
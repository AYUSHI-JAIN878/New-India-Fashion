import {
  Heart,
  Home,
  LogIn,
  LogOut,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  User,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();

  const categories = [
    {
      name: "Ladies Suits",
      path: "/category/Suits",
    },
    {
      name: "Gowns",
      path: "/category/Gowns",
    },
    {
      name: "Crop Tops",
      path: "/category/Tops",
    },
    {
      name: "Indo-Western",
      path: "/category/Indo-Western",
    },
    {
      name: "Palazzo",
      path: "/category/Bottomwear",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose?.();
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>

      <div className="sidebar-section">
        <div className="sidebar-title">
          SHOP
        </div>

        <Link
          to="/"
          onClick={onClose}
          className="sidebar-link"
        >
          <Home size={17} />
          Home
        </Link>

        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            onClick={onClose}
            className={`sidebar-link ${
              location.pathname
                .toLowerCase()
                .includes(
                  category.path
                    .split("/")
                    .pop()
                    .toLowerCase()
                )
                ? "active"
                : ""
            }`}
          >
            <Tag size={17} />
            {category.name}
          </Link>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-title">
          DISCOVER
        </div>

        <Link
          to="/search?featured=true"
          onClick={onClose}
          className="sidebar-link"
        >
          <Sparkles size={17} />
          New Arrivals
        </Link>

        <Link
          to="/search"
          onClick={onClose}
          className="sidebar-link"
        >
          <Star size={17} />
          Trending
        </Link>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-title">
          MY ACCOUNT
        </div>

        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              onClick={onClose}
              className="sidebar-link"
            >
              <User size={17} />
              Profile
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="sidebar-link"
            >
              <Heart size={17} />
              Wishlist
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              className="sidebar-link"
            >
              <ShoppingBag size={17} />
              Shopping Bag
            </Link>

            <button
              className="sidebar-link"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="sidebar-link"
          >
            <LogIn size={17} />
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
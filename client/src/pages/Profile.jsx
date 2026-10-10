import {
  Heart,
  LogOut,
  Package,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  /* =========================
     GUEST
  ========================= */

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-guest">

          <div className="profile-guest-icon">
            <User size={42} />
          </div>

          <span className="section-eyebrow">
            MY ACCOUNT
          </span>

          <h2>
            Welcome to New India Fashion
          </h2>

          <p>
            Login to access your account,
            orders and wishlist.
          </p>

          <Link
            to="/login"
            className="primary-btn"
          >
            Login
          </Link>

        </div>
      </section>
    );
  }

  /* =========================
     USER
  ========================= */

  const userName =
    user.name?.trim() || "Fashion Lover";

  const userEmail =
    user.email || "Email unavailable";

  const avatarLetter =
    userName.charAt(0).toUpperCase();

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <section className="profile-page">

      <div className="profile-container">

        {/* HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">
            {avatarLetter}
          </div>

          <div className="profile-header-info">
            <span>MY ACCOUNT</span>

            <h1>{userName}</h1>

            <p>{userEmail}</p>
          </div>

        </div>

        {/* ACCOUNT OPTIONS */}
        <div className="profile-grid">

          {/* ORDERS */}
          <Link
            to="/orders"
            className="profile-card"
          >
            <div className="profile-card-icon">
              <Package size={24} />
            </div>

            <div>
              <h3>My Orders</h3>

              <p>
                View your order history
              </p>
            </div>
          </Link>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="profile-card"
          >
            <div className="profile-card-icon">
              <Heart size={24} />
            </div>

            <div>
              <h3>Wishlist</h3>

              <p>
                View your saved products
              </p>
            </div>
          </Link>

          {/* LOGOUT */}
          <button
            type="button"
            className="profile-card logout-card"
            onClick={handleLogout}
          >
            <div className="profile-card-icon">
              <LogOut size={24} />
            </div>

            <div>
              <h3>Logout</h3>

              <p>
                Sign out of your account
              </p>
            </div>
          </button>

        </div>

        {/* ACCOUNT FOOTER */}
        <div className="profile-footer">
          <ShoppingBagIcon />

          <p>
            Thank you for shopping with{" "}
            <strong>New India Fashion</strong>.
          </p>
        </div>

      </div>

    </section>
  );
}

/* Small decorative icon without adding another dependency */
function ShoppingBagIcon() {
  return (
    <div className="profile-footer-mark">
      <span>NIF</span>
    </div>
  );
}

export default Profile;
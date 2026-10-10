import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import CartItem from "../components/CartItem";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { items, loading, totalAmount } = useCart();

  if (!isAuthenticated) {
    return (
      <section className="cart-page">
        <div className="cart-login-state">
          <ShoppingBag size={48} strokeWidth={1.3} />

          <h1>Your Shopping Bag</h1>

          <p>
            Please login to view and manage your shopping bag.
          </p>

          <button onClick={() => navigate("/login")}>
            Login to Continue
          </button>
        </div>
      </section>
    );
  }

  if (loading && !items.length) {
    return (
      <section className="cart-page">
        <Loading />
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="cart-page">
        <div className="cart-empty-state">
          <div className="cart-empty-icon">
            <ShoppingBag size={42} strokeWidth={1.2} />
          </div>

          <h1>Your bag is empty</h1>

          <p>
            Looks like you haven't added anything to your bag yet.
          </p>

          <Link to="/">
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <span className="section-eyebrow">YOUR BAG</span>
            <h1>Shopping Bag</h1>
          </div>

          <span className="cart-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-text">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
              <ArrowRight size={17} />
            </button>

            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;
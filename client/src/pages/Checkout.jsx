import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth();

  const {
    items,
    totalAmount,
    itemCount,
  } = useCart();

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!isAuthenticated) {
    return (
      <section className="checkout-page">
        <div className="container">
          <div className="checkout-login-message">
            <ShoppingBag size={42} />

            <h2>Please login to continue</h2>

            <p>
              You need to login before placing your order.
            </p>

            <Link to="/login" className="primary-btn">
              Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!items?.length) {
    return (
      <section className="checkout-page">
        <div className="container">
          <div className="checkout-login-message">
            <ShoppingBag size={42} />

            <h2>Your shopping bag is empty</h2>

            <p>
              Add some beautiful styles before proceeding
              to checkout.
            </p>

            <Link
              to="/category/Suits"
              className="primary-btn"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const shipping = totalAmount >= 1999 ? 0 : 99;
  const finalTotal = totalAmount + shipping;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(address.phone.trim())) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(address.pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    navigate("/payment", {
      state: {
        address,
        paymentMethod,
        items,
        subtotal: totalAmount,
        shipping,
        total: finalTotal,
      },
    });
  };

  return (
    <section className="checkout-page">
      <div className="container">

        {/* HEADER */}
        <div className="checkout-header">
          <div>
            <Link
              to="/cart"
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back to Bag
            </Link>

            <h1>Checkout</h1>

            <p>
              Complete your details and place your order.
            </p>
          </div>

          <div className="checkout-secure">
            <CheckCircle2 size={17} />
            Secure Checkout
          </div>
        </div>

        {/* STEPS */}
        <div className="checkout-steps">
          <div className="checkout-step active">
            <span>1</span>
            Delivery
          </div>

          <div className="checkout-step-line" />

          <div className="checkout-step">
            <span>2</span>
            Payment
          </div>

          <div className="checkout-step-line" />

          <div className="checkout-step">
            <span>3</span>
            Confirmation
          </div>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleContinue}
        >

          {/* LEFT */}
          <div className="checkout-main">

            {/* DELIVERY ADDRESS */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-card-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="checkout-form-grid">

                <div className="checkout-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div className="checkout-field full">
                  <label>Address</label>

                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="House no., street, area"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    inputMode="numeric"
                    required
                  />
                </div>

              </div>
            </div>

            {/* DELIVERY INFORMATION */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-card-icon">
                  <Truck size={18} />
                </div>

                <div>
                  <h2>Delivery Information</h2>

                  <p>
                    Estimated delivery within 4–7 business days.
                  </p>
                </div>
              </div>

              <div className="delivery-info-box">
                <Truck size={20} />

                <div>
                  <strong>Standard Delivery</strong>

                  <span>
                    Free delivery on orders above ₹1,999
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-card-icon">
                  <CreditCard size={18} />
                </div>

                <div>
                  <h2>Payment Method</h2>

                  <p>
                    Choose how you'd like to pay.
                  </p>
                </div>
              </div>

              <div className="payment-options">

                {/* COD */}
                <label
                  className={`payment-option ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div className="payment-option-content">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives.
                    </span>
                  </div>
                </label>

                {/* ONLINE */}
                <label
                  className={`payment-option ${
                    paymentMethod === "online"
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div className="payment-option-content">
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Secure payment through Razorpay.
                    </span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT */}
          <aside className="checkout-summary">

            <div className="checkout-summary-card">

              <div className="summary-title">
                <div>
                  <span>YOUR ORDER</span>

                  <h2>Order Summary</h2>
                </div>

                <span className="summary-count">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* CART ITEMS */}
              <div className="checkout-items">

                {items.map((item) => {
                  const product = item.product;

                  if (!product) return null;

                  return (
                    <div
                      className="checkout-item"
                      key={item._id}
                    >
                      <div className="checkout-item-image">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                          />
                        ) : (
                          <span>NIF</span>
                        )}
                      </div>

                      <div className="checkout-item-info">
                        <h3>{product.name}</h3>

                        <span>
                          Qty: {item.quantity}
                        </span>

                        {item.size && (
                          <span>
                            Size: {item.size}
                          </span>
                        )}

                        {item.color && (
                          <span>
                            Color: {item.color}
                          </span>
                        )}

                        <strong>
                          ₹
                          {(
                            product.price *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  );
                })}

              </div>

              <div className="summary-divider" />

              {/* SUBTOTAL */}
              <div className="summary-row">
                <span>Subtotal</span>

                <strong>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              {/* SHIPPING */}
              <div className="summary-row">
                <span>Delivery</span>

                <strong>
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping}`}
                </strong>
              </div>

              <div className="summary-divider" />

              {/* TOTAL */}
              <div className="summary-total">
                <span>Total</span>

                <strong>
                  ₹{finalTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              {/* CONTINUE */}
              <button
                type="submit"
                className="primary-btn checkout-continue-btn"
              >
                Continue to Payment
                <ArrowUpRightIcon />
              </button>

              <p className="checkout-note">
                By continuing, you agree to our
                terms and conditions.
              </p>

            </div>

          </aside>

        </form>
      </div>
    </section>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export default Checkout;
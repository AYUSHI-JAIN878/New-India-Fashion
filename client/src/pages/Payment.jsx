import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import api from "../services/api";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const checkoutData = location.state || {};

  const {
    address = {},
    paymentMethod = "cod",
    items = [],
    subtotal = 0,
    shipping = 0,
    total = 0,
  } = checkoutData;

  const [method, setMethod] = useState(paymentMethod);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!items.length) {
      setError(
        "Your order items are missing. Please go back to checkout."
      );
      return;
    }

    if (!address?.name || !address?.phone) {
      setError(
        "Delivery details are missing. Please go back to checkout."
      );
      return;
    }

    try {
      setProcessing(true);
      setError("");

      /*
       * Currently both COD and online payment
       * create the order through the orders API.
       *
       * Razorpay integration can be connected here
       * once the payment service is configured.
       */
      const orderData = {
        items,
        shippingAddress: address,
        paymentMethod: method,
        subtotal: Number(subtotal),
        shippingPrice: Number(shipping),
        totalAmount: Number(total),
      };

      const response = await api.post(
        "/orders",
        orderData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to place your order."
        );
      }

      const createdOrder = response.data.order;

      await clearCart();

      navigate("/order-success", {
        replace: true,
        state: {
          order: createdOrder,
          orderId:
            createdOrder?.orderId ||
            createdOrder?._id,
          total:
            createdOrder?.totalAmount ||
            total,
        },
      });
    } catch (err) {
      console.error("Payment error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="payment-page">
      <div className="payment-container">

        {/* BACK */}
        <Link
          to="/checkout"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back to Checkout
        </Link>

        {/* HEADER */}
        <div className="payment-heading">
          <span className="section-eyebrow">
            ALMOST THERE
          </span>

          <h1>Complete Your Order</h1>

          <p>
            Choose your preferred payment method
            and place your order.
          </p>
        </div>

        <div className="payment-layout">

          {/* LEFT */}
          <div className="payment-main">

            {/* PAYMENT METHOD */}
            <div className="payment-card">

              <div className="payment-card-heading">
                <div className="payment-icon">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2>Payment Method</h2>
                  <p>
                    Select how you would like to pay.
                  </p>
                </div>
              </div>

              <div className="payment-options">

                {/* COD */}
                <button
                  type="button"
                  className={`payment-option ${
                    method === "cod"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setMethod("cod")
                  }
                  disabled={processing}
                >
                  <div className="payment-radio">
                    {method === "cod" && (
                      <span />
                    )}
                  </div>

                  <div className="payment-option-icon">
                    <Truck size={21} />
                  </div>

                  <div className="payment-option-content">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives.
                    </span>
                  </div>

                  {method === "cod" && (
                    <CheckCircle2
                      className="payment-check"
                      size={20}
                    />
                  )}
                </button>

                {/* ONLINE */}
                <button
                  type="button"
                  className={`payment-option ${
                    method === "online"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setMethod("online")
                  }
                  disabled={processing}
                >
                  <div className="payment-radio">
                    {method === "online" && (
                      <span />
                    )}
                  </div>

                  <div className="payment-option-icon">
                    <CreditCard size={21} />
                  </div>

                  <div className="payment-option-content">
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Pay securely using Razorpay.
                    </span>
                  </div>

                  {method === "online" && (
                    <CheckCircle2
                      className="payment-check"
                      size={20}
                    />
                  )}
                </button>

              </div>
            </div>

            {/* ADDRESS */}
            <div className="payment-card">

              <div className="payment-card-heading">
                <div className="payment-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Your order will be delivered here.
                  </p>
                </div>
              </div>

              <div className="payment-address">

                <strong>
                  {address.name ||
                    address.fullName ||
                    "Customer"}
                </strong>

                {address.street && (
                  <span>
                    {address.street}
                  </span>
                )}

                <span>
                  {address.city &&
                    `${address.city}, `}

                  {address.state &&
                    address.state}

                  {address.pincode &&
                    ` - ${address.pincode}`}
                </span>

                {address.phone && (
                  <span>
                    Phone: {address.phone}
                  </span>
                )}

              </div>

            </div>

            {/* SECURITY */}
            <div className="payment-security">
              <Lock size={18} />

              <div>
                <strong>
                  Safe & Secure Checkout
                </strong>

                <p>
                  Your order details are securely
                  processed.
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="payment-error">
                {error}
              </div>
            )}

            {/* PLACE ORDER */}
            <button
              type="button"
              className="place-order-btn"
              onClick={handlePayment}
              disabled={processing || !items.length}
            >
              {processing ? (
                "Placing Order..."
              ) : (
                <>
                  <ShoppingBag size={18} />

                  Place Order • ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </>
              )}
            </button>

          </div>

          {/* RIGHT */}
          <aside className="payment-summary">

            <div className="summary-header">
              <ShoppingBag size={19} />

              <h2>Order Summary</h2>
            </div>

            <div className="summary-row">
              <span>Items</span>

              <strong>
                {items.reduce(
                  (count, item) =>
                    count +
                    (item.quantity || 1),
                  0
                )}
              </strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                ₹
                {Number(subtotal).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <strong>
                {Number(shipping) === 0
                  ? "FREE"
                  : `₹${Number(
                      shipping
                    ).toLocaleString("en-IN")}`}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹
                {Number(total).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="summary-note">
              <CheckCircle2 size={17} />

              <span>
                Free delivery on eligible orders
              </span>
            </div>

          </aside>

        </div>
      </div>
    </section>
  );
}

export default Payment;
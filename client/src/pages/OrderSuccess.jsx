import {
  ArrowRight,
  Check,
  CheckCircle2,
  Package,
  ShoppingBag,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order || null;

  const orderId =
    location.state?.orderId ||
    order?.orderId ||
    order?._id ||
    "NIF-ORDER";

  const total =
    location.state?.total ||
    order?.totalAmount ||
    order?.totalPrice ||
    order?.total ||
    0;

  const formattedTotal = Number(total || 0).toLocaleString(
    "en-IN"
  );

  return (
    <section className="order-success-page">
      <div className="container">

        <div className="order-success-wrapper">

          {/* SUCCESS ICON */}
          <div className="order-success-icon">
            <Check size={32} />
          </div>

          <span className="order-success-label">
            ORDER CONFIRMED
          </span>

          <h1>
            Thank you for
            <br />
            shopping with us!
          </h1>

          <p className="order-success-description">
            Your order has been placed successfully.
            We'll keep you updated about your delivery.
          </p>

          {/* ORDER CARD */}
          <div className="order-success-card">

            <div className="order-success-card-header">
              <div>
                <span>ORDER DETAILS</span>

                <h2>
                  Your order is confirmed
                </h2>
              </div>

              <CheckCircle2 size={22} />
            </div>

            {/* ORDER DETAILS */}
            <div className="order-success-details">

              <div className="success-detail">
                <div className="success-detail-icon">
                  <Package size={17} />
                </div>

                <div>
                  <span>Order ID</span>

                  <strong>
                    #{orderId}
                  </strong>
                </div>
              </div>

              <div className="success-detail">
                <div className="success-detail-icon">
                  <ShoppingBag size={17} />
                </div>

                <div>
                  <span>Order Total</span>

                  <strong>
                    ₹{formattedTotal}
                  </strong>
                </div>
              </div>

            </div>

            {/* ORDER ITEMS */}
            {order?.items?.length > 0 && (
              <div className="order-success-products">

                <div className="success-products-heading">
                  <span>YOUR ITEMS</span>
                  <strong>
                    {order.items.reduce(
                      (total, item) =>
                        total + (item.quantity || 1),
                      0
                    )}{" "}
                    {order.items.reduce(
                      (total, item) =>
                        total + (item.quantity || 1),
                      0
                    ) === 1
                      ? "Item"
                      : "Items"}
                  </strong>
                </div>

                <div className="success-products-list">
                  {order.items.slice(0, 3).map(
                    (item, index) => {
                      const product =
                        item.product || item;

                      return (
                        <div
                          className="success-product"
                          key={
                            item._id ||
                            product._id ||
                            index
                          }
                        >
                          <div className="success-product-image">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={
                                  product.name ||
                                  "Product"
                                }
                              />
                            ) : (
                              <ShoppingBag size={18} />
                            )}
                          </div>

                          <div className="success-product-info">
                            <strong>
                              {product.name ||
                                "Fashion Item"}
                            </strong>

                            <span>
                              Qty:{" "}
                              {item.quantity || 1}
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
                          </div>
                        </div>
                      );
                    }
                  )}

                  {order.items.length > 3 && (
                    <span className="success-more-items">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

              </div>
            )}

            {/* TIMELINE */}
            <div className="success-timeline">

              <div className="success-timeline-item active">
                <div className="success-timeline-dot">
                  <Check size={12} />
                </div>

                <div>
                  <strong>
                    Order Confirmed
                  </strong>

                  <span>
                    Your order has been received.
                  </span>
                </div>
              </div>

              <div className="success-timeline-line" />

              <div className="success-timeline-item">
                <div className="success-timeline-dot">
                  2
                </div>

                <div>
                  <strong>Preparing</strong>

                  <span>
                    We'll prepare your fashion
                    pieces.
                  </span>
                </div>
              </div>

              <div className="success-timeline-line" />

              <div className="success-timeline-item">
                <div className="success-timeline-dot">
                  3
                </div>

                <div>
                  <strong>Delivered</strong>

                  <span>
                    Your order will reach you soon.
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="order-success-actions">

            <Link
              to="/orders"
              className="primary-btn"
            >
              View My Orders
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="secondary-btn"
            >
              Continue Shopping
              <ShoppingBag size={16} />
            </Link>

          </div>

          <p className="order-success-footer-text">
            Thank you for choosing{" "}
            <strong>New India Fashion</strong>.
          </p>

        </div>

      </div>
    </section>
  );
}

export default OrderSuccess;
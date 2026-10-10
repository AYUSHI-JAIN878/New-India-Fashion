import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

import api from "../services/api";
import Loading from "../components/Loading";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders(response.data || []);
      }
    } catch (err) {
      console.error("Orders error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your orders right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (value === "delivered") {
      return "status-delivered";
    }

    if (value === "cancelled") {
      return "status-cancelled";
    }

    if (value === "shipped") {
      return "status-shipped";
    }

    return "status-pending";
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTotalItems = (items = []) => {
    return items.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
  };

  const getOrderTotal = (order) => {
    return Number(
      order.totalAmount ||
        order.totalPrice ||
        order.total ||
        0
    );
  };

  const handleViewOrder = (order) => {
    navigate("/order-success", {
      state: {
        orderId: order.orderId || order._id,
        order,
      },
    });
  };

  if (loading) {
    return (
      <section className="orders-page">
        <Loading />
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-container">

        {/* BACK */}
        <Link to="/" className="back-link">
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>

        {/* HEADER */}
        <div className="orders-heading">
          <div>
            <span className="section-eyebrow">
              YOUR SHOPPING JOURNEY
            </span>

            <h1>My Orders</h1>

            <p>
              Track your recent purchases from
              New India Fashion.
            </p>
          </div>

          <div className="orders-count">
            <Package size={19} />
            <span>
              {orders.length}{" "}
              {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="orders-error">
            <Package size={20} />

            <div>
              <strong>
                Couldn't load orders
              </strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <ShoppingBag size={34} />
            </div>

            <h2>No orders yet</h2>

            <p>
              Your beautiful fashion finds will
              appear here once you place your
              first order.
            </p>

            <Link
              to="/"
              className="primary-btn"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* ORDERS */}
        {!error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => {
              const totalItems = getTotalItems(
                order.items
              );

              const totalAmount =
                getOrderTotal(order);

              const status =
                order.status || "Processing";

              return (
                <article
                  className="order-card"
                  key={
                    order._id ||
                    order.id ||
                    order.orderId
                  }
                >
                  {/* TOP */}
                  <div className="order-card-top">

                    <div>
                      <span className="order-label">
                        Order ID
                      </span>

                      <h3>
                        #
                        {order.orderId ||
                          order._id?.slice(-8) ||
                          "N/A"}
                      </h3>
                    </div>

                    <div
                      className={`order-status ${getStatusClass(
                        status
                      )}`}
                    >
                      {status.toLowerCase() ===
                      "delivered" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}

                      {status}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="order-info-row">

                    <div>
                      <span className="order-label">
                        Placed On
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span className="order-label">
                        Items
                      </span>

                      <strong>
                        {totalItems}{" "}
                        {totalItems === 1
                          ? "Item"
                          : "Items"}
                      </strong>
                    </div>

                    <div>
                      <span className="order-label">
                        Total
                      </span>

                      <strong>
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* PRODUCTS */}
                  {order.items?.length > 0 && (
                    <div className="order-products">

                      {order.items
                        .slice(0, 3)
                        .map((item, index) => {
                          const product =
                            item.product || item;

                          return (
                            <div
                              className="order-product"
                              key={
                                item._id ||
                                product._id ||
                                `${order._id}-${index}`
                              }
                            >
                              <div className="order-product-image">

                                {product.images?.[0] ? (
                                  <img
                                    src={
                                      product.images[0]
                                    }
                                    alt={
                                      product.name ||
                                      "Product"
                                    }
                                  />
                                ) : (
                                  <ShoppingBag
                                    size={20}
                                  />
                                )}

                              </div>

                              <div className="order-product-info">

                                <strong>
                                  {product.name ||
                                    "Fashion Item"}
                                </strong>

                                <span>
                                  Qty:{" "}
                                  {item.quantity ||
                                    1}
                                </span>

                                {item.size && (
                                  <span>
                                    Size:{" "}
                                    {item.size}
                                  </span>
                                )}

                                {item.color && (
                                  <span>
                                    Color:{" "}
                                    {item.color}
                                  </span>
                                )}

                              </div>
                            </div>
                          );
                        })}

                      {order.items.length > 3 && (
                        <div className="more-items">
                          +
                          {order.items.length - 3}{" "}
                          more
                        </div>
                      )}

                    </div>
                  )}

                  {/* BOTTOM */}
                  <div className="order-card-bottom">

                    <div className="order-delivery">
                      <span>Delivery</span>

                      <strong>
                        {status.toLowerCase() ===
                        "delivered"
                          ? "Delivered successfully"
                          : status.toLowerCase() ===
                            "cancelled"
                          ? "Order cancelled"
                          : "Your order is being processed"}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="order-view-btn"
                      onClick={() =>
                        handleViewOrder(order)
                      }
                    >
                      View Order
                    </button>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default Orders;
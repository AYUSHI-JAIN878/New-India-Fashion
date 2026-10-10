import api from "./api";

/* =========================
   CREATE ORDER
========================= */

export const createOrder = async (orderData) => {
  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};

/* =========================
   GET MY ORDERS
========================= */

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders"
  );

  return response.data;
};

/* =========================
   GET SINGLE ORDER
========================= */

export const getOrderById = async (orderId) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};

/* =========================
   CANCEL ORDER
========================= */

export const cancelOrder = async (orderId) => {
  const response = await api.put(
    `/orders/${orderId}/cancel`
  );

  return response.data;
};
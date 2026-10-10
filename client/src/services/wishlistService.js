import api from "./api";

/* =========================
   GET WISHLIST
========================= */

export const getWishlist = async () => {
  const response = await api.get(
    "/wishlist"
  );

  return response.data;
};

/* =========================
   ADD TO WISHLIST
========================= */

export const addToWishlist = async (
  productId
) => {
  const response = await api.post(
    "/wishlist",
    {
      productId,
    }
  );

  return response.data;
};

/* =========================
   REMOVE FROM WISHLIST
========================= */

export const removeFromWishlist = async (
  productId
) => {
  const response = await api.delete(
    `/wishlist/${productId}`
  );

  return response.data;
};
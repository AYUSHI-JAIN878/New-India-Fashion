import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Fetch cart error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading]);

  const addToCart = async ({
    productId,
    quantity = 1,
    size = "",
    color = "",
  }) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Please login to add products to cart",
      };
    }

    try {
      setLoading(true);

      const response = await api.post("/cart", {
        productId,
        quantity,
        size,
        color,
      });

      if (response.data.success) {
        setCart(response.data.cart);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data?.message || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Unable to add product to cart",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity,
      });

      if (response.data.success) {
        setCart(response.data.cart);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Update cart error:",
        error.response?.data?.message || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Unable to update cart",
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);

      if (response.data.success) {
        setCart(response.data.cart);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error.response?.data?.message || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Unable to remove item",
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete("/cart");

      if (response.data.success) {
        setCart(response.data.cart);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Clear cart error:",
        error.response?.data?.message || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Unable to clear cart",
      };
    }
  };

  const items = cart?.items || [];

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        itemCount,
        totalAmount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
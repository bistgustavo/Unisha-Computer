import api from "./api";

const getOrCreateCart = async () => {
  try {
    const response = await api.post("/cart");
    return response.data.data;
  } catch (error) {
    console.error("Error getting cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get cart");
  }
};

const addItemToCart = async (cartId, productId, quantity = 1) => {
  try {
    const response = await api.post("/cart/items", {
      cartId,
      productId,
      quantity,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error adding to cart:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};

const removeItemFromCart = async (cartId, cartItemId) => {
  try {
    const response = await api.delete(`/cart/${cartId}/items/${cartItemId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error removing from cart:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to remove from cart"
    );
  }
};

const mergeCarts = async () => {
  try {
    // Add a small delay to ensure auth cookies are set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await api.post("/cart/merge");
    return response.data.data;
  } catch (error) {
    console.error("Error merging carts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to merge carts");
  }
};

const getCart = async (cartId) => {
  try {
    const response = await api.get(`/cart/${cartId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get cart");
  }
};

const getCurrentUserCart = async () => {
  try {
    const response = await api.get("/cart/current");
    return response.data.data;
  } catch (error) {
    console.error("Error getting current user cart:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get current user cart");
  }
};

export {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  mergeCarts,
  getCart,
  getCurrentUserCart,
};

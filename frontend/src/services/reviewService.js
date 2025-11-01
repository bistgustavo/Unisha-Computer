import api from "./api.js";

// Get product rating summary
export const getProductRatingSummary = async (productId) => {
  try {
    const response = await api.get(`/review/product/${productId}/summary`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product rating summary:", error);
    throw error;
  }
};

// Get reviews for a product
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/review?product_id=${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

// Create a new review
export const createReview = async (reviewData) => {
  try {
    const response = await api.post("/review", reviewData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/review/${reviewId}`, reviewData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/review/${reviewId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

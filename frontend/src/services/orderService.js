import api from './api.js';

// Order API calls
export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/order/createOrder', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/order/getOrder/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/order/getUserOrders');
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('Order service error:', error);
      // If it's an axios error, extract the message properly
      if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
        throw new Error(errorMsg);
      } else if (error.request) {
        // Network error
        throw new Error('Network error - unable to connect to server');
      } else {
        // Something else
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await api.get(`/order/getAllOrders?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/order/updateOrderStatus/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default orderService;

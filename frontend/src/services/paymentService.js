import api from './api.js';

// Payment API calls
export const paymentService = {
  // Update payment status
  updatePaymentStatus: async (paymentId, status, transactionId = null) => {
    try {
      const response = await api.patch(`/payment/updateStatus/${paymentId}`, {
        status,
        transactionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payment/getPayment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's payments
  getUserPayments: async () => {
    try {
      const response = await api.get('/payment/getUserPayments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Get all payments
  getAllPayments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await api.get(`/payment/getAllPayments?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;

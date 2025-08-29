import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import orderService from "../../services/orderService.js";
import toast from 'react-hot-toast';

function Order() {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAllOrders({ status: statusFilter });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Monitor and manage all customer orders</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchOrders}
              className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">There are no orders matching your current filter.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        className="w-12 h-12 object-cover rounded-md"
                        src={assets.box_icon}
                        alt="Order"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.order_id?.slice(-8)}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items?.map((item, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {item.product?.name} <span className="text-indigo-600 font-medium">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-700 mb-2">Customer:</h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{order.user?.first_name} {order.user?.last_name}</p>
                      <p>{order.address?.street}, {order.address?.city}</p>
                      <p>{order.address?.state}, {order.address?.zipcode}</p>
                      <p>{order.address?.country}</p>
                      <p className="font-medium">{order.address?.phone}</p>
                    </div>
                  </div>

                  {/* Order Details & Actions */}
                  <div className="flex-1 lg:text-right">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">{currency}{order.total_amount}</p>
                      <p className="text-sm text-gray-500">Payment: {order.payment?.method}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          getStatusColor(order.status)
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.order_id, 'processing')}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Process Order
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.order_id, 'shipped')}
                            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 transition-colors"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.order_id, 'completed')}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                          >
                            Mark as Completed
                          </button>
                        )}
                        <button
                          onClick={() => updateOrderStatus(order.order_id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;

import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import orderService from "../../services/orderService.js";
import toast from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";

function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders...');
      const response = await orderService.getUserOrders();
      console.log('Order API response:', response);
      setMyOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="m-16 pb-16">
        <div className="flex flex-col items-end w-max mb-8">
          <p className="text-2xl font-medium uppercase">My Orders</p>
          <div className="w-16 h-0.5 bg-indigo-700 rounded-full"></div>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-16 pb-16">
        <div className="flex flex-col items-end w-max mb-8">
          <p className="text-2xl font-medium uppercase">My Orders</p>
          <div className="w-16 h-0.5 bg-indigo-700 rounded-full"></div>
        </div>
        <div className="text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchMyOrders}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-indigo-700 rounded-full"></div>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="text-gray-400 text-4xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        myOrders &&
        myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>Order Id: {order.order_id}</span>
              <span>Payment Type: {order.payment?.method || 'Cash on Delivery'}</span>
              <span>
                Total Amount: {currency}
                {order.total_amount}
              </span>
            </p>
            {/* // I think here i have to use the orderItems .map  */}
            {order.items.map((item, index) => (
              <div
                key={index}
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== index + 1 && "border-b"
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4x1`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-indigo-600/10 p-4 rounded-lg">
                    <img
                      src={item.product.image_url1 || '/api/placeholder/64/64'}
                      alt="product image"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {item.product.name}
                    </h2>
                    <p>Category : {item.product.category?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="text-primary text-lg font-medium">
                  <p>Quantity : {item.quantity || "1"}</p>
                  <p>Order Status : {order.status}</p>
                  <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <p className="text-primary text-lg font-medium">
                  Amount : {currency} {Number(item.price_at_purchase) * item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;

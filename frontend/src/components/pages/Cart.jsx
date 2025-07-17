import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  getCart,
  getCurrentUserCart,
} from "../../services/cartService";
import toast from "react-hot-toast";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(null);
  const [address, setAddress] = useState([]);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [error, setError] = useState(null);

  const { api, currency, navigate, user, refreshCart } = useAppContext();
  const shipping_charge = 150;

  const fetchCart = async () => {
    try {
      setLoading(true);

      // If user is authenticated, use getCurrentUserCart
      if (user) {
        try {
          const result = await getCurrentUserCart();
          setCart(result);
          if (result && result.cart_id) {
            localStorage.setItem("CartId", result.cart_id);
          }
          return;
        } catch (err) {
          console.error("Error fetching user cart:", err);
          // If user cart fetch fails, try to create a new cart
          try {
            const newCart = await getOrCreateCart();
            if (newCart && newCart.cart_id) {
              localStorage.setItem("CartId", newCart.cart_id);
              setCart(newCart);
            }
            return;
          } catch (createError) {
            console.error("Error creating new cart:", createError);
            toast.error("Failed to load cart");
            return;
          }
        }
      }

      // For guest users, use the existing cart ID logic
      const cartId = localStorage.getItem("CartId");
      if (!cartId) {
        setCart(null);
        return;
      }

      const result = await getCart(cartId);
      setCart(result);
    } catch (err) {
      console.error("Error fetching cart:", err);
      // If cart fetch fails, try to create a new cart
      try {
        const newCart = await getOrCreateCart();
        if (newCart && newCart.cart_id) {
          localStorage.setItem("CartId", newCart.cart_id);
          setCart(newCart);
        }
      } catch (createError) {
        console.error("Error creating new cart:", createError);
        toast.error("Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Refresh cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  const getCartCount = () =>
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const getCartAmount = () =>
    cart?.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ) || 0;

  const updateItemQuantity = async (cartItemId, newQuantity) => {
    try {
      const cartId = localStorage.getItem("CartId");
      const cartItem = cart.items.find(
        (item) => item.cart_item_id === cartItemId
      );

      await removeItemFromCart(cartId, cartItemId);

      if (newQuantity > 0) {
        await addItemToCart(cartId, cartItem.product.product_id, newQuantity);
      }

      await fetchCart();
      await refreshCart();
      toast.success("Item added!");
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const cartId = localStorage.getItem("CartId");
      await removeItemFromCart(cartId, cartItemId);
      await fetchCart();
      await refreshCart();
      toast.success("Item removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const cartId = localStorage.getItem("CartId");
      if (!cartId || !cart?.items) return;

      for (const item of cart.items) {
        await removeItemFromCart(cartId, item.cart_item_id);
      }

      await fetchCart();
      await refreshCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const placeOrder = async () => {
    if (!selectAddress) {
      setError("Please select a delivery address");
      return;
    }

    try {
      alert(`Order placed to ${selectAddress.street}, ${selectAddress.city}`);
      await clearCart();
    } catch (err) {
      toast.error("Order failed");
    }
  };

  const getAddresses = async () => {
    try {
      const res = await api.get("/address/getaddress");
      const list = res.data.data.addresses || [];
      setAddress(list);
      if (list.length > 0) setSelectAddress(list[0]);
    } catch (err) {
      toast.error("Failed to fetch address");
    }
  };

  useEffect(() => {
    if (user) getAddresses();
  }, [user]);

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return getCartCount() > 0 ? (
    <div className="flex flex-col md:flex-row mt-16">
      {/* Cart items list - remains the same */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cart?.items?.map((item, index) => (
          <div
            key={`${item.cart_item_id}-${index}`}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-4 border-b"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${
                      item.product.category?.name?.toLowerCase() || "category"
                    }/${item.product.product_id}`
                  );
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={
                    item.product.image_url1 ||
                    item.product.image_url2 ||
                    item.product.image_url3 ||
                    item.product.image_url4
                  }
                  alt={item.product.name}
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold line-clamp-2">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.product.category?.name || "No category"}
                </p>
                <div className="flex items-center mt-2">
                  <p className="text-sm mr-2">Qty:</p>
                  <select
                    onChange={(e) => {
                      updateItemQuantity(
                        item.cart_item_id,
                        Number(e.target.value)
                      );
                    }}
                    value={item.quantity}
                    className="outline-none border rounded px-2 py-1 text-sm"
                    disabled={loading}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center font-medium">
              {currency} {(item.product.price * item.quantity).toFixed(2)}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => removeFromCart(item.cart_item_id)}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Remove item"
              >
                <img
                  src={assets.remove_icon}
                  alt="Remove"
                  className="w-5 h-5 opacity-70 hover:opacity-100"
                />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Continue Shopping
          </button>

          <button
            onClick={clearCart}
            disabled={loading}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>
      </div>
      {/* Order summary - remains the same */}
      <div className="md:ml-8 mt-8 md:mt-0 w-full md:w-96">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectAddress
                ? `${selectAddress.street} , ${selectAddress.city},${selectAddress.state} , ${selectAddress.country}`
                : "No Address Found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {address.map((add, index) => (
                  <p
                    key={`address-${index}`}
                    onClick={() => {
                      setSelectAddress(add);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {add.street},{add.city},{add.state},{add.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>
        <hr className="border-gray-300" />
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency} {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">
              {currency} {shipping_charge}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency} {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}{" "}
              {shipping_charge + getCartAmount() + (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            !user ? navigate("/login") : placeOrder();
          }}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-2xl"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed To CheckOut"}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-32 h-32 mb-6 flex items-center justify-center text-indigo-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Looks like you haven't added any items to your cart yet.
      </p>
      <button
        onClick={() => {
          navigate("/products");
          window.scrollTo(0, 0);
        }}
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Browse Products
      </button>
    </div>
  );
}

export default Cart;

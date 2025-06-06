import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyAddress } from "../../assets/assets";

function Cart() {
  const [cartArray, setCartArray] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState(dummyAddress);
  const [selectAddress, setSelectAddress] = useState(dummyAddress[0]);
  const [paymentOption, setPaymentOption] = useState("COD");

  const shipping_charge = 150;

  const {
    products,
    cartItems,
    currency,
    updateCartItems,
    removeItemFromCart,
    getCartAmount,
    getCartCount,
    navigate,
    setShowUserLogin,
    user,
  } = useAppContext();

  const getCart = () => {
    let temp_array = [];

    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      temp_array.push(product);
    }

    setCartArray(temp_array);
  };

  //after completing my backend

  const placeOrder = async () => {};

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  return getCartCount() > 0 ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {getCartCount()} items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) => {
                        updateCartItems(product._id, Number(e.target.value));
                      }}
                      value={cartItems[product._id]}
                      className="outline-none"
                    >
                      {Array(cartItems[product] > 9 ? cartItems[product] : 9)
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeItemFromCart(product._id)}
              className="cursor-pointer mx-auto transform hover:scale-110 transition-transform duration-200 hover:text-red-500"
            >
              <img
                src={assets.remove_icon}
                alt="remove icon"
                className="inline-block w-6 h-6 hover:rotate-12 transition-transform duration-200"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium hover:translate-x-2 transition-transform duration-300"
        >
          <img
            className="group-hover:-translate-x-1 transition-transform duration-300"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 animate-slideInRight">
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
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {shipping_charge + getCartAmount() + (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={() => {
            !user ? setShowUserLogin(true) : placeOrder();
          }}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed To CheckOut"}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10 mt-24 text-gray-700">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-500 mb-4">
        Your Cart is Empty
      </h1>
      <p className="text-lg md:text-xl font-semibold text-gray-800">
        Looks like you haven't added anything yet.
      </p>
      <p className="text-sm md:text-base mt-3 text-gray-500 max-w-md">
        Add your favorite products to the cart and they'll show up here.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="bg-indigo-500 px-6 py-3 text-white rounded-md hover:bg-indigo-600 transition active:scale-95"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;

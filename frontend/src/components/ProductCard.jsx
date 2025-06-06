import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const [count, setCount] = useState(0);
  const {
    currency,
    cartItems,
    addToCart,
    updateCartItems,
    removeItemFromCart,
    navigate,
  } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(`products/${product.category}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full h-[360px] flex flex-col hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2 h-[180px] overflow-hidden">
          <img
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out w-full h-full object-contain"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-sm flex flex-col flex-grow">
          <p className="text-xs transform transition-all duration-300 hover:text-indigo-600">
            {product.category}
          </p>
          <p className="text-gray-700 font-medium text-lg truncate w-full transform transition-all duration-300 hover:text-indigo-600">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5 transform transition-all duration-300 hover:scale-105">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-3.5 w-3"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                />
              ))}
            <p>(4)</p>
          </div>
          <div className="flex items-end justify-between mt-auto">
            <p className="md:text-xl text-base font-medium text-indigo-500 transform transition-all duration-300 hover:scale-105">
              {currency} {product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency} {product.price}
              </span>
            </p>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-indigo-500"
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 cursor-pointer hover:bg-indigo-200 transform hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => addToCart(product._id)}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart_icon"
                    className="animate-bounce"
                  />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none transform hover:scale-105 transition-all duration-300">
                  <button
                    onClick={() => removeItemFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full hover:bg-indigo-500/10 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;

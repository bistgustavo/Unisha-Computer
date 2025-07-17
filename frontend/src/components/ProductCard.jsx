import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
} from "../services/cartService.js";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { currency, navigate, refreshCart, cart, fetchCart, setCart } =
    useAppContext();
  const [loading, setLoading] = useState({
    add: false,
    increase: false,
    decrease: false,
  });
  const [localQuantity, setLocalQuantity] = useState(0);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Update local quantity when cart changes
  useEffect(() => {
    if (cart?.items?.length) {
      const cartItem = cart.items.find(
        (item) => item.product_id === product.product_id
      );
      setLocalQuantity(cartItem?.quantity || 0);
    } else {
      setLocalQuantity(0);
    }
  }, [cart, product.product_id]);

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    setLoading((prev) => ({ ...prev, add: true }));
    try {
      const result = await addItemToCart(cart.cart_id, product.product_id, 1);
      setCart(result); // ✅ Refresh cart from backend
      toast.success("Added to cart!");
      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleIncreaseQuantity = async (e) => {
    e.stopPropagation();
    setLoading((prev) => ({ ...prev, increase: true }));
    try {
      const cartItem = cart?.items?.find(
        (item) => item.product_id === product.product_id
      );
      if (!cartItem) return handleAddToCart(e);
      await removeItemFromCart(cart.cart_id, cartItem.cart_item_id);
      const result = await addItemToCart(
        cart.cart_id,
        product.product_id,
        cartItem.quantity + 1
      );
      setCart(result);
      toast.success("Added to cart!");
      await refreshCart();
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error(error.message || "Failed to update quantity");
    } finally {
      setLoading((prev) => ({ ...prev, increase: false }));
    }
  };

  const handleDecreaseQuantity = async (e) => {
    e.stopPropagation();
    setLoading((prev) => ({ ...prev, decrease: true }));
    try {
      const cartItem = cart?.items?.find(
        (item) => item.product_id === product.product_id
      );
      if (!cartItem) return;

      if (cartItem.quantity === 1) {
        const result = await removeItemFromCart(
          cart.cart_id,
          cartItem.cart_item_id
        );
        setCart(result);
        toast.success("Removed from cart");
        await refreshCart();
      } else {
        await removeItemFromCart(cart.cart_id, cartItem.cart_item_id);
        const result = await addItemToCart(
          cart.cart_id,
          product.product_id,
          cartItem.quantity - 1
        );
        setCart(result);
        toast.success("Removed from cart");
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error(error.message || "Failed to update quantity");
    } finally {
      setLoading((prev) => ({ ...prev, decrease: false }));
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`products/${product.category?.name}/${product.product_id}`);
        window.scrollTo(0, 0);
      }}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full h-[360px] flex flex-col hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      {/* Image and basic info */}
      <div className="group cursor-pointer flex items-center justify-center px-2 h-[180px] overflow-hidden">
        <img
          className="group-hover:scale-105 transition-transform duration-300 ease-in-out w-full h-full object-contain"
          src={
            product.image_url1 ||
            product.image_url2 ||
            product.image_url3 ||
            product.image_url4 ||
            assets.default_product_image
          }
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="text-gray-500/60 text-sm flex flex-col flex-grow">
        <p className="text-xs hover:text-indigo-600">
          {product.category?.name}
        </p>
        <p className="text-gray-700 font-medium text-lg truncate hover:text-indigo-600">
          {product.name}
        </p>
        <div className="flex items-center gap-0.5">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
          <p>(4)</p>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <p className="md:text-xl text-base font-medium text-indigo-500">
            {currency} {product.price}{" "}
            {product.offerPrice && (
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency} {product.offerPrice}
              </span>
            )}
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-indigo-500">
            {localQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={loading.add}
                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 cursor-pointer hover:bg-indigo-200 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
              >
                {loading.add ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    <img
                      src={assets.cart_icon}
                      alt="cart_icon"
                      className="animate-bounce"
                    />
                    Add
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none transform hover:scale-105 transition-all duration-300">
                <button
                  onClick={handleDecreaseQuantity}
                  disabled={loading.decrease}
                  className="px-2 h-full hover:bg-indigo-500/10 disabled:opacity-50"
                >
                  {loading.decrease ? "..." : "-"}
                </button>
                <span className="w-5 text-center">{localQuantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  disabled={loading.increase}
                  className="px-2 h-full hover:bg-indigo-500/10 disabled:opacity-50"
                >
                  {loading.increase ? "..." : "+"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

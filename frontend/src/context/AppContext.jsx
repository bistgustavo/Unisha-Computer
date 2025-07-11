import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});

  const [searchQuery, setSearchQuery] = useState([]);

  // fetch all products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //add product to cart

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);

    toast.success("Item added to cart");
  };

  //udate cart items

  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] = quantity;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);

    toast.success("Item updated in cart");
  };

  //REMOVE ITEM FROM CART

  const removeItemFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    toast.success("Item removed from cart");
    setCartItems(cartData);
  };

  // Get total cart Item
  const getCartCount = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      totalItem += cartItems[item];
    }
    return totalItem;
  };

  // Get Total cart Amount

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }

    return Math.ceil(totalAmount * 100) / 100;
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItems,
    removeItemFromCart,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

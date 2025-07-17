import { use, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart, getOrCreateCart, getCurrentUserCart } from "../services/cartService";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // creating api for backend
  const api = axios.create({
    baseURL: "http://localhost:3000/api/v2/",
    timeout: 10000,
    withCredentials: true,
    credentials: "include",
  });

  const apiFile = axios.create({
    baseURL: "http://localhost:3000/api/v2/",
    timeout: 10000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    credentials: "include",
    withCredentials: true,
  });

  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [userData, setUserData] = useState(null);

  const [apiProduct, setApiProduct] = useState([]);

  const [searchQuery, setSearchQuery] = useState([]);

  const [categoryData, setCategoryData] = useState([]);

  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState(0);

  const fetchProductsFromApi = async () => {
    try {
      const response = await api.get("/product/allproducts");
      const products = response.data.data;
      setApiProduct(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductsFromApi();
  }, []);

  //total cart item count
  const refreshCart = async () => {
    try {
      let result = null;
      
      // If user is authenticated, use getCurrentUserCart
      if (user) {
        try {
          result = await getCurrentUserCart();
          if (result && result.cart_id) {
            localStorage.setItem("CartId", result.cart_id);
          }
        } catch (err) {
          console.error("Error fetching user cart for count:", err);
          // If user cart fetch fails, try with cartId
          const cartId = localStorage.getItem("CartId");
          if (cartId) {
            result = await getCart(cartId);
          }
        }
      } else {
        // For guest users, use the existing cart ID logic
        const cartId = localStorage.getItem("CartId");
        if (cartId) {
          result = await getCart(cartId);
        }
      }
      
      if (!result) {
        setCartCount(0);
        return;
      }

      const items = result?.items || [];
      const count = items.reduce(
        (totalAmount, item) => totalAmount + item.quantity,
        0
      );
      setCartCount(count);
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setCartCount(0);
    }
  };

  // fetch cart
  const fetchCart = async () => {
    try {
      const result = await getOrCreateCart();
      if (!result) return;
      setCart(result);
      if (result.cart_id) {
        localStorage.setItem("CartId", result.cart_id);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value = {
    cart,
    setCart,
    fetchCart,
    cartCount,
    setCartCount,
    refreshCart,
    userData,
    setUserData,
    api,
    apiFile,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    apiProduct,
    currency,
    searchQuery,
    setSearchQuery,
    categoryData,
    setCategoryData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

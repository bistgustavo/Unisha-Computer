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
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

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

  // Comprehensive cart management
  const updateCartState = (cartData) => {
    if (!cartData) {
      setCart(null);
      setCartCount(0);
      return;
    }
    
    setCart(cartData);
    
    // Calculate cart count
    const items = cartData?.items || [];
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    // Store cart ID for future use
    if (cartData.cart_id) {
      localStorage.setItem("CartId", cartData.cart_id);
    }
  };

  // Enhanced cart fetching with proper state management
  const fetchCart = async (forceRefresh = false) => {
    if (cartLoading && !forceRefresh) return;
    
    try {
      setCartLoading(true);
      let result = null;
      
      // If user is authenticated, use getCurrentUserCart
      if (user) {
        try {
          result = await getCurrentUserCart();
        } catch (err) {
          console.error("Error fetching user cart:", err);
          // Fallback to guest cart if user cart fails
          const cartId = localStorage.getItem("CartId");
          if (cartId) {
            result = await getCart(cartId);
          } else {
            result = await getOrCreateCart();
          }
        }
      } else {
        // For guest users
        const cartId = localStorage.getItem("CartId");
        if (cartId) {
          result = await getCart(cartId);
        } else {
          result = await getOrCreateCart();
        }
      }
      
      updateCartState(result);
      return result;
    } catch (error) {
      console.error("Error fetching cart:", error);
      updateCartState(null);
    } finally {
      setCartLoading(false);
    }
  };

  // Legacy refreshCart function for backwards compatibility
  const refreshCart = async () => {
    await fetchCart(true);
  };

  // Enhanced cart update function for components to use
  const updateCart = (newCartData) => {
    updateCartState(newCartData);
  };

  // Initialize cart on component mount and when user changes
  useEffect(() => {
    fetchCart(true);
  }, [user]);

  // Initial cart load
  useEffect(() => {
    if (!cart && !cartLoading) {
      fetchCart();
    }
  }, []);

  const value = {
    // Cart state
    cart,
    setCart,
    cartCount,
    setCartCount,
    cartLoading,
    
    // Cart management functions
    fetchCart,
    refreshCart,
    updateCart,
    updateCartState,
    
    // User data
    userData,
    setUserData,
    user,
    setUser,
    isSeller,
    setIsSeller,
    
    // API and navigation
    api,
    apiFile,
    navigate,
    
    // Product data
    apiProduct,
    currency,
    
    // Search and category
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

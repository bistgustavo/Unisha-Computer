import React, { useEffect, useState, memo } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, setUser, userData, setUserData, api, cartCount } =
    useAppContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      setUserData({});
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      setUser(null);
      setUserData({});
      if (error.response?.status === 401) {
        toast.success("Session ended. Please login again.");
      } else {
        toast.error("Logout failed. Please try again.");
        console.error("Logout error:", error);
      }
      navigate("/home");
    }
  };

  const fetchSuggestions = async (term) => {
    if (term.trim().length > 0) {
      try {
        const response = await api.get("/product/search", {
          params: { query: term, limit: 5 },
        });
        setSearchSuggestions(response.data.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      navigate("/products", { state: { searchQuery: searchTerm } });
      setSearchTerm("");
      setShowSuggestions(false);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product.category.name}/${product.product_id}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 relative transition-all bg-[#f1eeec] z-50">
      <NavLink to={"/"} onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="Logo" />
      </NavLink>

      {/* Search Bar with Suggestions */}
      <div className="hidden lg:flex items-center gap-2 relative">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search products..."
            className="py-1.5 lg:w-[300px] lg:h-10 bg-transparent outline-none placeholder-gray-500 border border-gray-300 px-4 rounded-full focus:border-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <img
              src={assets.search_icon}
              alt="search_icon"
              className="w-4 h-4"
            />
          </button>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 z-50">
            {searchSuggestions.map((product) => (
              <div
                key={product.product_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => handleSuggestionClick(product)}
              >
                <img
                  src={
                    product.image_url1 ||
                    product.image_url2 ||
                    product.image_url3 ||
                    product.image_url4
                  }
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <div>
                  <p className="text-gray-800 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {product.category?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="relative cursor-pointer">
          <img
            onClick={() => navigate("/cart")}
            src={assets.nav_cart_icon}
            alt="Cart Icon"
            className="w-6 opacity-80"
          />
          <span className="absolute -top-2 -right-3 flex items-center justify-center text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount}
          </span>
        </div>

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={userData.profile_url || assets.profile_icon}
              alt="profile_icon"
              className="w-10 rounded-full"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-indigo-500/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={() => navigate("/profile")}
                className="p-1.5 pl-3 hover:bg-indigo-500/10 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-indigo-500/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center gap-6 sm:hidden">
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu image" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <NavLink to="/" onClick={() => setOpen(false)} className="block">
          Home
        </NavLink>
        <NavLink
          to="/products"
          onClick={() => setOpen(false)}
          className="block"
        >
          All Products
        </NavLink>
        <NavLink to="/cart" onClick={() => setOpen(false)} className="block">
          Cart
        </NavLink>
        {user && (
          <NavLink
            to="/my-orders"
            onClick={() => setOpen(false)}
            className="block"
          >
            My Orders
          </NavLink>
        )}
        {user && (
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className="block"
          >
            Profile
          </NavLink>
        )}
        <NavLink to="/contact" onClick={() => setOpen(false)} className="block">
          Contact
        </NavLink>
        {!user ? (
          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="cursor-pointer transition text-black"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="cursor-pointer transition text-black"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default memo(Navbar);

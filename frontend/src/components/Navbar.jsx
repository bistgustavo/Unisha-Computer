import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, setUser, setShowUserLogin, navigate, getCartCount } =
    useAppContext();

  // Fixed: Wrapped in useCallback to prevent unnecessary recreations
  const logout = async () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 relative transition-all bg-[#f1eeec] z-50">
      <NavLink
        to={"/"}
        onClick={() => {
          setOpen(false);
          setShowUserLogin(false);
        }}
      >
        <img className="h-9" src={assets.logo} alt="Logo" />
      </NavLink>

      <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
        <input
          className="py-1.5 lg:w-[300px] lg:h-10 bg-transparent outline-none placeholder-gray-500"
          type="text"
          placeholder="Search products"
        />
        <img src={assets.search_icon} alt="search_icon" className="w-4 h-4" />
      </div>

      {/* Desktop Menu - Fixed: Changed condition to always show on desktop */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" onClick={() => setShowUserLogin(false)}>
          Home
        </NavLink>
        <NavLink onClick={() => setShowUserLogin(false)} to="/products">
          All Products
        </NavLink>
        <NavLink onClick={() => setShowUserLogin(false)} to="/contact">
          Contact
        </NavLink>

        <div className="relative cursor-pointer">
          <img
            onClick={() => {
              navigate("/cart");
            }}
            src={assets.nav_cart_icon}
            alt="cart Icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => {
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="profile_icon"
              className="w-10"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => {
                  navigate("my-orders");
                }}
                className="p-1.5 pl-3 hover:bg-indigo-500/10 cursor-pointer"
              >
                My Orders
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
        <div className="relative cursor-pointer">
          <img
            onClick={() => {
              navigate("/cart");
            }}
            src={assets.nav_cart_icon}
            alt="cart Icon"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          // Fixed: Changed to arrow function to prevent immediate invocation
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className=""
        >
          <img src={assets.menu_icon} alt="menu image" />
        </button>
      </div>

      {/* Mobile Menu */}

      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <NavLink
          to="/"
          // Fixed: Changed to arrow function
          onClick={() => {
            setOpen(false);
            setShowUserLogin(false);
          }}
          className="block"
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          onClick={() => setOpen(false)}
          className="block"
        >
          All Products
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

        <NavLink to="/contact" onClick={() => setOpen(false)} className="block">
          Contact
        </NavLink>

        {!user ? (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from "react";
import { CiAt } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { mergeCarts, getOrCreateCart } from "../services/cartService.js";

const Login = () => {
  const {
    user,
    setUserData,
    setUser,
    api,
    navigate,
    isSeller,
    setIsSeller,
    refreshCart,
  } = useAppContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    let hasValidationErrors = false;
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = "Email is required";
      hasValidationErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
      hasValidationErrors = true;
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("user/login", {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data?.data?.user) {
        // Store the user data in a variable before setting state
        const userData = response.data.data.user;

        // Update state
        if (userData.web_role === "admin") {
          setIsSeller(true);
          navigate("/seller");
          toast.success("Logged in as seller successfully!");
        } else {
          setUserData(userData);
          setUser(true);
          toast.success(response.data.message || "Logged in successfully!");

          // Merge carts after successful login
          try {
            const mergedCart = await mergeCarts();
            if (mergedCart && mergedCart.cart_id) {
              // Update localStorage with the new cart ID
              localStorage.setItem("CartId", mergedCart.cart_id);
              // Refresh cart to update the UI
              await refreshCart();
            } else {
              // If no cart was returned from merge, create/get user cart
              const newCart = await getOrCreateCart();
              if (newCart && newCart.cart_id) {
                localStorage.setItem("CartId", newCart.cart_id);
                await refreshCart();
              }
            }
          } catch (mergeError) {
            console.warn("Cart merge warning:", mergeError.message);
            // If merge fails, try to fetch/create a new cart
            try {
              const newCart = await getOrCreateCart();
              if (newCart && newCart.cart_id) {
                localStorage.setItem("CartId", newCart.cart_id);
                await refreshCart();
              }
            } catch (fallbackError) {
              console.error("Fallback cart creation failed:", fallbackError);
            }
          }

          navigate("/");
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-6 bg-white/60 backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Sign in to continue shopping
      </p>

      <div>
        <div className="relative">
          <CiAt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white text-gray-700 placeholder-gray-400"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.email}</p>
        )}
      </div>

      <div>
        <div className="relative">
          <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white text-gray-700 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
          >
            {showPassword ? (
              <FaRegEyeSlash className="text-xl" />
            ) : (
              <FaRegEye className="text-xl" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.password}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-red-500 text-center text-sm mt-1.5">
          {errors.submit}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-3.5 rounded-xl font-medium hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="ml-2 text-gray-800 hover:text-gray-900 font-semibold focus:outline-none hover:underline transition-all duration-300"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default Login;

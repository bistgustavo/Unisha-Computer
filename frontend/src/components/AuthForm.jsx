import React, { useState, useRef } from "react";
import { CiAt, CiUser } from "react-icons/ci";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaPhone,
  FaHome,
  FaCamera,
} from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import styled from "styled-components";
import { useAppContext } from "../context/AppContext.jsx";

const AuthForm = () => {
  //test data

  const { setUser, setShowUserLogin } = useAppContext();

  // Form mode state
  const [isLogin, setIsLogin] = useState(true);

  // Form data states
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    profile: null,
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  // Handle profile image upload
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignUpData({ ...signUpData, profile: file });
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }

    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (isLogin) {
      if (!loginData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }

      if (!loginData.password) {
        newErrors.password = "Password is required";
        valid = false;
      }
    } else {
      if (!signUpData.first_name) {
        newErrors.first_name = "First name is required";
        valid = false;
      }

      if (!signUpData.last_name) {
        newErrors.last_name = "Last name is required";
        valid = false;
      }

      if (!signUpData.username) {
        newErrors.username = "Username is required";
        valid = false;
      }

      if (!signUpData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }

      if (!signUpData.password) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (signUpData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        valid = false;
      }

      if (!signUpData.phone) {
        newErrors.phone = "Phone number is required";
        valid = false;
      }

      if (!signUpData.address) {
        newErrors.address = "Address is required";
        valid = false;
      }

      if (!signUpData.profile) {
        newErrors.profile = "Profile photo is required";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      if (isLogin) {
        // For testing: allow login with any password
        if (!loginData.email) {
          setErrors({ email: "Email is required" });
          return;
        }

        // Mock successful login
        const mockUser = {
          email: loginData.email,
          name: loginData.email.split("@")[0], // Use email username as name
          isAuthenticated: true,
        };

        // Set user in context
        setUser(mockUser);

        // Close the login modal
        setShowUserLogin(false);

        console.log("Logged in successfully with test account:", mockUser);
      } else {
        // Validate signup data
        const validationErrors = {};
        if (!signUpData.first_name)
          validationErrors.first_name = "First name is required";
        if (!signUpData.last_name)
          validationErrors.last_name = "Last name is required";
        if (!signUpData.username)
          validationErrors.username = "Username is required";
        if (!signUpData.email) validationErrors.email = "Email is required";
        if (!signUpData.password)
          validationErrors.password = "Password is required";
        if (!signUpData.phone)
          validationErrors.phone = "Phone number is required";
        if (!signUpData.address)
          validationErrors.address = "Address is required";

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          throw new Error("Please fill in all required fields");
        }

        // Send data to backend
        const response = await fetch("/api/contact/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUpData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error saving contact details");
        }

        // Clear form and show success message
        setSignUpData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          profile: null,
        });
        setProfilePreview(null);

        // Show success message (you might want to add a toast notification here)
        alert("Contact details saved successfully!");

        // Close the form
        setShowUserLogin(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowUserLogin(false);
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-black/40 backdrop-blur-[6px] flex items-center justify-center z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Background content container */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* Modal container with padding */}
      <div className="relative w-full min-h-screen py-12 px-4 flex items-center justify-center pointer-events-none">
        {/* Actual form container */}
        <div
          className="bg-white/90 backdrop-blur-sm rounded-2xl w-full max-w-md relative animate-slideIn overflow-hidden shadow-2xl border border-white/20 pointer-events-auto max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowUserLogin(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 z-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Form header - Fixed at top */}
          <div className="text-center p-8 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-md">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-300 font-light">
              {isLogin
                ? "Sign in to continue shopping"
                : "Join us for a better shopping experience"}
            </p>
          </div>

          {/* Scrollable form content */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 bg-white/60 backdrop-blur-sm"
            >
              {isLogin ? (
                // Login Form
                <div className="space-y-5">
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
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.email}
                      </p>
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
                        onClick={handleToggle}
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
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Signup Form
                <div className="grid grid-cols-2 gap-5">
                  {/* Profile Photo */}
                  <div className="col-span-2 flex justify-center mb-6">
                    <div className="relative group">
                      <div
                        onClick={triggerFileInput}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 p-[2px] cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl"
                      >
                        <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                              <FaCamera className="text-2xl mb-2" />
                              <span className="text-sm font-medium">
                                Add Photo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {errors.profile && (
                        <p className="text-red-500 text-sm mt-2 text-center absolute -bottom-8 w-full">
                          {errors.profile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  {[
                    {
                      name: "first_name",
                      placeholder: "First Name",
                      icon: <CiUser className="text-xl" />,
                      colSpan: 1,
                    },
                    {
                      name: "last_name",
                      placeholder: "Last Name",
                      icon: <CiUser className="text-xl" />,
                      colSpan: 1,
                    },
                    {
                      name: "username",
                      placeholder: "Username",
                      icon: <CiUser className="text-xl" />,
                      colSpan: 2,
                    },
                    {
                      name: "email",
                      placeholder: "Email",
                      icon: <CiAt className="text-xl" />,
                      colSpan: 2,
                    },
                    {
                      name: "password",
                      placeholder: "Password",
                      icon: <IoLockClosedOutline className="text-xl" />,
                      type: showPassword ? "text" : "password",
                      colSpan: 2,
                      hasPasswordToggle: true,
                    },
                    {
                      name: "phone",
                      placeholder: "Phone Number",
                      icon: <FaPhone className="text-lg" />,
                      colSpan: 2,
                    },
                    {
                      name: "address",
                      placeholder: "Address",
                      icon: <FaHome className="text-lg" />,
                      colSpan: 2,
                    },
                  ].map((field) => (
                    <div
                      key={field.name}
                      className={`col-span-${field.colSpan}`}
                    >
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                          {field.icon}
                        </div>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          value={signUpData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`w-full pl-12 ${
                            field.hasPasswordToggle ? "pr-12" : "pr-4"
                          } py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white text-gray-700 placeholder-gray-400`}
                        />
                        {field.hasPasswordToggle && (
                          <button
                            type="button"
                            onClick={handleToggle}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5"
                          >
                            {showPassword ? (
                              <FaRegEyeSlash className="text-xl" />
                            ) : (
                              <FaRegEye className="text-xl" />
                            )}
                          </button>
                        )}
                      </div>
                      {errors[field.name] && (
                        <p className="text-red-500 text-sm mt-1.5 ml-1">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
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
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>

              {/* Toggle Form Mode */}
              <p className="text-center mt-6 text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="ml-2 text-gray-800 hover:text-gray-900 font-semibold focus:outline-none hover:underline transition-all duration-300"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .inputForm.error {
    border-color: #ff4d4f;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #252727;
  }

  .button-submit:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: -8px;
    margin-bottom: 5px;
  }
`;

// Add this to your CSS file or style tag
const styles = `
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
`;

export default AuthForm;

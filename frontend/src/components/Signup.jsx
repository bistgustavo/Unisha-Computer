import React, { useState, useRef } from "react";
import { CiAt, CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash, FaPhone, FaCamera } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const SignupForm = () => {
  const { apiFile, navigate, setUser, setUserData } = useAppContext();

  const [signUpData, setSignUpData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    profile: null, // Holds the File object
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignUpData((prev) => ({ ...prev, profile: file }));
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setSignUpData((prev) => ({ ...prev, profile: null }));
      setProfilePreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();

      // Append form data
      formDataToSend.append("first_name", signUpData.first_name);
      formDataToSend.append("last_name", signUpData.last_name);
      formDataToSend.append("username", signUpData.username);
      formDataToSend.append("email", signUpData.email);
      formDataToSend.append("password", signUpData.password);
      formDataToSend.append("phone", signUpData.phone);
      if (signUpData.profile) {
        formDataToSend.append("profile", signUpData.profile);
      }

      const response = await apiFile.post("user/register", formDataToSend, {
        credentials: "include",
      });
      console.log("Full response:", response); // Debug log
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("User:", response.data?.user);
      console.log("AccessToken:", response.data?.accessToken);

      // Proper response handling
      if (response.status === 201 && response.data) {
        const user = response.data.data.user;

        if (!user) {
          throw new Error("Server response missing user data ");
        }

        // Update state
        setUser(true);
        setUserData(user);
        toast.success(response.data.message);

        // Reset form
        setSignUpData(initialFormState); // Your initial empty state
        setProfilePreview(null);

        navigate("/");
        return;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        console.error("Server error details:", error.response.data);
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response
        console.error("No response received:", error.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Other errors
        console.error("Client error:", error.message);
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialFormState = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    profile: null,
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-6 bg-white/60 backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create Account
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Join us for a better shopping experience
      </p>

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
                  <span className="text-sm font-medium">Add Photo</span>
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

      <div className="grid grid-cols-2 gap-5">
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
        ].map((field) => (
          <div key={field.name} className={`col-span-${field.colSpan}`}>
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
                  onClick={handleTogglePasswordVisibility}
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
        {errors.submit && (
          <p className="col-span-2 text-red-500 text-center text-sm mt-1.5">
            {errors.submit}
          </p>
        )}
      </div>

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
          <span>Create Account</span>
        )}
      </button>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?
        <button
          onClick={() => navigate("/login")}
          type="button"
          className="ml-2 text-gray-800 hover:text-gray-900 font-semibold focus:outline-none hover:underline transition-all duration-300"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignupForm;

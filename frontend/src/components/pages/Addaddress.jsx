import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { FaHome, FaCity, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import toast from "react-hot-toast";

function Addaddress() {
  const { navigate, api } = useAppContext();
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(
        "address/setaddress",
        {
          street: formData?.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.pincode, // Changed from pincode to postal_code
          country: formData.country,
        },
      );

      if (response.status === 201) {
        toast.success("Address saved successfully!");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Full error:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 animate-slideInDown">
            Add New Address
          </h1>
          <p
            className="mt-2 text-gray-600 animate-slideInDown"
            style={{ animationDelay: "0.1s" }}
          >
            Please fill in your delivery address details
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div>
            <div className="relative">
              <FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address *"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.street ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white`}
              />
            </div>
            {errors.street && (
              <p className="mt-1 text-sm text-red-500">{errors.street}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City *"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.city ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white`}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <MdLocationCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State *"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.state ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white`}
              />
            </div>
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country *"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.country ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white`}
              />
            </div>
            {errors.country && (
              <p className="mt-1 text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="PIN Code *"
                maxLength="6"
                className={`w-full pl-12 pr-4 py-3.5 border ${
                  errors.pincode ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white`}
              />
            </div>
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-100">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 border border-transparent rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Addaddress;

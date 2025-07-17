import React, { useState, useRef, use } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaKey, FaTimes } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, userData, api, navigate} = useAppContext();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-[#0D4E4A]/5">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </main>
    );
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.patch("/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Password change error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
      toast.error(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      setIsLoading(true);
      const response = await api.patch("/user/changeprofile", formData);

      if (response.status === 200) {
        toast.success("Profile picture updated successfully");
        // You might want to update the user context here with the new image URL
        window.location.reload(); // Temporary solution to refresh the image
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update profile picture"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="relative h-48 bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <img
                    src={userData?.profile_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white cursor-pointer"
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button
                    className="absolute bottom-0 right-0 bg-[#CB9C30] p-2 rounded-full text-white hover:bg-[#CB9C30]/80 transition-colors disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <FaCamera size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-20 pb-6 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-[#0D4E4A]">
                    {userData?.first_name} {userData?.last_name}
                  </h1>
                  <p className="text-gray-600">{userData?.role}</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <FaKey />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{userData?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{userData?.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="text-gray-900">{userData?.addresses}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="text-gray-900">
                    {userData?.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-black hover:text-[#CB9C30]"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D4E4A] text-white rounded-lg hover:bg-[#0D4E4A]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image View Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-4 max-w-2xl mx-4"
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
            <img
              src={user?.profileImage || "/assets/avatar.jpg"}
              alt="Profile"
              className="max-h-[80vh] w-auto"
            />
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default Profile;

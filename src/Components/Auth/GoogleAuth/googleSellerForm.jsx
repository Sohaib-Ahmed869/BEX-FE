"use client";

import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";

const GoogleSellerForm = ({ googleUserData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyRegistrationNumber: "",
    countryOfRegistration: "",
    businessAddress: "",
    websiteUrl: "",
    licenseImage: null,
  });
  const [loading, setLoading] = useState(false);
  const countries = countryList().getData();

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = ""; // Reset file input
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload only JPEG, PNG, WEBP, or PDF files");
        e.target.value = ""; // Reset file input
        return;
      }

      updateFormData("licenseImage", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.companyRegistrationNumber ||
      !formData.countryOfRegistration ||
      !formData.businessAddress ||
      !formData.websiteUrl
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const sellerData = {
        ...googleUserData,
        ...formData,
        role: "seller",
      };
      await onSubmit(sellerData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-2 sm:mx-4 my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          Complete Your Seller Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Company Name and Registration Number Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="Your Company Name"
                className="w-full py-3 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">
                Registration Number
              </label>
              <input
                type="text"
                value={formData.companyRegistrationNumber}
                onChange={(e) =>
                  updateFormData("companyRegistrationNumber", e.target.value)
                }
                placeholder="Registration Number"
                className="w-full py-3 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Country and Website Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block">
                Country of Registration
              </label>
              <select
                value={formData.countryOfRegistration}
                onChange={(e) =>
                  updateFormData("countryOfRegistration", e.target.value)
                }
                className="w-full py-3 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                required
              >
                <option value="">Select a Country</option>
                {countries.map((country) => (
                  <option key={country.label} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full py-3 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Business Address - Full Width */}
          <div>
            <label className="text-sm font-bold mb-2 block">
              Business Address
            </label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) =>
                updateFormData("businessAddress", e.target.value)
              }
              placeholder="Your Business Address"
              className="w-full py-3 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <div className="flex items-center mb-2">
              <label className="text-sm font-bold">Business License</label>
              <span className="text-gray-400 font-medium ml-2 text-xs">
                Optional
              </span>
            </div>
            <div className="relative">
              <IoCloudUploadOutline
                size={18}
                className="absolute top-3 left-3 text-[#F47458] z-10"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full py-3 pl-10 pr-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
              />
            </div>
            <small className="text-gray-500 text-xs mt-1 block">
              JPEG, PNG, WEBP, PDF formats are accepted. Max size: 5MB
            </small>
            {formData.licenseImage && (
              <div className="mt-2 text-sm text-green-600">
                Selected: {formData.licenseImage.name}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="order-2 sm:order-1 w-full sm:flex-1 py-3 sm:py-3.5 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="order-1 sm:order-2 w-full sm:flex-1 py-3 sm:py-3.5 px-6 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
            >
              {loading ? "Processing..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GoogleSellerForm;

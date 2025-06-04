import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  Building2,
  Globe,
  MapPin,
  FileText,
  Hash,
  Flag,
} from "lucide-react";
import countryList from "react-select-country-list";
import { Bounce, ToastContainer, toast } from "react-toastify";

const UpgradeToSellerModal = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyRegistrationNumber: "",
    countryOfRegistration: "",
    businessAddress: "",
    websiteUrl: "",
    postalCode: "",
    city: "",
    licenseImage: null,
  });
  const countries = countryList().getData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleClose = () => {
    setFormData({
      companyName: "",
      companyRegistrationNumber: "",
      countryOfRegistration: "",
      businessAddress: "",
      websiteUrl: "",
      licenseImage: null,
    });
    onClose();
  };
  // Service function to convert buyer to seller
  const convertToSeller = async (userId, sellerData) => {
    const URL = import.meta.env.VITE_REACT_BACKEND_URL;
    try {
      console.log("Converting buyer to seller:", sellerData);

      const formDataToSend = new FormData();
      formDataToSend.append("companyName", sellerData.companyName);
      formDataToSend.append(
        "companyRegistrationNumber",
        sellerData.companyRegistrationNumber
      );
      formDataToSend.append(
        "countryOfRegistration",
        sellerData.countryOfRegistration
      );
      formDataToSend.append("businessAddress", sellerData.businessAddress);
      formDataToSend.append("websiteUrl", sellerData.websiteUrl);
      formDataToSend.append("postalCode", sellerData.postalCode);
      formDataToSend.append("city", sellerData.city);
      if (sellerData.licenseImage && sellerData.licenseImage instanceof File) {
        formDataToSend.append("licenseImage", sellerData.licenseImage);
      }

      const response = await fetch(
        `${URL}/api/user/convert-to-seller/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to convert to seller");
      }

      if (data.success) {
        localStorage.setItem("role", "seller");
        return data;
      } else {
        throw new Error(data.message || "Failed to convert to seller");
      }
    } catch (error) {
      console.error("Convert to seller error:", error);

      if (error.response) {
        throw {
          message: error.response.data.message || "Conversion failed",
          error: error.response.data.error || error.response.data,
        };
      } else if (error.request) {
        throw {
          message: "No response from server",
          error: "Server may be down or unreachable",
        };
      } else {
        throw {
          message: error.message || "Request configuration error",
          error: error.message,
        };
      }
    }
  };
  useEffect(() => {
    console.log("Form data:", formData);
  }, [formData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        licenseImage: file,
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        licenseImage: e.dataTransfer.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.companyName ||
      !formData.companyRegistrationNumber ||
      !formData.countryOfRegistration ||
      !formData.businessAddress ||
      !formData.postalCode ||
      !formData.city
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // Get userId from localStorage or props
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("user_id");

      if (!userId) {
        throw new Error("User ID not found");
      }

      const result = await convertToSeller(userId, formData);

      // Call success callback if provided
      if (onUpgradeSuccess) {
        onUpgradeSuccess(result);
      }

      // Close modal
      onClose();

      // Reset form
      setFormData({
        companyName: "",
        companyRegistrationNumber: "",
        countryOfRegistration: "",
        businessAddress: "",
        websiteUrl: "",
        licenseImage: null,
      });
    } catch (error) {
      setError(error.message || "Failed to upgrade to seller");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#f47458]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upgrade to Seller
              </h2>
              <p className="text-sm text-gray-500">
                Start selling your products today
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Row 1: Company Name & Registration Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Company Registration Number *
              </label>
              <input
                type="text"
                name="companyRegistrationNumber"
                value={formData.companyRegistrationNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
                placeholder="Enter registration number"
              />
            </div>
          </div>

          {/* Row 2: Country of Registration & Website URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 inline mr-2" />
                Country of Registration *
              </label>

              <select
                id="country"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm  focus:outline-none transition-colors"
                value={formData.countryOfRegistration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryOfRegistration: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  -- Select a Country --
                </option>
                {countries.map((country) => (
                  <option key={country.label} value={country.label}>
                    {country.flag} {country.value} {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Website URL (Optional)
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {" "}
                <MapPin className="w-4 h-4 inline mr-2" /> Postal Code *
              </label>
              <input
                type="number"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter your postal code"
              />
            </div>
          </div>

          {/* Full Width: Business Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Business Address *
            </label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f47458] focus:border-transparent resize-none"
              placeholder="Enter your complete business address"
            />
          </div>

          {/* Full Width: License Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Business License
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {formData.licenseImage ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.licenseImage.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change or drag new file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Drag and drop your license file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#F47458] text-white rounded-lg hover:bg-[#EB5E3E] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Upgrade to Seller"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToSellerModal;

import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { registerSeller } from "../../services/AuthServices";
import { Bounce, ToastContainer, toast } from "react-toastify";
import countryList from "react-select-country-list";
import { motion } from "framer-motion";
import Select, { components } from "react-select";

const SellerForm = ({ formData, updateFormData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const countries = countryList().getData();
  const CountryOption = (props) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          <span>{props.data.flag}</span>
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 10000);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (
      !formData.name ||
      !formData.companyName ||
      !formData.companyRegistrationNumber ||
      !formData.countryOfRegistration ||
      !formData.businessAddress ||
      !formData.email ||
      !formData.password ||
      !formData.city ||
      !formData.postalCode
    ) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }
    try {
      // Prepare data for API
      const sellerData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName: formData.companyName,
        companyRegistrationNumber: formData.companyRegistrationNumber,
        countryOfRegistration: formData.countryOfRegistration,
        businessAddress: formData.businessAddress,
        websiteUrl: formData.websiteUrl,
        city: formData.city,
        postalCode: formData.postalCode,
        licenseImage: formData.licenseImage,
      };
      console.log(sellerData);
      // Call registration service
      await registerSeller(sellerData);
      toast.success("Registration successful!");
      // Navigate to dashboard or confirmation page
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
      toast.error("Registration error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for form container
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Animation for the buttons
  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-4 lg:py-8 overflow-y-auto">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={formVariants}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl py-6 sm:py-8 lg:py-10 px-6 sm:px-8 lg:px-10  rounded-2xl lg:rounded-3xl flex flex-col"
        >
          <motion.h1
            custom={0}
            variants={itemVariants}
            className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6 sm:mb-8 text-center lg:text-left"
          >
            Almost there! Please tell us about your Company
          </motion.h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          <motion.div
            custom={1}
            variants={itemVariants}
            className="flex flex-col lg:flex-row w-full gap-3 lg:gap-6 mb-3 lg:mb-4"
          >
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="name"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Your Name"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="companyName"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Company name *
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="Your Company Name"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={itemVariants}
            className="flex flex-col lg:flex-row w-full gap-3 lg:gap-6 mb-3 lg:mb-4"
          >
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="companyRegistrationNumber"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Company registration number *
              </label>
              <input
                type="text"
                id="companyRegistrationNumber"
                value={formData.companyRegistrationNumber}
                onChange={(e) =>
                  updateFormData("companyRegistrationNumber", e.target.value)
                }
                placeholder="Registration Number"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="countryOfRegistration"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Country of registration *
              </label>
              <Select
                id="country"
                options={countries.map((country) => ({
                  value: country.label,
                  label: country.label,
                  flag: country.flag,
                }))}
                value={
                  countries.find(
                    (c) => c.label === formData.countryOfRegistration
                  ) || null
                }
                onChange={(selectedOption) =>
                  updateFormData(
                    "countryOfRegistration",
                    selectedOption?.value || ""
                  )
                }
                placeholder="Search and select a country..."
                isSearchable
                components={{ Option: CountryOption }}
                className="w-full"
                classNamePrefix="select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "44px", // Match your py-2.5
                    border: "2px solid #d1d5db",
                    borderColor: state.isFocused ? "#F47458" : "#d1d5db",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#F47458" : "#d1d5db",
                    },
                  }),
                }}
              />
            </div>
          </motion.div>
          <motion.div
            custom={3}
            variants={itemVariants}
            className="flex flex-col lg:flex-row w-full gap-3 lg:gap-6 mb-3 lg:mb-4"
          >
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="Postal Code"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Postal Code *
              </label>
              <input
                type="number"
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateFormData("postalCode", e.target.value)}
                placeholder="Postal Code"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="city"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                {" "}
                City *
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData("city", e.target.value)}
                placeholder="City"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
          <motion.div
            custom={3}
            variants={itemVariants}
            className="flex flex-col lg:flex-row w-full gap-3 lg:gap-6 mb-3 lg:mb-4"
          >
            <div className="w-full lg:w-1/2">
              <label
                htmlFor="businessAddress"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Business address *
              </label>
              <input
                type="text"
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) =>
                  updateFormData("businessAddress", e.target.value)
                }
                placeholder="Business Address"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <label
                htmlFor="websiteUrl"
                className="text-xs sm:text-sm font-bold mb-1 block"
              >
                Website URL{" "}
                <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input
                type="text"
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                placeholder="Website URL"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            className="w-full mb-6"
          >
            <div className="flex items-center mb-1">
              <label
                htmlFor="licenseImage"
                className="text-xs sm:text-sm font-bold"
              >
                Upload a license picture of your business
              </label>
              <span className="text-gray-400 font-medium ml-2 text-xs">
                Optional
              </span>
            </div>
            <div className="relative">
              <IoCloudUploadOutline
                size={18}
                className="absolute top-3 sm:top-4 left-3 text-[#F47458]"
              />
              <input
                type="file"
                id="licenseImage"
                onChange={(e) =>
                  updateFormData("licenseImage", e.target.files[0])
                }
                className="w-full py-2.5 sm:py-3 lg:py-3.5 pl-10 pr-4 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
            <small className="text-gray-500 text-xs mt-1 block">
              Jpeg, PNG, PDF, Webp formats are accepted
            </small>
          </motion.div>

          <motion.button
            custom={5}
            variants={{
              ...itemVariants,
              ...buttonVariants,
            }}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            disabled={loading}
            className={`w-1/2 mx-auto py-2.5 sm:py-3 lg:py-3.5 mt-3 sm:mt-4 lg:mt-5 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors text-sm font-medium ${
              loading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Processing..." : "Sign Up"}
          </motion.button>

          <motion.div
            custom={6}
            variants={itemVariants}
            className="text-center mt-4 sm:mt-5 lg:mt-6 text-gray-400 font-medium text-sm"
          >
            Have an account already?{" "}
            <Link className="text-[#F47458] hover:underline" to="/login">
              Login
            </Link>
          </motion.div>
        </motion.form>
      </div>
    </>
  );
};

export default SellerForm;

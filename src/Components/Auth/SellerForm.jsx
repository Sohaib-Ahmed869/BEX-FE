import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { registerSeller } from "../../services/AuthServices";
import { Bounce, ToastContainer, toast } from "react-toastify";
import countryList from "react-select-country-list";
import { motion } from "framer-motion";

const SellerForm = ({ formData, updateFormData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const countries = countryList().getData();

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
      !formData.websiteUrl
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

      <motion.form
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={handleSubmit}
        className="w-full md:w-3/4 lg:w-1/2 block py-6 px-4 md:px-12 lg:px-16 mt-16 md:mt-24 lg:mt-40 flex flex-col m-auto"
      >
        <motion.h1
          custom={0}
          variants={itemVariants}
          className="font-bold w-1/2 text-3xl md:text-4xl leading-tight mb-8 text-center md:text-left"
        >
          Almost there! Please tell us about your Company
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in animate-duration-1000"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <motion.div
          custom={1}
          variants={itemVariants}
          className="flex flex-col md:flex-row w-full gap-4 md:gap-10"
        >
          <div className="w-full md:w-1/2">
            <label htmlFor="name" className="text-sm font-bold mb-2 block">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="Your Name"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="companyName"
              className="text-sm font-bold mb-2 block"
            >
              Company name:
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => updateFormData("companyName", e.target.value)}
              placeholder="Your Company Name"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
        </motion.div>

        <motion.div
          custom={2}
          variants={itemVariants}
          className="flex flex-col md:flex-row w-full gap-4 md:gap-10"
        >
          <div className="w-full md:w-1/2">
            <label
              htmlFor="companyRegistrationNumber"
              className="text-sm font-bold mb-2 block"
            >
              Company registration number:
            </label>
            <input
              type="text"
              id="companyRegistrationNumber"
              value={formData.companyRegistrationNumber}
              onChange={(e) =>
                updateFormData("companyRegistrationNumber", e.target.value)
              }
              placeholder="Registration Number"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="countryOfRegistration"
              className="text-sm font-bold mb-2 block"
            >
              Country of registration:
            </label>

            <select
              id="country"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
              value={formData.countryOfRegistration}
              onChange={(e) =>
                updateFormData("countryOfRegistration", e.target.value)
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
        </motion.div>

        <motion.div
          custom={3}
          variants={itemVariants}
          className="flex flex-col md:flex-row w-full gap-4 md:gap-10"
        >
          <div className="w-full md:w-1/2">
            <label
              htmlFor="businessAddress"
              className="text-sm font-bold mb-2 block"
            >
              Business address
            </label>
            <input
              type="text"
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) =>
                updateFormData("businessAddress", e.target.value)
              }
              placeholder="Business Address"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="websiteUrl"
              className="text-sm font-bold mb-2 block"
            >
              Website URL:
            </label>
            <input
              type="text"
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={(e) => updateFormData("websiteUrl", e.target.value)}
              placeholder="Website URL"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
        </motion.div>

        <motion.div custom={4} variants={itemVariants} className="w-full mt-6">
          <div className="flex items-center">
            <label htmlFor="licenseImage" className="text-sm font-bold block">
              Upload a license picture of your business
            </label>
            <span className="text-gray-400 font-medium ml-2">Optional</span>
          </div>
          <div className="relative">
            <IoCloudUploadOutline
              size={22}
              className="absolute top-1/2 transform -translate-y-1/2 left-4 text-[#F47458]"
            />
            <input
              type="file"
              id="licenseImage"
              onChange={(e) =>
                updateFormData("licenseImage", e.target.files[0])
              }
              className="w-full block py-4 pl-12 pr-4 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
          <small className="text-gray-500">
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
          className={`w-full md:w-1/2 m-auto py-4 mt-8 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors ${
            loading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Sign Up"}
        </motion.button>

        <motion.div
          custom={6}
          variants={itemVariants}
          className="text-center mt-5"
        >
          Have an account already?{" "}
          <Link className="text-[#F47458] hover:underline" to="/login">
            Login
          </Link>
        </motion.div>
      </motion.form>
    </>
  );
};

export default SellerForm;

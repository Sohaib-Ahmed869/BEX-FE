import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { registerBuyer } from "../../services/AuthServices";

const BuyerForm = ({ formData, updateFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 10000);
  }, [error]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");

      return;
    }

    // Password validation - customize this based on your requirements
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");

      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the registration service
      const result = await registerBuyer(formData);

      if (result.success === false) {
        toast.error(result.error?.message);
        // Handle specific error cases
        setError(
          result.error?.message || "Registration failed. Please try again."
        );
        return;
      }
      toast.success("Registration successful!");
      localStorage.setItem("token", result.token);
      sessionStorage.setItem("jwtToken", result.token);

      localStorage.setItem("role", result.role);
      // Handle successful registration
      console.log("Registration successful:", result);

      navigate("/products");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-3/4 lg:w-1/2 block py-10 px-4 md:px-12 lg:px-16  flex flex-col m-auto"
      >
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6 sm:mb-8 text-center lg:text-left">
          Almost there! Please tell us about yourself
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in animate-duration-1000"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-10">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="first_name"
              className="text-sm font-bold mb-2 block"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={(e) => updateFormData("first_name", e.target.value)}
              placeholder="Your First Name"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="last_name" className="text-sm font-bold mb-2 block">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={(e) => updateFormData("last_name", e.target.value)}
              placeholder="Your Last Name"
              className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
            />
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="email" className="text-sm font-bold mb-2 block">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="Your Email Address"
            className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-sm font-bold mb-2 block">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="Your Password"
            className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
          />
        </div>

        <div className="w-full">
          <label htmlFor="phone" className="text-sm font-bold mb-2 block">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="Your Phone Number"
            className="w-full block py-4 px-4 md:px-6 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 mb-4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-1/2 m-auto py-4 mt-8 ${
            loading ? "bg-gray-400" : "bg-[#F47458] hover:bg-[#e06449]"
          } text-white rounded-lg transition-colors cursor-pointer`}
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>

        <div className="text-center mt-5">
          Have an account already?{" "}
          <Link className="text-[#F47458] hover:underline" to="/login">
            Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default BuyerForm;

"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useGoogleAuth = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Google auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");
    const newUser = urlParams.get("newUser");

    if (error) {
      toast.error("Google authentication failed");
      return;
    }

    if (token && newUser === "true") {
      // New user needs to select role
      setShowRoleModal(true);
      // Store token temporarily
      sessionStorage.setItem("tempGoogleToken", token);
    } else if (token) {
      // Existing user, login successful
      localStorage.setItem("token", token);
      sessionStorage.setItem("jwtToken", token);

      // Get user role and redirect
      fetchUserRole(token);
    }
  }, []);

  const fetchUserRole = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/api/googleauth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await response.json();

      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.first_name);

      if (userData.role === "buyer") {
        navigate("/products");
      } else if (userData.role === "seller") {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to get user information");
    }
  };

  const handleRoleSelect = async (role) => {
    setShowRoleModal(false);

    if (role === "buyer") {
      // Complete buyer registration
      await completeBuyerRegistration();
    } else {
      // Show seller form
      await fetchGoogleUserData();
      setShowSellerForm(true);
    }
  };

  const fetchGoogleUserData = async () => {
    try {
      const token = sessionStorage.getItem("tempGoogleToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/googleauth/google/user-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await response.json();
      setGoogleUserData(userData);
    } catch (error) {
      toast.error("Failed to get user data");
    }
  };

  const completeBuyerRegistration = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("tempGoogleToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/googleauth/google/complete-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: "buyer" }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userName", result.user.first_name);
        sessionStorage.removeItem("tempGoogleToken");

        toast.success("Registration successful!");
        navigate("/products");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const completeSellerRegistration = async (sellerData) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("tempGoogleToken");

      // Create FormData for file upload
      const formData = new FormData();

      // Append all the text fields
      formData.append("role", "seller");
      formData.append("companyName", sellerData.companyName);
      formData.append(
        "companyRegistrationNumber",
        sellerData.companyRegistrationNumber
      );
      formData.append(
        "countryOfRegistration",
        sellerData.countryOfRegistration
      );
      formData.append("businessAddress", sellerData.businessAddress);
      formData.append("websiteUrl", sellerData.websiteUrl);
      formData.append("postalCode", sellerData.postalCode);
      formData.append("city", sellerData.city);
      // Append the file if it exists
      if (sellerData.licenseImage && sellerData.licenseImage instanceof File) {
        formData.append("licenseImage", sellerData.licenseImage);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/googleauth/google/complete-registration`,
        {
          method: "POST",
          headers: {
            // Remove Content-Type header - let browser set it for FormData
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send FormData instead of JSON
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userName", result.user.first_name);
        sessionStorage.removeItem("tempGoogleToken");

        toast.success("Registration successful!");
        setShowSellerForm(false);
        navigate("/product-list");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = () => {
    setShowRoleModal(false);
    setShowSellerForm(false);
    sessionStorage.removeItem("tempGoogleToken");
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return {
    showRoleModal,
    showSellerForm,
    googleUserData,
    loading,
    handleRoleSelect,
    completeSellerRegistration,
    cancelRegistration,
  };
};

export default useGoogleAuth;

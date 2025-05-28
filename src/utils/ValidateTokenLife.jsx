// TokenGuard.jsx
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // You'll need to install this package

const TokenGuard = ({ children }) => {
  const checkTokenValidity = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("jwtToken");

    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decoded.exp < currentTime) {
        // Token has expired
        clearUserData();
        return false;
      }
      return true;
    } catch (error) {
      clearUserData();
      return false;
    }
  };

  const clearUserData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("jwtToken");
  };

  useEffect(() => {
    // Check token validity periodically (every minute)
    const interval = setInterval(() => {
      if (!checkTokenValidity()) {
        window.location.href = "/login";
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!checkTokenValidity()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default TokenGuard;

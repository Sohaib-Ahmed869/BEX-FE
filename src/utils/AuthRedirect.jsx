// AuthRedirect.jsx
import { Navigate } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    // Redirect based on user role
    const redirectPath = role === "seller" ? "/product-list" : "/products";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthRedirect;

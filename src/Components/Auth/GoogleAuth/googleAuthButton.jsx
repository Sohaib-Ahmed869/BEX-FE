import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleAuthButton = ({
  onGoogleAuth,
  loading = false,
  text = "Continue using Google",
}) => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${
      import.meta.env.VITE_REACT_BACKEND_URL
    }/api/googleauth/google`;
  };

  return (
    <button
      type="button"
      onClick={onGoogleAuth || handleGoogleLogin}
      disabled={loading}
      className="flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors w-full"
    >
      <FcGoogle size={18} />
      {loading ? "Processing..." : text}
    </button>
  );
};

export default GoogleAuthButton;

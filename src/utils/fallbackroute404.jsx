import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    setIsFloating(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-red-200 to-pink-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-r from-orange-300 to-red-300 rounded-full opacity-15 animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div
          className={`transform transition-all duration-1000 ${
            isFloating
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative mb-8">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-pink-500 animate-pulse select-none">
              404
            </h1>
            <div
              className="absolute inset-0 text-9xl font-black text-red-200 opacity-20 blur-sm select-none"
              style={{ transform: "translate(4px, 4px)" }}
            >
              404
            </div>
          </div>
        </div>

        {/* Error message */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isFloating
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, even the best explorers sometimes take a
            wrong turn!
          </p>
        </div>

        {/* Animated search icon */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${
            isFloating
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Search
                size={60}
                className="text-gray-400 animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <div className="absolute inset-0 animate-ping">
                <Search size={60} className="text-red-300 opacity-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={`transform transition-all duration-1000 delay-600 ${
            isFloating
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoHome}
              className="group relative px-8 py-3 bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              style={{ backgroundColor: "#f47458" }}
            >
              <Home size={20} className="group-hover:animate-bounce" />
              Go Home
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-700 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleGoBack}
              className="group px-8 py-3 border-2 border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft size={20} className="group-hover:animate-pulse" />
              Go Back
            </button>
          </div>
        </div>

        {/* Countdown timer */}
        <div
          className={`transform transition-all duration-1000 delay-800 ${
            isFloating
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg inline-flex items-center gap-2">
            <RefreshCw
              size={16}
              className={`text-gray-600 ${countdown > 0 ? "animate-spin" : ""}`}
              style={{ animationDuration: "2s" }}
            />
            <span className="text-gray-700 font-medium">
              {countdown > 0
                ? `Redirecting to home in ${countdown}s`
                : "Redirecting..."}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-10 animate-pulse"></div>
        <div
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-red-300 to-orange-300 rounded-full opacity-40 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;

import React, { useState, useEffect } from "react";
import { Search, Bell, Mail, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SellerHeader = () => {
  // Mock data for demonstration (replacing localStorage and Redux)
  const unreadMessages = useSelector(
    (state) => state.unreadMessages.totalUnreadCount
  );
  const userName = localStorage.getItem("userName");
  const [isVisible, setIsVisible] = useState(false);

  // Trigger header animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`p-2 sm:p-4 transition-all duration-700 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-0">
        {/* Search Section */}

        {/* User Actions Section */}
        <div
          className={`flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end order-1 sm:order-2 transition-all duration-500 delay-200 ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
        >
          {/* Notification Icons */}
          <div className="flex items-center gap-2">
            <Link
              to={"/seller/chats"}
              className="relative bg-white p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
            >
              <Bell
                size={16}
                className="sm:w-[18px] sm:h-[18px] text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
              />
              {unreadMessages > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-lg"
                  style={{ backgroundColor: "#f47458" }}
                >
                  <span className="animate-pulse font-medium">
                    {unreadMessages}
                  </span>
                </span>
              )}
            </Link>
            <span className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group">
              <Mail
                size={16}
                className="sm:w-[18px] sm:h-[18px] text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
              />
            </span>
          </div>

          {/* User Profile */}
          <div
            className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group">
              <span className="text-xs sm:text-sm text-gray-500 uppercase font-medium group-hover:text-gray-700 transition-colors duration-200">
                {userName?.length > 0
                  ? userName.split(" ")[0][0] +
                    (userName.split(" ")[1]?.[0] || userName.split(" ")[0][1])
                  : "U"}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium bg-white p-1.5 sm:p-2 flex gap-1 items-center rounded max-w-[120px] sm:max-w-none shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer">
              <span className="truncate hidden sm:inline group-hover:text-gray-700 transition-colors duration-200">
                {userName}
              </span>
              <span className="truncate sm:hidden group-hover:text-gray-700 transition-colors duration-200">
                {userName?.split(" ")[0] || "User"}
              </span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0 group-hover:text-gray-700 group-hover:rotate-180 transition-all duration-300" />
            </span>
          </div>
        </div>
      </div>

      {/* Additional animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/20 to-blue-50/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
    </header>
  );
};

export default SellerHeader;

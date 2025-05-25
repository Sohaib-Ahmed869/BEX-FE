import React from "react";
import { Search, Bell, Mail, ChevronDown } from "lucide-react";

const SellerHeader = () => {
  const userName = localStorage.getItem("userName");
  return (
    <header className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        {/* Search Section */}
        <div className="relative w-full sm:w-auto order-2 sm:order-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-6 pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
          </div>
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 sm:pl-20 pr-4 py-2 sm:py-4 w-full sm:w-70 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
          />
        </div>

        {/* User Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end order-1 sm:order-2">
          {/* Notification Icons */}
          <div className="flex items-center gap-2">
            <span className="bg-white p-1.5 sm:p-2 rounded-lg">
              <Bell
                size={16}
                className="sm:w-[18px] sm:h-[18px] text-gray-500"
              />
            </span>
            <span className="bg-white p-1.5 sm:p-2 rounded-lg">
              <Mail
                size={16}
                className="sm:w-[18px] sm:h-[18px] text-gray-500"
              />
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm text-gray-500 uppercase font-medium">
                {userName?.length > 0
                  ? userName.split(" ")[0][0] +
                    (userName.split(" ")[1]?.[0] || userName.split(" ")[0][1])
                  : "U"}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium bg-white p-1.5 sm:p-2 flex gap-1 items-center rounded max-w-[120px] sm:max-w-none">
              <span className="truncate hidden sm:inline">{userName}</span>
              <span className="truncate sm:hidden">
                {userName?.split(" ")[0] || "User"}
              </span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;

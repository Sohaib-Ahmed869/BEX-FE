import React from "react";
import { Search, Bell, Mail, ChevronDown } from "lucide-react";
const SellerHeader = () => {
  const userName = localStorage.getItem("userName");
  return (
    <header className="p-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <Search className="h-8 w-5 text-orange-400 font-medium" />
          </div>
          <input
            type="text"
            placeholder="Search here..."
            className="pl-20 pr-4 py-4 w-70 block rounded-md  bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-white p-2 rounded-lg">
            <Bell size={18} className=" text-gray-500" />
          </span>
          <span className="bg-white p-2 rounded-lg">
            <Mail size={18} className=" text-gray-500  " />
          </span>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-500 uppercase font-medium">
                {userName?.length > 0
                  ? userName.split(" ")[0][0] + userName.split(" ")[0][1]
                  : "U"}
              </span>
            </div>
            <span className="text-sm  text-gray-500 font-medium bg-white p-2 flex gap-1">
              {userName}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;

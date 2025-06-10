"use client";

import { useState, useEffect } from "react";
import BuyerDisputes from "./OrderDisputes";
import { User } from "lucide-react";

// Example usage component - you can integrate this with your auth system
const BuyerDisputesPage = () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view your disputes</p>
        </div>
      </div>
    );
  }

  return <BuyerDisputes userId={userId} userName={userName} />;
};

export default BuyerDisputesPage;

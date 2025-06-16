import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";
import { fetchUserDetails } from "../../../services/userServices";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import CubeLoader from "../../../utils/cubeLoader";
import UpgradeToSellerModal from "./upgradeToSeller"; // Import your separate modal component
import ShoppingCart from "../Cart/cart";
import WishlistModal from "../wishlist/wishlistModal";

const BuyerProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const userId = localStorage.getItem("userId");
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };
  useEffect(() => {
    const loadUserDetails = async () => {
      if (!userId) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserDetails(userId);
        console.log(data);
        setUserDetails(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [userId]);

  const handleUpgradeSuccess = (result) => {
    // Handle successful upgrade
    console.log("Upgrade successful:", result);

    // Reload user details to reflect changes
    const loadUserDetails = async () => {
      try {
        const data = await fetchUserDetails(userId);
        setUserDetails(data);
      } catch (err) {
        console.error("Error reloading user details:", err);
      }
    };

    loadUserDetails();
    setShowUpgradeModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status, type = "boolean") => {
    if (type === "approval") {
      switch (status) {
        case "approved":
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case "rejected":
          return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
          return <Clock className="w-5 h-5 text-yellow-500" />;
      }
    }
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusText = (status, type = "boolean") => {
    if (type === "approval") {
      return status === "pending"
        ? "Pending"
        : status.charAt(0).toUpperCase() + status.slice(1);
    }
    return status ? "Verified" : "Not Verified";
  };

  const getStatusColor = (status, type = "boolean") => {
    if (type === "approval") {
      switch (status) {
        case "approved":
          return "text-green-600 bg-green-100";
        case "rejected":
          return "text-red-600 bg-red-100";
        default:
          return "text-yellow-600 bg-yellow-100";
      }
    }
    return status ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 text-center">No user details found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerHeader toggleCart={toggleCart} toggleWishlist={toggleWishlist} />
      <div className="max-w-4xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-[#F47458] px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-full">
                  <User className="w-12 h-12 text-[#F47458]" />
                </div>
                <div className="ml-6 text-white">
                  <h1 className="text-3xl font-bold">
                    {userDetails.first_name} {userDetails.last_name}
                  </h1>
                  <p className="text-blue-100 capitalize text-lg">
                    {userDetails.role}
                  </p>
                </div>
              </div>

              {/* Upgrade to Seller Button - Only show for buyers */}
              {userDetails.role === "buyer" && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="group relative flex items-center justify-center bg-gradient-to-r from-white to-gray-50 text-[#F47458] px-8 py-4 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transform transition-all duration-300 ease-out shadow-lg hover:shadow-xl border border-gray-100 hover:border-[#F47458]/20 focus:outline-none focus:ring-4 focus:ring-[#F47458]/20 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#F47458]/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:ease-out"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Become a Seller
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-600">Email</span>
                </div>
                <span className="font-medium text-gray-800">
                  {userDetails.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-600">Phone</span>
                </div>
                <span className="font-medium text-gray-800">
                  {userDetails.phone}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-600">Member Since</span>
                </div>
                <span className="font-medium text-gray-800">
                  {formatDate(userDetails.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-600">Last Updated</span>
                </div>
                <span className="font-medium text-gray-800">
                  {formatDate(userDetails.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Account Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Active</span>
                <div className="flex items-center">
                  {getStatusIcon(userDetails.is_active)}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      userDetails.is_active
                    )}`}
                  >
                    {getStatusText(userDetails.is_active)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                <div className="flex items-center">
                  {getStatusIcon(userDetails.email_verified)}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      userDetails.email_verified
                    )}`}
                  >
                    {getStatusText(userDetails.email_verified)}
                  </span>
                </div>
              </div>

              {userDetails.role === "seller" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seller Verified</span>
                    <div className="flex items-center">
                      {getStatusIcon(userDetails.seller_verified)}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          userDetails.seller_verified
                        )}`}
                      >
                        {getStatusText(userDetails.seller_verified)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seller Status</span>
                    <div className="flex items-center">
                      {getStatusIcon(
                        userDetails.seller_approval_status,
                        "approval"
                      )}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          userDetails.seller_approval_status,
                          "approval"
                        )}`}
                      >
                        {getStatusText(
                          userDetails.seller_approval_status,
                          "approval"
                        )}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Business Information (if available) */}
        {(userDetails.company_name ||
          userDetails.business_address ||
          userDetails.website_url) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userDetails.company_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Company Name
                  </label>
                  <p className="text-gray-800">{userDetails.company_name}</p>
                </div>
              )}

              {userDetails.company_registration_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Registration Number
                  </label>
                  <p className="text-gray-800">
                    {userDetails.company_registration_number}
                  </p>
                </div>
              )}

              {userDetails.country_of_registration && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Country of Registration
                  </label>
                  <p className="text-gray-800">
                    {userDetails.country_of_registration}
                  </p>
                </div>
              )}

              {userDetails.business_address && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Business Address
                  </label>
                  <p className="text-gray-800">
                    {userDetails.business_address}
                  </p>
                </div>
              )}

              {userDetails.website_url && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Website
                  </label>
                  <a
                    href={userDetails.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {userDetails.website_url}
                  </a>
                </div>
              )}
              {userDetails.city && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    City
                  </label>
                  <p className="text-gray-800">{userDetails.city}</p>
                </div>
              )}
              {userDetails.postal_code && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Postal Code
                  </label>
                  <p className="text-gray-800">{userDetails.postal_code}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade to Seller Modal */}
      <UpgradeToSellerModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
      <ShoppingCart isOpen={showCart} setIsOpen={setShowCart} />
      <WishlistModal isOpen={showWishlist} setIsOpen={setShowWishlist} />
    </div>
  );
};

export default BuyerProfile;

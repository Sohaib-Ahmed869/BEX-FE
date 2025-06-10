import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CubeLoader from "../../../utils/cubeLoader";
import { toast } from "react-toastify";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const UserInsights = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [insights, setInsights] = useState({});
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [error, setError] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  // Handle user status toggle (suspend/unsuspend)
  const handleToggleUserStatus = async (userId, currentIsSuspended) => {
    setModalLoading(true);
    try {
      const response = await fetch(`${URL}/api/user/${userId}/suspend`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suspend: !currentIsSuspended,
          reason: suspendReason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the user status in state
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          is_suspended: !currentIsSuspended,
          is_active: currentIsSuspended, // When unsuspending, user becomes active; when suspending, user becomes inactive
        }));
        toast.success(
          `User ${
            !currentIsSuspended ? "suspended" : "unsuspended"
          } successfully`
        );
      } else {
        toast.error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    } finally {
      setModalLoading(false);
      setShowActionModal(false);
      setSelectedUser(null);
      setSuspendReason("");
    }
  };

  // Fetch user insights data
  const fetchUserInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${URL}/api/user/user-insights/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Set user info
        setUserInfo(result.data.userInfo);

        // Set insights data
        setInsights(result.data.insights);

        // Determine user role
        const userRole = result.data.userInfo.role;
        setIsSeller(userRole === "seller");
        setIsBuyer(userRole === "buyer");

        console.log("User insights loaded successfully:", result.data);
      } else {
        throw new Error(result.message || "Failed to fetch user insights");
      }
    } catch (err) {
      console.error("Error fetching user insights:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount or when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserInsights();
    }
  }, [userId]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // Get chart data based on role
  const getChartData = () => {
    if (isSeller) {
      return insights.salesOverview?.chartData || [];
    } else {
      return insights.spendingOverview?.chartData || [];
    }
  };

  // Get chart value key based on role
  const getChartValueKey = () => {
    return isSeller ? "sales" : "spending";
  };

  // Get overview stats based on role
  const getOverviewStats = () => {
    if (isSeller) {
      return [
        {
          label: "Total listing",
          value: insights.listingOverview?.totalListings || 0,
          color: "text-orange-500",
        },
        {
          label: "Active listing",
          value: insights.listingOverview?.activeListings || 0,
          color: "text-orange-500",
        },
        {
          label: "Flagged listing",
          value:
            insights.listingOverview?.totalListings -
              insights.listingOverview?.activeListings || 0,
          color: "text-orange-500",
        },
        {
          label: "Out of stock products",
          value: insights.listingOverview?.outOfStockProducts || 0,
          color: "text-orange-500",
        },
      ];
    } else {
      return [
        {
          label: "Total orders",
          value: insights.orderOverview?.totalOrders || 0,
          color: "text-blue-500",
        },
        {
          label: "Completed orders",
          value: insights.orderOverview?.completedOrders || 0,
          color: "text-green-500",
        },
        {
          label: "Pending orders",
          value: insights.orderOverview?.pendingOrders || 0,
          color: "text-yellow-500",
        },
        {
          label: "Cancelled orders",
          value: insights.orderOverview?.cancelledOrders || 0,
          color: "text-red-500",
        },
      ];
    }
  };

  // Get user status styling
  const getUserStatus = (user) => {
    if (user.is_suspended) {
      return { text: "Suspended", className: "bg-red-500" };
    } else if (user.status === "Active profile") {
      return { text: "Active", className: "bg-green-500" };
    } else {
      return { text: "Inactive", className: "bg-gray-500" };
    }
  };

  // Action Modal Component
  const ActionModal = ({ isOpen, user, onClose, onConfirm }) => {
    if (!isOpen || !user) return null;

    const isSuspended = user.is_suspended;
    const action = isSuspended ? "unsuspend" : "suspend";
    const actionText = isSuspended ? "Unsuspend" : "Suspend";

    return (
      <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-1/3 mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle
              className={`h-6 w-6 mr-3 ${
                isSuspended ? "text-green-500" : "text-red-500"
              }`}
            />
            <h3 className="text-lg font-semibold">{actionText} user</h3>
          </div>

          {!isSuspended ? (
            // Suspend user content
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You're about to suspend this user from accessing the platform.
                While suspended, the user will:
              </p>
              <ul className="text-gray-700 mb-4 ml-4">
                <li className="mb-1">
                  • Be unable to log in or perform any actions
                </li>
                <li className="mb-1">
                  • Lose access to all company modules and data
                </li>
              </ul>
              <p className="text-gray-700">
                This action does not delete the account, and access can be
                restored later by reactivating the user.
              </p>
            </div>
          ) : (
            // Unsuspend user content
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You're about to unsuspend this user and restore their access to
                the platform. Once unsuspended, the user will:
              </p>
              <ul className="text-gray-700 mb-4 ml-4">
                <li className="mb-1">
                  • Be able to log in and perform actions
                </li>
                <li className="mb-1">
                  • Regain access to all company modules and data
                </li>
              </ul>
              <p className="text-gray-700">
                The user will be immediately able to access their account and
                resume normal activities.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={modalLoading}
              className="px-4 py-2 border w-1/2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(user.id, user.is_suspended)}
              disabled={modalLoading}
              className={`px-4 py-2 w-1/2 rounded-md text-white disabled:opacity-50 ${
                isSuspended
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modalLoading ? "Processing..." : `${actionText} user`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <CubeLoader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              User Insight
            </h1>
            <button
              onClick={() => {
                setSelectedUser(userInfo);
                setShowActionModal(true);
              }}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                userInfo.is_suspended
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {userInfo.is_suspended ? "Unsuspend user" : "Suspend user"}
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userInfo.name}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({isSeller ? "Sales manager" : "Buyer"})
                  </span>
                </h2>
                <p className="text-gray-600">{userInfo.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Company name:</p>
                  <p className="font-medium">{userInfo.companyName || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    getUserStatus(userInfo).className
                  }`}
                ></div>
                <div>
                  <p className="text-gray-500">Status:</p>
                  <p className="font-medium">{getUserStatus(userInfo).text}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Joining date:</p>
                  <p className="font-medium">{formatDate(userInfo.joinDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSeller ? "Listing overview" : "Order overview"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {getOverviewStats().map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className={`text-sm ${stat.color} mb-1`}>{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sales/Spending Overview Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isSeller ? "Sales overview" : "Spending overview"}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Line
                    type="monotone"
                    dataKey={getChartValueKey()}
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transaction History / Purchase History */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isSeller ? "Transaction history" : "Purchase history"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-500">
                    {isSeller ? "Buyer" : "Product"}
                  </th>
                  <th className="pb-3 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(isSeller
                  ? insights.transactionHistory
                  : insights.purchaseHistory || []
                )
                  .slice(0, 5)
                  .map((transaction, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 text-gray-600">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 text-gray-900">
                        {isSeller
                          ? transaction.buyer
                          : transaction.productTitle}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === "approved" ||
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending approval" ||
                                transaction.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status === "approved"
                            ? "Completed"
                            : transaction.status === "pending approval"
                            ? "Processing"
                            : transaction.status === "rejected"
                            ? "Cancelled"
                            : transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section - Dispute Performance for Sellers, Category Preferences for Buyers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isSeller ? "Dispute performance" : "Category preferences"}
            </h3>
            {isSeller && (
              <Link
                to="/admin/disputes"
                className="text-blue-600 cursor-pointer text-sm hover:text-blue-800"
              >
                View disputes
              </Link>
            )}
          </div>

          {isSeller ? (
            // Seller Dispute Performance
            <div className="grid grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Total disputes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.disputePerformance?.totalDisputes || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Resolved vs Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insights.disputePerformance?.resolutionRatio || "0:0"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Most common dispute
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {insights.disputePerformance?.commonDispute || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            // Buyer Category Preferences
            <div className="space-y-4">
              {insights.categoryPreferences?.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {category.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>Total: {formatCurrency(category.totalSpent)}</span>
                    <span>Orders: {category.orderCount}</span>
                    <span>Items: {category.itemsPurchased}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        user={selectedUser}
        onClose={() => {
          setShowActionModal(false);
          setSelectedUser(null);
          setSuspendReason("");
        }}
        onConfirm={handleToggleUserStatus}
      />
    </div>
  );
};

export default UserInsights;

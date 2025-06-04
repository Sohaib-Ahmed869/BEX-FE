import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Settings,
  Calendar,
  Hash,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { initiateChat } from "../../../services/chatServices";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const BuyerOrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [allOrderItems, setAllOrderItems] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [showDispute, setShowDispute] = useState(false);
  const [isMessageLoading, setMessageIsLoading] = useState(false);
  const [disputeItem, setDisputeItem] = useState(null);
  const [disputeForm, setDisputeForm] = useState({
    email: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const handleSendMessage = async (productId) => {
    if (!userId || !productId) {
      alert("User ID and Product ID are required");
      return;
    }

    setMessageIsLoading(true);
    try {
      await initiateChat(userId, productId);
      // Navigation happens automatically in the service function
    } catch (error) {
      console.error("Failed to initiate chat:", error.message);
      toast.error(`Failed to start chat: ${error.message}`);
    } finally {
      setMessageIsLoading(false);
    }
  };
  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}/api/orders/buyerOrders/${userId}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.data.orders);

          // Extract all order items with their parent order details
          const items = [];
          data.data.orders.forEach((order) => {
            order.items.forEach((item) => {
              items.push({
                ...item,
                parentOrder: {
                  orderId: order.orderId,
                  orderDate: order.orderDate,
                  shippingAddress: order.shippingAddress,
                  platformFee: order.platformFee,
                  shippingCost: order.shippingCost,
                  grandTotal: order.grandTotal,
                  buyer: order.buyer,
                },
              });
            });
          });

          setAllOrderItems(items);
          if (items.length > 0) {
            setSelectedOrderItem(items[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      case "pending approval":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending approval":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDisputeClick = (item) => {
    setDisputeItem(item);
    setShowDispute(true);
  };

  const handleDisputeSubmit = async () => {
    try {
      setSubmissionLoading(true);

      const disputeData = {
        userId: userId,
        email: disputeForm.email,
        disputeCategory: disputeForm.category,
        description: disputeForm.description,
        orderId: disputeItem.parentOrder.orderId,
        orderItemId: disputeItem.orderItemId,
        productId: disputeItem.productId,
      };

      const response = await fetch(`${URL}/api/orderdispute/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(disputeData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        toast.success(
          "Dispute created successfully! Our team will review your case."
        );
        setShowDispute(false);
        setDisputeForm({
          email: "",
          category: "Technical issue",
          description: "",
        });
      } else {
        // Show error message
        toast.error(
          result.message || "Failed to create dispute. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating dispute:", error);
      alert("Failed to create dispute. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  const getItemProgress = (item) => {
    switch (item.orderStatus.toLowerCase()) {
      case "approved":
        return 3; // Order confirmation
      case "pending approval":
        return 2; // Order placed
      case "rejected":
        return -1; // Rejected (special case)
      default:
        return 1;
    }
  };

  const getItemProgressText = (item) => {
    switch (item.orderStatus.toLowerCase()) {
      case "approved":
        return "Order Confirmed";
      case "pending approval":
        return "Order Processing";
      case "rejected":
        return "Order Rejected";
      default:
        return "Order Processing";
    }
  };

  const hasRetipping = (item) => {
    return item.retipAdded && item.product.category === "Core Drill Bits";
  };

  const ItemProgressBar = ({ item }) => {
    const progress = getItemProgress(item);
    const isRejected = item.orderStatus.toLowerCase() === "rejected";
    const needsRetipping = hasRetipping(item);

    const steps = needsRetipping
      ? [
          "Order placed",
          "Order confirmation",
          "Order processing",
          "Sent for retipping",
          "Picked by logistics",
          "Dispatched",
        ]
      : [
          "Order placed",
          "Order confirmation",
          "Order processing",
          "Picked by logistics",
          "Dispatched",
        ];

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        {/* Progress Steps */}
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />

          {/* Active Progress Line */}
          <div
            className={`absolute top-5 left-5 h-0.5 z-0 transition-all duration-500 ease-in-out ${
              isRejected ? "bg-red-300" : "bg-green-300"
            }`}
            style={{
              width: isRejected
                ? "0%"
                : `${Math.max(
                    0,
                    ((progress - 1) / (steps.length - 1)) * 100
                  )}%`,
            }}
          />

          {/* Steps Container */}
          <div className="relative z-10 flex justify-between items-start">
            {steps.map((step, index) => {
              const isActive = !isRejected && index < progress;
              const isCurrent = !isRejected && index === progress - 1;
              const isCompleted = !isRejected && index < progress - 1;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm relative ${
                      isRejected && index === 0
                        ? "bg-red-500 border-red-500 shadow-red-200"
                        : isRejected && index > 0
                        ? "bg-red-50 border-red-200"
                        : isCompleted
                        ? "bg-green-500 border-green-500 shadow-green-200"
                        : isCurrent
                        ? "bg-orange-500 border-orange-500 shadow-orange-200 ring-4 ring-orange-100"
                        : isActive
                        ? "bg-orange-500 border-orange-500 shadow-orange-200"
                        : "bg-white border-gray-300 shadow-gray-100"
                    }`}
                  >
                    {/* Step Icon */}
                    {isRejected && index === 0 ? (
                      <XCircle className="w-5 h-5 text-white" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    ) : isActive ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}

                    {/* Step Number (small screens) */}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center sm:hidden">
                      {index + 1}
                    </span>
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                        isRejected && index === 0
                          ? "text-red-600"
                          : isRejected && index > 0
                          ? "text-red-300"
                          : isActive || isCurrent
                          ? "text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="hidden sm:inline">{step}</span>
                      <span className="sm:hidden">Step {index + 1}</span>
                    </span>

                    {/* Status Indicator */}
                    {isCurrent && !isRejected && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          In Progress
                        </span>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rejection Message */}
          {isRejected && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Order has been rejected
                </span>
              </div>
            </div>
          )}

          {/* Progress Percentage (for completed orders) */}
          {!isRejected && progress === steps.length && (
            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Order completed successfully!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Step Details */}
        <div className="mt-6 sm:hidden">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Current Step:
            </h4>
            <p className="text-sm text-gray-600">
              {isRejected
                ? "Order Rejected"
                : progress <= steps.length
                ? steps[Math.max(0, progress - 1)]
                : "Completed"}
            </p>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return <CubeLoader />;
  }

  if (!selectedOrderItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50">
      <BuyerHeader />
      <div className="max-w-7xl my-7 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link
                to="/products"
                className="hover:text-orange-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-orange-600 font-medium">Track order</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Order ID:{" "}
                    {selectedOrderItem.parentOrder.orderId.slice(0, 8)}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Order date:{" "}
                      {formatDate(selectedOrderItem.parentOrder.orderDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <ItemProgressBar item={selectedOrderItem} />

            {/* Order Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order details:
              </h2>

              <div className="space-y-4">
                {/* Selected Item */}
                <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={
                      selectedOrderItem.product.images[0] ||
                      "https://via.placeholder.com/80x80?text=No+Image"
                    }
                    alt={selectedOrderItem.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {selectedOrderItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedOrderItem.product.condition}
                    </p>
                    {hasRetipping(selectedOrderItem) && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Settings className="w-3 h-3 mr-1" />
                          Retipping Required
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${selectedOrderItem.lineTotal}
                    </div>
                    <div className="text-sm text-gray-600">
                      Qty: {selectedOrderItem.quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary and Delivery Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order summary:
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub total</span>
                    <span className="text-gray-900">
                      ${selectedOrderItem.lineTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      ${(selectedOrderItem.lineTotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commission fee</span>
                    <span className="text-gray-900">
                      ${(selectedOrderItem.lineTotal * 0.02).toFixed(2)}
                    </span>
                  </div>
                  {selectedOrderItem.retipAdded && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Retipping</span>
                      <span className="text-gray-900">
                        ${selectedOrderItem.retipPrice}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-orange-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${selectedOrderItem.itemGrandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Delivery address:
                </h3>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrderItem.parentOrder.shippingAddress.name}
                  </div>
                  <div className="text-gray-600">
                    {
                      selectedOrderItem.parentOrder.shippingAddress.address
                        .line1
                    }
                  </div>
                  <div className="text-gray-600">
                    {selectedOrderItem.parentOrder.shippingAddress.address.city}
                    ,{" "}
                    {
                      selectedOrderItem.parentOrder.shippingAddress.address
                        .state
                    }
                  </div>
                  <div className="text-gray-600">
                    {
                      selectedOrderItem.parentOrder.shippingAddress.address
                        .country
                    }
                  </div>
                  <div className="text-gray-600">
                    {
                      selectedOrderItem.parentOrder.shippingAddress.address
                        .postal_code
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">
                  Need help with order?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDisputeClick(selectedOrderItem)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Open dispute
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage(selectedOrderItem.productId)
                    }
                    disabled={isMessageLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    {isMessageLoading ? "Starting Chat..." : "Chat with Seller"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Other Orders */}
          <div className="lg:col-span-1">
            <div className="bg-white  rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Other orders:
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allOrderItems
                  .filter(
                    (item) => item.orderItemId !== selectedOrderItem.orderItemId
                  )
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.orderItemId}
                      className="cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                      onClick={() => setSelectedOrderItem(item)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            item.product.images[0] ||
                            "https://via.placeholder.com/40x40?text=No+Image"
                          }
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/40x40?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              Order ID: {item.parentOrder.orderId.slice(0, 8)}
                            </span>
                          </div>
                          <div className=" ml-1 text-xs text-gray-600 mb-1">
                            Order date: {formatDate(item.parentOrder.orderDate)}
                          </div>
                          <div className="text-xs">
                            <span className="ml-1 text-gray-600 block">
                              Order status:
                            </span>
                            <span
                              className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                item.orderStatus.toLowerCase() === "approved"
                                  ? "bg-green-50 text-green-700"
                                  : item.orderStatus.toLowerCase() ===
                                    "pending approval"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {item.orderStatus === "approved"
                                ? "Order Processing"
                                : item.orderStatus === "pending approval"
                                ? "Pending Approval"
                                : "Rejected"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDispute && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-up">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Open Dispute
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Item: {disputeItem?.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Facing an issue? Share the details and our team will step in to
                review and assist.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  value={disputeForm.email}
                  onChange={(e) =>
                    setDisputeForm({ ...disputeForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispute category:
                </label>
                <select
                  value={disputeForm.category}
                  onChange={(e) =>
                    setDisputeForm({ ...disputeForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  <option value="product_quality">Product Quality</option>
                  <option value="shipping_delay">Shipping Delay</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="damaged_item">Damaged Item</option>
                  <option value="not_received">Not Received</option>
                  <option value="billing_issue">Billing Issue</option>
                  <option value="refund_request">Refund Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  value={disputeForm.description}
                  onChange={(e) =>
                    setDisputeForm({
                      ...disputeForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your issue..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowDispute(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisputeSubmit}
                  disabled={submissionLoading}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submissionLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submissionLoading ? "Sending..." : "Send dispute"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuyerOrderDetails;

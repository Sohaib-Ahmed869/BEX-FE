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
  User,
  ShoppingBag,
  Filter,
  Search,
  X,
  Menu,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  initiateBuyerOrderChat,
  initiateChat,
} from "../../../services/chatServices";
import ShoppingCart from "../Cart/cart";
import WishlistModal from "../wishlist/wishlistModal";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const BuyerOrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [showDispute, setShowDispute] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMessageLoading, setMessageIsLoading] = useState(false);
  const [disputeItem, setDisputeItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const userEmail = localStorage.getItem("UserEmail");
  const [disputeForm, setDisputeForm] = useState({
    email: userEmail,
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  const handleSendMessage = async (orderItemId) => {
    if (!userId || !orderItemId) {
      alert("User ID and OrderItem ID are required");
      return;
    }

    setMessageIsLoading(true);
    try {
      await initiateBuyerOrderChat(userId, orderItemId);
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
          const sortedOrders = data.data.orders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders);

          if (sortedOrders.length > 0) {
            setSelectedOrder(sortedOrders[0]);
            if (sortedOrders[0].items.length > 0) {
              setSelectedOrderItem(sortedOrders[0].items[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.orderStatus === statusFilter)
      );
    }

    // Payment filter
    if (paymentFilter !== "all") {
      const isCompleted = paymentFilter === "completed";
      filtered = filtered.filter(
        (order) => order.paymentCompleted === isCompleted
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter(
          (order) => new Date(order.orderDate) >= filterDate
        );
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      case "pending approval":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "processing":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "shipped":
        return "text-purple-700 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending approval":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Settings className="w-4 h-4" />;
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
        orderId: selectedOrder.orderId,
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
        toast.success(
          "Dispute created successfully! Our team will review your case."
        );
        setShowDispute(false);
        setDisputeForm({
          email: userEmail,
          category: "",
          description: "",
        });
      } else {
        toast.error(
          result.message || "Failed to create dispute. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating dispute:", error);
      toast.error("Failed to create dispute. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  const getItemProgress = (status) => {
    switch (status.toLowerCase()) {
      case "pending approval":
        return { step: 1, total: 6 };
      case "approved":
        return { step: 2, total: 6 };
      case "processing":
        return { step: 3, total: 6 };
      case "shipped":
        return { step: 5, total: 6 };
      case "delivered":
        return { step: 6, total: 6 };
      case "rejected":
        return { step: -1, total: 6 };
      default:
        return { step: 1, total: 6 };
    }
  };

  const hasRetipping = (item) => {
    return item.retipAdded && item.product.category === "Core Drill Bits";
  };

  const getProgressSteps = (item) => {
    const needsRetipping = hasRetipping(item);

    return needsRetipping
      ? [
          "Order Placed",
          "Order Confirmed",
          "Processing",
          "Retipping",
          "Shipped",
          "Delivered",
        ]
      : [
          "Order Placed",
          "Order Confirmed",
          "Processing",
          "Shipped",
          "Delivered",
        ];
  };

  const ItemProgressBar = ({ item }) => {
    const progress = getItemProgress(item.orderStatus);
    const isRejected = item.orderStatus.toLowerCase() === "rejected";
    const steps = getProgressSteps(item);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Progress
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Status: {item.orderStatus}</span>
            <span>
              {isRejected ? "0" : progress.step}/
              {isRejected ? steps.length : steps.length} steps
            </span>
          </div>
        </div>

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
                    ((progress.step - 1) / (steps.length - 1)) * 100
                  )}%`,
            }}
          />

          {/* Steps Container */}
          <div className="relative z-10 flex justify-between items-start">
            {steps.map((step, index) => {
              const isActive = !isRejected && index < progress.step;
              const isCurrent = !isRejected && index === progress.step - 1;
              const isCompleted = !isRejected && index < progress.step - 1;

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

                    {/* Step Number (mobile) */}
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

          {/* Completion Message */}
          {!isRejected && progress.step === steps.length && (
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
                : progress.step <= steps.length
                ? steps[Math.max(0, progress.step - 1)]
                : "Completed"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const selectOrderAndItem = (order, item = null) => {
    setSelectedOrder(order);
    setSelectedOrderItem(item || order.items[0]);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setPaymentFilter("all");
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerHeader toggleCart={toggleCart} toggleWishlist={toggleWishlist} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerHeader toggleCart={toggleCart} toggleWishlist={toggleWishlist} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Header with Filters Toggle */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div
          className={`${showFilters || !isMobile ? "block" : "hidden"} mb-6`}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Order ID or product name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Payments</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              dateFilter !== "all") && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-2 text-orange-600 hover:text-orange-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {paymentFilter !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Payment: {paymentFilter}
                      <button
                        onClick={() => setPaymentFilter("all")}
                        className="ml-2 text-green-600 hover:text-green-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dateFilter !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Date: {dateFilter}
                      <button
                        onClick={() => setDateFilter("all")}
                        className="ml-2 text-purple-600 hover:text-purple-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex mb-6" aria-label="Breadcrumb">
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
            <li className="text-orange-600 font-medium">Track Orders</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Sidebar Overlay */}
          {isMobile && showSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Orders Sidebar */}
          <div
            className={`${
              isMobile
                ? `fixed top-0 right-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
                    showSidebar ? "translate-x-0" : "translate-x-full"
                  }`
                : "lg:col-span-1"
            }`}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 h-full overflow-hidden">
              {/* Mobile Sidebar Header */}
              {isMobile && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <h3 className="font-semibold text-gray-900">All Orders</h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="hidden lg:block mb-4">
                <h3 className="font-semibold text-gray-900">
                  All Orders ({filteredOrders.length})
                </h3>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-96 lg:max-h-full">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No orders match your filters
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className={`cursor-pointer p-3 border rounded-lg transition-all duration-200 ${
                        selectedOrder?.orderId === order.orderId
                          ? "border-orange-300 bg-orange-50 shadow-sm"
                          : "border-gray-200 hover:border-orange-200 hover:bg-orange-25"
                      }`}
                      onClick={() => selectOrderAndItem(order)}
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm text-gray-900">
                            {order.orderId.slice(0, 8)}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Order Date */}
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(order.orderDate)}
                      </div>

                      {/* Order Items Preview */}
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={item.orderItemId}
                            className="flex items-center space-x-2"
                          >
                            <img
                              src={
                                item.product.images[0] ||
                                "https://via.placeholder.com/32x32?text=No+Image"
                              }
                              alt={item.title}
                              className="w-8 h-8 object-cover rounded flex-shrink-0"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/32x32?text=No+Image";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-900 truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                    item.orderStatus
                                  )}`}
                                >
                                  {getStatusIcon(item.orderStatus)}
                                  <span className="ml-1">
                                    {item.orderStatus}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-gray-500 pl-10">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>

                      {/* Order Total and Payment Status */}
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900">
                            ${order.grandTotal}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-gray-500">Payment:</span>
                          <span
                            className={`font-medium ${
                              order.paymentCompleted
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          >
                            {order.paymentCompleted ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Order #{selectedOrder.orderId.slice(0, 8)}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Order date: {formatDate(selectedOrder.orderDate)}
                    </div>
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      {selectedOrder.items.length} item
                      {selectedOrder.items.length > 1 ? "s" : ""}
                    </div>
                    <div
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.paymentCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedOrder.paymentCompleted
                        ? "Payment Completed"
                        : "Payment Pending"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Selection (Mobile) */}
              {isMobile && selectedOrder.items.length > 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Item to Track:
                  </label>
                  <select
                    value={selectedOrderItem?.orderItemId || ""}
                    onChange={(e) => {
                      const item = selectedOrder.items.find(
                        (item) => item.orderItemId === e.target.value
                      );
                      setSelectedOrderItem(item);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {selectedOrder.items.map((item) => (
                      <option key={item.orderItemId} value={item.orderItemId}>
                        {item.title} - {item.orderStatus}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {selectedOrderItem && <ItemProgressBar item={selectedOrderItem} />}

            {/* Order Items (Desktop) or Selected Item Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isMobile ? "Item Details" : "Order Items"}
              </h2>

              <div className="space-y-4">
                {isMobile
                  ? // Mobile: Show only selected item
                    selectedOrderItem && (
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                selectedOrderItem.orderStatus
                              )}`}
                            >
                              {getStatusIcon(selectedOrderItem.orderStatus)}
                              <span className="ml-1">
                                {selectedOrderItem.orderStatus}
                              </span>
                            </span>
                            {hasRetipping(selectedOrderItem) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                <Settings className="w-3 h-3 mr-1" />
                                Retipping Required
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Unit Price:</span>
                              <span className="font-medium">
                                ${selectedOrderItem.unitPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">
                                {selectedOrderItem.quantity}
                              </span>
                            </div>
                            {selectedOrderItem.retipAdded && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Retipping:
                                </span>
                                <span className="font-medium">
                                  ${selectedOrderItem.retipPrice}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-1 mt-1">
                              <span className="font-medium">Total:</span>
                              <span className="font-semibold">
                                ${selectedOrderItem.itemGrandTotal}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  : // Desktop: Show all items
                    selectedOrder.items.map((item) => (
                      <div
                        key={item.orderItemId}
                        className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOrderItem?.orderItemId === item.orderItemId
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 hover:border-orange-200"
                        }`}
                        onClick={() => setSelectedOrderItem(item)}
                      >
                        <img
                          src={
                            item.product.images[0] ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product.condition}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                item.orderStatus
                              )}`}
                            >
                              {getStatusIcon(item.orderStatus)}
                              <span className="ml-1">{item.orderStatus}</span>
                            </span>
                            {hasRetipping(item) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                <Settings className="w-3 h-3 mr-1" />
                                Retipping Required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${item.itemGrandTotal}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Order Summary and Delivery Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isMobile && selectedOrderItem
                    ? "Item Summary"
                    : "Order Summary"}
                </h3>
                <div className="space-y-3">
                  {isMobile && selectedOrderItem ? (
                    // Mobile: Show selected item summary
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Item Total</span>
                        <span className="text-gray-900">
                          ${selectedOrderItem.lineTotal}
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
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="text-gray-900">
                          ${(selectedOrderItem.lineTotal * 0.1).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission (2%)</span>
                        <span className="text-gray-900">
                          ${(selectedOrderItem.lineTotal * 0.02).toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between font-semibold text-gray-900">
                          <span>Item Total</span>
                          <span>${selectedOrderItem.itemGrandTotal}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Desktop: Show full order summary
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sub total</span>
                        <span className="text-gray-900">
                          ${selectedOrder.itemsSubtotal}
                        </span>
                      </div>
                      {selectedOrder.retippingTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Retipping</span>
                          <span className="text-gray-900">
                            ${selectedOrder.retippingTotal}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform fee</span>
                        <span className="text-gray-900">
                          ${selectedOrder.platformFee}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-orange-600 font-medium">
                          {selectedOrder.shippingCost > 0
                            ? `${selectedOrder.shippingCost}`
                            : "Free"}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between font-semibold text-gray-900">
                          <span>Total</span>
                          <span>${selectedOrder.grandTotal}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Delivery Address
                </h3>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrder.shippingAddress.name}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shippingAddress.address.line1}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shippingAddress.address.city},{" "}
                    {selectedOrder.shippingAddress.address.state}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shippingAddress.address.country}
                  </div>
                  <div className="text-gray-600">
                    {selectedOrder.shippingAddress.address.postal_code}
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col space-y-4">
                <span className="text-gray-900 font-medium text-sm sm:text-base">
                  Need help with{" "}
                  {isMobile && selectedOrderItem ? "this item" : "this order"}?
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/orderDisputes"
                    className="flex-1 px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center text-sm sm:text-base"
                  >
                    View Disputes
                  </Link>
                  <button
                    onClick={() => handleDisputeClick(selectedOrderItem)}
                    className="flex-1 px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                  >
                    Open Dispute
                  </button>
                  {selectedOrderItem && (
                    <button
                      onClick={() =>
                        handleSendMessage(selectedOrderItem.orderItemId)
                      }
                      disabled={isMessageLoading}
                      className="flex-1 px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isMessageLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          Chat with Seller
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDispute && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-scale-up">
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

      <ShoppingCart isOpen={showCart} setIsOpen={setShowCart} />
      <WishlistModal isOpen={showWishlist} setIsOpen={setShowWishlist} />
    </div>
  );
};

export default BuyerOrderDetails;

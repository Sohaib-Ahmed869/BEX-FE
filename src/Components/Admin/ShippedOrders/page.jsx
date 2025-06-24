import React, { useState, useEffect } from "react";
import {
  Eye,
  Package,
  User,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  X,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Building,
  Globe,
  CreditCard,
  Truck,
  AlertCircle,
  Check,
  CheckCircle,
  Send,
  Calculator,
  TrendingUp,
  Percent,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";

import { toast, ToastContainer, Bounce } from "react-toastify";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const ShippedOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Payout modal states
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedOrderForPayout, setSelectedOrderForPayout] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutCalculation, setPayoutCalculation] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const API_URL = `${URL}/api/orders/get-all-shipped-orders`;

  const fetchCommissions = async () => {
    try {
      const response = await fetch(`${URL}/api/admin/commission`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch commissions");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setCommissions(data.data);
      } else {
        console.error("Invalid commission data format");
        setCommissions([]);
      }
    } catch (err) {
      console.error("Error fetching commissions:", err);
      setCommissions([]);
    }
  };

  // Fetch shipped orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orderItems);
        setTotalOrders(data.data.pagination.totalItems);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setError(data.message || "Failed to fetch shipped orders");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching shipped orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle filter changes

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = Math.min(totalPages - 1, 4);
      if (currentPage >= totalPages - 2) start = Math.max(2, totalPages - 3);

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // Open modal with order details
  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Open payout modal
  const openPayoutModal = (order) => {
    setSelectedOrderForPayout(order);
    setShowPayoutModal(true);
    calculatePayout(order);
  };

  // Close payout modal
  const closePayoutModal = () => {
    setShowPayoutModal(false);
    setSelectedOrderForPayout(null);
    setPayoutCalculation(null);
  };

  // Calculate payout preview with correct commission
  const calculatePayout = (order) => {
    setIsCalculating(true);

    // Add a small delay to show the calculating animation
    setTimeout(() => {
      const itemTotal = parseFloat(order.price) * parseInt(order.quantity);

      // Find commission rate for this product category
      const categoryCommission = commissions.find(
        (comm) => comm.category === order.category
      );

      const commissionRate = categoryCommission
        ? parseFloat(categoryCommission.commission_rate)
        : 0;
      const platformCommission = (itemTotal * commissionRate) / 100;

      // Calculate gross payout (after platform commission but before Stripe fees)
      const grossPayout = itemTotal - platformCommission;

      // Stripe transfer fees for Express accounts: 0.25% + $0.25 per payout
      const stripePercentageFee = grossPayout * 0.0025; // 0.25%
      const stripeFixedFee = 0.25; // $0.25 per payout
      const totalStripeFee = stripePercentageFee + stripeFixedFee;

      // Calculate final payout amount (what seller actually receives)
      const sellerPayout = grossPayout - totalStripeFee;

      setPayoutCalculation({
        itemTotal,
        commissionRate,
        platformCommission,
        grossPayout,
        stripePercentageFee,
        stripeFixedFee,
        totalStripeFee,
        sellerPayout: Math.max(0, sellerPayout),
        categoryFound: !!categoryCommission,
        categoryName: order.category,
      });

      setIsCalculating(false);
    }, 800);
  };

  // Process payout
  const processPayout = async () => {
    if (!selectedOrderForPayout) return;

    setPayoutLoading(true);
    try {
      const response = await fetch(`${URL}/api/stripe-connect/payout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItemId: selectedOrderForPayout.orderItemId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Payout created successfully");
        closePayoutModal();
        fetchOrders(); // Refresh orders to update payout status
      } else {
        toast.error(data.error || "Failed to create payout");
      }
    } catch (err) {
      console.error("Error creating payout:", err);
      toast.error("Failed to create payout");
    } finally {
      setPayoutLoading(false);
    }
  };

  const getOrderStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { text: "Approved", className: "bg-green-100 text-green-700" };
      case "refunded":
        return { text: "Refunded", className: "bg-green-100 text-green-700" };
      case "completed":
        return { text: "Completed", className: "bg-green-100 text-green-700" };
      case "pending":
        return { text: "Pending", className: "bg-yellow-100 text-yellow-700" };
      case "rejected":
        return { text: "Rejected", className: "bg-red-100 text-red-700" };
      case "processing":
        return { text: "Processing", className: "bg-blue-100 text-blue-700" };
      default:
        return {
          text: status || "Unknown",
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getSellerPayoutStatusStyle = (ispaid) => {
    if (ispaid) {
      return { text: "Paid", className: "bg-green-100 text-green-700" };
    } else {
      return { text: "Unpaid", className: "bg-red-100 text-red-700" };
    }
  };

  if (loading) {
    return <CubeLoader />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Bounce}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mt-10 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Shipped Orders
          </h1>
          <p className="text-gray-600">
            Manage and process seller payouts for shipped orders
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Total Shipped Orders:{" "}
                <span className="text-green-600 font-bold">{totalOrders}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6 animate-shake">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">Error: {error}</p>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="animate-bounce">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                </div>
                <p className="text-gray-500 mb-4 text-lg font-medium">
                  No Shipped orders found
                </p>
                <p className="text-gray-400 text-sm">
                  Shipped orders will appear here when available
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          #
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Order ID
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Item
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Customer
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Seller
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Amount
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Order Status
                        </th>
                        <th className="py-4 px-4 text-nowrap text-left font-semibold text-sm text-gray-700">
                          Seller Payout
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Date
                        </th>
                        <th className="py-4 px-4 text-left font-semibold text-sm text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => {
                        const orderStatus = getOrderStatusStyle(
                          order.orderStatus
                        );
                        const sellerPayoutStatus = getSellerPayoutStatusStyle(
                          order.seller_paid
                        );
                        return (
                          <tr
                            key={order.orderItemId}
                            className={`border-b border-gray-100 ${
                              index % 2 !== 0 ? "bg-white" : "bg-gray-50/50"
                            } hover:bg-blue-50/50 transition-all duration-200 hover:shadow-sm`}
                          >
                            <td className="py-4 px-4 border-r border-gray-100 text-gray-600 font-medium">
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <div className="font-medium text-gray-900">
                                {order.orderId.slice(0, 8)}
                              </div>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                                Item: {order.orderItemId.slice(0, 8)}
                              </div>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <div className="font-medium text-gray-900 mb-1">
                                {order.itemTitle}
                              </div>
                              <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block">
                                {order.category}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Qty: {order.quantity} ×{" "}
                                {formatCurrency(order.price)}
                              </div>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <div className="font-medium text-gray-900">
                                {order.buyer.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.buyer.email}
                              </div>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <div className="font-medium text-gray-900">
                                {order.seller.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.seller.companyName}
                              </div>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <div className="font-bold text-green-600 text-lg">
                                {formatCurrency(order.grandTotal)}
                              </div>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <span
                                className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${orderStatus.className} transition-all duration-200 hover:shadow-md`}
                              >
                                {orderStatus.text}
                              </span>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100">
                              <span
                                className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${sellerPayoutStatus.className} transition-all duration-200 hover:shadow-md`}
                              >
                                {sellerPayoutStatus.text}
                              </span>
                            </td>
                            <td className="py-4 px-4 border-r border-gray-100 text-gray-600 text-nowrap">
                              <div className="text-sm">
                                {formatDate(order.orderDate)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(order)}
                                  className="p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </button>
                                {!order.seller_paid && (
                                  <button
                                    onClick={() => openPayoutModal(order)}
                                    className="p-2 border border-green-200 rounded-lg hover:bg-green-50 text-green-600 hover:border-green-300 transition-all duration-200 hover:shadow-md animate-pulse"
                                    title="Process Payout"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {orders.map((order, index) => {
                    const orderStatus = getOrderStatusStyle(order.orderStatus);
                    const sellerPayoutStatus = getSellerPayoutStatusStyle(
                      order.seller_paid
                    );
                    return (
                      <div
                        key={order.orderItemId}
                        className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {order.itemTitle}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {order.category}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Order #{order.orderId.slice(0, 8)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-green-600 mb-2">
                              {formatCurrency(order.grandTotal)}
                            </span>
                            <span
                              className={`px-3 py-1 my-1 rounded-full text-xs capitalize font-medium ${orderStatus.className}`}
                            >
                              {orderStatus.text}
                            </span>
                            <span
                              className={`px-3 py-1 my-1 rounded-full text-xs capitalize font-medium ${sellerPayoutStatus.className}`}
                            >
                              Seller {sellerPayoutStatus.text}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3 space-y-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium">
                              {order.buyer.fullName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              Seller: {order.seller.fullName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            Qty: {order.quantity} ×{" "}
                            {formatCurrency(order.price)}
                          </div>
                        </div>

                        <div className="flex justify-end items-center pt-3 border-t border-gray-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(order)}
                              className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            {!order.seller_paid && (
                              <button
                                onClick={() => openPayoutModal(order)}
                                className="flex items-center gap-1 px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200 animate-pulse"
                              >
                                <DollarSign className="h-4 w-4" />
                                Payout
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
                  </div>

                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalOrders)} of{" "}
                    {totalOrders} results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {getPaginationNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-sm text-gray-500"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            className={`w-10 h-10 flex items-center justify-center text-sm border rounded-lg transition-all duration-200 ${
                              currentPage === page
                                ? "bg-[#f47458] text-white border-[#f47458] shadow-md"
                                : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="sticky top-0 bg-white bg-opacity-95 border-b border-gray-100 p-6 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Order ID: {selectedOrder.orderId.slice(0, 8)}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-[#f47458]" />
                      Order Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.orderId.slice(0, 8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Item ID:</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.orderItemId.slice(0, 8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(selectedOrder.orderDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${
                            getOrderStatusStyle(selectedOrder.orderStatus)
                              .className
                          }`}
                        >
                          {getOrderStatusStyle(selectedOrder.orderStatus).text}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seller Payout:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize font-medium ${
                            getSellerPayoutStatusStyle(
                              selectedOrder.seller_paid
                            ).className
                          }`}
                        >
                          {
                            getSellerPayoutStatusStyle(
                              selectedOrder.seller_paid
                            ).text
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                      Item Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 block text-sm">
                          Item Title:
                        </span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.itemTitle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {selectedOrder.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(selectedOrder.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-800 font-semibold">
                          Total:
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(selectedOrder.grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer & Seller Information */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {selectedOrder.buyer.fullName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {selectedOrder.buyer.email}
                        </span>
                      </div>
                      {selectedOrder.buyer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {selectedOrder.buyer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-purple-600" />
                      Seller Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {selectedOrder.seller.fullName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {selectedOrder.seller.companyName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {selectedOrder.seller.email}
                        </span>
                      </div>
                      {selectedOrder.seller.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {selectedOrder.seller.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  {/* Shipping Information */}
                  {selectedOrder.shippingAddress && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Truck className="h-5 w-5 mr-2 text-orange-600" />
                        Shipping Address
                      </h3>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">
                          {selectedOrder.shippingAddress.name}
                        </div>
                        <div className="text-gray-600">
                          {selectedOrder.shippingAddress.email}
                        </div>
                        <div className="text-gray-600">
                          <div>
                            {selectedOrder.shippingAddress.address.line1}
                          </div>
                          {selectedOrder.shippingAddress.address.line2 && (
                            <div>
                              {selectedOrder.shippingAddress.address.line2}
                            </div>
                          )}
                          <div>
                            {selectedOrder.shippingAddress.address.city},{" "}
                            {selectedOrder.shippingAddress.address.state}{" "}
                            {selectedOrder.shippingAddress.address.postal_code}
                          </div>
                          <div>
                            {selectedOrder.shippingAddress.address.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && selectedOrderForPayout && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-6 w-6 mr-2" />
                    Process Payout
                  </h2>
                  <p className="text-white/90 text-sm">
                    Order: {selectedOrderForPayout.orderId.slice(0, 12)}...
                  </p>
                </div>
                <button
                  onClick={closePayoutModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrderForPayout.itemTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrderForPayout.seller.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-sm">
                      {selectedOrderForPayout.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price × Quantity:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedOrderForPayout.price)} ×{" "}
                      {selectedOrderForPayout.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payout Calculation */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-green-600" />
                  Payout Calculation
                </h3>

                {isCalculating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">
                      Calculating payout...
                    </span>
                  </div>
                ) : payoutCalculation ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Total:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(payoutCalculation.itemTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Platform Commission ({payoutCalculation.commissionRate}
                        %):
                      </span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(payoutCalculation.platformCommission)}
                      </span>
                    </div>

                    {!payoutCalculation.categoryFound && (
                      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="text-yellow-800 text-sm">
                            No commission rate found for category "
                            {payoutCalculation.categoryName}". Using 0%
                            commission.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-green-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Payout:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(payoutCalculation.grossPayout)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-blue-800 font-medium mb-2">
                        Stripe Transfer Fees:
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">
                          Percentage Fee (0.25%):
                        </span>
                        <span className="text-blue-900">
                          -
                          {formatCurrency(
                            payoutCalculation.stripePercentageFee
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Fixed Fee:</span>
                        <span className="text-blue-900">
                          -{formatCurrency(payoutCalculation.stripeFixedFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium border-t border-blue-200 pt-2 mt-2">
                        <span className="text-blue-700">
                          Total Stripe Fees:
                        </span>
                        <span className="text-blue-900">
                          -{formatCurrency(payoutCalculation.totalStripeFee)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t-2 border-green-300 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-800">
                          Final Seller Payout:
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(payoutCalculation.sellerPayout)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Failed to calculate payout
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-amber-800 font-medium mb-1">
                      Important Notice
                    </h4>
                    <p className="text-amber-700 text-sm">
                      This payout will be processed immediately through Stripe
                      Connect. The seller will receive the funds in their
                      connected account within 2-7 business days. This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closePayoutModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={processPayout}
                disabled={payoutLoading || !payoutCalculation}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {payoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Process Payout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippedOrdersTable;

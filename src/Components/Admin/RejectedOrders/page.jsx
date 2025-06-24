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
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import RejectedOrderDetails from "./orderDetails";
import RefundModal from "./refundModal";
import { toast, ToastContainer, Bounce } from "react-toastify";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const RejectedOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState(null);

  const API_URL = `${URL}/api/orders/get-all-rejected-orders`;

  // Fetch rejected orders from API

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
        setError(data.message || "Failed to fetch rejected orders");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching rejected orders"
      );
    } finally {
      setLoading(false);
    }
  };

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

  // Handle refund (placeholder for now)
  const handleRefund = (order) => {
    setSelectedOrderForRefund(order);
    setShowRefundModal(true);
  };
  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setSelectedOrderForRefund(null);
  };

  const handleRefundSuccess = (refundData) => {
    // Show success message
    toast.success(`Refund processed successfully! 
    Refund ID: ${refundData.refundId}
    Amount: $${refundData.refundAmount.toFixed(2)}
    Item: ${refundData.itemTitle}`);

    // Refresh the orders list to update status
    fetchOrders();
  };
  if (loading) {
    return <CubeLoader />;
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
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
      <div className="mt-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-regular mb-4">
          Rejected Orders Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">
                Total Rejected Orders: {totalOrders}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 my-10">
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No rejected orders found</p>
                <p className="text-gray-400 text-sm">
                  Rejected orders will appear here
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          #
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Order ID
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Item
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Customer
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Seller
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order.orderItemId}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200`}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {order.orderId.slice(0, 8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Item: {order.orderItemId.slice(0, 8)}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {order.itemTitle}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {order.quantity} ×{" "}
                              {formatCurrency(order.price)}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {order.buyer.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.buyer.email}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {order.seller.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.seller.companyName}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {formatCurrency(order.grandTotal)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.paymentCompleted ? (
                                <span className="text-green-600">Paid</span>
                              ) : (
                                <span className="text-red-600">Unpaid</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600 text-nowrap">
                            <div className="text-sm">
                              {formatDate(order.orderDate)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(order)}
                                className="p-2 border border-gray-200 rounded hover:bg-gray-100"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRefund(order)}
                                className="p-2 border border-green-200 rounded hover:bg-green-50 text-green-600"
                                title="Process Refund"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderItemId}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {order.itemTitle}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Order #{order.orderId.slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium mb-1">
                            Rejected
                          </span>
                          <span className="text-lg font-medium text-gray-900">
                            {formatCurrency(order.grandTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">
                            {order.buyer.fullName}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Seller: {order.seller.fullName}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Qty: {order.quantity} × {formatCurrency(order.price)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                          <span
                            className={`text-sm ${
                              order.paymentCompleted
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.paymentCompleted ? "Paid" : "Unpaid"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(order)}
                            className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleRefund(order)}
                            className="flex items-center gap-1 px-3 py-1 text-green-600 border border-green-200 rounded hover:bg-green-50"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Refund
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalOrders)} of{" "}
                    {totalOrders} results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
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
                            className="px-2 text-sm"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                              currentPage === page
                                ? "bg-[#f47458] text-white"
                                : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
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

      {/* Modal */}
      {showModal && selectedOrder && (
        <RejectedOrderDetails
          selectedOrder={selectedOrder}
          closeModal={closeModal}
        />
      )}
      {showRefundModal && selectedOrderForRefund && (
        <RefundModal
          order={selectedOrderForRefund}
          isOpen={showRefundModal}
          onClose={handleCloseRefundModal}
          onRefundSuccess={handleRefundSuccess}
        />
      )}
    </div>
  );
};

export default RejectedOrdersTable;

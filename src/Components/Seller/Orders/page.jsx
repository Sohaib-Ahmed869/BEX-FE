"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
  Calendar,
  DollarSign,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import SellerHeader from "../sellerHeader/page";
import { Link } from "react-router-dom";
import { confirmOrder, rejectOrder } from "../../../services/OrderServices";
import { Bounce, toast, ToastContainer } from "react-toastify";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/orders/${userId}`);
      const data = await response.json();

      if (data.success) {
        const fetchedOrders = data.data.orders || [];
        setAllOrders(fetchedOrders);
        setTotalItems(fetchedOrders.length);
        setTotalPages(Math.ceil(fetchedOrders.length / itemsPerPage));

        // Apply pagination on frontend
        paginateOrders(fetchedOrders, currentPage, itemsPerPage);
      } else {
        setError("Failed to fetch orders");
        console.error("Failed to fetch orders");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Frontend pagination
  const paginateOrders = (ordersList, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = ordersList.slice(startIndex, endIndex);
    setOrders(paginatedOrders);
  };

  // Update pagination when page or items per page changes
  useEffect(() => {
    if (allOrders.length > 0) {
      paginateOrders(allOrders, currentPage, itemsPerPage);
      setTotalPages(Math.ceil(allOrders.length / itemsPerPage));
    }
  }, [currentPage, itemsPerPage, allOrders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order confirmation
  const handleConfirmOrder = async (itemId) => {
    if (!selectedOrder) return;

    setModalLoading(true);
    try {
      const response = await confirmOrder(itemId);

      if (response.success) {
        // Update the order status in state
        const updatedAllOrders = allOrders.map((order) =>
          order.orderItemId === selectedOrder.orderItemId
            ? { ...order, orderStatus: "approved" }
            : order
        );
        setAllOrders(updatedAllOrders);
        paginateOrders(updatedAllOrders, currentPage, itemsPerPage);

        setShowConfirmModal(false);
        setSelectedOrder(null);

        console.log(response.message || "Order confirmed successfully");
        toast.success("Order confirmed successfully");
      } else {
        alert("Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error confirming order";

      toast.error(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle order rejection
  const handleRejectOrder = async (itemId) => {
    if (!selectedOrder) return;

    setModalLoading(true);
    try {
      const response = await rejectOrder(itemId);

      if (response.success) {
        // Update the order status in state
        const updatedAllOrders = allOrders.map((order) =>
          order.orderItemId === selectedOrder.orderItemId
            ? { ...order, orderStatus: "cancelled" }
            : order
        );
        setAllOrders(updatedAllOrders);
        paginateOrders(updatedAllOrders, currentPage, itemsPerPage);

        setShowRejectModal(false);
        setSelectedOrder(null);

        console.log(response.message || "Order rejected successfully");
        toast.success("Order rejected successfully");
      } else {
        toast.error("Failed to reject order");
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert(error.message || "Error rejecting order");
    } finally {
      setModalLoading(false);
    }
  };

  // Get order status styling
  const getOrderStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending approval":
        return {
          text: "Pending Approval",
          className: "bg-yellow-100 text-yellow-600",
        };
      case "approved":
        return { text: "Approved", className: "bg-blue-100 text-blue-600" };
      case "shipped":
        return { text: "Shipped", className: "bg-green-100 text-green-600" };
      case "delivered":
        return { text: "Delivered", className: "bg-green-100 text-green-700" };
      case "rejected":
        return { text: "Rejected", className: "bg-red-100 text-red-600" };
      default:
        return {
          text: status || "Unknown",
          className: "bg-gray-100 text-gray-600",
        };
    }
  };

  // Get payment status styling
  const getPaymentStatus = (paymentCompleted) => {
    return paymentCompleted
      ? { text: "Paid", className: "bg-green-100 text-green-600" }
      : { text: "Pending", className: "bg-red-100 text-red-600" };
  };

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

  // Pagination controls
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Modal Component
  const Modal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    type,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle
              className={`h-6 w-6 mr-3 ${
                type === "confirm" ? "text-green-500" : "text-red-500"
              }`}
            />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={modalLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={modalLoading}
              className={`px-4 py-2 rounded-md text-white disabled:opacity-50 ${
                type === "confirm"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modalLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-[#f47458] text-white rounded hover:bg-[f47458]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <SellerHeader />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <div className="mt-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-medium mb-4">
          Orders Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-5 w-5" />
              <span className="text-sm">Total Orders: {totalItems}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 my-10">
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders found</p>
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
                          Product
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Buyer
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Total
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Payment
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Status
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
                      {orders.map((order, index) => {
                        const paymentStatus = getPaymentStatus(
                          order.paymentCompleted
                        );
                        const orderStatus = getOrderStatus(order.orderStatus);

                        return (
                          <tr
                            key={order.orderItemId}
                            className={`border-b border-gray-100 ${
                              index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-gray-100 transition-colors duration-200 animate-fadeIn`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              {index + 1 + (currentPage - 1) * itemsPerPage}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-mono text-sm">
                                {order.orderId.slice(0, 8)}{" "}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="flex items-center gap-3">
                                {order.product.image && (
                                  <img
                                    src={order.product.image}
                                    alt={order.itemTitle}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {order.itemTitle}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {order.product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {order.buyer?.fullName || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.buyer?.email || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-medium">
                                {order.quantity}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-medium text-gray-900">
                                ${order.price}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="font-medium text-gray-900">
                                ${order.grandTotal}
                              </div>
                              {order.retipTotal > 0 && (
                                <div className="text-sm text-gray-500">
                                  +${order.retipTotal} retip
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-2 py-1 rounded text-sm font-medium ${paymentStatus.className}`}
                              >
                                {paymentStatus.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-2 py-1 rounded  text-nowrap text-sm font-medium ${orderStatus.className}`}
                              >
                                {orderStatus.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="text-sm">
                                {formatDate(order.orderDate)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-2">
                                <Link
                                  to={`/orders/details/${order.orderItemId}`}
                                  className="p-2 border border-gray-200 rounded hover:bg-gray-100"
                                  title="View Order Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>

                                {order.orderStatus.toLowerCase() ===
                                  "pending approval" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setShowConfirmModal(true);
                                      }}
                                      className="p-2 border border-green-200 rounded hover:bg-green-50 text-green-600"
                                      title="Confirm Order"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>

                                    <button
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setShowRejectModal(true);
                                      }}
                                      className="p-2 border border-red-200 rounded hover:bg-red-50 text-red-600"
                                      title="Reject Order"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
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
                    const paymentStatus = getPaymentStatus(
                      order.paymentCompleted
                    );
                    const orderStatus = getOrderStatus(order.orderStatus);

                    return (
                      <div
                        key={order.orderItemId}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 font-mono text-sm">
                              Order #{order.orderId.slice(0, 8)}...
                            </h3>
                            <p className="text-sm text-gray-500">
                              {order.buyer?.fullName || "N/A"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${paymentStatus.className}`}
                            >
                              {paymentStatus.text}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${orderStatus.className}`}
                            >
                              {orderStatus.text}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          {order.product.image && (
                            <img
                              src={order.product.image}
                              alt={order.itemTitle}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {order.itemTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.product.category}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Quantity:</span>
                            <p className="text-gray-900 font-medium">
                              {order.quantity}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <p className="text-gray-900 font-medium">
                              ${order.price}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="text-gray-900 font-medium">
                              ${order.grandTotal}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Date:
                            </span>
                            <p className="text-gray-900 text-xs">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Link
                              to={`/orders/details/${order.orderId}`}
                              className="p-2 border border-gray-200 rounded hover:bg-gray-100"
                              title="View Order Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            {order.orderStatus.toLowerCase() ===
                              "pending approval" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowConfirmModal(true);
                                  }}
                                  className="p-2 border border-green-200 rounded hover:bg-green-50 text-green-600"
                                  title="Confirm Order"
                                >
                                  <Check className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowRejectModal(true);
                                  }}
                                  className="p-2 border border-red-200 rounded hover:bg-red-50 text-red-600"
                                  title="Reject Order"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {/* {totalPages > 1 && ( */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page when changing items per page
                      }}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
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
                {/* // )} */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        title="Confirm Order"
        message={`Are you sure you want to confirm this order for "${selectedOrder?.itemTitle}"? This action cannot be undone.`}
        onConfirm={() => handleConfirmOrder(selectedOrder.orderItemId)}
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedOrder(null);
        }}
        confirmText="Confirm Order"
        cancelText="Cancel"
        type="confirm"
      />

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        title="Reject Order"
        message={`Are you sure you want to reject this order for "${selectedOrder?.itemTitle}"? This action cannot be undone.`}
        onConfirm={() => handleRejectOrder(selectedOrder.orderItemId)}
        onCancel={() => {
          setShowRejectModal(false);
          setSelectedOrder(null);
        }}
        confirmText="Reject Order"
        cancelText="Cancel"
        type="reject"
      />
    </div>
  );
}

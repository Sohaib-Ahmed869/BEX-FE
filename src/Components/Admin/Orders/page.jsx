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
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";
import { Link, Navigate } from "react-router-dom";

const OrdersOverviewTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const URL = import.meta.env.VITE_REACT_BACKEND_URL;

  const API_URL = `${URL}/api/orders/get-all-orders`;

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      const response = await fetch(`${API_URL}?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotalOrders(data.data.totalOrders);
        setTotalPages(data.data.totalPages);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, filters]);

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending approval":
        return "bg-yellow-100 text-yellow-600";
      case "approved":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-green-100 text-green-600";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "mixed":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get payment status styling
  const getPaymentStatusStyle = (status) => {
    if (status === true) return "bg-green-100 text-green-600";
    if (status === false) return "bg-red-100 text-red-600";
    return "bg-orange-100 text-orange-600"; // mixed
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      startDate: "",
      endDate: "",
    });
  };

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

  if (loading) {
    return <CubeLoader />;
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <div className="mt-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-regular  mb-4">
          Orders Management
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-5 w-5" />
              <span className="text-sm">Total Orders: {totalOrders}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button> */}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    handleFilterChange("paymentStatus", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                >
                  <option value="">All Payment Status</option>
                  <option value="true">Paid</option>
                  <option value="false">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

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
        <div className="bg-white rounded-lg shadow-sm ">
          <div className="p-6 my-10">
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders found</p>
                <p className="text-gray-400 text-sm">
                  Orders will appear here when customers place them
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto ">
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
                          Customer
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Items Summary
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Amount
                        </th>
                        {/* <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                          Status
                        </th> */}
                        <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                          Payment
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order.orderId}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200`}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div>
                              <div className="font-regular text-gray-900">
                                {order.orderId.slice(0, 8)}
                              </div>
                              {/* <div className="text-xs text-gray-500">
                                {order.itemsSummary.totalItemsCount} items (
                                {order.itemsSummary.totalUniqueItems} unique)
                              </div> */}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {order.buyer.fullName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.buyer.email || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900 max-w-xs truncate">
                              {order.itemsSummary.itemsPreview}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.itemsSummary.totalItemsCount} total items
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="font-regular text-gray-900">
                              {formatCurrency(order.amounts.orderTotal)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Items: {formatCurrency(order.amounts.itemsTotal)}
                              {order.amounts.retipTotal > 0 && (
                                <span>
                                  {" "}
                                  + {formatCurrency(
                                    order.amounts.retipTotal
                                  )}{" "}
                                  retip
                                </span>
                              )}
                            </div>
                          </td>
                          {/* <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span
                              className={`px-4 text-center block py-2 rounded text-sm font-medium ${getStatusStyle(
                                order.status.itemsOrderStatus
                              )}`}
                            >
                              {order.status.itemsOrderStatus}
                            </span>
                          </td> */}
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span
                              className={`px-4 text-center py-2 block rounded text-sm font-medium ${getPaymentStatusStyle(
                                order.status.orderPaymentCompleted
                              )}`}
                            >
                              {order.status.orderPaymentCompleted === true
                                ? "Paid"
                                : order.status.orderPaymentCompleted === false
                                ? "Pending"
                                : "Mixed"}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600 text-nowrap">
                            <div className="text-sm">
                              {formatDate(order.orderDate)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/admin/orders/orderItems/${order.orderId}`}
                              className="p-2 inline-block border cursor-pointer border-gray-200 rounded hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
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
                      key={order.orderId}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            Order #{order.orderId.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {/* <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                              order.status.itemsOrderStatus
                            )}`}
                          >
                            {order.status.itemsOrderStatus}
                          </span> */}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusStyle(
                              order.status.orderPaymentCompleted
                            )}`}
                          >
                            {order.status.orderPaymentCompleted === true
                              ? "Paid"
                              : order.status.orderPaymentCompleted === false
                              ? "Pending"
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">
                            {order.buyer.fullName || "N/A"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {order.itemsSummary.itemsPreview}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.itemsSummary.totalItemsCount} items{" "}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-lg font-medium text-gray-900">
                          {formatCurrency(order.amounts.orderTotal)}
                        </div>
                        <Link
                          to={`/admin/orders/orderItems/${order.orderId}`}
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
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
                {/* )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersOverviewTable;

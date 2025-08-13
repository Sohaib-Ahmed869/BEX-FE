"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  MessageSquare,
  X,
  Send,
  FileText,
  ShoppingBag,
  Filter,
} from "lucide-react";

import CubeLoader from "../../../utils/cubeLoader";
import { toast } from "react-toastify";
import { Bounce, ToastContainer } from "react-toastify";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

// Chat Response Modal Component for Buyers
const BuyerResponseModal = ({
  isOpen,
  onClose,
  onSend,
  isLoading,
  disputeId,
  existingResponses = [],
}) => {
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && disputeId) {
      fetchChatHistory();
    }
  }, [isOpen, disputeId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const fetchChatHistory = async () => {
    if (!disputeId) return;

    setLoadingChat(true);
    try {
      const response = await fetch(`${URL}/api/orderdispute/${disputeId}/chat`);
      const result = await response.json();

      if (result.success && result.data.dispute.responses) {
        setChatHistory(result.data.dispute.responses);
      } else {
        setChatHistory(existingResponses);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory(existingResponses);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSend = () => {
    if (response.trim()) {
      onSend(response);
      setResponse("");
    }
  };

  const handleClose = () => {
    setResponse("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-60 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Dispute Conversation
            </h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="mb-4 border border-gray-200 rounded-lg p-3 h-64 overflow-y-auto">
            {loadingChat ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : chatHistory.length > 0 ? (
              <div className="space-y-3">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderType === "buyer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.senderType === "buyer"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {msg.senderType === "buyer" ? "You" : "Admin"} •{" "}
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p>No messages yet</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 justify-end">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !response.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuyerDisputes = ({ userId, userName }) => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [previousSelectedId, setPreviousSelectedId] = useState(null);
  const [disputeChat, setDisputeChat] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const chatEndRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDisputes, setTotalDisputes] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchDisputes();
    }
  }, [userId, currentPage, itemsPerPage, filters]);

  // Animation effect when dispute selection changes
  useEffect(() => {
    if (selectedDispute && selectedDispute.disputeId !== previousSelectedId) {
      setPreviousSelectedId(selectedDispute.disputeId);
      fetchDisputeChat(selectedDispute.disputeId);
    }
  }, [selectedDispute, previousSelectedId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [disputeChat]);

  const fetchDisputes = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add filters to query params
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const response = await fetch(
        `${URL}/api/orderdispute/user/${userId}?${queryParams.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setDisputes(result.data.disputes);
        setTotalPages(
          result.data.totalPages ||
            Math.ceil(result.data.totalDisputes / itemsPerPage)
        );
        setTotalDisputes(
          result.data.totalDisputes || result.data.disputes.length
        );
        setCurrentPage(result.data.currentPage || currentPage);
        setItemsPerPage(result.data.itemsPerPage || itemsPerPage);
      } else {
        setError("Failed to fetch disputes");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeChat = async (disputeId) => {
    if (!disputeId) return;

    setLoadingChat(true);
    try {
      const response = await fetch(`${URL}/api/orderdispute/${disputeId}/chat`);
      const result = await response.json();

      if (result.success && result.data.dispute.responses) {
        setDisputeChat(result.data.dispute.responses);
      } else {
        setDisputeChat([]);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      setDisputeChat([]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendResponse = async (responseText) => {
    if (!selectedDispute || !userId || !userName) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${URL}/api/orderdispute/${selectedDispute.disputeId}/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: responseText,
            userId: userId,
            userRole: "buyer",
            userName: userName,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Add the new response to the chat
        const newResponse = {
          id: result.data.responseId,
          senderType: "buyer",
          senderId: userId,
          senderName: userName,
          message: responseText,
          timestamp: new Date().toISOString(),
        };

        setDisputeChat((prev) => [...prev, newResponse]);

        // Update dispute status if needed
        if (result.data.disputeStatus !== selectedDispute.disputeStatus) {
          setSelectedDispute((prev) => ({
            ...prev,
            disputeStatus: result.data.disputeStatus,
          }));

          setDisputes((prevDisputes) =>
            prevDisputes.map((dispute) =>
              dispute.disputeId === selectedDispute.disputeId
                ? { ...dispute, disputeStatus: result.data.disputeStatus }
                : dispute
            )
          );
        }

        setIsResponseModalOpen(false);
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message: " + result.message);
      }
    } catch (error) {
      toast.error("Error sending message: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      category: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedDispute(null); // Clear selected dispute when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "product_quality":
        return <Package className="w-4 h-4" />;
      case "shipping_delay":
        return <Clock className="w-4 h-4" />;
      case "billing_issue":
        return <DollarSign className="w-4 h-4" />;
      case "wrong_item":
        return <AlertCircle className="w-4 h-4" />;
      case "damaged_item":
        return <AlertCircle className="w-4 h-4" />;
      case "not_received":
        return <ShoppingBag className="w-4 h-4" />;
      case "refund_request":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.orderItem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.disputeCategory
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#f47458] focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>of {totalDisputes} disputes</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-1 text-sm border rounded ${
                  page === currentPage
                    ? "bg-[#f47458] text-white border-[#f47458]"
                    : page === "..."
                    ? "border-transparent cursor-default"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDisputes}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BuyerHeader />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        .dispute-item {
          transition: all 0.2s ease-in-out;
        }

        .dispute-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .selected-dispute {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .mobile-details-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 50;
          }

          .mobile-details-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 51;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
              My Disputes
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Disputes List */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Your Disputes ({totalDisputes})
                    </h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search disputes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                        />
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                          showFilters || Object.values(filters).some((f) => f)
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {Object.values(filters).some((f) => f) && (
                          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {Object.values(filters).filter((f) => f).length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Filters Panel */}
                  {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-slideUp">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={filters.status}
                            onChange={(e) =>
                              handleFilterChange("status", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={filters.category}
                            onChange={(e) =>
                              handleFilterChange("category", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">All Categories</option>
                            <option value="product_quality">
                              Product Quality
                            </option>
                            <option value="shipping_delay">
                              Shipping Delay
                            </option>
                            <option value="wrong_item">Wrong Item</option>
                            <option value="damaged_item">Damaged Item</option>
                            <option value="not_received">Not Received</option>
                            <option value="billing_issue">Billing Issue</option>
                            <option value="refund_request">
                              Refund Request
                            </option>
                            <option value="other">Other</option>
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredDisputes.map((dispute) => (
                    <div
                      key={dispute.disputeId}
                      className={`dispute-item p-4 sm:p-6 cursor-pointer transition-colors ${
                        selectedDispute?.disputeId === dispute.disputeId
                          ? "bg-blue-50 border-l-4 border-l-blue-500 selected-dispute"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(dispute.disputeCategory)}
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {dispute.disputeCategory.replace("_", " ")}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border w-fit ${getStatusColor(
                                dispute.disputeStatus
                              )}`}
                            >
                              {dispute.disputeStatus
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>

                            {/* Show response count badge */}
                            {dispute.totalResponses > 0 && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 w-fit">
                                {dispute.totalResponses}{" "}
                                {dispute.totalResponses === 1
                                  ? "message"
                                  : "messages"}
                              </span>
                            )}

                            {/* Show waiting for user response indicator */}
                            {dispute.waitingFor === "buyer" &&
                              dispute.disputeStatus !== "resolved" && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200 w-fit flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Awaiting your response
                                </span>
                              )}

                            {/* Show admin responded indicator */}
                            {dispute.hasUnreadAdminResponse && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200 w-fit flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                New response
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                            {dispute.orderItem.title}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {dispute.description}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>
                                Created {formatDate(dispute.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3 flex-shrink-0" />
                              <span>${dispute.order.totalAmount}</span>
                            </div>
                            {dispute.lastResponseAt && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3 flex-shrink-0" />
                                <span>
                                  Last activity{" "}
                                  {formatDate(dispute.lastResponseAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {dispute.product.image && (
                          <img
                            src={dispute.product.image || "/placeholder.svg"}
                            alt={dispute.orderItem.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover ml-3 sm:ml-4 flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredDisputes.length === 0 && (
                    <div className="p-8 sm:p-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {searchTerm || Object.values(filters).some((f) => f)
                          ? "No disputes match your criteria"
                          : "No disputes found"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {filteredDisputes.length > 0 && <PaginationControls />}
              </div>
            </div>

            {/* Desktop Dispute Details Sidebar */}
            {selectedDispute && (
              <div className="hidden lg:block w-96 animate-slideInRight">
                <div className="bg-white rounded-xl shadow-sm border border-gray-300 sticky top-8 animate-scaleIn">
                  <div className="p-6 border-b flex relative border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dispute Details
                    </h3>
                    <span
                      onClick={() => setSelectedDispute(null)}
                      className="border-1 absolute right-4 border-gray-300 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" />
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Product Information
                      </h4>
                      <div className="flex items-start space-x-3">
                        {selectedDispute.product.image && (
                          <img
                            src={
                              selectedDispute.product.image ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={selectedDispute.orderItem.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {selectedDispute.orderItem.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ${selectedDispute.orderItem.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {selectedDispute.orderItem.quantity}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            Status: {selectedDispute.orderItem.orderStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat/Responses Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center justify-between">
                        <span>Conversation</span>
                        <span className="text-xs text-gray-500">
                          {disputeChat.length}{" "}
                          {disputeChat.length === 1 ? "message" : "messages"}
                        </span>
                      </h4>

                      <div className="border border-gray-200 rounded-lg p-3 h-64 overflow-y-auto">
                        {loadingChat ? (
                          <div className="flex justify-center items-center h-full">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : disputeChat.length > 0 ? (
                          <div className="space-y-3">
                            {disputeChat.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${
                                  msg.senderType === "buyer"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    msg.senderType === "buyer"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <div className="text-xs text-gray-500 mb-1">
                                    {msg.senderType === "buyer"
                                      ? "You"
                                      : "Admin"}{" "}
                                    • {new Date(msg.timestamp).toLocaleString()}
                                  </div>
                                  <p className="text-sm">{msg.message}</p>
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageSquare className="w-8 h-8 mb-2" />
                            <p>No messages yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Order Information
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Order ID: {selectedDispute.order.orderId?.slice(0, 8)}
                          ...
                        </p>
                        <p className="text-sm text-gray-600">
                          Order Date:{" "}
                          {formatDate(selectedDispute.order.orderDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Amount: ${selectedDispute.order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Dispute Description */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Your Complaint
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedDispute.description}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Dispute Created
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(selectedDispute.createdAt)}
                            </p>
                          </div>
                        </div>
                        {selectedDispute.resolvedAt && (
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Dispute Resolved
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(selectedDispute.resolvedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {selectedDispute.disputeStatus !== "resolved" &&
                      selectedDispute.disputeStatus !== "closed" &&
                      selectedDispute.disputeStatus !== "rejected" && (
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setIsResponseModalOpen(true)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                        </div>
                      )}

                    {/* Status Message for Closed Disputes */}
                    {(selectedDispute.disputeStatus === "resolved" ||
                      selectedDispute.disputeStatus === "closed" ||
                      selectedDispute.disputeStatus === "rejected") && (
                      <div className="pt-4 border-t border-gray-200">
                        <div
                          className={`p-3 rounded-lg ${
                            selectedDispute.disputeStatus === "resolved"
                              ? "bg-green-50 border border-green-200"
                              : selectedDispute.disputeStatus === "rejected"
                              ? "bg-red-50 border border-red-200"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              selectedDispute.disputeStatus === "resolved"
                                ? "text-green-800"
                                : selectedDispute.disputeStatus === "rejected"
                                ? "text-red-800"
                                : "text-gray-800"
                            }`}
                          >
                            This dispute has been{" "}
                            {selectedDispute.disputeStatus}.
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            No further messages can be sent for this dispute.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dispute Details Overlay */}
      {selectedDispute && (
        <div className="lg:hidden z-40">
          <div
            className="mobile-details-overlay"
            onClick={() => setSelectedDispute(null)}
          />
          <div className="mobile-details-panel animate-slideInUp">
            <div className="bg-white rounded-t-xl shadow-lg border border-gray-300">
              <div className="p-4 border-b flex items-center justify-between border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dispute Details
                </h3>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[calc(80vh-80px)] overflow-y-auto">
                {/* Product Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Product Information
                  </h4>
                  <div className="flex items-start space-x-3">
                    {selectedDispute.product.image && (
                      <img
                        src={
                          selectedDispute.product.image || "/placeholder.svg"
                        }
                        alt={selectedDispute.orderItem.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {selectedDispute.orderItem.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${selectedDispute.orderItem.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {selectedDispute.orderItem.quantity}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Status: {selectedDispute.orderItem.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat/Responses Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center justify-between">
                    <span>Conversation</span>
                    <span className="text-xs text-gray-500">
                      {disputeChat.length}{" "}
                      {disputeChat.length === 1 ? "message" : "messages"}
                    </span>
                  </h4>

                  <div className="border border-gray-200 rounded-lg p-3 h-48 overflow-y-auto">
                    {loadingChat ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : disputeChat.length > 0 ? (
                      <div className="space-y-3">
                        {disputeChat.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.senderType === "buyer"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.senderType === "buyer"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <div className="text-xs text-gray-500 mb-1">
                                {msg.senderType === "buyer" ? "You" : "Admin"} •{" "}
                                {new Date(msg.timestamp).toLocaleString()}
                              </div>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageSquare className="w-8 h-8 mb-2" />
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Order Information
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Order ID: {selectedDispute.order.orderId?.slice(0, 8)}...
                    </p>
                    <p className="text-sm text-gray-600">
                      Order Date: {formatDate(selectedDispute.order.orderDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Amount: ${selectedDispute.order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Dispute Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Your Complaint
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedDispute.description}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Dispute Created
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(selectedDispute.createdAt)}
                        </p>
                      </div>
                    </div>
                    {selectedDispute.resolvedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dispute Resolved
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(selectedDispute.resolvedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedDispute.disputeStatus !== "resolved" &&
                  selectedDispute.disputeStatus !== "closed" &&
                  selectedDispute.disputeStatus !== "rejected" && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                      <button
                        onClick={() => setIsResponseModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  )}

                {/* Status Message for Closed Disputes */}
                {(selectedDispute.disputeStatus === "resolved" ||
                  selectedDispute.disputeStatus === "closed" ||
                  selectedDispute.disputeStatus === "rejected") && (
                  <div className="pt-4 border-t border-gray-200">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedDispute.disputeStatus === "resolved"
                          ? "bg-green-50 border border-green-200"
                          : selectedDispute.disputeStatus === "rejected"
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          selectedDispute.disputeStatus === "resolved"
                            ? "text-green-800"
                            : selectedDispute.disputeStatus === "rejected"
                            ? "text-red-800"
                            : "text-gray-800"
                        }`}
                      >
                        This dispute has been {selectedDispute.disputeStatus}.
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        No further messages can be sent for this dispute.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {isResponseModalOpen && (
        <BuyerResponseModal
          isOpen={isResponseModalOpen}
          onClose={() => setIsResponseModalOpen(false)}
          onSend={handleSendResponse}
          isLoading={isProcessing}
          disputeId={selectedDispute?.disputeId}
          existingResponses={disputeChat}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default BuyerDisputes;

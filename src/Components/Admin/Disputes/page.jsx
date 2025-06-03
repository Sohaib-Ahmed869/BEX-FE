import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Mail,
  X,
  Send,
  AlertTriangle,
} from "lucide-react";

import CubeLoader from "../../../utils/cubeLoader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Bounce, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slideUp">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Response Modal Component
const ResponseModal = ({ isOpen, onClose, onSend, isLoading }) => {
  const [response, setResponse] = useState("");

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
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Send Response
            </h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response to the customer..."
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
              <span>Send Response</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [previousSelectedId, setPreviousSelectedId] = useState(null);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  // Animation effect when dispute selection changes
  useEffect(() => {
    if (selectedDispute && selectedDispute.disputeId !== previousSelectedId) {
      setPreviousSelectedId(selectedDispute.disputeId);
    }
  }, [selectedDispute, previousSelectedId]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/orderdispute/admin/all-disputes"
      );
      const result = await response.json();

      if (result.success) {
        setDisputes(result.data.disputes);
      } else {
        setError("Failed to fetch disputes");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orderdispute/admin/${selectedDispute.disputeId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disputeStatus: "resolved",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the dispute in the local state
        setDisputes((prevDisputes) =>
          prevDisputes.map((dispute) =>
            dispute.disputeId === selectedDispute.disputeId
              ? {
                  ...dispute,
                  disputeStatus: "resolved",
                  resolvedAt: new Date().toISOString(),
                }
              : dispute
          )
        );

        // Update selected dispute
        setSelectedDispute((prev) => ({
          ...prev,
          disputeStatus: "resolved",
          resolvedAt: new Date().toISOString(),
        }));

        setIsConfirmModalOpen(false);
      } else {
        alert("Failed to resolve dispute: " + result.message);
      }
    } catch (error) {
      alert("Error resolving dispute: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendResponse = async (responseText) => {
    if (!selectedDispute) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orderdispute/admin/${selectedDispute.disputeId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disputeStatus: selectedDispute.disputeStatus, // Keep current status
            adminResponse: responseText,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the dispute in the local state
        setDisputes((prevDisputes) =>
          prevDisputes.map((dispute) =>
            dispute.disputeId === selectedDispute.disputeId
              ? { ...dispute, adminResponse: responseText }
              : dispute
          )
        );

        // Update selected dispute
        setSelectedDispute((prev) => ({
          ...prev,
          adminResponse: responseText,
        }));

        setIsResponseModalOpen(false);
      } else {
        alert("Failed to send response: " + result.message);
      }
    } catch (error) {
      alert("Error sending response: " + error.message);
    } finally {
      setIsProcessing(false);
    }
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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "product_quality":
        return <Package className="w-4 h-4" />;
      case "delivery":
        return <Clock className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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

  const filteredDisputes = disputes.filter(
    (dispute) =>
      dispute.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.orderItem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.disputeCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Disputes
          </h2>
          <div className="flex gap-8">
            {/* Disputes List */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Active Disputes ({filteredDisputes.length})
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredDisputes.map((dispute) => (
                    <div
                      key={dispute.disputeId}
                      className={`dispute-item p-6 cursor-pointer transition-colors ${
                        selectedDispute?.disputeId === dispute.disputeId
                          ? "bg-blue-50 border-l-4 border-l-[#f47458] selected-dispute"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(dispute.disputeCategory)}
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {dispute.disputeCategory.replace("_", " ")}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                dispute.disputeStatus
                              )}`}
                            >
                              {dispute.disputeStatus
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-gray-900 mb-2">
                            {dispute.orderItem.title}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {dispute.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{dispute.user.fullName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(dispute.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${dispute.order.totalAmount}</span>
                            </div>
                          </div>
                        </div>

                        {dispute.product.image && (
                          <img
                            src={dispute.product.image}
                            alt={dispute.orderItem.title}
                            className="w-16 h-16 rounded-lg object-cover ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredDisputes.length === 0 && (
                    <div className="p-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No disputes found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dispute Details Sidebar */}
            {selectedDispute && (
              <div className="w-96 animate-slideInRight">
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
                            src={selectedDispute.product.image}
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

                    {/* Customer Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">
                            {selectedDispute.user.fullName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {selectedDispute.user.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Seller Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">
                            {selectedDispute.product.seller.fullName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {selectedDispute.product.seller.email}
                          </span>
                        </div>
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

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Dispute Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedDispute.description}
                      </p>
                    </div>

                    {/* Admin Response */}
                    {selectedDispute.adminResponse && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Admin Response
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {selectedDispute.adminResponse}
                          </p>
                        </div>
                      </div>
                    )}

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
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsResponseModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Response</span>
                      </button>
                      {selectedDispute.disputeStatus === "open" && (
                        <button
                          onClick={() => setIsConfirmModalOpen(true)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleResolveDispute}
        title="Resolve Dispute"
        message="Are you sure you want to mark this dispute as resolved? This action cannot be undone."
        confirmText="Mark as Resolved"
        isLoading={isProcessing}
      />

      <ResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        onSend={handleSendResponse}
        isLoading={isProcessing}
      />
    </>
  );
};

export default OrderDisputes;

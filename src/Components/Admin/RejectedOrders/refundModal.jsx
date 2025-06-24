import React, { useState } from "react";
import { X, RefreshCw, AlertCircle, DollarSign } from "lucide-react";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const RefundModal = ({ order, isOpen, onClose, onRefundSuccess }) => {
  const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    initiatedBy: "", // You'll need to get this from user context/auth
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const refundReasons = [
    { value: "seller_rejected", label: "Seller Rejected Order" },
    { value: "customer_requested", label: "Customer Requested" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "quality_issue", label: "Quality Issue" },
    { value: "damaged_item", label: "Damaged Item" },
    { value: "wrong_item", label: "Wrong Item" },
    { value: "other", label: "Other" },
  ];

  // Calculate refund amount
  const calculateRefundAmount = () => {
    const itemAmount = parseFloat(order.price) * parseInt(order.quantity);
    const retipAmount = order.retip_added
      ? parseFloat(order.retip_price || 0) * parseInt(order.quantity)
      : 0;
    return itemAmount + retipAmount;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.reason) {
      setError("Please select a refund reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${URL}/api/admin/refund/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItemId: order.orderItemId,
          reason: formData.reason,
          notes: formData.notes,
          initiatedBy: userId || "admin", // Default to admin if not provided
        }),
      });

      const data = await response.json();

      if (data.success) {
        onRefundSuccess({
          ...data,
          orderTitle: order.itemTitle,
        });
        onClose();
        // Reset form
        setFormData({
          reason: "",
          notes: "",
          initiatedBy: "",
        });
      } else {
        setError(data.error || "Failed to process refund");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
      console.error("Refund error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        reason: "",
        notes: "",
        initiatedBy: "",
      });
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Process Refund
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Order Details */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{order.orderId?.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Item:</span>
              <span className="font-medium text-right max-w-[200px] truncate">
                {order.itemTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{order.buyer?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unit Price:</span>
              <span className="font-medium">
                ${parseFloat(order.price).toFixed(2)}
              </span>
            </div>
            {order.retip_added && (
              <div className="flex justify-between">
                <span className="text-gray-600">Retip:</span>
                <span className="font-medium">
                  $
                  {(
                    parseFloat(order.retip_price || 0) *
                    parseInt(order.quantity)
                  ).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-semibold">
                Refund Amount:
              </span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-bold text-green-600">
                  ${calculateRefundAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Refund Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason <span className="text-red-500">*</span>
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select a reason</option>
              {refundReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional information about this refund..."
              disabled={loading}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.reason}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Process Refund
                </>
              )}
            </button>
          </div>

          {/* Warning Text */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium">Warning:</p>
                <p>
                  This action will process a refund through Stripe and cannot be
                  undone. The refund amount will be returned to the customer's
                  original payment method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;

import React from "react";
import {
  Package,
  User,
  X,
  MapPin,
  Building,
  CreditCard,
  AlertCircle,
  Check,
} from "lucide-react";

const RefundedOrderDetails = ({ selectedOrder, closeModal }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleRefund = (order) => {
    // Placeholder function - replace with actual refund logic
    console.log("Processing refund for order:", order.orderId);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center p-4 z-50 ">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 ">
        <div className="overflow-y-auto max-h-[90vh] ">
          {/* Header */}
          <div className="sticky top-0 bg-white bg-opacity-95 border-b border-gray-100 p-6 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Order Refunded
                  </h2>
                  <p className="text-sm text-gray-500">
                    Order #{selectedOrder.orderId.slice(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Order Status Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-2xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-700" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800">
                      Refund Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide">
                          Order ID
                        </p>
                        <p className="text-sm text-green-900 font-mono">
                          {selectedOrder.orderId.slice(0, 8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide">
                          Item ID
                        </p>
                        <p className="text-sm text-green-900 font-mono">
                          {selectedOrder.orderItemId.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide">
                          Order Date
                        </p>
                        <p className="text-sm text-green-900">
                          {formatDate(selectedOrder.orderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide">
                          Last Updated
                        </p>
                        <p className="text-sm text-green-900">
                          {formatDate(selectedOrder.itemUpdatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item Details Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Product Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Product Title
                      </p>
                      <p className="text-gray-900">{selectedOrder.itemTitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Product ID
                        </p>
                        <p className="text-sm text-gray-900 font-mono">
                          {selectedOrder.productId.slice(0, 8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Quantity
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Unit Price
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(selectedOrder.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Item Total
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(selectedOrder.itemTotal)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Grand Total</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(selectedOrder.grandTotal)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Requires Retipping
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          selectedOrder.requiresRetipping
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedOrder.requiresRetipping ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Payment Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Payment Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          selectedOrder.paymentCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedOrder.paymentCompleted
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Platform Commission
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(selectedOrder.platformCommission)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Retip Total
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(selectedOrder.retipTotal)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Retip Added
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          selectedOrder.retipAdded
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedOrder.retipAdded ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Buyer Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-700" />
                    </div>
                    <h3 className="text-lg font-medium text-blue-800">
                      Buyer Information
                    </h3>
                  </div>
                  <div className="space-y-3 grid grid-cols-1  md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                        Full Name
                      </p>
                      <p className="text-blue-900">
                        {selectedOrder?.buyer?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                        Email Address
                      </p>
                      <p className="text-sm text-blue-900 font-mono">
                        {selectedOrder?.buyer?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                        Customer ID
                      </p>
                      <p className="text-sm text-blue-900 font-mono">
                        {selectedOrder?.buyer?.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seller Information Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-medium text-emerald-800">
                      Seller Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                          Full Name
                        </p>
                        <p className="text-sm text-emerald-900">
                          {selectedOrder?.seller?.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                          Phone
                        </p>
                        <p className="text-sm text-emerald-900">
                          {selectedOrder?.seller?.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                        Email Address
                      </p>
                      <p className="text-sm text-emerald-900 font-mono">
                        {selectedOrder?.seller?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                        Company Name
                      </p>
                      <p className="text-sm text-emerald-900">
                        {selectedOrder?.seller?.companyName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                          Registration #
                        </p>
                        <p className="text-sm text-emerald-900 font-mono">
                          {selectedOrder?.seller?.companyRegistrationNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                          Country
                        </p>
                        <p className="text-sm text-emerald-900">
                          {selectedOrder?.seller?.countryOfRegistration}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                        Business Address
                      </p>
                      <p className="text-sm text-emerald-900">
                        {selectedOrder?.seller?.businessAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
                        Website
                      </p>
                      <a
                        href={selectedOrder?.seller?.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline transition-colors duration-200"
                      >
                        {selectedOrder?.seller?.websiteUrl}
                      </a>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-emerald-600 uppercase tracking-wide">
                            Verified
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedOrder?.seller?.sellerVerified
                                ? "bg-emerald-200 text-emerald-800"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {selectedOrder?.seller?.sellerVerified
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-emerald-600 uppercase tracking-wide">
                            Status
                          </p>
                          <span className="px-2 py-1 rounded-full text-xs bg-emerald-200 text-emerald-800">
                            {selectedOrder?.seller?.sellerApprovalStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-6 transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-amber-700" />
                    </div>
                    <h3 className="text-lg font-medium text-amber-800">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          Recipient Name
                        </p>
                        <p className="text-sm text-amber-900">
                          {selectedOrder?.shippingAddress?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <p className="text-sm text-amber-900 font-mono">
                          {selectedOrder?.shippingAddress?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                        Address Line 1
                      </p>
                      <p className="text-sm text-amber-900">
                        {selectedOrder?.shippingAddress?.address.line1}
                      </p>
                    </div>
                    {selectedOrder?.shippingAddress?.address.line2 && (
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          Address Line 2
                        </p>
                        <p className="text-sm text-amber-900">
                          {selectedOrder?.shippingAddress?.address.line2}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          City
                        </p>
                        <p className="text-sm text-amber-900">
                          {selectedOrder?.shippingAddress?.address.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          State
                        </p>
                        <p className="text-sm text-amber-900">
                          {selectedOrder?.shippingAddress?.address.state}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          Country
                        </p>
                        <p className="text-sm text-amber-900">
                          {selectedOrder?.shippingAddress?.address.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                          Postal Code
                        </p>
                        <p className="text-sm text-amber-900 font-mono">
                          {selectedOrder?.shippingAddress?.address?.postal_code}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-100 rounded-xl p-3">
                      <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                        Tracking Number
                      </p>
                      <p className="text-sm text-amber-900 font-mono">
                        {selectedOrder?.trackingNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundedOrderDetails;

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Printer,
  Package,
  Edit3,
  Check,
  X,
  AlertCircle,
  Truck,
  Eye,
  Loader,
  Download,
  Star,
  Phone,
  MessageCircle,
} from "lucide-react";
import { getSingleOrderItem } from "../../../services/OrderServices";
import { Link, useParams } from "react-router-dom";
import CubeLoader from "../../../utils/cubeLoader";

const SellerOrderDetailsPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showTrackingInput, setShowTrackingInput] = useState(false);
  const { itemId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const result = await getSingleOrderItem(itemId);
        setOrderData(result.data.orderItem);
        setTrackingNumber(result.data.orderItem.trackingNumber || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchOrderDetails();
    }
  }, [itemId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending approval":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (newStatus) => {
    console.log("Status change:", newStatus);
  };

  const handleAddTracking = () => {
    if (trackingNumber.trim()) {
      setShowTrackingInput(false);
      console.log("Tracking number added:", trackingNumber);
    }
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Error Loading Order</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600">
            The requested order item could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="mt-10  px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm ml-6 text-gray-500 mb-6">
              <Link
                to="/orders"
                className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
              >
                <span>Orders /</span>{" "}
              </Link>
              <span className="text-orange-500">
                {" "}
                Order {orderData.orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            {/* <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Printer size={16} />
                Print
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Download size={16} />
                Download Invoice
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
                Track Order
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order {orderData.orderId.slice(0, 8).toUpperCase()}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Placed on {formatDate(orderData.orderDate)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    orderData.orderStatus
                  )}`}
                >
                  {orderData.orderStatus.charAt(0).toUpperCase() +
                    orderData.orderStatus.slice(1)}
                </span>
              </div>

              {/* Quick Actions */}
              {!["rejected", "cancelled", "delivered"].includes(
                orderData.orderStatus.toLowerCase()
              ) && (
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                  {orderData.orderStatus.toLowerCase() ===
                    "pending approval" && (
                    <button
                      onClick={() => handleStatusChange("approved")}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      <Check size={14} />
                      Approve Order
                    </button>
                  )}
                  {["approved", "pending approval"].includes(
                    orderData.orderStatus.toLowerCase()
                  ) && (
                    <button
                      onClick={() => handleStatusChange("shipped")}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <Truck size={14} />
                      Mark as Shipped
                    </button>
                  )}
                  <button
                    onClick={() => setShowTrackingInput(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                  >
                    <Package size={14} />
                    {orderData.trackingNumber
                      ? "Update Tracking"
                      : "Add Tracking"}
                  </button>
                  {orderData.orderStatus.toLowerCase() ===
                    "pending approval" && (
                    <button
                      onClick={() => handleStatusChange("rejected")}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      <X size={14} />
                      Reject Order
                    </button>
                  )}
                </div>
              )}

              {/* Tracking Number Input */}
              {showTrackingInput && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {orderData.trackingNumber
                      ? "Update Tracking Number"
                      : "Add Tracking Number"}
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddTracking}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                      >
                        {orderData.trackingNumber ? "Update" : "Add"}
                      </button>
                      <button
                        onClick={() => setShowTrackingInput(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Tracking Number */}
              {orderData.trackingNumber && !showTrackingInput && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">
                        Tracking Number
                      </h4>
                      <p className="text-sm text-green-700 font-mono">
                        {orderData.trackingNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowTrackingInput(true)}
                      className="text-sm text-green-600 border border-green-300 px-3 py-1 rounded hover:bg-green-100"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={orderData.product.image}
                      alt={orderData.product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <Package size={32} className="text-gray-400 hidden" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {orderData.product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        (24 reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      In Stock: {orderData.product.stockRemaining}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                      <div className="text-lg">
                        <span className="text-gray-600">
                          Qty: {orderData.quantity} ×{" "}
                        </span>
                        <span className="font-semibold">
                          ${orderData.price}
                        </span>
                      </div>
                      <span className="font-bold text-xl text-gray-900">
                        ${orderData.itemTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Retipping Service */}
                {/* {orderData.requiresRetipping && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={20}
                        className="text-orange-600 flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-orange-800 mb-1">
                          Retipping Service Added
                        </h4>
                        <p className="text-sm text-orange-700 mb-2">
                          Save money by retipping your worn bit vs. buying a new
                          one
                        </p>
                        <p className="text-sm text-orange-700 mb-3">
                          Diameter: 14 inches Price: $112.00
                        </p>
                        <button className="text-sm text-orange-600 border border-orange-300 px-3 py-1 rounded hover:bg-orange-100">
                          track retipping
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${orderData.itemTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>$65.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                      <span>Total</span>
                      <span>${orderData.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Shipping Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">
                  {orderData.shippingAddress.name}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.address.line1}
                </p>
                {orderData.shippingAddress.address.line2 && (
                  <p className="text-gray-600">
                    {orderData.shippingAddress.address.line2}
                  </p>
                )}
                <p className="text-gray-600">
                  {orderData.shippingAddress.address.city},{" "}
                  {orderData.shippingAddress.address.state}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.address.country}{" "}
                  {orderData.shippingAddress.address.postal_code}
                </p>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Billing Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">
                  {orderData.buyer.fullName}
                </p>
                <p className="text-gray-600">{orderData.buyer.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Payment Method
              </h3>
              <p className="text-sm text-gray-600">
                {orderData.paymentCompleted
                  ? "Payment Completed"
                  : "Payment Pending"}
              </p>
            </div>

            {/* Delivery Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Delivery Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    Expected delivery: {formatDate(orderData.orderDate)}
                  </span>
                </div>
                {orderData.orderStatus === "delivered" && (
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-green-600">
                      Delivered on: {formatDate(orderData.orderDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Request Support Button */}
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium">
              Request Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsPage;

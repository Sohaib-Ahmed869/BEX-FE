import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Package,
  User,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CubeLoader from "../../../utils/cubeLoader";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

export default function OrderItems() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image handling states
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const { orderId } = useParams();
  // Fetch order data from API
  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/orders/${orderId}/items`);
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);

        // Initialize current image index for each order item
        const initialImageIndex = {};
        data.data.orderItems.forEach((item) => {
          initialImageIndex[item.orderItemId] = 0;
        });
        setCurrentImageIndex(initialImageIndex);
      } else {
        setError("Failed to fetch order data");
        console.error("Failed to fetch order data");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  // Get order status styling
  const getOrderStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { text: "Approved", className: "bg-green-100 text-green-700" };
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

  // Get payment status styling
  const getPaymentStatusStyle = (status) => {
    return status
      ? { text: "Paid", className: "bg-green-100 text-green-700" }
      : { text: "Unpaid", className: "bg-red-100 text-red-700" };
  };

  // Image navigation functions
  const handleImageNavigation = (itemId, direction, images) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[itemId] || 0;
      let newIndex;

      if (direction === "next") {
        newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
      }

      return { ...prev, [itemId]: newIndex };
    });
  };

  // Open image modal
  const openImageModal = (images, currentIndex = 0) => {
    setModalImages(images);
    setModalCurrentIndex(currentIndex);
    setShowImageModal(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImages([]);
    setModalCurrentIndex(0);
  };

  // Navigate in modal
  const navigateModal = (direction) => {
    if (direction === "next") {
      setModalCurrentIndex((prev) =>
        prev + 1 >= modalImages.length ? 0 : prev + 1
      );
    } else {
      setModalCurrentIndex((prev) =>
        prev - 1 < 0 ? modalImages.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 m-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={fetchOrderData}
            className="mt-4 px-4 py-2 bg-[#F47458] text-white rounded hover:bg-[#e0634a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 m-6">
        <div className="text-center text-gray-500">
          <p>No order data found</p>
        </div>
      </div>
    );
  }

  const { orderInfo, orderItems, summary } = orderData;

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-medium mb-2">Order Details</h1>
        <div className="text-sm text-gray-500 mb-6">
          <Link
            to="/admin/orders"
            className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
          >
            <span>Orders /</span>{" "}
          </Link>
          <span className="text-orange-500">Order Details</span>
        </div>
        <p className="text-gray-600">
          Order ID: {orderInfo.orderId.slice(0, 8)}
        </p>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-[#F47458]" />
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(orderInfo.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-[#F47458]" />
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">${orderInfo.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-[#F47458]" />
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  orderInfo.paymentCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {orderInfo.paymentCompleted ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-[#F47458]" />
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="font-medium">{summary.totalQuantity} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-[#F47458]" />
          Buyer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{orderInfo.buyer.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{orderInfo.buyer.email}</p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-[#F47458]" />
            Order Items ({orderItems.length})
          </h2>

          {orderItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No items found in this order</p>
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
                        Product
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Image
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Condition
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Unit Price
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Total
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Order Status
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Payment
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Seller
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => {
                      const orderStatus = getOrderStatusStyle(item.orderStatus);
                      const paymentStatus = getPaymentStatusStyle(
                        item.paymentStatus
                      );
                      const currentIndex =
                        currentImageIndex[item.orderItemId] || 0;
                      const hasImages =
                        item.product.images && item.product.images.length > 0;
                      const hasMultipleImages =
                        hasImages && item.product.images.length > 1;

                      return (
                        <tr
                          key={item.orderItemId}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200`}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="max-w-[200px]">
                              <div className="font-medium text-gray-900 truncate">
                                {item.itemTitle}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {item.productId.slice(0, 8)}...
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <div className="flex gap-1 items-center">
                              {hasImages ? (
                                <div className="relative group">
                                  <div
                                    className="w-12 h-12 rounded overflow-hidden cursor-pointer"
                                    onClick={() =>
                                      openImageModal(
                                        item.product.images,
                                        currentIndex
                                      )
                                    }
                                  >
                                    <img
                                      src={item.product.images[currentIndex]}
                                      alt="Product"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {hasMultipleImages && (
                                    <>
                                      <button
                                        className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageNavigation(
                                            item.orderItemId,
                                            "prev",
                                            item.product.images
                                          );
                                        }}
                                      >
                                        <ChevronLeft className="h-3 w-3" />
                                      </button>
                                      <button
                                        className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageNavigation(
                                            item.orderItemId,
                                            "next",
                                            item.product.images
                                          );
                                        }}
                                      >
                                        <ChevronRight className="h-3 w-3" />
                                      </button>
                                      <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {currentIndex + 1}/
                                        {item.product.images.length}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No image
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {item.product.category}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              {item.product.condition}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600 font-medium">
                            ${item.itemTotal.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-sm  capitalize font-medium ${orderStatus.className}`}
                            >
                              {orderStatus.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${paymentStatus.className}`}
                            >
                              {paymentStatus.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            <div>
                              <div className="font-medium text-sm">
                                {item.product.seller.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.product.seller.email}
                              </div>
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
                {orderItems.map((item, index) => {
                  const orderStatus = getOrderStatusStyle(item.orderStatus);
                  const paymentStatus = getPaymentStatusStyle(
                    item.paymentStatus
                  );
                  const currentIndex = currentImageIndex[item.orderItemId] || 0;
                  const hasImages =
                    item.product.images && item.product.images.length > 0;
                  const hasMultipleImages =
                    hasImages && item.product.images.length > 1;

                  return (
                    <div
                      key={item.orderItemId}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.itemTitle}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${orderStatus.className}`}
                          >
                            {orderStatus.text}
                          </span>
                        </div>
                      </div>

                      {hasImages && (
                        <div className="flex gap-2 mb-3">
                          <div className="relative group">
                            <div
                              className="w-16 h-16 rounded overflow-hidden cursor-pointer"
                              onClick={() =>
                                openImageModal(
                                  item.product.images,
                                  currentIndex
                                )
                              }
                            >
                              <img
                                src={item.product.images[currentIndex]}
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {hasMultipleImages && (
                              <>
                                <button
                                  className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageNavigation(
                                      item.orderItemId,
                                      "prev",
                                      item.product.images
                                    );
                                  }}
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </button>
                                <button
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageNavigation(
                                      item.orderItemId,
                                      "next",
                                      item.product.images
                                    );
                                  }}
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {currentIndex + 1}/
                                  {item.product.images.length}
                                </div>
                              </>
                            )}
                          </div>
                          {hasMultipleImages && (
                            <div className="flex items-center text-sm text-gray-500">
                              +{item.product.images.length - 1} more
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <p className="text-gray-900">{item.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Unit Price:</span>
                          <p className="text-gray-900">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="text-gray-900 font-medium">
                            ${item.itemTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${paymentStatus.className}`}
                          >
                            {paymentStatus.text}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-500">Seller:</span>
                        <p className="text-gray-900">
                          {item.product.seller.fullName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              ${summary.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-medium">
              ${orderInfo.platformFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2">
            <span className="text-gray-900 font-medium">Total:</span>
            <span className="font-bold text-lg">
              ${orderInfo.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative">
              <img
                src={modalImages[modalCurrentIndex]}
                alt="Product"
                className="max-w-full max-h-[80vh] object-contain"
              />

              {modalImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateModal("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigateModal("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                    {modalCurrentIndex + 1} / {modalImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

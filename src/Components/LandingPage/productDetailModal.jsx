import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  DollarSign,
  X,
  Calendar,
  Weight,
  Ruler,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Reset image index when product changes
  useEffect(() => {
    setModalImageIndex(0);
  }, [product]);

  // Handle modal image navigation
  const handleModalImageNavigation = (direction) => {
    if (!product || !product.images || product.images.length <= 1) return;

    if (direction === "prev") {
      setModalImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setModalImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Very Good (VG)":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h2>
            <p className="text-gray-600">{product.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 h-80">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[modalImageIndex]
                      : "/api/placeholder/400/300"
                  }
                  alt={product.title}
                  className="w-full h-full object-contain"
                />

                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleModalImageNavigation("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleModalImageNavigation("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setModalImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === modalImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Price and Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Quantity: {product.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                      product.condition
                    )}`}
                  >
                    {product.condition}
                  </span>
                  {product.is_verified && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description &&
                product.description !== "TEST" &&
                product.description !== "test" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{product.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{product.weight} lbs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">
                      {product.length}" × {product.width}" × {product.height}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Listed</p>
                    <p className="font-medium">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Specifications
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => {
                          if (
                            !value ||
                            key === "location" ||
                            key === "sellerNotes" ||
                            key === "usageHistory" ||
                            key === "maintenanceHistory" ||
                            key === "includedAccessories"
                          )
                            return null;

                          const formatKey = (key) => {
                            return key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());
                          };

                          return (
                            <div
                              key={key}
                              className="flex justify-between items-center py-1"
                            >
                              <span className="text-gray-600 capitalize">
                                {formatKey(key)}:
                              </span>
                              <span className="font-medium text-gray-900">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value.toString()}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Additional Info */}
              {product.specifications &&
                (product.specifications.sellerNotes ||
                  product.specifications.usageHistory ||
                  product.specifications.maintenanceHistory) && (
                  <div className="space-y-4">
                    {product.specifications.sellerNotes &&
                      !product.specifications.sellerNotes.includes("Lorem") && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Seller Notes
                          </h4>
                          <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg">
                            {product.specifications.sellerNotes}
                          </p>
                        </div>
                      )}
                    {product.specifications.usageHistory &&
                      !product.specifications.usageHistory.includes(
                        "Lorem"
                      ) && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Usage History
                          </h4>
                          <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded-lg">
                            {product.specifications.usageHistory}
                          </p>
                        </div>
                      )}
                    {product.specifications.maintenanceHistory &&
                      !product.specifications.maintenanceHistory.includes(
                        "Lorem"
                      ) && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Maintenance History
                          </h4>
                          <p className="text-gray-600 text-sm bg-green-50 p-3 rounded-lg">
                            {product.specifications.maintenanceHistory}
                          </p>
                        </div>
                      )}
                  </div>
                )}

              {/* Special Notices */}
              <div className="space-y-2">
                {product.requires_retipping && (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      This item may require retipping before use
                    </span>
                  </div>
                )}
                {product.expiration_date && (
                  <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Listing expires on{" "}
                      {new Date(product.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

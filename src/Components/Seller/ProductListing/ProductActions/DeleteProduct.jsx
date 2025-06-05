import { MdOutlineBlock } from "react-icons/md";
import React, { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

// Mock icon component since MdOutlineBlock isn't available

const RemoveProductModal = ({
  isOpen = true,
  onClose = () => {},
  productId,
  onProductDeleted = () => {}, // Callback to handle successful deletion
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!productId) {
      setError("Product ID is required");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Mock API call - replace with your actual deleteProduct service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      onProductDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MdOutlineBlock className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Remove product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 -m-1"
            disabled={isDeleting}
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
            You're about to permanently remove this product listing from the
            platform. Once removed:
          </p>

          <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
              <span>
                The product will no longer appear in search or inventory
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
              <span>
                All associated details (price, specs, images) will be deleted
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
              <span>This action cannot be undone</span>
            </li>
          </ul>

          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            If you're unsure, consider flagging the product instead for
            temporary review.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start sm:items-center">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors order-2 sm:order-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-2 cursor-pointer text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Removing...
                </div>
              ) : (
                "Remove product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductModal;

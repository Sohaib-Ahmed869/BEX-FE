import React, { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { MdOutlineBlock } from "react-icons/md";
import { deleteProduct } from "../../../../services/productsServices";

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
      const result = await deleteProduct(productId);

      if (result.success) {
        // Success - call the callback function
        onProductDeleted();
        onClose();
      } else {
        // Handle API error
        const errorMessage =
          result.error?.message || "Failed to delete product";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2/5 px-8 py-7 w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <MdOutlineBlock size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Remove product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 mb-4">
            You're about to permanently remove this product listing from the
            platform. Once removed:
          </p>

          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              The product will no longer appear in search or inventory
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              All associated details (price, specs, images) will be deleted
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              This action cannot be undone
            </li>
          </ul>

          <p className="text-sm text-gray-500 mb-6">
            If you're unsure, consider flagging the product instead for
            temporary review.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

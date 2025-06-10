import React from "react";
import { X, Star, StarOff } from "lucide-react";

const FeatureProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  selectedProduct,
  actionType, // "feature" or "unfeature"
}) => {
  if (!isOpen) return null;

  const isFeature = actionType === "feature";
  const Icon = isFeature ? Star : StarOff;
  const title = isFeature ? "Feature Product?" : "Unfeature Product?";
  const actionText = isFeature ? "Feature" : "Unfeature";
  const actionColor = isFeature
    ? "bg-blue-500 hover:bg-blue-600"
    : "bg-red-500 hover:bg-red-600";
  const iconBgColor = isFeature ? "bg-blue-100" : "bg-red-100";
  const iconColor = isFeature ? "text-blue-500" : "text-red-500";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedProduct && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 text-sm">
                {selectedProduct.title}
              </h3>
              <p className="text-gray-600 text-xs mt-1">
                Category: {selectedProduct.category}
              </p>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-6">
            {isFeature
              ? "You're about to feature this product. Featured products will have higher visibility and appear prominently in search results and listings."
              : "You're about to unfeature this product. It will no longer have premium visibility but will remain active in regular listings."}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-4 py-2 ${actionColor} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                {isSubmitting ? `${actionText}ing...` : `${actionText} Product`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeatureProductModal;

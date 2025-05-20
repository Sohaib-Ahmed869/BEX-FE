import { Tag } from "lucide-react";

const ProductInfoViewComponent = ({ formData = {} }) => {
  // Helper function to handle empty data gracefully
  const displayValue = (value) => value || "Not specified";

  // Format price with currency symbol if available
  const formatPrice = (price) => {
    if (!price) return "Price not specified";
    return `$${parseFloat(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get condition color based on condition value
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Like New":
        return "bg-emerald-100 text-emerald-800";
      case "Very Good (VG)":
        return "bg-teal-100 text-teal-800";
      case "Good Condition (GC)":
        return "bg-blue-100 text-blue-800";
      case "Fair Condition (FC)":
        return "bg-yellow-100 text-yellow-800";
      case "Poor Condition (PC)":
        return "bg-orange-100 text-orange-800";
      case "For Parts / Not Working":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6">
      <h2 className="text-2xl text-[#F47458] font-semibold mb-4">
        Product Information
      </h2>

      {/* Product Name */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {displayValue(formData.title)}
        </h1>

        {/* Category Tag */}
        {formData.category && (
          <div className="flex items-center mt-2">
            <Tag className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{formData.category}</span>
          </div>
        )}
      </div>

      {/* Price and Condition Row */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* Price */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
          <p className="text-xl font-semibold text-gray-900">
            {formatPrice(formData.price)}
          </p>
        </div>

        {/* Stock */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Stock</h3>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">
              {formData.quantity || 0}
            </span>
            <span className="text-xl font-semibold text-gray-900 ml-3">
              {" "}
              Units
            </span>
          </div>
        </div>

        {/* Condition */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Condition</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getConditionColor(
              formData.condition
            )}`}
          >
            {displayValue(formData.condition)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {formData.description ? (
            <p className="text-gray-700 whitespace-pre-wrap">
              {formData.description}
            </p>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <div className="text-sm text-gray-500">Product ID:</div>
            <div className="text-sm font-medium">
              {formData.id?.substring(0, 8)}
            </div>
          </div>
          <div className="flex gap-4">
            <div className=" text-sm text-gray-500">Brand:</div>
            <div className="text-sm font-medium">
              {formData.specifications?.brand || "Not specified"}
            </div>
          </div>
          {formData.dimensions && (
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Dimensions:</div>
              <div className="text-sm font-medium">{formData.dimensions}</div>
            </div>
          )}
          {formData.weight && (
            <div className="flex">
              <div className="w-40 text-sm text-gray-500">Weight:</div>
              <div className="text-sm font-medium">{formData.weight}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfoViewComponent;

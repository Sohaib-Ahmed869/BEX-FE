import React from "react";

/**
 * A styled label-value pair component for displaying a specification
 */
const SpecificationItem = ({ label, value, index }) => {
  // Format the value based on its type
  const formattedValue = (() => {
    if (value === null || value === undefined) return "-";

    // Handle different value types
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    return value.toString();
  })();

  // Format the label (convert camelCase to Title Case)
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  return (
    <div className="flex items-center justify-between border-b py-4 border-gray-200">
      <span className="text-md font-medium text-gray-700">
        {index}.<span className="ml-2"> {formattedLabel}</span>
      </span>
      <span className="text-md text-gray-900">{formattedValue}</span>
    </div>
  );
};

/**
 * Component to display product specifications dynamically
 */
const ProductSpecifications = ({ specifications = {} }) => {
  const groupSpecifications = (specs) => {
    // Optional: Group specs into categories if needed
    return specs;
  };

  if (!specifications || Object.keys(specifications).length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No specifications available
      </div>
    );
  }

  // Filter out empty values
  const filteredSpecs = Object.entries(specifications).filter(
    ([_, value]) => value !== "" && value !== null && value !== undefined
  );
  let index = 0;
  return (
    <div className="bg-white rounded-lg shadow overflow-auto mb-20">
      <div className="bg-white px-4 py-3 border-b border-blue-100">
        <h2 className="text-2xl ml-2 font-medium text-[#F47458]">
          Product Specifications
        </h2>
      </div>
      <div className="p-4 divide-y divide-gray-200">
        {filteredSpecs.map(([key, value]) => (
          <SpecificationItem
            key={key}
            label={key}
            index={++index}
            value={value}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;

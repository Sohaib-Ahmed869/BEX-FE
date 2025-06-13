import { useState } from "react";
import { X } from "lucide-react";

const EditListingModal = ({ isOpen, onClose, listing, onUpdate }) => {
  const [productName, setProductName] = useState(listing?.Product_Name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const URL = import.meta.env.VITE_REACT_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${URL}/api/listing/update/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Product_Name: productName.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(); // Refresh the listings data
        onClose(); // Close the modal
      } else {
        setError(data.message || "Failed to update listing name");
      }
    } catch (err) {
      setError("An error occurred while updating the listing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProductName(listing?.Product_Name || "");
    setError("");
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Edit Listing Name
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F47458] focus:border-[#F47458] text-sm sm:text-base"
              placeholder="Enter product name"
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47458] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#F47458] border border-transparent rounded-md hover:bg-[#e0653f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47458] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !productName.trim()}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListingModal;

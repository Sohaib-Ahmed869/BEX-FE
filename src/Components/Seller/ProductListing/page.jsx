import { useEffect, useState } from "react";
import {
  ChevronDown,
  Plus,
  ArrowUpRight,
  Pencil,
  Trash,
  Menu,
  X,
} from "lucide-react";
import SellerHeader from "../sellerHeader/page";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CubeLoader from "../../../utils/cubeLoader";
import { calculateDaysUntilExpiration } from "../../../utils/calculateDaysLeft";
import RemoveProductModal from "./ProductActions/DeleteProduct";
import { toast } from "react-toastify";
import PricingGuidanceModal from "./ProductActions/pricingGuidanceModal";
import { fetchSellerProducts } from "../../../services/productsServices";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const userId = localStorage.getItem("userId");

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchSellerProducts(userId);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch products");
      setError(err.message || "An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const handleProductDeleted = () => {
    toast.success("Product deleted successfully");
    fetchProducts();
  };

  // Filter products (exclude archived ones)
  const filteredProducts = products.filter((product) => !product.is_Archived);

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const currentPageProducts = getCurrentPageProducts();
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Reset to last valid page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Calculate stock status based on quantity
  const getStockStatus = (quantity) => {
    if (quantity <= 0) return "Out of stock";
    if (quantity < 5) return "Low stock";
    return "In stock";
  };

  // Get stock status badge style
  const getStockStatusStyle = (status) => {
    switch (status) {
      case "In stock":
        return "bg-[#E8F3E5] text-green-500";
      case "Out of stock":
        return "bg-red-100 text-red-500";
      case "Low stock":
        return "bg-yellow-50 text-yellow-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // Get listing status badge style
  const getListingStatusStyle = (status) => {
    switch (status) {
      case true:
        return "bg-[#E8F3E5] text-green-500";
      case false:
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get listing status text
  const getListingStatusText = (isActive) => {
    return isActive ? "Active" : "Hidden";
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle deleting a product
  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      {/* Header */}
      <SellerHeader />
      {loading && <CubeLoader />}

      {/* Main Content */}
      <main className="p-2 sm:p-4 lg:p-6">
        <h1 className="text-2xl sm:text-3xl font-medium mb-4">
          Inventory list
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between mb-6">
          <button
            onClick={() => setShowPricingModal(true)}
            className="group flex items-center justify-center w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] uppercase bg-white gap-2 px-4 py-3 sm:py-2.5 lg:py-3 border border-[#F47458] rounded-md cursor-pointer text-[#F47458] hover:bg-[#F47458] hover:text-white transition-all duration-300 ease-in-out"
          >
            <span className="text-sm sm:text-sm lg:text-base font-medium">
              See Pricing Info
            </span>
          </button>
        </div>

        {/* Product Table/Cards */}
        <div className="bg-white py-4 sm:py-8 px-2 sm:px-4 rounded-md shadow-sm animate-fadeIn">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-sm sm:text-base">
                No Inventory found. Create your first listing and add inventory.
              </p>
              <Link
                to={"/listing/add"}
                className="mt-4 px-4 py-2 inline-block bg-[#F47458] text-white rounded-md hover:bg-[#ee6a4c] transition-colors text-sm sm:text-base"
              >
                Add Listing
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        #
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Inventory Name
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Inventory Code
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Manufacturer
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Condition
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Expires in
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Stock status
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                        Listing status
                      </th>
                      <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageProducts.map((product, index) => {
                      const stockStatus = getStockStatus(product.quantity);
                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200 animate-fadeIn`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {product.title}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {product.id.substring(0, 6)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {product.specifications?.brand || "N/A"}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {product.condition.split(" (")[0] ||
                              product.condition ||
                              "N/A"}
                          </td>
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {calculateDaysUntilExpiration(
                              product.expiration_date
                            ) || "N/A"}
                          </td>
                          <td className="py-3 border-r border-gray-100 px-4">
                            <span
                              className={`px-2 py-1 w-25 text-center block capitalize rounded-md text-sm font-regular ${getStockStatusStyle(
                                stockStatus
                              )}`}
                            >
                              {stockStatus}
                            </span>
                          </td>
                          <td className="py-3 border-r border-gray-100 px-4">
                            <span
                              className={`px-2 py-1 w-25 text-center block capitalize rounded-md text-sm font-regular ${getListingStatusStyle(
                                product.list_for_selling
                              )}`}
                            >
                              {getListingStatusText(product.list_for_selling)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              <Link
                                className="p-2 border bg-white border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200"
                                title="View Product"
                                to={`/product-list/view/${product.id}`}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                              <Link
                                className="p-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200"
                                title="Edit Product"
                                to={`/product-list/edit/${product.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                className="p-2 border border-gray-200 cursor-pointer rounded hover:bg-gray-100 transition-colors duration-200"
                                title="Delete Product"
                                onClick={() => handleDeleteClick(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View - FIXED: Now uses currentPageProducts */}
              <div className="lg:hidden space-y-4">
                {currentPageProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Product Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                            {product.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Code: {product.id.substring(0, 6)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Product Details Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500">Manufacturer:</span>
                          <p className="text-gray-900 font-medium">
                            {product.specifications?.brand || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <p className="text-gray-900 font-medium">
                            {product.condition.split(" (")[0] ||
                              product.condition ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expires in:</span>
                          <p className="text-gray-900 font-medium">
                            {calculateDaysUntilExpiration(
                              product.expiration_date
                            ) || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStockStatusStyle(
                              stockStatus
                            )}`}
                          >
                            {stockStatus}
                          </span>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">
                            Status:
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getListingStatusStyle(
                              product.list_for_selling
                            )}`}
                          >
                            {getListingStatusText(product.list_for_selling)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            className="flex-1 sm:flex-none p-2 border bg-white border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200 text-center"
                            title="View Product"
                            to={`/product-list/view/${product.id}`}
                          >
                            <ArrowUpRight className="h-4 w-4 mx-auto" />
                          </Link>
                          <Link
                            className="flex-1 sm:flex-none p-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200 text-center"
                            title="Edit Product"
                            to={`/product-list/edit/${product.id}`}
                          >
                            <Pencil className="h-4 w-4 mx-auto" />
                          </Link>
                          <button
                            className="flex-1 sm:flex-none p-2 border border-gray-200 cursor-pointer rounded hover:bg-gray-100 transition-colors duration-200"
                            title="Delete Product"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <Trash className="h-4 w-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination - Only show if there are products */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-6 sm:mt-8 animate-fadeIn">
              {/* Items per page selector */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <div className="relative">
                    <select
                      className="appearance-none border border-gray-200 rounded-lg text-gray-700 px-2 py-1 pr-8 text-sm"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Pagination Controls - Only show if more than one page */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="text-sm text-gray-500 text-center sm:text-left">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        totalItems
                      )}{" "}
                      to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                      {totalItems} results
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 border border-gray-100 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <ChevronDown className="h-4 w-4 text-gray-500 transform rotate-90" />
                      </button>

                      <div className="flex items-center gap-1 max-w-xs overflow-x-auto">
                        {getPaginationNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-sm"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${page}`}
                              className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 text-sm ${
                                currentPage === page
                                  ? "bg-[#F47458] text-white"
                                  : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        className="p-2 border border-gray-100 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ChevronDown className="h-4 w-4 text-gray-500 transform -rotate-90" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <RemoveProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={selectedProductId}
        onProductDeleted={handleProductDeleted}
      />
      {showPricingModal && (
        <PricingGuidanceModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </div>
  );
}

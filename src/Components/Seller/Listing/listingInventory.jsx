import { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  Plus,
  ArrowUpRight,
  Pencil,
  Trash,
  Menu,
  X,
  Flag,
} from "lucide-react";
import SellerHeader from "../sellerHeader/page";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CubeLoader from "../../../utils/cubeLoader";
import { calculateDaysUntilExpiration } from "../../../utils/calculateDaysLeft";
import RemoveProductModal from "../ProductListing/ProductActions/DeleteProduct";
import { toast } from "react-toastify";
import PricingGuidanceModal from "../ProductListing/ProductActions/pricingGuidanceModal";
import { fetchListingSpecificProducts } from "../../../services/listingServices";
import { deleteProduct } from "../../../services/productsServices";

export default function ListingInventoryProducts() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Frontend pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { listingId } = useParams();

  // Filter out archived products and calculate pagination
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => !product.is_Archived);
  }, [allProducts]);

  // Calculate pagination values
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Fetch all products from API (no pagination parameters)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchListingSpecificProducts(listingId);
      console.log(response);
      if (response.success) {
        setAllProducts(response.data);
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
  }, [listingId]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Ensure current page is valid when products change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleProductDeleted = async () => {
    try {
      const response = await deleteProduct(selectedProductId);
      console.log(response.success);
      if (response.success) {
        toast.success("Product deleted successfully");
        await fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
      if (err.response && err.response.status === 404) {
        toast.error("Product not found");
      }
    } finally {
      // If we're on the last page and it becomes empty, go to previous page
      const remainingItems = totalItems - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

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

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // currentPage will be reset to 1 by the useEffect above
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
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Handle deleting a product
  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  // Get the current page's starting index for row numbering
  const getRowStartIndex = () => {
    return (currentPage - 1) * itemsPerPage;
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
        <div className="text-sm text-gray-500 mb-6">
          <Link
            to="/seller/listing"
            className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
          >
            <span>Product list /</span>{" "}
          </Link>
          <span className="text-orange-500">Listing Inventory</span>
        </div>
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
          {filteredProducts.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-sm sm:text-base">
                No products found for this Listing.
              </p>
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
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500 text-nowrap">
                        Inventory Name
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500 text-nowrap">
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
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500 text-nowrap">
                        Expires in
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500 text-nowrap">
                        Stock Quantity
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm text-gray-500 text-nowrap">
                        Listing status
                      </th>
                      <th className="py-3 px-4 text-center font-medium text-sm text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product, index) => {
                      const stockStatus = getStockStatus(product.quantity);
                      const rowNumber = getRowStartIndex() + index + 1;
                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-100 ${
                            index % 2 !== 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors duration-200 animate-fadeIn`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                            {rowNumber}
                          </td>
                          <td className="py-3 flex items-center gap-1 px-4 border-r border-gray-100 text-gray-600">
                            {product.title}
                            {product.is_flagged && (
                              <Flag className="h-4 w-4 text-red-500" />
                            )}
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
                          <td className="py-3 px-4 border-r border-gray-100 text-gray-600 text-nowrap">
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
                              {product.quantity}
                            </span>
                          </td>
                          <td className="py-3 border-r border-gray-100 px-4">
                            <span
                              className={`px-2 py-1 w-25 text-center block capitalize rounded-md text-sm font-regular ${getListingStatusStyle(
                                product.is_active
                              )}`}
                            >
                              {getListingStatusText(product.is_active)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              <Link
                                className="p-2 border bg-white border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200"
                                title="View Product"
                                to={`/seller/product-list/view/${product.id}`}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                              <Link
                                className="p-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200"
                                title="Edit Product"
                                to={`/seller/product-list/edit/${product.id}`}
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

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {currentProducts.map((product, index) => {
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
                            {product.quantity}
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
                              product.is_active
                            )}`}
                          >
                            {getListingStatusText(product.is_active)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            className="flex-1 sm:flex-none p-2 border bg-white border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200 text-center"
                            title="View Product"
                            to={`/seller/product-list/view/${product.id}`}
                          >
                            <ArrowUpRight className="h-4 w-4 mx-auto" />
                          </Link>
                          <Link
                            className="flex-1 sm:flex-none p-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors duration-200 text-center"
                            title="Edit Product"
                            to={`/seller/product-list/edit/${product.id}`}
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

          {/* Pagination */}
          {!loading && !error && totalItems > 0 && (
            <div className="mt-6 sm:mt-8 animate-fadeIn">
              {/* Items per page selector */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <div className="relative">
                    <select
                      className="appearance-none border border-gray-200 rounded-lg text-gray-700 px-2 py-1 pr-8 text-sm"
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    {totalItems > 0 ? (
                      <>
                        {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                        {totalItems} results
                      </>
                    ) : (
                      "0 to 0 of 0 results"
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 border border-gray-100 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                              className="px-2 text-sm text-gray-500"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${page}`}
                              className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 text-sm ${
                                currentPage === page
                                  ? "bg-[#f47458] text-white"
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
                        className="p-2 border border-gray-100 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ChevronDown className="h-4 w-4 text-gray-500 transform -rotate-90" />
                      </button>
                    </div>
                  )}
                </div>
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

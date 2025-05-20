import { useEffect, useState } from "react";
import { ChevronDown, Plus, ArrowUpRight, Pencil, Trash } from "lucide-react";
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
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Get the user ID from localStorage or context
  const userId =
    localStorage.getItem("userId") || "a4045d5e-b86b-41f4-8104-b3fd4d858a58"; // Default for testing

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchSellerProducts(userId);
      if (response.success) {
        setProducts(response.data);
        setTotalItems(response.count);
        setTotalPages(Math.ceil(response.count / itemsPerPage));
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
  // Calculate pagination when itemsPerPage changes
  useEffect(() => {
    if (totalItems > 0) {
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    }
  }, [itemsPerPage, totalItems]);

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
    // In a real implementation, you would fetch data for the specific page
    // fetchProducts(page, itemsPerPage);
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
    <div className="bg-gray-100 p-10 min-h-screen">
      {/* Header */}
      <SellerHeader />
      {loading && <CubeLoader />}

      {/* Main Content */}
      <main className="p-6">
        <h1 className="text-3xl font-medium  mb-4">Product list</h1>

        {/* New Product Button */}
        <div className=" flex justify-between mb-6">
          <button
            onClick={() => navigate("/product-list/new")}
            className="group flex items-center w-60 bg-white gap-2 px-4 py-3 border border-[#F47458] rounded-md cursor-pointer text-[#F47458] hover:bg-[#F47458] hover:text-white transition-all duration-300 ease-in-out"
          >
            <Plus className="h-4 w-4 text-[#F47458]-500 group-hover:text-white transition-colors duration-300" />
            <span>NEW PRODUCT</span>
          </button>
          <button
            onClick={() => setShowPricingModal(true)}
            className="group flex items-center w-content uppercase bg-white gap-2 px-4 py-3 border border-[#F47458] rounded-md cursor-pointer text-[#F47458] hover:bg-[#F47458] hover:text-white transition-all duration-300 ease-in-out"
          >
            <span>See Pricing Info</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white py-8 px-4 rounded-md shadow-sm animate-fadeIn">
          {/* {error} ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
          ) : */}
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No products found. Add your first product to get started.</p>
              <Link
                to={"/product-list/new"}
                className="mt-4 px-4 py-2 inline-block bg-[#F47458] text-white rounded-md hover:bg-[#ee6a4c] transition-colors"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                      #
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                      Product name
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                      Product code
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
                  {products.map((product, index) => {
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
                          {product.condition || "N/A"}
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
                              className="p-2 border border-gray-200  cursor-pointer rounded hover:bg-gray-100 transition-colors duration-200"
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
          )}

          {/* Pagination (only show if we have products) */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-4 flex justify-between items-center animate-fadeIn">
              <div className="flex items-center gap-2 mt-8">
                <span className="text-sm text-gray-500">Show</span>
                <div className="relative">
                  <select
                    className="appearance-none border border-gray-200 rounded-lg text-gray-700 px-2 py-1 pr-8 text-sm"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500 mr-4">
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} results
                </div>
                <button
                  className="p-2 border border-gray-100 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500 transform rotate-90" />
                </button>

                {getPaginationNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 ${
                        currentPage === page
                          ? "bg-blue-300 text-white"
                          : "border border-gray-200 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

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

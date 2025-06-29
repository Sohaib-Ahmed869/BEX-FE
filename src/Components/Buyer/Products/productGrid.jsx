import React, { useState, useEffect } from "react";
import ProductItem from "./productItem";
import { Grid, List, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const ProductGrid = ({ products }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("Featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sort options
  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
  ];

  // Items per page options
  const itemsPerPageOptions = [10, 20, 30, 50];
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Tailwind's md breakpoint
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    // Check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setFilteredProducts(products || []);
      setIsLoading(false);
    }, 500);
  }, [products]);

  // Calculate pagination values
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sorted = [...filteredProducts];

    switch (value) {
      case "Featured":
        // Sort to show featured products first, then non-featured
        sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0; // Keep original order for products with same featured status
        });
        break;
      case "Price: Low to High":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "Newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        // "Sort by" - keep original order or you could sort by created_at
        break;
    }

    setFilteredProducts(sorted);
    setCurrentPage(1); // Reset to first page after sorting
  };

  const HandleAddtoCart = () => {
    toast.success("Product added to cart!");
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handlePageJump = (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <div className="w-full px-2 mt-10">
        {/* Header with view options and sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} products
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mt-4 md:mt-0 px-4 md:px-0">
            {/* View Mode Controls */}
            <div className="flex items-center justify-between md:justify-start">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">View:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-gray-800"
                        : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-gray-100 text-gray-800"
                        : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Items per page on mobile (moved here for better mobile layout) */}
              <div className="flex items-center md:hidden">
                <span className="text-sm text-gray-500 mr-2">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Controls - Full width on mobile */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 flex-shrink-0">
                Sort by:
              </span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 flex-1 md:flex-initial min-w-0"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Items per page - Desktop only (hidden on mobile) */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-500 mr-2">Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px] place-items-center">
            {Array.from({ length: itemsPerPage }, (_, index) => (
              <div key={index} className="w-full max-w-sm animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "flex gap-10 flex-wrap"
                : "flex flex-col space-y-4"
            } min-h-[600px]`}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <ProductItem
                    product={product}
                    listView={viewMode === "list"}
                    onAddToCart={HandleAddtoCart}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-20 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Page {currentPage} of {totalPages} ({totalItems} total items)
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Jump to page dropdown */}
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Go to page:</span>
                <select
                  value={currentPage}
                  onChange={handlePageJump}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Pagination navigation */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        page === currentPage
                          ? "bg-[#F4748B] text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGrid;

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import CubeLoader from "../../../utils/cubeLoader";

const URL = import.meta.env.VITE_REACT_BACKEND_URL;

function AdminProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Image handling states
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${URL}/api/products/?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);

        // Initialize current image index for each product
        const initialImageIndex = {};
        data.data.forEach((product) => {
          initialImageIndex[product.id] = 0;
        });
        setCurrentImageIndex(initialImageIndex);
      } else {
        setError("Failed to fetch products");
        console.error("Failed to fetch products");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]);

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0)
      return { text: "Out of Stock", className: "bg-red-100 text-red-500" };
    if (stock < 5)
      return { text: "Low Stock", className: "bg-yellow-50 text-yellow-500" };
    return { text: "In Stock", className: "bg-green-100 text-green-500" };
  };
  const getListingStatusText = (isActive) => {
    return isActive ? "Active" : "Hidden";
  };
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
  // Image navigation functions
  const handleImageNavigation = (productId, direction, images) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      let newIndex;

      if (direction === "next") {
        newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
      }

      return { ...prev, [productId]: newIndex };
    });
  };

  // Open image modal
  const openImageModal = (images, currentIndex = 0) => {
    setModalImages(images);
    setModalCurrentIndex(currentIndex);
    setShowImageModal(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImages([]);
    setModalCurrentIndex(0);
  };

  // Navigate in modal
  const navigateModal = (direction) => {
    if (direction === "next") {
      setModalCurrentIndex((prev) =>
        prev + 1 >= modalImages.length ? 0 : prev + 1
      );
    } else {
      setModalCurrentIndex((prev) =>
        prev - 1 < 0 ? modalImages.length - 1 : prev - 1
      );
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Parse images from product data
  const parseImages = (product) => {
    // Check if product has images in different possible formats
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    if (product.Images && Array.isArray(product.Images)) {
      return product.Images;
    }
    if (product.image_urls && Array.isArray(product.image_urls)) {
      return product.image_urls;
    }
    // If images is a string, try to parse it as JSON
    if (typeof product.images === "string") {
      try {
        return JSON.parse(product.images);
      } catch (e) {
        return [product.images];
      }
    }
    return [];
  };

  if (loading) {
    return <CubeLoader />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-10 min-h-screen">
      <div className="mt-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-medium mb-4">All Products</h1>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 my-10">
            {products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No products found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-white border-b border-gray-100">
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          #
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Product
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Category
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Brand
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Listing Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Stock Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Images
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Created
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => {
                        const stockStatus = getStockStatus(
                          product.quantity || 0
                        );
                        const productImages = parseImages(product);
                        const currentIndex = currentImageIndex[product.id] || 0;
                        const hasImages = productImages.length > 0;
                        const hasMultipleImages =
                          hasImages && productImages.length > 1;

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
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.title || "N/A"}
                                </div>
                                {product.id && (
                                  <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {product.id.slice(0, 8)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              {product.category || "N/A"}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              {product.specifications.brand ||
                                product.manufacturer ||
                                "N/A"}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              ${product.price || "0.00"}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-2 py-1 w-25 text-center block capitalize rounded-md text-sm font-regular ${getListingStatusStyle(
                                  product.is_active
                                )}`}
                              >
                                {getListingStatusText(product.is_active)}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <span
                                className={`px-2 py-1 rounded text-sm font-medium ${stockStatus.className}`}
                              >
                                {stockStatus.text}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100 text-gray-600">
                              <div className="flex gap-1 items-center">
                                {hasImages ? (
                                  <div className="relative group">
                                    <div
                                      className="w-12 h-12 rounded overflow-hidden cursor-pointer"
                                      onClick={() =>
                                        openImageModal(
                                          productImages,
                                          currentIndex
                                        )
                                      }
                                    >
                                      <img
                                        src={productImages[currentIndex]}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.src =
                                            "/api/placeholder/48/48";
                                        }}
                                      />
                                    </div>

                                    {hasMultipleImages && (
                                      <>
                                        <button
                                          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageNavigation(
                                              product.id,
                                              "prev",
                                              productImages
                                            );
                                          }}
                                        >
                                          <ChevronLeft className="h-3 w-3" />
                                        </button>
                                        <button
                                          className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageNavigation(
                                              product.id,
                                              "next",
                                              productImages
                                            );
                                          }}
                                        >
                                          <ChevronRight className="h-3 w-3" />
                                        </button>
                                        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          {currentIndex + 1}/
                                          {productImages.length}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    No images
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(
                                product.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 flex justify-end">
                              <div className="flex justify-center gap-2">
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-100">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-100">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-100 text-red-500">
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

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {products.map((product, index) => {
                    const stockStatus = getStockStatus(product.quantity || 0);
                    const productImages = parseImages(product);
                    const currentIndex = currentImageIndex[product.id] || 0;
                    const hasImages = productImages.length > 0;
                    const hasMultipleImages =
                      hasImages && productImages.length > 1;

                    return (
                      <div
                        key={product.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {product.title || "N/A"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {product.category || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.id.slice(0, 8) || "N/A"}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${stockStatus.className}`}
                          >
                            {stockStatus.text}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Brand:</span>
                            <p className="text-gray-900">
                              {product.specifications.brand || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <p className="text-gray-900">
                              ${product.price || "0.00"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>
                            <p className="text-gray-900">
                              {product.quantity || 0}
                            </p>
                          </div>
                        </div>

                        {hasImages && (
                          <div className="flex gap-2 mb-3">
                            <div className="relative group">
                              <div
                                className="w-16 h-16 rounded overflow-hidden cursor-pointer"
                                onClick={() =>
                                  openImageModal(productImages, currentIndex)
                                }
                              >
                                <img
                                  src={productImages[currentIndex]}
                                  alt="Product"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/api/placeholder/64/64";
                                  }}
                                />
                              </div>

                              {hasMultipleImages && (
                                <>
                                  <button
                                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageNavigation(
                                        product.id,
                                        "prev",
                                        productImages
                                      );
                                    }}
                                  >
                                    <ChevronLeft className="h-3 w-3" />
                                  </button>
                                  <button
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageNavigation(
                                        product.id,
                                        "next",
                                        productImages
                                      );
                                    }}
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                  </button>
                                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {currentIndex + 1}/{productImages.length}
                                  </div>
                                </>
                              )}
                            </div>
                            {hasMultipleImages && (
                              <div className="flex items-center text-sm text-gray-500">
                                +{productImages.length - 1} more
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded hover:bg-gray-100">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 border border-gray-200 rounded hover:bg-gray-100">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button className="p-2 border border-gray-200 rounded hover:bg-gray-100 text-red-500">
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-500">per page</span>
                    <span className="text-sm text-gray-500 ml-4">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        pagination.totalCount
                      )}{" "}
                      of {pagination.totalCount} results
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
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
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
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
                      className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative">
              <img
                src={modalImages[modalCurrentIndex]}
                alt="Product"
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  e.target.src = "/api/placeholder/800/600";
                }}
              />

              {modalImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateModal("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigateModal("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                    {modalCurrentIndex + 1} / {modalImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsTable;

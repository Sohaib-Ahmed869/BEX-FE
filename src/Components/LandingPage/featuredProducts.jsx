import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Package,
  DollarSign,
  Heart,
} from "lucide-react";
import ProductDetailModal from "./productDetailModal";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageIndexes, setImageIndexes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/getFeaturedProducts"
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          // Initialize image indexes for each product
          const initialIndexes = {};
          data.data.forEach((product) => {
            initialIndexes[product.id] = 0;
          });
          setImageIndexes(initialIndexes);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error fetching products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (products.length > 4) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const maxSlide = Math.max(0, products.length - 4);
          return prev >= maxSlide ? 0 : prev + 1;
        });
      }, 4000); // Auto-slide every 4 seconds

      setAutoSlideInterval(interval);

      return () => clearInterval(interval);
    }
  }, [products.length]);

  // Clear auto-slide on manual navigation
  const clearAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      setAutoSlideInterval(null);
    }
  };

  // Open product modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close product modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleImageNavigation = (productId, direction) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;

    setImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      let newIndex;

      if (direction === "prev") {
        newIndex =
          currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
      } else {
        newIndex =
          currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
      }

      return { ...prev, [productId]: newIndex };
    });
  };

  // Handle main slider navigation
  const handleSliderNavigation = (direction) => {
    clearAutoSlide();
    if (direction === "prev") {
      setCurrentSlide((prev) =>
        prev === 0 ? Math.max(0, products.length - 4) : Math.max(0, prev - 1)
      );
    } else {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, products.length - 4);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-600 border-green-200";
      case "Very Good (VG)":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "Good":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading products
      </div>
    );
  }

  const maxSlide = Math.max(0, products.length - 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Featured Products
        </h2>
        <p className="text-gray-600">
          Discover our top-rated drilling equipment
        </p>
      </div>

      {/* Products Grid */}
      <div className="relative overflow-hidden mb-6">
        <div
          className="flex transition-transform duration-700 ease-in-out gap-4"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 group">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  {/* Condition Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${getConditionColor(
                        product.condition
                      )}`}
                    >
                      {product.condition}
                    </span>
                  </div>

                  {/* Wishlist Button */}

                  {/* Product Image */}
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[imageIndexes[product.id] || 0]
                          : "/api/placeholder/200/200"
                      }
                      alt={product.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Image Navigation Buttons - Only show if multiple images */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          handleImageNavigation(product.id, "prev")
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          handleImageNavigation(product.id, "next")
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 leading-tight">
                    {product.title}
                  </h3>

                  {/* Brand/Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">
                      {product.specifications?.brand || product.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {product.specifications?.model || "Standard/Flat"}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {product.location || "utah"}
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-sm text-red-500 ml-2">
                            Retail: ${product.originalPrice}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Quantity Available */}
                  <div className="text-xs text-green-600 font-medium mb-3">
                    {product.quantity} units available
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openProductModal(product)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > 4 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSliderNavigation("prev")}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleSliderNavigation("next")}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide >= maxSlide}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {isModalOpen && (
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={closeProductModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default FeaturedProducts;

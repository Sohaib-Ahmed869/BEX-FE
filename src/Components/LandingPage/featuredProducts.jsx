import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Package,
  DollarSign,
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
    if (direction === "prev") {
      setCurrentSlide((prev) =>
        prev === 0 ? Math.max(0, products.length - 4) : Math.max(0, prev - 1)
      );
    } else {
      setCurrentSlide((prev) => (prev >= products.length - 4 ? 0 : prev + 1));
    }
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Very Good (VG)":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    return <div className="text-center py-8"></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">
            Discover our top-rated drilling equipment
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSliderNavigation("prev")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleSliderNavigation("next")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            disabled={currentSlide >= products.length - 4}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 group"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 h-64">
                  {/* Condition Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(
                        product.condition
                      )}`}
                    >
                      {product.condition}
                    </span>
                  </div>

                  {/* Sale Badge */}
                  {product.is_featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[imageIndexes[product.id] || 0]
                          : "/api/placeholder/200/200"
                      }
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />

                    {/* Image Navigation Buttons - Only show if multiple images */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            handleImageNavigation(product.id, "prev")
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() =>
                            handleImageNavigation(product.id, "next")
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8  hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {product.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                                index === (imageIndexes[product.id] || 0)
                                  ? "bg-blue-600"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Specifications */}
                  <div className="space-y-1 mb-4">
                    {product.specifications?.brand && (
                      <p className="text-sm text-gray-600">
                        Brand: {product.specifications.brand}
                      </p>
                    )}
                    {product.specifications?.bitDiameter && (
                      <p className="text-sm text-gray-600">
                        Diameter: {product.specifications.bitDiameter}"
                      </p>
                    )}
                    {product.specifications?.model && (
                      <p className="text-sm text-gray-600">
                        Model: {product.specifications.model}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {product.location}
                    </span>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {product.quantity}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openProductModal(product)}
                    className="w-full mt-4 bg-[#F47458] hover:bg-[#ef6e4c] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 transform hover:scale-[1.02]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.max(1, products.length - 3) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )
        )}
      </div>
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

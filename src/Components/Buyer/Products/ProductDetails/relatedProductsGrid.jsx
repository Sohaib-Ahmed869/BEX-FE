import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductItem from "../productItem"; // Adjust import path as needed
import { fetchAllProducts } from "../../../../services/productsServices";

const RelatedProducts = ({ currentProduct, isLoading = false }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadProducts = async () => {
    setLoading(true);

    try {
      const result = await fetchAllProducts();
      setAllProducts(result.data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and organize related products
  useEffect(() => {
    if (!currentProduct || !allProducts.length) {
      setRelatedProducts([]);
      return;
    }

    // Filter out the current product
    const otherProducts = allProducts.filter(
      (product) => product.id !== currentProduct.id
    );

    // Get products from the same category
    const sameCategoryProducts = otherProducts.filter(
      (product) => product.category === currentProduct.category
    );

    let finalProducts = [];

    if (sameCategoryProducts.length >= 5) {
      // If we have 5 or more products in the same category, use first 8
      finalProducts = sameCategoryProducts.slice(0, 8);
    } else {
      // Use all products from same category, then add from other categories
      finalProducts = [...sameCategoryProducts];

      // Get products from other categories to fill up to 8 total
      const otherCategoryProducts = otherProducts.filter(
        (product) => product.category !== currentProduct.category
      );

      const remainingSlots = 8 - finalProducts.length;
      if (remainingSlots > 0) {
        finalProducts = [
          ...finalProducts,
          ...otherCategoryProducts.slice(0, remainingSlots),
        ];
      }
    }

    setRelatedProducts(finalProducts);
  }, [currentProduct, allProducts]);

  // Update scroll button states
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll - 1);
    setScrollPosition(scrollLeft);
  };

  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons(); // Initial check

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
    };
  }, [relatedProducts]);

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.offsetWidth || 300;
    const gap = 24; // 1.5rem gap
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.offsetWidth || 300;
    const gap = 24; // 1.5rem gap
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full px-6 py-12 animate-fadeIn">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-8"></div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="bg-gray-200 animate-pulse aspect-square rounded-t-xl"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-4 w-1/3"></div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no related products
  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="w-full px-6 py-12 mt-30 animate-slideInUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-4xl mx-auto font-medium text-gray-900">
          You may be <span className="text-[#F47458]">interested</span> in these
        </h2>

        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "border-gray-300 text-gray-600 hover:border-[#F47458] hover:text-[#F47458] hover:bg-orange-50"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "border-gray-300 text-gray-600 hover:border-[#F47458] hover:text-[#F47458] hover:bg-orange-50"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Gradient overlays for scroll indication */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {relatedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex-grow  animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-6">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "border-gray-300 text-gray-600 hover:border-[#F47458] hover:text-[#F47458] hover:bg-orange-50 active:scale-95"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "border-gray-300 text-gray-600 hover:border-[#F47458] hover:text-[#F47458] hover:bg-orange-50 active:scale-95"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Scroll Indicator Dots - Mobile */}
      <div className="flex md:hidden justify-center mt-4 gap-2">
        {relatedProducts.map((_, index) => {
          const isActive = Math.floor(scrollPosition / 320) === index;
          return (
            <button
              key={index}
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  container.scrollTo({
                    left: index * 320,
                    behavior: "smooth",
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                isActive ? "bg-[#F47458] scale-125" : "bg-gray-300"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;

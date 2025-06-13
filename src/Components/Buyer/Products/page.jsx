import React, { useEffect, useState } from "react";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import ProductGrid from "./productGrid";
import { fetchAllProducts } from "../../../services/productsServices";
import CubeLoader from "../../../utils/cubeLoader";
import ProductFilters from "./filters";
import { MdOutlineShoppingBag } from "react-icons/md";

import { Search, SlidersHorizontal } from "lucide-react";
import ShoppingCart from "../Cart/cart";
import WishlistModal from "../wishlist/wishlistModal";
import useGlobalSocket from "../../../hooks/MessageSocketHook";

const Products = () => {
  useGlobalSocket();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    condition: [],
    priceRange: 2000,
    specifications: {
      diameter: [],
      segmentType: [],
      headType: [],
      bondHardness: [],
    },
    waterCooled: false,
    retippingOptions: {
      hasRetippingService: false,
      diySegmentsAvailable: false,
    },
    retippingPriceRange: 2000,
  });
  const [filtersVisible, setFiltersVisible] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Apply both search and filters whenever either changes
    applyFiltersAndSearch();
  }, [searchQuery, activeFilters, products]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAllProducts();
      setProducts(result.data);
      setFilteredProducts(result.data);
    } catch (err) {
      setError(err.message);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          (product.specifications?.brand &&
            product.specifications.brand.toLowerCase().includes(query)) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        activeFilters.categories.includes(product.category)
      );
    }

    // Apply condition filters
    if (activeFilters.condition.length > 0) {
      filtered = filtered.filter((product) => {
        const productCondition = product.condition || "";
        return activeFilters.condition.some(
          (condition) =>
            productCondition.toLowerCase() === condition.toLowerCase()
        );
      });
    }

    // Apply price range filter
    if (activeFilters.priceRange < 2000) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return !isNaN(price) && price <= activeFilters.priceRange;
      });
    }

    // Apply diameter specification filter
    if (activeFilters.specifications.diameter.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.specifications?.bitDiameter) return false;

        // Convert bitDiameter to a format that matches our filter options (e.g., "2"")
        const bitDiameter =
          Math.round(parseFloat(product.specifications.bitDiameter)) + '"';

        return activeFilters.specifications.diameter.includes(bitDiameter);
      });
    }

    // Apply segment type filter
    if (activeFilters.specifications.segmentType.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.specifications?.segmentType) return false;

        return activeFilters.specifications.segmentType.includes(
          product.specifications.segmentType
        );
      });
    }

    // Apply head type filter
    if (activeFilters.specifications.headType.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.specifications?.headType) return false;

        return activeFilters.specifications.headType.includes(
          product.specifications.headType
        );
      });
    }

    // Apply bond hardness filter
    if (activeFilters.specifications.bondHardness.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.specifications?.bondHardness) return false;

        return activeFilters.specifications.bondHardness.some((hardness) =>
          product.specifications.bondHardness.includes(hardness)
        );
      });
    }

    // Apply water cooled filter
    if (activeFilters.waterCooled) {
      filtered = filtered.filter(
        (product) => product.specifications?.waterCooled === true
      );
    }

    // Apply retipping options filters
    if (activeFilters.retippingOptions.hasRetippingService) {
      filtered = filtered.filter(
        (product) => product.requires_retipping === true
      );
    }

    // Set the filtered products
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filtering is already handled by the useEffect
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  return (
    <div className="min-h-screen bg-white">
      {loading && <CubeLoader />}
      <BuyerHeader toggleCart={toggleCart} toggleWishlist={toggleWishlist} />

      {/* Error message display */}
      {error && (
        <div className="px-6 py-2 text-red-600">
          Error: {error}. Please try again.
        </div>
      )}

      {/* Main content */}
      <div className="px-6 md:px-10 lg:px-16 pt-8">
        {/* Breadcrumb navigation with filter toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleFiltersVisibility}
            className="flex items-center gap-2 p-2 text-gray-600 hover:text-[#F4748B] cursor-pointer transition-colors"
            aria-label={filtersVisible ? "Hide filters" : "Show filters"}
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm font-medium">
              {filtersVisible ? "Hide Filters" : "Show Filters"}
            </span>
          </button>
        </div>

        {/* Page title */}

        <div className="flex flex-col mb-30 md:flex-row gap-6">
          {/* Filters panel - Left side with animation */}
          <div
            className={`md:w-1/3 lg:w-1/4 transition-all duration-300 ease-in-out transform ${
              filtersVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full md:-translate-x-full opacity-0 absolute md:absolute"
            }`}
          >
            <ProductFilters
              onFilterChange={handleFilterChange}
              products={products}
              visible={filtersVisible}
              onToggle={toggleFiltersVisibility}
            />
          </div>

          {/* Products content - Right side */}
          <div
            className={`transition-all duration-300 ${
              filtersVisible ? "md:w-3/4 lg:w-full" : "w-full"
            }`}
          >
            {" "}
            <div className="flex items-center justify-between">
              <div className="text-base">
                <div className="flex items-center my-2 ">
                  <a href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                  </a>
                  <span className="mx-2 text-gray-500">/</span>
                  <span className="text-[#e06449]">Products</span>
                </div>
                <h1 className="text-3xl font-semibold mb-6">Products</h1>
              </div>
              <button
                onClick={toggleCart}
                data-cart-trigger="true"
                className="text-[#e06449] cursor-pointer p-4 border-2 border-[#e06449] rounded-full hover:bg-[#e06449] hover:text-white transition duration-300"
                aria-label="Toggle shopping cart"
              >
                <MdOutlineShoppingBag size={26} />
              </button>
            </div>
            {/* Search bar */}
            <div className="mb-4 md:mb-6 px-4 md:px-0">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full md:w-1/3 mx-auto md:mx-0"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-100 rounded-lg py-3 md:py-6 px-4 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#e06449] focus:bg-white transition-all duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="h-4 w-4 md:h-5 md:w-5 text-[#e06449] absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </form>
            </div>
            {/* Product grid */}
            <ProductGrid products={filteredProducts} />
            {/* No products message */}
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-700">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Shopping Cart */}
      <ShoppingCart isOpen={showCart} setIsOpen={setShowCart} />
      <WishlistModal isOpen={showWishlist} setIsOpen={setShowWishlist} />
    </div>
  );
};

export default Products;

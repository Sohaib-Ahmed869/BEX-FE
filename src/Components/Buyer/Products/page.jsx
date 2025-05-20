import React, { useEffect, useState } from "react";
import BuyerHeader from "../buyerHeader.jsx/buyerHeader";
import ProductGrid from "./productGrid";
import { fetchAllProducts } from "../../../services/productsServices";
import CubeLoader from "../../../utils/cubeLoader";
import ProductFilters from "./filters";
import { MdOutlineShoppingBag } from "react-icons/md";

import { Search, SlidersHorizontal } from "lucide-react";
import ShoppingCart from "../Cart/cart";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    configurations: [],
    brand: [],
    condition: [],
    retippedDrills: false,
    priceRange: 1200,
    diameterRange: 3000,
    lengthRange: 3000,
    diameter: '12"',
    segments: "15",
    priceFilter: "$200",
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

    // Apply configuration filters
    if (activeFilters.configurations.length > 0) {
      filtered = filtered.filter((product) => {
        // Check if product has any of the selected configurations
        const productConfig = product.specifications?.configuration || "";
        return activeFilters.configurations.some((config) =>
          productConfig.toLowerCase().includes(config.toLowerCase())
        );
      });
    }

    // Apply brand filters
    if (activeFilters.brand.length > 0) {
      filtered = filtered.filter((product) => {
        const productBrand = product.specifications?.brand || "";
        return activeFilters.brand.some(
          (brand) => productBrand.toLowerCase() === brand.toLowerCase()
        );
      });
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
    if (activeFilters.priceRange < 1200) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return !isNaN(price) && price <= activeFilters.priceRange;
      });
    }

    // Apply diameter range filter (for core drill bits)
    if (activeFilters.diameterRange < 3000) {
      filtered = filtered.filter((product) => {
        if (product.category !== "Core Drill Bits") return true;
        const diameter = parseFloat(product.specifications?.bitDiameter);
        return !isNaN(diameter) && diameter <= activeFilters.diameterRange;
      });
    }

    // Apply bit length filter (for core drill bits)
    if (activeFilters.lengthRange < 3000) {
      filtered = filtered.filter((product) => {
        if (product.category !== "Core Drill Bits") return true;
        const length = parseFloat(product.specifications?.barrelLength);
        return !isNaN(length) && length <= activeFilters.lengthRange;
      });
    }

    // Apply retipped drills filter
    if (activeFilters.retippedDrills) {
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
    setActiveFilters({ ...activeFilters, ...newFilters });
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="min-h-screen bg-white">
      {loading && <CubeLoader />}
      <BuyerHeader toggleCart={toggleCart} />

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

        <div className="flex flex-col md:flex-row gap-6">
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
              filtersVisible ? "md:w-3/4 lg:w-4/5" : "w-full"
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
            <div className="mb-6">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full md:w-1/3"
              >
                <input
                  type="text"
                  placeholder="Search products by title, brand, or description..."
                  className="w-full bg-gray-100 rounded-md  py-6 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#e06449]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="h-5 w-5 text-[#e06449] absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </form>
            </div>
            {/* Products info and hide filters button */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm ml-2">
                Showing {filteredProducts.length} of {products.length} products
              </p>
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
    </div>
  );
};

export default Products;

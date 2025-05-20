import React, { useState, useEffect } from "react";
import ProductItem from "./productItem";
import { Grid, List, Filter } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const ProductGrid = ({ products }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("Featured");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sort options
  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setFilteredProducts(products || []);
      setIsLoading(false);
    }, 500);
  }, [products]);

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sorted = [...filteredProducts];

    switch (value) {
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
        // Featured - can use some custom logic or leave as is
        break;
    }

    setFilteredProducts(sorted);
  };
  const HandleAddtoCart = () => {
    toast.success("Product added to cart!");
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <div className="w-full px-6 mt-10">
        {/* Header with view options and sorting */}
        <div className="flex flex-col md:flex-row justify-end items-center mb-6">
          <div className="flex items-center   space-x-4 mt-4 md:mt-0">
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

            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort:</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
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
                ? "flex  gap-10 flex-wrap"
                : "flex flex-col space-y-4"
            }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
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
      </div>
    </>
  );
};

export default ProductGrid;

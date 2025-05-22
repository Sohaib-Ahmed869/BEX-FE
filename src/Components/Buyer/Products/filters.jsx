import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  ChevronRight,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

const ProductFilters = ({ onFilterChange, products, visible, onToggle }) => {
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    condition: true,
    priceRange: true,
    specifications: false,
    retippingOptions: false,
    retippingPrice: false,
  });

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Filter states
  const [priceRange, setPriceRange] = useState(2000);
  const [retippingPriceRange, setRetippingPriceRange] = useState(2000);
  const [selectedFilters, setSelectedFilters] = useState({
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

  // Get unique categories from products
  const categories = products
    ? [
        { name: "Core Bits", count: 42 },
        { name: "Core Drill Bits", count: 28 },
        { name: "Magnetic Drills", count: 15 },
        { name: "Pneumatic Drills", count: 19 },
        { name: "Hammer Drills", count: 23 },
        { name: "Accessories", count: 56 },
      ]
    : [];

  // Specification options from the design
  const diameterOptions = [
    { name: '2"', count: 12 },
    { name: '2.5"', count: 8 },
    { name: '3"', count: 15 },
    { name: '4"', count: 10 },
    { name: '6"', count: 7 },
    { name: '12"', count: 5 },
    { name: '14"', count: 3 },
    { name: '16"', count: 2 },
  ];

  const segmentTypeOptions = [
    { name: "Turbo", count: 18 },
    { name: "V-Shape", count: 12 },
    { name: "Flat", count: 22 },
  ];

  const headTypeOptions = [
    { name: "Open Head", count: 28 },
    { name: "Closed Head", count: 14 },
  ];

  const bondHardnessOptions = [
    { name: "Reinforced Concrete", count: 24 },
    { name: "General Purpose", count: 36 },
    { name: "Soft Materials", count: 12 },
    { name: "Hard Materials", count: 18 },
  ];

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle checkbox change for all filter types
  const handleCheckboxChange = (e, filterType, subType = null) => {
    const { name, checked } = e.target;

    if (subType) {
      // For nested filters (specifications)
      let updatedSubFilters;

      if (checked) {
        updatedSubFilters = [...selectedFilters[filterType][subType], name];
      } else {
        updatedSubFilters = selectedFilters[filterType][subType].filter(
          (item) => item !== name
        );
      }

      const updatedFilters = {
        ...selectedFilters,
        [filterType]: {
          ...selectedFilters[filterType],
          [subType]: updatedSubFilters,
        },
      };

      setSelectedFilters(updatedFilters);
      applyFilters(updatedFilters);
    } else if (
      filterType === "waterCooled" ||
      filterType.startsWith("retippingOptions.")
    ) {
      // For boolean filters
      const path = filterType.split(".");
      if (path.length > 1) {
        const updatedFilters = {
          ...selectedFilters,
          retippingOptions: {
            ...selectedFilters.retippingOptions,
            [path[1]]: checked,
          },
        };
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
      } else {
        const updatedFilters = {
          ...selectedFilters,
          [filterType]: checked,
        };
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
      }
    } else {
      // For top-level array filters
      let updatedFilters;

      if (checked) {
        updatedFilters = [...selectedFilters[filterType], name];
      } else {
        updatedFilters = selectedFilters[filterType].filter(
          (item) => item !== name
        );
      }

      const updatedSelectedFilters = {
        ...selectedFilters,
        [filterType]: updatedFilters,
      };

      setSelectedFilters(updatedSelectedFilters);
      applyFilters(updatedSelectedFilters);
    }
  };

  // Handle range input change
  const handleRangeChange = (e, setRange, type) => {
    const newValue = parseInt(e.target.value, 10);
    setRange(newValue);

    // Apply filters with updated values
    const updatedFilters = {
      ...selectedFilters,
      [type]: newValue,
    };

    setSelectedFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  // Apply all active filters to products
  const applyFilters = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    const initialFilters = {
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
    };

    setPriceRange(2000);
    setRetippingPriceRange(2000);
    setSelectedFilters(initialFilters);
    applyFilters(initialFilters);
  };

  // Apply filters when component mounts
  useEffect(() => {
    applyFilters(selectedFilters);
  }, []);

  // Handle tooltip display
  const showTooltip = (condition) => {
    setActiveTooltip(condition);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Condition tooltip descriptions
  const getConditionDescription = (condition) => {
    const descriptions = {
      New: "Item is unused, in original packaging with full manufacturer's warranty.",
      "Like New": "Item appears unused with minimal signs of handling.",
      "Very Good (VG)":
        "Minor cosmetic wear, fully functional with no performance issues.",
      "Good Condition (GC)":
        "Shows normal wear from regular use, fully functional.",
      "Fair Condition (FC)":
        "Noticeable wear and cosmetic issues, but still operational.",
      "Poor Condition (PC)":
        "Significant wear, may have some functional issues but still usable.",
      "For Parts / Not Working":
        "Item is non-functional, suitable for salvaging parts.",
    };

    return descriptions[condition] || "No description available";
  };

  if (!visible) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200 transition-all"
      >
        <Filter size={18} />
        <span>Filters</span>
        <ChevronRight size={16} />
      </button>
    );
  }

  return (
    <div className="w-full md:w-full lg:w-full bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold">Filter Products</h2>
      </div>

      {/* Categories Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Categories
          {expandedSections.categories ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.categories && (
          <div className="px-4 pb-4 space-y-2">
            {categories.map((category) => (
              <label
                key={category.name}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name={category.name}
                    checked={selectedFilters.categories.includes(category.name)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    onChange={(e) => handleCheckboxChange(e, "categories")}
                  />
                  <span className="text-sm ml-2">{category.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Condition Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("condition")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Condition
          {expandedSections.condition ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.condition && (
          <div className="px-4 pb-4 space-y-2">
            {[
              "New",
              "Like New",
              "Very Good (VG)",
              "Good Condition (GC)",
              "Fair Condition (FC)",
              "Poor Condition (PC)",
              "For Parts / Not Working",
            ].map((condition) => (
              <div
                key={condition}
                className="flex items-center justify-between"
              >
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={condition}
                    checked={selectedFilters.condition.includes(condition)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    onChange={(e) => handleCheckboxChange(e, "condition")}
                  />
                  <span className="text-sm ml-2">{condition}</span>
                </label>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => showTooltip(condition)}
                  onMouseLeave={hideTooltip}
                >
                  <Info size={16} className="text-gray-400" />
                </button>
                {activeTooltip === condition && (
                  <div className="absolute z-10 right-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                    {getConditionDescription(condition)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("priceRange")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Price Range
          {expandedSections.priceRange ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.priceRange && (
          <div className="px-4 pb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">
                ${" "}
                <input
                  type="number"
                  value={0}
                  disabled
                  className="w-12 bg-white border border-gray-200 rounded text-center"
                />
              </span>
              <span className="text-xs text-gray-400">to</span>
              <span className="text-sm">
                ${" "}
                <input
                  type="number"
                  value={priceRange}
                  className="w-12 bg-white border border-gray-200 rounded text-center"
                  onChange={(e) =>
                    handleRangeChange(e, setPriceRange, "priceRange")
                  }
                />
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceRange}
              onChange={(e) =>
                handleRangeChange(e, setPriceRange, "priceRange")
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              style={{
                backgroundImage: `linear-gradient(to right, #F47458 0%, #F47458 ${
                  (priceRange / 2000) * 100
                }%, #e5e7eb ${(priceRange / 2000) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Specifications Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("specifications")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Specifications
          {expandedSections.specifications ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.specifications && (
          <div className="px-4 pb-4">
            {/* Diameter */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Diameter</h3>
              <div className="grid grid-cols-2 gap-2">
                {diameterOptions.map((option) => (
                  <label
                    key={option.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={option.name}
                        checked={selectedFilters.specifications.diameter.includes(
                          option.name
                        )}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        onChange={(e) =>
                          handleCheckboxChange(e, "specifications", "diameter")
                        }
                      />
                      <span className="text-sm ml-2">{option.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({option.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Segment Type */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Segment Type</h3>
              {segmentTypeOptions.map((option) => (
                <label
                  key={option.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={option.name}
                      checked={selectedFilters.specifications.segmentType.includes(
                        option.name
                      )}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      onChange={(e) =>
                        handleCheckboxChange(e, "specifications", "segmentType")
                      }
                    />
                    <span className="text-sm ml-2">{option.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              ))}
            </div>

            {/* Head Type */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Head Type</h3>
              {headTypeOptions.map((option) => (
                <label
                  key={option.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={option.name}
                      checked={selectedFilters.specifications.headType.includes(
                        option.name
                      )}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      onChange={(e) =>
                        handleCheckboxChange(e, "specifications", "headType")
                      }
                    />
                    <span className="text-sm ml-2">{option.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              ))}
            </div>

            {/* Bond Hardness/Application */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">
                Bond Hardness/Application
              </h3>
              {bondHardnessOptions.map((option) => (
                <label
                  key={option.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={option.name}
                      checked={selectedFilters.specifications.bondHardness.includes(
                        option.name
                      )}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          "specifications",
                          "bondHardness"
                        )
                      }
                    />
                    <span className="text-sm ml-2">{option.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              ))}
            </div>

            {/* Water-Cooled */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.waterCooled}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) => handleCheckboxChange(e, "waterCooled")}
              />
              <span className="text-sm">Water-Cooled</span>
            </label>
          </div>
        )}
      </div>

      {/* Retipping Options */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("retippingOptions")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          <div className="flex items-center">
            <span>Retipping Options</span>
            <RefreshCw size={16} className="ml-2 text-orange-500" />
          </div>
          {expandedSections.retippingOptions ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.retippingOptions && (
          <div className="px-4 pb-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.retippingOptions.hasRetippingService}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) =>
                  handleCheckboxChange(
                    e,
                    "retippingOptions.hasRetippingService"
                  )
                }
              />
              <span className="text-sm">Has retipping service</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.retippingOptions.diySegmentsAvailable}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) =>
                  handleCheckboxChange(
                    e,
                    "retippingOptions.diySegmentsAvailable"
                  )
                }
              />
              <span className="text-sm">DIY segments available</span>
            </label>
          </div>
        )}
      </div>

      {/* Retipping Price Range */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("retippingPrice")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Retipping Price Range
          {expandedSections.retippingPrice ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.retippingPrice && (
          <div className="px-4 pb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">
                ${" "}
                <input
                  type="number"
                  value={0}
                  disabled
                  className="w-12 bg-white border border-gray-200 rounded text-center"
                />
              </span>
              <span className="text-xs text-gray-400">to</span>
              <span className="text-sm">
                ${" "}
                <input
                  type="number"
                  value={retippingPriceRange}
                  className="w-12 bg-white border border-gray-200 rounded text-center"
                  onChange={(e) =>
                    handleRangeChange(
                      e,
                      setRetippingPriceRange,
                      "retippingPriceRange"
                    )
                  }
                />
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={retippingPriceRange}
              onChange={(e) =>
                handleRangeChange(
                  e,
                  setRetippingPriceRange,
                  "retippingPriceRange"
                )
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              style={{
                backgroundImage: `linear-gradient(to right, #F47458 0%, #F47458 ${
                  (retippingPriceRange / 2000) * 100
                }%, #e5e7eb ${
                  (retippingPriceRange / 2000) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Filter Action Buttons */}
      <div className="p-4 flex justify-between gap-2">
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <RotateCcw size={14} className="mr-2" />
          Reset Filters
        </button>
        <button
          onClick={() => applyFilters(selectedFilters)}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  ChevronRight,
} from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import { ChevronLeft } from "lucide-react";
import { getConditionDescription } from "../../../utils/productGradingDescription";
const ProductFilters = ({ onFilterChange, products, visible, onToggle }) => {
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    configurations: true,
    brand: true,
    condition: true,
    retippedDrills: false,
    price: false,
    bitDiameterMm: false,
    bitLengthMm: false,
  });

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Filter states
  const [priceRange, setPriceRange] = useState(1200);
  const [diameterRange, setDiameterRange] = useState(3000);
  const [lengthRange, setLengthRange] = useState(3000);
  const [selectedFilters, setSelectedFilters] = useState({
    configurations: [],
    brand: [],
    condition: [],
    retippedDrills: false,
    diameter: '12"',
    segments: "15",
    priceFilter: "$200",
  });

  // Get unique brands from products
  const brands = [
    ...new Set(
      products?.map((product) => product.specifications?.brand || "Unknown")
    ),
  ].filter((brand) => brand && brand !== "Unknown");

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e, filterType) => {
    const { name, checked } = e.target;

    let updatedFilters;
    if (checked) {
      updatedFilters = [...selectedFilters[filterType], name];
    } else {
      updatedFilters = selectedFilters[filterType].filter(
        (item) => item !== name
      );
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: updatedFilters,
    });

    // Apply filters
    applyFilters({ ...selectedFilters, [filterType]: updatedFilters });
  };

  // Handle range input change
  const handleRangeChange = (e, setRange, type) => {
    const newValue = parseFloat(e.target.value);
    setRange(newValue);

    // Apply filters with updated values
    applyFilters({ ...selectedFilters, [type]: newValue });
  };

  // Handle dropdown change
  const handleDropdownChange = (e, type) => {
    const newFilters = {
      ...selectedFilters,
      [type]: e.target.value,
    };

    setSelectedFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply all active filters to products
  const applyFilters = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Apply filters whenever selectedFilters changes
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
        <h2 className="text-lg font-semibold flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h2>
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-gray-100 md:hidden"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Configurations */}
      {/* <div className="border-b border-gray-200"> */}
      {/* <button
          onClick={() => toggleSection("configurations")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Configurations
          {expandedSections.configurations ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button> */}

      {/* {expandedSections.configurations && (
          <div className="px-4 pb-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="boredPileCFA"
                checked={selectedFilters.configurations.includes(
                  "boredPileCFA"
                )}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) => handleCheckboxChange(e, "configurations")}
              />
              <span className="text-sm">Bored pile in CFA</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="boredPilesKellyBar"
                checked={selectedFilters.configurations.includes(
                  "boredPilesKellyBar"
                )}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) => handleCheckboxChange(e, "configurations")}
              />
              <span className="text-sm">Bored piles in Kelly Bar</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="boredPilesKellyBarCFA"
                checked={selectedFilters.configurations.includes(
                  "boredPilesKellyBarCFA"
                )}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) => handleCheckboxChange(e, "configurations")}
              />
              <span className="text-sm">Bored piles in Kelly Bar + CFA</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="diaphragmWall"
                checked={selectedFilters.configurations.includes(
                  "diaphragmWall"
                )}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                onChange={(e) => handleCheckboxChange(e, "configurations")}
              />
              <span className="text-sm">Diaphragm wall</span>
            </label>
          </div>
        )} */}
      {/* </div> */}

      {/* Brand */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("brand")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Brand
          {expandedSections.brand ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.brand && (
          <div className="px-4 pb-4 space-y-2">
            {/* Core Drills/Saws Brands */}
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-gray-500 mb-1">
                Core Drills/Saws/Robots
              </h3>
              {[
                "Hilti",
                "Husqvarna",
                "Diamond Products",
                "Pentruder",
                "Weka",
                "Shibuya",
              ].map((brand) => (
                <label key={brand} className="flex items-center  space-x-2">
                  <input
                    type="checkbox"
                    name={brand}
                    checked={selectedFilters.brand.includes(brand)}
                    className="w-4 h-4 text-[#F47458]-500 rounded focus:ring-[#e06449] p-2 mb-2 "
                    onChange={(e) => handleCheckboxChange(e, "brand")}
                  />
                  <span className="text-sm font-stretch-50%">{brand}</span>
                </label>
              ))}
            </div>

            {/* Bits/Blades Brands */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 mb-1">
                Bits/Blades/Wire
              </h3>
              {["Tyrolit", "EDCO", "Core Bore", "Diteq", "ICS", "DMI"].map(
                (brand) => (
                  <label key={brand} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={brand}
                      checked={selectedFilters.brand.includes(brand)}
                      className="w-4 h-4  text-[#F47458]-500 rounded focus:ring-[#e06449] p-2 mb-2 "
                      onChange={(e) => handleCheckboxChange(e, "brand")}
                    />
                    <span className="text-sm font-stretch-50%">{brand}</span>
                  </label>
                )
              )}
            </div>

            {/* Dynamic brands from products */}
            {brands.length > 0 && (
              <div className="mt-2">
                <h3 className="text-xs font-semibold text-gray-500 mb-1">
                  Brands Available at the moment
                </h3>
                {brands.slice(0, 6).map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 ">
                    <input
                      type="checkbox"
                      name={brand}
                      checked={selectedFilters.brand.includes(brand)}
                      className="w-4 h-4 text-[#F47458]-500 rounded focus:ring-[#e06449] p-2 mb-2 "
                      onChange={(e) => handleCheckboxChange(e, "brand")}
                    />
                    <span className="text-sm font-stretch-50%">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Condition */}
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
            {/* Condition Description */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-3 flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-1">
                <Info size={12} />
              </div>
              <p>
                Item is unused, in its original packaging (where applicable),
                and typically retains the full manufacturer's warranty.
              </p>
            </div>

            {/* Condition Options */}
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
                  <span className="text-sm">{condition}</span>
                </label>
                <div className="relative">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onMouseEnter={() => showTooltip(condition)}
                    onMouseLeave={hideTooltip}
                  >
                    <AiOutlineExclamationCircle
                      size={16}
                      className="text-[#F47458]"
                    />
                  </button>
                  {activeTooltip === condition && (
                    <div className="absolute z-10 -top-2 right-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                      {getConditionDescription(condition)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Re-tipped drills */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("retippedDrills")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Re-tipped drills
          {expandedSections.retippedDrills ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.retippedDrills && (
          <div className="px-4 pb-4 space-y-4">
            {/* Bit diameter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 bg-[#F47458] rounded-full mr-2"></span>
                  <span className="text-sm font-medium">
                    Bit diameter (inches)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedFilters.diameter}
                    onChange={(e) => handleDropdownChange(e, "diameter")}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option>12"</option>
                    <option>14"</option>
                    <option>16"</option>
                    <option>18"</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Segments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 bg-[#F47458] rounded-full mr-2"></span>
                  <span className="text-sm font-medium">Segments</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedFilters.segments}
                    onChange={(e) => handleDropdownChange(e, "segments")}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option>15</option>
                    <option>18</option>
                    <option>20</option>
                    <option>24</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <span className="inline-block w-3 h-3 bg-[#F47458] rounded-full mr-2"></span>
                  <span className="text-sm font-medium">Price</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedFilters.priceFilter}
                    onChange={(e) => handleDropdownChange(e, "priceFilter")}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option>$200</option>
                    <option>$300</option>
                    <option>$500</option>
                    <option>$1000</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("price")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Price
          {expandedSections.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.price && (
          <div className="px-4 pb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">$0</span>
              <span className="text-sm text-gray-600">$1200</span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              value={priceRange}
              onChange={(e) =>
                handleRangeChange(e, setPriceRange, "priceRange")
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47458]"
              style={{
                backgroundImage: `linear-gradient(to right, #F47458 0%, #e06449 ${
                  (priceRange / 1200) * 100
                }%, #e5e7eb ${(priceRange / 1200) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="text-sm text-gray-600 mt-2">
              <span>${priceRange}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bit diameter (mm) */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("bitDiameterMm")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Bit diameter (mm)
          {expandedSections.bitDiameterMm ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.bitDiameterMm && (
          <div className="px-4 pb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">800</span>
              <span className="text-sm text-gray-600">3000</span>
            </div>
            <input
              type="range"
              min="800"
              max="3000"
              value={diameterRange}
              onChange={(e) =>
                handleRangeChange(e, setDiameterRange, "diameterRange")
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47458]"
              style={{
                backgroundImage: `linear-gradient(to right,#F47458 0%, #e06449 ${
                  ((diameterRange - 800) / 2200) * 100
                }%, #e5e7eb ${
                  ((diameterRange - 800) / 2200) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="text-sm text-gray-600 mt-2">
              <span>{diameterRange} mm</span>
            </div>
          </div>
        )}
      </div>

      {/* Bit length (mm) */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("bitLengthMm")}
          className="w-full p-4 text-left font-medium flex justify-between items-center"
        >
          Bit length (mm)
          {expandedSections.bitLengthMm ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {expandedSections.bitLengthMm && (
          <div className="px-4 pb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">800</span>
              <span className="text-sm text-gray-600">3000</span>
            </div>
            <input
              type="range"
              min="800"
              max="3000"
              value={lengthRange}
              onChange={(e) =>
                handleRangeChange(e, setLengthRange, "lengthRange")
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47458]"
              style={{
                backgroundImage: `linear-gradient(to right, #F47458 0%, #e06449 ${
                  ((lengthRange - 800) / 2200) * 100
                }%, #e5e7eb ${
                  ((lengthRange - 800) / 2200) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="text-sm text-gray-600 mt-2">
              <span>{lengthRange} mm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductFilters;

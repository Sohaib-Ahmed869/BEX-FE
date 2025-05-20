"use client";

import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  powerRating: "",
  cuttingWidth: "",
  cuttingDepth: "",
  bladeType: "",
  bladeConfiguration: "",
  condition: "",
  location: "",
  operatingHours: "",
  weight: "",
  selfPropelled: false,
  guideSystem: false,
  includedAccessories: "",
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",
};

export default function SpecialtySawSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  const getPowerRatingLabel = () => {
    if (specs.powerSource === "Gas") {
      return "Power Rating (HP)";
    } else if (specs.powerSource === "Electric") {
      return "Power Rating (kW)";
    } else if (specs.powerSource === "Hydraulic") {
      return "Power Rating (HP)";
    }
    return "Power Rating";
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="subtype"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subtype *
          </label>
          <div className="relative">
            <select
              id="subtype"
              value={specs.subtype}
              onChange={(e) => handleInputChange("subtype", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select subtype</option>
              <option>Curb Saw / Curb Cutter Machine</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="powerSource"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Power Source *
          </label>
          <div className="relative">
            <select
              id="powerSource"
              value={specs.powerSource}
              onChange={(e) => handleInputChange("powerSource", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select power source</option>
              <option>Gas</option>
              <option>Hydraulic</option>
              <option>Electric</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Brand *
          </label>
          <input
            type="text"
            id="brand"
            value={specs.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
            placeholder="Multiquip, Hi-Point, Stone, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Model *
          </label>
          <input
            type="text"
            id="model"
            value={specs.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            placeholder="CC3500, SCC-6, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Year *
          </label>
          <input
            type="text"
            id="year"
            value={specs.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            placeholder="2023"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="powerRating"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            {getPowerRatingLabel()} *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Power rating varies by source: HP for gas/hydraulic, kW for
                electric.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="powerRating"
            value={specs.powerRating}
            onChange={(e) => handleInputChange("powerRating", e.target.value)}
            placeholder="35, 25, 15, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="cuttingWidth"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Cutting Width (inches) *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Maximum width of cut the saw can make in a single pass.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="cuttingWidth"
            value={specs.cuttingWidth}
            onChange={(e) => handleInputChange("cuttingWidth", e.target.value)}
            placeholder="6, 8, 10, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="cuttingDepth"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Cutting Depth (inches) *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Maximum depth the saw can cut into the material.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="cuttingDepth"
            value={specs.cuttingDepth}
            onChange={(e) => handleInputChange("cuttingDepth", e.target.value)}
            placeholder="6, 8, 12, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="bladeType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Blade Type *
          </label>
          <div className="relative">
            <select
              id="bladeType"
              value={specs.bladeType}
              onChange={(e) => handleInputChange("bladeType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select blade type</option>
              <option>Diamond Blade</option>
              <option>Abrasive Blade</option>
              <option>Carbide Blade</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="bladeConfiguration"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Blade Configuration *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Number and arrangement of blades (e.g., single blade, dual
                blade, etc.).
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              id="bladeConfiguration"
              value={specs.bladeConfiguration}
              onChange={(e) =>
                handleInputChange("bladeConfiguration", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select configuration</option>
              <option>Single Blade</option>
              <option>Dual Blade</option>
              <option>Multiple Blade</option>
              <option>Adjustable Spacing</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Condition *
          </label>
          <div className="relative">
            <select
              id="condition"
              value={specs.condition}
              onChange={(e) => handleInputChange("condition", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select condition</option>
              <option>New</option>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>For Parts/Repair</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            value={specs.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, State"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
        Recommended Information
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Operating Hours
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Approximate hours of operation or general usage estimate.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="operatingHours"
            value={specs.operatingHours}
            onChange={(e) =>
              handleInputChange("operatingHours", e.target.value)
            }
            placeholder="500 hours, Low use, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Weight (lbs)
          </label>
          <input
            type="text"
            id="weight"
            value={specs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="850, 1200, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="grid grid-cols-1 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.selfPropelled}
              onChange={(e) =>
                handleInputChange("selfPropelled", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center">
              Self-Propelled
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Machine moves forward automatically during cutting operation.
                </div>
              </div>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.guideSystem}
              onChange={(e) =>
                handleInputChange("guideSystem", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center">
              Guide System
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Built-in guidance system for precise, straight cuts.
                </div>
              </div>
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label
            htmlFor="includedAccessories"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Included Accessories
          </label>
          <textarea
            id="includedAccessories"
            value={specs.includedAccessories}
            onChange={(e) =>
              handleInputChange("includedAccessories", e.target.value)
            }
            placeholder="Extra blades, water tank, guide rails, manuals..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="maintenanceHistory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Maintenance History
          </label>
          <textarea
            id="maintenanceHistory"
            value={specs.maintenanceHistory}
            onChange={(e) =>
              handleInputChange("maintenanceHistory", e.target.value)
            }
            placeholder="Recent services, engine overhauls, hydraulic system maintenance..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="usageHistory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Usage History
          </label>
          <textarea
            id="usageHistory"
            value={specs.usageHistory}
            onChange={(e) => handleInputChange("usageHistory", e.target.value)}
            placeholder="Primary applications, job types, working conditions..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="sellerNotes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Seller Notes
          </label>
          <textarea
            id="sellerNotes"
            value={specs.sellerNotes}
            onChange={(e) => handleInputChange("sellerNotes", e.target.value)}
            placeholder="Additional information, reason for selling, notable features or issues..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
      </div>
    </div>
  );
}

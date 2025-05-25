"use client";

import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  airFluidRequirement: "",
  maxBitDiameter: "",
  drillSteelSize: "",
  chuckType: "",
  condition: "",
  location: "",
  operatingHours: "",
  weight: "",
  vibrationDampening: false,
  muffler: false,
  includedDrillSteels: false,
  includedBits: false,
  includedHoses: false,
  otherAccessories: "",
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",
};

export default function DrillingEquipmentSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...(formData?.specs || {}) };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  const getAirFluidLabel = () => {
    switch (specs.powerSource) {
      case "Pneumatic":
        return "Air Requirement (CFM/PSI)";
      case "Hydraulic":
        return "Fluid Requirement (GPM/PSI)";
      case "Gas":
        return "Engine Specifications";
      default:
        return "Air/Fluid Requirement";
    }
  };

  const getAirFluidPlaceholder = () => {
    switch (specs.powerSource) {
      case "Pneumatic":
        return "90 CFM @ 90 PSI";
      case "Hydraulic":
        return "15 GPM @ 2000 PSI";
      case "Gas":
        return "2-stroke, 25cc";
      default:
        return "CFM/PSI or GPM/PSI";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <option>Rock Drill (Pneumatic)</option>
              <option>Rock Drill (Hydraulic)</option>
              <option>Rock Drill (Gas)</option>
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
              <option>Pneumatic</option>
              <option>Hydraulic</option>
              <option>Gas</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            placeholder="Bosch, Hilti, TEI Rock Drills, etc."
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
            placeholder="RH540, DH25, YT28, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            htmlFor="airFluidRequirement"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            {getAirFluidLabel()} *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                {specs.powerSource === "Pneumatic" &&
                  "Air flow and pressure requirements for operation."}
                {specs.powerSource === "Hydraulic" &&
                  "Hydraulic fluid flow and pressure requirements."}
                {specs.powerSource === "Gas" &&
                  "Engine specifications and fuel requirements."}
                {!specs.powerSource &&
                  "Power requirements vary by source type."}
              </div>
            </div>
          </label>
          <input
            type="text"
            id="airFluidRequirement"
            value={specs.airFluidRequirement}
            onChange={(e) =>
              handleInputChange("airFluidRequirement", e.target.value)
            }
            placeholder={getAirFluidPlaceholder()}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="maxBitDiameter"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Max Bit Diameter (inches) *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Maximum diameter of drill bit that can be used with this drill.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="maxBitDiameter"
            value={specs.maxBitDiameter}
            onChange={(e) =>
              handleInputChange("maxBitDiameter", e.target.value)
            }
            placeholder="1.5, 2.0, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="drillSteelSize"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Drill Steel Size *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Compatible drill steel dimensions (shank size and/or hex size).
              </div>
            </div>
          </label>
          <input
            type="text"
            id="drillSteelSize"
            value={specs.drillSteelSize}
            onChange={(e) =>
              handleInputChange("drillSteelSize", e.target.value)
            }
            placeholder="7/8\ x 4.5\, 22mm hex, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="chuckType"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Chuck Type *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Type of chuck mechanism used to hold drill steels/bits.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              id="chuckType"
              value={specs.chuckType}
              onChange={(e) => handleInputChange("chuckType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select chuck type</option>
              <option>Hex Chuck</option>
              <option>Round Chuck</option>
              <option>SDS Chuck</option>
              <option>Spline Chuck</option>
              <option>Quick-Change Chuck</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

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
      </div>

      <div className="mb-4">
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
          className="w-full p-2 border border-gray-300 rounded-md max-w-md"
          required
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
        Recommended Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Operating Hours / Usage Estimate
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
            placeholder="200 hours, Light use, etc."
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
            placeholder="25, 45, 65, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.vibrationDampening}
              onChange={(e) =>
                handleInputChange("vibrationDampening", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center">
              Vibration Dampening
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Built-in system to reduce vibration and operator fatigue.
                </div>
              </div>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.muffler}
              onChange={(e) => handleInputChange("muffler", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center">
              Muffler/Noise Reduction
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Noise reduction system for quieter operation.
                </div>
              </div>
            </span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Included Accessories
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedDrillSteels}
              onChange={(e) =>
                handleInputChange("includedDrillSteels", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span>Drill Steels</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedBits}
              onChange={(e) =>
                handleInputChange("includedBits", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span>Drill Bits</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedHoses}
              onChange={(e) =>
                handleInputChange("includedHoses", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span>Hoses/Connections</span>
          </label>
        </div>

        <div className="mt-2">
          <label
            htmlFor="otherAccessories"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Other Accessories
          </label>
          <input
            type="text"
            id="otherAccessories"
            value={specs.otherAccessories}
            onChange={(e) =>
              handleInputChange("otherAccessories", e.target.value)
            }
            placeholder="Carrying case, spare parts, manual, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="space-y-4 mb-4">
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
            placeholder="Recent services, engine work, seal replacements, lubrication..."
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
            placeholder="Primary applications (anchor installation, dowel drilling), material types, frequency of use..."
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
            placeholder="Additional information, reason for selling, performance notes..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>
      </div>

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
        <p className="text-xs text-gray-700 mt-1">
          <strong>Note:</strong> Rock drills are typically used for drilling
          dowels and anchors in concrete, rock, and masonry applications.
        </p>
      </div>
    </div>
  );
}

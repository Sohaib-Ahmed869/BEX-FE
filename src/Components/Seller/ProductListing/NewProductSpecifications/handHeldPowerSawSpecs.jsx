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
  maxBladeDiameter: "",
  maxCuttingDepth: "",
  arborSize: "",
  condition: "",
  location: "",
  operatingHours: "",
  weight: "",
  waterConnection: false,
  antiVibration: false,
  decompressionValve: false,
  includedCase: false,
  includedTools: false,
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",
};

export default function HandheldPowerSawSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  const getMaxDiameterLabel = () => {
    switch (specs.subtype) {
      case "Ring Saw (Gas)":
      case "Ring Saw (Hydraulic)":
      case "Ring Saw (Electric)":
        return "Max Ring Diameter (inches)";
      case "Chain Saw (Concrete - Gas)":
      case "Chain Saw (Concrete - Hydraulic)":
      case "Chain Saw (Concrete - Electric)":
        return "Max Bar Length (inches)";
      default:
        return "Max Blade Diameter (inches)";
    }
  };

  const shouldShowArborSize = () => {
    return specs.subtype.includes("Cut-off Saw");
  };

  const getPowerRatingLabel = () => {
    if (specs.powerSource === "Gas" || specs.powerSource === "Hydraulic") {
      return "Power Rating (HP)";
    } else if (specs.powerSource === "Electric") {
      return "Power Rating (kW)";
    } else if (specs.powerSource === "Battery") {
      return "Voltage (V)";
    }
    return "Power Rating";
  };

  return (
    <div className="px-4 sm:px-0">
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
              <option>Cut-off Saw (Gas)</option>
              <option>Cut-off Saw (Electric)</option>
              <option>Cut-off Saw (Hydraulic)</option>
              <option>Cut-off Saw (Battery)</option>
              <option>Ring Saw (Gas)</option>
              <option>Ring Saw (Hydraulic)</option>
              <option>Ring Saw (Electric)</option>
              <option>Chain Saw (Concrete - Gas)</option>
              <option>Chain Saw (Concrete - Hydraulic)</option>
              <option>Chain Saw (Concrete - Electric)</option>
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
              <option>Electric</option>
              <option>Hydraulic</option>
              <option>Battery</option>
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
            placeholder="Husqvarna, Stihl, Hilti, etc."
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
            placeholder="K770, TS420, etc."
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
            htmlFor="powerRating"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            {getPowerRatingLabel()} *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Power rating varies by source: HP for gas/hydraulic, kW for
                electric, Voltage for battery.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="powerRating"
            value={specs.powerRating}
            onChange={(e) => handleInputChange("powerRating", e.target.value)}
            placeholder="5.2, 2.3, 18V, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="maxBladeDiameter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {getMaxDiameterLabel()} *
          </label>
          <input
            type="text"
            id="maxBladeDiameter"
            value={specs.maxBladeDiameter}
            onChange={(e) =>
              handleInputChange("maxBladeDiameter", e.target.value)
            }
            placeholder="14, 16, 20, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="maxCuttingDepth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Cutting Depth (inches) *
          </label>
          <input
            type="text"
            id="maxCuttingDepth"
            value={specs.maxCuttingDepth}
            onChange={(e) =>
              handleInputChange("maxCuttingDepth", e.target.value)
            }
            placeholder="5, 6.25, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {shouldShowArborSize() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="arborSize"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              Arbor Size (inches) *
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  The diameter of the center hole in the blade that fits on the
                  saw spindle.
                </div>
              </div>
            </label>
            <input
              type="text"
              id="arborSize"
              value={specs.arborSize}
              onChange={(e) => handleInputChange("arborSize", e.target.value)}
              placeholder="1, 20mm, etc."
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            placeholder="250 hours, Light use, etc."
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
            placeholder="22.5"
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
              checked={specs.waterConnection}
              onChange={(e) =>
                handleInputChange("waterConnection", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center text-sm">
              Water Connection
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Built-in water connection for dust suppression during cutting.
                </div>
              </div>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.antiVibration}
              onChange={(e) =>
                handleInputChange("antiVibration", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center text-sm">
              Anti-Vibration System
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
              checked={specs.decompressionValve}
              onChange={(e) =>
                handleInputChange("decompressionValve", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="flex items-center text-sm">
              Decompression Valve
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                  Makes starting easier by reducing compression in the cylinder.
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
        <div className="grid grid-cols-1 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedCase}
              onChange={(e) =>
                handleInputChange("includedCase", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="text-sm">Carrying Case</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedTools}
              onChange={(e) =>
                handleInputChange("includedTools", e.target.checked)
              }
              className="w-4 h-4 text-orange-500 rounded mr-2"
            />
            <span className="text-sm">Tools/Maintenance Kit</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
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
            placeholder="Recent services, repairs, parts replaced..."
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
            placeholder="Primary applications, work conditions, frequency of use..."
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
            placeholder="Additional information, reason for selling, notable features..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
        <p className="text-xs text-gray-700 mt-1">
          <strong>Note:</strong> Blades/Rings/Chains should be listed separately
          as consumable accessories.
        </p>
      </div>
    </div>
  );
}

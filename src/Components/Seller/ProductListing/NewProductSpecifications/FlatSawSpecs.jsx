"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  engineMake: "",
  enginePower: "",
  maxBladeDiameter: "",
  maxCuttingDepth: "",
  arborSize: "",
  driveSystem: "",
  operatingHours: "",
  weight: "",
  features: [],
  includedAccessories: "",
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",
  location: "",
};

export default function FlatSawSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  // Handle checkbox changes for features
  const handleFeatureChange = (feature, checked) => {
    const updatedFeatures = checked
      ? [...specs.features, feature]
      : specs.features.filter((f) => f !== feature);

    const updatedSpecs = { ...specs, features: updatedFeatures };
    onChange(updatedSpecs);
  };

  return (
    <div>
      <div className="mb-4">
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
            <option>Push Flat Saw</option>
            <option>Self-Propelled Flat Saw</option>
            <option>Early Entry Saw</option>
            <option>Rider Flat Saw (Large)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
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
            placeholder="Husqvarna, Stihl, etc."
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
            placeholder="FS 5000, SP 15, etc."
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
            type="number"
            id="year"
            value={specs.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            placeholder="2020"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
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
              <option>Diesel</option>
              <option>Electric</option>
              <option>Propane</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="engineMake"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Engine/Motor Make & Model *
          </label>
          <input
            type="text"
            id="engineMake"
            value={specs.engineMake}
            onChange={(e) => handleInputChange("engineMake", e.target.value)}
            placeholder="Honda GX390, Kohler, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="enginePower"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Engine/Motor Power *
          </label>
          <input
            type="text"
            id="enginePower"
            value={specs.enginePower}
            onChange={(e) => handleInputChange("enginePower", e.target.value)}
            placeholder="13 HP, 20 kW, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="maxBladeDiameter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Blade Diameter Capacity *
          </label>
          <input
            type="text"
            id="maxBladeDiameter"
            value={specs.maxBladeDiameter}
            onChange={(e) =>
              handleInputChange("maxBladeDiameter", e.target.value)
            }
            placeholder="18 inches"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="maxCuttingDepth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Cutting Depth *
          </label>
          <input
            type="text"
            id="maxCuttingDepth"
            value={specs.maxCuttingDepth}
            onChange={(e) =>
              handleInputChange("maxCuttingDepth", e.target.value)
            }
            placeholder="6 inches"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="arborSize"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Arbor Size *
          </label>
          <input
            type="text"
            id="arborSize"
            value={specs.arborSize}
            onChange={(e) => handleInputChange("arborSize", e.target.value)}
            placeholder="1 inch"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="driveSystem"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Drive System *
          </label>
          <div className="relative">
            <select
              id="driveSystem"
              value={specs.driveSystem}
              onChange={(e) => handleInputChange("driveSystem", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select drive system</option>
              <option>Belt Drive</option>
              <option>Direct Drive</option>
              <option>Hydraulic Drive</option>
              <option>Chain Drive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Operating Hours
          </label>
          <input
            type="text"
            id="operatingHours"
            value={specs.operatingHours}
            onChange={(e) =>
              handleInputChange("operatingHours", e.target.value)
            }
            placeholder="500 hours"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Weight
          </label>
          <input
            type="text"
            id="weight"
            value={specs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="200 lbs"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Blade Clutch",
            "Electric Start",
            "Depth Control",
            "Water Tank",
            "Self-Propelled",
            "Laser Guide",
            "Hour Meter",
          ].map((feature) => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={specs.features.includes(feature)}
                onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded mr-2"
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
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
          placeholder="Blade wrenches, water hose, etc."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
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
            placeholder="Recent service, repairs, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
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
            placeholder="Previous applications, frequency of use, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
          />
        </div>
      </div>

      <div className="mb-4">
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
          placeholder="Additional information about the product"
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
        />
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
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  powerRating: "",
  maxBitDiameter: "",
  speeds: "",
  rpm: "",
  spindle: "",
  operatingHours: "",
  weight: "",
  features: [],
  includedAccessories: "",
  maintenanceHistory: "",
  usageHistory: "",
  standDetails: "",
  batteryDetails: "",
  sellerNotes: "",
  location: "",
};

export default function CoreDrillSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  // Handle checkbox changes for features
  const handleFeatureChange = (feature, checked) => {
    let updatedFeatures;
    if (checked) {
      updatedFeatures = [...specs.features, feature];
    } else {
      updatedFeatures = specs.features.filter((f) => f !== feature);
    }

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
            <option>Handheld Core Drill Motor</option>
            <option>Rig-Mounted Core Drill Motor</option>
            <option>Complete Core Drill Rig (Motor + Stand)</option>
            <option>Core Drill Stand Only</option>
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
            placeholder="Hilti, Husqvarna, etc."
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
            placeholder="DD 150-U, DMS 240, etc."
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
              <option>Electric (110V)</option>
              <option>Electric (220V)</option>
              <option>Electric Battery</option>
              <option>Hydraulic</option>
              <option>Pneumatic</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="powerRating"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Power Rating *
          </label>
          <input
            type="text"
            id="powerRating"
            value={specs.powerRating}
            onChange={(e) => handleInputChange("powerRating", e.target.value)}
            placeholder="2200W, 3HP, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="maxBitDiameter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Bit Diameter Capacity *
          </label>
          <input
            type="text"
            id="maxBitDiameter"
            value={specs.maxBitDiameter}
            onChange={(e) =>
              handleInputChange("maxBitDiameter", e.target.value)
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
            htmlFor="speeds"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Speeds *
          </label>
          <input
            type="text"
            id="speeds"
            value={specs.speeds}
            onChange={(e) => handleInputChange("speeds", e.target.value)}
            placeholder="3-speed"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="rpm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            RPM *
          </label>
          <input
            type="text"
            id="rpm"
            value={specs.rpm}
            onChange={(e) => handleInputChange("rpm", e.target.value)}
            placeholder="300-900"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="spindle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Spindle Thread *
          </label>
          <input
            type="text"
            id="spindle"
            value={specs.spindle}
            onChange={(e) => handleInputChange("spindle", e.target.value)}
            placeholder='1-1/4"-7 UNC'
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

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
      </div>

      <div className="mb-4">
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
          placeholder="15 kg / 33 lbs"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Clutch",
            "Water Connection",
            "Vacuum Base",
            "LED Indicator",
            "Overload Protection",
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
          placeholder="Case, wrenches, water collection ring, etc."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>

      {specs.subtype === "Complete Core Drill Rig (Motor + Stand)" && (
        <div className="mb-4">
          <label
            htmlFor="standDetails"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stand Details
          </label>
          <textarea
            id="standDetails"
            value={specs.standDetails}
            onChange={(e) => handleInputChange("standDetails", e.target.value)}
            placeholder="Stand model, max angle, base type, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
          />
        </div>
      )}

      {specs.powerSource === "Electric Battery" && (
        <div className="mb-4">
          <label
            htmlFor="batteryDetails"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Battery Details
          </label>
          <textarea
            id="batteryDetails"
            value={specs.batteryDetails}
            onChange={(e) =>
              handleInputChange("batteryDetails", e.target.value)
            }
            placeholder="Battery type, voltage, capacity, quantity, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={2}
          />
        </div>
      )}

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

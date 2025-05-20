"use client";

import { ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerType: "",
  maxBladeDiameter: "",
  maxCuttingDepth: "",
  wireStorageCapacity: "",
  powerOutput: "",
  trackLength: "",
  operatingHours: "",
  weight: "",
  features: [],
  includedAccessories: "",
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",
  location: "",
};

export default function WallWireSawSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  // Handle input changes
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

  // Determine which fields to show based on subtype
  const showWallSawFields = specs.subtype.includes("Wall Saw");
  const showWireSawFields = specs.subtype.includes("Wire Saw");
  const showTrackFields = specs.subtype.includes("Track");

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
            <option>Electric Wall Saw System (High Frequency)</option>
            <option>Hydraulic Wall Saw System</option>
            <option>Wire Saw System (Drive Unit + Power Pack)</option>
            <option>Wall Saw Head Only</option>
            <option>Wire Saw Drive Unit Only</option>
            <option>Wall Saw Power Pack Only (Electric/Hydraulic)</option>
            <option>Wall Saw Track Section(s)</option>
            <option>Wire Saw Pulleys/Accessories</option>
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
            placeholder="DS TS20, CS 10, etc."
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
            htmlFor="powerType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Power Type *
          </label>
          <div className="relative">
            <select
              id="powerType"
              value={specs.powerType}
              onChange={(e) => handleInputChange("powerType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select power type</option>
              <option>HF Electric</option>
              <option>Hydraulic</option>
              <option>Wire Drive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {showWallSawFields && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="maxBladeDiameter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Blade Diameter (Wall Saw) *
              </label>
              <input
                type="text"
                id="maxBladeDiameter"
                value={specs.maxBladeDiameter}
                onChange={(e) =>
                  handleInputChange("maxBladeDiameter", e.target.value)
                }
                placeholder="24 inches"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showWallSawFields}
              />
            </div>

            <div>
              <label
                htmlFor="maxCuttingDepth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Cutting Depth (Wall Saw) *
              </label>
              <input
                type="text"
                id="maxCuttingDepth"
                value={specs.maxCuttingDepth}
                onChange={(e) =>
                  handleInputChange("maxCuttingDepth", e.target.value)
                }
                placeholder="10 inches"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showWallSawFields}
              />
            </div>
          </div>
        </>
      )}

      {showWireSawFields && (
        <div className="mb-4">
          <label
            htmlFor="wireStorageCapacity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wire Storage Capacity (Wire Saw Drive) *
          </label>
          <input
            type="text"
            id="wireStorageCapacity"
            value={specs.wireStorageCapacity}
            onChange={(e) =>
              handleInputChange("wireStorageCapacity", e.target.value)
            }
            placeholder="10 meters"
            className="w-full p-2 border border-gray-300 rounded-md"
            required={showWireSawFields}
          />
        </div>
      )}

      {(specs.subtype.includes("Power Pack") ||
        specs.subtype.includes("System")) && (
        <div className="mb-4">
          <label
            htmlFor="powerOutput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Power Output (Power Pack) *
          </label>
          <input
            type="text"
            id="powerOutput"
            value={specs.powerOutput}
            onChange={(e) => handleInputChange("powerOutput", e.target.value)}
            placeholder="15 kW, 20 HP, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required={
              specs.subtype.includes("Power Pack") ||
              specs.subtype.includes("System")
            }
          />
        </div>
      )}

      {showTrackFields && (
        <div className="mb-4">
          <label
            htmlFor="trackLength"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Track Length (Track) *
          </label>
          <input
            type="text"
            id="trackLength"
            value={specs.trackLength}
            onChange={(e) => handleInputChange("trackLength", e.target.value)}
            placeholder="2 meters"
            className="w-full p-2 border border-gray-300 rounded-md"
            required={showTrackFields}
          />
        </div>
      )}

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
            placeholder="25 kg / 55 lbs"
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
            "Remote Control",
            "Flush Cut",
            "Auto Feed",
            "Water Cooling",
            "Overload Protection",
            "Digital Display",
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
          placeholder="Track quantity, guards, cables, hoses, pulleys, etc."
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

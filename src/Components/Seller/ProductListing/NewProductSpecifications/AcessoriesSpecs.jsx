import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  accessoryType: "",
  brand: "",
  model: "",
  compatibility: "",
  condition: "",
  keySpecifications: "",
  maintenanceHistory: "",
  sellerNotes: "",
  location: "",
};

// Define compatibility options based on common drill brands and models
const compatibilityOptions = [
  "Universal/Generic",
  "Hilti DD-120, DD-130, DD-160",
  "Hilti DD-200, DD-350, DD-500",
  "Husqvarna DM-220, DM-230, DM-280",
  "Husqvarna DM-340, DM-406H, DM-650",
  "Milwaukee MXF DCD-2500, MXF DCD-4000",
  "Norton Clipper DR-520, DR-550",
  "Eibenstock EHD-2000S, EHD-2500",
  "CORE CUT CC-4040, CC-5540",
  "WEKA DK-12, DK-17, DK-32",
  "Other (Specify in Notes)",
];

export default function AccessoriesNonDiamondSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  // Get key specifications fields based on accessory type
  const getKeySpecFields = () => {
    const type = specs.accessoryType;

    if (type === "Core Drill Stand") {
      return (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Drill Motor Weight (lbs)
            </label>
            <input
              type="text"
              value={specs.maxMotorWeight || ""}
              onChange={(e) =>
                handleInputChange("maxMotorWeight", e.target.value)
              }
              placeholder="45"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Drilling Diameter (inches)
            </label>
            <input
              type="text"
              value={specs.maxDrillDiameter || ""}
              onChange={(e) =>
                handleInputChange("maxDrillDiameter", e.target.value)
              }
              placeholder="8"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );
    }

    if (type === "Vacuum Pump") {
      return (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CFM Rating
            </label>
            <input
              type="text"
              value={specs.cfmRating || ""}
              onChange={(e) => handleInputChange("cfmRating", e.target.value)}
              placeholder="150"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Power Requirements
            </label>
            <input
              type="text"
              value={specs.powerRequirements || ""}
              onChange={(e) =>
                handleInputChange("powerRequirements", e.target.value)
              }
              placeholder="110V, 15A"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );
    }

    if (type === "Water Tank") {
      return (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (Gallons)
            </label>
            <input
              type="text"
              value={specs.capacity || ""}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="5"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tank Material
            </label>
            <input
              type="text"
              value={specs.tankMaterial || ""}
              onChange={(e) =>
                handleInputChange("tankMaterial", e.target.value)
              }
              placeholder="Polyethylene, Stainless Steel"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );
    }

    if (type === "Generator" || type === "Power Pack") {
      return (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Power Output (Watts/KVA)
            </label>
            <input
              type="text"
              value={specs.powerOutput || ""}
              onChange={(e) => handleInputChange("powerOutput", e.target.value)}
              placeholder="3000W / 3.75KVA"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <div className="relative">
              <select
                value={specs.fuelType || ""}
                onChange={(e) => handleInputChange("fuelType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              >
                <option value="">Select fuel type</option>
                <option>Gasoline</option>
                <option>Diesel</option>
                <option>Electric (Plugged)</option>
                <option>Electric (Battery)</option>
                <option>Hydraulic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="accessoryType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Accessory Type *
          </label>
          <div className="relative">
            <select
              id="accessoryType"
              value={specs.accessoryType}
              onChange={(e) =>
                handleInputChange("accessoryType", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select accessory type</option>
              <option>Core Drill Stand</option>
              <option>Vacuum Pump</option>
              <option>Water Tank</option>
              <option>Bit Extension</option>
              <option>Thread Adapter</option>
              <option>Core Removal Tool</option>
              <option>Water Collection Ring</option>
              <option>Saw Cart</option>
              <option>Guide Rail</option>
              <option>Dust Extraction System/Vacuum</option>
              <option>Power Pack</option>
              <option>Generator</option>
              <option>Slurry Vacuum/Management System</option>
              <option>Hydraulic Hoses</option>
              <option>Electric Cords</option>
              <option>Remote Controls (Spare/Replacement)</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

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
            placeholder="Hilti, Husqvarna, Milwaukee, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Model Number
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Specific model number if applicable. Required for most
                accessories.
              </div>
            </div>
          </label>
          <input
            type="text"
            id="model"
            value={specs.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            placeholder="DD-350 Stand, DM-220 Cart, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="compatibility"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Compatibility *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Which drill motors or systems this accessory is compatible with.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              id="compatibility"
              value={specs.compatibility}
              onChange={(e) =>
                handleInputChange("compatibility", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select compatibility</option>
              {compatibilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
              <option>New - Unused</option>
              <option>Like New - Lightly Used</option>
              <option>Good - Normal Wear</option>
              <option>Fair - Heavy Wear</option>
              <option>Poor - Needs Repair</option>
              <option>For Parts/Repair Only</option>
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

      {/* Dynamic key specifications based on accessory type */}
      {getKeySpecFields()}

      <div className="mb-4">
        <label
          htmlFor="keySpecifications"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
        >
          Additional Key Specifications
          <div className="relative group ml-1">
            <Info className="h-4 w-4 text-gray-400" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
              Any additional technical specifications that would be important
              for buyers to know.
            </div>
          </div>
        </label>
        <textarea
          id="keySpecifications"
          value={specs.keySpecifications}
          onChange={(e) =>
            handleInputChange("keySpecifications", e.target.value)
          }
          placeholder="Include dimensions, weight, connections, special features, etc."
          className="w-full p-2 border border-gray-300 rounded-md h-24 resize-vertical"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="maintenanceHistory"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
        >
          Maintenance History
          <div className="relative group ml-1">
            <Info className="h-4 w-4 text-gray-400" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
              Any recent maintenance, repairs, or service history if applicable.
            </div>
          </div>
        </label>
        <textarea
          id="maintenanceHistory"
          value={specs.maintenanceHistory}
          onChange={(e) =>
            handleInputChange("maintenanceHistory", e.target.value)
          }
          placeholder="Recent repairs, service dates, parts replaced, etc."
          className="w-full p-2 border border-gray-300 rounded-md h-20 resize-vertical"
        />
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
          placeholder="Any additional information, usage notes, or details about the accessory..."
          className="w-full p-2 border border-gray-300 rounded-md h-24 resize-vertical"
        />
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product. Don't
          forget to upload photos as they are required for all accessories.
        </p>
      </div>
    </div>
  );
}

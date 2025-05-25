"use client";

import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  materialType: "",
  sealantType: "",
  dimensions: {
    diameter: "",
    width: "",
    depth: "",
    profile: "",
  },
  quantity: {
    value: "",
    unit: "",
  },
  brand: "",
  condition: "",
  expirationDate: "",
  lotNumber: "",
  storageConditions: "",
  sellerNotes: "",
};

export default function MaterialsConsumablesSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  const handleDimensionChange = (field, value) => {
    const updatedDimensions = { ...specs.dimensions, [field]: value };
    const updatedSpecs = { ...specs, dimensions: updatedDimensions };
    onChange(updatedSpecs);
  };

  const handleQuantityChange = (field, value) => {
    const updatedQuantity = { ...specs.quantity, [field]: value };
    const updatedSpecs = { ...specs, quantity: updatedQuantity };
    onChange(updatedSpecs);
  };

  // Get appropriate dimension fields based on subtype
  const getDimensionFields = () => {
    switch (specs.subtype) {
      case "Backer Rod":
        return (
          <>
            <div>
              <label
                htmlFor="diameter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diameter (inches) *
              </label>
              <input
                type="text"
                id="diameter"
                value={specs.dimensions.diameter}
                onChange={(e) =>
                  handleDimensionChange("diameter", e.target.value)
                }
                placeholder="0.5"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </>
        );
      case "Compression Seal (Material)":
        return (
          <>
            <div>
              <label
                htmlFor="width"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Width (inches) *
              </label>
              <input
                type="text"
                id="width"
                value={specs.dimensions.width}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                placeholder="1.0"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="depth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Depth (inches) *
              </label>
              <input
                type="text"
                id="depth"
                value={specs.dimensions.depth}
                onChange={(e) => handleDimensionChange("depth", e.target.value)}
                placeholder="0.75"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </>
        );
      case "Joint Sealant":
        return (
          <>
            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="width"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Joint Width (inches)
                </label>
                <input
                  type="text"
                  id="width"
                  value={specs.dimensions.width}
                  onChange={(e) =>
                    handleDimensionChange("width", e.target.value)
                  }
                  placeholder="0.5"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="depth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Joint Depth (inches)
                </label>
                <input
                  type="text"
                  id="depth"
                  value={specs.dimensions.depth}
                  onChange={(e) =>
                    handleDimensionChange("depth", e.target.value)
                  }
                  placeholder="0.25"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Get appropriate quantity units based on subtype
  const getQuantityUnits = () => {
    switch (specs.subtype) {
      case "Backer Rod":
      case "Compression Seal (Material)":
        return ["Feet", "Rolls"];
      case "Joint Sealant":
        if (["Epoxy", "Polyurea", "Silicone"].includes(specs.sealantType)) {
          return ["Gallons", "Pails", "Cartridges"];
        } else if (specs.sealantType === "Hot Pour Rubber") {
          return ["lbs", "Boxes", "Pails"];
        }
        return ["Gallons", "Pails", "lbs", "Boxes", "Cartridges"];
      default:
        return [
          "Feet",
          "Rolls",
          "Gallons",
          "Pails",
          "lbs",
          "Boxes",
          "Cartridges",
        ];
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="subtype"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Material Subtype *
          </label>
          <div className="relative">
            <select
              id="subtype"
              value={specs.subtype}
              onChange={(e) => handleInputChange("subtype", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select material subtype</option>
              <option>Backer Rod</option>
              <option>Compression Seal (Material)</option>
              <option>Joint Sealant</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="materialType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Material Type/Specification *
          </label>
          {specs.subtype === "Joint Sealant" ? (
            <div className="relative">
              <select
                id="sealantType"
                value={specs.sealantType}
                onChange={(e) =>
                  handleInputChange("sealantType", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                required
              >
                <option value="">Select sealant type</option>
                <option>Epoxy</option>
                <option>Polyurea</option>
                <option>Silicone</option>
                <option>Hot Pour Rubber</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              id="materialType"
              value={specs.materialType}
              onChange={(e) =>
                handleInputChange("materialType", e.target.value)
              }
              placeholder={
                specs.subtype === "Backer Rod"
                  ? "Open Cell, Closed Cell, Hybrid"
                  : specs.subtype === "Compression Seal (Material)"
                  ? "Neoprene, EPDM, etc."
                  : "Material specification"
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dimensions *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {getDimensionFields()}
          {specs.subtype && (
            <div
              className={
                specs.subtype === "Joint Sealant"
                  ? "col-span-1 sm:col-span-2"
                  : ""
              }
            >
              <label
                htmlFor="profile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile/Shape {specs.subtype !== "Joint Sealant" && "*"}
              </label>
              <input
                type="text"
                id="profile"
                value={specs.dimensions.profile}
                onChange={(e) =>
                  handleDimensionChange("profile", e.target.value)
                }
                placeholder={
                  specs.subtype === "Backer Rod"
                    ? "Round, D-Shape"
                    : specs.subtype === "Compression Seal (Material)"
                    ? "V-Seal, Arrow-Lock"
                    : "Self-Leveling, Non-Sag"
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required={specs.subtype !== "Joint Sealant"}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label
              htmlFor="quantityValue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity *
            </label>
            <input
              type="text"
              id="quantityValue"
              value={specs.quantity.value}
              onChange={(e) => handleQuantityChange("value", e.target.value)}
              placeholder="500"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="quantityUnit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit *
            </label>
            <div className="relative">
              <select
                id="quantityUnit"
                value={specs.quantity.unit}
                onChange={(e) => handleQuantityChange("unit", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                required
              >
                <option value="">Unit</option>
                {getQuantityUnits().map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
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
            placeholder="Sika, Dow, BASF, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
              <option>New/Unused</option>
              <option>Opened but Unused</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="expirationDate"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Expiration Date
            {specs.subtype === "Joint Sealant" && (
              <div className="relative group ml-1">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 sm:w-64 z-10">
                  Recommended for sealants - date after which the product may
                  not perform as intended.
                </div>
              </div>
            )}
          </label>
          <input
            type="date"
            id="expirationDate"
            value={specs.expirationDate}
            onChange={(e) =>
              handleInputChange("expirationDate", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="lotNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lot Number
          </label>
          <input
            type="text"
            id="lotNumber"
            value={specs.lotNumber}
            onChange={(e) => handleInputChange("lotNumber", e.target.value)}
            placeholder="Lot/Batch identification number"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="storageConditions"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Storage Conditions
          </label>
          <input
            type="text"
            id="storageConditions"
            value={specs.storageConditions}
            onChange={(e) =>
              handleInputChange("storageConditions", e.target.value)
            }
            placeholder="e.g., Stored indoors at 40-90°F"
            className="w-full p-2 border border-gray-300 rounded-md"
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
          placeholder="Additional information about the product, usage recommendations, etc."
          className="w-full p-2 border border-gray-300 rounded-md h-20"
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

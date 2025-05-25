"use client";

import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  capacity: "",
  capacityUnit: "Gallons",
  maxTemp: "",
  pressureRating: "",
  operatingHours: "",
  weight: "",
  dimensions: "",
  features: {
    temperatureControl: false,
    agitator: false,
    hoseLength: "",
    hoseType: "",
    applicatorWandType: "",
  },
  includedAccessories: {
    hoses: false,
    wands: false,
    tips: false,
    other: "",
  },
  maintenanceHistory: "",
  usageHistory: "",
};

export default function JointSealantSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  const handleFeatureChange = (field, value) => {
    const updatedFeatures = { ...specs.features, [field]: value };
    const updatedSpecs = { ...specs, features: updatedFeatures };
    onChange(updatedSpecs);
  };

  const handleAccessoryChange = (field, value) => {
    const updatedAccessories = { ...specs.includedAccessories, [field]: value };
    const updatedSpecs = { ...specs, includedAccessories: updatedAccessories };
    onChange(updatedSpecs);
  };

  // Dynamic capacity unit options based on subtype
  const getCapacityUnitOptions = () => {
    switch (specs.subtype) {
      case "Epoxy Pump/Dispenser":
      case "Sealant Pump (Bulk/Cartridge)":
        return ["Gallons", "lbs", "Cartridge Size"];
      case "Hot Pour Melter/Applicator (Trailer/Kettle)":
        return ["Gallons", "lbs"];
      case "Compression Seal Machine/Installer":
        return ["lbs", "Cartridge Size"];
      case "Sealant Gun (Manual/Pneumatic)":
        return ["Cartridge Size", "oz"];
      default:
        return ["Gallons", "lbs", "Cartridge Size"];
    }
  };

  // Dynamic fields based on subtype
  const renderDynamicFields = () => {
    switch (specs.subtype) {
      case "Hot Pour Melter/Applicator (Trailer/Kettle)":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="maxTemp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Temperature (°F) *
              </label>
              <input
                type="text"
                id="maxTemp"
                value={specs.maxTemp}
                onChange={(e) => handleInputChange("maxTemp", e.target.value)}
                placeholder="400"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Features
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={specs.features.temperatureControl}
                    onChange={(e) =>
                      handleFeatureChange(
                        "temperatureControl",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="ml-2">Temperature Control</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={specs.features.agitator}
                    onChange={(e) =>
                      handleFeatureChange("agitator", e.target.checked)
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="ml-2">Agitator</span>
                </label>
              </div>
            </div>
          </div>
        );
      case "Epoxy Pump/Dispenser":
      case "Sealant Pump (Bulk/Cartridge)":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="pressureRating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pressure Rating (PSI) *
              </label>
              <input
                type="text"
                id="pressureRating"
                value={specs.pressureRating}
                onChange={(e) =>
                  handleInputChange("pressureRating", e.target.value)
                }
                placeholder="3000"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="hoseLength"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hose Length (ft)
              </label>
              <input
                type="text"
                id="hoseLength"
                value={specs.features.hoseLength}
                onChange={(e) =>
                  handleFeatureChange("hoseLength", e.target.value)
                }
                placeholder="25"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );
      case "Compression Seal Machine/Installer":
      case "Sealant Gun (Manual/Pneumatic)":
        return specs.powerSource === "Pneumatic" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="pressureRating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pressure Rating (PSI) *
              </label>
              <input
                type="text"
                id="pressureRating"
                value={specs.pressureRating}
                onChange={(e) =>
                  handleInputChange("pressureRating", e.target.value)
                }
                placeholder="90"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="applicatorWandType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Applicator Wand Type
              </label>
              <input
                type="text"
                id="applicatorWandType"
                value={specs.features.applicatorWandType}
                onChange={(e) =>
                  handleFeatureChange("applicatorWandType", e.target.value)
                }
                placeholder="Standard, Extended, etc."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        ) : null;
      default:
        return null;
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
            Equipment Subtype *
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
              <option>Epoxy Pump/Dispenser</option>
              <option>Sealant Pump (Bulk/Cartridge)</option>
              <option>Hot Pour Melter/Applicator (Trailer/Kettle)</option>
              <option>Compression Seal Machine/Installer</option>
              <option>Sealant Gun (Manual/Pneumatic)</option>
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
            placeholder="Crafco, CIMLINE, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
            placeholder="SuperSeal 195, Magnum, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

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
            placeholder="2020"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
              <option>Manual</option>
              <option>Pneumatic</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Capacity *
            </label>
            <input
              type="text"
              id="capacity"
              value={specs.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="150"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="capacityUnit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit
            </label>
            <div className="relative">
              <select
                id="capacityUnit"
                value={specs.capacityUnit}
                onChange={(e) =>
                  handleInputChange("capacityUnit", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              >
                {getCapacityUnitOptions().map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {renderDynamicFields()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="operatingHours"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Operating Hours
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                For powered units, indicate the number of hours the equipment
                has been used.
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
            placeholder="250"
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={["Manual", "Pneumatic"].includes(specs.powerSource)}
          />
        </div>

        <div>
          <label
            htmlFor="dimensions"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Dimensions (L × W × H)
          </label>
          <input
            type="text"
            id="dimensions"
            value={specs.dimensions}
            onChange={(e) => handleInputChange("dimensions", e.target.value)}
            placeholder="48 × 36 × 24"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
            placeholder="750"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="hoseType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hose Type
          </label>
          <input
            type="text"
            id="hoseType"
            value={specs.features.hoseType}
            onChange={(e) => handleFeatureChange("hoseType", e.target.value)}
            placeholder="Heated, Standard, etc."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Included Accessories
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedAccessories.hoses}
              onChange={(e) => handleAccessoryChange("hoses", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="ml-2">Hoses</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedAccessories.wands}
              onChange={(e) => handleAccessoryChange("wands", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="ml-2">Wands</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={specs.includedAccessories.tips}
              onChange={(e) => handleAccessoryChange("tips", e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="ml-2">Tips</span>
          </label>
        </div>
        <div>
          <label
            htmlFor="otherAccessories"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Other Accessories
          </label>
          <input
            type="text"
            id="otherAccessories"
            value={specs.includedAccessories.other}
            onChange={(e) => handleAccessoryChange("other", e.target.value)}
            placeholder="Describe other included accessories"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
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
          placeholder="Regular servicing details, part replacements, etc."
          className="w-full p-2 border border-gray-300 rounded-md h-20"
        />
      </div>

      <div className="mb-4">
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
          placeholder="Describe how the equipment was used, job types, frequency, etc."
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

"use client";

import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";

const defaultSpecs = {
  subtype: "",
  brand: "",
  model: "",
  year: "",
  powerSource: "",
  condition: "",
  price: "",
  location: "",

  // Robot specific
  weightClass: "",
  maxReachHorizontal: "",
  maxReachVertical: "",

  // Excavator specific
  operatingWeight: "",
  maxDiggingDepth: "",
  bucketCapacity: "",

  // Dump Cart specific
  loadCapacity: "",
  driveSystem: "",

  // Recommended fields for all
  operatingHours: "",
  maintenanceHistory: "",
  usageHistory: "",
  sellerNotes: "",

  // Robot recommended
  includedAttachments: "",
  remoteControlType: "",

  // Excavator recommended
  excavatorAttachments: "",
  trackType: "",
  batteryCondition: "",
  chargerIncluded: false,

  // Dump Cart recommended
  dumpCartBatteryCondition: "",
  dumpCartChargerIncluded: false,
  dumpType: "",
  tireType: "",
};

export default function DemolitionEquipmentSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  // Show/hide fields based on selected subtype
  const isRobot =
    specs.subtype === "Demolition Robot (Electric)" ||
    specs.subtype === "Demolition Robot (Diesel)";
  const isExcavator = specs.subtype === "Electric Mini Excavator";
  const isDumpCart = specs.subtype === "Electric Dump Cart / Power Buggy";

  return (
    <div>
      {/* Common Fields for All Types */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="subtype"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Equipment Type *
            </label>
            <div className="relative">
              <select
                id="subtype"
                value={specs.subtype}
                onChange={(e) => handleInputChange("subtype", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                required
              >
                <option value="">Select equipment type</option>
                <option>Demolition Robot (Electric)</option>
                <option>Demolition Robot (Diesel)</option>
                <option>Electric Mini Excavator</option>
                <option>Electric Dump Cart / Power Buggy</option>
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
              placeholder="Husqvarna, Brokk, etc."
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              placeholder="Model number or name"
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
              placeholder="2022"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                onChange={(e) =>
                  handleInputChange("powerSource", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                required
              >
                <option value="">Select power source</option>
                <option>Electric Battery</option>
                <option>Diesel</option>
                <option>Electric Corded</option>
                <option>Hybrid</option>
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
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>For Parts</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (USD) *
            </label>
            <input
              type="text"
              id="price"
              value={specs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="25000"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
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
      </div>

      {/* Recommended Fields for All Types */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              placeholder="1250"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="maintenanceHistory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maintenance History
            </label>
            <input
              type="text"
              id="maintenanceHistory"
              value={specs.maintenanceHistory}
              onChange={(e) =>
                handleInputChange("maintenanceHistory", e.target.value)
              }
              placeholder="Regular service every 500 hours"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
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
            placeholder="Describe how this equipment has been used"
            className="w-full p-2 border border-gray-300 rounded-md h-24"
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
            placeholder="Additional information about the equipment"
            className="w-full p-2 border border-gray-300 rounded-md h-24"
          />
        </div>
      </div>

      {/* Demolition Robot Specific Fields */}
      {isRobot && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Demolition Robot Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="weightClass"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Weight Class/Size *
              </label>
              <input
                type="text"
                id="weightClass"
                value={specs.weightClass}
                onChange={(e) =>
                  handleInputChange("weightClass", e.target.value)
                }
                placeholder="2200 lbs / 1000 kg"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isRobot}
              />
            </div>

            <div>
              <label
                htmlFor="maxReachHorizontal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Horizontal Reach *
              </label>
              <input
                type="text"
                id="maxReachHorizontal"
                value={specs.maxReachHorizontal}
                onChange={(e) =>
                  handleInputChange("maxReachHorizontal", e.target.value)
                }
                placeholder="15 ft / 4.5 m"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isRobot}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="maxReachVertical"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Vertical Reach *
              </label>
              <input
                type="text"
                id="maxReachVertical"
                value={specs.maxReachVertical}
                onChange={(e) =>
                  handleInputChange("maxReachVertical", e.target.value)
                }
                placeholder="16 ft / 5 m"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isRobot}
              />
            </div>

            <div>
              <label
                htmlFor="remoteControlType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Remote Control Type
              </label>
              <input
                type="text"
                id="remoteControlType"
                value={specs.remoteControlType}
                onChange={(e) =>
                  handleInputChange("remoteControlType", e.target.value)
                }
                placeholder="Wireless with belt harness"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="includedAttachments"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Included Attachments
            </label>
            <textarea
              id="includedAttachments"
              value={specs.includedAttachments}
              onChange={(e) =>
                handleInputChange("includedAttachments", e.target.value)
              }
              placeholder="Breaker SB202, Crusher CC440, etc."
              className="w-full p-2 border border-gray-300 rounded-md h-24"
            />
          </div>
        </div>
      )}

      {/* Electric Mini Excavator Specific Fields */}
      {isExcavator && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Mini Excavator Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="operatingWeight"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Operating Weight (lbs/kg) *
              </label>
              <input
                type="text"
                id="operatingWeight"
                value={specs.operatingWeight}
                onChange={(e) =>
                  handleInputChange("operatingWeight", e.target.value)
                }
                placeholder="3500 lbs / 1590 kg"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isExcavator}
              />
            </div>

            <div>
              <label
                htmlFor="maxDiggingDepth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Digging Depth *
              </label>
              <input
                type="text"
                id="maxDiggingDepth"
                value={specs.maxDiggingDepth}
                onChange={(e) =>
                  handleInputChange("maxDiggingDepth", e.target.value)
                }
                placeholder="8 ft / 2.4 m"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isExcavator}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="bucketCapacity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bucket Capacity *
              </label>
              <input
                type="text"
                id="bucketCapacity"
                value={specs.bucketCapacity}
                onChange={(e) =>
                  handleInputChange("bucketCapacity", e.target.value)
                }
                placeholder="0.12 cubic yards"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isExcavator}
              />
            </div>

            <div>
              <label
                htmlFor="trackType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Track Type/Condition
              </label>
              <input
                type="text"
                id="trackType"
                value={specs.trackType}
                onChange={(e) => handleInputChange("trackType", e.target.value)}
                placeholder="Rubber tracks, 80% remaining"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="excavatorAttachments"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Included Attachments
            </label>
            <textarea
              id="excavatorAttachments"
              value={specs.excavatorAttachments}
              onChange={(e) =>
                handleInputChange("excavatorAttachments", e.target.value)
              }
              placeholder="12 bucket, 24 grading bucket, hydraulic thumb"
              className="w-full p-2 border border-gray-300 rounded-md h-24"
            />
          </div>

          {specs.powerSource === "Electric Battery" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="batteryCondition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Battery Condition/Age
                </label>
                <input
                  type="text"
                  id="batteryCondition"
                  value={specs.batteryCondition}
                  onChange={(e) =>
                    handleInputChange("batteryCondition", e.target.value)
                  }
                  placeholder="1 year old, holds 90% of original charge"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={specs.chargerIncluded}
                    onChange={(e) =>
                      handleInputChange("chargerIncluded", e.target.checked)
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="ml-2">Charger Included</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Electric Dump Cart / Power Buggy Specific Fields */}
      {isDumpCart && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Dump Cart / Power Buggy Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="loadCapacity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Load Capacity (lbs/cubic feet) *
              </label>
              <input
                type="text"
                id="loadCapacity"
                value={specs.loadCapacity}
                onChange={(e) =>
                  handleInputChange("loadCapacity", e.target.value)
                }
                placeholder="2500 lbs / 16 cubic feet"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={isDumpCart}
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
                  onChange={(e) =>
                    handleInputChange("driveSystem", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={isDumpCart}
                >
                  <option value="">Select drive system</option>
                  <option>Direct Drive</option>
                  <option>Belt Drive</option>
                  <option>Hydraulic Drive</option>
                  <option>Chain Drive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="dumpType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dump Type
              </label>
              <div className="relative">
                <select
                  id="dumpType"
                  value={specs.dumpType}
                  onChange={(e) =>
                    handleInputChange("dumpType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                >
                  <option value="">Select dump type</option>
                  <option>Hydraulic</option>
                  <option>Manual</option>
                  <option>Electric Actuator</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="tireType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tire Type
              </label>
              <input
                type="text"
                id="tireType"
                value={specs.tireType}
                onChange={(e) => handleInputChange("tireType", e.target.value)}
                placeholder="Pneumatic, flat-free, etc."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {specs.powerSource === "Electric Battery" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="dumpCartBatteryCondition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Battery Condition/Age
                </label>
                <input
                  type="text"
                  id="dumpCartBatteryCondition"
                  value={specs.dumpCartBatteryCondition}
                  onChange={(e) =>
                    handleInputChange(
                      "dumpCartBatteryCondition",
                      e.target.value
                    )
                  }
                  placeholder="6 months old, excellent condition"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={specs.dumpCartChargerIncluded}
                    onChange={(e) =>
                      handleInputChange(
                        "dumpCartChargerIncluded",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span className="ml-2">Charger Included</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product. Required
          fields may change based on the selected equipment type.
        </p>
      </div>
    </div>
  );
}

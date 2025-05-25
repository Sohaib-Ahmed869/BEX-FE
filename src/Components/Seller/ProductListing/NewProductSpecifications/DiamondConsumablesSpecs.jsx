"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Define default specs similar to CoreDrillBitSpecs
const defaultSpecs = {
  subtype: "",
  brand: "",
  diameter: "",
  arborSize: "",
  applicationType: "",
  segmentHeight: "",
  wireLength: "",
  wireDiameter: "",
  wireCoating: "",
  segmentShape: "",
  segmentDimensions: "",
  bondApplication: "",
  segmentQuantity: "",
  wetDryUse: "",
  sinteredElectroplated: "",
  compatibility: "",
  sellerNotes: "",
  location: "",
};

export default function DiamondConsumablesSpecs({ formData, onChange }) {
  // Merge default specs with any provided formData
  const specs = { ...defaultSpecs, ...(formData?.specs || {}) };

  // Handle input changes and immediately propagate to parent component
  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  // Determine which fields to show based on subtype
  const showBladeFields = specs.subtype === "Diamond Blades";
  const showWireFields = specs.subtype === "Diamond Wire";
  const showSegmentFields = specs.subtype === "Loose Diamond Segments";

  return (
    <div className="max-w-4xl mx-auto p-4">
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
            <option>Diamond Blades</option>
            <option>Diamond Wire</option>
            <option>Loose Diamond Segments</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="mb-4">
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
          placeholder="Husqvarna, Hilti, etc."
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {showBladeFields && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="diameter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diameter (Inches/mm) *
              </label>
              <input
                type="text"
                id="diameter"
                value={specs.diameter}
                onChange={(e) => handleInputChange("diameter", e.target.value)}
                placeholder="14 inches"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showBladeFields}
              />
            </div>

            <div>
              <label
                htmlFor="arborSize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Arbor Size (Inches/mm) *
              </label>
              <input
                type="text"
                id="arborSize"
                value={specs.arborSize}
                onChange={(e) => handleInputChange("arborSize", e.target.value)}
                placeholder="1 inch"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showBladeFields}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="applicationType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Type *
              </label>
              <div className="relative">
                <select
                  id="applicationType"
                  value={specs.applicationType}
                  onChange={(e) =>
                    handleInputChange("applicationType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={showBladeFields}
                >
                  <option value="">Select application</option>
                  <option>Cured Concrete</option>
                  <option>Green Concrete</option>
                  <option>Asphalt</option>
                  <option>Masonry</option>
                  <option>General Purpose</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="segmentHeight"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segment Height (mm/Inches) *
              </label>
              <input
                type="text"
                id="segmentHeight"
                value={specs.segmentHeight}
                onChange={(e) =>
                  handleInputChange("segmentHeight", e.target.value)
                }
                placeholder="10 mm"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showBladeFields}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="wetDryUse"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Wet/Dry Use
            </label>
            <div className="relative max-w-md">
              <select
                id="wetDryUse"
                value={specs.wetDryUse}
                onChange={(e) => handleInputChange("wetDryUse", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              >
                <option value="">Select usage</option>
                <option>Wet Use Only</option>
                <option>Dry Use Only</option>
                <option>Wet & Dry Use</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </>
      )}

      {showWireFields && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="wireLength"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Length (Feet/Meters) *
              </label>
              <input
                type="text"
                id="wireLength"
                value={specs.wireLength}
                onChange={(e) =>
                  handleInputChange("wireLength", e.target.value)
                }
                placeholder="10 meters"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showWireFields}
              />
            </div>

            <div>
              <label
                htmlFor="wireDiameter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diameter/Bead Specification (mm) *
              </label>
              <input
                type="text"
                id="wireDiameter"
                value={specs.wireDiameter}
                onChange={(e) =>
                  handleInputChange("wireDiameter", e.target.value)
                }
                placeholder="11 mm"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showWireFields}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="wireCoating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coating *
              </label>
              <div className="relative">
                <select
                  id="wireCoating"
                  value={specs.wireCoating}
                  onChange={(e) =>
                    handleInputChange("wireCoating", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={showWireFields}
                >
                  <option value="">Select coating</option>
                  <option>Plastic</option>
                  <option>Rubber</option>
                  <option>Spring</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="applicationTypeWire"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Type *
              </label>
              <div className="relative">
                <select
                  id="applicationTypeWire"
                  value={specs.applicationType}
                  onChange={(e) =>
                    handleInputChange("applicationType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={showWireFields}
                >
                  <option value="">Select application</option>
                  <option>Reinforced Concrete</option>
                  <option>Steel</option>
                  <option>Quarry</option>
                  <option>General Purpose</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="sinteredElectroplated"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sintered/Electroplated
              </label>
              <div className="relative">
                <select
                  id="sinteredElectroplated"
                  value={specs.sinteredElectroplated}
                  onChange={(e) =>
                    handleInputChange("sinteredElectroplated", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                >
                  <option value="">Select type</option>
                  <option>Sintered</option>
                  <option>Electroplated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="wetDryUseWire"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wet/Dry Use
              </label>
              <div className="relative">
                <select
                  id="wetDryUseWire"
                  value={specs.wetDryUse}
                  onChange={(e) =>
                    handleInputChange("wetDryUse", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                >
                  <option value="">Select usage</option>
                  <option>Wet Use Only</option>
                  <option>Dry Use Only</option>
                  <option>Wet & Dry Use</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </>
      )}

      {showSegmentFields && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="segmentShape"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segment Shape/Type *
              </label>
              <div className="relative">
                <select
                  id="segmentShape"
                  value={specs.segmentShape}
                  onChange={(e) =>
                    handleInputChange("segmentShape", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={showSegmentFields}
                >
                  <option value="">Select shape</option>
                  <option>Standard</option>
                  <option>Turbo</option>
                  <option>V-Shape</option>
                  <option>Rooftop</option>
                  <option>T-Segmented</option>
                  <option>Crown</option>
                  <option>Serrated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="segmentDimensions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dimensions (LxWxH - mm) *
              </label>
              <input
                type="text"
                id="segmentDimensions"
                value={specs.segmentDimensions}
                onChange={(e) =>
                  handleInputChange("segmentDimensions", e.target.value)
                }
                placeholder="24x3.5x10 mm"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showSegmentFields}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="bondApplication"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bond/Application *
              </label>
              <div className="relative">
                <select
                  id="bondApplication"
                  value={specs.bondApplication}
                  onChange={(e) =>
                    handleInputChange("bondApplication", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  required={showSegmentFields}
                >
                  <option value="">Select application</option>
                  <option>Hard Concrete</option>
                  <option>Medium Concrete</option>
                  <option>Soft Concrete</option>
                  <option>Asphalt</option>
                  <option>General Purpose</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="segmentQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity (Number of Segments) *
              </label>
              <input
                type="number"
                id="segmentQuantity"
                value={specs.segmentQuantity}
                onChange={(e) =>
                  handleInputChange("segmentQuantity", e.target.value)
                }
                placeholder="24"
                className="w-full p-2 border border-gray-300 rounded-md"
                required={showSegmentFields}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="compatibility"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Compatibility (Bit/Blade Diameters)
            </label>
            <input
              type="text"
              id="compatibility"
              value={specs.compatibility}
              onChange={(e) =>
                handleInputChange("compatibility", e.target.value)
              }
              placeholder="For 14-inch blades"
              className="w-full p-2 border border-gray-300 rounded-md max-w-md"
            />
          </div>
        </>
      )}

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
          rows={3}
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
          className="w-full p-2 border border-gray-300 rounded-md max-w-md"
          required
        />
      </div>

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
      </div>
    </div>
  );
}

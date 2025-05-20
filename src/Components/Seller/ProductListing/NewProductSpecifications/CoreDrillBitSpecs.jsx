import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";
const defaultSpecs = {
  bitDiameter: "",
  arborThreadType: '5/8"-11 Thread (Smaller bits)',
  barrelLength: "",
  usableDrillingDepth: "",
  tubingFormat: "Standard",
  segmentHeight: "",
  segmentThickness: "",
  headType: "Open Head",
  segmentType: "",
  segmentAttachment: "",
  bondHardness: "",
  waterCooled: false,
  usageType: "",
  brand: "",
  location: "",
};
export default function CoreDrillBitSpecs({ formData, onChange }) {
  const specs = { ...defaultSpecs, ...formData.specs };

  const handleInputChange = (field, value) => {
    const updatedSpecs = { ...specs, [field]: value };
    onChange(updatedSpecs);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="bitDiameter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bit Diameter (inches) *
          </label>
          <input
            type="text"
            id="bitDiameter"
            value={specs.bitDiameter}
            onChange={(e) => handleInputChange("bitDiameter", e.target.value)}
            placeholder="4.0"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="threadType"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Arbor/Thread Type *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                The connection type between the bit and the drill motor.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              id="threadType"
              value={specs.arborThreadType}
              onChange={(e) =>
                handleInputChange("arborThreadType", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option>5/8"-11 Thread (Smaller bits)</option>
              <option>1-1/4"-7 Thread (Larger bits)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="barrelLength"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Barrel Length (inches) *
          </label>
          <input
            type="text"
            id="barrelLength"
            value={specs.barrelLength}
            onChange={(e) => handleInputChange("barrelLength", e.target.value)}
            placeholder="14.0"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="usableDrillingDepth"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Usable Drilling Depth (inches) *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                The maximum depth the bit can drill in a single pass (typically
                barrel length minus backend/cap).
              </div>
            </div>
          </label>
          <input
            type="text"
            id="usableDrillingDepth"
            value={specs.usableDrillingDepth}
            onChange={(e) =>
              handleInputChange("usableDrillingDepth", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="tubingFormat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tubing Format *
          </label>
          <div className="relative">
            <select
              id="tubingFormat"
              value={specs.tubingFormat}
              onChange={(e) =>
                handleInputChange("tubingFormat", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option>Standard</option>
              <option>Continental Tubing</option>
              <option>Other Deep Drill Format</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="segmentHeight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Segment Height (mm) *
          </label>
          <input
            type="text"
            id="segmentHeight"
            value={specs.segmentHeight}
            onChange={(e) => handleInputChange("segmentHeight", e.target.value)}
            placeholder="7"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="segmentThickness"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Segment Thickness (mm)
          </label>
          <input
            type="text"
            id="segmentThickness"
            value={specs.segmentThickness}
            onChange={(e) =>
              handleInputChange("segmentThickness", e.target.value)
            }
            placeholder="3.5"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Head Type *
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Configuration of the bit head/barrel end.
              </div>
            </div>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="headType"
                value="Open Head"
                checked={specs.headType === "Open Head"}
                onChange={() => handleInputChange("headType", "Open Head")}
                className="mr-2 w-4 h-4 text-orange-500"
                required
              />
              <span>Open Head</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="headType"
                value="Closed Head"
                checked={specs.headType === "Closed Head"}
                onChange={() => handleInputChange("headType", "Closed Head")}
                className="mr-2 w-4 h-4 text-orange-500"
                required
              />
              <span>Closed Head</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="segmentShape"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Segment Type/Shape
          </label>
          <div className="relative">
            <select
              id="segmentShape"
              value={specs.segmentType}
              onChange={(e) => handleInputChange("segmentType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            >
              <option value="">Select segment shape</option>
              <option>Standard/Flat</option>
              <option>Turbo</option>
              <option>V-Shape</option>
              <option>Rooftop</option>
              <option>T-Segmented</option>
              <option>Crown</option>
              <option>Serrated</option>
              <option>Other (Specify)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="attachmentMethod"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            Segment Attachment
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Method used to attach segments to the barrel.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              id="attachmentMethod"
              value={specs.segmentAttachment}
              onChange={(e) =>
                handleInputChange("segmentAttachment", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            >
              <option value="">Select attachment method</option>
              <option>Laser Welded</option>
              <option>Brazed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="bondHardness"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bond Hardness/Application *
          </label>
          <div className="relative">
            <select
              id="bondHardness"
              value={specs.bondHardness}
              onChange={(e) =>
                handleInputChange("bondHardness", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select application type</option>
              <option>Soft Bond (Hard Materials)</option>
              <option>Medium Bond (General Purpose)</option>
              <option>Hard Bond (Soft Materials)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="usageType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Usage Type *
          </label>
          <div className="relative">
            <select
              id="usageType"
              value={specs.usageType}
              onChange={(e) => handleInputChange("usageType", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              required
            >
              <option value="">Select usage type</option>
              <option>Wet Use Only</option>
              <option>Dry Use Only</option>
              <option>Wet & Dry Use</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
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

      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={specs.waterCooled}
            onChange={(e) => handleInputChange("waterCooled", e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded"
          />
          <span className="ml-2 flex items-center">
            Water-Cooled
            <div className="relative group ml-1">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-64 z-10">
                Check if this bit requires water cooling during operation.
              </div>
            </div>
          </span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Check if this bit requires water cooling during operation.
        </p>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-gray-700">
          Fields marked with * are mandatory for listing this product.
        </p>
      </div>
    </div>
  );
}

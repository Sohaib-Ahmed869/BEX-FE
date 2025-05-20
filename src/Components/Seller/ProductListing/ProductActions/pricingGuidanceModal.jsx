import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const PricingGuidanceModal = ({ onClose }) => {
  const [coreDrillsExpanded, setCoreDrillsExpanded] = useState(true);
  const [pricingFactorsExpanded, setPricingFactorsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the modal animation on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`bg-gray-50 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto m-4 ${
          isVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 animate-slideIn">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900">
              Pricing Guidance
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Reference
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-600 p-1 cursor-pointer border border-gray-900 rounded-full"
          >
            <X size={16} />
          </button>
        </div>

        {/* Core Drills Pricing Section */}
        <div
          className="border-b border-gray-200 animate-slideIn"
          style={{ animationDelay: "100ms" }}
        >
          <button
            onClick={() => setCoreDrillsExpanded(!coreDrillsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <h3 className="text-base font-medium">Core Drills Pricing</h3>
            {coreDrillsExpanded ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>

          {coreDrillsExpanded && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
                Motors & Rigs - Professional Brands
              </p>

              {/* Handheld Electric 120V */}
              <div
                className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
                style={{ animationDelay: "150ms" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Handheld Electric 120V</h4>
                  <span className="font-medium">$1,800 - $5,000</span>
                </div>
                <p className="text-sm text-gray-600">Typical price range:</p>
                <p className="text-sm text-gray-500">
                  Hilti DD 130/150-U, Husqvarna DM 220, WEKA DK13
                </p>
              </div>

              {/* Rig-Mounted Electric 240V */}
              <div
                className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Rig-Mounted Electric 240V</h4>
                  <span className="font-medium">$4,000 - $10,000</span>
                </div>
                <p className="text-sm text-gray-600">Typical price range:</p>
                <p className="text-sm text-gray-500">
                  Hilti DD 250, Husqvarna DM 340/400, Shibuya TS-255/405PRO,
                  Cardi T2, Golz KB400
                </p>
              </div>

              {/* Rig-Mounted HF Electric */}
              <div
                className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
                style={{ animationDelay: "250ms" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Rig-Mounted HF Electric</h4>
                  <span className="font-medium">$9,000 - $28,000</span>
                </div>
                <p className="text-sm text-gray-600">Typical price range:</p>
                <p className="text-sm text-gray-500">
                  Hilti DD 350-CA/500-X, Husqvarna DM 650 HF, WEKA DK32/42
                </p>
              </div>

              {/* Battery (MX Fuel Handheld) */}
              <div
                className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Battery (MX Fuel Handheld)</h4>
                  <span className="font-medium">$1,200 - $1,600</span>
                </div>
                <p className="text-sm text-gray-600">Typical price range:</p>
                <p className="text-sm text-gray-500">
                  Note: Catalog price seems low, may be tool-only
                </p>
              </div>

              {/* Used Equipment Notes */}
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "350ms" }}
              >
                <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
                <p className="text-sm text-gray-600">
                  Highly variable. Expect significant depreciation from new
                  prices. Premium brands (Hilti, Husqvarna, WEKA) in VG/Good
                  condition retain value better.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Factors Section */}
        <div className="animate-slideIn" style={{ animationDelay: "200ms" }}>
          <button
            onClick={() => setPricingFactorsExpanded(!pricingFactorsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <h3 className="text-base font-medium">Pricing Factors</h3>
            {pricingFactorsExpanded ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>

          {pricingFactorsExpanded && (
            <div className="px-4 pb-4 animate-fadeIn">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  Content for pricing factors would go here. This could include
                  information about factors that affect pricing such as brand
                  reputation, power specifications, included accessories,
                  warranty terms, market demand, seasonal variations, and
                  regional differences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingGuidanceModal;

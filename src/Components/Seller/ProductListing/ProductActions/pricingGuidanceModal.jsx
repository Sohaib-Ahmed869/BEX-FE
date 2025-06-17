import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// Core Drill Bits Component

// Handheld Power Saws Component
const HandheldPowerSawsSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "180ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Handheld Power Saws</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Professional Brands - Portable Cutting Solutions
        </p>

        {/* Cut-off Saws (Gas, Pro) */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Cut-off Saws (Gas, Pro)</h4>
            <span className="font-medium">$900 - $2,000+</span>
          </div>
          <p className="text-sm text-gray-600">Professional gas models:</p>
          <p className="text-sm text-gray-500">
            Stihl TS 410-TS 800/TS 500i, Husqvarna K 760/770/970/1270, Hilti DSH
            700/900-X, Makita EK7651H
          </p>
        </div>

        {/* Cut-off Saws (Electric/Battery, Pro) */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">
              Cut-off Saws (Electric/Battery, Pro)
            </h4>
            <span className="font-medium">$900 - $1,900+</span>
          </div>
          <p className="text-sm text-gray-600">Electric & battery models:</p>
          <p className="text-sm text-gray-500">
            Husqvarna K 3000/K 4000/K 1 PACE, Hilti DCH 300, Makita CE001G
          </p>
        </div>

        {/* Ring Saws */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Ring Saws (HF Electric/Hydraulic)</h4>
            <span className="font-medium">$4,000 - $6,500+</span>
          </div>
          <p className="text-sm text-gray-600">High frequency & hydraulic:</p>
          <p className="text-sm text-gray-500">
            Husqvarna K 6500 Ring/K 3600 MK II, ICS 890FRS
          </p>
        </div>

        {/* Chain Saws (Concrete) */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">
              Chain Saws (Concrete - Gas/Hydraulic)
            </h4>
            <span className="font-medium">$2,000 - $8,000+</span>
          </div>
          <p className="text-sm text-gray-600">Concrete cutting chains:</p>
          <p className="text-sm text-gray-500">
            ICS 695XL/890F4, Stihl GS 461, Husqvarna K 970 Chain
          </p>
        </div>

        {/* Hydraulic Hand Saws */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "350ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Hydraulic Hand Saws (Deep Cut)</h4>
            <span className="font-medium">$2,800 - $3,800+</span>
          </div>
          <p className="text-sm text-gray-600">Deep cutting capability:</p>
          <p className="text-sm text-gray-500">
            Wolverine Standard/Flush, Diamond Products HS4000, GDM Model 24C
          </p>
        </div>

        {/* Used Equipment Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Commonly available, especially cut-off saws. Price depends heavily
            on condition and usage.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Demolition Equipment Component
const DemolitionEquipmentSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "200ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Demolition Equipment</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Professional Brands - Heavy Demolition Equipment
        </p>

        {/* Demolition Robots */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Demolition Robots</h4>
            <span className="font-medium">$50,000 - $300,000+</span>
          </div>
          <p className="text-sm text-gray-600">Remote controlled demolition:</p>
          <p className="text-sm text-gray-500">
            Brokk, Husqvarna - Estimated pricing (catalog data not available)
          </p>
        </div>

        {/* Electric Mini Excavators */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Electric Mini Excavators</h4>
            <span className="font-medium">$25,000 - $70,000+</span>
          </div>
          <p className="text-sm text-gray-600">Battery-powered excavation:</p>
          <p className="text-sm text-gray-500">
            Estimated pricing (catalog data not available)
          </p>
        </div>

        {/* Electric Dump Carts/Buggies */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Electric Dump Carts/Buggies</h4>
            <span className="font-medium">$10,000 - $25,000+</span>
          </div>
          <p className="text-sm text-gray-600">Material transport solutions:</p>
          <p className="text-sm text-gray-500">
            Estimated pricing (catalog data not available)
          </p>
        </div>

        {/* Used Equipment Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Significant investment, value depends heavily on hours, condition,
            battery health (electric), included attachments. Limited data
            available.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Diamond Consumables Component
const DiamondConsumablesSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "220ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Diamond Consumables</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Diamond Blades, Wire & Segments
        </p>

        {/* New Blades */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">New Blades</h4>
            <span className="font-medium">$100 - $2,000+</span>
          </div>
          <p className="text-sm text-gray-600">
            Size and application dependent:
          </p>
          <p className="text-sm text-gray-500">
            Small handheld (~$100) to large wall/flat saw blades (~$2,000+)
          </p>
        </div>

        {/* New Wire */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">New Wire</h4>
            <span className="font-medium">Priced per foot/meter</span>
          </div>
          <p className="text-sm text-gray-600">Diamond wire cutting:</p>
          <p className="text-sm text-gray-500">
            Depends on spec. Loops vary by length and application
          </p>
        </div>

        {/* New Segments */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">New Segments</h4>
            <span className="font-medium">$5 - $20+ per segment</span>
          </div>
          <p className="text-sm text-gray-600">Replacement segments:</p>
          <p className="text-sm text-gray-500">
            Depending on size/quality specifications
          </p>
        </div>

        {/* Used Consumables Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h4 className="font-medium mb-2">Used Blades/Wire Notes:</h4>
          <p className="text-sm text-gray-600">
            Value based almost entirely on remaining segment height/life. A
            blade near end-of-life has minimal value.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Accessories (Non-Diamond) Component
const AccessoriesSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "240ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Accessories (Non-Diamond)</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Support Equipment & Accessories
        </p>

        {/* Pro Drill Stand */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Pro Drill Stand</h4>
            <span className="font-medium">$800 - $2,500+</span>
          </div>
          <p className="text-sm text-gray-600">Professional drilling stands</p>
        </div>

        {/* Vacuum Pump */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Vacuum Pump</h4>
            <span className="font-medium">$500 - $1,500+</span>
          </div>
          <p className="text-sm text-gray-600">Dust collection systems</p>
        </div>

        {/* Generator */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Generator</h4>
            <span className="font-medium">$1,000 - $10,000+</span>
          </div>
          <p className="text-sm text-gray-600">Power generation equipment</p>
        </div>

        {/* Used Accessories Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Highly dependent on type and condition. Stands, power packs,
            generators retain value better than smaller items like hoses/cords.
            Value driven by functionality and compatibility.
          </p>
        </div>
      </div>
    )}
  </div>
);

const CoreDrillBitsSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "100ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">
        Core Drill Bits (Impregnated Diamond)
      </h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          New Diamond Core Bits - Professional Grade
        </p>

        {/* Small Diameters */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Small Diameters (2"-3")</h4>
            <span className="font-medium">$100 - $250+</span>
          </div>
          <p className="text-sm text-gray-600">Brand/Type dependent</p>
        </div>

        {/* Medium Diameters */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Medium Diameters (4"-6")</h4>
            <span className="font-medium">$200 - $400+</span>
          </div>
          <p className="text-sm text-gray-600">Standard professional grade</p>
        </div>

        {/* Large Diameters */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Large Diameters (8"-12")</h4>
            <span className="font-medium">$450 - $750+</span>
          </div>
          <p className="text-sm text-gray-600">
            Premium brands/specs can exceed these ranges
          </p>
        </div>

        {/* Used Equipment Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Value primarily driven by remaining segment height and condition
            (barrel straightness, thread condition). Often sold in lots. Bits
            needing retipping have minimal value beyond the barrel itself.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Core Drills Component (existing)
const CoreDrillsSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "120ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Core Drills (Motors & Rigs)</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
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
            Hilti DD 250, Husqvarna DM 340/400, Shibuya TS-255/405PRO, Cardi T2,
            Golz KB400
          </p>
        </div>

        {/* Rig-Mounted HF Electric */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Rig-Mounted HF Electric</h4>
            <span className="font-medium">$9,000 - $28,000+</span>
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
        <div className="animate-fadeIn" style={{ animationDelay: "350ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Highly variable. Expect significant depreciation from new prices.
            Premium brands (Hilti, Husqvarna, WEKA) in VG/Good condition retain
            value better.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Flat Saws Component
const FlatSawsSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "140ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Flat Saws (Walk-Behind / Rider)</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Professional Brands - Walk-Behind & Rider Saws
        </p>

        {/* Push/Small Self-Propelled */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">
              Push/Small Self-Propelled (up to ~20" blade)
            </h4>
            <span className="font-medium">$3,200 - $12,000</span>
          </div>
          <p className="text-sm text-gray-600">Gas/Electric models:</p>
          <p className="text-sm text-gray-500">
            Diamond Products CC1300-CC1500 series, Husqvarna FS 309-FS 513,
            Merit M110, Wacker BFS 1345
          </p>
        </div>

        {/* Medium Self-Propelled */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">
              Medium Self-Propelled (~24"-30" blade)
            </h4>
            <span className="font-medium">$8,000 - $20,000</span>
          </div>
          <p className="text-sm text-gray-600">Gas/Electric models:</p>
          <p className="text-sm text-gray-500">
            Diamond Products CC2500-CC3900 series, Husqvarna FS 5200/FS 6800,
            Merit M400 series, MECO MEC-35, Sanders SS-350
          </p>
        </div>

        {/* Large Self-Propelled */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">
              Large Self-Propelled (~36"-54"+ blade)
            </h4>
            <span className="font-medium">$20,000 - $60,000+</span>
          </div>
          <p className="text-sm text-gray-600">Diesel models:</p>
          <p className="text-sm text-gray-500">
            Diamond Products CC6566D-CC8120D, Husqvarna FS 5000D-FS 8400D, Merit
            M600-M1100 series, Dr. Schulze DRS-500/700, Lissmac Compact 502
          </p>
        </div>

        {/* Early Entry Saws */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Early Entry Saws</h4>
            <span className="font-medium">$2,500 - $11,000+</span>
          </div>
          <p className="text-sm text-gray-600">Specialized cutting:</p>
          <p className="text-sm text-gray-500">
            Husqvarna Soff-Cut X150 - X4000
          </p>
        </div>

        {/* Rider Saws */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "350ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Rider Saws</h4>
            <span className="font-medium">$80,000 - $200,000+</span>
          </div>
          <p className="text-sm text-gray-600">
            Heavy-duty highway applications
          </p>
          <p className="text-sm text-gray-500">
            Estimated pricing - not in catalog
          </p>
        </div>

        {/* Used Equipment Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Wide range. Depreciation depends heavily on hours, condition, tier
            level (highway saws vs utility). Ex-rental units common.
          </p>
        </div>
      </div>
    )}
  </div>
);

// Wall Saws & Wire Saws Component
const WallWireSawsSection = ({ isExpanded, setExpanded }) => (
  <div
    className="border-b border-gray-200 animate-slideIn"
    style={{ animationDelay: "160ms" }}
  >
    <button
      onClick={() => setExpanded(!isExpanded)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <h3 className="text-base font-medium">Wall Saws & Wire Saws</h3>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>

    {isExpanded && (
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4 animate-fadeIn">
          Professional Equipment - Wall & Wire Cutting Systems
        </p>

        {/* Electric Wall Saw Systems */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Electric Wall Saw Systems (HF)</h4>
            <span className="font-medium">$18,000 - $52,000+</span>
          </div>
          <p className="text-sm text-gray-600">High frequency systems:</p>
          <p className="text-sm text-gray-500">
            Hilti DST 20-CA, Husqvarna WS 220-WS 482, Pentruder RS2/6-12/8-20
            HF, Tyrolit WSE 1621/2226
          </p>
        </div>

        {/* Hydraulic Wall Saw Systems */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Hydraulic Wall Saw Systems</h4>
            <span className="font-medium">$25,000 - $42,000+</span>
          </div>
          <p className="text-sm text-gray-600">Hydraulic power systems:</p>
          <p className="text-sm text-gray-500">
            Diamond Products CC1200/1600, GDM Hi-Cycle
          </p>
        </div>

        {/* Wire Saw Systems */}
        <div
          className="mb-4 bg-white border border-gray-200 rounded-xl p-2 animate-fadeIn"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Wire Saw Systems (HF/Hydraulic)</h4>
            <span className="font-medium">$28,000 - $50,000+</span>
          </div>
          <p className="text-sm text-gray-600">Wire cutting systems:</p>
          <p className="text-sm text-gray-500">
            Hilti DSW 1510-CA, Husqvarna CS 10/CS 2512, Pentruder 3P8, Tyrolit
            SK-B WX, Diamond Products WS25
          </p>
        </div>

        {/* Used Equipment Notes */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h4 className="font-medium mb-2">Used Equipment Notes:</h4>
          <p className="text-sm text-gray-600">
            Listings less common. Significant savings potential over new. Value
            depends heavily on age, condition, hours, components.
          </p>
        </div>
      </div>
    )}
  </div>
);

const PricingGuidanceModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pricingFactorsExpanded, setPricingFactorsExpanded] = useState(false);

  // Category states
  const [coreDrillBitsExpanded, setCoreDrillBitsExpanded] = useState(false);
  const [coreDrillsExpanded, setCoreDrillsExpanded] = useState(true);
  const [flatSawsExpanded, setFlatSawsExpanded] = useState(false);
  const [wallWireSawsExpanded, setWallWireSawsExpanded] = useState(false);
  const [HandheldPowerSawsExpanded, setHandheldPowerSawsExpanded] =
    useState(false);
  const [DemolitionEquipmentExpanded, setDemolitionEquipmentExpanded] =
    useState(false);
  const [DiamondConsumablesExpanded, setDiamondConsumablesExpanded] =
    useState(false);
  const [AccessoriesSectionExpanded, setAccessoriesSectionExpanded] =
    useState(false);

  // Individual factor states
  const [conditionExpanded, setConditionExpanded] = useState(false);
  const [operatingHoursExpanded, setOperatingHoursExpanded] = useState(false);
  const [ageExpanded, setAgeExpanded] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [specificationsExpanded, setSpecificationsExpanded] = useState(false);
  const [maintenanceExpanded, setMaintenanceExpanded] = useState(false);
  const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);
  const [marketDemandExpanded, setMarketDemandExpanded] = useState(false);

  useEffect(() => {
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

        {/* Equipment Categories */}
        <CoreDrillBitsSection
          isExpanded={coreDrillBitsExpanded}
          setExpanded={setCoreDrillBitsExpanded}
        />

        <CoreDrillsSection
          isExpanded={coreDrillsExpanded}
          setExpanded={setCoreDrillsExpanded}
        />

        <FlatSawsSection
          isExpanded={flatSawsExpanded}
          setExpanded={setFlatSawsExpanded}
        />

        <WallWireSawsSection
          isExpanded={wallWireSawsExpanded}
          setExpanded={setWallWireSawsExpanded}
        />
        <HandheldPowerSawsSection
          isExpanded={HandheldPowerSawsExpanded}
          setExpanded={setHandheldPowerSawsExpanded}
        />
        <DemolitionEquipmentSection
          isExpanded={DemolitionEquipmentExpanded}
          setExpanded={setDemolitionEquipmentExpanded}
        />
        <DiamondConsumablesSection
          isExpanded={DiamondConsumablesExpanded}
          setExpanded={setDiamondConsumablesExpanded}
        />
        <AccessoriesSection
          isExpanded={AccessoriesSectionExpanded}
          setExpanded={setAccessoriesSectionExpanded}
        />
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
              <p className="text-sm text-gray-600 mb-4">
                Key factors that determine the market value of used professional
                concrete cutting and drilling equipment:
              </p>

              {/* Condition Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setConditionExpanded(!conditionExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">1. Condition</h4>
                  {conditionExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {conditionExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      This is paramount. Items graded "Very Good" or "Good
                      Condition" command significantly higher prices than those
                      in "Fair" or "Poor" condition.
                    </p>
                    <p className="text-sm text-gray-500">
                      The detailed condition descriptors (segment height, leaks,
                      engine performance, etc.) are critical for valuation.
                    </p>
                  </div>
                )}
              </div>

              {/* Operating Hours Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() =>
                    setOperatingHoursExpanded(!operatingHoursExpanded)
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    2. Operating Hours
                  </h4>
                  {operatingHoursExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {operatingHoursExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Lower hours generally correlate with higher value,
                      assuming proper maintenance.
                    </p>
                    <p className="text-sm text-gray-500">
                      Meter readings are valuable data points for buyers to
                      assess equipment usage.
                    </p>
                  </div>
                )}
              </div>

              {/* Age Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setAgeExpanded(!ageExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    3. Age (Year of Manufacture)
                  </h4>
                  {ageExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {ageExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Newer equipment typically retains more value.
                    </p>
                    <p className="text-sm text-gray-500">
                      The launch year data from catalogs highlights the
                      evolution of models and technology improvements.
                    </p>
                  </div>
                )}
              </div>

              {/* Brand Reputation Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setBrandExpanded(!brandExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    4. Brand Reputation
                  </h4>
                  {brandExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {brandExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Premium, durable brands generally have better resale value
                      than lower-tier or less common brands.
                    </p>
                    <p className="text-sm text-gray-500">
                      Top brands include: Hilti, Husqvarna, Pentruder, Diamond
                      Products, WEKA, and other established manufacturers.
                    </p>
                  </div>
                )}
              </div>

              {/* Specifications Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() =>
                    setSpecificationsExpanded(!specificationsExpanded)
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    5. Specifications & Capabilities
                  </h4>
                  {specificationsExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {specificationsExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Higher power, larger capacity, and more advanced features
                      contribute to higher value.
                    </p>
                    <p className="text-sm text-gray-500">
                      Consider motor power, drilling capacity, cutting depth,
                      and technological features when pricing.
                    </p>
                  </div>
                )}
              </div>

              {/* Maintenance History Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setMaintenanceExpanded(!maintenanceExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    6. Maintenance History
                  </h4>
                  {maintenanceExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {maintenanceExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Documented service records can increase buyer confidence
                      and perceived value.
                    </p>
                    <p className="text-sm text-gray-500">
                      Maintain records of regular maintenance, repairs, and part
                      replacements to justify higher pricing.
                    </p>
                  </div>
                )}
              </div>

              {/* Included Accessories Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setAccessoriesExpanded(!accessoriesExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    7. Included Accessories
                  </h4>
                  {accessoriesExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {accessoriesExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      The completeness of a package affects value significantly.
                    </p>
                    <p className="text-sm text-gray-500">
                      Examples: rig with stand, saw with blades, robot with
                      multiple attachments, vacuum systems, power packs.
                    </p>
                  </div>
                )}
              </div>

              {/* Market Demand Factor */}
              <div className="mb-3 border border-gray-200 rounded-lg">
                <button
                  onClick={() => setMarketDemandExpanded(!marketDemandExpanded)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    8. Market Demand & Location
                  </h4>
                  {marketDemandExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                {marketDemandExpanded && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Regional demand and shipping costs can influence pricing.
                    </p>
                    <p className="text-sm text-gray-500">
                      Consider local market conditions, seasonal demand, and
                      transportation costs when setting prices.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingGuidanceModal;

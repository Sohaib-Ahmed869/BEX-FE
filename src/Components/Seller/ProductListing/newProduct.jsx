import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Info, ChevronDown, Upload, X, Check, Loader2 } from "lucide-react";
import SellerHeader from "../sellerHeader/page";
import { getConditionDescription } from "../../../utils/productGradingDescription";
import CoreDrillBitSpecs from "./NewProductSpecifications/CoreDrillBitSpecs";
import CoreDrillSpecs from "./NewProductSpecifications/CoreDrillSpecs";
import FlatSawSpecs from "./NewProductSpecifications/FlatSawSpecs";
import WallWireSawSpecs from "./NewProductSpecifications/WallWireSawSpecs";
import DiamondConsumablesSpecs from "./NewProductSpecifications/DiamondConsumablesSpecs";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { addProduct } from "../../../services/productsServices";
import MediaUploadComponent from "./mediaUpload";
import { useNavigate } from "react-router-dom";
import CubeLoader from "../../../utils/cubeLoader";
import PricingGuidanceModal from "./ProductActions/pricingGuidanceModal";
import HandheldPowerSawSpecs from "./NewProductSpecifications/handHeldPowerSawSpecs";
import SpecialtySawSpecs from "./NewProductSpecifications/SpecialitySawsSpecs";
import DrillingEquipmentSpecs from "./NewProductSpecifications/DrillingEquipmentSpecs";
import JointSealantSpecs from "./NewProductSpecifications/JointSealantRepairEquipmentSpecs";
import MaterialsConsumablesSpecs from "./NewProductSpecifications/MaterialsConsumablesSpecs";
import DemolitionEquipmentSpecs from "./NewProductSpecifications/DemolitionEquipmentSpecs";
import AccessoriesNonDiamondSpecs from "./NewProductSpecifications/AcessoriesSpecs";

const RETIPPING_PRICE_DATA = {
  // Small Diameters (2" - 12")
  "select bit diameter": { price: 0.0, segments: 0 },
  '2"': { price: 48.0, segments: 4 },
  '2.5"': { price: 60.0, segments: 5 },
  '3"': { price: 84.0, segments: 6 },
  '3.5"': { price: 96.0, segments: 8 },
  '4"': { price: 108.0, segments: 9 },
  '4.5"': { price: 108.0, segments: 9 },
  '5"': { price: 120.0, segments: 10 },
  '5.5"': { price: 132.0, segments: 11 },
  '6"': { price: 144.0, segments: 12 },
  '6.5"': { price: 156.0, segments: 13 },
  '7"': { price: 168.0, segments: 14 },
  '8"': { price: 180.0, segments: 15 },
  '9"': { price: 192.0, segments: 16 },
  '10"': { price: 238.0, segments: 17 },
  '11"': { price: 252.0, segments: 18 },
  '12"': { price: 280.0, segments: 20 },
  // Large Diameters (14" - 60")
  '14"': { price: 384.0, segments: 25 },
  '15"': { price: 400.0, segments: 26 },
  '16"': { price: 416.0, segments: 27 },
  '18"': { price: 464.0, segments: 30 },
  '20"': { price: 540.0, segments: 33 },
  '22"': { price: 594.0, segments: 34 },
  '24"': { price: 630.0, segments: 35 },
  '25"': { price: 648.0, segments: 36 },
  '26"': { price: 684.0, segments: 37 },
  '27"': { price: 702.0, segments: 38 },
  '28"': { price: 720.0, segments: 39 },
  '29"': { price: 738.0, segments: 40 },
  '30"': { price: 840.0, segments: 42 },
  '31"': { price: 860.0, segments: 43 },
  '32"': { price: 900.0, segments: 44 },
  '33"': { price: 920.0, segments: 45 },
  '34"': { price: 940.0, segments: 46 },
  '35"': { price: 980.0, segments: 47 },
  '36"': { price: 1000.0, segments: 50 },
  '38"': { price: 1060.0, segments: 53 },
  '40"': { price: 1320.0, segments: 55 },
  '42"': { price: 1392.0, segments: 58 },
  '44"': { price: 1464.0, segments: 61 },
  '46"': { price: 1536.0, segments: 64 },
  '48"': { price: 1584.0, segments: 66 },
  '50"': { price: 1656.0, segments: 69 },
  '52"': { price: 1728.0, segments: 72 },
  '54"': { price: 1800.0, segments: 75 },
  '56"': { price: 1872.0, segments: 78 },
  '58"': { price: 1920.0, segments: 80 },
  '60"': { price: 1992.0, segments: 83 },
};

const defaultRetippingData = {
  diameter: '3"',
  segments: RETIPPING_PRICE_DATA['3"'].segments,
  totalPrice: RETIPPING_PRICE_DATA['3"'].price.toFixed(2),
  enableDIY: false,
};

function CoreBitRetippingComponent({ formData, onChange }) {
  // Use formData.retipping if available, otherwise use defaults
  const retippingData = { ...defaultRetippingData, ...formData.retipping };

  // Handle input changes and update parent state
  const handleInputChange = (field, value) => {
    const updatedRetipping = { ...retippingData, [field]: value };
    onChange({ retipping: updatedRetipping });
  };

  // Handle diameter change and update segments and price accordingly
  const handleDiameterChange = (e) => {
    const selectedDiameter = e.target.value;
    const diameterData = RETIPPING_PRICE_DATA[selectedDiameter];

    const updatedRetipping = {
      ...retippingData,
      diameter: selectedDiameter,
      segments: diameterData.segments,
      totalPrice: diameterData.price.toFixed(2),
    };

    onChange({ retipping: updatedRetipping });
  };

  // Handle manual segment count change
  const handleSegmentsChange = (e) => {
    const segmentCount = parseInt(e.target.value) || 0;
    const perSegmentPrice = parseFloat(retippingData.perSegmentPrice) || 0;
    const totalPrice = (segmentCount * perSegmentPrice).toFixed(2);

    const updatedRetipping = {
      ...retippingData,
      segments: segmentCount,
      totalPrice: totalPrice,
    };

    onChange({ retipping: updatedRetipping });
  };

  // Handle per-segment price change
  const handlePerSegmentPriceChange = (e) => {
    const price = e.target.value;
    const segmentCount = parseInt(retippingData.segments) || 0;
    const totalPrice = (segmentCount * parseFloat(price || 0)).toFixed(2);

    const updatedRetipping = {
      ...retippingData,
      perSegmentPrice: price,
      totalPrice: totalPrice,
    };

    onChange({ retipping: updatedRetipping });
  };

  // Toggle DIY segment purchasing option
  const handleDIYToggle = (e) => {
    handleInputChange("enableDIY", e.target.checked);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Core Bit Retipping Configuration
        </h2>
        <div className="relative group cursor-pointer">
          <Info className="h-5 w-5 text-gray-400" />
          <div className="absolute right-0 cursor-pointer bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm p-4 rounded-xl w-70 z-10">
            Retipping replaces worn diamond segments on core bits for
            significant cost savings compared to buying new bits. BEX in-house
            premium retipping service (Roy, UT).
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="diameter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Bit Diameter (inches)
        </label>
        <div className="relative">
          <select
            id="diameter"
            value={retippingData.diameter}
            onChange={handleDiameterChange}
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
          >
            {Object.keys(RETIPPING_PRICE_DATA).map((diameter) => (
              <option key={diameter} value={diameter}>
                {diameter} - ${RETIPPING_PRICE_DATA[diameter].price.toFixed(2)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="segments"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Number of Segments
        </label>
        <input
          type="number"
          id="segments"
          value={retippingData.segments}
          onChange={handleSegmentsChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <p className="text-xs text-gray-500 mt-1">
          Standard segment count for {retippingData.diameter} core bit:{" "}
          {RETIPPING_PRICE_DATA[retippingData.diameter]?.segments || "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Total Retipping Price:</span>
            <span className="text-lg font-bold">
              ${retippingData.totalPrice}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Price does not include shipping costs. Retipping performed at BEX
            facility in Roy, UT.
          </p>
        </div>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="enableDIY"
          checked={retippingData.enableDIY}
          onChange={handleDIYToggle}
          className="mt-1 mr-2"
        />
        <div>
          <label
            htmlFor="enableDIY"
            className="block text-sm font-medium text-gray-700"
          >
            Enable DIY segment purchasing option
          </label>
          <p className="text-xs text-gray-500">
            Allow customers to purchase individual segments for DIY retipping
          </p>
        </div>
      </div>
    </div>
  );
}

const ConditionGradingSection = ({ formData, setFormData }) => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Condition Grading</h2>

      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Product Condition
        </p>

        <div className="space-y-3">
          {[
            "New",
            "Like New",
            "Very Good (VG)",
            "Good Condition (GC)",
            "Fair Condition (FC)",
            "Poor Condition (PC)",
            "For Parts / Not Working",
          ].map((condition) => (
            <div
              key={condition}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() =>
                setFormData({ ...formData, productCondition: condition })
              }
            >
              <label className="flex items-center flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="productCondition"
                  value={condition}
                  // checked={formData.productCondition === condition}
                  onChange={() =>
                    setFormData({ ...formData, productCondition: condition })
                  }
                  className="mr-2 w-4 h-4 text-orange-500"
                />
                <span>{condition}</span>
              </label>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm p-4 rounded-xl w-70 z-10">
                  {getConditionDescription(condition)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function NewProduct() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [completedTabs, setCompletedTabs] = useState({
    general: false,
    description: false,
    media: false,
  });
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // General information
    productName: "",
    category: "",
    subtype: "",
    price: "",
    stockQuantity: "",
    description: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    // Condition
    productCondition: "good",

    // Media
    uploadedImages: [],
    listForSelling: "Yes",
    retipping: {
      diameter: "",
      segments: "",
      perSegmentPrice: "14.00",
      totalPrice: "",
      enableDIY: false,
    },
    specs: {},
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  //useEffect to reset the key when category changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [formData.category]);
  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle specification data changes from child components
  const handleSpecsChange = (specsData) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        ...specsData,
      },
    }));
  };
  const handleRetippingChange = (retippingData) => {
    setFormData((prev) => ({
      ...prev,
      ...retippingData,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle next button click
  const handleNext = () => {
    if (activeTab === "general") {
      setCompletedTabs({ ...completedTabs, general: true });
      setActiveTab("description");
    } else if (activeTab === "description") {
      setCompletedTabs({ ...completedTabs, description: true });
      setActiveTab("media");
    } else if (activeTab === "media") {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (activeTab === "description") {
      setCompletedTabs({ ...completedTabs, description: false });
      setActiveTab("general");
    } else if (activeTab === "media") {
      setCompletedTabs({ ...completedTabs, media: false });
      setActiveTab("description");
    } else if (activeTab === "general") {
      setCompletedTabs({
        ...completedTabs,
        general: false,
        description: false,
        media: false,
      });
      navigate("/product-list");
    }
  };

  const handleSubmit = async () => {
    setCompletedTabs({ ...completedTabs, media: true });
    if (!completedTabs.description || !completedTabs.general) {
      toast.error("Please complete all the sections ");
      return;
    }

    const id = localStorage.getItem("userId");
    console.log(formData);
    try {
      // Validate required fields
      if (
        !formData.productName ||
        !formData.price ||
        !formData.productCondition ||
        !formData.category ||
        !formData.weight ||
        !formData.length ||
        !formData.width ||
        !formData.height
      ) {
        toast.error(
          "Please fill in all required fields in the General info tab"
        );
        return;
      }

      // Validate images
      if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
        toast.error("Please upload at least one image of the product");
        return;
      }

      const userId = id;
      // Prepare data for backend submission
      const formDataForSubmission = new FormData();

      // Map frontend field names to backend expected field names
      formDataForSubmission.append("listing_id", listingId);
      formDataForSubmission.append("title", formData.productName);
      formDataForSubmission.append("price", formData.price);
      formDataForSubmission.append("condition", formData.productCondition);
      formDataForSubmission.append("category", formData.category);
      formDataForSubmission.append("description", formData.description || "");
      formDataForSubmission.append("quantity", formData.stockQuantity || "1");
      formDataForSubmission.append("weight", formData.weight || "1");
      formDataForSubmission.append("length", formData.length || "1");
      formDataForSubmission.append("width", formData.width || "1");
      formDataForSubmission.append("height", formData.height || "1");
      formDataForSubmission.append("subtype", formData.subtype || "");
      formDataForSubmission.append("location", formData.specs?.location || "");
      formDataForSubmission.append(
        "list_for_selling",
        formData.listForSelling === "Yes" ? "true" : "false"
      );

      // Handle attributes object - must be converted to JSON for FormData
      if (formData.specs) {
        formDataForSubmission.append(
          "attributes",
          JSON.stringify(formData.specs)
        );
      }

      // Handle retipping object for Core Drill Bits
      if (formData.category === "Core Drill Bits" && formData.retipping) {
        formDataForSubmission.append(
          "retipping",
          JSON.stringify({
            diameter: formData.retipping.diameter,
            enable_diy: formData.retipping.enableDIY,
            per_segment_price: formData.retipping.perSegmentPrice,
            segments: formData.retipping.segments,
            total_price: formData.retipping.totalPrice,
          })
        );
      }

      // Add image files - ensure they're added with the correct field name
      if (formData.uploadedImages && formData.uploadedImages.length > 0) {
        formData.uploadedImages.forEach((image) => {
          if (image.file) {
            formDataForSubmission.append("files", image.file);
          }
        });
      }

      setIsLoading(true);

      const response = await addProduct(userId, formDataForSubmission);

      if (response.success) {
        toast.success("Product successfully added!");
        setIsLoading(false);
        navigate("/product-list");
        // navigate("/products");
      } else {
        toast.error(response.error?.message || "Failed to add product");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting product:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate specification component based on category
  const renderSpecsComponent = () => {
    switch (formData.category) {
      case "Core Drill Bits":
        return (
          <CoreDrillBitSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Core Drills":
        return (
          <CoreDrillSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Flat Saws":
        return (
          <FlatSawSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Wall Saws & Wire Saws":
        return (
          <WallWireSawSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );

      case "Diamond Consumables":
        return (
          <DiamondConsumablesSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Handheld Power Saws":
        return (
          <HandheldPowerSawSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Specialty Saws":
        return (
          <SpecialtySawSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Drilling Equipment":
        return (
          <DrillingEquipmentSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Joint Sealant & Repair Equipment":
        return (
          <JointSealantSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Materials & Consumables":
        return (
          <MaterialsConsumablesSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Demolition Equipment":
        return (
          <DemolitionEquipmentSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );
      case "Accessories":
        return (
          <AccessoriesNonDiamondSpecs
            formData={formData}
            onChange={(specs) => handleSpecsChange(specs)}
          />
        );

      default:
        return (
          <div className="p-4 text-gray-500">Please select a category</div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      {isLoading && <CubeLoader />}
      <SellerHeader />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      {/* Main Content */}
      <div className="px-6 py-4">
        <h1 className="text-3xl font-medium mb-2">Add Inventory</h1>
        <div className="text-sm text-gray-500 mb-6">
          <Link
            to="/listing"
            className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
          >
            <span>Product list /</span>{" "}
          </Link>
          <span className="text-orange-500">New product</span>
        </div>

        <div className="bg-white p-6 rounded-md mb-4">
          {/* Tabs */}
          <div className="w-full max-w-3xl">
            <div className="flex flex-col sm:flex-row mb-6 overflow-x-auto">
              <button
                className={`mb-2 sm:mb-0 sm:mr-8 pb-4 gap-2 flex items-center cursor-pointer min-w-fit ${
                  activeTab === "general"
                    ? "border-b-2 border-[#FCE1CD] text-orange-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("general")}
              >
                {completedTabs.general ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : activeTab === "general" ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-spin flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 animate-spin flex-shrink-0" />
                )}
                <span className="ml-2 font-medium text-sm sm:text-base whitespace-nowrap">
                  General information
                </span>
              </button>

              <button
                className={`mb-2 sm:mb-0 sm:mr-8 pb-4 gap-2 flex items-center cursor-pointer min-w-fit ${
                  activeTab === "description"
                    ? "border-b-2 border-[#FCE1CD] text-orange-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("description")}
              >
                {completedTabs.description ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : activeTab === "description" ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-spin flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 animate-spin flex-shrink-0" />
                )}
                <span className="ml-2 font-medium text-sm sm:text-base whitespace-nowrap">
                  Description
                </span>
              </button>

              <button
                className={`pb-4 flex gap-2 items-center cursor-pointer min-w-fit ${
                  activeTab === "media"
                    ? "border-b-2 border-[#FCE1CD] text-orange-500"
                    : "text-gray-500"
                }`}
                onClick={() => handleTabChange("media")}
              >
                {completedTabs.media ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                ) : activeTab === "media" ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-spin flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 animate-spin flex-shrink-0" />
                )}
                <span className="ml-2 font-medium text-sm sm:text-base whitespace-nowrap">
                  Media upload
                </span>
              </button>
            </div>
          </div>
          {/* Content based on active tab */}

          {activeTab === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - General Information */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <div className="mb-6">
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    placeholder="Heavy Duty Hammer Drill"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                    >
                      <option>Select a category</option>
                      <option>Core Drill Bits</option>
                      <option>Core Drills</option>
                      <option>Flat Saws</option>
                      <option>Wall Saws & Wire Saws</option>
                      <option>Diamond Consumables</option>
                      <option>Handheld Power Saws</option>
                      <option>Specialty Saws</option>
                      <option>Drilling Equipment</option>
                      <option>Joint Sealant & Repair Equipment</option>
                      <option>Materials & Consumables</option>
                      <option>Demolition Equipment</option>
                      <option>Accessories</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="899.00"
                    className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      handleInputChange("stockQuantity", e.target.value)
                    }
                    placeholder="0"
                    className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Weight (lbs)
                  </label>
                  <input
                    required
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="0"
                    className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="mb-6">
                    <label
                      htmlFor="length"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Lenght (inches)
                    </label>
                    <input
                      type="number"
                      id="length"
                      value={formData.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                      placeholder="0"
                      className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="width"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Width (inches)
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={formData.width}
                      onChange={(e) =>
                        handleInputChange("width", e.target.value)
                      }
                      placeholder="0"
                      className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Height (inches)
                    </label>
                    <input
                      type="number"
                      id="height"
                      value={formData.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      placeholder="0"
                      className="w-full p-2 border border-gray-300 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={5}
                    placeholder="Product description..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Right Column - Dynamic Specifications */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {formData.category} Specifications
                </h2>

                <div
                  key={key}
                  className="animate-[fadeIn_0.5s_ease-in-out]"
                  style={{
                    animationName: "fadeIn",
                    animationDuration: "0.6s",
                    animationFillMode: "both",
                  }}
                >
                  {renderSpecsComponent()}
                </div>
              </div>
            </div>
          )}

          {activeTab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {formData.category === "Core Drill Bits" && (
                <CoreBitRetippingComponent
                  formData={formData}
                  onChange={handleRetippingChange}
                />
              )}
              {/* Condition Grading */}
              <ConditionGradingSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          )}

          {activeTab === "media" && (
            <MediaUploadComponent
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row justify-end mt-4 sm:mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePrevious}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base font-medium order-2 sm:order-1"
            >
              {activeTab === "general" ? "Cancel" : "Previous"}
            </button>
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 bg-[#F47458] border border-[#F47458] cursor-pointer text-white rounded-md hover:bg-[#e06449] text-sm sm:text-base font-medium order-1 sm:order-2"
              onClick={handleNext}
            >
              {activeTab === "media" ? "Complete Form" : "Save and proceed"}
            </button>
          </div>
        </div>
        <p
          onClick={() => setShowPricingModal(true)}
          className="mb-30 text-sm text-gray-500 ml-2 cursor-pointer"
        >
          Want to know more about pricing? See pricing guide here
        </p>
      </div>
      {showPricingModal && (
        <PricingGuidanceModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      )}
    </div>
  );
}

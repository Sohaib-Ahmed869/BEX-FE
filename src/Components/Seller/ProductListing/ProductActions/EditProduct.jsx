import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  ChevronDown,
  ImageIcon,
  XCircle,
  Info,
  Tag,
  Clock,
  Check,
} from "lucide-react";
import SellerHeader from "../../sellerHeader/page";
import {
  getProductById,
  updateProduct,
} from "../../../../services/productsServices";
import { Link, useNavigate, useParams } from "react-router-dom";
import CubeLoader from "../../../../utils/cubeLoader";
import CoreDrillBitSpecs from "../NewProductSpecifications/CoreDrillBitSpecs";
import CoreDrillSpecs from "../NewProductSpecifications/CoreDrillSpecs";
import FlatSawSpecs from "../NewProductSpecifications/FlatSawSpecs";
import WallWireSawSpecs from "../NewProductSpecifications/WallWireSawSpecs";
import DiamondConsumablesSpecs from "../NewProductSpecifications/DiamondConsumablesSpecs";
import HandheldPowerSawSpecs from "../NewProductSpecifications/handHeldPowerSawSpecs";
import SpecialtySawSpecs from "../NewProductSpecifications/SpecialitySawsSpecs";
import DrillingEquipmentSpecs from "../NewProductSpecifications/DrillingEquipmentSpecs";
import JointSealantSpecs from "../NewProductSpecifications/JointSealantRepairEquipmentSpecs";
import MaterialsConsumablesSpecs from "../NewProductSpecifications/MaterialsConsumablesSpecs";
import DemolitionEquipmentSpecs from "../NewProductSpecifications/DemolitionEquipmentSpecs";
import AccessoriesNonDiamondSpecs from "../NewProductSpecifications/AcessoriesSpecs";

import { Bounce, toast, ToastContainer } from "react-toastify";

// Constants for retipping price data

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

const EditProduct = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [addedToListing, setAddedToListing] = useState(false);
  const navigate = useNavigate();
  // Main form data state
  const [formData, setFormData] = useState({
    // General information
    title: "",
    category: "",
    subtype: "",
    price: "",
    quantity: "",
    description: "",
    condition: "",
    location: "",
    weight: "",
    length: "",
    width: "",
    height: "",

    // Media
    images: [],
    retippingDetails: [],
    list_for_selling: false,
    requires_retipping: false,
    is_featured: false,
    is_active: false,
    specs: {},
  });
  useEffect(() => {
    console.log("updates", formData);
  }, [formData]);
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Fetch product data
  const getProductData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductById(id);

      if (response.success) {
        const data = response.data;
        console.log("Product data:", data);

        // Initialize form data with fetched product data
        setFormData({
          id: data.id,
          title: data.title || "",
          category: data.category || "",
          subtype: data.subtype || "",
          price: data.price || "",
          quantity: data.quantity || "",
          description: data.description || "",
          weight: data.weight || "",
          length: data.length || "",
          width: data.width || "",
          height: data.height || "",
          retippingDetails: data.retippingDetails || [],
          condition: data.condition || "",
          location: data.location || "",
          images: data.images
            ? data.images.map((url, index) => ({
                preview: url,
                name: `Existing Image ${index + 1}`,
                isExisting: true,
                url,
              }))
            : [],
          list_for_selling: data.list_for_selling || false,
          requires_retipping: data.requires_retipping || false,
          is_featured: data.is_featured || false,
          is_active: data.is_active || false,
          specifications: data.specifications || {},
          expiration_date: data.expiration_date,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });

        setAddedToListing(data.list_for_selling);
      } else {
        setError(response.error || "Failed to fetch product");
      }
    } catch (err) {
      setError("Error fetching product data");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, [id]);

  // Update form data
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle specification fields

  // Handle retipping data changes
  const handleRetippingChange = (retippingData) => {
    setFormData((prevData) => ({
      ...prevData,
      retippingDetails: {
        ...prevData.retippingDetails,
        ...retippingData,
      },
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) return;
    setIsProcessingFile(true);

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const newImages = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          file: file,
          preview: previewUrl,
          name: file.name,
          isExisting: false,
        };
      });

      setFormData((prevData) => ({
        ...prevData,
        images: [...(prevData.images || []), ...newImages],
      }));

      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setIsProcessingFile(false);
        }
      }, 300);
    } else {
      setIsProcessingFile(false);
    }
  };

  // Remove uploaded image
  const removeImage = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const updatedImages = [...formData.images];

    if (updatedImages[index]?.preview && !updatedImages[index].isExisting) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }

    updatedImages.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) return;
    setIsProcessingFile(true);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);

      const newImages = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          file: file,
          preview: previewUrl,
          name: file.name,
          isExisting: false,
        };
      });

      setFormData((prevData) => ({
        ...prevData,
        images: [...(prevData.images || []), ...newImages],
      }));
    }

    setTimeout(() => {
      setIsProcessingFile(false);
    }, 300);
  };

  // Open image modal
  const openImageModal = (image, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImage(null);
  };

  // Handle browse click
  const handleBrowseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle dropzone click
  const handleDropZoneClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      const currentTags = formData.specifications.features || [];
      if (!currentTags.includes(newTag.trim())) {
        setFormData((prevData) => ({
          ...prevData,
          specifications: {
            ...prevData.specifications,
            features: [...currentTags, newTag.trim()],
          },
        }));
      }
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    const currentTags = formData.specifications.features || [];
    setFormData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        features: currentTags.filter((tag) => tag !== tagToRemove),
      },
    }));
  };

  // Save product data
  const handleSubmit = async () => {
    setLoading(true);
    const productid = formData.id;
    const result = await updateProduct(productid, formData);

    if (result.success) {
      // Handle successful update
      toast.success("Product updated successfully");
      console.log("Product updated:", result.data);
      setIsEditing(false);
      setTimeout(() => {
        navigate("/seller/product-list");
      }, 1000);
      setLoading(false);
    } else {
      // Handle error
      setLoading(false);
      toast.error("Failed to update product");
      console.error("Failed to update product:", result.error);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Toggle listing status
  const toggleAddToListing = () => {
    setAddedToListing(!addedToListing);
    setFormData((prevData) => ({
      ...prevData,
      list_for_selling: !addedToListing,
    }));
  };

  // Format price with commas
  const formatPrice = (value) => {
    if (!value) return "0.00";
    return Number.parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate days remaining until expiration
  const daysRemaining = () => {
    if (!formData.expiration_date) return 0;

    const expirationDate = new Date(formData.expiration_date);
    const today = new Date();
    const differenceInTime = expirationDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  // Handle image navigation
  const nextImage = () => {
    if (formData.images && formData.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % formData.images.length);
    }
  };

  const prevImage = () => {
    if (formData.images && formData.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + formData.images.length) % formData.images.length
      );
    }
  };
  const handleFormChange = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };
  // Core Bit Retipping Component
  const CoreBitRetippingComponent = ({ formData, onChange, onSave }) => {
    const retippingData = formData.retippingDetails || {};

    const handleDiameterChange = async (e) => {
      const selectedDiameter = e.target.value;
      const diameterData = RETIPPING_PRICE_DATA[selectedDiameter];

      if (!diameterData) return;

      const updatedRetipping = {
        ...retippingData,
        diameter: selectedDiameter,
        segments: diameterData.segments,
        total_price: diameterData.price.toFixed(2),
      };

      // Update local form data
      onChange({ retippingDetails: updatedRetipping });
    };

    // Handle segments change (manual override)
    const handleSegmentsChange = async (e) => {
      const segmentCount = parseInt(e.target.value) || 0;
      const currentDiameter = retippingData.diameter;
      const diameterData = RETIPPING_PRICE_DATA[currentDiameter];

      if (!diameterData) return;

      // Calculate price based on segment count vs standard segments
      const standardSegments = diameterData.segments;
      const pricePerSegment = diameterData.price / standardSegments;
      const totalPrice = (segmentCount * pricePerSegment).toFixed(2);

      const updatedRetipping = {
        ...retippingData,
        segments: segmentCount,
        total_price: totalPrice,
      };

      // Update local form data
      onChange({ retippingDetails: updatedRetipping });

      // Auto-save the changes
      if (onSave) {
        try {
          await onSave({ retippingDetails: updatedRetipping });
        } catch (error) {
          console.error("Failed to save retipping changes:", error);
        }
      }
    };

    // Toggle DIY segment purchasing option
    const handleDIYToggle = async (e) => {
      const updatedRetipping = {
        ...retippingData,
        enable_diy: e.target.checked,
      };

      // Update local form data
      onChange({ retippingDetails: updatedRetipping });

      // Auto-save the changes
      if (onSave) {
        try {
          await onSave({ retippingDetails: updatedRetipping });
        } catch (error) {
          console.error("Failed to save retipping changes:", error);
        }
      }
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
              value={retippingData.diameter || ""}
              onChange={handleDiameterChange}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            >
              <option value="">Select diameter</option>
              {Object.keys(RETIPPING_PRICE_DATA)
                .filter((key) => key !== "select bit diameter")
                .map((diameter) => (
                  <option key={diameter} value={diameter}>
                    {diameter} - $
                    {RETIPPING_PRICE_DATA[diameter].price.toFixed(2)}
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
            value={retippingData.segments || ""}
            onChange={handleSegmentsChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1"
          />
          {retippingData.diameter &&
            RETIPPING_PRICE_DATA[retippingData.diameter] && (
              <p className="text-xs text-gray-500 mt-1">
                Standard segment count for {retippingData.diameter} core bit:{" "}
                {RETIPPING_PRICE_DATA[retippingData.diameter].segments}
              </p>
            )}
        </div>

        <div className="mb-6">
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Total Retipping Price:
              </span>
              <span className="text-lg font-bold">
                ${retippingData.total_price || "0.00"}
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
            checked={retippingData.enable_diy || false}
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
  };

  const MediaUploadComponent = () => {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-6 w-full max-w-full overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Media upload</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            Upload your media
            <div className="ml-2 bg-orange-100 text-orange-500 rounded-full p-0.5">
              <Upload className="h-4 w-4" />
            </div>
          </label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 cursor-pointer"
            onClick={handleDropZoneClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-orange-500 mb-2" />
              <p className="text-center mb-2">
                Select your file or drag and drop
              </p>
              <p className="text-xs text-gray-500 mb-4">
                png, jpg, jpeg accepted
              </p>
              <button
                type="button"
                className="bg-orange-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-orange-600"
                onClick={handleBrowseClick}
                disabled={isProcessingFile}
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div className="mt-4 w-full overflow-x-hidden">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" /> Uploaded Images (
                {formData.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                {formData.images.map((image, index) => (
                  <div
                    key={`img-${index}-${image.name}`}
                    className="relative group w-full"
                  >
                    <div
                      className="h-40 rounded-md shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => openImageModal(image, e)}
                    >
                      <img
                        src={
                          image.preview ||
                          "/placeholder.svg?height=400&width=320"
                        }
                        alt={image.name || `Uploaded ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => removeImage(index, e)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-600 group-hover:opacity-100 opacity-0 transition-opacity"
                      title="Remove image"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                    <p
                      className="text-xs mt-1 text-gray-500 truncate"
                      title={image.name}
                    >
                      {image.name}
                      {image.isExisting && " (Existing)"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={(e) => closeImageModal(e)}
          >
            <div
              className="relative bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-lg font-medium">{selectedImage.name}</h3>
                <button
                  onClick={(e) => closeImageModal(e)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage.preview || "/placeholder.svg"}
                  alt={selectedImage.name}
                  className="max-h-full w-auto mx-auto"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you want to list product for selling?
          </label>
          <div className="relative w-full max-w-xs">
            <select
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              value={formData.list_for_selling ? "Yes" : "No"}
              onChange={(e) =>
                handleInputChange("list_for_selling", e.target.value === "Yes")
              }
            >
              <option>Yes</option>
              <option>No</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  // Product Card Component (Display)
  const ProductCardComponent = () => {
    // Calculate revenue
    const revenue =
      Number.parseFloat(formData.price) * Number.parseInt(formData.quantity);

    // Determine stock status
    const stockStatus =
      Number.parseInt(formData.quantity) > 5
        ? "In-stock"
        : Number.parseInt(formData.quantity) < 5 &&
          Number.parseInt(formData.quantity) > 0
        ? "Low stock"
        : "Out of stock";
    const stockStatusClass =
      Number.parseInt(formData.quantity) > 0
        ? "text-green-600"
        : "text-red-600";

    return (
      <div className="flex flex-col w-full max-w-7xl mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Product Image Section */}
          <div className="w-full md:w-1/4 p-4 bg-gray-100">
            {/* Main Image Display */}
            <div className="w-full h-64 relative flex items-center justify-center mb-4">
              {formData.images && formData.images.length > 0 ? (
                <img
                  src={
                    formData.images[currentImageIndex]?.preview ||
                    "/placeholder.svg"
                  }
                  alt={formData.title || "Product image"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    console.error(
                      "Failed to load image:",
                      formData.images[currentImageIndex]?.preview
                    );
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <Tag size={40} className="text-gray-400" />
                </div>
              )}

              {/* Fallback div for when image fails to load */}
              <div
                className="bg-gray-200 w-full h-full flex items-center justify-center"
                style={{ display: "none" }}
              >
                <Tag size={40} className="text-gray-400" />
                <span className="text-gray-500 text-sm ml-2">
                  Image failed to load
                </span>
              </div>
            </div>
          </div>
          {/* Product Details Section */}
          <div className="w-full md:w-3/4 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold capitalize mb-2">
                    {formData.title}
                  </h1>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      formData.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-gray-600">
                  Product ID : {formData.id?.substring(0, 8)}
                </p>
              </div>
              {formData.is_active && (
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700">Add to listing</label>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                      addedToListing ? "bg-orange-500" : "bg-gray-300"
                    }`}
                    onClick={toggleAddToListing}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        addedToListing ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Price Section */}
              <div>
                <h3 className="text-gray-600 mb-1">Price</h3>
                <p className="text-2xl font-bold">
                  ${formatPrice(formData.price)}
                </p>
              </div>

              {/* Stock Section */}
              <div>
                <h3 className="text-gray-600 mb-1">Stock</h3>
                <p className="text-2xl font-bold">{formData.quantity}</p>
                <div className="flex items-center">
                  <span className={`${stockStatusClass} text-sm`}>
                    {stockStatus}
                  </span>
                </div>
              </div>

              {/* Condition Section */}
              <div>
                <h3 className="text-gray-600 mb-1">Condition</h3>
                <p className="text-2xl font-bold">{formData.condition}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Category Section */}
              <div>
                <h3 className="text-gray-600 mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {formData.category}
                  </span>
                  {formData.subtype && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {formData.subtype}
                    </span>
                  )}
                </div>
              </div>

              {/* Manufacturer Section */}
              <div>
                <h3 className="text-gray-600 mb-2">Manufacturer</h3>
                <p className="font-semibold">
                  {formData.specifications?.brand || "-"}
                </p>
              </div>
            </div>

            {/* Listing Status */}
            {formData.list_for_selling && (
              <div className="mt-4">
                <div className="inline-flex items-center bg-pink-100 text-pink-800 px-3 py-2 rounded-md">
                  <Clock size={16} className="mr-2" />
                  <span>Listing live for {daysRemaining()} more days</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="flex space-x-2 p-4 border-t border-gray-200">
          {formData.images &&
            formData.images.map((image, index) => (
              <div
                key={index}
                className={`w-16 h-16 border-2 ${
                  currentImageIndex === index
                    ? "border-orange-500"
                    : "border-gray-200"
                } cursor-pointer`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          <div
            className="w-16 h-16 border-2 border-gray-200 flex items-center justify-center cursor-pointer"
            onClick={handleDropZoneClick}
          >
            <span className="text-2xl text-gray-400">+</span>
          </div>
        </div>
      </div>
    );
  };

  const handleSpecsChange = (specsData) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        ...specsData,
      },
    }));
  };
  // Render specifications based on category
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
    <div className="w-full max-w-7xl mx-auto p-4">
      {loading && <CubeLoader />}
      <SellerHeader />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="text-sm text-gray-500 mb-6">
        <Link
          to="/seller/product-list"
          className=" hover:text-orange-500 transition-all ease-in-out  hover:ease-in-out duration-300"
        >
          <span>Product list /</span>{" "}
        </Link>
        <span className="text-orange-500">Edit product</span>
      </div>
      {/* Product Display Section */}
      {!loading && !error && <ProductCardComponent />}

      {/* Edit Button */}
      {!loading && !error && (
        <div className="flex justify-end  gap-5 mb-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 flex items-center bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <Check className="w-5 h-5 mr-2" />
            Save Changes
          </button>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            {isEditing ? "Cancel Editing" : "Edit Product"}
          </button>
        </div>
      )}

      {/* Edit Section */}
      {isEditing && !loading && !error && (
        <>
          {/* Tab Navigation */}
          <div className="flex  ">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-[#FCE1CD] bg-white text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            {formData.category === "Core Drill Bits" && (
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "retipping"
                    ? "border-b-2 border-[#FCE1CD] bg-white text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("retipping")}
              >
                Retipping
              </button>
            )}
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "media"
                  ? "border-b-2 border-[#FCE1CD] bg-white text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("media")}
            >
              Media
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - General Information */}
              <div>
                <div className="bg-white border border-gray-100 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h2>

                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Heavy Duty Hammer Drill"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
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
                      rows={4}
                      placeholder="Product description..."
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price ($)
                      </label>
                      <input
                        type="text"
                        id="price"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="899.00"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                        placeholder="0"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
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
                  <div className="mb-4">
                    <label
                      htmlFor="condition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Condition
                    </label>
                    <div className="relative">
                      <select
                        id="condition"
                        value={formData.condition}
                        onChange={(e) =>
                          handleInputChange("condition", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                      >
                        <option>New</option>
                        <option>Like New</option>
                        <option>Very Good (VG)</option>
                        <option>Good Condition (GC)</option>
                        <option>Fair Condition (FC)</option>
                        <option>Poor Condition (PC)</option>
                        <option>For Parts / Not Working</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Specifications */}
              <div className="bg-white border border-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Specifications</h2>
                {renderSpecsComponent()}
              </div>
            </div>
          )}

          {activeTab === "retipping" &&
            formData.category === "Core Drill Bits" && (
              <CoreBitRetippingComponent
                onChange={handleFormChange}
                formData={formData}
              />
            )}

          {activeTab === "media" && <MediaUploadComponent />}

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 flex items-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProduct;

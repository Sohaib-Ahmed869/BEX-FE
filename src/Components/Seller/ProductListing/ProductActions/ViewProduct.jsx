import { useState, useRef, useEffect } from "react";
import { Tag, Clock } from "lucide-react";
import SellerHeader from "../../sellerHeader/page";
import { getProductById } from "../../../../services/productsServices";
import { Link, useParams } from "react-router-dom";
import CubeLoader from "../../../../utils/cubeLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import MediaViewComponent from "./ViewProductComponents/viewProductImages";
import ProductInfoViewComponent from "./ViewProductComponents/viewProductDescription";
import ProductSpecifications from "./ViewProductComponents/viewProductSpecs";
import FlaggingDetails from "./ViewProductComponents/ViewFlaggingDetails";

const ViewProduct = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewing, setIsViewing] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [addedToListing, setAddedToListing] = useState(false);
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
    retippingDetails: {},
    list_for_selling: false,
    requires_retipping: false,
    is_featured: false,
    is_active: true,
    specs: {},
    flaggingDetails: {},
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
          condition: data.condition || "",
          location: data.location || "",
          weight: data.weight || "",
          length: data.length || "",
          width: data.width || "",
          height: data.height || "",
          images: data.images
            ? data.images.map((url, index) => ({
                preview: url,
                name: `Existing Image ${index + 1}`,
                isExisting: true,
                url,
              }))
            : [],
          retippingDetails: data.retippingDetails || {},
          list_for_selling: data.list_for_selling || false,
          requires_retipping: data.requires_retipping || false,
          is_featured: data.is_featured || false,
          is_active: data.is_active || true,
          specifications: data.specifications || {},
          is_flagged: data.is_flagged,
          expiration_date: data.expiration_date,
          created_at: data.created_at,
          updated_at: data.updated_at,
          flaggingDetails: data.flaggingDetails || {},
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

  // Handle dropzone click
  const handleDropZoneClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingFile) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleViewMode = () => {
    setIsViewing(!isViewing);
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
  const role = localStorage.getItem("role");

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {loading && <CubeLoader />}
      <SellerHeader />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="text-sm text-gray-500 mb-6">
        <Link
          to={role === "admin" ? "/admin/products" : "/product-list"}
          className=" hover:text-orange-500 transition-all ease-in-out duration-300 hover:ease-in-out"
        >
          <span>Product list /</span>{" "}
        </Link>
        <span className="text-orange-500">View product</span>
      </div>
      {/* Product Display Section */}
      {!loading && !error && <ProductCardComponent />}

      {/* Edit Button */}
      {!loading && !error && (
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleViewMode}
            className="px-4 py-2 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            {isViewing ? "Hide Details" : "View Product Details"}
          </button>
        </div>
      )}

      {/* View Section */}
      {isViewing && !loading && !error && (
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
            {formData.is_flagged && (
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "Flagging Details"
                    ? "border-b-2 border-[#FCE1CD] bg-white text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Flagging Details")}
              >
                Flagging Details
              </button>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === "details" && (
            <>
              <ProductInfoViewComponent formData={formData} />
              {/* Right Column - Specifications */}

              <ProductSpecifications
                specifications={formData?.specifications}
              />
            </>
          )}
          {activeTab === "Flagging Details" && (
            <FlaggingDetails flaggingDetails={formData.flaggingDetails} />
          )}
          {activeTab === "retipping" &&
            formData.category === "Core Drill Bits" && (
              <div className="bg-white shadow  mb-30 rounded-lg overflow-hidden">
                <div className="bg-white mt-4 px-4 py-3 border-b border-blue-100">
                  <h2 className="text-lg font-medium text-[#F47458]">
                    Retipping Information
                  </h2>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diameter */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Diameter</p>
                      <p className="text-lg font-medium">
                        {formData?.retippingDetails?.diameter}
                      </p>
                    </div>

                    {/* Segments */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">
                        Number of Segments
                      </p>
                      <p className="text-lg font-medium">
                        {formData?.retippingDetails?.segments}
                      </p>
                    </div>

                    {/* Total Price */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Total Price</p>
                      <p className="text-lg font-medium  text-blue-600">
                        ${formData?.retippingDetails?.total_price}
                      </p>
                    </div>
                  </div>

                  {/* DIY Option */}
                  <div className="mt-4 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full mr-2 ${
                          formData?.retippingDetails?.enable_diy
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <p className="font-medium">
                        {formData?.retippingDetails?.enable_diy
                          ? "DIY Available"
                          : "Professional Service Only"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData?.retippingDetails?.enable_diy
                        ? "This product is eligible for DIY retipping."
                        : "This product requires professional retipping service."}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {activeTab === "media" && <MediaViewComponent formData={formData} />}
        </>
      )}
    </div>
  );
};
export default ViewProduct;

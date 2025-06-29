import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { CiShoppingCart } from "react-icons/ci";

import {
  addRetipToCartItem,
  addToCart,
  removeRetipFromCartItem,
} from "../../../../store/cart-actions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../../store/wishlist-actions";
import BuyerHeader from "../../buyerHeader.jsx/buyerHeader";
import CubeLoader from "../../../../utils/cubeLoader";
import { getProductById } from "../../../../services/productsServices";
import RelatedProducts from "./relatedProductsGrid";
import ShoppingCart from "../../Cart/cart";
import WishlistModal from "../../wishlist/wishlistModal";
import { retipPricing } from "../../../../utils/retipPricingInformation";
import { ExternalLink, Navigation } from "lucide-react";
import { cartActions } from "../../../../store/cart-slice";
import { initiateChat } from "../../../../services/chatServices";

// Lazy Image Component
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-orange-500 animate-spin"></div>
        </div>
      )}

      {isInView && (
        <>
          {isError ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-3xl">📷</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </>
      )}
    </div>
  );
};

// Skeleton Components
const ImageSkeleton = () => (
  <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
);

const ThumbnailSkeleton = () => (
  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg"></div>
);

const ProductInfoSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="w-4 h-4 bg-gray-200 animate-pulse rounded"
        ></div>
      ))}
    </div>
    <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
    </div>
  </div>
);

const SpecificationsSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="flex justify-between items-center py-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

// Product Image Gallery Component
const ProductImageGallery = ({ product, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const images = product?.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsImageLoaded(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsImageLoaded(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <ImageSkeleton />
        <div className="flex space-x-3">
          {[1, 2, 3, 4].map((item) => (
            <ThumbnailSkeleton key={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slideInLeft">
      {/* Main Image */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-square relative">
          <LazyImage
            src={images[currentImageIndex] || "/api/placeholder/600/600"}
            alt={product?.title}
            className="w-full h-full"
          />

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {hasMultipleImages && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsImageLoaded(false);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-[#F47458] scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <LazyImage
                src={image}
                alt={`${product?.title} - ${index + 1}`}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Info Component

const ProductInfo = ({
  product,
  isLoading,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isAddingToCart,
  isAddingToWishlist,
}) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  // Get cart state from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const [isMessageLoading, setMessageIsLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Check if product is in cart and get cart item details
  const cartItem = cartItems.find((item) => item.product_id === product?.id);
  console.log("productid:", product?.id, "cartItems:", cartItems);
  console.log("Found cart item:", cartItem);

  const isInCart = !!cartItem;
  // Fix: Check for both possible property names from API response and Redux state
  const hasRetipAdded = cartItem?.retip_added || cartItem?.retipAdded || false;

  console.log(
    "hasRetipAdded:",
    hasRetipAdded,
    "cartItem retip_added:",
    cartItem?.retip_added,
    "cartItem retipAdded:",
    cartItem?.retipAdded
  );

  // Calculate retip price based on diameter using the retipPricing object
  const getRetipPriceByDiameter = () => {
    if (!product?.specifications?.bitDiameter) {
      // Fallback to 60% calculation if no diameter
      return parseFloat(product?.price || 0) * 0.6;
    }

    const diameter = parseFloat(product.specifications.bitDiameter);

    // Use the retipPricing object to get the exact price
    const retipPrice = retipPricing[diameter];

    return retipPrice;
  };

  // Handler for adding retipping service
  const handleAddRetipping = async () => {
    if (!cartItem) {
      console.error("Cannot add retipping: item not in cart");
      toast.error("Cannot add retipping: item not in cart");
      return;
    }

    const retipPrice = getRetipPriceByDiameter();
    const result = await dispatch(
      addRetipToCartItem(userId, cartItem.id, retipPrice)
    );

    if (result.success) {
      // toast.success(result.message);
    } else {
      // toast.error(result.message);
    }
  };

  const handleRemoveRetipping = async () => {
    if (!cartItem) {
      console.error("Cannot remove retipping: item not in cart");
      toast.error("Cannot remove retipping: item not in cart");
      return;
    }

    const result = await dispatch(removeRetipFromCartItem(userId, cartItem.id));

    if (result.success) {
      // toast.success(result.message);
    } else {
      // toast.error(result.message);
    }
  };
  const handleSendMessage = async () => {
    if (!userId || !product.id) {
      alert("User ID and Product ID are required");
      return;
    }

    setMessageIsLoading(true);
    try {
      await initiateChat(userId, product.id);
      // Navigation happens automatically in the service function
    } catch (error) {
      console.error("Failed to initiate chat:", error.message);
      alert(`Failed to start chat: ${error.message}`);
    } finally {
      setMessageIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <ProductInfoSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideInRight">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to={"/"} className=" hover:text-[#F47458]">
          Home
        </Link>{" "}
        /{" "}
        <Link to={"/products"} className=" hover:text-[#F47458]">
          Products
        </Link>{" "}
        / <span className="text-[#F47458]">{product?.category}</span>
      </nav>

      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product?.title}
          {product?.specifications?.bitDiameter &&
            ` - ${product.specifications.bitDiameter}" Diameter`}
        </h1>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">4.8 (52 reviews)</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            In Stock: {product?.quantity}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-100 capitalize text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {product?.condition}
          </span>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {product?.category}
          </span>
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Verified ✓
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product?.price || 0)}
            </span>
            <span className="text-gray-500 ml-2">
              *Price includes standard shipping
            </span>
          </div>
        </div>

        {/* Retipping Service */}
        {product?.category === "Core Drill Bits" &&
          product?.requires_retipping && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Wrench className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-900 mb-2">
                    Retipping Service Available
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    Save money and extend your tool's life! Our professional
                    retipping service comes with a 6-month warranty.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-orange-900">
                        Total retipping price:{" "}
                        {formatPrice(getRetipPriceByDiameter())}
                      </span>
                      {product?.specifications?.bitDiameter && (
                        <div className="text-sm text-orange-600 mt-1">
                          For {product.specifications.bitDiameter}" diameter bit
                        </div>
                      )}
                      {hasRetipAdded && isInCart && (
                        <div className="text-sm text-green-600 mt-1">
                          ✓ Retipping service added to cart
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-3">
                    {/* Conditional retipping button based on cart status */}
                    {isInCart ? (
                      hasRetipAdded ? (
                        <button
                          onClick={handleRemoveRetipping}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Remove Retipping Service
                        </button>
                      ) : (
                        <button
                          onClick={handleAddRetipping}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                        >
                          Add Retipping Service
                        </button>
                      )
                    ) : (
                      <div className="text-sm text-orange-600 bg-orange-100 px-4 py-2 rounded-lg">
                        Add item to cart first to enable retipping service
                      </div>
                    )}
                    <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                      Buy DIY Segments
                    </button>
                  </div>
                  <p className="text-xs text-orange-600 mt-2">
                    Save $
                    {(
                      parseFloat(product?.price || 0) -
                      getRetipPriceByDiameter()
                    ).toFixed(2)}{" "}
                    compared to buying a new bit
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onAddToCart}
            disabled={product?.quantity === 0 || isAddingToCart}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              product?.quantity === 0 || isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#F47458] text-white hover:bg-[#e06449] hover:shadow-lg transform hover:scale-105 active:scale-95"
            }`}
          >
            <CiShoppingCart
              size={20}
              className={isAddingToCart ? "animate-pulse" : ""}
            />
            <span>
              {product?.quantity === 0
                ? "Sold Out"
                : isAddingToCart
                ? "Adding..."
                : isInCart
                ? "Update Cart"
                : "Add to Cart"}
            </span>
          </button>

          <button
            onClick={onToggleWishlist}
            disabled={isAddingToWishlist}
            className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
              isWishlisted
                ? "border-[#F47458] bg-[#F47458] text-white"
                : "border-gray-300 text-gray-600 hover:border-[#F47458] hover:text-[#F47458]"
            }`}
          >
            <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      {/* Chat with Seller */}
      <div className="border px-3 sm:px-4 md:px-6 border-gray-200 rounded-lg py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium my-2 text-base sm:text-lg text-gray-900">
              Chat with Seller
            </h3>
            <button
              onClick={handleSendMessage}
              disabled={isMessageLoading}
              className="w-full sm:max-w-full bg-white p-2 sm:p-3 rounded-2xl border border-[#F47458] text-[#F47458] hover:bg-[#F47458] hover:text-white hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isMessageLoading ? "Starting Chat..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Details Tabs Component
const ProductDetailsTabs = ({ product, isLoading }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <div className="flex space-x-6 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="h-8 w-24 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
        <SpecificationsSkeleton />
      </div>
    );
  }

  return (
    <div className="animate-slideInUp">
      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-[#F47458] text-[#F47458]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product?.description ||
                "High-performance diamond core bit designed for professional drilling in reinforced concrete, masonry, and other hard materials. Features premium diamond segments for faster and longer life."}
            </p>

            {product?.category === "Core Drill Bits" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      Premium diamond segments for optimal cutting performance
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Reinforced barrel for increased durability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Laser-welded segments for maximum reliability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>
                      Compatible with all standard core drilling machines
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Optimized water channels for efficient cooling</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product?.specifications &&
              Object.entries(product.specifications).map(([key, value]) => {
                if (!value || value === "" || value === null) return null;

                const formattedKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                // Special handling for features array
                if (key === "features" && Array.isArray(value)) {
                  return (
                    <div
                      key={key}
                      className="md:col-span-2 py-3 border-b border-gray-100"
                    >
                      <span className="font-medium text-gray-700 block mb-3">
                        {formattedKey}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {value.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-[#f47458] rounded-full mr-3 flex-shrink-0"></span>
                            <span className="text-gray-900">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-700">
                      {formattedKey}
                    </span>
                    <span className="text-gray-900">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : value}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Location Component

const LocationSection = ({ product, isLoading }) => {
  // Utah location coordinates (Salt Lake City as example)
  const utahLocation = {
    lat: 40.7608,
    lng: -111.891,
    address: "Salt Lake City, UT, USA",
    placeName: "Salt Lake City, Utah",
  };

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    const { lat, lng } = utahLocation;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-111.8910!3d40.7608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87523d9488d131ed%3A0x5b53b7a0484d31ca!2sSalt%20Lake%20City%2C%20UT%2C%20USA!5e0!3m2!1sen!2sus!4v1642694200000!5m2!1sen!2sus`;
  };

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    const { lat, lng } = utahLocation;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // Generate Google Maps view URL
  const getViewOnMapUrl = () => {
    const { lat, lng } = utahLocation;
    return `https://www.google.com/maps/@${lat},${lng},15z`;
  };

  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideInUp">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-[#F47458]" />
        Location
      </h2>

      {/* Google Maps Embed */}
      <div className="relative rounded-lg overflow-hidden h-80 bg-gray-100">
        <iframe
          src={getMapEmbedUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className="absolute inset-0"
        ></iframe>

        {/* Overlay for loading state */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Click and drag to explore • Use mouse wheel to zoom</p>
      </div>
    </div>
  );
};

// Main Product Details Page Component
const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  // Simulate loading state and product data
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const userId = localStorage.getItem("userId");
  const wishlistItems = useSelector((state) => state.wishlist.items);
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !product.id) return;

      // Check if product is in wishlist by looking through wishlist items
      const inWishlist = wishlistItems.some(
        (item) => item.product_id === productId
      );
      setIsWishlisted(inWishlist);

      // Alternative: Check with API if you need server verification
      try {
        // You can use this approach if you want to verify with the server
        const response = await dispatch(
          checkWishlistItem(userId, productId)
        ).unwrap();
        setIsWishlisted(response.inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [userId, productId, wishlistItems, dispatch]);

  const toggleCart = () => {
    setShowCart(!showCart);
  };
  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };
  // Simulate product fetch
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      // Your actual product fetch logic will go here
      try {
        const response = await getProductById(productId);

        if (response.success) {
          const data = response.data;
          console.log("Product data:", data);
          setProduct(data);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch product:", response.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = (e) => {
    e?.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (product.quantity <= 0) {
      return;
    }

    setIsAddingToCart(true);

    const productData = {
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      category: product.category,
      diameter:
        product.category === "Core Drill Bits"
          ? product.specifications?.bitDiameter
          : null,
    };

    dispatch(addToCart(userId, productData, 1))
      .then(() => {
        toast.success(`${product.title} added to cart`);
        setIsAddingToCart(false);
      })
      .catch((error) => {
        toast.error(`Failed to add to cart: ${error.message}`);
        setIsAddingToCart(false);
      });
  };

  const handleToggleWishlist = async (e) => {
    e?.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isWishlisted) {
        const wishlistItem = wishlistItems.find(
          (item) => item.product_id === product.id
        );
        if (wishlistItem) {
          await dispatch(removeFromWishlist(userId, wishlistItem.id));
          toast.success(`${product.title} removed from wishlist`);
          setIsWishlisted(false);
        }
      } else {
        const productData = {
          id: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          diameter:
            product.category === "Core Drill Bits"
              ? product.specifications?.bitDiameter
              : null,
          brand: product.specifications?.brand,
          images: product.images,
        };

        await dispatch(addToWishlist(userId, productData));
        toast.success(`${product.title} added to wishlist`);
        setIsWishlisted(true);
      }
    } catch (error) {
      toast.error(`Failed to update wishlist: ${error.message}`);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <>
      <BuyerHeader toggleCart={toggleCart} toggleWishlist={toggleWishlist} />

      <ShoppingCart isOpen={showCart} setIsOpen={setShowCart} />
      <WishlistModal isOpen={showWishlist} setIsOpen={setShowWishlist} />
      {isLoading && <CubeLoader />}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <ProductImageGallery product={product} isLoading={isLoading} />

            {/* Product Info */}
            <ProductInfo
              product={product}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
              isAddingToCart={isAddingToCart}
              isAddingToWishlist={isAddingToWishlist}
            />
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <ProductDetailsTabs product={product} isLoading={isLoading} />
          </div>

          {/* Location Section */}
          <LocationSection product={product} isLoading={isLoading} />

          {/* Related Products */}
          <RelatedProducts currentProduct={product} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;

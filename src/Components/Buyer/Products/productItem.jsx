import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import { addToCart } from "../../../store/cart-actions";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlistItem,
} from "../../../store/wishlist-actions";
import { Link } from "react-router-dom";
import { retipPricing } from "../../../utils/retipPricingInformation";

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
      {/* Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-orange-500 animate-spin"></div>
        </div>
      )}

      {/* Image */}
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

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // Get wishlist items from Redux store to check if product is already in wishlist
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Check if product is in wishlist when component mounts or wishlist changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !product.id) return;

      // Check if product is in wishlist by looking through wishlist items
      const inWishlist = wishlistItems.some(
        (item) => item.product_id === product.id
      );
      setIsWishlisted(inWishlist);

      // Alternative: Check with API if you need server verification
      try {
        // You can use this approach if you want to verify with the server
        const response = await dispatch(
          checkWishlistItem(userId, product.id)
        ).unwrap();
        setIsWishlisted(response.inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [userId, product.id, wishlistItems, dispatch]);

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getRetipPrice = () => {
    if (product.requires_retipping) {
      const bitDiameter = parseFloat(product.specifications?.bitDiameter);

      // Check if we have a retipping price for this diameter
      if (bitDiameter && retipPricing[bitDiameter]) {
        return formatPrice(retipPricing[bitDiameter]);
      }

      // Fallback to original 60% calculation if diameter not found in pricing table
      return formatPrice(parseFloat(product.price) * 0.6);
    }
    return null;
  };
  const hasMultipleImages = product.images && product.images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isWishlisted) {
        // Find the wishlist item ID from the product ID
        const wishlistItem = wishlistItems.find(
          (item) => item.product_id === product.id
        );

        if (wishlistItem) {
          // Remove from wishlist
          await dispatch(removeFromWishlist(userId, wishlistItem.id));
          toast.success(`${product.title} removed from wishlist`);
          setIsWishlisted(false);
        }
      } else {
        // Extract product data for wishlist
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

        // Add to wishlist
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

  // Handle adding product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!userId) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (product.quantity <= 0) {
      return; // Don't allow adding out-of-stock items
    }

    setIsAddingToCart(true);

    // Extract only the necessary product data for the cart
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
      // Only include other fields if they're specifically needed by the backend
    };

    // Dispatch addToCart action with userId, productData, and quantity
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
  const currentImage =
    product.images && product.images.length > 0
      ? product.images[currentImageIndex]
      : "/api/placeholder/400/400";

  return (
    <div className="bg-white rounded-xl cursor-pointer shadow-sm border border-gray-200 overflow-hidden w-full sm:w-72 md:w-80 lg:w-96 block group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {" "}
      <div
        className="relative aspect-square overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LazyImage
          src={currentImage}
          alt={product.title}
          className="w-full h-full"
        />

        {/* Image navigation buttons */}
        {hasMultipleImages && isHovered && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Top badges - condition left, category right */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span
            className={`bg-[#D1FAE5] text-[#047857] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm capitalize`}
          >
            {product.condition.split(" (")[0] || product.condition}
          </span>
          <span className="bg-[#E4E4E7] text-gray-900 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        {/* Bottom left - verified badge */}
        {product.is_verified && (
          <div className="absolute bottom-3 left-3">
            <span className=" text-[#F47458] border-1 border-[#F47458] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center shadow-sm backdrop-blur-sm">
              Verified ✓
            </span>
          </div>
        )}
        {product.is_featured && (
          <div className="absolute bottom-3 right-3">
            <span className=" text-[#F47458] border-1 border-[#F47458] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center shadow-sm backdrop-blur-sm">
              <Star size={16} className="mr-1" /> Featured
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon - Top Right */}
        <button
          onClick={toggleWishlist}
          disabled={isAddingToWishlist}
          className={`absolute top-12 right-3 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 ${
            isAddingToWishlist ? "animate-pulse" : ""
          }`}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isWishlisted ? "fill-[#F47458] text-[#F47458]" : "text-gray-500"
            }`}
          />
        </button>
      </div>
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-gray-900 font-semibold text-lg mb-3 line-clamp-2 group-hover:text-[#e06449] transition-colors duration-300">
          {product.title}
          {product.specifications?.bitDiameter &&
            ` - ${product.specifications.bitDiameter}" Diameter`}
        </h3>

        {/* Specifications - Better UI */}
        <div className="mb-4 flex flex-wrap gap-2">
          {product.specifications?.brand && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {product.specifications.brand}
            </span>
          )}
          {product.specifications?.segmentType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {product.specifications.segmentType}
            </span>
          )}
          {product.location && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              📍 {product.location}
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
              {formatPrice(product.price)}
            </span>
          </div>

          {product?.category === "Core Drill Bits" && getRetipPrice() && (
            <div className="flex items-center text-[#e06449]">
              <span className="text-xs font-medium mr-1 sm:text-sm">
                Retip:
              </span>
              <span className="text-sm font-semibold sm:text-base">
                {getRetipPrice()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 border block text-center border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95"
          >
            Details
          </Link>
          <button
            disabled={product.quantity === 0 || isAddingToCart}
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 block px-4 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
              product.quantity === 0 || isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#F47458] text-white hover:bg-[#e06449] hover:shadow-md"
            }`}
          >
            <ShoppingCart
              size={16}
              className={isAddingToCart ? "animate-pulse" : ""}
            />
            {product.quantity === 0
              ? "Sold Out"
              : isAddingToCart
              ? "Adding..."
              : "Add"}
          </button>
        </div>

        {/* Stock info */}
        {product.quantity > 0 && (
          <div className="mt-2 text-center">
            <span className="text-green-600 text-xs font-medium">
              {product.quantity} {product.quantity === 1 ? "unit" : "units"}{" "}
              available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;

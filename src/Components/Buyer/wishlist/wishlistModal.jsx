import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Heart, ShoppingCart, Check } from "lucide-react";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../../store/wishlist-actions";
import { addToCart } from "../../../store/cart-actions";

export default function WishlistModal({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const [animatingItemId, setAnimatingItemId] = useState(null);

  // Get wishlist data from Redux store
  const { items, totalItems, loading, error } = useSelector(
    (state) => state.wishlist
  );

  // Get cart items from Redux store to check if wishlist items are in cart
  const cartItems = useSelector((state) => state.cart.items);

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // Fetch wishlist data on component mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  // Function to check if item is in cart
  const isItemInCart = (productId) => {
    return cartItems?.some((item) => item.product_id === productId);
  };

  const handleRemoveItem = (itemId) => {
    // Add animation
    setAnimatingItemId(itemId);
    setTimeout(() => {
      dispatch(removeFromWishlist(userId, itemId));
      setAnimatingItemId(null);
    }, 300);
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist(userId));
  };

  const handleAddToCart = (item) => {
    // Don't add if already in cart
    if (isItemInCart(item.product_id)) {
      return;
    }

    // Create product data object from item
    const productData = {
      id: item.product_id,
      title: item.title,
      price: item.price,
      category: item.category,
      images: item.image_link ? [item.image_link] : [],
    };

    // Dispatch add to cart action
    dispatch(addToCart(userId, productData, 1));

    // Add animation
    setAnimatingItemId(item.id);
    setTimeout(() => setAnimatingItemId(null), 300);
  };

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      const wishlistElement = document.getElementById("wishlist-modal");
      if (
        isOpen &&
        wishlistElement &&
        !wishlistElement.contains(e.target) &&
        !e.target.closest("[data-wishlist-trigger]")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 px-5 backdrop-blur-xs bg-opacity-40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Wishlist Modal */}
      <div
        id="wishlist-modal"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-1/4 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-spin mb-2 mx-auto">
                <Heart size={24} />
              </div>
              Loading your wishlist...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              {error}.{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => dispatch(fetchWishlist(userId))}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                You have {totalItems} item{totalItems !== 1 ? "s" : ""} in your
                wishlist
              </p>

              <div className="space-y-3">
                {items &&
                  items.length > 0 &&
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-3 border border-gray-200 rounded-lg bg-white transition-all duration-300 ${
                        animatingItemId === item.id ? "bg-orange-50" : ""
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded mr-3 overflow-hidden">
                        <img
                          src={item.image_link || "/api/placeholder/100/100"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-gray-700">${item.price}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        {item.brand && (
                          <p className="text-xs text-gray-500">{item.brand}</p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <X size={16} />
                        </button>

                        {/* Cart button that shows different states */}
                        {isItemInCart(item.product_id) ? (
                          <div className="flex items-center text-green-500 text-xs font-medium">
                            <Check size={14} className="mr-1" />
                            <span>Added to cart</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors text-xs"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart size={14} className="mr-1" />
                            <span>Add to cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {(!items || items.length === 0) && (
                <div className="text-center py-16 text-gray-500">
                  Your wishlist is empty
                </div>
              )}
            </>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <button
                onClick={handleClearWishlist}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
              >
                Clear wishlist
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

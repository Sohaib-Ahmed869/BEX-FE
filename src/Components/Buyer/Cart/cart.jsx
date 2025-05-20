import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart as CartIcon,
} from "lucide-react";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../../store/cart-actions";

export default function ShoppingCart({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const [animatingItemId, setAnimatingItemId] = useState(null);

  // Get cart data from Redux store
  const { items, totalQuantity, totalPrice, loading, error } = useSelector(
    (state) => state.cart
  );

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // Fetch cart data on component mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;

    const itemId = item.id;
    const currentQuantity = item.quantity;

    if (newQuantity > currentQuantity) {
      // Add items
      const quantityToAdd = newQuantity - currentQuantity;
      // Create product data object from item
      const productData = {
        id: item.product_id,
        title: item.title,
        price: item.price,
        images: item.image_link ? [item.image_link] : [],
      };

      dispatch(addToCart(userId, productData, quantityToAdd));
    } else if (newQuantity < currentQuantity) {
      if (newQuantity === 0) {
        // If new quantity would be zero, remove the item completely
        handleRemoveItem(itemId);
      } else {
        // Otherwise, just decrease the quantity by 1
        console.log(
          `Removing 1 from item ${itemId}, current quantity: ${currentQuantity}, new quantity: ${newQuantity}`
        );
        dispatch(removeFromCart(userId, itemId, 1)); // Only remove 1 at a time
      }
    }

    // Add animation
    setAnimatingItemId(itemId);
    setTimeout(() => setAnimatingItemId(null), 300);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(userId, itemId, Number.MAX_SAFE_INTEGER)); // Remove all quantity
  };

  const handleClearCart = () => {
    dispatch(clearCart(userId));
  };

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      const cartElement = document.getElementById("shopping-cart-modal");
      if (
        isOpen &&
        cartElement &&
        !cartElement.contains(e.target) &&
        !e.target.closest("[data-cart-trigger]")
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

      {/* Shopping Cart Modal */}
      <div
        id="shopping-cart-modal"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-1/4 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shopping cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-spin mb-2 mx-auto">
                <CartIcon size={24} />
              </div>
              Loading your cart...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              {error}.{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => dispatch(fetchCart(userId))}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                You have {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} in
                your cart
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
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-gray-600 mr-2 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>

                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity - 1)
                            }
                            className="px-2 py-1 text-orange-500 transition-colors hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity + 1)
                            }
                            className="px-2 py-1 text-orange-500 transition-colors hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {(!items || items.length === 0) && (
                <div className="text-center py-16 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${totalPrice}</span>
            </div>
            <div className="space-y-2">
              <button className="w-full py-3 bg-[#e06449] hover:bg-[#c9583e] text-white font-medium rounded transition-colors">
                Proceed to checkout
              </button>
              {items.length > 1 && (
                <button
                  onClick={handleClearCart}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                >
                  Clear cart
                </button>
              )}
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

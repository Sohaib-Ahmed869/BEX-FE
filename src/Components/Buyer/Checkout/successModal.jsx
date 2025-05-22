import { useState, useEffect } from "react";
import { Check, Star, Sparkles } from "lucide-react";

const OrderSuccessModal = ({ isOpen, onClose, orderId }) => {
  const [showContent, setShowContent] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Stagger the animations
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowCheckmark(true), 600);
    } else {
      setShowContent(false);
      setShowCheckmark(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrackOrder = () => {
    // Replace with your tracking page route
    window.location.href = "/order-tracking";
  };

  const handleShopMore = () => {
    // Replace with your products page route
    window.location.href = "/products";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs  flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Animated sparkles background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${
                i % 3 === 0
                  ? "text-yellow-400"
                  : i % 3 === 1
                  ? "text-pink-400"
                  : "text-blue-400"
              } animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles size={8} />
            </div>
          ))}
        </div>

        {/* Success circle with animated checkmark */}
        <div className="relative mb-6">
          <div
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#e06449] to-[#c9583e] flex items-center justify-center transform transition-all duration-700 ${
              showCheckmark ? "scale-100 rotate-0" : "scale-0 rotate-180"
            }`}
          >
            <Check
              size={40}
              className={`text-white transition-all duration-500 ${
                showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
              style={{
                animation: showCheckmark
                  ? "checkmark 0.6s ease-in-out"
                  : "none",
              }}
            />
          </div>

          {/* Pulsing ring effect */}
          <div
            className={`absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-[#e06449] transition-all duration-1000 ${
              showCheckmark ? "scale-150 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{
              animation: showCheckmark
                ? "pulse-ring 1.5s ease-out infinite"
                : "none",
            }}
          />
        </div>

        {/* Success content */}
        <div
          className={`transform transition-all duration-500 delay-300 ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order successful!
          </h2>

          <p className="text-gray-600 mb-2">
            Your order has been received and is now being processed.
          </p>

          <p className="text-sm text-gray-500 mb-6">Order #{orderId}</p>

          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            You can track the order status in real-time, view shipping updates,
            and manage any related actions from your Order Tracking Dashboard.
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTrackOrder}
              className="w-full bg-[#e06449] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#c9583e] transition-colors duration-200 transform hover:scale-105"
            >
              Track order
            </button>

            <button
              onClick={handleShopMore}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Shop more
            </button>
          </div>
        </div>

        {/* Close button */}
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
export default OrderSuccessModal;

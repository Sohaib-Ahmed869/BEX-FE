"use client";
import { motion } from "framer-motion";

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Welcome!</h2>
        <p className="text-white text-center mb-6">
          How would you like to register?
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect("buyer")}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#F47458] hover:bg-[#F47458] hover:text-white transition-all duration-200 text-left"
          >
            <div className="font-semibold">Register as Buyer</div>
            <div className="text-sm text-gray-500 hover:text-white">
              Browse and purchase products
            </div>
          </button>

          <button
            onClick={() => onRoleSelect("seller")}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#F47458] hover:bg-[#F47458] hover:text-white transition-all duration-200 text-left"
          >
            <div className="font-semibold">Register as Seller</div>
            <div className="text-sm text-white hover:text-white">
              Sell your products online
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default RoleSelectionModal;

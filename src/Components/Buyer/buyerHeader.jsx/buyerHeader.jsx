import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ChevronDown, User } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
export default function BuyerHeader({ toggleCart, toggleWishlist }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.productsCount);
  const wishlistCount = useSelector((state) => state.wishlist.totalItems);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("jwtToken");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 1000);
  };
  // Animation for page load
  useEffect(() => {
    // Simulate adding to wishlist after 2 seconds
    const timer = setTimeout(() => {}, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white shadow-lg w-full rounded-b-4xl">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <motion.div
        className="w-11/12 mx-auto px-4 py-3 flex items-center justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          {/* <span className="text-xl font-bold"> */}
          <img src={logo} alt="Logo" />
          {/* </span> */}
        </motion.div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-6">
          {/* Wishlist */}
          <motion.div
            className="relative flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWishlist(true)}
          >
            <Heart size={20} className="text-gray-700" />
            <span className="ml-5 text-sm">Wishlist</span>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.div
                  className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {wishlistCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Cart */}
          <motion.div
            className="relative flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart(true)}
          >
            <ShoppingCart size={20} className="text-gray-700" />
            <motion.span
              className="ml-5 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              My cart
            </motion.span>
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {cartCount}
              </motion.div>
            )}
          </motion.div>

          {/* User profile */}
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center">
              <motion.div
                className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                whileHover={{ backgroundColor: "#e5e7eb" }}
              >
                <User size={18} className="text-gray-600" />
              </motion.div>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="ml-1 text-gray-600" />
              </motion.div>
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2  block w-full text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </div>
                  <div className="px-4 py-2 block w-full text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

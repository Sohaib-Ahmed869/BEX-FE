// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Heart,
//   ShoppingCart,
//   ChevronDown,
//   User,
//   Menu,
//   X,
//   MessageCircle,
//   MessageCircleHeart,
//   Bell,
// } from "lucide-react";
// import logo from "../../../assets/logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { Bounce, toast, ToastContainer } from "react-toastify";
// import { useSelector } from "react-redux";

// export default function BuyerHeader({ toggleCart, toggleWishlist }) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const unreadMessages = useSelector(
//     (state) => state.unreadMessages.totalUnreadCount
//   );
//   const cartCount = useSelector((state) => state.cart.productsCount);
//   const wishlistCount = useSelector((state) => state.wishlist.totalItems);
//   const role = localStorage.getItem("role");
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userName");
//     sessionStorage.removeItem("jwtToken");
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isMobileMenuOpen]);

//   // Animation for page load
//   useEffect(() => {
//     const timer = setTimeout(() => {}, 2000);
//     return () => clearTimeout(timer);
//   }, []);
//   const userName = localStorage.getItem("userName");
//   return (
//     <div className="bg-white shadow-lg w-full rounded-b-4xl relative">
//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         transition={Bounce}
//         newestOnTop={true}
//       />
//       <motion.div
//         className="w-11/12 mx-auto px-2 sm:px-4 py-3 flex items-center justify-between"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Logo */}
//         <motion.div
//           className="flex items-center flex-shrink-0"
//           whileHover={{ scale: 1.05 }}
//         >
//           <Link to="/products">
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-8 sm:h-10 md:h-12 w-auto object-contain"
//             />
//           </Link>
//         </motion.div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-6">
//           {/* Wishlist */}
//           <motion.div
//             className="relative flex items-center cursor-pointer"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => toggleWishlist(true)}
//           >
//             <Heart size={20} className="text-gray-700" />
//             <span className="ml-5 text-sm">Wishlist</span>
//             <AnimatePresence>
//               <motion.div
//                 className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 0 }}
//               >
//                 {wishlistCount || "0"}
//               </motion.div>
//             </AnimatePresence>
//           </motion.div>

//           {/* Cart */}
//           <motion.div
//             className="relative flex items-center cursor-pointer"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => toggleCart(true)}
//           >
//             <ShoppingCart size={20} className="  text-gray-700" />
//             <motion.span
//               className="ml-5 text-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               My cart
//             </motion.span>

//             <motion.div
//               className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 500 }}
//             >
//               {cartCount || "0"}
//             </motion.div>
//           </motion.div>
//           <motion.div
//             className="relative flex items-center cursor-pointer"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => toggleCart(true)}
//           >
//             <Link to="/user/chats">
//               <Bell size={20} className=" mr-4  text-gray-700" />

//               <motion.div
//                 className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 500 }}
//               >
//                 {unreadMessages || "0"}
//               </motion.div>
//             </Link>
//           </motion.div>

//           {/* User profile */}
//           <motion.div
//             className="relative cursor-pointer"
//             whileHover={{ scale: 1.05 }}
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           >
//             <div className="flex items-center">
//               <motion.div
//                 onClick={() => navigate("/profile")}
//                 className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
//                 whileHover={{ backgroundColor: "#e5e7eb" }}
//               >
//                 <User size={18} className="text-gray-600" />
//               </motion.div>
//               <motion.div
//                 animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ChevronDown size={16} className="ml-1 text-gray-600" />
//               </motion.div>
//             </div>

//             <AnimatePresence>
//               {isDropdownOpen && (
//                 <motion.div
//                   className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <button
//                     onClick={() => navigate("/profile")}
//                     className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                   >
//                     Profile
//                   </button>
//                   {role === "seller" && (
//                     <button
//                       onClick={() => navigate("/seller/dashboard")}
//                       className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     >
//                       Seller Dashboard
//                     </button>
//                   )}
//                   {role === "admin" && (
//                     <button
//                       onClick={() => navigate("/admin/dashboard")}
//                       className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     >
//                       Admin Dashboard
//                     </button>
//                   )}

//                   <Link
//                     className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     to="/myorders"
//                   >
//                     My Orders
//                   </Link>
//                   <Link
//                     className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     to="/user/chats"
//                   >
//                     Chats
//                   </Link>
//                   <Link
//                     className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                     to="/orderDisputes"
//                   >
//                     Order Disputes
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
//                   >
//                     Sign out
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Mobile Navigation Icons */}
//         <div className="flex md:hidden items-center space-x-3">
//           {/* Mobile Wishlist */}
//           <motion.div
//             className="relative cursor-pointer p-2"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => toggleWishlist(true)}
//           >
//             <Heart size={20} className="text-gray-700" />
//             <AnimatePresence>
//               {wishlistCount > 0 && (
//                 <motion.div
//                   className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0 }}
//                 >
//                   {wishlistCount}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Mobile Cart */}
//           <motion.div
//             className="relative cursor-pointer p-2"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => toggleCart(true)}
//           >
//             <ShoppingCart size={20} className="text-gray-700" />
//             {cartCount > 0 && (
//               <motion.div
//                 className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 500 }}
//               >
//                 {cartCount}
//               </motion.div>
//             )}
//           </motion.div>

//           {/* Mobile Notifications */}
//           <motion.div
//             className="relative cursor-pointer p-2"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Link to="/user/chats">
//               <Bell size={20} className="text-gray-700" />
//               {unreadMessages > 0 && (
//                 <motion.div
//                   className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 500 }}
//                 >
//                   {unreadMessages}
//                 </motion.div>
//               )}
//             </Link>
//           </motion.div>

//           {/* Mobile Menu Button */}
//           <motion.button
//             className="p-2 cursor-pointer mobile-menu-container"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             <AnimatePresence>
//               {isMobileMenuOpen ? (
//                 <motion.div
//                   key="close"
//                   initial={{ opacity: 0, rotate: -90 }}
//                   animate={{ opacity: 1, rotate: 0 }}
//                   exit={{ opacity: 0, rotate: 90 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <X size={20} className="text-gray-700" />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="menu"
//                   initial={{ opacity: 0, rotate: 90 }}
//                   animate={{ opacity: 1, rotate: 0 }}
//                   exit={{ opacity: 0, rotate: -90 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Menu size={20} className="text-gray-700" />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Mobile Menu Dropdown */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-30 mobile-menu-container"
//             initial={{ opacity: 0, y: -10, height: 0 }}
//             animate={{ opacity: 1, y: 0, height: "auto" }}
//             exit={{ opacity: 0, y: -10, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="px-4 py-3 border-t border-gray-100">
//               {/* Mobile User Section */}
//               <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
//                   <User size={20} className="text-gray-600" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">
//                     {userName || "User"}
//                   </div>
//                   <div className="text-xs text-gray-500">Welcome back!</div>
//                 </div>
//               </div>

//               {/* Mobile Menu Items */}
//               <motion.div className="space-y-1">
//                 <motion.button
//                   onClick={() => {
//                     navigate("/profile");
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
//                   whileHover={{ backgroundColor: "#f9fafb" }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <span className="text-sm text-gray-700">Profile</span>
//                   <ChevronDown size={16} className="text-gray-400 rotate-270" />
//                 </motion.button>

//                 {role === "seller" && (
//                   <motion.button
//                     onClick={() => {
//                       navigate("/seller/dashboard");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
//                     whileHover={{ backgroundColor: "#f9fafb" }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <span className="text-sm text-gray-700">
//                       Seller Dashboard
//                     </span>
//                     <ChevronDown
//                       size={16}
//                       className="text-gray-400 rotate-270"
//                     />
//                   </motion.button>
//                 )}

//                 {role === "admin" && (
//                   <motion.button
//                     onClick={() => {
//                       navigate("/admin/dashboard");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
//                     whileHover={{ backgroundColor: "#f9fafb" }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <span className="text-sm text-gray-700">
//                       Admin Dashboard
//                     </span>
//                     <ChevronDown
//                       size={16}
//                       className="text-gray-400 rotate-270"
//                     />
//                   </motion.button>
//                 )}

//                 <motion.div
//                   className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
//                   whileHover={{ backgroundColor: "#f9fafb" }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     navigate("/myorders");
//                     setIsMobileMenuOpen(false);
//                   }}
//                 >
//                   <span className="text-sm text-gray-700">My Orders</span>
//                   <ChevronDown size={16} className="text-gray-400 rotate-270" />
//                 </motion.div>

//                 <motion.div
//                   className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
//                   whileHover={{ backgroundColor: "#f9fafb" }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     navigate("/user/chats");
//                     setIsMobileMenuOpen(false);
//                   }}
//                 >
//                   <span className="text-sm text-gray-700">Chats</span>
//                   <ChevronDown size={16} className="text-gray-400 rotate-270" />
//                 </motion.div>

//                 <motion.button
//                   onClick={() => {
//                     handleLogout();
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-red-50 cursor-pointer"
//                   whileHover={{ backgroundColor: "#fef2f2" }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <span className="text-sm text-red-600">Sign out</span>
//                   <ChevronDown size={16} className="text-red-400 rotate-270" />
//                 </motion.button>
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  User,
  Menu,
  X,
  MessageCircle,
  MessageCircleHeart,
  Bell,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

export default function BuyerHeader({ toggleCart, toggleWishlist }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadMessages = useSelector(
    (state) => state.unreadMessages.totalUnreadCount
  );
  const cartCount = useSelector((state) => state.cart.productsCount);
  const wishlistCount = useSelector((state) => state.wishlist.totalItems);
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  // Determine if user is on seller side based on current path
  const isSellerSide = location.pathname.startsWith("/seller");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("jwtToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Handle toggle between buyer and seller modes
  const handleToggle = () => {
    if (isSellerSide) {
      // Switch to buyer side
      navigate("/products");
    } else {
      // Switch to seller side
      if (role !== "seller") {
        toast.error("Become a seller first!", {
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        navigate("/seller/dashboard");
      }
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Animation for page load
  useEffect(() => {
    const timer = setTimeout(() => {}, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white shadow-lg w-full rounded-b-4xl relative">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      <motion.div
        className="w-11/12 mx-auto px-2 sm:px-4 py-3 flex items-center justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/products">
            <img
              src={logo}
              alt="Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </motion.div>
        {/* Desktop Navigation */}

        <div className="hidden md:flex items-center space-x-6">
          {/* Toggle Switch - Centered */}
          {role !== "admin" && (
            <motion.div
              className="flex items-center bg-gray-100 rounded-full p-1 mx-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isSellerSide
                    ? "bg-white text-[#e06449] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buyer
              </motion.button>
              <motion.button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSellerSide
                    ? "bg-white text-[#e06449] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Seller
              </motion.button>
            </motion.div>
          )}

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
              <motion.div
                className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {wishlistCount || "0"}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Cart */}
          <motion.div
            className="relative flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart(true)}
          >
            <ShoppingCart size={20} className="  text-gray-700" />
            <motion.span
              className="ml-5 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              My cart
            </motion.span>

            <motion.div
              className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {cartCount || "0"}
            </motion.div>
          </motion.div>
          <motion.div
            className="relative flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart(true)}
          >
            <Link to="/user/chats">
              <Bell size={20} className=" mr-4  text-gray-700" />

              <motion.div
                className="absolute -top-2 left-4 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {unreadMessages || "0"}
              </motion.div>
            </Link>
          </motion.div>

          {/* User profile */}
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center">
              <motion.div
                onClick={() => navigate("/profile")}
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
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </button>
                  {role === "seller" && (
                    <button
                      onClick={() => navigate("/seller/dashboard")}
                      className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Seller Dashboard
                    </button>
                  )}
                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Admin Dashboard
                    </button>
                  )}

                  <Link
                    className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    to="/myorders"
                  >
                    My Orders
                  </Link>
                  <Link
                    className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    to="/user/chats"
                  >
                    Chats
                  </Link>
                  <Link
                    className="px-4 py-2 block w-full text-sm text-left text-gray-700 hover:bg-gray-100 cursor-pointer"
                    to="/orderDisputes"
                  >
                    Order Disputes
                  </Link>
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

        {/* Mobile Navigation Icons */}
        <div className="flex md:hidden items-center space-x-3">
          {/* Mobile Wishlist */}
          <motion.div
            className="relative cursor-pointer p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWishlist(true)}
          >
            <Heart size={20} className="text-gray-700" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {wishlistCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Cart */}
          <motion.div
            className="relative cursor-pointer p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart(true)}
          >
            <ShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {cartCount}
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Notifications */}
          <motion.div
            className="relative cursor-pointer p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/user/chats">
              <Bell size={20} className="text-gray-700" />
              {unreadMessages > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-[#e06449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {unreadMessages}
                </motion.div>
              )}
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="p-2 cursor-pointer mobile-menu-container"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} className="text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} className="text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-30 mobile-menu-container"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 border-t border-gray-100">
              {/* Mobile Toggle - Added to mobile menu */}
              <div className="mb-4 pb-3 border-b border-gray-100">
                <motion.div
                  className="flex items-center bg-gray-100 rounded-full p-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={() => {
                      handleToggle();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      !isSellerSide
                        ? "bg-white text-[#e06449] shadow-sm"
                        : "text-gray-600"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buyer
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      handleToggle();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isSellerSide
                        ? "bg-white text-[#e06449] shadow-sm"
                        : "text-gray-600"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Seller
                  </motion.button>
                </motion.div>
              </div>

              {/* Mobile User Section */}
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {userName || "User"}
                  </div>
                  <div className="text-xs text-gray-500">Welcome back!</div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <motion.div className="space-y-1">
                <motion.button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm text-gray-700">Profile</span>
                  <ChevronDown size={16} className="text-gray-400 rotate-270" />
                </motion.button>

                {role === "seller" && (
                  <motion.button
                    onClick={() => {
                      navigate("/seller/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm text-gray-700">
                      Seller Dashboard
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-gray-400 rotate-270"
                    />
                  </motion.button>
                )}

                {role === "admin" && (
                  <motion.button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm text-gray-700">
                      Admin Dashboard
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-gray-400 rotate-270"
                    />
                  </motion.button>
                )}

                <motion.div
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/myorders");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="text-sm text-gray-700">My Orders</span>
                  <ChevronDown size={16} className="text-gray-400 rotate-270" />
                </motion.div>

                <motion.div
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/user/chats");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="text-sm text-gray-700">Chats</span>
                  <ChevronDown size={16} className="text-gray-400 rotate-270" />
                </motion.div>

                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-red-50 cursor-pointer"
                  whileHover={{ backgroundColor: "#fef2f2" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm text-red-600">Sign out</span>
                  <ChevronDown size={16} className="text-red-400 rotate-270" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

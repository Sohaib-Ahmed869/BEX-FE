import { ShoppingCart, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiMoneyWithdraw, BiPieChartAlt } from "react-icons/bi";
import { RiHome7Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { BsExclamationCircleFill } from "react-icons/bs";
import logo from "../../assets/logo.png";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGlobalSocket from "../../hooks/MessageSocketHook";

export default function SideBar() {
  // useGlobalSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const unreadMessagesCount = useSelector(
    (state) => state.unreadMessages.totalUnreadCount
  );
  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close mobile menu when screen becomes desktop size
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define the menu items with routes instead of components
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <RiHome7Fill size={24} />,
      path: "/seller/dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <BiPieChartAlt size={24} />,
      path: "/seller/product-list",
      childPaths: [
        "/seller/product-list/new",
        "/seller/product-list/edit/",
        "/seller/product-list/view/",
      ],
    },
    {
      id: "product-list",
      label: "Product List",
      icon: <MdOutlineInventory2 size={24} />,
      path: "/seller/listing",
      childPaths: [
        "/seller/listing/inventory/",
        "/seller/listing/addInventory/",
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={24} />,
      path: "/seller/orders",
      childPaths: ["/seller/orders/items/", "/seller/orders/items/view"],
    },
  ];

  const generalItems = [
    {
      id: "messages",
      label: "Messages",
      icon: (
        <span className="relative">
          <MessageSquare size={24} />
          {unreadMessagesCount > 0 && (
            <span
              className={`absolute top-[-10px] left-4 w-6 h-6 animate-bounce rounded-full flex items-center justify-center text-xs ${
                window.location.pathname === "/seller/chats"
                  ? "bg-gray-100 text-black "
                  : "bg-[#f47459] text-white"
              }`}
            >
              {unreadMessagesCount}
            </span>
          )}
        </span>
      ),
      path: "/seller/chats",
    },
    {
      id: "stripe-connect",
      label: "Stripe Onboarding",
      icon: <BiMoneyWithdraw size={24} />,
      path: "/seller/onboarding",
    },
    // {
    //   id: "support",
    //   label: "Support",
    //   icon: <BsExclamationCircleFill size={23} />,
    //   path: "/seller/support",
    // },
  ];

  // Helper function to check if a path is active
  const isActive = (path) => {
    // Check if the current path matches exactly
    if (location.pathname === path) {
      return true;
    }

    // Find the menu item that matches this path
    const menuItem = menuItems.find((item) => item.path === path);

    // If the menu item has childPaths, check if the current location matches any of them
    if (menuItem && menuItem.childPaths) {
      return menuItem.childPaths.some((childPath) => {
        // For exact path matches
        if (location.pathname === childPath) {
          return true;
        }

        // For paths that are base paths followed by IDs (like "/product-list/edit/123")
        // Check if the current path starts with the child path
        if (
          childPath.endsWith("/") &&
          location.pathname.startsWith(childPath)
        ) {
          return true;
        }

        return false;
      });
    }

    // Check if it's a general item
    return false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex-shrink-0">
        <Link to={"/products"}>
          <img src={logo} alt="Logo" width={100} height={100} />
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Main Menu */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">
            Main Menu
          </div>
          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex text-nowrap block items-center w-full px-5 py-4 mb-1 rounded-xl text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-[#F47458] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.path)
                      ? "bg-[#F47458] text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* General Menu */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-4">General</div>
          <nav>
            {generalItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center w-full px-5 py-4 mb-1 rounded-xl text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-[#F47458] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.path)
                      ? "bg-[#F47458] text-white"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 flex-shrink-0 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full cursor-pointer px-5 py-4 rounded-xl text-left text-gray-400 hover:bg-[#F47458] hover:text-white transition-colors"
        >
          <span className="mr-3">
            <LogOut size={20} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          transition={Bounce}
          newestOnTop={true}
        />

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Mobile Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isMobile ? "fixed" : "relative"}
            ${isMobile ? "w-80" : "w-1/5 lg:w-1/5"}
            ${isMobile ? "h-full" : "h-screen"}
            ${isMobile ? "z-50" : "z-10"}
            ${
              isMobile && !isMobileMenuOpen
                ? "-translate-x-full"
                : "translate-x-0"
            }
            bg-white shadow-2xl pl-8 pt-8 pr-8 lg:pr-[45px] flex flex-col
            transition-transform duration-300 ease-in-out
          `}
        >
          <SidebarContent />
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 overflow-auto h-full ${isMobile ? "w-full" : ""}`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

import {
  ShoppingCart,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiMoney, BiPieChartAlt } from "react-icons/bi";
import { RiHome7Fill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { BsExclamationCircleFill } from "react-icons/bs";
import logo from "../../../assets/logo.png";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
const URL = import.meta.env.VITE_REACT_BACKEND_URL;

const API_BASE_URL = `${URL}/api/admin/userpermission`;

export default function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userPermissions, setUserPermissions] = useState(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

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

  // Fetch user permissions on component mount
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("User ID not found. Please login again.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user permissions");
        }

        const data = await response.json();
        if (data.success) {
          setUserPermissions(data.data.permissions);
        } else {
          throw new Error(data.message || "Failed to fetch permissions");
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        toast.error("Failed to load user permissions");
        // Set default permissions if fetch fails
        setUserPermissions({
          dashboard: true,
          users: false,
          orders: false,
          product_list: false,
          commission: false,
          disputes: false,
          settings: false,
        });
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchUserPermissions();
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define the menu items with routes and permission keys
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <RiHome7Fill size={24} />,
      path: "/admin/dashboard",
      permissionKey: "dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: <User size={24} />,
      path: "/admin/users",
      childPaths: ["/admin/users/insights/"],
      permissionKey: "users",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart size={24} />,
      path: "/admin/orders",
      childPaths: ["/admin/orders/orderItems/"],
      permissionKey: "orders",
    },
    {
      id: "product-list",
      label: "Product List",
      icon: <MdOutlineInventory2 size={24} />,
      path: "/admin/products",
      childPaths: ["/admin/products/view/"],
      permissionKey: "product_list",
    },
    {
      id: "commission",
      label: "Commission",
      icon: <BiMoney size={24} />,
      path: "/admin/commission",
      childPaths: [],
      permissionKey: "commission",
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: <BiPieChartAlt size={24} />,
      path: "/admin/disputes",
      childPaths: [],
      permissionKey: "disputes",
    },
  ];

  const allGeneralItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <IoSettingsSharp size={24} />,
      path: "/admin/settings",
      permissionKey: "settings",
    },
  ];

  // Filter menu items based on user permissions
  const menuItems = userPermissions
    ? allMenuItems.filter(
        (item) => userPermissions[item.permissionKey] === true
      )
    : [];

  const generalItems = userPermissions
    ? allGeneralItems.filter(
        (item) => userPermissions[item.permissionKey] === true
      )
    : [];

  // Helper function to check if a path is active
  const isActive = (path) => {
    // Check if the current path matches exactly
    if (location.pathname === path) {
      return true;
    }

    // Find the menu item that matches this path
    const menuItem = allMenuItems.find((item) => item.path === path);

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
        {/* Loading state */}
        {isLoadingPermissions && (
          <div className="p-4 text-center text-gray-500">
            Loading permissions...
          </div>
        )}

        {/* Main Menu */}
        {!isLoadingPermissions && menuItems.length > 0 && (
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
        )}

        {/* General Menu */}
        {!isLoadingPermissions && generalItems.length > 0 && (
          <div className="p-4">
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
        )}

        {/* No permissions message */}
        {!isLoadingPermissions &&
          menuItems.length === 0 &&
          generalItems.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <BsExclamationCircleFill
                size={48}
                className="mx-auto mb-4 text-gray-300"
              />
              <p>No menu items available.</p>
              <p className="text-sm">Contact your administrator for access.</p>
            </div>
          )}
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
